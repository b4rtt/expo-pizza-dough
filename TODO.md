# Pizza Dough RN – TODO

## Základ
- [x] Najít/zkopírovat TTF fonty z `/fonts` (Manrope + Space Grotesk) do `assets/fonts` a zaregistrovat přes `expo-font`.
- [x] Definovat design tokens (barvy, odstíny/opacity pro glass, radiusy, spacing, typografie, stíny) s možností snadné změny primary.
- [x] Přidat podporu expo glass efektu (`expo-glass-effect`, případně `expo-linear-gradient`) pro karty/tabs.
- [x] Vyčistit defaultní expo router šablonu (placeholder stránky, barvy, SpaceMono).
- [x] Nastavit globální typografii (heading/body scale, letter-spacing) a použít Airbnb-like styl.

## Navigace
- [x] Implementovat native glass bottom tabs (expo-router native tabs) se dvěma hlavními záložkami: `Kalkulačka`, `Tipy`.
- [x] Přidat třetí stack/screen `Nastavení` (přístup z ikony/CTA) pro jazyk + motiv.
- [x] Přidat tab icons (outline/filled) a animaci aktivního tab (scale/opacity).

## Lokalizace
- [x] Detekce jazyka dle zařízení, fallback na angličtinu, default čeština.
- [x] Připravit i18n slovník (`cs`, `en`) + jednoduchý hook na překlady.
- [x] UI přepínač jazyka v Nastavení (uložení preferencí do storage).

## Kalkulačka (hlavní screen)
- [x] Portnout výpočty receptů (neapolitan, new-york, sicilian, pan) 1:1 z původního projektu (sůl, voda, droždí fresh/dry, cukr, olej, semolina).
- [x] Udržovat stav: počet pizz, g na pizzu, styl, typ droždí (default z původních hodnot).
- [x] Validace vstupů (min/max, jen čísla), chybové stavy a haptika.
- [x] Realtime přepočet a render výsledků.
- [x] UI: glass hero se souhrnem, sekce ingrediencí (cards), drobné mikroanimace, CTA „Zkopírovat / Sdílet“.
- [x] Možnost uložit naposledy použitou konfiguraci (AsyncStorage).

## Tipy / postup
- [x] Strukturovat obsah: hydratace, fermentace, pečení (krátké bloky), případně odkazy na video.
- [ ] Přidat mini-kalkulačku/připomínky (např. teplota vody, doba fermentace) – optional.
- [ ] Přidat tlačítko „Reset kalkulačky“ a „Sdílet recept“.

## Nastavení / další
- [x] Přepínač jazyků (cs/en).
- [ ] Přepínač motivu (pokud bude tmavý/světlý variant).
- [x] Info o verzi / link na původní recept.

## Styl & efekty
- [x] Vrstvené glass panely (blur, průsvitná mřížka, odlesky), gradientní pozadí inspirované Airbnb.
- [ ] Animace vstupů a listů (Reanimated/Worklets) – jemné fade/slide.
- [ ] Ikony (např. tab i CTA) sjednotit s novým stylem.

## Testing / QA
- [ ] Jednotkové testy výpočtů receptů (porovnání s originálními čísly).
- [ ] Smoke test navigace a jazykového přepínače.
- [ ] Kontrola layoutu na iOS/Android (různé velikosti).

## Release checklist
- [ ] Aktualizovat `app.json` (název, ikona, splash) a assety.
- [ ] Odebrat nepoužité dependency a skripty.
- [ ] Rychlý performance check (re-rendering, memoizace).
