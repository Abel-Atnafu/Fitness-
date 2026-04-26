// ─── Shared Alternate Pools ───────────────────────────────────────────────────

const ALT_BF_SAMBUSA = {
  id: 'alt-eth-sambusa-tea', name: 'Sambusa + Tea', fullName: 'Sambusa with Ethiopian Tea',
  type: 'ethiopian', flag: '🇪🇹', emoji: '🥟', calories: 380, protein: 12, carbs: 44, fat: 18,
  description: 'Three crispy sambusas filled with spiced lentils or beef, paired with strong Ethiopian spiced tea.',
  prepTime: '5 min', tags: ['crispy', 'traditional'],
}
const ALT_BF_SCRAMBLED = {
  id: 'alt-for-scrambled-toast', name: 'Scrambled Eggs + Toast', fullName: 'Scrambled Eggs with Whole Wheat Toast',
  type: 'foreign', flag: '🌍', emoji: '🍳', calories: 310, protein: 20, carbs: 26, fat: 14,
  description: 'Fluffy scrambled eggs with whole wheat toast. Quick, protein-rich, and filling.',
  prepTime: '8 min', tags: ['high-protein', 'quick'],
}
const ALT_BF_SMOOTHIE = {
  id: 'alt-for-banana-pb-smoothie', name: 'Banana PB Smoothie', fullName: 'Banana Peanut Butter Milk Smoothie',
  type: 'foreign', flag: '🌍', emoji: '🥤', calories: 340, protein: 16, carbs: 42, fat: 12,
  description: 'Whole milk blended with ripe banana and peanut butter. Energising and no yogurt.',
  prepTime: '5 min', tags: ['liquid-meal', 'energising'],
}
const ALT_BF_GENFO = {
  id: 'alt-eth-genfo', name: 'Genfo', fullName: 'Genfo — Ethiopian Barley Porridge',
  type: 'ethiopian', flag: '🇪🇹', emoji: '🥣', calories: 480, protein: 14, carbs: 78, fat: 14,
  description: 'Thick barley porridge with a crater of spiced niter kibbeh. A warm, nourishing start.',
  prepTime: '20 min', tags: ['high-carb', 'comforting', 'traditional'],
}
const ALT_BF_FOUL = {
  id: 'alt-eth-foul', name: 'Foul', fullName: 'Foul — Spiced Fava Bean Stew',
  type: 'ethiopian', flag: '🇪🇹', emoji: '🫘', calories: 320, protein: 18, carbs: 44, fat: 8,
  description: 'Slow-cooked fava beans spiced with berbere and topped with niter kibbeh.',
  prepTime: '20 min', tags: ['high-protein', 'plant-based', 'filling'],
}
const ALT_BF_PANCAKES = {
  id: 'alt-for-pancakes', name: 'Pancakes', fullName: 'Fluffy Pancakes with Honey',
  type: 'foreign', flag: '🌍', emoji: '🥞', calories: 310, protein: 8, carbs: 52, fat: 9,
  description: 'Soft, fluffy pancakes drizzled with honey. A comforting weekend-style breakfast.',
  prepTime: '15 min', tags: ['sweet', 'comforting'],
}
const ALT_BF_YOGURT_FRUIT = {
  id: 'alt-for-yogurt-fruit', name: 'Greek Yogurt + Fruit', fullName: 'Greek Yogurt with Mixed Fruit',
  type: 'foreign', flag: '🌍', emoji: '🥛', calories: 230, protein: 20, carbs: 26, fat: 3,
  description: 'Thick creamy Greek yogurt topped with fresh mango, banana, and strawberries.',
  prepTime: '5 min', tags: ['high-protein', 'light', 'quick'],
}
const ALT_BF_OATMEAL = {
  id: 'alt-for-oatmeal-banana', name: 'Oatmeal + Banana', fullName: 'Oatmeal with Banana & Peanut Butter',
  type: 'foreign', flag: '🌍', emoji: '🥣', calories: 380, protein: 14, carbs: 62, fat: 10,
  description: 'Creamy oatmeal topped with sliced banana and a spoonful of peanut butter.',
  prepTime: '8 min', tags: ['high-fiber', 'energising'],
}

