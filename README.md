# my-user-hub

A React + TypeScript application built with Vite featuring authentication flows and a full Users CRUD table with server-side pagination.

🔗 **Live Demo:** [https://my-user-hub.netlify.app/auth/login](https://my-user-hub.netlify.app/auth/login)

---

## Tech Stack

| Category | Library |
|---|---|
| Framework | React 19 + Vite |
| Language | TypeScript |
| Routing | TanStack Router (file-based) |
| Data Fetching | TanStack Query v5 |
| Form Management | TanStack Form |
| Validation | Zod (Standard Schema — no adapter needed) |
| UI Components | HeroUI v3 |
| Styling | Tailwind CSS v4 |
| API | MockAPI.io |

---

## Features

### Auth
- Login page (`/auth/login`)
- Register page (`/auth/register`)
- Fields: Name (register only), Email, Password (show/hide toggle), Country (dropdown with calling code), Mobile Number
- OTP flow on mobile number field (dummy flow — send, enter, verify)
- Form validation via Zod + TanStack Form (`onBlurAsync` + `onSubmit`)
- Success splash screen with auto-redirect to `/users/`

### Users Table
- Full CRUD — Create, Read, Update, Delete
- Server-side pagination via MockAPI.io
- Pagination state stored in URL query params (`?page=1&per_page=6`)
- After editing a user, returns to the same page the user came from
- After adding a user, redirects to the last page
- After deleting the last item on a page, auto-navigates to the previous page
- Delete confirmation modal using HeroUI v3 Modal
- Loading, empty, and error states handled on all pages
- HeroUI v3 Table component

---

## Project Structure

```
src/
├── routes/
│   ├── __root.tsx           # Root layout
│   ├── index.tsx            # Redirects / → /auth/login
│   ├── auth/
│   │   ├── login.tsx        # /auth/login
│   │   └── register.tsx     # /auth/register
│   └── users/
│       ├── index.tsx        # /users — table with pagination
│       ├── add.tsx          # /users/add
│       └── $id.update.tsx   # /users/:id/update
├── hooks/
│   └── users/
│       └── useUserQueries.ts  # TanStack Query hooks (useUsers, useCreateUser, useUpdateUser, useDeleteUser)
├── lib/
│   ├── api.ts               # Fetcher utility + all API functions
│   ├── schemas.ts           # Zod schemas for all forms
│   └── countries.ts         # Country list with calling codes
```

---

## Routes

| Path | Description |
|---|---|
| `/` | Redirects to `/auth/login` |
| `/auth/login` | Login page |
| `/auth/register` | Register page |
| `/users` | Users table with server-side pagination |
| `/users/add` | Add new user |
| `/users/:id/update` | Edit existing user |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repo
git clone https://github.com/AdarshHatkar/dummyx-v2--test-panel
cd test-panel

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
VITE_MOCKAPI_BASE_URL=https://<your-project-id>.mockapi.io/api
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## API

This project uses [MockAPI.io](https://mockapi.io) as the backend — a free mock REST API that supports real persistence and server-side pagination.

**Endpoints used:**

| Method | Endpoint | Description |
|---|---|---|
| GET | `/users?page=1&limit=6` | Fetch paginated users |
| GET | `/users/:id` | Fetch single user |
| POST | `/users` | Create user |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |

Total count is read from the `X-Total-Count` response header for accurate pagination.

---

## Key Implementation Notes

- **Pagination in URL** — page and per_page are stored as URL search params, not local state. Navigating between pages just updates the URL, and TanStack Query re-fetches based on the changed query key.
- **`onBlurAsync` validation** — using `onBlurAsync: schema` at the form level (instead of `onBlur`) prevents all field errors from firing simultaneously when tabbing through the form.
- **`isTouched` gate** — `isInvalid={errors.length > 0 && isTouched}` ensures errors only show after the user has interacted with the field, not on initial render.
- **Edit page return navigation** — the current `page` and `per_page` are passed as search params when navigating to the edit page, so after a successful update the user is returned to the exact page they came from.
- **HeroUI v3 spinner** — HeroUI v3 removed the auto-spinner from Button. Spinners are handled manually via the render prop pattern: `<Button isPending={...}>{({ isPending }) => ...}</Button>`
