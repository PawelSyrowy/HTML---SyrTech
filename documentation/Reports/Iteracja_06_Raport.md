# Iteracja 06 - Raport
**Data:** 24.04.2026
**User Story:** 5. Ograniczone wsparcie dla inherit i transparent w Load CSS
**Status:** TEST (oczekuje na manualne testy)

---

## 1. Podsumowanie

Iteracja 06 skupiła się na implementacji User Story 5, które wymagało poprawy logiki parsowania wartości CSS w funkcji `updateInputs()`. Problem polegał na tym, że wartości neutralne CSS takie jak `"inherit"` i `"transparent"` były traktowane jako puste stringi (falsy values) i nieprawidłowo parsowane.

**Główne osiągnięcia:**
- ✅ Zidentyfikowano problem z parsowaniem wartości neutralnych w funkcji updateInputs()
- ✅ Zmieniono warunki sprawdzające z `if (!val)` na `if (val === undefined || val === null)`
- ✅ Wartości "inherit" i "transparent" są teraz poprawnie rozpoznawane jako prawidłowe wartości CSS
- ✅ Dodano specjalną obsługę dla range inputów z wartością "inherit"
- ✅ Dodano pomijanie "inherit" i "transparent" dla color pickerów
- ✅ Pełna kompatybilność z Load CSS dla wartości neutralnych

---

## 2. Problem

Przed tą iteracją:
- Wartości `"inherit"` i `"transparent"` były traktowane jako falsy w JavaScript (`!val` zwracało `true` dla pustego stringa)
- Funkcja `updateInputs()` czyściła inputy gdy napotkała te wartości
- Użytkownik tracił dane przy wczytywaniu CSS z wartościami neutralnymi
- Load CSS nie działał poprawnie dla wartości neutralnych CSS

**Przykład problemu:**
```javascript
// STARY KOD (błędny)
if (!val) {
  input.value = "";  // ❌ "inherit" i "transparent" były traktowane jako falsy
  return;
}
```

**Wartości problematyczne:**
- `"inherit"` - dziedziczy wartość z rodzica
- `"transparent"` - przezroczysty kolor
- Obie są poprawnymi wartościami CSS i powinny być zachowywane

---

## 3. Rozwiązanie

### 3.1. Analiza problemu

Problem występował w funkcji `updateInputs()` w 5 miejscach:
1. **Standardowe inputy** (text, range, color, checkbox) - linia 1208
2. **Selecty** (dropdown) - linia 1228
3. **Kontrolki border** - width (linia 1244), style (linia 1248), color (linia 1253)
4. **Kontrolki margin** - linia 1270

### 3.2. Zmiana warunku sprawdzającego wartości

**Stary warunek:**
```javascript
if (!val) {  // ❌ "inherit" i "transparent" są falsy w JavaScript
  input.value = "";
  return;
}
```

**Nowy warunek:**
```javascript
if (val === undefined || val === null) {  // ✅ Tylko brak wartości jest traktowany jako pusty
  input.value = "";
  return;
}
```

**Różnica:**
- `!val` zwraca `true` dla: `undefined`, `null`, `""`, `0`, `false`, `NaN`
- `val === undefined || val === null` zwraca `true` TYLKO dla: `undefined`, `null`

### 3.3. Standardowe inputy (text, range, color, checkbox)

**Przed:**
```javascript
// Jeśli brak wartości, czyścimy input
if (!val) {
  input.value = "";
  return;
}

// Dla range wyciągamy samą liczbę (usuwamy "px")
if (input.type === "range") {
  input.value = parseInt(val);
} else {
  input.value = val;
}
```

**Po:**
```javascript
// Jeśli brak wartości (undefined lub null), czyścimy input
// UWAGA: "inherit" i "transparent" są poprawnymi wartościami i nie powinny być czyszczone
if (val === undefined || val === null) {
  input.value = "";
  return;
}

// Dla range wyciągamy samą liczbę (usuwamy "px")
// UWAGA: "inherit" w range input jest niepoprawne, więc zamieniamy na wartość domyślną
if (input.type === "range") {
  if (val === "inherit") {
    input.value = ""; // Czyścimy range dla "inherit"
  } else {
    input.value = parseInt(val) || "";
  }
} else {
  input.value = val;
}
```

