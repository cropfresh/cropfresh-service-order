# CropFresh Service - Order Management

Order Management microservice for the CropFresh AgriTech platform.

## Tech Stack

- Node.js 24.11.1 LTS
- Express 5.1.0
- TypeScript 5.7
- Prisma ORM 7.0
- gRPC 1.12
- Pino 9.5 (structured logging)

## Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Initialize Prisma
npx prisma migrate dev

```

## Development

```bash
# Run in development mode with hot reload
npm run dev
```

Server runs on http://localhost:3003

## Build

```bash
# Compile TypeScript
npm run build

# Run production build
npm start
```

## Project Structure

```
src/
â”œâ”€â”€ controllers/    # HTTP request handlers
â”œâ”€â”€ services/       # Business logic
â”œâ”€â”€ repositories/   # Data access layer
â”œâ”€â”€ models/         # Data models
â”œâ”€â”€ middleware/     # Express middleware
â”œâ”€â”€ config/         # Configuration
â”œâ”€â”€ grpc/           # gRPC service implementations
â””â”€â”€ index.ts        # Application entry point
```

## API Endpoints

- `GET /health` - Health check
- `GET /` - Service information

## gRPC

Proto definitions in `protos/` (Git submodule)

## Documentation

- [Architecture](../../docs/architecture.md)
- [Epic 1: Foundation \u0026 Infrastructure](../../docs/epics/epic-1-foundation.md)
