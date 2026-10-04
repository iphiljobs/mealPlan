# mealPlan

A responsive GitHub Pages website for the **final verified 7-day Indian meal plan**, including exact portions, nutrition tracking, recipe alternatives, batch-prep guidance, and store-specific shopping support.

## Live Website

**https://iphiljobs.github.io/mealPlan/**

The site is deployed automatically from the `main` branch using **GitHub Actions + GitHub Pages**.

## What the Website Includes

- **7-day exact meal plan**
  - Breakfast, mid-morning fruit, lunch, and dinner
  - Exact ingredient quantities
  - Meal-level calories, protein, fiber, minerals, and selected vitamin values
  - Viruddha-Ahara safeguards shown alongside each meal

- **Daily nutrition dashboard**
  - Calories
  - Protein, carbohydrates, fiber, and fat
  - Calcium, iron, magnesium, and potassium
  - Omega-3
  - Saturated fat
  - Vitamin A total
  - Preformed vitamin A
  - Vitamins C, D, E, and K
  - Vitamins B1, B2, B3, B5, B6, B7/biotin, B9/folate, and B12

- **84 Indian-style recipe options**
  - 3 interchangeable recipe options for each scheduled meal
  - Recommended low-effort option highlighted
  - Equipment, prep time, cook time, batch-friendliness, and cooking method
  - Instant Pot, stovetop, air-fryer, microwave, and simple batch-cooking options

- **Batch-prep system**
  - Rice
  - Dals
  - Rajma and chickpeas
  - Chicken
  - Goat/mutton
  - Vegetables
  - Eggs and egg whites
  - Breakfast dry packs
  - Seeds
  - Fresh-cook guidance for fish

- **Interactive shopping planner**
  - Costco Wesley Chapel
  - Walmart Wesley Chapel
  - Lotte Plaza Market Tampa
  - Weekly quantity requirements
  - Package-size guidance
  - Recommended store by item
  - Search and store/category filters
  - Browser-saved shopping checklist

- **Criteria audit**
  - Calories: **1,700–1,900 kcal/day**
  - Protein: **110–130 g/day**
  - Fiber: **≥38 g/day**
  - Saturated fat: **<10% of calories**
  - Calcium, iron, magnesium, potassium, B12, folate, and omega-3 targets
  - Fish, ragi, cod-liver, produce, and ingredient-selection rules
  - Explicit tracking of remaining gaps

- **Viruddha-Ahara audit**
  - 18 requested traditional food-combination rules
  - Fruit eaten separately
  - Milk breakfasts kept away from added salt, onion, and garlic
  - Meat/fish meals kept dairy-free
  - Behavioral rules clearly separated from ingredient rules

- **Sources and methodology**
  - USDA FoodData Central
  - NIH dietary reference resources
  - FDA/EPA fish guidance
  - 2026 EWG Dirty Dozen / Clean Fifteen references
  - User-provided ICAN cod-liver label information
  - Ayurvedic rule-set source used for the requested Viruddha-Ahara framework

## Key Final Plan Decisions

- Tilapia: **160 g raw**, once weekly
- Ocean perch: **160 g raw**, once weekly
- ICAN cod liver: **20 g once weekly**
- Frequent ragi retained
- No tofu
- No salmon
- No croaker
- No red snapper
- No farm rock fish
- Fruit is eaten literally by itself
- No yogurt/curd in the final plan
- Approved seasonings are kept explicit
- Day 2 includes an additional **5 g chia**
- Day 5 includes an additional **5 g ground flaxseed**

## Important Nutrition Note

The plan meets the requested calorie, protein, fiber, and most micronutrient targets in the planning model.

**Vitamin D remains below the 15 µg/day food target on most days.** The plan intentionally does **not** increase cod liver simply to correct vitamin D because cod liver is also highly concentrated in preformed vitamin A.

Nutrition values are planning estimates based on generic food-composition data and may differ from exact brands, preparation methods, or laboratory analysis. Vitamin B7/biotin values are especially approximate because generic food datasets often have incomplete biotin data.

The traditional Viruddha-Ahara rules are included because they were specifically requested and are presented separately from modern biomedical nutrition guidance.

## Downloads

The website provides direct downloads for the synchronized source artifacts:

- `downloads/meal_plan_with_all_vitamins.xlsx`
- `downloads/shopping_list_all_vitamins.xlsx`
- `downloads/meal_plan_recipes_all_vitamins.pdf`

## Repository Structure

```text
mealPlan/
├── index.html
├── styles.css
├── app.js
├── data-init.js
├── data-meals-1.js
├── data-meals-2.js
├── data-dailyNutrition.js
├── data-recipes-1.js ... data-recipes-6.js
├── data-shopping-1.js ... data-shopping-3.js
├── data-batchPrep.js
├── data-criteria.js
├── data-viruddha.js
├── data-targets.js
├── data-sources.js
├── data-shoppingNotes.js
├── downloads/
│   ├── meal_plan_with_all_vitamins.xlsx
│   ├── shopping_list_all_vitamins.xlsx
│   └── meal_plan_recipes_all_vitamins.pdf
├── .github/
│   └── workflows/
│       └── pages.yml
├── .nojekyll
└── README.md
```

## Technology

The website is intentionally lightweight:

- HTML5
- CSS3
- Vanilla JavaScript
- Browser `localStorage` for shopping-checklist persistence
- No framework
- No database
- No build step
- No server-side runtime

## GitHub Pages Deployment

Deployment is handled by:

```text
.github/workflows/pages.yml
```

Every push to `main` triggers the GitHub Pages workflow.

The current production URL is:

**https://iphiljobs.github.io/mealPlan/**

## Local Preview

Clone the repository and serve it with any static web server.

For example:

```bash
git clone https://github.com/iphiljobs/mealPlan.git
cd mealPlan
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Status

**Published and live on GitHub Pages.**

Repository: **https://github.com/iphiljobs/mealPlan**

Website: **https://iphiljobs.github.io/mealPlan/**
