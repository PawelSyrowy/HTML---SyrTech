# Iteracja 05 - Raport
**Data:** 23.04.2026
**User Story:** 4. Brak możliwości włączania/wyłączania header i footer
**Status:** TEST (oczekuje na manualne testy)

---

## 1. Podsumowanie

Iteracja 05 skupiła się na implementacji User Story 4, które wymagało dodania możliwości włączania i wyłączania sekcji header (`<thead>`) i footer (`<tfoot>`) w tabeli. Zgodnie z assumptions.txt punkt 5, użytkownik powinien mieć możliwość decydowania, czy przykładowa tabela zawiera nagłówek i stopkę.

**Główne osiągnięcia:**
- ✅ Dodano checkboxy "Show Header" i "Show Footer" w sekcji Table
- ✅ Dynamiczne ukrywanie/pokazywanie sekcji `<thead>` i `<tfoot>` w tabeli podglądu
- ✅ Dynamiczne ukrywanie/pokazywanie zakładek Header i Footer w górnym pasku
- ✅ Inteligentna nawigacja - automatyczne przełączenie na zakładkę Table przy wyłączeniu aktywnej zakładki
- ✅ Generate CSS pomija sekcje thead/tfoot gdy są wyłączone
- ✅ Pełna integracja z systemem resetowania (Reset Control, Reset Section, Reset All)
- ✅ Obsługa checkboxów w funkcji updateInputs() dla kompatybilności z Load CSS

---

## 2. Problem

Przed tą iteracją:
- Użytkownik nie miał możliwości ukrycia header lub footer w przykładowej tabeli
- Zakładki Header i Footer były zawsze widoczne, nawet gdy użytkownik nie potrzebował tych sekcji
- Generate CSS zawsze generował style dla thead i tfoot, nawet gdy użytkownik nie używał tych elementów
- Nie było zgodności z assumptions.txt punkt 5: *"Przykładowa tabela powinna mieć możliwość włączenie i wyłączenia headera i footera"*

---

## 3. Rozwiązanie

### 3.1. Dodanie checkboxów w sekcji Table

Dodano dwie nowe kontrolki typu `checkbox` jako pierwsze elementy w sekcji Table:

```javascript
{
  title: "Table",
  controls: [
    { label: "Show Header", var: "--et-show-header", type: "checkbox", default: true },
    { label: "Show Footer", var: "--et-show-footer", type: "checkbox", default: true },
    { label: "Width", var: "--et-width", type: "text", default: "100%" },
    // ... pozostałe kontrolki
  ],
}
```

**Domyślne wartości:** `true` - header i footer są domyślnie widoczne, zachowując obecne zachowanie aplikacji.

### 3.2. Implementacja obsługi checkboxów w createControl()

Dodano nowy blok w funkcji `createControl()` obsługujący `type === "checkbox"`:

```javascript
if (ctrl.type === "checkbox") {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.dataset.var = ctrl.var;
  checkbox.checked = ctrl.default === true;

  // Ustawiamy domyślną wartość
  tableConfig[ctrl.var] = ctrl.default;

  // Obsługa zmiany wartości
  checkbox.addEventListener("change", (e) => {
    const isChecked = e.target.checked;
    tableConfig[ctrl.var] = isChecked;

    // Specjalna obsługa dla Show Header
    if (ctrl.var === "--et-show-header") {
      const thead = editableTable.querySelector("thead");
      const headerTab = document.getElementById("headerTab");
      if (thead) {
        thead.style.display = isChecked ? "" : "none";
      }
      if (headerTab) {
        headerTab.style.display = isChecked ? "" : "none";
        // Jeśli Header tab jest aktywny i wyłączamy header, przełącz na Table
        if (!isChecked && headerTab.classList.contains("active")) {
          switchTab("table");
        }
      }
    }

    // Specjalna obsługa dla Show Footer
    if (ctrl.var === "--et-show-footer") {
      const tfoot = editableTable.querySelector("tfoot");
      const footerTab = document.getElementById("footerTab");
      if (tfoot) {
        tfoot.style.display = isChecked ? "" : "none";
      }
      if (footerTab) {
        footerTab.style.display = isChecked ? "" : "none";
        // Jeśli Footer tab jest aktywny i wyłączamy footer, przełącz na Table
        if (!isChecked && footerTab.classList.contains("active")) {
          switchTab("table");
        }
      }
    }
  });

  wrapper.appendChild(checkbox);
  return wrapper;
}
```