const ALT_LU_SHIRO = {
  id: 'alt-eth-shiro-injera', name: 'Shiro Wot + Injera', fullName: 'Shiro Wot with Injera',
  type: 'ethiopian', flag: '🇪🇹', emoji: '🫘', calories: 520, protein: 22, carbs: 72, fat: 14,
  description: 'Silky chickpea stew simmered in niter kibbeh and berbere, scooped with injera.',
  prepTime: '20 min', tags: ['plant-based', 'spicy', 'filling'],
}
const ALT_LU_DULET = {
  id: 'alt-eth-dulet-plate', name: 'Dulet', fullName: 'Dulet — Spiced Organ Meat Mix',
  type: 'ethiopian', flag: '🇪🇹', emoji: '🫕', calories: 580, protein: 44, carbs: 32, fat: 28,
  description: 'Minced tripe, liver and lean beef stir-fried with spiced butter and mitmita. Bold and nutrient-dense.',
  prepTime: '25 min', tags: ['high-protein', 'bold', 'traditional'],
}
const ALT_LU_CHICKEN_SALAD = {
  id: 'alt-for-chicken-avo-salad', name: 'Chicken + Avo Salad', fullName: 'Grilled Chicken & Avocado Salad',
  type: 'foreign', flag: '🌍', emoji: '🥗', calories: 420, protein: 38, carbs: 14, fat: 22,
  description: 'Grilled chicken breast on greens with sliced avocado and lemon herb dressing.',
  prepTime: '15 min', tags: ['high-protein', 'healthy-fat', 'fresh'],
}
const ALT_LU_CAESAR_WRAP = {
  id: 'alt-for-caesar-wrap', name: 'Chicken Caesar Wrap', fullName: 'Grilled Chicken Caesar Wrap',
  type: 'foreign', flag: '🌍', emoji: '🌯', calories: 460, protein: 34, carbs: 38, fat: 18,
  description: 'Grilled chicken strips, romaine, and caesar dressing wrapped in a soft flour tortilla.',
  prepTime: '10 min', tags: ['high-protein', 'balanced', 'quick'],
}
const ALT_LU_DAL = {
  id: 'alt-for-dal', name: 'Dal + Rice', fullName: 'Red Lentil Dal with Steamed Rice',
  type: 'foreign', flag: '🌍', emoji: '🍲', calories: 430, protein: 18, carbs: 72, fat: 7,
  description: 'Spiced red lentil curry simmered with tomato and cumin, served over fluffy white rice.',
  prepTime: '25 min', tags: ['plant-based', 'filling', 'high-fiber'],
}
const ALT_LU_KITFO = {
  id: 'alt-eth-kitfo', name: 'Kitfo', fullName: 'Kitfo — Ethiopian Steak Tartare',
  type: 'ethiopian', flag: '🇪🇹', emoji: '🥩', calories: 580, protein: 44, carbs: 32, fat: 30,
  description: "Minced raw beef seasoned with mitmita and niter kibbeh, served with injera.",
  prepTime: '15 min', tags: ['high-protein', 'bold', 'traditional'],
}
const ALT_LU_VEG_CURRY = {
  id: 'alt-for-veg-curry', name: 'Vegetable Curry + Rice', fullName: 'Spiced Vegetable Curry with Rice',
  type: 'foreign', flag: '🌍', emoji: '🍛', calories: 480, protein: 12, carbs: 74, fat: 14,
  description: 'Mixed vegetables in a fragrant coconut curry sauce, served over steamed rice.',
  prepTime: '25 min', tags: ['plant-based', 'aromatic', 'filling'],
}

