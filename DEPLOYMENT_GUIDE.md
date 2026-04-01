# AviatorTutor PHP Migration Deployment Guide

This document provides step-by-step instructions for deploying and verifying the AviatorTutor PHP 8.2+ platform.

## Prerequisites
- **Web Server**: Apache or Nginx (Apache is recommended for `.htaccess` support).
- **PHP**: 8.2 or 8.3 (Requires `pdo_mysql` and `curl` extensions).
- **Database**: MySQL 8.0 or MariaDB 10.4+.

## Step 1: Database Setup
1. Log in to your hosting control panel (e.g., cPanel).
2. Create a new MySQL database named `aviatortutor`.
3. Create a database user and assign all privileges to the new database.
4. Import the schema:
    - Open phpMyAdmin.
    - Select the new database.
    - Import `/database/schema.sql`.
5. (Optional) Import seed data:
    - Import `/database/seeds.sql` for initial testing.

## Step 2: Configuration
1. Open `/config/config.php` in a text editor.
2. Edit the following constants:
    - `DB_HOST`: Set to `localhost` or your database host.
    - `DB_NAME`: Your database name.
    - `DB_USER`: Your database username.
    - `DB_PASS`: Your database password.
    - `APP_URL`: Your production URL (e.g., `https://aviatortutor.com`).
3. (Optional but Recommended) Set up Stripe:
    - Replace the placeholder keys in `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, and `STRIPE_WEBHOOK_SECRET`.

## Step 3: Deployment
1. Upload all files (except `.git`, `node_modules`, `src`) to your web root (usually `public_html`).
2. **Standard cPanel Layout**:
    - If you are deploying to a subdirectory, update `RewriteBase` in `public/.htaccess`.
    - Point your domain's document root to the `public/` directory for security.
    - *Alternative*: Move the contents of `public/` to `public_html` and the other folders (`app/`, `config/`, etc.) to the directory above `public_html` for maximum security. Then, update the `require_once` paths in `index.php`.

## Step 4: Verification Checklist
1. **Home Page**: Visit `APP_URL`. You should see the hero section and previews.
2. **Search**: Go to `/classes`. Ensure you can search and filter.
3. **Authentication**: Register a new user and log in.
4. **Dashboards**: Access `/student` or `/instructor` based on your role.
5. **Booking**: Try booking a class to verify the Stripe redirect.

## Troubleshooting
- **404 Errors**: Ensure `mod_rewrite` is enabled on your server and `.htaccess` is present in the document root.
- **Database Errors**: Check the database credentials in `config/config.php` and ensure the `aviatortutor` database contains all tables from the schema.
- **Empty Pages**: Ensure `display_errors` is off in production but check the server's `error_log` for PHP issues.