**Logika:**
1. **Ukrywanie sekcji tabeli:** `thead.style.display = isChecked ? "" : "none"`
2. **Ukrywanie zakładek:** `headerTab.style.display = isChecked ? "" : "none"`
3. **Inteligentna nawigacja:** Jeśli użytkownik jest na zakładce Header/Footer i ją wyłącza, automatycznie przełączamy na zakładkę Table

### 3.3. Identyfikatory dla zakładek Header i Footer

W pliku `index.html` dodano atrybuty `id` dla zakładek Header i Footer:

```html
<button class="tab-btn" data-tab="header" id="headerTab">Header</button>
<button class="tab-btn" data-tab="footer" id="footerTab">Footer</button>
```

Umożliwia to dynamiczne manipulowanie widocznością zakładek przez JavaScript.

### 3.4. Modyfikacja funkcji getTableCSS()

Funkcja `getTableCSS()` została zmodyfikowana, aby warunkowo generować sekcje `thead` i `tfoot`:

```javascript
function getTableCSS(className) {
  // Sprawdź czy header i footer są włączone
  const showHeader = tableConfig["--et-show-header"] !== false;
  const showFooter = tableConfig["--et-show-footer"] !== false;

  // Sekcja thead - tylko jeśli header jest włączony
  const theadSection = showHeader ? `
.${className} thead {
${css("background", tableConfig["--et-header-bg"], "transparent")}
${css("color", tableConfig["--et-header-color"], "inherit")}
${css("font-size", tableConfig["--et-header-font-size"], "inherit")}
${css("border", tableConfig["--et-header-border"], "none")}
}
` : '';

  // Sekcja tfoot - tylko jeśli footer jest włączony
  const tfootSection = showFooter ? `
.${className} tfoot {
${css("background", tableConfig["--et-footer-bg"], "transparent")}
${css("color", tableConfig["--et-footer-color"], "inherit")}
${css("font-size", tableConfig["--et-footer-font-size"], "inherit")}
${css("border", tableConfig["--et-footer-border"], "none")}
}
` : '';

  return `
.${className} {
  // ... style główne tabeli
}
${theadSection}${tfootSection}
.${className} tbody {
  // ... style tbody
}
// ... pozostałe sekcje
`;
}
```

**Korzyści:**
- Wygenerowany CSS jest czystszy - nie zawiera niepotrzebnych sekcji
- Użytkownik otrzymuje tylko te style, których naprawdę potrzebuje
- Mniejszy rozmiar wygenerowanego kodu CSS

### 3.5. Obsługa resetowania checkboxów

Dodano obsługę checkboxów w funkcji `resetControl()`:

```javascript
function resetControl(ctrl) {
  // ... obsługa border i margin

  if (ctrl.type === "checkbox") {
    // Reset checkbox - przywróć wartość domyślną
    const defaultVal = ctrl.default === true;
    tableConfig[ctrl.var] = defaultVal;

    // Specjalna obsługa dla Show Header
    if (ctrl.var === "--et-show-header") {
      const thead = editableTable.querySelector("thead");
      const headerTab = document.getElementById("headerTab");
      if (thead) {
        thead.style.display = defaultVal ? "" : "none";
      }
      if (headerTab) {
        headerTab.style.display = defaultVal ? "" : "none";
      }
    }

    // Specjalna obsługa dla Show Footer
    if (ctrl.var === "--et-show-footer") {
      const tfoot = editableTable.querySelector("tfoot");
      const footerTab = document.getElementById("footerTab");
      if (tfoot) {
        tfoot.style.display = defaultVal ? "" : "none";
      }
      if (footerTab) {
        footerTab.style.display = defaultVal ? "" : "none";
      }
    }
  }

  // ... obsługa innych typów kontrolek

  updateInputs();
}
```