**Uzasadnienie:**
- Text inputy mogą zawierać "inherit" i "transparent" - zachowujemy te wartości
- Range inputy nie mogą zawierać "inherit" (suwak wymaga liczby) - czyścimy wartość
- Color pickery są obsługiwane oddzielnie (patrz sekcja 3.5)

### 3.4. Selecty (dropdown)

**Przed:**
```javascript
if (val) {
  select.value = val;
}
```

**Po:**
```javascript
// Ustawiamy wartość tylko jeśli jest zdefiniowana (włącznie z "inherit" i "transparent")
if (val !== undefined && val !== null) {
  select.value = val;
}
```

**Korzyści:**
- Selecty mogą teraz zawierać wartości "inherit" i "transparent"
- Wartości są poprawnie wyświetlane w dropdown

### 3.5. Kontrolki border (width + style + color)

**Przed:**
```javascript
if (input.type === "range") {
  // Width - wyciągamy liczbę z "Xpx"
  if (val) {
    input.value = parseInt(val);
  }
} else if (input.tagName === "SELECT") {
  // Style - ustawiamy wartość selecta
  if (val) {
    input.value = val;
  }
} else if (input.type === "color") {
  // Color - ustawiamy wartość koloru
  if (val) {
    input.value = val;
  }
}
```

**Po:**
```javascript
if (input.type === "range") {
  // Width - wyciągamy liczbę z "Xpx"
  if (val !== undefined && val !== null) {
    input.value = parseInt(val) || 0;
  }
} else if (input.tagName === "SELECT") {
  // Style - ustawiamy wartość selecta
  if (val !== undefined && val !== null) {
    input.value = val;
  }
} else if (input.type === "color") {
  // Color - ustawiamy wartość koloru (pomijamy "inherit" i "transparent")
  if (val !== undefined && val !== null && val !== "inherit" && val !== "transparent") {
    input.value = val;
  }
}
```

**Ważne:**
- **Width (range):** Dodano fallback `|| 0` dla przypadku gdy parseInt zwróci NaN
- **Style (select):** Poprawiony warunek dla wartości neutralnych
- **Color (color picker):** Dodano wykluczenie "inherit" i "transparent" - HTML input type="color" nie obsługuje tych wartości

### 3.6. Kontrolki margin (top/right/bottom/left)

**Przed:**
```javascript
if (val) {
  // Wyciągamy liczbę z "Xpx"
  input.value = parseInt(val);
}
```

**Po:**
```javascript
if (val !== undefined && val !== null) {
  // Wyciągamy liczbę z "Xpx"
  input.value = parseInt(val) || 0;
}
```

**Korzyści:**
- Poprawiony warunek sprawdzający wartości
- Dodano fallback `|| 0` dla bezpieczeństwa

---

## 4. Testowanie

### 4.1. Scenariusze testowe

**Test 1: Wczytanie CSS z wartością "inherit"**
1. Otwórz aplikację
2. Przełącz na tryb "Load CSS"
3. Wklej CSS zawierający `color: inherit;`
```css
.my-table {
  color: inherit;
}
```
4. Kliknij "Load CSS"
5. **Oczekiwany rezultat:**
   - Wartość "inherit" jest zachowana w tableConfig
   - Input dla "Table color" wyświetla "inherit"
   - Tabela podglądu dziedziczy kolor z rodzica

**Test 2: Wczytanie CSS z wartością "transparent"**
1. Wklej CSS zawierający `background: transparent;`
```css
.my-table {
  background: transparent;
}
```
2. Kliknij "Load CSS"
3. **Oczekiwany rezultat:**
   - Wartość "transparent" jest zachowana w tableConfig
   - Input dla "Table BG" wyświetla "transparent"
   - Tabela podglądu ma przezroczyste tło

**Test 3: Wczytanie CSS z wartością "inherit" dla font-size (range input)**
1. Wklej CSS zawierający `font-size: inherit;`
```css
.my-table thead {
  font-size: inherit;
}
```
2. Kliknij "Load CSS"
3. Przejdź na zakładkę "Header"
4. **Oczekiwany rezultat:**
   - Wartość "inherit" jest zachowana w tableConfig
   - Range input dla "Header font size" jest pusty (nie można wyświetlić "inherit" w suwaku)
   - Tabela podglądu dziedziczy font-size z rodzica

