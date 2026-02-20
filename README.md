# TGlobal Mock API

The **TGlobal Mock API** is a mock REST backend built with **NestJS**. It serves healthcare shift-scheduling and publication data used by the React Native frontend assignment. The goal is to simulate realistic backend behavior, including CRUD operations, validation, and consistent response shaping — while remaining simple enough for local development and testing.

---

## Getting Started

### Prerequisites

You’ll need the following installed before running the project:

* **Node.js 20+**
* **PostgreSQL** — either a local instance or a hosted database connection string

---

### Installation

This project uses **pnpm** as its package manager. To install dependencies:

```bash
pnpm install
```

pnpm is preferred for its speed, efficient disk usage, and deterministic dependency resolution.

---

## Environment Variables

Before starting the app, create a `.env` file at the root of the project. For example:

```env
DATABASE_URL=postgres://user:password@localhost:5432/tglobal
NODE_ENV=development
PORT=3000
```

**DATABASE_URL** is required and should be a full PostgreSQL connection string.
**NODE_ENV** defaults to `development` if not provided.
**PORT** controls which port the server listens on (default: 3000).

---

## Running the Project

You can start the application in different modes depending on your environment:

```bash
# Development mode (auto-restarts on file changes)
pnpm start:dev

# Production mode (build first, then run)
pnpm build
pnpm start:prod

# Debug mode
pnpm start:debug
```

Once running, the API is accessible at `http://localhost:3000`, and interactive Swagger documentation is available at `http://localhost:3000/docs`.

---

### Database Migrations

For managing schema changes, the following commands are available:

```bash
# Generate a new migration based on entity changes
pnpm migration:generate -- src/migrations/MigrationName

# Run all pending migrations
pnpm migration:run

# Revert the last applied migration
pnpm migration:revert

# Show migration status
pnpm migration:show
```

During development, TypeORM runs with `synchronize: true`, which automatically applies schema updates without explicit migrations. In production, migrations run automatically (`migrationsRun: true`).

---

## API Reference

All API responses follow a consistent envelope structure for both success and failure cases.

**Example:**

```json
// Success
{ "success": true, "statusCode": 200, "data": { ... } }

// Error
{ "success": false, "statusCode": "404", "message": "Not found", "data": null }
```

### Shifts

The shifts module manages shift groups and their associated room-level details.

Endpoints include:

* `POST /shifts` — create a new shift group with nested room shifts
* `GET /shifts` — list all active shift groups
* `GET /shifts?room=X&date=YYYY-MM-DD` — filter shift groups by room and/or date
* `GET /shifts/:groupId/:roomId` — retrieve a single room shift with team details and notes
* `DELETE /shifts/:groupId` — soft-delete a shift group
* `DELETE /shifts/reset` — restore seed shift data

### Publications

The publications module handles announcements or general updates for care workers.

Endpoints include:

* `POST /publications` — create a new publication
* `GET /publications` — list summaries (excludes `content` for performance)
* `GET /publications/:id` — retrieve a single publication with full content
* `DELETE /publications/:id` — soft-delete a publication
* `DELETE /publications/reset` — restore publications to default seed data

---

## Running Tests

All tests can be run with:

```bash
pnpm test
```

Other useful commands include:

```bash
# Watch mode
pnpm test:watch

# Coverage report
pnpm test:cov

# End-to-end tests
pnpm test:e2e
```

Integration and end-to-end tests use an **in-memory SQLite database** powered by `better-sqlite3`. This means you don’t need a running PostgreSQL instance to run tests — everything happens in memory.

---

### Test Layers

There are four levels of tests:

* **Unit (services)** — tests each service method in isolation with mocked repositories
* **Unit (infrastructure)** — tests the global filters and interceptors that shape responses
* **Integration (controllers)** — verifies real controller-service interaction against an in-memory SQLite database
* **End-to-End (E2E)** — runs actual HTTP requests against a live NestJS instance using SuperTest

This layered structure ensures that both individual logic and full application flows are verified.

---

## Libraries Used

### Runtime Dependencies

This project uses several core NestJS and TypeScript libraries to handle modular structure, validation, and database operations:

