# AviatorTutor - PHP / MySQL Edition

A professional, production-ready flight training platform migrated from Next.js to PHP 8.2+. Designed for standard cPanel/Shared hosting environments.

## Features
- **Public Search**: Find aviation classes and instructors with advanced filters.
- **Role-Based Portals**:
    - **Students**: Dashboard, class bookings, progress tracking.
    - **Instructors**: Dashboard, class management, earnings overview, profile management.
    - **Admin**: Platform metrics, user review, and moderation tools.
- **Integrations**: 
    - **Stripe**: One-button checkout for class sessions.
    - **Zoom**: Automatic meeting link generation (Placeholder).
- **Architecture**:
    - Vanilla PHP 8.2+ (No Composer required for core runtime).
    - PDO Database Singleton with prepared statements.
    - Session-based Authentication with CSRF protection.
    - Tailwind CSS (CDN) + Lucide Icons (CDN) for premium UI.

## Directory Structure
- `app/`: Core libraries (Auth, Database), action handlers, and services.
- `config/`: Configuration files and secret definitions.
- `database/`: SQL schema and seed files for MySQL/MariaDB.
- `public/`: Web root containing `index.php`, `.htaccess`, and assets.
- `views/`: Layouts, partials, and page views.

## Quick Start
1.  **Database**: Import `database/schema.sql` and `database/seeds.sql` into your MySQL database.
2.  **Config**: Update `config/config.php` with your database credentials and Stripe keys.
3.  **Deploy**: Upload the contents of this repository to your web root (e.g., `public_html`).
4.  **PHP Version**: Ensure your host is running PHP 8.2 or higher.

## License
Proprietary - AviatorTutor.com