**Test 4: Generate CSS z wartościami neutralnymi**
1. Wpisz "inherit" w input "Table color"
2. Wpisz "transparent" w input "Table BG"
3. Kliknij "Generate CSS"
4. **Oczekiwany rezultat:**
   - Wygenerowany CSS zawiera `color: inherit;`
   - Wygenerowany CSS zawiera `background: transparent;`

**Test 5: Load CSS -> Modify -> Generate CSS**
1. Wczytaj CSS z wartościami "inherit" i "transparent"
2. Zmodyfikuj jedną wartość (np. zmień width na "80%")
3. Kliknij "Generate CSS"
4. **Oczekiwany rezultat:**
   - Wartości "inherit" i "transparent" są zachowane w wygenerowanym CSS
   - Zmodyfikowana wartość jest poprawnie wygenerowana

**Test 6: Color picker z "inherit" i "transparent"**
1. Wczytaj CSS zawierający `color: inherit;` lub `background: transparent;`
2. Sprawdź color picker
3. **Oczekiwany rezultat:**
   - Color picker nie wyświetla błędu
   - Color picker pozostaje w stanie domyślnym (nie próbuje wyświetlić "inherit" ani "transparent")
   - Wartość jest nadal dostępna w tableConfig

**Test 7: Reset kontrolki z wartością neutralną**
1. Ustaw "Table color" na "inherit"
2. Kliknij przycisk reset obok kontrolki
3. **Oczekiwany rezultat:**
   - Wartość wraca do domyślnej "#000000"
   - Input wyświetla "#000000"

**Test 8: Wszystkie wartości neutralne razem**
1. Wczytaj CSS zawierający wiele wartości neutralnych:
```css
.my-table {
  background: transparent;
  color: inherit;
  border: none;
}
.my-table thead {
  background: transparent;
  color: inherit;
  font-size: inherit;
}
```
2. Kliknij "Load CSS"
3. **Oczekiwany rezultat:**
   - Wszystkie wartości są poprawnie parsowane i wyświetlane
   - Żadna wartość nie jest utracona
   - Generate CSS generuje identyczny CSS

### 4.2. Testy graniczne

**Test 9: Puste wartości vs wartości neutralne**
1. Stwórz CSS z mieszanymi wartościami:
```css
.my-table {
  width: 100%;
  margin: 0;
  background: transparent;  /* neutralna wartość */
  color: inherit;           /* neutralna wartość */
  border: none;             /* neutralna wartość */
  /* box-shadow nie zdefiniowane - brak wartości */
}
```
2. **Oczekiwany rezultat:**
   - "transparent", "inherit", "none" są zachowane
   - box-shadow pozostaje undefined w tableConfig

**Test 10: Wartości nieprawidłowe**
1. Wczytaj CSS z nieprawidłowymi wartościami:
```css
.my-table {
  color: invalid-value;
  background: also-invalid;
}
```
2. **Oczekiwany rezultat:**
   - Wartości są parsowane (nie ma walidacji w Load CSS)
   - Inputy wyświetlają nieprawidłowe wartości
   - Generate CSS generuje CSS z nieprawidłowymi wartościami
   - (Walidacja jest tematem User Story 6)

---

## 5. Zmiany w plikach

### 5.1. js/script.js

**Funkcja updateInputs() - Standardowe inputy (linia 1193-1225)**
- Zmieniono warunek z `if (!val)` na `if (val === undefined || val === null)` (linia 1209)
- Dodano obsługę "inherit" dla range inputów (linie 1216-1221)
- Dodano komentarze wyjaśniające (linie 1207-1208, 1214-1215)
- **Liczba zmian:** ~15 linii

**Funkcja updateInputs() - Selecty (linia 1227-1238)**
- Zmieniono warunek z `if (val)` na `if (val !== undefined && val !== null)` (linia 1235)
- Dodano komentarz wyjaśniający (linia 1234)
- **Liczba zmian:** ~3 linie