* **@nestjs/common, @nestjs/core, @nestjs/platform-express** — the NestJS framework foundation, providing dependency injection, modules, controllers, and middleware.
* **@nestjs/typeorm + typeorm** — ORM layer for database access using repositories and query builders.
* **pg** — PostgreSQL driver used by TypeORM in production.
* **@nestjs/config** — loads and manages environment variables.
* **class-validator + class-transformer** — provides DTO validation and automatic data transformation.
* **@nestjs/swagger** — auto-generates the Swagger docs at `/docs` from decorators.
* **nest-winston + winston** — structured logging to console and file transports.
* **rxjs** — used in the global `ResponseInterceptor` to wrap and transform outputs reactively.
* **uuid** — generates unique IDs for entities.
* **dotenv** — loads `.env` variables in standalone scripts (like the TypeORM CLI).

### Development and Testing

* **@nestjs/testing** — provides the Nest-aware testing environment.
* **jest + ts-jest** — testing framework with TypeScript support.
* **supertest** — performs end-to-end HTTP assertions.
* **better-sqlite3** — fast, in-memory SQLite used for test databases.
* **eslint, prettier, typescript-eslint** — for linting and code formatting.
* **@nestjs/cli + @nestjs/schematics** — code generation and scaffolding.

---

## Architecture

The app follows NestJS’s modular structure, with each domain feature contained in its own module. This pattern isolates logic and makes features self-contained.

```
src/
├── app.module.ts           # Root module - connects feature modules and config
├── main.ts                 # App entry - registers global pipes, filters, interceptors
├── config/                 # TypeORM, Winston, and Swagger configurations
├── common/
│   ├── filters/            # TransformException filter - shapes error responses
│   ├── interceptors/       # ResponseInterceptor - shapes success responses
│   ├── seeds/              # Seed data functions for initial load
│   └── types/              # Shared TypeScript interfaces
└── features/
    ├── publications/       # Publications module
    └── shift/              # Shift module
```

Each feature module includes its own entity, service, controller, and DTOs, ensuring minimal coupling and easier maintenance.

---

## Key Design Principles

### Uniform Response Structure

All HTTP responses, successful or not, follow a consistent envelope format.
The `ResponseInterceptor` wraps successful responses, while `TransformException` handles and reshapes thrown errors.
This ensures predictable behavior for the frontend, regardless of success or failure.

### Automatic Database Seeding

Each service uses the `OnModuleInit` lifecycle hook. When initialized, it checks if its corresponding table is empty. If so, it inserts seed data stored under `src/common/seeds/`. This ensures that local development always starts with usable sample data.

### Soft Deletion

Instead of removing records permanently, `DELETE` routes mark entries as inactive (`isActive = false`). This keeps historical data recoverable while presenting only active records to clients. Reset endpoints restore the original seed data.

### Privacy by Design

The shift list endpoint hides sensitive team information such as notes. These are only exposed through the detailed endpoint `/shifts/:groupId/:roomId`, which intentionally returns the full entity.

### Validation and Transformation

The global `ValidationPipe` is configured with `whitelist: true` and `transform: true`:

* `whitelist` strips out any properties not defined in DTOs.
* `transform` converts plain JSON into typed DTO instances, allowing the use of decorators like `@IsString()` or `@ValidateNested()` effectively.

---

## Implementation Notes

### SQLite in Tests vs PostgreSQL in Production

Although production uses PostgreSQL types like `jsonb` and `timestamptz`, TypeORM maps these types automatically when running under SQLite. This allows the same entity definitions to work seamlessly in both environments.

### Jest and Module Compatibility

The project compiles using `module: nodenext`, but Jest runs in CommonJS mode. Jest’s TypeScript config overrides ensure compatibility without changing the production build output.

### Route Ordering for Reset Endpoints

In the shift controller, the `/reset` routes are declared before parameterized routes like `/:groupId`. This prevents NestJS from interpreting "reset" as a group ID string.

### Logging

Logs are written by Winston to a `/logs` directory created automatically at runtime:

* `app.log` contains all messages
* `success.log` records only `info` level messages
* `error.log` records only `error` messages

In production, only warnings and above are logged to avoid noise.

### Migration History

Three key migrations define schema evolution:

1. Initial creation of publications and shift tables.
2. Relocation of the `color` field from group to room level.
3. Addition of `imageUrl` and upgrade of `team` column from text to JSONB.

---

## Summary

TGlobal Mock API is designed as a realistic yet lightweight backend for a healthcare shift management app. It demonstrates structured NestJS practices modular design, TypeORM integration, soft-deletion patterns, layered testing, and consistent response shaping. The use of pnpm, automated seeding, and a clear architecture makes it both fast to set up and easy to maintain.
