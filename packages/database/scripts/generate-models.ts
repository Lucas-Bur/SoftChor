import fs from 'node:fs'
import path from 'node:path'
import { Project, SyntaxKind } from 'ts-morph'

interface TableInfo {
  varName: string
  tableName: string
  columns: {
    name: string
    type: string
    notNull: boolean
    unique: boolean
    default: boolean
    primaryKey: boolean
  }[]
}

const project = new Project({
  tsConfigFilePath: './tsconfig.json',
})

// Load schema files from the schema directory
const schemaDir = path.join(process.cwd(), 'src/schema')
const files = fs
  .readdirSync(schemaDir)
  .filter(f => f.endsWith('.ts') && f !== 'index.ts')
  .map(f => path.join(schemaDir, f))

const sourceFiles = project.addSourceFilesAtPaths(files)

// Find all pgTable calls
const tables: TableInfo[] = sourceFiles.flatMap(sourceFile =>
  sourceFile
    .getVariableDeclarations()
    .filter(decl => decl.getInitializer()?.getText().includes('pgTable'))
    .map(decl => {
      const name = decl.getName()
      const initializer = decl.getInitializer()
      const init = initializer?.asKind(SyntaxKind.CallExpression)

      if (!init) return null

      // Table name: pgTable('users_table', ...)
      const tableName = init.getArguments()[0]?.getText().replace(/['"]/g, '') ?? ''

      // Parse columns object
      const columnsObj = init.getArguments()[1]

      const columns =
        columnsObj?.getChildrenOfKind(SyntaxKind.PropertyAssignment).map(prop => {
          const colName = prop.getChildAtIndex(0)?.getText() ?? ''
          const methodChain = prop.getChildAtIndex(2)?.getText() ?? ''

          // Parse method chain: serial('id').primaryKey().notNull()
          const isNotNull = methodChain.includes('.notNull()')
          const isUnique = methodChain.includes('.unique()')
          const hasDefault = methodChain.includes('.default')
          const isPrimaryKey = methodChain.includes('.primaryKey()')

          // Extract type: serial, text, integer, boolean, timestamp, uuid, varchar, bigint
          const typeMatch = methodChain.match(
            /^(serial|text|integer|boolean|timestamp|uuid|varchar|bigint)/
          )
          const drizzleType = typeMatch?.[1] ?? 'text'

          return {
            name: colName,
            type: drizzleType,
            notNull: isNotNull ?? isPrimaryKey,
            unique: isUnique,
            default: hasDefault,
            primaryKey: isPrimaryKey,
          }
        }) ?? []

      return { varName: name, tableName, columns }
    })
    .filter((table): table is TableInfo => table !== null)
)

// Generate Python code
const pythonCode = generatePython(tables)

// Output to the database package's generated directory
const outputPath = path.join(process.cwd(), 'generated/models.py')
fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, pythonCode)

console.log('✓ Generated generated/models.py')

function generatePython(t: TableInfo[]) {
  const models = t
    .map(table => {
      const className = toPascalCase(table.varName)
      const fields = table.columns
        .map(col => {
          const pyType = mapToPython(col.type)
          const optionality = col.notNull ? pyType : `Optional[${pyType}]`
          const defaultVal = col.default ? ' = None' : col.primaryKey ? ' = None' : ''

          return `    ${col.name}: ${optionality}${defaultVal}`
        })
        .join('\n')

      return `class ${className}(BaseModel):
${fields}

    class Config:
        from_attributes = True`
    })
    .join('\n\n')

  return `from pydantic import BaseModel
from typing import Optional

${models}
`
}

function mapToPython(type: string): string {
  return (
    {
      serial: 'int',
      text: 'str',
      integer: 'int',
      boolean: 'bool',
      timestamp: 'str',
      uuid: 'str',
      varchar: 'str',
      bigint: 'int',
    }[type] ?? 'str'
  )
}

function toPascalCase(str: string): string {
  return str
    .replace(/(_|^)([a-z])/g, (_, _sep, char: string) => char.toUpperCase())
    .replace(/Table$/, '')
}