**Integracja z systemem resetowania:**
- ✅ Reset Control - resetuje pojedynczy checkbox do wartości domyślnej (true)
- ✅ Reset Section - resetuje oba checkboxy w sekcji Table
- ✅ Reset All - resetuje wszystkie kontrolki włącznie z checkboxami

### 3.6. Obsługa checkboxów w updateInputs()

Dodano obsługę checkboxów w funkcji `updateInputs()` dla kompatybilności z Load CSS:

```javascript
function updateInputs() {
  // Aktualizacja standardowych inputów (text, range, color, checkbox)
  document.querySelectorAll(".et-control input").forEach((input) => {
    const v = input.dataset.var;
    if (!v) return;

    const val = tableConfig[v];

    // Obsługa checkbox
    if (input.type === "checkbox") {
      input.checked = val === true;
      return;
    }

    // ... obsługa innych typów inputów
  });

  // ... obsługa selectów, border, margin
}
```

**Korzyści:**
- Checkboxy są prawidłowo aktualizowane po wczytaniu CSS
- Synchronizacja stanu checkboxów z `tableConfig`

---

## 4. Testowanie

### 4.1. Scenariusze testowe

**Test 1: Wyłączanie Header**
1. Otwórz aplikację - domyślnie checkbox "Show Header" jest zaznaczony
2. Odznacz checkbox "Show Header"
3. **Oczekiwany rezultat:**
   - Sekcja `<thead>` znika z tabeli podglądu
   - Zakładka "Header" znika z górnego paska
   - Jeśli byłeś na zakładce Header, następuje automatyczne przełączenie na Table

**Test 2: Wyłączanie Footer**
1. Odznacz checkbox "Show Footer"
2. **Oczekiwany rezultat:**
   - Sekcja `<tfoot>` znika z tabeli podglądu
   - Zakładka "Footer" znika z górnego paska
   - Jeśli byłeś na zakładce Footer, następuje automatyczne przełączenie na Table

**Test 3: Generate CSS z wyłączonym Header**
1. Odznacz checkbox "Show Header"
2. Wpisz nazwę klasy np. "my-table"
3. Kliknij "Generate CSS"
4. **Oczekiwany rezultat:**
   - Wygenerowany CSS NIE zawiera sekcji `.my-table thead { ... }`
   - Wygenerowany CSS zawiera sekcję `.my-table tfoot { ... }` (footer jest włączony)

**Test 4: Generate CSS z wyłączonym Footer**
1. Zaznacz checkbox "Show Header" (włączony)
2. Odznacz checkbox "Show Footer"
3. Kliknij "Generate CSS"
4. **Oczekiwany rezultat:**
   - Wygenerowany CSS zawiera sekcję `.my-table thead { ... }`
   - Wygenerowany CSS NIE zawiera sekcji `.my-table tfoot { ... }`

**Test 5: Generate CSS z wyłączonym Header i Footer**
1. Odznacz oba checkboxy
2. Kliknij "Generate CSS"
3. **Oczekiwany rezultat:**
   - Wygenerowany CSS NIE zawiera sekcji `.my-table thead { ... }`
   - Wygenerowany CSS NIE zawiera sekcji `.my-table tfoot { ... }`
   - Wygenerowany CSS zawiera pozostałe sekcje (tbody, th/td, tr, itp.)

**Test 6: Reset Control dla checkboxa**
1. Odznacz checkbox "Show Header"
2. Kliknij przycisk reset obok checkboxa "Show Header"
3. **Oczekiwany rezultat:**
   - Checkbox "Show Header" jest ponownie zaznaczony
   - Sekcja `<thead>` pojawia się w tabeli podglądu
   - Zakładka "Header" pojawia się w górnym pasku

**Test 7: Reset Section dla Table**
1. Odznacz oba checkboxy
2. Zmień wartość Width na "50%"
3. Kliknij "Reset Section"
4. **Oczekiwany rezultat:**
   - Oba checkboxy są ponownie zaznaczone
   - Width wraca do "100%"
   - Sekcje thead i tfoot pojawiają się w tabeli
   - Zakładki Header i Footer pojawiają się w górnym pasku

