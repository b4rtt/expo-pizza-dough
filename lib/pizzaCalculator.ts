export type PizzaStyle = 'neapolitan' | 'new-york' | 'sicilian' | 'pan';
export type YeastType = 'fresh' | 'dry';

type Recipe = {
  type: PizzaStyle;
  name: string;
  number: number;
  gramsPerPizza: number;
  yeastType: YeastType;
  waterShare: number;
  saltPercentage: number;
  yeast: Record<YeastType, number>;
  sugarPercentage?: number;
  oilPercentage?: number;
  semolinaPercentage?: number;
};

export type PizzaInput = {
  style: PizzaStyle;
  number: number;
  gramsPerPizza: number;
  yeastType: YeastType;
};

export type PizzaResult = PizzaInput & {
  flour: number;
  water: number;
  salt: number;
  yeast: number;
  sugar?: number;
  oil?: number;
  semolina?: number;
  totalWeight: number;
  hydration: number;
  name: string;
};

const roundFirstDecimal = (n: number) => Math.round(parseFloat(n.toFixed(2)) * 10) / 10;
const totalWeight = (pizza: PizzaInput) => pizza.number * pizza.gramsPerPizza;

const recipes: Record<PizzaStyle, Recipe> = {
  neapolitan: {
    type: 'neapolitan',
    name: 'Neapolitan',
    number: 4,
    gramsPerPizza: 230,
    yeastType: 'fresh',
    saltPercentage: 0.0178261,
    waterShare: 65,
    yeast: { fresh: 0.00119565217391304, dry: 0.00043478260869565 },
  },
  'new-york': {
    type: 'new-york',
    name: 'New York',
    number: 4,
    gramsPerPizza: 230,
    yeastType: 'fresh',
    waterShare: 63,
    saltPercentage: 0.0118478,
    sugarPercentage: 0.0036,
    oilPercentage: 0.0177173913,
    yeast: { fresh: 0.005, dry: 0.0016667 },
  },
  sicilian: {
    type: 'sicilian',
    name: 'Sicilian',
    number: 1,
    gramsPerPizza: 271,
    yeastType: 'fresh',
    oilPercentage: 0.02583,
    sugarPercentage: 0.01107,
    semolinaPercentage: 0.22,
    saltPercentage: 0.01107,
    waterShare: 66,
    yeast: { fresh: 0.008118081, dry: 0.00332103321 },
  },
  pan: {
    type: 'pan',
    name: 'Pan',
    number: 3,
    gramsPerPizza: 230,
    yeastType: 'fresh',
    waterShare: 65,
    saltPercentage: 0.011682893,
    sugarPercentage: 0.011682893,
    oilPercentage: 0.0139082058,
    yeast: { fresh: 0.002364394993045897, dry: 0.00097357441 },
  },
};

const computeNetWeight = ({
  total,
  salt,
  yeast,
  oil,
  sugar,
}: {
  total: number;
  salt: number;
  yeast: number;
  oil?: number;
  sugar?: number;
}) => {
  return total - salt - yeast - (oil ?? 0) - (sugar ?? 0);
};

const flourGramsAll = (net: number, waterShare: number) =>
  Math.round(net / ((100 + waterShare) / 100));

const waterGrams = (waterShare: number, flourWithSemolina: number) =>
  Math.round((waterShare / 100) * flourWithSemolina);

export const defaultPizzaInput: PizzaInput = {
  style: 'neapolitan',
  number: recipes.neapolitan.number,
  gramsPerPizza: recipes.neapolitan.gramsPerPizza,
  yeastType: recipes.neapolitan.yeastType,
};

export function calculatePizza(input: PizzaInput): PizzaResult {
  const recipe = recipes[input.style];
  const merged: PizzaInput = {
    ...input,
    number: input.number || recipe.number,
    gramsPerPizza: input.gramsPerPizza || recipe.gramsPerPizza,
    yeastType: input.yeastType || recipe.yeastType,
  };

  const total = totalWeight(merged);
  const salt = roundFirstDecimal(total * recipe.saltPercentage);
  const yeast = roundFirstDecimal(total * recipe.yeast[merged.yeastType]);
  const oil = recipe.oilPercentage ? roundFirstDecimal(total * recipe.oilPercentage) : undefined;
  const sugar = recipe.sugarPercentage ? roundFirstDecimal(total * recipe.sugarPercentage) : undefined;

  const net = computeNetWeight({ total, salt, yeast, oil, sugar });
  const flourWithSemolina = flourGramsAll(net, recipe.waterShare);
  const water = waterGrams(recipe.waterShare, flourWithSemolina);
  const semolina = recipe.semolinaPercentage
    ? Math.round(recipe.semolinaPercentage * flourWithSemolina)
    : undefined;
  const flour = semolina ? flourWithSemolina - semolina : flourWithSemolina;

  return {
    ...merged,
    name: recipe.name,
    flour,
    water,
    salt,
    yeast,
    oil,
    sugar,
    semolina,
    totalWeight: total,
    hydration: recipe.waterShare,
  };
}

export const recipeDefaults = recipes;
