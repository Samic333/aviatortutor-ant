# Data Migration Plan (PostgreSQL to MySQL)

This document outlines the schema transformation and data mapping from the original AviatorTutor PostgreSQL database to the new MySQL-based architecture.

## Table Mappings

| PostgreSQL Table | MySQL Table | Changes / Notes |
| :--- | :--- | :--- |
| `User` | `users` | Role-based enum preserved. Passwords use `BCRYPT`. |
| `InstructorProfile` | `instructor_profiles` | `yearsOfExperience` (Int) preserved. Rating (Float) preserved. |
| `StudentProfile` | `student_profiles` | Simplified to link to `users`. |
| `Class` | `classes` | Array fields in PG mapped to `JSON` column in MySQL for tag/authority filtering. |
| `Booking` | `bookings` | UUIDs replaced with custom string IDs (`v_...`). Statuses preserved (PENDING, CONFIRMED, COMPLETED). |
| `ClassSession` | `class_sessions` | Tracks Zoom URLs and scheduling. |
| `SupportTicket` | `support_tickets` | Tracks user disputes and inquiries. |
| `Account` / `Session` | N/A | Replaced by PHP internal session handling and native session storage. |

## Structural Improvements

1. **Foreign Key Strategy**:
    - All relationships use explicit `FOREIGN KEY` constraints in MySQL with `ON DELETE CASCADE` where appropriate (e.g., profiles deletion when user is deleted).
    - Use `VARCHAR(36)` or `VARCHAR(20)` for primary keys to support flexible ID schemes.

2. **Temporal Tracking**:
    - Every table includes `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP` and `updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`.

3. **Performance Optimization**:
    - B-Tree indexes added to:
        - `users.email` (Unique)
        - `classes.instructor_id`
        - `bookings.student_id` / `bookings.class_id`
        - `bookings.scheduled_time`

4. **Data Type Adaptations**:
    - `TEXT` (PG) → `TEXT` or `LONGTEXT` (MySQL).
    - `UUID` (PG) → `VARCHAR(48)` (MySQL) for compatibility with prefixing.
    - `JSONB` (PG) → `JSON` (MySQL 8.0+).

## Data Integrity Rules
- **Encrypted Content**: No sensitive data is stored in plain text (except for strictly necessary metadata).
- **Referential Integrity**: Ensured via InnoDB engine.
- **Atomic Operations**: All multi-table updates (e.g., registration) wrapped in `START TRANSACTION`.

---
*Generated: 2026-04-01*
