# Features-Ordner im Projekt

## Überblick

Der `features/`-Ordner organisiert die Geschäftslogik und Funktionalität eines Projekts nach thematischen Features. Dies ermöglicht bessere Wartbarkeit, Skalierbarkeit und klare Verantwortlichkeiten.

## Typische Struktur

```
features/
├── user-auth/
│   ├── services/
│   ├── components/
│   ├── hooks/
│   ├── types/
│   └── index.ts
├── dashboard/
│   ├── services/
│   ├── components/
│   ├── hooks/
│   ├── types/
│   └── index.ts
├── notifications/
│   ├── services/
│   ├── components/
│   ├── hooks/
│   ├── types/
│   └── index.ts
└── shared/
    ├── components/
    ├── hooks/
    ├── utils/
    └── types/
```

## Standard-Unterordner

| Ordner        | Zweck                                       |
| ------------- | ------------------------------------------- |
| `components/` | Feature-spezifische UI-Komponenten          |
| `services/`   | API-Calls, Business-Logik, externe Services |
| `hooks/`      | Custom React Hooks (falls React-Projekt)    |
| `types/`      | TypeScript Interfaces und Types             |
| `utils/`      | Hilfs- und Utility-Funktionen               |
| `constants/`  | Feature-spezifische Konstanten              |

## Nutzungskonventionen

- **Isolation**: Jedes Feature ist weitgehend in sich geschlossen
- **Wiederverwendung**: Gemeinsame Teile in `features/shared/`
- **Imports**: Über `index.ts` exportieren für saubere Importe
- **Abhängigkeiten**: Features sollten sich nicht gegenseitig importieren (außer über shared)

## Beispiel-Export (index.ts)

```ts
export * from "./components";
export * from "./hooks";
export * from "./services";
export * from "./types";
```

## Vorteil für die Zusammenarbeit

Diese Struktur ermöglicht es mehreren Entwicklern, an verschiedenen Features parallel zu arbeiten, ohne Konflikte zu verursachen.