const ALT_DN_FISH_RICE = {
  id: 'alt-for-grilled-fish-rice', name: 'Grilled Fish + Rice', fullName: 'Herb Grilled Fish with Steamed Rice',
  type: 'foreign', flag: '🌍', emoji: '🐟', calories: 580, protein: 46, carbs: 52, fat: 14,
  description: 'Herb-marinated grilled fish fillet over steamed rice with a squeeze of lemon.',
  prepTime: '20 min', tags: ['high-protein', 'lean', 'clean'],
}
const ALT_DN_PIZZA = {
  id: 'alt-for-pizza-beef', name: 'Beef Pizza (2 slices)', fullName: 'Beef & Cheese Pizza',
  type: 'foreign', flag: '🌍', emoji: '🍕', calories: 620, protein: 28, carbs: 68, fat: 26,
  description: 'Two slices of cheesy beef-topped pizza. A weekend treat that still fits your target.',
  prepTime: '5 min (takeout)', tags: ['comfort', 'weekend'],
}
const ALT_DN_MISIR_FIRFIR = {
  id: 'alt-eth-misir-firfir', name: 'Misir Firfir', fullName: 'Misir Firfir — Spiced Lentil with Torn Injera',
  type: 'ethiopian', flag: '🇪🇹', emoji: '🫘', calories: 500, protein: 18, carbs: 76, fat: 12,
  description: 'Torn injera pieces mixed through spiced red lentil stew. Lighter and plant-based.',
  prepTime: '15 min', tags: ['plant-based', 'spicy', 'filling'],
}
const ALT_DN_GRILLED_SALMON = {
  id: 'alt-for-grilled-salmon', name: 'Grilled Salmon', fullName: 'Grilled Salmon with Steamed Veg',
  type: 'foreign', flag: '🌍', emoji: '🐟', calories: 500, protein: 54, carbs: 20, fat: 22,
  description: 'Pan-seared salmon fillet with steamed broccoli and lemon butter. High omega-3 and protein.',
  prepTime: '20 min', tags: ['omega-3', 'high-protein', 'clean'],
}
const ALT_DN_BEEF_LASAGNA = {
  id: 'alt-for-beef-lasagna', name: 'Beef Lasagna', fullName: 'Classic Beef & Cheese Lasagna',
  type: 'foreign', flag: '🌍', emoji: '🍝', calories: 560, protein: 32, carbs: 54, fat: 24,
  description: 'Layers of pasta, rich ground beef bolognese, and melted cheese. A hearty dinner.',
  prepTime: '40 min', tags: ['high-carb', 'comfort', 'filling'],
}
const ALT_DN_TIBS_INJERA = {
  id: 'alt-eth-tibs-injera', name: 'Tibs + Injera', fullName: 'Spiced Beef Tibs with Injera',
  type: 'ethiopian', flag: '🇪🇹', emoji: '🥩', calories: 680, protein: 48, carbs: 52, fat: 28,
  description: 'Tender beef cubes sautéed in spiced niter kibbeh and rosemary, served with injera.',
  prepTime: '25 min', tags: ['high-protein', 'spicy', 'traditional'],
}
const ALT_DN_CHICKEN_KEBAB = {
  id: 'alt-for-chicken-kebab', name: 'Chicken Kebab + Rice', fullName: 'Grilled Chicken Kebab with Rice',
  type: 'foreign', flag: '🌍', emoji: '🍢', calories: 520, protein: 42, carbs: 48, fat: 16,
  description: 'Marinated chicken skewers grilled to perfection, served with seasoned rice and salad.',
  prepTime: '25 min', tags: ['high-protein', 'grilled', 'balanced'],
}
const ALT_DN_BEEF_STEW = {
  id: 'alt-for-beef-stew', name: 'Beef Stew + Bread', fullName: 'Hearty Beef Stew with Bread',
  type: 'foreign', flag: '🌍', emoji: '🍲', calories: 540, protein: 32, carbs: 44, fat: 22,
  description: 'Slow-cooked beef chunks with carrots, potatoes, and herbs in a rich gravy.',
  prepTime: '45 min', tags: ['comfort', 'hearty', 'filling'],
}

// ─── Meal Plans ───────────────────────────────────────────────────────────────