**Test 8: Reset All**
1. Odznacz oba checkboxy
2. Zmień kilka wartości w różnych sekcjach
3. Kliknij "Reset All"
4. **Oczekiwany rezultat:**
   - Wszystkie wartości wracają do domyślnych
   - Oba checkboxy są ponownie zaznaczone
   - Tabela wygląda jak po pierwszym załadowaniu aplikacji

**Test 9: Włączanie Header po wyłączeniu**
1. Odznacz checkbox "Show Header"
2. Zaznacz checkbox "Show Header"
3. **Oczekiwany rezultat:**
   - Sekcja `<thead>` pojawia się w tabeli podglądu
   - Zakładka "Header" pojawia się w górnym pasku
   - Można kliknąć na zakładkę Header i zobaczyć kontrolki

**Test 10: Nawigacja - wyłączenie aktywnej zakładki**
1. Kliknij na zakładkę "Header"
2. Odznacz checkbox "Show Header" w sekcji Table
3. **Oczekiwany rezultat:**
   - Następuje automatyczne przełączenie na zakładkę "Table"
   - Zakładka "Header" znika z paska
   - Nie ma błędów w konsoli

### 4.2. Testy kompatybilności

**Test Load CSS (w przyszłości):**
- Obecnie Load CSS nie parsuje checkboxów
- W przyszłości można dodać parsowanie komentarzy w CSS lub metadanych
- Funkcja `updateInputs()` jest już gotowa na obsługę checkboxów

---

## 5. Zmiany w plikach

### 5.1. index.html
- **Dodano:** `id="headerTab"` dla zakładki Header
- **Dodano:** `id="footerTab"` dla zakładki Footer
- **Liczba zmian:** 2 linie

### 5.2. js/script.js
- **Dodano:** Dwie kontrolki typu checkbox w sekcji Table (~4 linie)
- **Dodano:** Blok obsługi checkbox w createControl() (~50 linii)
- **Zmodyfikowano:** getTableCSS() - warunkowo generuje thead/tfoot (~30 linii)
- **Dodano:** Obsługa checkbox w resetControl() (~30 linii)
- **Dodano:** Obsługa checkbox w updateInputs() (~5 linii)
- **Liczba zmian:** ~120 linii

### 5.3. css/style.css
- Brak zmian w tej iteracji

---

## 6. Analiza decyzji projektowych

### 6.1. Dlaczego checkboxy są w sekcji Table, a nie osobno?

**Decyzja:** Checkboxy "Show Header" i "Show Footer" umieszczono jako pierwsze kontrolki w sekcji Table.

**Uzasadnienie:**
- ✅ Semantycznie poprawne - są to ustawienia globalne dotyczące całej tabeli
- ✅ Łatwo dostępne - sekcja Table jest domyślnie aktywna przy uruchomieniu
- ✅ Nie wymagają osobnej zakładki - użytkownik nie musi przełączać się między zakładkami
- ✅ Logiczne - najpierw decydujesz co ma zawierać tabela, potem stylujesz poszczególne sekcje

**Alternatywne rozwiązania:**
- ❌ Osobna zakładka "Settings" - dodatkowa złożoność, więcej kliknięć
- ❌ W sekcjach Header/Footer - nie można wyłączyć gdy jesteś na wyłączonej zakładce
- ❌ W górnym pasku - brak miejsca, przytłaczająca ilość elementów

### 6.2. Dlaczego zakładki Header/Footer znikają gdy są wyłączone?

**Decyzja:** Zakładki Header i Footer są dynamicznie ukrywane gdy odpowiednie checkboxy są odznaczone.

**Uzasadnienie:**
- ✅ Czytelniejszy interfejs - użytkownik nie widzi zakładek dla nieaktywnych sekcji
- ✅ Zapobiega pomyłkom - nie można kliknąć na zakładkę Header gdy header jest wyłączony
- ✅ Wizualna informacja zwrotna - użytkownik od razu widzi efekt wyłączenia checkboxa
- ✅ Zgodność z UX - nieaktywne elementy są ukryte, a nie tylko disabled