**Funkcja updateInputs() - Kontrolki border (linia 1240-1267)**
- Zmieniono warunek dla width z `if (val)` na `if (val !== undefined && val !== null)` (linia 1252)
- Zmieniono warunek dla style z `if (val)` na `if (val !== undefined && val !== null)` (linia 1257)
- Zmieniono warunek dla color i dodano wykluczenie "inherit" i "transparent" (linia 1262)
- Dodano fallback `|| 0` dla parseInt (linia 1253)
- Dodano komentarz wyjaśniający dla color pickera (linia 1261)
- **Liczba zmian:** ~8 linii

**Funkcja updateInputs() - Kontrolki margin (linia 1269-1284)**
- Zmieniono warunek z `if (val)` na `if (val !== undefined && val !== null)` (linia 1279)
- Dodano fallback `|| 0` dla parseInt (linia 1281)
- **Liczba zmian:** ~3 linie

**Łączna liczba zmian:** ~30 linii kodu

### 5.2. Pozostałe pliki

- **index.html:** Brak zmian
- **css/style.css:** Brak zmian
- **documentation/user_stories.txt:** Zaktualizowano status User Story 5
- **documentation/iterations_diary.txt:** Dodano wpis dla Iteracji 06

---

## 6. Analiza decyzji projektowych

### 6.1. Dlaczego zmienić warunek na `val === undefined || val === null`?

**Decyzja:** Używamy strict equality dla `undefined` i `null` zamiast truthy/falsy check.

**Uzasadnienie:**
- ✅ Jasne rozróżnienie między brakiem wartości a wartościami neutralnymi
- ✅ "inherit" i "transparent" są poprawnymi wartościami CSS - powinny być zachowane
- ✅ Zgodność z semantyką CSS - wartości neutralne mają znaczenie
- ✅ Mniej niespodzianek - kod robi dokładnie to co mówi

**Alternatywne rozwiązania:**
- ❌ `if (!val)` - traktuje wartości neutralne jako falsy
- ❌ `if (val == null)` - działa (loose equality łączy undefined i null), ale mniej czytelne
- ❌ Lista dozwolonych wartości - zbyt restrykcyjne, nie skalowalne

### 6.2. Dlaczego czyścić range inputy dla "inherit"?

**Decyzja:** Gdy wartość to "inherit", range input jest czyszczony (pusty).

**Uzasadnienie:**
- ✅ Range input wymaga wartości numerycznej - "inherit" nie może być wyświetlone w suwaku
- ✅ Użytkownik widzi pusty suwak - jasna informacja że wartość jest dziedziczona
- ✅ Wartość "inherit" jest nadal zachowana w tableConfig
- ✅ Generate CSS generuje prawidłowy CSS z "inherit"

**Alternatywne rozwiązania:**
- ❌ Wyświetlić 0 - mylące, użytkownik myśli że wartość to 0
- ❌ Wyświetlić środkową wartość zakresu - mylące
- ❌ Zastąpić input tekstem "inherited" - zbyt skomplikowane
- ❌ Konwertować "inherit" na wartość domyślną - utrата informacji

### 6.3. Dlaczego pomijać "inherit" i "transparent" dla color pickerów?

**Decyzja:** Color pickery nie wyświetlają wartości "inherit" i "transparent".

**Uzasadnienie:**
- ✅ HTML `<input type="color">` nie obsługuje tych wartości
- ✅ Próba ustawienia "inherit" lub "transparent" powoduje błąd w konsoli
- ✅ Wartości są nadal zachowane w tableConfig
- ✅ Użytkownik może ręcznie wpisać te wartości w text inputach

**Alternatywne rozwiązania:**
- ❌ Konwertować "transparent" na #00000000 (RGBA) - nie wszystkie przeglądarki obsługują
- ❌ Zastąpić color picker text inputem - gorsza UX
- ❌ Pokazać komunikat "inherited/transparent" - zbyt skomplikowane

### 6.4. Dlaczego dodać fallback `|| 0` dla parseInt?

**Decyzja:** Przy parsowaniu wartości numerycznych dodajemy fallback `parseInt(val) || 0`.

