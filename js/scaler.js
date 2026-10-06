/**
 * Scaler Module
 * Handles parsing, scaling, and formatting ingredient amounts.
 */

// Common fraction representations
const FRACTIONS = [
  { value: 0.25, symbol: '¼' },
  { value: 0.33, symbol: '⅓' },
  { value: 0.5, symbol: '½' },
  { value: 0.66, symbol: '⅔' },
  { value: 0.75, symbol: '¾' }
];

/**
 * Normalizes text removing accents
 */
export function normalizeText(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Parses an ingredient text line into structured amount, unit, and name.
 * Examples:
 * "250 g de harina de trigo" -> { amount: 250, unit: "g", name: "harina de trigo" }
 * "2 huevos" -> { amount: 2, unit: "unidades", name: "huevos" }
 * "1 1/2 cda de sal" -> { amount: 1.5, unit: "cda", name: "sal" }
 * "Sal al gusto" -> { amount: null, unit: "", name: "Sal al gusto" }
 */
export function parseIngredientText(rawText) {
  if (!rawText) return { amount: null, unit: '', name: '', raw: '' };

  const trimmed = rawText.trim();
  
  // Check for fractions like "1/2", "3/4", "1 1/2"
  let parsedAmount = null;
  let remainingText = trimmed;

  const fractionRegex = /^(\d+)?\s*(\d+)\/(\d+)\s*(.*)$/;
  const fractionMatch = trimmed.match(fractionRegex);

  if (fractionMatch) {
    const whole = fractionMatch[1] ? parseFloat(fractionMatch[1]) : 0;
    const num = parseFloat(fractionMatch[2]);
    const den = parseFloat(fractionMatch[3]);
    if (den !== 0) {
      parsedAmount = whole + (num / den);
      remainingText = fractionMatch[4].trim();
    }
  } else {
    // Normal numeric match (e.g., 2, 2.5, 2,5)
    const numRegex = /^([\d]+(?:[.,]\d+)?)\s*(.*)$/;
    const numMatch = trimmed.match(numRegex);
    if (numMatch) {
      parsedAmount = parseFloat(numMatch[1].replace(',', '.'));
      remainingText = numMatch[2].trim();
    }
  }

  if (parsedAmount === null) {
    return {
      amount: null,
      unit: '',
      name: trimmed,
      raw: trimmed
    };
  }

  // Detect common units
  const unitsPattern = /^(gramos|gramo|g|kilogramos|kilos|kilo|kg|mililitros|ml|litros|litro|l|cucharadas|cucharada|cda|cdas|cucharaditas|cucharadita|cdta|cdtas|tazas|taza|tz|pizca|pizcas|dientes|diente|rebanadas|rebanada|latas|lata|paquete|paquetes|unidades|unidad|piezas|pieza|vasos|vaso|ramas|rama)\b(\s+de)?\s*/i;
  
  const unitMatch = remainingText.match(unitsPattern);
  let unit = '';
  let name = remainingText;

  if (unitMatch) {
    unit = unitMatch[1].toLowerCase();
    name = remainingText.slice(unitMatch[0].length).trim();
  } else {
    // If no explicit unit, check if starts with "de "
    if (name.toLowerCase().startsWith('de ')) {
      name = name.slice(3).trim();
    }
  }

  return {
    amount: parsedAmount,
    unit: unit,
    name: name || trimmed,
    raw: trimmed
  };
}

/**
 * Formats a scaled number nicely (e.g. 1.5 -> "1 ½" or rounds to 2 decimals)
 */
export function formatScaledAmount(amount) {
  if (amount === null || isNaN(amount)) return '';
  
  // Very small numbers or clean integers
  if (Number.isInteger(amount)) {
    return amount.toString();
  }

  const whole = Math.floor(amount);
  const frac = amount - whole;

  // Check matching common fractions
  for (const f of FRACTIONS) {
    if (Math.abs(frac - f.value) < 0.05) {
      return whole > 0 ? `${whole} ${f.symbol}` : f.symbol;
    }
  }

  // Otherwise format with 1 or 2 decimals
  const rounded = Math.round(amount * 10) / 10;
  return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1).replace('.0', '');
}

/**
 * Scales an ingredient to a new serving count
 */
export function scaleIngredient(ingredient, baseServings, targetServings) {
  if (!ingredient) return '';
  
  // If structured
  const amount = typeof ingredient.amount === 'number' ? ingredient.amount : null;
  const unit = ingredient.unit || '';
  const name = ingredient.name || ingredient.raw || '';

  if (amount === null || !baseServings || !targetServings || baseServings <= 0) {
    return ingredient.raw || name;
  }

  const ratio = targetServings / baseServings;
  const scaledAmount = amount * ratio;
  const formattedAmount = formatScaledAmount(scaledAmount);

  let result = formattedAmount;
  if (unit) {
    result += ` ${unit}`;
  }
  if (name) {
    result += ` de ${name}`.replace(/\s+/g, ' ');
  }

  return result.trim();
}
