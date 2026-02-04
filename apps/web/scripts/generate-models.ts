import fs from 'node:fs'
import path from 'node:path'
import { Project, SyntaxKind } from 'ts-morph'

const project = new Project({
  tsConfigFilePath: './tsconfig.json',
})

// Deine Schema-Dateien laden
const schemaDir = path.join(process.cwd(), "src/db/schema")
const files = fs
  .readdirSync(schemaDir)
  .filter((f) => f.endsWith(".ts") 
  && f !== "index.ts"
)
  .map((f) => path.join(schemaDir, f))

const sourceFiles = project.addSourceFilesAtPaths(files)

// Alle pgTable Calls finden
const tables = sourceFiles.flatMap(sourceFile => 
sourceFile
  .getVariableDeclarations()
  .filter((decl) => decl.getInitializer()?.getText().includes('pgTable'))
  .map((decl) => {
    const name = decl.getName()
    const init = decl.getInitializer()!.asKind(SyntaxKind.CallExpression)

    // Tabellennname: pgTable('users_table', ...)
    const tableName = init?.getArguments()[0]?.getText().replace(/['"]/g, '')

    // Columns-Objekt parsen
    const columnsObj = init?.getArguments()[1]

    const columns =
      columnsObj
        ?.getChildrenOfKind(SyntaxKind.PropertyAssignment)
        .map((prop) => {
          const colName = prop.getChildAtIndex(0)?.getText() || ''
          const methodChain = prop.getChildAtIndex(2)?.getText() || ''

          // Parse method chain: serial('id').primaryKey().notNull()
          const isNotNull = methodChain.includes('.notNull()')
          const isUnique = methodChain.includes('.unique()')
          const hasDefault = methodChain.includes('.default')
          const isPrimaryKey = methodChain.includes('.primaryKey()')

          // Typ rausfinden: serial, text, integer, boolean, timestamp
          const typeMatch = methodChain.match(
            /^(serial|text|integer|boolean|timestamp)/,
          )
          const drizzleType = typeMatch?.[1] || 'text'

          return {
            name: colName,
            type: drizzleType,
            notNull: isNotNull || isPrimaryKey,
            unique: isUnique,
            default: hasDefault,
            primaryKey: isPrimaryKey,
          }
        }) || []

    return { varName: name, tableName, columns }
  })
)

// Python generieren
const pythonCode = generatePython(tables)

const outputPath = path.join(process.cwd(), 'python/models.py')
fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, pythonCode)

console.log('✓ Generated python/models.py')

function generatePython(t: typeof tables) {
  const models = t
    .map((table) => {
      const className = toPascalCase(table.varName)
      const fields = table.columns
        .map((col) => {
          const pyType = mapToPython(col.type)
          const optionality = col.notNull ? pyType : `Optional[${pyType}]`
          const defaultVal = col.default
            ? ' = None'
            : col.primaryKey
              ? ' = None'
              : ''

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
    }[type] || 'str'
  )
}

function toPascalCase(str: string) {
  return str
    .replace(/(_|^)([a-z])/g, (_, __, c) => c.toUpperCase())
    .replace(/Table$/, '')
}
