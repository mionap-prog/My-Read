# Brand guide

Decided in step 10. Tokens live in `app/globals.css` (`:root` and `@theme inline`); shared classes (`.btn`, `.btn-outline`, `.text-link`, `.field`, `.field-label`, `.card`, `.empty-state`, `.heading`, `.error-text`) are in the same file under `@layer components`.

## Background
- Every page: `public/banner.svg` pinned to the bottom, centred, no repeat. Above it flat green `#163A25`.
- Dark mode (`prefers-color-scheme: dark`): `public/banner-dark.svg` and flat green `#0A1915`.
- Picture height is `--banner-h` = `max(220px, 100vw / 3)` (the SVG is 3:1), so it is always at least as wide as the window. On phones it is 220 px tall with the sides cropped. `body` has bottom padding of the same height so cards never cover it.

## Colours
| Token | Value | Use |
|---|---|---|
| `page` | `#163A25` (dark `#0A1915`) | page background |
| `cream` | `#F4EEDC` | text on green, header links, outlines |
| `card` | `#F7F1E3` | cards and form fields |
| `ink` | `#2A1E1C` | text on cards |
| `muted` | `#6B5B4E` | authors, details on cards |
| `coral` | `#E9493E` (hover `#C93A30`) | buttons |
| `alert` | `#FFB4A8` | error text on green |

Cream on coral is about 3.3:1, so button text is bold and at least 19 px (counts as large text).

## Fonts
- Fraunces (`next/font/google`, token `font-display`): headings (`.heading`) and buttons.
- Geist (`font-sans`): book titles and all other text.

## Components
- Header: green, cream links, current page underlined (`border-b-2`).
- Buttons: coral pill, cream text. Secondary (delete): cream outline pill.
- `BookRow` (`app/components/BookRow.tsx`): cream card per book, with a coloured status label (amber / sky / emerald).
- Empty states: dashed cream border on green.
- Touch targets are at least 44 px (`min-h-11`).
