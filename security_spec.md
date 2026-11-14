# Security Specification & Hardened Rules Plan

## 1. Data Invariants
1. **Inquiries (`/inquiries/{inquiryId}`)**:
   - Contains Personally Identifiable Information (PII): `name`, `email`, `phone`, `message`.
   - Public visitors can ONLY `create` new inquiries with strict schema validation, `status == 'new'`, and `createdAt == request.time`, `updatedAt == request.time`.
   - Public visitors and non-admin signed-in users CANNOT `get`, `list`, `update`, or `delete` any inquiry.
   - Only the verified admin (`aayanmalik3114@gmail.com` with `email_verified == true`) can `get`, `list`, `update` (status/updatedAt only, keeping original fields immutable), and `delete` inquiries.
2. **Site Visits (`/visits/{visitId}`)**:
   - Tracks who checks the website (device, browser, OS, screen, timezone, referrer, path).
   - Public visitors can ONLY `create` a visit log with strict schema validation and `createdAt == request.time`.
   - Public visitors CANNOT `get`, `list`, `update`, or `delete` visit logs.
   - Only the verified admin can `get`, `list`, and `delete` visit logs.
3. **Visit Events (`/visitEvents/{eventId}`)**:
   - Tracks which sections or services a visitor checked during a session.
   - Public visitors can ONLY `create` an event log with strict schema validation (`eventType` enum, bounded strings, `createdAt == request.time`).
   - Public visitors CANNOT `get`, `list`, `update`, or `delete` visit events.
   - Only the verified admin can `get`, `list`, and `delete` visit events.

## 2. Dirty Dozen Attack Payloads (All Must Return PERMISSION_DENIED)
1. **PII Scraping**: Unauthenticated or non-admin `get` or `list` on `/inquiries`.
2. **Visitor Log Scraping**: Unauthenticated or non-admin `get` or `list` on `/visits` or `/visitEvents`.
3. **Spoofed Admin Email**: Signed-in user with `email == 'aayanmalik3114@gmail.com'` and `email_verified == false` attempting `list` on `/inquiries`.
4. **Shadow Field Injection**: `create` on `/inquiries/{id}` including an extra ghost field `isAdmin: true`.
5. **Status Forgery on Create**: `create` on `/inquiries/{id}` with `status: 'replied'` instead of `'new'`.
6. **Client Timestamp Forgery**: `create` on `/inquiries/{id}` or `/visits/{id}` with a backdated `createdAt` != `request.time`.
7. **ID Poisoning**: `create` on `/inquiries/{veryLongInvalidId}` containing spaces or >128 chars.
8. **Denial-of-Wallet Payload**: `create` on `/inquiries/{id}` with `message` > 3000 chars.
9. **Immutable Field Overwrite**: Admin `update` on `/inquiries/{id}` attempting to alter `createdAt` or `email`.
10. **Non-Admin Update/Delete**: Unauthenticated or non-admin user attempting `update` or `delete` on `/inquiries/{id}` or `/visits/{id}`.
11. **Invalid Event Enum**: `create` on `/visitEvents/{id}` with `eventType: 'arbitrary_script'`.
12. **Unbounded Array / Type Poisoning**: `create` on `/visits/{id}` with `browser` as a number or > 80 chars.
