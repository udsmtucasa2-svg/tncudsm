# Members, families and graduation (backend contract)

The frontend already works in local preview mode. With `VITE_API_URL` set, it expects these endpoints.
Every response is JSON. The backend must enforce the roles: a member only reads and edits their own record.

## Member model
| Field | Notes |
|---|---|
| id, email (unique), password (write only, hashed) | |
| category | `member` \| `leader` \| `associate` |
| fullName, gender (`Male`/`Female`), address, phone | |
| baptised (`Yes`/`No`), baptismChurch | church is required when baptised is `Yes` |
| programme, duration (years), yearOfStudy | students only (member, leader). `yearOfStudy` is the year at registration time |
| regAcademicStart | academic year start (e.g. 2026) when `yearOfStudy` was recorded. Set by the server |
| ministry | leaders only, a leadership section key |
| affiliation (`Alumni`/`Associate`), graduationYear | associate category only |
| photo | URL of the profile photo |
| familyId | null when not in a family. Set by the server |
| createdAt | |

## Rules (same as `src/lib/family.js`)
- Academic year starts in September: `academicStart = month >= 9 ? year : year - 1`.
- Current year of study = `yearOfStudy + (academicStart(today) - regAcademicStart)`.
- A student has graduated when the current year of study is greater than `duration`. Graduation year = `regAcademicStart + duration - yearOfStudy + 1`.
- Only current students (member or leader, not graduated) can be in a family. Associates, alumni and graduates have `familyId = null`. Run this as a daily job or compute it on every read.
- When a member PATCHes `yearOfStudy` it is their current year, so set `regAcademicStart` to the current `academicStart`.

## Public and member endpoints
- `POST /auth/register/` full member payload above plus `password`. Creates the account, signs in, and (if families exist) puts the student in the family with the fewest members, then fewest of the same gender, then fewest in the same year.
- `POST /auth/login/`, `POST /auth/logout/`, `GET /auth/me/` returns `{ name, email, role }` (role `member` or `admin`).
- `GET /member/me/` and `PATCH /member/me/` own record. Editable: fullName, gender, address, phone, baptised, baptismChurch, programme, duration, yearOfStudy, ministry, affiliation, graduationYear, photo.
- `GET /member/family/` returns `{ family: { id, name } | null, members: [{ id, name, photo, gender, yearOfStudy, regAcademicStart, category }] }`. Never include phone, email or address.
- `POST /member/photo/` multipart `file`, returns `{ url }`.

## Admin endpoints (admin role only)
- `GET /manage/members/`, `PATCH /manage/members/<id>/` (for example `{ "familyId": 3 }`), `DELETE /manage/members/<id>/`.
- `GET /manage/families/`, `PATCH /manage/families/<id>/` (rename `{ "name": "..." }`).
- `POST /manage/families/form/` body `{ "count": 6 }`. Replaces all family assignments: shuffle the current students, group them by (year of study, gender), and deal them one by one to `count` families so every family gets a similar mix. Keep existing family names for the first `count` families, name new ones `Family N`. Returns `{ families, assigned }`.
