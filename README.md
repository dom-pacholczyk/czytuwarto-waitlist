# Handoff: CzyTuWarto — Landing Page (waitlista przed launchem)

## Overview
Pre-launch landing page produktu **CzyTuWarto** (narzędzie do oceny lokalizacji pod biznes stacjonarny). Cel strony: zebrać zapisy na waitlistę. Układ dwukolumnowy: po lewej hero z rotującym nagłówkiem + formularz zapisu, po prawej statyczny mockup telefonu z podglądem raportu. Dodatkowo: cookie consent banner i osobna podstrona polityki prywatności.

## About the Design Files
Pliki w tym pakiecie to **referencje projektowe wykonane w HTML/CSS/JS** — prototypy pokazujące docelowy wygląd i zachowanie, **nie** kod produkcyjny do skopiowania 1:1. Zadaniem jest **odtworzenie tych projektów w istniejącym środowisku docelowego repo** (React/Next, Vue, Svelte itd.), zgodnie z przyjętymi tam wzorcami i biblioteką komponentów. Jeśli środowisko nie istnieje jeszcze — wybierz najodpowiedniejszy framework (rekomendacja: Next.js + React, bo to klasyczna marketingowa LP) i zaimplementuj tam.

Design system (kolory, typografia, spacing, promienie) jest już sformalizowany w `styles/tokens.css` jako CSS custom properties wyciągnięte 1:1 z Figmy. **Te tokeny są źródłem prawdy** — odwzoruj je w docelowym systemie (Tailwind theme, CSS vars, styled tokens) zamiast hardkodować wartości.

## Fidelity
**High-fidelity (hifi).** Finalne kolory, typografia, spacing, interakcje i animacje. Odtwórz UI pikselowo, używając tokenów z `tokens.css`. Wszystkie wartości w tym dokumencie są ostateczne.

---

## Screens / Views

### 1. Landing Page (`Landing Page.html`)

**Purpose:** Przedstawić produkt jednym zdaniem i zebrać e-mail + typ planowanego biznesu na waitlistę.

**Layout (desktop, >900px):**
- Kontener `.page`: `max-width: 1200px`, wyśrodkowany, padding `40px 48px 32px` (góra/boki/dół). Na desktopie `height: 100dvh; overflow: hidden` — **cała strona mieści się w jednym ekranie bez scrolla**.
- `.main`: CSS Grid, 2 kolumny `minmax(0, 504px) minmax(0, 1fr)`, `column-gap: 64px`, `align-items: center`, `padding-block: 16px`.
- **Lewa kolumna** (`.intro`, max-width 504px): flex column, `gap: 32px`. Kolejno: blok tekstu (`.intro__copy`, gap 24px: H1 + paragraf), formularz (`.form`, gap 24px).
- **Prawa kolumna** (`.visual`): wyśrodkowany mockup telefonu na zielonej radialnej poświacie.
- Nad gridem: `<header>` z logo. Pod gridem: `<footer>`.

**Layout (mobile, ≤900px):**
- Grid składa się do 1 kolumny, `row-gap: 64px`. Telefon (`.visual`) przechodzi NAD treść (`order: -1`). `.page` wraca do `min-height` (scroll dozwolony).

---

#### Komponenty — Lewa kolumna