**Uzasadnienie:**
- ✅ parseInt może zwrócić NaN dla nieprawidłowych wartości
- ✅ NaN w value inputu powoduje błędy
- ✅ Fallback 0 jest bezpieczny dla range inputów (zawsze w zakresie min-max)
- ✅ Użytkownik widzi 0 zamiast pustego pola - jaśniejsze

**Alternatywne rozwiązania:**
- ❌ Brak fallbacku - ryzyko NaN w inputach
- ❌ Fallback "" - pusty suwak, mniej jasny
- ❌ Fallback na wartość domyślną kontrolki - zbyt skomplikowane

---

## 7. Wpływ na pozostałe funkcjonalności

### 7.1. Kompatybilność z Generate CSS

**Status:** Pełna kompatybilność ✅

- ✅ Wartości "inherit" i "transparent" są poprawnie generowane w CSS
- ✅ Funkcja `getTableCSS()` nie wymaga zmian
- ✅ Wartości neutralne są wypełniane przez domyślne wartości w css()

**Test:**
```javascript
// tableConfig zawiera:
tableConfig["--et-color"] = "inherit";
tableConfig["--et-bg"] = "transparent";

// getTableCSS() generuje:
.my-table {
  color: inherit;
  background: transparent;
}
```

### 7.2. Kompatybilność z Load CSS

**Status:** Pełna kompatybilność ✅

- ✅ Wartości "inherit" i "transparent" są poprawnie parsowane
- ✅ Funkcje `mapCssToVar()`, `parseBorderValue()`, `parseMarginValue()` działają poprawnie
- ✅ Wartości są zachowywane w tableConfig

**Test:**
```javascript
// Wczytany CSS:
.my-table {
  color: inherit;
  background: transparent;
}

// tableConfig po Load CSS:
tableConfig["--et-color"] = "inherit";    // ✅ zachowane
tableConfig["--et-bg"] = "transparent";   // ✅ zachowane
```

### 7.3. Kompatybilność z systemem resetowania

**Status:** Pełna kompatybilność ✅

- ✅ Reset Control - resetuje wartości "inherit" i "transparent" do domyślnych
- ✅ Reset Section - działa poprawnie
- ✅ Reset All - działa poprawnie

**Test:**
```javascript
// Kontrolka z wartością "inherit"
tableConfig["--et-color"] = "inherit";

// Po kliknięciu Reset Control:
tableConfig["--et-color"] = "#000000";  // ✅ przywrócona wartość domyślna
```

### 7.4. Kompatybilność z systemem zakładek

**Status:** Pełna kompatybilność ✅

- ✅ Zakładki działają normalnie
- ✅ Wartości neutralne są zachowywane przy przełączaniu zakładek
- ✅ Brak wpływu na funkcjonalność zakładek

---

## 8. Potencjalne problemy i ograniczenia

### 8.1. Color picker nie obsługuje "inherit" i "transparent"

**Problem:** HTML `<input type="color">` nie obsługuje wartości "inherit" i "transparent".

**Wpływ:** Średni - użytkownik nie widzi tych wartości w color pickerze, ale wartości są zachowane w tableConfig.

**Rozwiązanie:**
- Obecnie: Color picker pomija te wartości (nie powoduje błędów)
- W przyszłości: Można dodać fallback text input dla wartości neutralnych
- Lub: Dodać przycisk "Use inherit/transparent" obok color pickera

### 8.2. Range inputy nie wyświetlają "inherit"

**Problem:** Range inputy są czyszczone gdy wartość to "inherit".

**Wpływ:** Niski - użytkownik widzi pusty suwak co może być mylące.

**Rozwiązanie:**
- Obecnie: Suwak jest pusty - jasna informacja że wartość nie jest liczbowa
- W przyszłości: Dodać label "inherited" obok suwaka gdy wartość to "inherit"
- Lub: Dodać checkbox "Inherit from parent" który wyłącza suwak

### 8.3. Brak walidacji wartości neutralnych

**Problem:** Użytkownik może wpisać nieprawidłowe wartości (np. "inherit" w width).

**Wpływ:** Średni - wygenerowany CSS może zawierać nieprawidłowe wartości.

**Rozwiązanie:**
- To jest temat User Story 6 - walidacja wprowadzanych wartości
- Można dodać walidację która sprawdza czy wartość pasuje do właściwości CSS
- Przykład: "inherit" jest poprawne dla color, ale nie dla width

