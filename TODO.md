# Pizza Dough RN – TODO

## Základ

- [x] Najít/zkopírovat TTF fonty z `/fonts` (Manrope + Space Grotesk) do `assets/fonts` a zaregistrovat přes `expo-font`.
- [x] Definovat design tokens (barvy, odstíny/opacity pro glass, radiusy, spacing, typografie, stíny) s možností snadné změny primary.
- [x] Přidat podporu expo glass efektu (`expo-glass-effect`, případně `expo-linear-gradient`) pro karty/tabs.
- [x] Vyčistit defaultní expo router šablonu (placeholder stránky, barvy, SpaceMono).
- [x] Nastavit globální typografii (heading/body scale, letter-spacing) a použít Airbnb-like styl.
- [x] Oprav safe area view
- [x] Odeber minikalkulačku. nedává to smysl

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
- [x] Přidat mini-kalkulačku/připomínky (např. teplota vody, doba fermentace) – optional.
- [x] Přidat tlačítko „Reset kalkulačky“ a „Sdílet recept“.
- [x] Přidat možnost uložit si recept, přidat novou záložku, kde budou uložené recepty.
- [x] Ukládání receptu by mělo mít možnost recept pojmenovat
- [x] V INFO.md jsou nějaké další texty a info. Přidáme to do Tipů
- [x] Udělej variabilní i hydratci (v procentech)

## Nastavení / další

- [x] Přepínač jazyků (cs/en).
- [x] Přepínač motivu (světlý/tmavý + systém).
- [x] Info o verzi / link na původní recept.

## Styl & efekty

- [x] Vrstvené glass panely (blur, průsvitná mřížka, odlesky), gradientní pozadí inspirované Airbnb.
- [x] Animace vstupů a listů (jemný fade na kartách).
- [x] Ikony (CTA) sjednoceny + ikonky v Tipy.

## Release checklist

- [x] Aktualizovat `app.json` (název, ikona, splash) a assety.
- [x] Odebrat nepoužité dependency a skripty.
- [x] Rychlý performance check (memoizace CTA/řádků).
- [x] Některé tipy jsou pouze anglicky. Mají se taky překládat

## UI/UX redesign (next)
- [ ] Nový vizuální směr: výraznější kontrast, lepší spacing, card stack s gradienty/odlesky, sjednocené okraje (safe area + notch).
- [ ] Vstupy čísel: steppery (+/-) s haptikou, slider pro hydrataci (45–90 %), validace a inline helpery.
- [ ] Výběry styl/droždí/počet pizz: fullscreen/bottom-sheet selektory s ikonami a popisy; možnost rychlých presetů (S/M/L váhy, 2–8 pizz).
- [ ] Bottom actions: lepší CTA bar (sticky, glass) pro Sdílet/Uložit/Reset s ikonami a stavy.
- [ ] Layout kalkulačky: dvousloupcové karty na velkých displejích, přehlednější blok Souhrn + Ingredience.
- [ ] Mikrointerakce: animace přepnutí stylu (highlight na kartě), loader při ukládání, haptika u stepperů/přepínačů.
- [ ] Přehled uložených receptů: karty s tagy (styl, hydratace, droždí), swipe to delete, better empty state.
- [ ] Tipy: vizuálně oddělené bloky (ikony, badge), odkazy/CTA tlačítka s ikonami.
- [ ] Nastavení: zjednodušené přepínače (toggle/selekty) a zobrazení aktuálního jazyka/motivu.
