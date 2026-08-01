# MollieChat UI white-label invariants

The application keeps the upstream runtime contracts intact while presenting only the MollieChat product identity in user-facing surfaces.

## Preserved contracts

- Existing application routes and URL structure
- API endpoints and payloads
- Database collections, setting IDs, and migrations
- Internal package names and imports
- Authentication, messaging, calls, files, integrations, and administration flows

## Branded surfaces

- Browser title and application metadata
- Login and registration attribution
- Workspace name exposed through the UI settings context
- Main light and dark wordmarks
- Application icon and live-chat attribution
- Translated user-facing product copy across supported locales

Changes must remain presentation-only. Do not rename internal `@rocket.chat/*` packages, REST/DDP paths, MongoDB keys, service identifiers, or environment variables.