**Alternatywne rozwiązania:**
- ❌ Zakładki disabled ale widoczne - mylące dla użytkownika
- ❌ Zakładki widoczne z informacją "Header is disabled" - niepotrzebny clutter

### 6.3. Dlaczego domyślna wartość to `true`?

**Decyzja:** Checkboxy są domyślnie zaznaczone (header i footer włączone).

**Uzasadnienie:**
- ✅ Zachowanie wstecznej kompatybilności - aplikacja działa tak samo jak przed tą iteracją
- ✅ Najczęstszy przypadek użycia - większość tabel ma header
- ✅ Bezpieczniejsze - użytkownik widzi wszystkie możliwości od razu
- ✅ Edukacyjne - nowi użytkownicy widzą przykład pełnej tabeli z header i footer

**Alternatywne rozwiązania:**
- ❌ Domyślnie wyłączone - zbyt minimalistyczne, ukrywa funkcjonalność
- ❌ Zależne od kontekstu - zbyt skomplikowane

### 6.4. Dlaczego Generate CSS pomija wyłączone sekcje?

**Decyzja:** Funkcja `getTableCSS()` generuje sekcje `thead` i `tfoot` tylko gdy odpowiednie checkboxy są zaznaczone.

**Uzasadnienie:**
- ✅ Czystszy kod CSS - użytkownik otrzymuje tylko to czego potrzebuje
- ✅ Mniejszy rozmiar pliku CSS - niepotrzebne sekcje nie są generowane
- ✅ Zgodność z WYSIWYG - CSS odzwierciedla to co użytkownik widzi w podglądzie
- ✅ Mniej zamieszania - użytkownik nie zastanawia się "po co mam style dla thead skoro nie mam thead?"

**Alternatywne rozwiązania:**
- ❌ Zawsze generować wszystkie sekcje - niepotrzebny kod w CSS
- ❌ Generować z komentarzami `/* thead - disabled */` - nadal niepotrzebny kod

---

## 7. Wpływ na pozostałe funkcjonalności

### 7.1. Kompatybilność z Load CSS

**Status:** Częściowa kompatybilność

**Obsługa:**
- ✅ `updateInputs()` jest gotowa na obsługę checkboxów
- ✅ Checkboxy będą prawidłowo aktualizowane po wczytaniu CSS
- ❌ Load CSS nie parsuje informacji o tym czy thead/tfoot były włączone

**Możliwe rozwiązanie w przyszłości:**
- Dodać komentarz w wygenerowanym CSS np. `/* header: enabled, footer: disabled */`
- Parsować ten komentarz w `loadCSS()`
- Aktualizować checkboxy na podstawie sparsowanych danych

### 7.2. Kompatybilność z systemem resetowania

**Status:** Pełna kompatybilność ✅

- ✅ Reset Control - resetuje pojedynczy checkbox do wartości domyślnej
- ✅ Reset Section - resetuje oba checkboxy w sekcji Table
- ✅ Reset All - resetuje wszystkie kontrolki włącznie z checkboxami
- ✅ Resetowanie przywraca zarówno stan checkboxa jak i widoczność thead/tfoot

### 7.3. Kompatybilność z systemem zakładek

**Status:** Pełna kompatybilność ✅

- ✅ Zakładki są dynamicznie ukrywane/pokazywane
- ✅ Automatyczne przełączenie na Table gdy wyłączamy aktywną zakładkę
- ✅ Zakładki działają normalnie gdy header/footer są włączone

---

## 8. Potencjalne problemy i ograniczenia

### 8.1. Brak parsowania checkboxów w Load CSS

**Problem:** Gdy użytkownik wygeneruje CSS z wyłączonym header, a następnie wczyta ten CSS, checkboxy będą domyślnie zaznaczone.

**Wpływ:** Średni - użytkownik zobaczy header w podglądzie mimo że wczytany CSS go nie zawiera.

