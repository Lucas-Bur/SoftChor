Hier ist die aktualisierte Dokumentation, die den `lib/`-Ordner als zentralen Ort für Infrastruktur-Abstraktionen (wie DB-Schemas, API-Clients oder SDK-Wrapper) integriert:

# Features-Ordner im Projekt

## Überblick

Der `features/`-Ordner organisiert die Geschäftslogik und Funktionalität eines Projekts nach thematischen Features. Dies ermöglicht bessere Wartbarkeit, Skalierbarkeit und klare Verantwortlichkeiten durch die Trennung von Infrastruktur und Business-Logik.

## Typische Struktur

```
features/
├── user-auth/
│   ├── lib/            # Infrastruktur & Drittanbieter (DB-Schema, API-Client)
│   ├── services/       # Business-Logik (nutzt lib/)
│   ├── components/
│   ├── hooks/
│   ├── types/
│   └── index.ts
├── dashboard/
│   ├── lib/
│   ├── services/
│   ├── components/
│   ├── hooks/
│   ├── types/
│   └── index.ts
└── shared/
    ├── components/
    ├── hooks/
    ├── utils/
    ├── lib/            # App-weite Basis-Konfigurationen
    └── types/
```

## Standard-Unterordner

| Ordner        | Zweck                                                                                    |
| :------------ | :--------------------------------------------------------------------------------------- |
| `lib/`        | **Infrastruktur-Layer**: Drizzle-Schemas, API-Instanzen, SDK-Initialisierungen, Adapter. |
| `services/`   | **Business-Layer**: API-Calls, Logik-Operationen; nutzt Funktionen aus `lib/`.           |
| `components/` | Feature-spezifische UI-Komponenten.                                                      |
| `hooks/`      | Custom React Hooks für feature-spezifische Zustände oder Logik.                          |
| `types/`      | TypeScript Interfaces, Enums und Typen.                                                  |
| `utils/`      | Hilfs- und Utility-Funktionen, die nur dieses Feature betreffen.                         |

## Nutzungskonventionen

- **Layering**: Komponenten und Services greifen auf `lib/` zu, um mit der Außenwelt (DB, API) zu kommunizieren.
- **Isolation**: Jedes Feature ist weitgehend in sich geschlossen.
- **Wiederverwendung**: Übergreifende Infrastruktur (z.B. Basis-Axios-Instanz) liegt in `shared/lib/`.
- **Imports**: Über `index.ts` exportieren für saubere, öffentliche Schnittstellen des Features.
- **Abhängigkeiten**: Features dürfen sich nicht gegenseitig importieren. Kommunikation erfolgt über `shared/` oder die übergeordnete `pages/`-Ebene.

## Beispiel-Export (index.ts)

```ts
export * from "./components";
export * from "./hooks";
export * from "./services";
export * from "./types";
// lib/ wird meist nicht direkt exportiert, um die Infrastruktur zu kapseln
```

## Vorteil für die Zusammenarbeit

Diese Struktur ermöglicht es mehreren Entwicklern, an verschiedenen Features parallel zu arbeiten. Durch die Kapselung der Datenbank-Schemas oder API-Clients in `lib/` innerhalb des Features werden globale Merge-Konflikte in zentralen Dateien minimiert.
