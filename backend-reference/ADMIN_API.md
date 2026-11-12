# Admin API contract (what the frontend admin panel calls)

All admin calls send cookies (`credentials: include`). Return 401/403 for anyone who is not an admin.
Enforce this in the backend; the frontend only hides screens.

## Auth
| Call | Purpose |
|---|---|
| `POST /auth/login/` `{email, password}` | returns `{name, email, role}`; `role` is `"admin"` for admins |
| `GET /auth/me/` | current user or 401 (restores the session on refresh) |
| `POST /auth/logout/` | ends the session |
| `POST /auth/register/` `{fullName, email, password}` | member sign up, role `"member"` |

## Content (admin only)
For each `<name>` in `leaders, departments, events, sermons, announcements, resources, gallery, services`:

    GET    /manage/<name>/        all rows, including unpublished
    POST   /manage/<name>/        create
    PATCH  /manage/<name>/<id>/   update
    DELETE /manage/<name>/<id>/   delete (not needed for departments)
    POST   /manage/uploads/       multipart field "file" -> {"url": "https://.../image.jpg"}

## Public reads (no login)
`GET /<name>/` for the same names. `/leaders/` must return only published leaders that have a name.

## Fields
- leaders: `name, position, section, level(head|deputy|member), order, phone, email, bio, photo, published`
- events: `title, date(YYYY-MM-DD), time, location, description, image`
- sermons: `title, speaker, date, series, url`
- announcements: `title, date, text`
- resources: `title, type, url`
- gallery: `caption, src`
- services: `name, day, time, place`
- departments: `slug, name, short, icon, description, mission` (`icon` is a key such as `music`, see `src/lib/icons.jsx`)


---

# Members, families and graduation

## Rules the backend must implement (the frontend preview mirrors these in `src/lib/members.js` and `src/lib/families.js`)
- **Categories chosen at registration:** `member`, `associate`, `alumni`. Only `member` is a student. There is no leader option.
- **Leader detection:** a person is a leader when their email (case-insensitive) matches the `email` of a leader the admin added in `/manage/leaders/`. `/auth/login/`, `/auth/me/`, `/me/` and `/manage/members/` must return `isLeader` (bool) and `leaderPosition` (the leader's position). Recompute it on every read, so a person added as a leader later is recognised at their next sign in.
- **Approval:** not used. Every registration is active straight away.
- **Academic year** starts in September. At sign-up store `yearOfStudy`, `programDuration`, `signupAcademicStart` (the year that academic year started) and
  `graduationYear = signupAcademicStart + (programDuration - yearOfStudy) + 1`.
- **Current year of study** = `yearOfStudy + (currentAcademicStart - signupAcademicStart)`, capped at `programDuration`.
- **Graduation:** on or after 1 July of `graduationYear`, a student becomes `alumni` and `family` is cleared. Run this as a daily job
  AND when `POST /manage/members/sync-graduations/` is called (returns `{moved: n}`).
- **Family formation:** take not-yet-graduated students; group by (current year, gender); shuffle inside each group; sort groups by year then gender;
  deal round-robin into `round(total / size)` families; then swap same-year people of opposite gender between the family with most women and the one with fewest
  until the gender split is within one. See `generateFamilies` in `src/lib/families.js`.
- **New student after families exist:** put them in the family with the fewest people, then fewest of their gender, then fewest in their year.

## Member endpoints (signed-in member only, never another member's data)
| Call | Purpose |
|---|---|
| `POST /auth/register/` | body below; creates the account and signs the person in |
| `GET /me/` | profile plus `family: {id, name, members:[{id, fullName, gender, photo, program, year}]}` or `null` |
| `PATCH /me/` | `fullName, gender, address, phone, baptized, baptizedChurch, program, institution, yearOfStudy, programDuration, organisation, photo` |
| `POST /me/photo/` | multipart field `file` -> `{ "url": "..." }` |

Register body: `category, fullName, gender("Male"|"Female"), address, baptized(bool), baptizedChurch, phone, email, password, institution, program, programDuration, yearOfStudy, organisation, completionYear`.
Never return other members' phone, email or address in `family.members`.

## Admin endpoints
| Call | Purpose |
|---|---|
| `GET /manage/members/` | every member (all fields above plus `approved`, `familyId`, `createdAt`) |
| `PATCH /manage/members/<id>/` | change `category`, `approved`, `familyId`, etc. |
| `DELETE /manage/members/<id>/` | delete a member |
| `POST /manage/members/sync-graduations/` | run the graduation rule now |
| `GET /manage/families/` | `[{id, name}]` |
| `POST /manage/families/preview/` `{size}` | returns `[{name, memberIds:[...]}]` without saving |
| `POST /manage/families/apply/` `{families:[{name, memberIds}]}` | replaces all families and each member's `familyId` |
| `PATCH /manage/families/<id>/` `{name}` | rename |
| `POST /manage/families/assign-unassigned/` | place unplaced students; returns `{assigned: n}` |