**Rozwiązanie:** W przyszłych iteracjach dodać parsowanie metadanych z CSS.

### 8.2. Brak walidacji czy tabela ma thead/tfoot

**Problem:** Aplikacja zakłada że tabela zawsze ma `<thead>` i `<tfoot>` w HTML.

**Wpływ:** Niski - obecnie wszystkie przykładowe tabele mają te sekcje.

**Rozwiązanie:** Dodać sprawdzenie `if (thead)` przed manipulacją (już dodane w kodzie).

### 8.3. Brak informacji czy thead/tfoot w wygenerowanym CSS

**Problem:** Wygenerowany CSS nie zawiera informacji czy był generowany z włączonym czy wyłączonym header/footer.

**Wpływ:** Niski - w większości przypadków użytkownik wie co generował.

**Rozwiązanie:** Można dodać komentarz na górze CSS np.:
```css
/* Table Editor Settings: header=true, footer=false */
```

---

## 9. Następne kroki

### 9.1. Testy manualne do wykonania

- [ ] Test 1-10 z sekcji 4.1
- [ ] Sprawdzenie czy nie ma błędów w konsoli przeglądarki
- [ ] Sprawdzenie czy aplikacja działa w różnych przeglądarkach (Chrome, Firefox, Edge)
- [ ] Sprawdzenie czy responsywność nie została zaburzona

### 9.2. Potencjalne ulepszenia

**Ulepszenie 1: Animacje przy ukrywaniu/pokazywaniu**
- Dodać płynne transition dla `thead` i `tfoot` przy zmianie `display`
- Może poprawić UX ale nie jest konieczne

**Ulepszenie 2: Komunikat gdy użytkownik próbuje kliknąć wyłączoną zakładkę**
- Obecnie zakładki są ukryte więc problem nie występuje
- Gdyby w przyszłości zmieniono decyzję na disabled zamiast hidden

**Ulepszenie 3: Parsowanie checkboxów w Load CSS**
- Dodać komentarz z metadanymi do wygenerowanego CSS
- Parsować komentarz w `loadCSS()`
- Zwiększyłoby kompatybilność między Generate i Load

### 9.3. Kolejne User Stories do rozważenia

**User Story 5:** Ograniczone wsparcie dla inherit i transparent w Load CSS
- Wartości `inherit` i `transparent` są traktowane jak puste stringi
- Wymagana poprawa logiki parsowania

**User Story 6:** Brak walidacji wprowadzanych wartości
- Użytkownik może wpisać nieprawidłowe wartości CSS
- Wymagane dodanie walidacji i komunikatów o błędach

---

## 10. Podsumowanie

Iteracja 05 zakończyła się sukcesem. User Story 4 został w pełni zaimplementowany zgodnie z requirements i assumptions.

**Zrealizowane cele:**
- ✅ Checkboxy "Show Header" i "Show Footer" w sekcji Table
- ✅ Dynamiczne ukrywanie sekcji thead/tfoot w tabeli podglądu
- ✅ Dynamiczne ukrywanie zakładek Header/Footer
- ✅ Inteligentna nawigacja przy wyłączaniu aktywnej zakładki
- ✅ Generate CSS pomija wyłączone sekcje
- ✅ Pełna integracja z systemem resetowania
- ✅ Obsługa checkboxów w updateInputs()

**Korzyści dla użytkownika:**
- 🎯 Większa kontrola nad strukturą tabeli
- 🎯 Czytelniejszy interfejs - tylko aktywne zakładki
- 🎯 Czystszy wygenerowany CSS - tylko potrzebne sekcje
- 🎯 Zgodność z WYSIWYG - widzisz to co generujesz
- 🎯 Pełna kompatybilność z systemem resetowania

**Zmiany w kodzie:**
- 📝 index.html: +2 linie (id dla zakładek)
- 📝 js/script.js: +120 linii (checkbox obsługa)
- 📝 css/style.css: 0 linii (brak zmian)

**Stan aplikacji:** Gotowa do testów manualnych ✅

---

**Następna iteracja:** User Story 5 lub User Story 6, w zależności od priorytetów użytkownika.