**Logo (`.brand`)**
- Flex row, `gap: 12px`, align center.
- `logo-mark.svg` (24×24) + `logo-word.svg` (wordmark „CzyTuWarto", wysokość 17px). Oba SVG używają `currentColor` = `--color-text-secondary` (#333333).

**H1 — nagłówek z rotatorem (`.intro__title`)**
- Font: Geist, **weight 600** (`--fw-semibold`), `font-size: clamp(34px, 5.2vw, 48px)`, `line-height: 1.08`, `letter-spacing: -0.01em`, kolor `--color-text-secondary` (#333333).
- **Trzy stałe linie** (każda `display: block`):
  1. „Zanim otworzysz"
  2. **[rotujący vertical]**„," — vertical w kolorze `--color-accent-positive` (#219653), przecinek w `--color-text-secondary`. Linia ma `white-space: nowrap` (nigdy się nie zawija).
  3. „sprawdź, czy tu warto"
- **Rotator = efekt maszyny do pisania.** Lista verticali (w tej kolejności): `salon fryzjerski`, `barber shop`, `kawiarnię`, `salon beauty`, `gabinet fizjoterapii`, `gabinet masażu`, `studio pilates`, `lokal usługowy`.
  - Pisanie: 82 ms/znak. Kasowanie: 30 ms/znak. Pauza na pełnym słowie: 2500 ms. Pauza przed kolejnym: 320 ms.
  - Migający kursor (`.rotator__caret`): pasek 0.055em × 0.78em, kolor zielony, blink 1.05s steps(1).
  - `prefers-reduced-motion: reduce` → zamiast pisania prosty fade co 2600 ms.

**Paragraf (`.intro__lead`)**
- Geist, weight 500 (`--fw-medium`), 16px / line-height 28px, `letter-spacing: -0.01em`, kolor `--color-text-secondary`. `max-width: 46ch`.
- Treść: „Zobacz, czy wybrana lokalizacja ma sens, zanim wejdziesz w koszty najmu, remontu i sprzętu. Zostaw e-mail i przetestuj jako pierwszy."

**Formularz (`.form`)** — flex column, gap 24px. Dwie grupy pól.

**Pole bazowe (`.field`)** — wspólne dla dropdownu i emaila:
- Wysokość **64px**, `border-radius: 999px` (pill), tło `--color-surface` (#fff).
- Spoczynek: `box-shadow: inset 0 0 0 1px var(--color-border)` (#e4e4e4).
- **Hover:** `inset 0 0 0 1px var(--color-icon-help)` (#bdbdbd).
- **Focus (`:focus-within`):** `inset 0 0 0 1.5px var(--color-text-tertiary)` (#767676).
- **Error (`.field--error`, też w hover/focus):** `inset 0 0 0 1.5px var(--color-accent-warning)` (#f2994a).
- `transition: box-shadow 140ms ease`.

**Dropdown „Jaki biznes planujesz?" (`.field--select`)** — hybryda progresywna:
- **Źródło prawdy: natywny `<select>`** (`#vertical`, `required`). Zawiera placeholder (disabled) + 12 opcji: Salon fryzjerski, Barbershop, Salon kosmetyczny, Kawiarnia, Restauracja, Bar / pub, Piekarnia / cukiernia, Siłownia / klub fitness, Sklep spożywczy, Kwiaciarnia, Gabinet kosmetyczny, Inny.
- **Na dotyku** (`hover: none and pointer: coarse`): zostaje natywny `<select>` (lepszy mobilny picker). JS nie buduje custom UI.
- **Na desktopie:** JS ukrywa `<select>` i renderuje customowy listbox:
  - Trigger `.field__combo` (`<button role="combobox">`): Geist 500, 16px, padding `0 32px 0 0` (lewy padding 0 — tekst wyrównany do 24px paddingu pola, identycznie jak input email). Placeholder w kolorze `--color-text-tertiary`; po wyborze tekst `--color-text-secondary`.
  - Chevron (24×24, `.field__chevron`) po prawej (24px od krawędzi), obraca się 180° przy otwarciu (`transition: transform 160ms`).
  - Panel `.select-panel` (`<ul role="listbox">`): **`position: fixed`** (ucieka z `overflow: hidden` strony), wyrównany do szerokości i lewej krawędzi pola, otwiera się **w dół** z odstępem 8px; wysokość przycinana do dostępnego miejsca w viewport (`max-height: min(320px, miejsce poniżej)`), scroll wewnątrz. Tło `--color-surface`, `border-radius: 24px` (`--radius-card`), `box-shadow: 0 12px 32px rgba(0,0,0,.12)` + inset ring 1px border, padding 8px. Animacja wejścia: opacity + translateY(-6px→0) 160ms.
  - Opcja `.select-option`: wysokość 44px, padding `0 12px`, **`border-radius: calc(24px - 8px) = 16px`** (promień karty minus padding panelu → koncentryczne licowanie rogów). Geist 500, 16px, kolor `--color-text-secondary`.
    - Aktywna (hover/klawiatura): tło `--color-background-subtle` (#f6f6f6).
    - Wybrana: kolor `--color-accent-positive` (#219653) + ikona check (20×20, zielona) po prawej.
  - **Dostępność:** `role="combobox"`/`listbox`/`option`, `aria-expanded`, `aria-controls`, `aria-activedescendant`, `aria-selected`. Klawiatura: ↑/↓ (otwórz/nawiguj), Enter/Space (otwórz/wybierz), Esc (zamknij), Home/End, Tab (zamknij), typeahead (pisanie pierwszych liter). Wybór synchronizuje natywny `<select>` przez `change` event.

**Pole e-mail + przycisk (`.field--email`)**
- Padding `8px 8px 8px 24px`. Input `type="email"` (Geist 500, 16px, placeholder „Adres e-mail" w `--color-text-tertiary`).
- Przycisk „Powiadom mnie" (`.btn`): wysokość 48px, padding-inline 32px, `border-radius: 999px`, tło `--color-accent-positive` (#219653), tekst biały, Geist 500, 14px. Hover: `--color-accent-positive-deep` (#145536). Active: `translateY(1px)`.

**Komunikaty błędów (`.field-error`)** — pod każdym polem, 8px odstępu, ukryte domyślnie (`.field-group.has-error` je pokazuje). Geist 500, 14px, kolor `--color-accent-warning` (#f2994a), padding-left 24px.
- Dropdown: „Wybierz rodzaj biznesu z listy."
- Email: „Podaj poprawny adres e-mail."

**Stan „wysłano" (`.success`)** — zastępuje formularz po poprawnym submit:
- Flex row, gap 16px, min-height 64px, padding `16px 24px`, `border-radius: 24px`, inset ring 1px border.
- Ikona TickCircle (32×32, kolor `--color-accent-positive`) + tekst (Geist 500, 16px, `--color-text-secondary`): **„Wysłane! Damy Ci znać o starcie i możliwości wcześniejszego przetestowania CzyTuWarto."**
- Po wysłaniu: `.form` dostaje `is-hidden` (display none), `.success` dostaje `is-visible`.

#### Komponenty — Prawa kolumna

**Mockup telefonu (`.phone` / `.phone__img`)**
- Statyczny render (PNG `phone-mockup.png`, 650×1543, przezroczyste tło). Wysokość `min(78vh, 720px)`, szerokość auto. **Bez cienia.**
- Wrapper `.phone` z animacją wejścia; obrazek `.phone__img` osobno (clue do ostrości — patrz niżej).

**Zielona poświata (`.visual__glow`)**
- Koło za telefonem: `width: clamp(400px, 50vh, 480px)`, `aspect-ratio: 1`, `border-radius: 50%`.
- `background: linear-gradient(225deg, rgb(41,167,110) 0%, rgba(255,255,255,0) 90.1%)`. **Bez blur.** (Uwaga: ten konkretny zielony `rgb(41,167,110)` = #29A76E pochodzi z referencji Figmy i jest jaśniejszy niż tokenowy `--color-accent-positive` #219653; świadoma decyzja — wierność mockupowi w tym jednym miejscu.)

#### Footer (`.footer`)
- Flex row, wrap, gap `8px 16px`. Inter (`--font-ui`), weight 400, 12px (`--fs-small`), kolor `--color-text-tertiary`.
- Treść: „CzyTuWarto © 2026" · [link] „Prywatność" → `polityka-prywatnosci.html` · [link] „Cookies" → otwiera ponownie cookie banner (`#cookie-settings`).

#### Cookie consent banner (`.cookie`)
- **Fixed** na dole (`bottom: 16px`), wyśrodkowany poziomo, `width: max-content`, slim pill (`border-radius: 999px`), padding `8px 8px 8px 16px`, tło `--color-surface`, `box-shadow: 0 8px 24px rgba(0,0,0,.10)` + inset ring border. `z-index: 50`.
- Tekst (Inter, 12px `--fs-small`, kolor `--color-text-tertiary`): **„Używamy cookies, aby ulepszać produkt."** (`white-space: nowrap`).
- Dwa przyciski (`.cookie__btn`, wysokość 32px, padding-inline 16px, pill, Geist 500, 12px):
  - **„Akceptuj"** (`.cookie__btn--accept`): tło `--color-text-secondary` (#333333), tekst biały. Hover: `--color-text-primary` (#000). (Ciemnoszary solid — mocniejszy, ale nie zielony.)
  - **„Tylko niezbędne"** (`.cookie__btn--ghost`): tło białe, `box-shadow: inset 0 0 0 1px border`, tekst `--color-text-secondary`. Hover: ring `--color-text-tertiary` 1.5px.
- **Mobile (≤520px):** kolumna, pełna szerokość, `border-radius: 24px`, przyciski w rzędzie (flex 1, wysokość 40px).
- Pojawia się przy pierwszej wizycie; znika po wyborze (animacja: opacity + translateY 16px, 280ms).

---

### 2. Polityka prywatności (`polityka-prywatnosci.html`)

**Purpose:** Pełny dokument polityki prywatności (RODO), linkowany ze stopki LP.

**Layout:** Pojedyncza kolumna `.doc`, `max-width: 720px`, wyśrodkowana, padding `64px 24px 80px`. Prosta, czytelna typografia bez ozdobników.

**Komponenty:**
- Link powrotu „Powrót na stronę główną" (chevron + tekst, Geist 500, 14px, `--color-text-tertiary`, `white-space: nowrap`).
- H1 (`.doc__title`): Geist 600, 48px/56px, kolor **`--color-text-primary`** (#000), `letter-spacing: -0.01em`. Mobile: 40px/48px.
- Data aktualizacji (`.doc__updated`): 14px, `--color-text-tertiary`.
- Hr (`.doc__rule`): 1px `--color-border`.
- H2 (sekcje): Geist 600, 24px/24px, `--color-text-primary`, margin-top 64px.
- H3 (podsekcje): Geist 600, 16px, `--color-text-secondary`.
- Paragrafy/listy: Geist 400, 16px / line-height 26px, `--color-text-secondary`. Listy z gap 8px, marker w `--color-text-tertiary`.
- Linki: kolor `--color-text-secondary`, underline; hover `--color-accent-positive`.
- Tabela cookies: border-collapse, komórki padding `12px 16px`, dolna krawędź 1px border; nagłówki Geist 600 `--color-text-primary`; `<code>` w foncie Inter (`--font-ui`).
- 10 ponumerowanych sekcji (administrator, zbierane dane, podstawa prawna, retencja, odbiorcy, prawa RODO, bezpieczeństwo, cookies, zmiany, kontakt).

---

## Interactions & Behavior

**Walidacja formularza (frontend-only):**
- Submit jest przechwytywany (`preventDefault`).
- Vertical: błąd jeśli `select.value === ''`.
- Email: regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
- Błędy czyszczą się: dropdown przy `change`, email przy `input` (gdy stanie się poprawny).
- Po niepowodzeniu — focus na pierwsze błędne pole.
- Po sukcesie — formularz znika, pokazuje się `.success`.
- **Dane nigdzie nie lecą** — to czysty frontend. Backend (zapis e-maila + typ biznesu) podpina developer osobno. Patrz „State Management".

**Cookie consent:**
- Wybór zapisywany w `localStorage` pod kluczem `ctw-cookie-consent` (`'accepted'` / `'rejected'`).
- Banner pokazuje się tylko jeśli klucz nieustawiony. „Ustawienia/Cookies" w stopce otwiera go ponownie.
- **GA NIE jest jeszcze ładowany** — banner tylko zapisuje zgodę. Faktyczne wczytanie Google Analytics po `'accepted'` podpina developer.

**Animacja wejścia telefonu:** `phone-in` 1700ms `cubic-bezier(0.16,1,0.3,1)`, delay 260ms — z `translateY(180px) scale(0.74) rotateX(20deg)` + blur, do stanu spoczynku. **Ważne:** po `animationend` JS zdejmuje `animation/transform/filter` (ustawia `none`) i wymusza re-raster `<img>`, inaczej pozostały `blur(0)`/warstwa GPU dają miękki (rozmyty) obrazek na ekranach Retina. Po wejściu telefon jest nieruchomy (bez floatu). Poświata: `glow-in` 1600ms (scale 0.3→1).

**Responsywność:** patrz Layout desktop/mobile wyżej. Breakpointy: 900px (grid 2→1 kol), 520px (cookie banner + email field wrap).

## State Management
Stan do zaimplementowania w docelowym repo:
- `selectedVertical: string` — wybrany typ biznesu (z 12 opcji).
- `email: string` + walidacja.
- `formState: 'idle' | 'error' | 'submitted'`.
- `cookieConsent: 'accepted' | 'rejected' | null` (persist).
- **Data fetching / backend:** endpoint przyjmujący `{ email, vertical }` na zapis waitlisty (POST). Po sukcesie → stan `submitted`. Obsłużyć realne błędy sieci (obecny prototyp zawsze „udaje" sukces). Po zgodzie cookies → inicjalizacja GA4 (`_ga`, `_ga_*`).

## Design Tokens
Pełny zestaw w `styles/tokens.css`. Najważniejsze dla LP:

**Kolory:**
- `--color-background` / `--color-surface`: #ffffff
- `--color-background-subtle`: #f6f6f6 (aktywna opcja dropdownu)
- `--color-text-primary`: #000000 (nagłówki polityki)
- `--color-text-secondary`: #333333 (H1, body, przycisk Akceptuj)
- `--color-text-tertiary`: #767676 (placeholdery, opisy, footer)
- `--color-border`: #e4e4e4 (obrys pól spoczynek)
- `--color-icon-help`: #bdbdbd (obrys pól hover)
- `--color-accent-positive`: #219653 (przycisk Powiadom mnie, zaznaczenie, vertical w H1)
- `--color-accent-positive-deep`: #145536 (hover przycisku)
- `--color-accent-warning`: #f2994a (stany błędu)
- Poświata mockupu: `rgb(41,167,110)` (#29A76E — wartość z Figmy, jaśniejsza od tokenu)

**Typografia:**
- `--font-sans`: "Geist", system fallback (cały UI)
- `--font-ui`: "Inter", system fallback (footer, cookie text, `<code>`)
- Skala: hero 48/56, section 40/48, stat 24/24, body 16/24, label 14/20, small 12/20, tiny 10/16
- Wagi: regular 400, medium 500, semibold 600. Tracking: -0.01em.

**Spacing:** 4 / 8 / 12 / 16 / 24 / 32 / 40 / 48 / 64px (skala `--space-1` … `--space-16`).

**Border-radius:** `--radius-chip` 8, `--radius-card` 24, `--radius-section` 32, `--radius-pill` 999.

**Inne:** `--hairline` 1px; `--ring-border` = `inset 0 0 0 1px var(--color-border)`.

## Assets
- `assets/lp/logo-mark.svg` — znaczek logo (24×24, `currentColor`).
- `assets/lp/logo-word.svg` — wordmark „CzyTuWarto" (`currentColor`).
- `assets/lp/phone-mockup.png` — render telefonu z podglądem raportu (650×1543, przezroczyste tło). Dostarczony przez klienta.
- **Fonty:** Geist + Inter, ładowane z Google Fonts (`<link>` w `<head>`). Geist wagi 400/500/600, Inter 400/500. W produkcji rozważ self-hosting.
- Ikony inline jako SVG (chevron, check, tick-circle) — odtwórz z biblioteki ikon docelowego repo lub zachowaj jako inline SVG.

## Files
- `Landing Page.html` — główna LP (kompletna: struktura, style w `<style>`, logika w `<script>`).
- `polityka-prywatnosci.html` — podstrona polityki prywatności.
- `styles/tokens.css` — design tokens (źródło prawdy dla kolorów/typografii/spacingu).
- `assets/lp/` — logo (2 SVG) + mockup telefonu (PNG).

### Uwagi implementacyjne
- Linki używają nazw plików (`polityka-prywatnosci.html`); przy routingu zamień na czyste ścieżki (`/polityka-prywatnosci`).
- Dropdown to progresywne ulepszenie nad natywnym `<select>` — w React/Vue rozważ gotowy, dostępny combobox (np. Radix/Headless UI), zachowując wygląd z tokenów i regułę promienia opcji (`radius-card − padding`).
- `100dvh` + `overflow: hidden` na desktopie celowo trzyma LP w jednym ekranie; zachowaj scroll na mobile.
