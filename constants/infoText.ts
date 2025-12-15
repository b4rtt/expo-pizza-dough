type Section = { title: string; body: string };

const cs: Section[] = [
  {
    title: 'Neapolská pizza',
    body: 'Vzdušný cornicione s lehkým leopardím opálením, tenký střed a málo toppingů. Jemně roztahovat od středu, nechat bubliny žít. Peč 300–550°C 1–4 min, hydratace 55–75 %, sůl ~3 %, čerstvé droždí ~0,2 %. Kynutí 6–24 h pokoj / 8–72 h lednice.',
  },
  {
    title: 'New York pizza',
    body: 'Trochu silnější než Neapol, peče se 8–15 min na 200–300°C. Olej brání vysušení, cukr pomáhá barvě. Hydratace 55–65 %, cukr ~2 %, sůl ~2 %, olej ~2,5 %, čerstvé droždí ~0,4 %.',
  },
  {
    title: 'Sicílie (pan pizza)',
    body: 'Silný, nadýchaný plech s křupavým spodkem v oleji. Hydratace 55–85 %, sůl ~2 %, olej ~1,5 %, čerstvé droždí ~1,5 %. Peč 250–280°C 15–20 min.',
  },
  {
    title: 'Váhy těst',
    body: 'Neapol: S 160 g (Ø16), M 230 g (Ø28), L 300 g (Ø34). New York: S 175 g, M 240 g, L 315 g. Sicílie: cca 650 g na plech 25×20 cm (uprav podle vlastního plechu).',
  },
  {
    title: 'Mouka',
    body: 'Tipo 00 zvládne 50–100 % vody. Pokud používáš chlebovou mouku, drž vodu 50–60 %. Vyhni se hladké/univerzální a dortové.',
  },
  {
    title: 'Droždí & sůl',
    body: 'Málo droždí pro dlouhé kynutí (8–72 h). Sušené = polovina dávky čerstvého. Sůl dodá chuť, posílí gluten a pomůže barvě; preferuj mořskou/kosher.',
  },
  {
    title: 'Postup',
    body: 'Sůl rozpusť ve studené vodě, přidej trochu mouky a až pak droždí (chrání ho). Hněť do hladka/elasticity (8–20 min). Kynutí pokoj 6–24 h nebo lednice 8–72 h; před pečením nech 2–4 h na pokojovou teplotu.',
  },
];

const en: Section[] = [
  {
    title: 'Neapolitan pizza',
    body: 'Airy cornicione with leopard spotting; thin center, few toppings. Stretch gently from center out to keep bubbles. Bake 300–550°C for 1–4 min. Hydration 55–75%, salt ~3%, fresh yeast ~0.2%. Proof 6–24h room or 8–72h cold.',
  },
  {
    title: 'New York pizza',
    body: 'Slightly thicker, bakes 8–15 min at 200–300°C. Oil prevents drying, sugar helps browning. Hydration 55–65%, sugar ~2%, salt ~2%, oil ~2.5%, fresh yeast ~0.4%.',
  },
  {
    title: 'Sicilian pizza',
    body: 'Thick pan bake with fried bottom; soft crumb. Hydration 55–85%, salt ~2%, oil ~1.5%, fresh yeast ~1.5%. Bake 250–280°C for 15–20 min.',
  },
  {
    title: 'Sizing',
    body: 'Neapolitan: S 160g (Ø16), M 230g (Ø28), L 300g (Ø34). New York: S 175g, M 240g, L 315g. Sicilian: ~650g for 25×20cm tray; adjust to your pan.',
  },
  {
    title: 'Flour',
    body: 'Tipo 00 absorbs 50–100% water. With bread flour keep water 50–60%. Avoid all-purpose/cake.',
  },
  {
    title: 'Yeast & salt',
    body: 'Use little yeast for long ferment (8–72h). Dry ≈ half of fresh. Salt adds flavor, strengthens gluten, helps browning; prefer sea/kosher.',
  },
  {
    title: 'Process',
    body: 'Dissolve salt in cool water, add a bit of flour, then yeast. Knead smooth/elastic (8–20 min). Ferment room 6–24h or cold 8–72h; bring to room temp 2–4h before baking.',
  },
];

export function getInfoSections(lang: 'cs' | 'en'): Section[] {
  return lang === 'cs' ? cs : en;
}

export default getInfoSections;
