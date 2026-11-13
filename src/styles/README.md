# Styles: how the CSS is organised

Each group of components owns its CSS file, next to the component. Edit one file, change one thing.

## Shared (loaded once, from `src/styles/index.css`)
| File | What it holds |
|---|---|
| `tokens.css` | Brand colours (teal, navy, gold, white, light gray), gradients, radius, fonts. **Change colours here only.** |
| `base.css` | Reset, typography, `.container`, `.section`, `.grid` |
| `button.css` | `.btn` (all four colours and hover motions) |
| `card.css` | `.card`, hover effects `.fx`, badge, icon tile, date chip, event/sermon card structure, `.card--tile` (compact icon-left card on phones) |
| `tabs.css` | `.tabs` / `.tab` |
| `forms.css` | Fields, choices, avatar, form messages |

## Per component / page (imported by the component itself)
`components/Navbar.css`, `MobileSidebar.css`, `HeroSlider.css`, `Footer.css`, `PageBanner.css`, `EventCard.css`,
`SermonCard.css`, `LeaderCard.css`, `home/WorshipTimes.css`, `home/AboutTabs.css`, `home/QuickActions.css`,
`home/ContactSocial.css`, `pages/Home.css`, `pages/Departments.css`, `pages/MemberDashboard.css` and so on.
Admin keeps `admin/admin.css`; member admin tables keep `styles/members.css`.

## Rules
1. A rule used by one component lives in that component's file.
2. Phone rules sit at the bottom of the same file inside `@media (max-width: 560px)`.
3. Colours come from `tokens.css` variables, never hard-coded hex values.
4. Text on teal is white; gold text is only used on navy (contrast).
5. Home sections alternate white / light-grey automatically (`tone()` in `pages/Home.jsx`).