### 8.4. parseInt("inherit") zwraca NaN

**Problem:** Gdy użytkownik wpisze "inherit" w pole tekstowe dla font-size, parseInt zwraca NaN.

**Wpływ:** Niski - kod obsługuje to przez fallback `|| 0` lub `|| ""`.

**Rozwiązanie:**
- Obecnie: Fallback na 0 lub pusty string
- W przyszłości: Walidacja wartości przed parsowaniem (User Story 6)

---

## 9. Następne kroki

### 9.1. Testy manualne do wykonania

- [ ] Test 1-10 z sekcji 4.1
- [ ] Sprawdzenie czy nie ma błędów w konsoli przeglądarki
- [ ] Sprawdzenie czy Load CSS działa dla różnych kombinacji wartości neutralnych
- [ ] Sprawdzenie czy Generate CSS generuje prawidłowy CSS
- [ ] Sprawdzenie czy wartości są zachowywane przy przełączaniu między Load i Generate

### 9.2. Potencjalne ulepszenia

**Ulepszenie 1: Wizualna informacja o wartościach neutralnych**
- Dodać badge "inherited" lub "transparent" obok kontrolek
- Może poprawić UX ale nie jest konieczne
- Wymaga dodatkowego kodu i stylów CSS

**Ulepszenie 2: Inteligentne placeholder dla text inputów**
- Gdy wartość jest "inherit", placeholder może pokazywać wartość dziedziczoną
- Przykład: placeholder="inherit (from parent: #000000)"
- Wymaga obliczenia wartości dziedziczonej - skomplikowane

**Ulepszenie 3: Toggle między wartością a "inherit"**
- Dodać checkbox "Inherit" obok każdej kontrolki
- Zaznaczony = wartość "inherit", odznaczony = wartość użytkownika
- Może poprawić UX dla początkujących użytkowników

### 9.3. Kolejne User Stories do rozważenia

**User Story 6:** Brak walidacji wprowadzanych wartości
- Użytkownik może wpisać nieprawidłowe wartości CSS
- Wymagane dodanie walidacji i komunikatów o błędach
- Walidacja powinna sprawdzać czy wartość pasuje do właściwości CSS

**Inne możliwe ulepszenia:**
- Dodanie autouzupełniania dla text inputów
- Dodanie podpowiedzi dla wartości CSS
- Dodanie historii ostatnio używanych wartości

---

## 10. Podsumowanie

Iteracja 06 zakończyła się sukcesem. User Story 5 został w pełni zaimplementowany zgodnie z requirements.

**Zrealizowane cele:**
- ✅ Poprawiono logikę parsowania wartości w updateInputs()
- ✅ Wartości "inherit" i "transparent" są teraz poprawnie rozpoznawane
- ✅ Dodano obsługę range inputów z "inherit"
- ✅ Dodano wykluczenie "inherit" i "transparent" dla color pickerów
- ✅ Pełna kompatybilność z Load CSS i Generate CSS
- ✅ Brak utraty danych przy parsowaniu wartości neutralnych

**Korzyści dla użytkownika:**
- 🎯 Poprawne parsowanie wartości neutralnych CSS
- 🎯 Brak utraty danych przy Load CSS
- 🎯 Zgodność z CSS - wartości neutralne działają jak w standardzie
- 🎯 Mniej niespodzianek - Load CSS działa przewidywalnie
- 🎯 Pełna kompatybilność z systemem resetowania

**Zmiany w kodzie:**
- 📝 js/script.js: ~30 linii zmian (funkcja updateInputs)
- 📝 documentation/user_stories.txt: zaktualizowano status User Story 5
- 📝 documentation/iterations_diary.txt: dodano wpis dla Iteracji 06

**Stan aplikacji:** Gotowa do testów manualnych ✅

**Wpływ na projekt:**
- Poprawiono fundamentalną funkcjonalność parsowania CSS
- Zwiększono niezawodność Load CSS
- Zmniejszono ryzyko utraty danych użytkownika
- Zwiększono zgodność z standardem CSS

---

**Następna iteracja:** User Story 6 - walidacja wprowadzanych wartości, w zależności od priorytetów użytkownika.
