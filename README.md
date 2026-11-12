# TNC UDSM Frontend (React + Vite)

## Run it (Windows)
1. Put the project in its own folder. **Do not keep zip files inside the project folder** (an open `src.zip` locked by Windows crashed Vite with `EBUSY`).
2. In the project folder:
```
rmdir /s /q node_modules
del package-lock.json
npm install
npm run dev
```
Open http://localhost:5173

## "An Application Control policy has blocked this file"
Windows (Smart App Control / WDAC) refuses to load unsigned **native** files that npm installs, for example
`rollup.win32-x64-msvc.node` and `esbuild.exe`. This project avoids them completely:
`package.json` has an `overrides` block that swaps Rollup for `@rollup/wasm-node@4.62.0` and esbuild for
`esbuild-wasm`. Both are plain JavaScript + WebAssembly, so there is nothing for Windows to block.
Dev start and builds are a few seconds slower. If you later move to a computer without this restriction you may delete the
`overrides` block and reinstall for the faster native versions.
Do not run `npm audit fix --force`: it can bring the native binaries back.

## Site structure (matches the official navigation)
Home, About TNC (About, Ministries, TNC Choir, Contact Us), Leadership, Events, Community (Family & Prayer Groups,
Sports & Recreation, Alumni), Media (News & Announcements, Memories & Gallery, Sermons, TNC Library), and My Profile / Member Login
behind the user icon. The menu lives in `src/data/navigation.js`.
Calls to action: Join TNC, Explore Our Faith (`/about#faith`), Upcoming Events, Member Login, Request a Bible Study
(`/bible-study`), Submit a Prayer Request (`/prayer-request`). They appear in the hero slides, the Home "How can we help you today?"
band, the About page and the footer.

## Where things are edited
| What | Where |
| --- | --- |
| Hero slider pictures | `public/images/hero/` and `src/data/heroSlides.js` |
| Vision, mission, beliefs, faith cards, choir text, contact, social links | `src/data/site.js` |
| Menu | `src/data/navigation.js` |
| Leaders, events, sermons, news, sports, library, gallery, worship times | Admin panel `/admin` (login `admin@tncudsm.com`, password from `VITE_LOCAL_ADMIN_PASSWORD`, default `admin123`, preview mode only) |
| Bible study requests, prayer requests, messages | Admin panel > Requests & messages |

## Preview mode vs backend
With `VITE_API_URL` empty the site stores content in this browser only (localStorage). Requests sent from the public forms are
therefore visible only in the same browser. Set `VITE_API_URL` in `.env` to use the Django backend. The frontend never decides
who is an admin and never holds real names or contacts: the backend must enforce permissions.

### Endpoints the frontend calls
Public reads: `GET /departments/ /leaders/ /events/ /sermons/ /resources/ /gallery/ /services/ /announcements/ /sports/ /families/`
(`/families/` returns names only, never members).
Visitors: `POST /requests/` (anonymous allowed, rate-limit it; fields `type` = bible-study | prayer | message, name, phone, email, topic, preferred, message).
Auth: `GET /auth/me/`, `POST /auth/login/ /auth/register/ /auth/logout/`; members: `GET/PATCH /me/`, `POST /me/photo/`.
Admin (staff only): `/manage/<name>/` list/create, `/manage/<name>/<id>/` update/delete for leaders, events, sermons, announcements,
resources, gallery, services, sports, departments, members, families, requests; `POST /manage/uploads/`; families and graduation helpers as in `src/services/api.js`.

## White-page safety nets
`ErrorBoundary` shows a branded error screen instead of a blank page. Effects never return a value
(`window.scrollTo()` returns a Promise in new Chrome and would crash React). Failed requests show a "Try again" notice.
