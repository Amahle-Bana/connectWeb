# Restoring email OTP (signup / login)

OTP is **turned off** in the backend and frontends so users can sign up and log in with email and password only. The OTP code paths are preserved (mostly under `if False:` in Django, or commented in React) so you can turn the flow back on without rewriting from scratch.

## What OTP did

1. **Signup (`POST /somaapp/signup/`)**  
   Created the user, sent a 6-digit code by email, and required **`POST /somaapp/verify-otp/`** before issuing a JWT.

2. **Login (`POST /somaapp/login/`)**  
   Validated password, sent an OTP, and required **`POST /somaapp/verify-otp/`** before issuing a JWT (response used `otp_required: true`).

3. **User profile (`GET /somaapp/user/`)**  
   Refused requests if `is_email_verified` was false (OTP enforced verification).

4. **Frontends**  
   After login/signup, users were sent to `/authentication/otp` (web) or `/authentication/otp` (dashboard) to enter the code; `auth-context` exposed `verifyOTP` and `resendOTP`.

## Backend (`connectBackend/somaapp/views.py`)

1. **`_issue_jwt_auth_response`**  
   Used for **direct** JWT after signup/login while OTP is off. When re-enabling OTP, signup and login should **not** call this until after OTP verification (or only for a separate “magic link” flow you design).

2. **`SignUpUser.post`**
   - **Resend branch** (`is_resend`): Currently short-circuits with 400. Restore by removing the early `return Response(...)` and setting `if False:` → `if True:` (or delete the `if False` wrapper) around the old `create_and_send_otp` block.
   - **New signup**: Restore by wrapping the **OTP** block in `if True:` and removing or guarding the block that sets `is_email_verified`, issues JWT via `_issue_jwt_auth_response`, etc., so new users stay unverified until `VerifyOTP` succeeds.

3. **`LoginUser.post`**
   - Restore OTP by removing `_issue_jwt_auth_response` + `last_login` / `is_email_verified` updates from the main path.
   - Set `if False:` → `if True:` around the `create_and_send_otp` block that returns `otp_required: true`.

4. **`VerifyOTP.post`**
   - Replace `if False:` with `if True:` (or remove the guard) so the original implementation runs again.
   - Remove or adjust the `501 NOT IMPLEMENTED` response at the end.

5. **`UserView.get`**
   - Restore enforcement by setting `if False:` → `if True:` around the block that raises `AuthenticationFailed` when `is_email_verified` is false (or remove the outer `if False`).

6. **Email delivery**  
   Configure `RESEND_API_KEY` / `RESEND_FROM_EMAIL` or Django email in `.env` (see `somaapp/utilities/otp_utils.py`).

## Backend utilities

- **`somaapp/utilities/otp_utils.py`** — Still contains `generate_otp`, `send_otp_email`, `create_and_send_otp`, `verify_otp`. No change required when restoring if `views.py` calls them again.

## Web app (`connectWeb`)

1. **`context/auth-context.tsx`**
   - **Login**: Uncomment the `content.otp_required` branch; ensure the `content.jwt` branch does **not** run on the first login step when OTP is on (backend will not send JWT until after OTP).
   - **Signup**: Remove or guard `if (content.jwt)` localStorage handling if signup no longer returns JWT until verification.

2. **`components/login-authentication-page/login-form.tsx`**  
   Uncomment the redirect to `/authentication/otp?...&mode=login` when `result.otpRequired` is true; keep `refreshUserData()` + `/home` for the non-OTP success path only if you still support password-only login alongside OTP.

3. **`components/signup-authentication-page/signup-form.tsx`**  
   Uncomment redirect to `/authentication/otp?email=...` after signup; remove or adjust `refreshUserData()` + `/home` until after OTP verification.

4. **`app/authentication/otp/page.tsx`**  
   Restore the full OTP UI (6-digit input, verify, resend). Use **git history** for the last version before this file was replaced with a redirect, or rebuild from the flow described above.

## Dashboard (`connectDashboard`)

1. **`context/auth-context.tsx`** — Same pattern as web for `login` / `signup` / `verifyOTP` / `resendOTP`.
2. **`components/login-authentication-page/login-form.tsx`** — Uncomment OTP redirect when `otpRequired` is true.
3. **`app/authentication/otp/page.tsx`** — Restore full OTP page from git history.

## Environment variables (reference)

- `NEXT_PUBLIC_VERIFY_OTP`, `NEXT_PUBLIC_RESEND_OTP` (if used) — base URL for OTP endpoints.
- Backend: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `DEFAULT_FROM_EMAIL`, `FRONTEND_URL` (used in OTP email HTML).

## Quick checklist

- [ ] Re-enable OTP branches in `views.py` (signup, login, verify, user gate, resend).
- [ ] Confirm email sending works (Resend or SMTP).
- [ ] Restore web/dashboard `auth-context` and forms to use `otp_required` and OTP routes.
- [ ] Restore OTP pages from git.
- [ ] Test: signup → verify email → JWT → `/user/` → home/dashboard.
- [ ] Test: login → OTP → JWT → protected routes.

## Git history

The safest source for the exact previous React OTP pages and any missed snippets is:

```bash
git log --oneline -- connectWeb/app/authentication/otp/page.tsx
git show <commit>:app/authentication/otp/page.tsx
```

(Use the same idea for dashboard paths under `connectDashboard`.)