export const MEAL_PLANS = [
  {
    day: 0,
    dayName: 'Monday',
    dayShort: 'M',
    meals: {
      breakfast: {
        id: 'eth-firfir', name: 'Firfir', fullName: 'Firfir — Injera in Berbere Sauce',
        type: 'ethiopian', flag: '🇪🇹', emoji: '🍲', calories: 420, protein: 14, carbs: 72, fat: 9,
        description: 'Torn injera soaked in rich berbere and niter kibbeh sauce. The ultimate Ethiopian breakfast.',
        prepTime: '10 min', tags: ['high-carb', 'spicy', 'traditional'],
        alternates: [ALT_BF_GENFO, ALT_BF_SCRAMBLED],
      },
      lunch: {
        id: 'eth-tibs', name: 'Tibs', fullName: 'Beef Tibs with Injera',
        type: 'ethiopian', flag: '🇪🇹', emoji: '🥩', calories: 680, protein: 48, carbs: 52, fat: 28,
        description: 'Tender beef cubes sautéed in spiced niter kibbeh with rosemary, served with injera.',
        prepTime: '25 min', tags: ['high-protein', 'spicy'],
        alternates: [ALT_LU_SHIRO, ALT_LU_CAESAR_WRAP],
      },
      dinner: {
        id: 'for-grilled-steak', name: 'Grilled Steak + Salad', fullName: 'Grilled Sirloin Steak with Side Salad',
        type: 'foreign', flag: '🌍', emoji: '🥗', calories: 795, protein: 62, carbs: 18, fat: 52,
        description: 'Juicy grilled sirloin steak with a fresh green salad, lightly dressed.',
        prepTime: '20 min', tags: ['high-protein', 'keto'],
        alternates: [ALT_DN_GRILLED_SALMON, ALT_DN_TIBS_INJERA],
      },
    },
    totalCalories: 1895,
  },
  {
    day: 1,
    dayName: 'Tuesday',
    dayShort: 'T',
    meals: {
      breakfast: {
        id: 'for-avo-toast', name: 'Avocado Toast + Eggs', fullName: 'Avocado Toast with Fried Eggs',
        type: 'foreign', flag: '🌍', emoji: '🥑', calories: 490, protein: 20, carbs: 38, fat: 30,
        description: 'Creamy avocado on whole wheat toast topped with 2 perfectly fried eggs.',
        prepTime: '10 min', tags: ['healthy-fat', 'filling'],
        alternates: [ALT_BF_SMOOTHIE, ALT_BF_FOUL],
      },
      lunch: {
        id: 'eth-doro-wot', name: 'Doro Wot', fullName: 'Doro Wot — Ethiopian Chicken Stew',
        type: 'ethiopian', flag: '🇪🇹', emoji: '🍗', calories: 620, protein: 44, carbs: 58, fat: 18,
        description: 'Slow-cooked chicken legs in a deeply spiced berbere sauce, served with injera.',
        prepTime: '45 min', tags: ['high-protein', 'spicy', 'traditional'],
        alternates: [ALT_LU_CHICKEN_SALAD, ALT_LU_DAL],
      },
      dinner: {
        id: 'for-beef-stirfry', name: 'Beef Stir Fry + Rice', fullName: 'Beef Stir Fry with Steamed Rice',
        type: 'foreign', flag: '🌍', emoji: '🍚', calories: 800, protein: 42, carbs: 88, fat: 26,
        description: 'Tender strips of beef stir-fried in savory sauce, served over fluffy steamed rice.',
        prepTime: '20 min', tags: ['balanced', 'filling'],
        alternates: [ALT_DN_MISIR_FIRFIR, ALT_DN_BEEF_LASAGNA],
      },
    },
    totalCalories: 1910,
  },
  {
    day: 2,
    dayName: 'Wednesday',
    dayShort: 'W',
    meals: {
      breakfast: {
        id: 'eth-chechebsa', name: 'Chechebsa', fullName: 'Chechebsa — Pan Bread with Niter Kibbeh',
        type: 'ethiopian', flag: '🇪🇹', emoji: '🥞', calories: 510, protein: 12, carbs: 68, fat: 22,
        description: 'Shredded flatbread pan-fried in spiced niter kibbeh with berbere. Rich and aromatic.',
        prepTime: '15 min', tags: ['high-carb', 'buttery', 'traditional'],
        alternates: [ALT_BF_PANCAKES, ALT_BF_YOGURT_FRUIT],
      },
      lunch: {
        id: 'for-grilled-chicken-rice', name: 'Grilled Chicken + Rice', fullName: 'Grilled Chicken Breast with Steamed Rice',
        type: 'foreign', flag: '🌍', emoji: '🍗', calories: 640, protein: 52, carbs: 74, fat: 12,
        description: 'Lemon-herb grilled chicken breast served over perfectly cooked steamed white rice.',
        prepTime: '25 min', tags: ['high-protein', 'lean', 'clean'],
        alternates: [ALT_LU_DULET, ALT_LU_VEG_CURRY],
      },
      dinner: {
        id: 'eth-zigni', name: 'Zigni', fullName: 'Zigni — Spiced Beef Stew',
        type: 'ethiopian', flag: '🇪🇹', emoji: '🍲', calories: 730, protein: 46, carbs: 60, fat: 30,
        description: 'Eritrean-style slow-braised beef in a tomato and berbere sauce, served with injera.',
        prepTime: '40 min', tags: ['high-protein', 'spicy', 'rich'],
        alternates: [ALT_DN_PIZZA, ALT_DN_BEEF_STEW],
      },
    },
    totalCalories: 1880,
  },
  {
    day: 3,
    dayName: 'Thursday',
    dayShort: 'T',
    meals: {
      breakfast: {
        id: 'for-oatmeal', name: 'Oatmeal + Banana', fullName: 'Oatmeal with Banana & Peanut Butter',
        type: 'foreign', flag: '🌍', emoji: '🥣', calories: 480, protein: 16, carbs: 72, fat: 14,
        description: 'Creamy oatmeal topped with sliced banana and a generous spoonful of peanut butter.',
        prepTime: '8 min', tags: ['high-fiber', 'energising'],
        alternates: [ALT_BF_SAMBUSA, ALT_BF_YOGURT_FRUIT],
      },
      lunch: {
        id: 'eth-kitfo', name: 'Kitfo', fullName: 'Kitfo — Ethiopian Steak Tartare',
        type: 'ethiopian', flag: '🇪🇹', emoji: '🥩', calories: 720, protein: 52, carbs: 48, fat: 36,
        description: "Minced raw beef seasoned with mitmita and niter kibbeh. Ethiopia's prized dish, served with injera.",
        prepTime: '15 min', tags: ['high-protein', 'high-fat', 'traditional'],
        alternates: [ALT_LU_SHIRO, ALT_LU_CHICKEN_SALAD],
      },
      dinner: {
        id: 'for-shawarma-bowl', name: 'Shawarma Bowl', fullName: 'Chicken Shawarma Rice Bowl',
        type: 'foreign', flag: '🌍', emoji: '🌯', calories: 700, protein: 46, carbs: 68, fat: 22,
        description: 'Marinated chicken shawarma sliced over seasoned rice with garlic sauce and salad.',
        prepTime: '25 min', tags: ['high-protein', 'flavorful'],
        alternates: [ALT_DN_FISH_RICE, ALT_DN_CHICKEN_KEBAB],
      },
    },
    totalCalories: 1900,
  },
  {
    day: 4,
    dayName: 'Friday',
    dayShort: 'F',
    meals: {
      breakfast: {
        id: 'eth-foul', name: 'Foul', fullName: 'Foul — Spiced Fava Bean Stew',
        type: 'ethiopian', flag: '🇪🇹', emoji: '🫘', calories: 520, protein: 28, carbs: 74, fat: 10,
        description: 'Slow-cooked fava beans spiced with berbere and topped with niter kibbeh, served with bread.',
        prepTime: '20 min', tags: ['high-protein', 'plant-based', 'filling'],
        alternates: [ALT_BF_SCRAMBLED, ALT_BF_PANCAKES],
      },
      lunch: {
        id: 'for-pasta-meat', name: 'Pasta + Meat Sauce', fullName: 'Pasta with Hearty Meat Sauce',
        type: 'foreign', flag: '🌍', emoji: '🍝', calories: 740, protein: 36, carbs: 92, fat: 22,
        description: 'Al dente pasta tossed in a rich ground beef bolognese sauce with herbs and parmesan.',
        prepTime: '30 min', tags: ['high-carb', 'satisfying'],
        alternates: [ALT_LU_KITFO, ALT_LU_CAESAR_WRAP],
      },
      dinner: {
        id: 'eth-key-wot', name: 'Key Wot', fullName: 'Key Wot — Spiced Beef Stew',
        type: 'ethiopian', flag: '🇪🇹', emoji: '🍛', calories: 660, protein: 44, carbs: 62, fat: 24,
        description: 'Tender beef simmered in a vibrant berbere-tomato sauce, served with injera. A classic.',
        prepTime: '50 min', tags: ['high-protein', 'spicy', 'traditional'],
        alternates: [ALT_DN_PIZZA, ALT_DN_GRILLED_SALMON],
      },
    },
    totalCalories: 1920,
  },
  {
    day: 5,
    dayName: 'Saturday',
    dayShort: 'S',
    meals: {
      breakfast: {
        id: 'for-french-toast', name: 'French Toast', fullName: 'French Toast with Banana',
        type: 'foreign', flag: '🌍', emoji: '🍞', calories: 460, protein: 16, carbs: 66, fat: 14,
        description: 'Golden French toast dusted with cinnamon, served with a fresh banana on the side.',
        prepTime: '15 min', tags: ['sweet', 'comforting'],
        alternates: [ALT_BF_OATMEAL, ALT_BF_SAMBUSA],
      },
      lunch: {
        id: 'eth-gored-gored', name: 'Gored Gored', fullName: 'Gored Gored — Raw Beef Cubes',
        type: 'ethiopian', flag: '🇪🇹', emoji: '🥩', calories: 700, protein: 56, carbs: 46, fat: 32,
        description: "Cubed raw beef tossed in mitmita, niter kibbeh and awaze. Ethiopia's boldest dish.",
        prepTime: '10 min', tags: ['high-protein', 'bold', 'traditional'],
        alternates: [ALT_LU_CHICKEN_SALAD, ALT_LU_VEG_CURRY],
      },
      dinner: {
        id: 'for-salmon-quinoa', name: 'Salmon + Quinoa', fullName: 'Baked Salmon with Quinoa & Avocado',
        type: 'foreign', flag: '🌍', emoji: '🐟', calories: 710, protein: 48, carbs: 52, fat: 32,
        description: 'Herb-crusted baked salmon on a bed of quinoa with sliced avocado and lemon.',
        prepTime: '25 min', tags: ['omega-3', 'healthy-fat', 'clean'],
        alternates: [ALT_DN_MISIR_FIRFIR, ALT_DN_BEEF_LASAGNA],
      },
    },
    totalCalories: 1870,
  },
  {
    day: 6,
    dayName: 'Sunday',
    dayShort: 'S',
    meals: {
      breakfast: {
        id: 'eth-genfo', name: 'Genfo', fullName: 'Genfo — Ethiopian Porridge',
        type: 'ethiopian', flag: '🇪🇹', emoji: '🥣', calories: 480, protein: 14, carbs: 78, fat: 14,
        description: 'Thick barley porridge with a crater of spiced niter kibbeh. A warm, nourishing start.',
        prepTime: '20 min', tags: ['high-carb', 'comforting', 'traditional'],
        alternates: [ALT_BF_SMOOTHIE, ALT_BF_OATMEAL],
      },
      lunch: {
        id: 'for-burger-salad', name: 'Burger + Salad', fullName: 'Beef Burger Patty with Side Salad',
        type: 'foreign', flag: '🌍', emoji: '🍔', calories: 680, protein: 44, carbs: 18, fat: 46,
        description: 'Juicy beef patty seasoned to perfection, served with a crisp side salad.',
        prepTime: '20 min', tags: ['high-protein', 'keto'],
        alternates: [ALT_LU_SHIRO, ALT_LU_DAL],
      },
      dinner: {
        id: 'eth-asa-tibs', name: 'Asa Tibs', fullName: 'Asa Tibs — Ethiopian Fish Tibs',
        type: 'ethiopian', flag: '🇪🇹', emoji: '🐟', calories: 745, protein: 50, carbs: 54, fat: 28,
        description: 'Spiced fish fillets sautéed with berbere and served with injera. A lighter Ethiopian option.',
        prepTime: '20 min', tags: ['high-protein', 'spicy', 'seafood'],
        alternates: [ALT_DN_CHICKEN_KEBAB, ALT_DN_TIBS_INJERA],
      },
    },
    totalCalories: 1905,
  },
]

export const CALORIE_TARGET = 1900
