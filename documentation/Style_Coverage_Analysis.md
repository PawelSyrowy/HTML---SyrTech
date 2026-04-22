# Analiza pokrycia stylów - Edytor Tabel

**Data utworzenia:** 22.04.2026
**Wersja:** 1.0
**Cel:** Dokumentacja aktualnie obsługiwanych stylów CSS i ich wsparcia w JS

---

## SPIS TREŚCI
1. [Przegląd CSS Variables i ich obsługa w JS](#1-przegląd-css-variables-i-ich-obsługa-w-js)
2. [Analiza stylizacji dla Table](#2-analiza-stylizacji-dla-table)
3. [Analiza stylizacji dla Header](#3-analiza-stylizacji-dla-header)
4. [Analiza stylizacji dla Footer](#4-analiza-stylizacji-dla-footer)
5. [Analiza stylizacji dla Body](#5-analiza-stylizacji-dla-body)
6. [Analiza stylizacji dla Cells](#6-analiza-stylizacji-dla-cells)
7. [Analiza stylizacji dla Rows](#7-analiza-stylizacji-dla-rows)
8. [Potencjalne rozszerzenia](#8-potencjalne-rozszerzenia)

---

## 1. PRZEGLĄD CSS VARIABLES I ICH OBSŁUGA W JS

### 1.1 Tabela główna (TABLE)

| CSS Variable | Zdefiniowana w style.css | Obsługa w script.js | Typ kontrolki | Domyślna wartość |
|--------------|-------------------------|---------------------|---------------|------------------|
| `--et-width` | ✅ Tak | ✅ Tak | text | `100%` |
| `--et-margin` | ✅ Tak | ✅ Tak | margin (4x range) | `0` |
| `--et-margin-top` | ❌ Nie (tylko w JS) | ✅ Tak | range (sub) | `0px` |
| `--et-margin-right` | ❌ Nie (tylko w JS) | ✅ Tak | range (sub) | `0px` |
| `--et-margin-bottom` | ❌ Nie (tylko w JS) | ✅ Tak | range (sub) | `0px` |
| `--et-margin-left` | ❌ Nie (tylko w JS) | ✅ Tak | range (sub) | `0px` |
| `--et-border-collapse` | ✅ Tak | ✅ Tak | select | `collapse` |
| `--et-font-family` | ✅ Tak | ✅ Tak | select | `sans-serif` |
| `--et-font-size` | ✅ Tak | ✅ Tak | range (10-40) | `16px` |
| `--et-line-height` | ✅ Tak | ✅ Tak | text | `1.4` |
| `--et-bg` | ✅ Tak | ✅ Tak | color | `transparent` |
| `--et-color` | ✅ Tak | ✅ Tak | color | `inherit` |
| `--et-border` | ✅ Tak | ✅ Tak | border (kompozyt) | `none` |
| `--et-border-width` | ❌ Nie (tylko w JS) | ✅ Tak | range (sub) | `0px` |
| `--et-border-style` | ❌ Nie (tylko w JS) | ✅ Tak | select (sub) | `none` |
| `--et-border-color` | ❌ Nie (tylko w JS) | ✅ Tak | color (sub) | `#000000` |
| `--et-radius` | ✅ Tak | ✅ Tak | range (0-30) | `0` |
| `--et-shadow` | ✅ Tak | ✅ Tak | text | `none` |

**Podsumowanie:**
- **Zdefiniowane w CSS:** 11 variables
- **Sub-variables (tylko JS):** 6 variables (margin: 4, border: 2)
- **Razem obsługiwanych:** 17 variables
- **Pełna synchronizacja:** ✅ Wszystkie CSS variables mają kontrolki w JS

---

### 1.2 Header (THEAD)

| CSS Variable | Zdefiniowana w style.css | Obsługa w script.js | Typ kontrolki | Domyślna wartość |
|--------------|-------------------------|---------------------|---------------|------------------|
| `--et-header-bg` | ✅ Tak | ✅ Tak | color | `transparent` |
| `--et-header-color` | ✅ Tak | ✅ Tak | color | `inherit` |
| `--et-header-font-size` | ✅ Tak | ✅ Tak | range (10-40) | `inherit` |
| `--et-header-border` | ✅ Tak | ✅ Tak | border (kompozyt) | `none` |
| `--et-header-border-width` | ❌ Nie (tylko w JS) | ✅ Tak | range (sub) | `0px` |
| `--et-header-border-style` | ❌ Nie (tylko w JS) | ✅ Tak | select (sub) | `none` |
| `--et-header-border-color` | ❌ Nie (tylko w JS) | ✅ Tak | color (sub) | `#000000` |

**Podsumowanie:**
- **Zdefiniowane w CSS:** 4 variables
- **Sub-variables (tylko JS):** 3 variables
- **Razem obsługiwanych:** 7 variables
- **Pełna synchronizacja:** ✅

---

### 1.3 Footer (TFOOT)

| CSS Variable | Zdefiniowana w style.css | Obsługa w script.js | Typ kontrolki | Domyślna wartość |
|--------------|-------------------------|---------------------|---------------|------------------|
| `--et-footer-bg` | ✅ Tak | ✅ Tak | color | `transparent` |
| `--et-footer-color` | ✅ Tak | ✅ Tak | color | `inherit` |
| `--et-footer-font-size` | ✅ Tak | ✅ Tak | range (10-40) | `inherit` |
| `--et-footer-border` | ✅ Tak | ✅ Tak | border (kompozyt) | `none` |
| `--et-footer-border-width` | ❌ Nie (tylko w JS) | ✅ Tak | range (sub) | `0px` |
| `--et-footer-border-style` | ❌ Nie (tylko w JS) | ✅ Tak | select (sub) | `none` |
| `--et-footer-border-color` | ❌ Nie (tylko w JS) | ✅ Tak | color (sub) | `#000000` |

**Podsumowanie:**
- **Zdefiniowane w CSS:** 4 variables
- **Sub-variables (tylko JS):** 3 variables
- **Razem obsługiwanych:** 7 variables
- **Pełna synchronizacja:** ✅

---

### 1.4 Body (TBODY)

| CSS Variable | Zdefiniowana w style.css | Obsługa w script.js | Typ kontrolki | Domyślna wartość |
|--------------|-------------------------|---------------------|---------------|------------------|
| `--et-body-bg` | ✅ Tak | ✅ Tak | color | `transparent` |
| `--et-body-color` | ✅ Tak | ✅ Tak | color | `inherit` |
| `--et-body-font-size` | ✅ Tak | ✅ Tak | range (10-40) | `inherit` |

**Podsumowanie:**
- **Zdefiniowane w CSS:** 3 variables
- **Sub-variables (tylko JS):** 0 variables
- **Razem obsługiwanych:** 3 variables
- **Pełna synchronizacja:** ✅

---

### 1.5 Cells (TH, TD)

| CSS Variable | Zdefiniowana w style.css | Obsługa w script.js | Typ kontrolki | Domyślna wartość |
|--------------|-------------------------|---------------------|---------------|------------------|
| `--et-cell-border` | ✅ Tak | ✅ Tak | border (kompozyt) | `none` |
| `--et-cell-border-width` | ❌ Nie (tylko w JS) | ✅ Tak | range (sub) | `0px` |
| `--et-cell-border-style` | ❌ Nie (tylko w JS) | ✅ Tak | select (sub) | `none` |
| `--et-cell-border-color` | ❌ Nie (tylko w JS) | ✅ Tak | color (sub) | `#000000` |
| `--et-cell-padding-x` | ✅ Tak | ✅ Tak | range (0-40) | `8px` |
| `--et-cell-padding-y` | ✅ Tak | ✅ Tak | range (0-40) | `6px` |

**Podsumowanie:**
- **Zdefiniowane w CSS:** 3 variables
- **Sub-variables (tylko JS):** 3 variables
- **Razem obsługiwanych:** 6 variables
- **Pełna synchronizacja:** ✅

---

### 1.6 Rows (TR)

| CSS Variable | Zdefiniowana w style.css | Obsługa w script.js | Typ kontrolki | Domyślna wartość |
|--------------|-------------------------|---------------------|---------------|------------------|
| `--et-row-bg` | ✅ Tak | ✅ Tak | color | `transparent` |
| `--et-row-border` | ✅ Tak | ✅ Tak | border (kompozyt) | `none` |
| `--et-row-border-width` | ❌ Nie (tylko w JS) | ✅ Tak | range (sub) | `0px` |
| `--et-row-border-style` | ❌ Nie (tylko w JS) | ✅ Tak | select (sub) | `none` |
| `--et-row-border-color` | ❌ Nie (tylko w JS) | ✅ Tak | color (sub) | `#000000` |
| `--et-stripe-bg` | ✅ Tak | ✅ Tak | color | `transparent` |
| `--et-hover-bg` | ✅ Tak | ✅ Tak | color | `transparent` |

**Podsumowanie:**
- **Zdefiniowane w CSS:** 4 variables
- **Sub-variables (tylko JS):** 3 variables
- **Razem obsługiwanych:** 7 variables
- **Pełna synchronizacja:** ✅

---

### 1.7 PODSUMOWANIE OGÓLNE

| Sekcja | CSS Variables | JS Variables (sub) | Razem | Kontrolki UI |
|--------|---------------|--------------------| ------|--------------|
| Table | 11 | 6 | 17 | 11 |
| Header | 4 | 3 | 7 | 4 |
| Footer | 4 | 3 | 7 | 4 |
| Body | 3 | 0 | 3 | 3 |
| Cells | 3 | 3 | 6 | 3 |
| Rows | 4 | 3 | 7 | 4 |
| **RAZEM** | **29** | **18** | **47** | **29** |

**Wnioski:**
- ✅ **100% pokrycie** - wszystkie CSS variables mają kontrolki w JS
- ✅ **Sub-variables** - 18 dodatkowych zmiennych dla złożonych właściwości (border, margin)
- ✅ **Pełna synchronizacja** - każda kontrolka działa dwukierunkowo (UI → CSS, CSS → UI)

---

## 2. ANALIZA STYLIZACJI DLA TABLE

### 2.1 Co można obecnie stylizować?

| Właściwość | CSS Property | Kontrolka | Zakres/Opcje | Domyślna wartość | Obsługa w Generate CSS | Obsługa w Load CSS |
|------------|--------------|-----------|--------------|------------------|------------------------|-------------------|
| **Szerokość** | `width` | text | dowolna | `100%` | ✅ | ✅ |
| **Marginesy** | `margin` | 4x range | 0-50px każdy | `0` | ✅ | ✅ |
| **Łączenie ramek** | `border-collapse` | select | collapse/separate | `collapse` | ✅ | ✅ |
| **Czcionka** | `font-family` | select | 10 opcji | `sans-serif` | ✅ | ✅ |
| **Rozmiar czcionki** | `font-size` | range | 10-40px | `16px` | ✅ | ✅ |
| **Wysokość linii** | `line-height` | text | dowolna | `1.4` | ✅ | ✅ |
| **Tło** | `background` | color | picker | `transparent` | ✅ | ✅ |
| **Kolor tekstu** | `color` | color | picker | `#000000` | ✅ | ✅ |
| **Ramka** | `border` | kompozyt | width 0-10px, style, color | `none` | ✅ | ✅ |
| **Zaokrąglenie** | `border-radius` | range | 0-30px | `0px` | ✅ | ✅ |
| **Cień** | `box-shadow` | text | dowolna | `none` | ✅ | ✅ |

**Pokrycie:** 11/11 właściwości ✅

---

### 2.2 Co MOŻNA ale NIE JEST stylizowane?

Poniżej lista właściwości CSS, które mogłyby być stylizowane dla `<table>`, ale obecnie nie są obsługiwane:

| Właściwość CSS | Opis | Potencjalny typ kontrolki | Priorytet |
|----------------|------|---------------------------|-----------|
| `border-spacing` | Odstęp między komórkami (gdy border-collapse: separate) | range (0-20px) | 🟡 Średni |
| `caption-side` | Pozycja podpisu tabeli | select (top/bottom) | 🟢 Niski |
| `empty-cells` | Pokazywanie pustych komórek | select (show/hide) | 🟢 Niski |
| `table-layout` | Algorytm układu tabeli | select (auto/fixed) | 🟡 Średni |
| `max-width` | Maksymalna szerokość | text/range | 🟡 Średni |
| `min-width` | Minimalna szerokość | text/range | 🟡 Średni |
| `padding` | Wewnętrzny odstęp tabeli | 4x range | 🟢 Niski |
| `text-align` | Wyrównanie tekstu w całej tabeli | select (left/center/right) | 🔴 Wysoki |
| `vertical-align` | Wyrównanie pionowe | select (top/middle/bottom) | 🟡 Średni |
| `font-weight` | Grubość czcionki | select/range (100-900) | 🔴 Wysoki |
| `font-style` | Styl czcionki | select (normal/italic/oblique) | 🟡 Średni |
| `text-transform` | Transformacja tekstu | select (none/uppercase/lowercase/capitalize) | 🟡 Średni |
| `letter-spacing` | Odstęp między literami | range (-2px do 10px) | 🟢 Niski |
| `border-top` | Górna ramka (osobna) | border (kompozyt) | 🟡 Średni |
| `border-right` | Prawa ramka (osobna) | border (kompozyt) | 🟡 Średni |
| `border-bottom` | Dolna ramka (osobna) | border (kompozyt) | 🟡 Średni |
| `border-left` | Lewa ramka (osobna) | border (kompozyt) | 🟡 Średni |
| `outline` | Obramowanie zewnętrzne | border (kompozyt) | 🟢 Niski |
| `opacity` | Przezroczystość | range (0-1) | 🟢 Niski |
| `overflow` | Zachowanie przy przepełnieniu | select (visible/hidden/scroll/auto) | 🟡 Średni |

**Razem:** 20 potencjalnych właściwości do dodania

---

## 3. ANALIZA STYLIZACJI DLA HEADER

### 3.1 Co można obecnie stylizować?

| Właściwość | CSS Property | Kontrolka | Zakres/Opcje | Domyślna wartość | Obsługa w Generate CSS | Obsługa w Load CSS |
|------------|--------------|-----------|--------------|------------------|------------------------|-------------------|
| **Tło** | `background` | color | picker | `transparent` | ✅ | ✅ |
| **Kolor tekstu** | `color` | color | picker | `inherit` | ✅ | ✅ |
| **Rozmiar czcionki** | `font-size` | range | 10-40px | `inherit` | ✅ | ✅ |
| **Ramka** | `border` | kompozyt | width 0-10px, style, color | `none` | ✅ | ✅ |

**Pokrycie:** 4/4 właściwości ✅

---

### 3.2 Co MOŻNA ale NIE JEST stylizowane?

| Właściwość CSS | Opis | Potencjalny typ kontrolki | Priorytet |
|----------------|------|---------------------------|-----------|
| `font-weight` | Grubość czcionki (domyślnie `<th>` jest bold) | select/range (100-900) | 🔴 Wysoki |
| `text-align` | Wyrównanie tekstu | select (left/center/right) | 🔴 Wysoki |
| `vertical-align` | Wyrównanie pionowe | select (top/middle/bottom) | 🟡 Średni |
| `padding` | Wewnętrzny odstęp | 4x range | 🟡 Średni |
| `text-transform` | Transformacja tekstu | select (none/uppercase/lowercase/capitalize) | 🟡 Średni |
| `border-bottom` | Dolna ramka (często używana do podkreślenia) | border (kompozyt) | 🔴 Wysoki |
| `background-image` | Obrazek tła | text (URL) lub file picker | 🟢 Niski |
| `font-style` | Styl czcionki | select (normal/italic/oblique) | 🟢 Niski |
| `letter-spacing` | Odstęp między literami | range (-2px do 10px) | 🟢 Niski |
| `position` | Pozycjonowanie (dla sticky header) | select (static/sticky) | 🟡 Średni |
| `top` | Pozycja dla sticky header | range/text | 🟡 Średni |
| `z-index` | Warstwa dla sticky header | number | 🟡 Średni |

**Razem:** 12 potencjalnych właściwości do dodania

---

## 4. ANALIZA STYLIZACJI DLA FOOTER

### 4.1 Co można obecnie stylizować?

| Właściwość | CSS Property | Kontrolka | Zakres/Opcje | Domyślna wartość | Obsługa w Generate CSS | Obsługa w Load CSS |
|------------|--------------|-----------|--------------|------------------|------------------------|-------------------|
| **Tło** | `background` | color | picker | `transparent` | ✅ | ✅ |
| **Kolor tekstu** | `color` | color | picker | `inherit` | ✅ | ✅ |
| **Rozmiar czcionki** | `font-size` | range | 10-40px | `inherit` | ✅ | ✅ |
| **Ramka** | `border` | kompozyt | width 0-10px, style, color | `none` | ✅ | ✅ |

**Pokrycie:** 4/4 właściwości ✅

---

### 4.2 Co MOŻNA ale NIE JEST stylizowane?

| Właściwość CSS | Opis | Potencjalny typ kontrolki | Priorytet |
|----------------|------|---------------------------|-----------|
| `font-weight` | Grubość czcionki | select/range (100-900) | 🟡 Średni |
| `text-align` | Wyrównanie tekstu | select (left/center/right) | 🔴 Wysoki |
| `vertical-align` | Wyrównanie pionowe | select (top/middle/bottom) | 🟡 Średni |
| `padding` | Wewnętrzny odstęp | 4x range | 🟡 Średni |
| `text-transform` | Transformacja tekstu | select (none/uppercase/lowercase/capitalize) | 🟢 Niski |
| `border-top` | Górna ramka (często używana do oddzielenia) | border (kompozyt) | 🔴 Wysoki |
| `font-style` | Styl czcionki | select (normal/italic/oblique) | 🟢 Niski |
| `letter-spacing` | Odstęp między literami | range (-2px do 10px) | 🟢 Niski |

**Razem:** 8 potencjalnych właściwości do dodania

---

## 5. ANALIZA STYLIZACJI DLA BODY

### 5.1 Co można obecnie stylizować?

| Właściwość | CSS Property | Kontrolka | Zakres/Opcje | Domyślna wartość | Obsługa w Generate CSS | Obsługa in Load CSS |
|------------|--------------|-----------|--------------|------------------|------------------------|-------------------|
| **Tło** | `background` | color | picker | `transparent` | ✅ | ✅ |
| **Kolor tekstu** | `color` | color | picker | `inherit` | ✅ | ✅ |
| **Rozmiar czcionki** | `font-size` | range | 10-40px | `inherit` | ✅ | ✅ |

**Pokrycie:** 3/3 właściwości ✅

---

### 5.2 Co MOŻNA ale NIE JEST stylizowane?

| Właściwość CSS | Opis | Potencjalny typ kontrolki | Priorytet |
|----------------|------|---------------------------|-----------|
| `font-weight` | Grubość czcionki | select/range (100-900) | 🟡 Średni |
| `font-style` | Styl czcionki | select (normal/italic/oblique) | 🟢 Niski |
| `text-align` | Wyrównanie tekstu | select (left/center/right) | 🔴 Wysoki |
| `vertical-align` | Wyrównanie pionowe | select (top/middle/bottom) | 🟡 Średni |
| `padding` | Wewnętrzny odstęp | 4x range | 🟢 Niski |
| `border` | Ramka dla całego body | border (kompozyt) | 🟢 Niski |

**Razem:** 6 potencjalnych właściwości do dodania

---

## 6. ANALIZA STYLIZACJI DLA CELLS

### 6.1 Co można obecnie stylizować?

| Właściwość | CSS Property | Kontrolka | Zakres/Opcje | Domyślna wartość | Obsługa w Generate CSS | Obsługa w Load CSS |
|------------|--------------|-----------|--------------|------------------|------------------------|-------------------|
| **Ramka** | `border` | kompozyt | width 0-10px, style, color | `none` | ✅ | ✅ |
| **Padding X** | `padding` (left/right) | range | 0-40px | `8px` | ✅ | ✅ |
| **Padding Y** | `padding` (top/bottom) | range | 0-40px | `6px` | ✅ | ✅ |

**Pokrycie:** 3/3 właściwości ✅

**Uwaga:** Padding jest reprezentowany jako 2 osobne kontrolki (X i Y), co daje elastyczność ale upraszcza interfejs.

---

### 6.2 Co MOŻNA ale NIE JEST stylizowane?

| Właściwość CSS | Opis | Potencjalny typ kontrolki | Priorytet |
|----------------|------|---------------------------|-----------|
| `background` | Tło komórki | color picker | 🟡 Średni |
| `color` | Kolor tekstu w komórce | color picker | 🟡 Średni |
| `text-align` | Wyrównanie tekstu | select (left/center/right) | 🔴 Wysoki |
| `vertical-align` | Wyrównanie pionowe | select (top/middle/bottom) | 🔴 Wysoki |
| `width` | Szerokość komórki | text/range | 🟡 Średni |
| `height` | Wysokość komórki | text/range | 🟡 Średni |
| `min-width` | Minimalna szerokość | text/range | 🟡 Średni |
| `max-width` | Maksymalna szerokość | text/range | 🟢 Niski |
| `white-space` | Zachowanie białych znaków | select (normal/nowrap/pre/pre-wrap) | 🟡 Średni |
| `overflow` | Zachowanie przy przepełnieniu | select (visible/hidden/scroll/auto) | 🟢 Niski |
| `text-overflow` | Zachowanie tekstu przy przepełnieniu | select (clip/ellipsis) | 🟡 Średni |
| `font-weight` | Grubość czcionki | select/range (100-900) | 🟡 Średni |
| `font-style` | Styl czcionki | select (normal/italic/oblique) | 🟢 Niski |
| `font-size` | Rozmiar czcionki | range (10-40px) | 🟡 Średni |
| `border-top` | Górna ramka (osobna) | border (kompozyt) | 🟡 Średni |
| `border-right` | Prawa ramka (osobna) | border (kompozyt) | 🟡 Średni |
| `border-bottom` | Dolna ramka (osobna) | border (kompozyt) | 🟡 Średni |
| `border-left` | Lewa ramka (osobna) | border (kompozyt) | 🟡 Średni |

**Razem:** 18 potencjalnych właściwości do dodania

---

## 7. ANALIZA STYLIZACJI DLA ROWS

### 7.1 Co można obecnie stylizować?

| Właściwość | CSS Property | Kontrolka | Zakres/Opcje | Domyślna wartość | Obsługa w Generate CSS | Obsługa w Load CSS |
|------------|--------------|-----------|--------------|------------------|------------------------|-------------------|
| **Tło wiersza** | `background` (tr) | color | picker | `transparent` | ✅ | ✅ |
| **Ramka dolna** | `border-bottom` (tr) | kompozyt | width 0-10px, style, color | `none` | ✅ | ✅ |
| **Tło parzystych** | `background` (tr:nth-child(even)) | color | picker | `transparent` | ✅ | ✅ |
| **Tło hover** | `background` (tr:hover) | color | picker | `transparent` | ✅ | ✅ |

**Pokrycie:** 4/4 właściwości ✅

**Uwaga:** Obsługiwane są 3 stany wierszy:
1. Domyślne tło (`--et-row-bg`)
2. Parzyste wiersze - efekt zebry (`--et-stripe-bg`)
3. Najechanie myszką - efekt hover (`--et-hover-bg`)

---

### 7.2 Co MOŻNA ale NIE JEST stylizowane?

| Właściwość CSS | Opis | Potencjalny typ kontrolki | Priorytet |
|----------------|------|---------------------------|-----------|
| **Dla wszystkich wierszy (tr):** |
| `height` | Wysokość wiersza | text/range | 🟡 Średni |
| `min-height` | Minimalna wysokość | text/range | 🟢 Niski |
| `border-top` | Górna ramka | border (kompozyt) | 🟡 Średni |
| `border` | Pełna ramka (wszystkie strony) | border (kompozyt) | 🟢 Niski |
| `color` | Kolor tekstu | color picker | 🟡 Średni |
| **Dla nieparzystych wierszy (tr:nth-child(odd)):** |
| `background` | Tło nieparzystych (alternatywa do parzystych) | color picker | 🔴 Wysoki |
| **Dla pierwszego wiersza (tr:first-child):** |
| `background` | Tło pierwszego wiersza | color picker | 🟡 Średni |
| `font-weight` | Grubość czcionki | select/range | 🟡 Średni |
| **Dla ostatniego wiersza (tr:last-child):** |
| `background` | Tło ostatniego wiersza | color picker | 🟡 Średni |
| `border-bottom` | Ramka dolna (często silniejsza) | border (kompozyt) | 🟡 Średni |
| **Dla efektu hover:** |
| `color` | Kolor tekstu przy hover | color picker | 🟡 Średni |
| `cursor` | Kursor przy hover | select (default/pointer/help) | 🟡 Średni |
| `transform` | Transformacja (np. scale) | text | 🟢 Niski |
| `box-shadow` | Cień przy hover | text | 🟡 Średni |
| **Transitions (animacje):** |
| `transition` | Płynne przejścia | text lub kompozyt | 🟡 Średni |

**Razem:** 15 potencjalnych właściwości do dodania

---

## 8. POTENCJALNE ROZSZERZENIA

### 8.1 Priorytety rozwoju - WŁAŚCIWOŚCI WYSOKIEGO PRIORYTETU 🔴

Te właściwości są najbardziej pożądane przez użytkowników i powinny być dodane w pierwszej kolejności:

| Właściwość | Sekcja | Opis | Typ kontrolki |
|------------|--------|------|---------------|
| `text-align` | Table, Header, Footer, Body, Cells | Wyrównanie tekstu (left/center/right/justify) | select |
| `vertical-align` | Header, Footer, Body, Cells | Wyrównanie pionowe (top/middle/bottom) | select |
| `font-weight` | Table, Header, Footer, Body, Cells | Grubość czcionki (normal/bold lub 100-900) | select lub range |
| `border-bottom` | Header, Footer | Ramka dolna dla separacji sekcji | border (kompozyt) |
| `background` (odd rows) | Rows | Tło nieparzystych wierszy (alternatywa do stripe) | color picker |

**Uzasadnienie:**
- `text-align` i `vertical-align` - podstawowe właściwości typograficzne, bardzo często używane
- `font-weight` - ważne dla hierarchii wizualnej (nagłówki pogrubione)
- `border-bottom` dla header/footer - bardzo popularny wzorzec projektowy (linia oddzielająca)
- `background` dla nieparzystych wierszy - kompletuje efekt zebry

---

### 8.2 Właściwości średniego priorytetu 🟡

| Właściwość | Sekcja | Opis |
|------------|--------|------|
| `border-spacing` | Table | Odstęp między komórkami (gdy border-collapse: separate) |
| `table-layout` | Table | Algorytm układu (auto/fixed) |
| `max-width`, `min-width` | Table | Ograniczenia szerokości |
| `text-transform` | Table, Header, Footer | Transformacja tekstu (uppercase/lowercase/capitalize) |
| `padding` | Header, Footer, Body | Wewnętrzny odstęp sekcji |
| `width`, `height` | Cells, Rows | Wymiary komórek i wierszy |
| `white-space` | Cells | Zachowanie białych znaków (nowrap/pre/normal) |
| `text-overflow` | Cells | Zachowanie tekstu (ellipsis/clip) |
| `color` (hover) | Rows | Kolor tekstu przy hover |
| `box-shadow` (hover) | Rows | Cień przy hover |

---

### 8.3 Właściwości niskiego priorytetu 🟢

| Właściwość | Sekcja | Opis |
|------------|--------|------|
| `caption-side` | Table | Pozycja podpisu tabeli |
| `empty-cells` | Table | Pokazywanie pustych komórek |
| `letter-spacing` | All | Odstęp między literami |
| `font-style` | All | Styl czcionki (italic/oblique) |
| `outline` | Table | Obramowanie zewnętrzne |
| `opacity` | Table | Przezroczystość |
| `overflow` | Table, Cells | Zachowanie przy przepełnieniu |
| `background-image` | Header, Footer | Obrazek tła |
| `position`, `top`, `z-index` | Header | Sticky header |
| `transform` | Rows (hover) | Transformacja przy hover |
| `transition` | Rows | Animacje przejść |

---

### 8.4 Zaawansowane funkcje (przyszłość)

#### A) Osobne ramki dla stron (border-top/right/bottom/left)

**Problem:** Obecnie border jest jedną właściwością dla wszystkich stron.
**Rozwiązanie:** Dodać kontrolki dla każdej strony osobno (similar do margin).

**Korzyści:**
- Większa elastyczność (np. tylko bottom border dla header)
- Popularne w designach tabel

**Implementacja:**
- Typ kontrolki: `border-sides` (4x kompozyt: top, right, bottom, left)
- Sub-variables: `--et-header-border-top-width`, `--et-header-border-top-style`, etc.

---

#### B) Gradientowe tła

**Problem:** Obecnie tylko jednolite kolory dla background.
**Rozwiązanie:** Dodać obsługę gradientów.

**Implementacja:**
- Rozszerzenie kontrolki `color` o przycisk "Gradient"
- Interfejs do tworzenia gradientu (2+ kolory, kierunek)
- Generowanie CSS: `background: linear-gradient(...)`

---

#### C) Cienie dla komórek i wierszy

**Problem:** `box-shadow` jest tylko dla tabeli głównej.
**Rozwiązanie:** Dodać `box-shadow` dla cells i rows.

**Implementacja:**
- Typ kontrolki: `shadow` (kompozyt: offset-x, offset-y, blur, spread, color)
- Sub-variables dla każdej wartości

---

#### D) Różne style dla pierwszego/ostatniego wiersza/kolumny

**Problem:** Brak wsparcia dla `:first-child`, `:last-child`.
**Rozwiązanie:** Dodać osobne sekcje w interfejsie.

**Implementacja:**
- Nowa sekcja "Special Rows" z kontrolkami:
  - First row BG, Last row BG
  - First row border, Last row border
- Generowanie CSS z selektorami `:first-child`, `:last-child`

---

#### E) Sticky header/footer

**Problem:** Brak wsparcia dla `position: sticky`.
**Rozwiązanie:** Dodać checkbox "Sticky header" i kontrolki `top`, `z-index`.

**Implementacja:**
- Checkbox "Sticky header" → włącza `position: sticky`
- Range `top` (0-100px) → pozycja od góry
- Range `z-index` (0-100) → warstwa

---

#### F) Responsywność (Media Queries)

**Problem:** Brak wsparcia dla różnych stylów na różnych ekranach.
**Rozwiązanie:** Dodać sekcję "Responsive" z breakpoints.

**Implementacja:**
- Predefiniowane breakpoints (mobile/tablet/desktop)
- Możliwość ustawienia innych wartości dla każdego breakpoint
- Generowanie CSS z `@media` queries

---

### 8.5 Potencjalne problemy i ich rozwiązania

#### Problem 1: Przeciążony interfejs

**Opis:** Dodanie wszystkich właściwości sprawi, że interfejs będzie bardzo długi i przytłaczający.

**Rozwiązania:**
1. **Zakładki/Accordion:** Grupowanie kontrolek w zwijane sekcje
2. **Tryb Basic/Advanced:** Domyślnie pokazywać tylko najważniejsze kontrolki
3. **Wyszukiwarka:** Pole do szybkiego znalezienia kontrolki
4. **Presety:** Gotowe szablony (np. "Minimal", "Corporate", "Colorful")

---

#### Problem 2: Kompatybilność z Load CSS

**Opis:** Nowe właściwości muszą być parsowalne w funkcji `loadCSS()`.

**Rozwiązanie:**
- Rozszerzenie `mapCssToVar()` o nowe mapowania
- Dodanie nowych funkcji parsujących (similar do `parseBorderValue()`)
- Testy kompatybilności wstecznej

---

#### Problem 3: Neutralne wartości domyślne

**Opis:** Każda nowa właściwość wymaga zdefiniowania neutralnej wartości domyślnej.

**Rozwiązanie:**
- Dokumentacja jasno definiuje neutralne wartości
- Wszystkie nowe właściwości muszą mieć `default` w `sections` array
- Funkcja `css()` zawsze używa domyślnych wartości

---

## 9. WNIOSKI

### 9.1 Stan aktualny (po Iteracji 03)

✅ **Mocne strony:**
- 100% pokrycie zdefiniowanych CSS variables kontrolkami w JS
- Pełna synchronizacja dwukierunkowa (UI ↔ CSS)
- Solidna obsługa złożonych właściwości (border, margin)
- Neutralne wartości domyślne we wszystkich kontrolkach
- Kompletne wsparcie dla Generate CSS i Load CSS

✅ **Osiągnięcia:**
- **29 CSS variables** zdefiniowanych w style.css
- **18 sub-variables** dla złożonych właściwości (tylko w JS)
- **29 kontrolek UI** w interfejsie edytora
- **6 sekcji** tematycznych (Table, Header, Footer, Body, Cells, Rows)

---

### 9.2 Potencjał rozwoju

📊 **Statystyki:**
- **Obecnie obsługiwane:** 29 właściwości głównych
- **Potencjalne rozszerzenia:** ~94 dodatkowe właściwości
- **Właściwości wysokiego priorytetu:** 5
- **Właściwości średniego priorytetu:** 10
- **Właściwości niskiego priorytetu:** 11

🎯 **Rekomendacje:**
1. **Krótkoterminowo (User Story 7):** Dodać 5 właściwości wysokiego priorytetu (text-align, vertical-align, font-weight, border-bottom dla sekcji, background dla nieparzystych wierszy)
2. **Średnioterminowo:** Dodać właściwości średniego priorytetu według potrzeb użytkowników
3. **Długoterminowo:** Zaawansowane funkcje (gradienty, cienie, sticky header, responsywność)

---

### 9.3 Techniczne uwagi

⚠️ **Ograniczenia:**
- Range inputy mają sztywne limity (np. border-width 0-10px) - może być za mało dla niektórych przypadków
- Color picker nie obsługuje `transparent` natywnie - wymaga dodatkowych kontrolek
- Text inputy dla złożonych wartości (shadow, gradient) wymagają znajomości CSS

✅ **Dobre praktyki:**
- Sub-variables pozwalają na precyzyjną kontrolę i parsowanie
- Kompozytowe kontrolki (border, margin) znacznie poprawiają UX
- Mapowanie w `mapCssToVar()` jest przejrzyste i łatwe do rozbudowy

---

**Koniec dokumentu**
**Data:** 22.04.2026
**Wersja:** 1.0
