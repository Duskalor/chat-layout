# Prisma Backend Specification

## Purpose

This specification defines the requirements for connecting the backend to use Prisma database instead of in-memory mock data, enabling persistent data storage for authentication and chat functionality.

## Scope

- Database connection initialization via Prisma
- Configuration requirements for DATABASE_URL
- Authentication service integration with Prisma
- Chat service integration with Prisma

## Related Specifications

- [backend/spec.md](backend/spec.md) - Detailed backend database integration requirements

## Requirements Summary

### Database Connection

- The backend MUST establish a database connection on startup
- The system SHALL call `connectDatabase()` before starting the HTTP server
- DATABASE_URL MUST be documented in `.env.example`

### Service Integration

- auth.service.ts MUST query user data from Prisma
- chat.service.ts MUST query chat and message data from Prisma
- All mock data arrays SHALL be removed from service files

### Configuration

- `.env.example` SHALL include `DATABASE_URL` with a placeholder
