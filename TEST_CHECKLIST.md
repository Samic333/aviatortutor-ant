# AviatorTutor Migration Test Checklist

This checklist defines the critical flows that must be verified to ensure 100% feature parity after the migration to PHP/MySQL.

## 1. Public Website
- [ ] Homepage loads with all sections (Hero, How it Works, Stats).
- [ ] About Page displays mission and vision.
- [ ] Contact Page form submits and redirects with success message.
- [ ] Classes Search allows filtering by Authority, Type, and Standard.
- [ ] Instructors Search allows filtering by Price and Rating.
- [ ] Class Detail Page displays full description and instructor summary.

## 2. Authentication & Authorization
- [ ] User can register as a Student.
- [ ] User can register as an Instructor (defaults to `pending_approval = TRUE`).
- [ ] Login works for all 3 roles (Student, Instructor, Admin).
- [ ] Logout clears the session and redirects to Home.
- [ ] Role-based Access Control (RBAC):
    - [ ] Student cannot access `/instructor` or `/admin`.
    - [ ] Instructor cannot access `/admin`.
    - [ ] Logged-out users cannot access any dashboard.

## 3. Student Flows
- [ ] Dashboard displays correct booking counts and profile score.
- [ ] Bookings List shows upcoming and past sessions correctly.
- [ ] Profile Page allows updating Name, Country, and Goals.
- [ ] Booking Flow:
    - [ ] Clicking "Book Now" creates a PENDING booking.
    - [ ] Redirects correctly to Stripe Checkout.

## 4. Instructor Flows
- [ ] Dashboard displays lifetime earnings and student count.
- [ ] Profile Page allows updating Bio, Experience, and Hourly Rate.
- [ ] Class Management:
    - [ ] Create New Class (Basics, Curriculum, Pricing tabs).
    - [ ] Edit Existing Class.
    - [ ] View list of created classes.

## 5. Admin Flows
- [ ] Dashboard displays platform-wide metrics (Users, Classes, Pending, Disputes).
- [ ] User Management:
    - [ ] List all users.
    - [ ] Approve pending instructors.
    - [ ] Delete users (with database integrity check).

## 6. Technical / Integrations
- [ ] Stripe Webhook correctly confirms PENDING bookings upon successful payment.
- [ ] 404 Page correctly captures unknown routes.
- [ ] All database queries use PDO prepared statements (SQL Injection check).
- [ ] All forms use session-based success/error feedback.

---
*Created: 2026-04-01*
