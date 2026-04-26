// Heuristic allergen + dietary-pattern detection for static foods/meals.
// We don't have ingredient lists, so we infer from name + fullName + tags.
// Imperfect, but better than the previous "decorative-only" preferences.

const ALLERGEN_KEYWORDS = {
  dairy:     ['milk', 'yogurt', 'cheese', 'butter', 'cream', 'parmesan', 'niter kibbeh', 'ayib', 'french toast'],
  egg:       ['egg', 'scrambled', 'fried egg', 'french toast'],
  gluten:    ['bread', 'toast', 'pasta', 'pizza', 'sambusa', 'shawarma', 'burger', 'wheat', 'noodle', 'crust', 'bun', 'wrap', 'oatmeal', 'chechebsa', 'genfo'],
  peanut:    ['peanut', ' pb ', ' pb+', 'pb '],
  fish:      ['fish', 'salmon', 'tuna', 'tilapia', 'asa tibs'],
  shellfish: ['shrimp', 'prawn', 'lobster', 'crab', 'shellfish'],
  soy:       ['soy', 'soya', 'tofu', 'tempeh', 'edamame'],
  beef:      ['beef', 'steak', 'burger', 'kitfo', 'gored', 'zigni', 'key wot', 'tibs — beef', 'beef tibs', 'dulet', 'bolognese'],
  chicken:   ['chicken', 'doro', 'shawarma'],
  lamb:      ['lamb'],
  pork:      ['pork', 'bacon', 'ham', 'sausage'],
}

const MEAT_GROUPS = ['beef', 'chicken', 'lamb', 'pork']
const ANIMAL_GROUPS = [...MEAT_GROUPS, 'fish', 'shellfish']

// User-typed allergy → canonical category. Anything unrecognised falls through
// to a substring match on the food name (the freeform path).
const ALLERGY_CANONICAL = {
  'peanut': 'peanut', 'peanuts': 'peanut', 'peanut butter': 'peanut',
  'dairy': 'dairy', 'milk': 'dairy', 'lactose': 'dairy', 'cheese': 'dairy', 'butter': 'dairy',
  'egg': 'egg', 'eggs': 'egg',
  'gluten': 'gluten', 'wheat': 'gluten', 'barley': 'gluten',
  'fish': 'fish', 'seafood': 'fish',
  'shellfish': 'shellfish', 'shrimp': 'shellfish', 'crab': 'shellfish', 'lobster': 'shellfish',
  'soy': 'soy', 'soya': 'soy',
  'beef': 'beef', 'chicken': 'chicken', 'pork': 'pork', 'lamb': 'lamb',
}

function haystack(item) {
  return [item.name, item.fullName, item.description, ...(item.tags ?? [])]
    .filter(Boolean).join(' ').toLowerCase()
}

function hasAny(text, keywords) {
  return keywords.some(k => text.includes(k))
}

// Returns the set of canonical allergen categories an item contains.
export function inferAllergens(item) {
  const text = haystack(item)
  const out = new Set()
  for (const [allergen, kws] of Object.entries(ALLERGEN_KEYWORDS)) {
    if (hasAny(text, kws)) out.add(allergen)
  }
  return out
}

// Returns the set of dietary patterns the item is *compatible with*.
export function inferPatterns(item) {
  const allergens = inferAllergens(item)
  const text = haystack(item)
  const patterns = new Set()

  const hasMeat   = MEAT_GROUPS.some(g => allergens.has(g))
  const hasAnimal = ANIMAL_GROUPS.some(g => allergens.has(g))
  const hasDairy  = allergens.has('dairy')
  const hasEgg    = allergens.has('egg')

  // Some items are explicitly tagged plant-based — trust the tag.
  const taggedPlant = (item.tags ?? []).some(t => /plant|vegan|vegetarian/i.test(t))

  if (!hasAnimal && (taggedPlant || !hasDairy && !hasEgg)) patterns.add('Vegan')
  if (!hasMeat && (!allergens.has('fish') && !allergens.has('shellfish'))) patterns.add('Vegetarian')
  if (!hasMeat) patterns.add('Pescatarian')

  // Halal: exclude pork (and alcohol — none in dataset). Kitfo/gored gored
  // are raw beef but halal-permissible if the meat is halal-slaughtered, so
  // we don't auto-exclude them.
  if (!allergens.has('pork')) patterns.add('Halal')

  // Kosher: no pork, no shellfish, no fish-with-meat or meat-with-dairy
  // mixing. We can't detect mixing reliably, so check pork+shellfish only
  // and treat dairy+meat combos conservatively.
  if (!allergens.has('pork') && !allergens.has('shellfish')) {
    const meatAndDairy = hasMeat && hasDairy
    if (!meatAndDairy) patterns.add('Kosher')
  }

  // Keto: <= 30g carbs per serving. Use the carbs field if present.
  if (typeof item.carbs === 'number' && item.carbs <= 30) patterns.add('Keto')

  // Gluten-free / Dairy-free are derived from absence of those allergens.
  if (!allergens.has('gluten')) patterns.add('Gluten-free')
  if (!allergens.has('dairy'))  patterns.add('Dairy-free')

  // Mediterranean is broad and informational — don't filter on it.
  patterns.add('Mediterranean')

  return patterns
}

// Returns an array of human-readable conflict reasons. Empty array = compatible.
export function getConflicts(item, { allergies = [], dietaryPreferences = [] } = {}) {
  const reasons = []
  const allergens = inferAllergens(item)
  const patterns = inferPatterns(item)
  const text = haystack(item)

  for (const raw of allergies) {
    const t = raw.trim().toLowerCase()
    if (!t) continue
    const canonical = ALLERGY_CANONICAL[t]
    if (canonical) {
      if (allergens.has(canonical)) reasons.push(`Contains ${canonical}`)
    } else if (text.includes(t)) {
      // Freeform allergy (e.g. "rosemary") — substring match.
      reasons.push(`Contains ${raw.trim()}`)
    }
  }

  for (const pref of dietaryPreferences) {
    if (!patterns.has(pref)) reasons.push(`Not ${pref.toLowerCase()}`)
  }

  return reasons
}

export function isAllowed(item, prefs) {
  return getConflicts(item, prefs).length === 0
}
