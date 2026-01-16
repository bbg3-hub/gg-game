export type PuzzleCategory = 
  | 'math' 
  | 'physics' 
  | 'chemistry' 
  | 'cooking' 
  | 'finance' 
  | 'health' 
  | 'time' 
  | 'statistics' 
  | 'gardening' 
  | 'home';

export interface EducationalPuzzle {
  id: string;
  title: string;
  category: PuzzleCategory;
  realWorldContext: string;
  problem: string;
  formula?: string;
  formulaExplanation?: string;
  solution: string;
  steps?: string[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tips?: string[];
  realWorldUse?: string;
}

function generatePuzzleId(category: string, index: number): string {
  return `${category}-${String(index).padStart(3, '0')}`;
}

export const EDUCATIONAL_PUZZLES: EducationalPuzzle[] = [
  // ============================================
  // MATHEMATICS & GEOMETRY (50+ puzzles)
  // ============================================

  // Basic Math - Area & Geometry
  {
    id: generatePuzzleId('math', 1),
    title: 'Pizza Area Calculation',
    category: 'math',
    realWorldContext: 'Ordering pizza for a party and need to calculate how much each person gets',
    problem: 'Pizza has radius 7 inches. What is the area in square inches? (Use π ≈ 3.14)',
    formula: 'Area = π × r²',
    formulaExplanation: 'Multiply pi by the radius squared to get the area of a circle',
    solution: '153.86 sq inches',
    steps: [
      'Square the radius: 7² = 49',
      'Multiply by π: 49 × 3.14 = 153.86'
    ],
    explanation: 'The area of a circle is found by squaring the radius and multiplying by pi. This tells you the total surface area of the pizza.',
    difficulty: 'easy',
    tips: ['Always square the radius first before multiplying by pi', 'Round to two decimal places for practical measurements'],
    realWorldUse: 'Calculating food portions, material needed for circular objects'
  },
  {
    id: generatePuzzleId('math', 2),
    title: 'Ladder Length',
    category: 'math',
    realWorldContext: 'Safety calculation for placing a ladder against a wall',
    problem: 'A ladder leans against a wall. The height it reaches is 10 feet, and its base is 6 feet from the wall. What is the length of the ladder?',
    formula: 'c = √(a² + b²)',
    formulaExplanation: 'Pythagorean theorem: hypotenuse equals square root of sum of squares',
    solution: '11.66 feet',
    steps: [
      'Square both legs: 10² = 100, 6² = 36',
      'Add them: 100 + 36 = 136',
      'Take the square root: √136 ≈ 11.66'
    ],
    explanation: 'The Pythagorean theorem applies to right triangles. The ladder, wall, and ground form a right triangle where the ladder is the hypotenuse.',
    difficulty: 'easy',
    tips: ['Draw a diagram to visualize the right triangle', 'Round to 2 decimal places for practical use'],
    realWorldUse: 'Construction safety, measuring distances, navigation'
  },
  {
    id: generatePuzzleId('math', 3),
    title: 'Discount Calculation',
    category: 'math',
    realWorldContext: 'Shopping during a sale and need to know final price',
    problem: 'An item costs $50. There is a 20% discount. What is the final price?',
    formula: 'Final Price = Original Price × (1 - Discount Rate)',
    formulaExplanation: 'Subtract the discount percentage from 100%, then multiply by original price',
    solution: '$40',
    steps: [
      'Convert percentage to decimal: 20% = 0.20',
      'Subtract from 1: 1 - 0.20 = 0.80',
      'Multiply by original price: 50 × 0.80 = 40'
    ],
    explanation: 'A 20% discount means you pay 80% of the original price. Simply multiply to find the sale price.',
    difficulty: 'easy',
    tips: ['You can also calculate the discount amount first: 50 × 0.20 = $10, then subtract'],
    realWorldUse: 'Shopping, budgeting, financial planning'
  },
  {
    id: generatePuzzleId('math', 4),
    title: 'Simple Interest',
    category: 'math',
    realWorldContext: 'Planning savings and understanding how interest grows',
    problem: 'You save $1000 at 5% annual simple interest. How much will you have after 3 years?',
    formula: 'A = P × (1 + r × t)',
    formulaExplanation: 'Principal plus interest equals principal times (1 + rate times time)',
    solution: '$1150',
    steps: [
      'Calculate annual interest: 1000 × 0.05 = $50',
      'Multiply by years: 50 × 3 = $150',
      'Add to principal: 1000 + 150 = 1150'
    ],
    explanation: 'Simple interest is calculated only on the original principal amount, not on accumulated interest.',
    difficulty: 'easy',
    tips: ['For simple interest, interest stays the same each year'],
    realWorldUse: 'Savings accounts, bonds, short-term loans'
  },
  {
    id: generatePuzzleId('math', 5),
    title: 'Compound Interest',
    category: 'math',
    realWorldContext: 'Long-term investment planning',
    problem: 'You invest $1000 at 5% annual compound interest, compounded yearly. How much after 3 years?',
    formula: 'A = P × (1 + r)^t',
    formulaExplanation: 'Amount equals principal times (1 + rate) raised to power of time',
    solution: '$1157.63',
    steps: [
      'Year 1: 1000 × 1.05 = 1050',
      'Year 2: 1050 × 1.05 = 1102.50',
      'Year 3: 1102.50 × 1.05 = 1157.63'
    ],
    explanation: 'Compound interest earns interest on both the principal and accumulated interest, causing faster growth over time.',
    difficulty: 'medium',
    tips: ['Compound interest grows faster than simple interest over time', 'The formula A = P(1+r)^t works for any compounding period'],
    realWorldUse: 'Investment planning, retirement savings, understanding debt growth'
  },
  {
    id: generatePuzzleId('math', 6),
    title: 'Flooring Calculation',
    category: 'math',
    realWorldContext: 'Renovating a room and buying flooring materials',
    problem: 'A room is 12 feet by 15 feet. How many square feet of flooring are needed?',
    formula: 'Area = Length × Width',
    formulaExplanation: 'Multiply length by width to get rectangular area',
    solution: '180 sq ft',
    steps: [
      'Multiply dimensions: 12 × 15 = 180'
    ],
    explanation: 'The area of a rectangle is found by multiplying length by width. Always add 10% for waste.',
    difficulty: 'easy',
    tips: ['Always buy 10% extra for cutting waste and mistakes'],
    realWorldUse: 'Flooring, carpet, tile installation, paint calculation'
  },
  {
    id: generatePuzzleId('math', 7),
    title: 'Paint Coverage',
    category: 'math',
    realWorldContext: 'Planning a home painting project',
    problem: 'One gallon of paint covers 400 sq ft. A room is 1200 sq ft. How many gallons are needed?',
    formula: 'Gallons = Area ÷ Coverage per Gallon',
    formulaExplanation: 'Divide total area by coverage rate',
    solution: '3 gallons',
    steps: [
      'Divide area by coverage: 1200 ÷ 400 = 3'
    ],
    explanation: 'Divide the total surface area by how much area one gallon covers to find how many gallons you need.',
    difficulty: 'easy',
    tips: ['Always round up to ensure you have enough paint'],
    realWorldUse: 'Home improvement, interior design planning'
  },
  {
    id: generatePuzzleId('math', 8),
    title: 'Tile Count',
    category: 'math',
    realWorldContext: 'Tiling a bathroom floor',
    problem: 'Bathroom floor is 8 feet by 6 feet. Tiles are 1 foot by 1 foot. How many tiles are needed?',
    formula: 'Tiles = (Room Length ÷ Tile Length) × (Room Width ÷ Tile Width)',
    formulaExplanation: 'Calculate tiles needed in each dimension and multiply',
    solution: '48 tiles',
    steps: [
      'Calculate tiles per row: 8 ÷ 1 = 8',
      'Calculate number of rows: 6 ÷ 1 = 6',
      'Multiply: 8 × 6 = 48'
    ],
    explanation: 'Divide the room dimensions by tile dimensions to find how many tiles fit in each direction, then multiply.',
    difficulty: 'easy',
    tips: ['Add 10% extra for cutting waste', 'Consider patternlayout which may need more tiles'],
    realWorldUse: 'Tile installation, flooring projects, mosaics'
  },
  {
    id: generatePuzzleId('math', 9),
    title: 'Land Area Conversion',
    category: 'math',
    realWorldContext: 'Agricultural planning or property assessment',
    problem: 'A rectangular farm plot is 50 meters by 30 meters. What is the area in hectares? (1 hectare = 10,000 sq m)',
    formula: 'Area (hectares) = (Length × Width) ÷ 10,000',
    formulaExplanation: 'First calculate square meters, then convert to hectares',
    solution: '0.15 hectares',
    steps: [
      'Calculate area in sq meters: 50 × 30 = 1500',
      'Convert to hectares: 1500 ÷ 10000 = 0.15'
    ],
    explanation: 'Hectares are commonly used for measuring large land areas. 1 hectare equals 10,000 square meters.',
    difficulty: 'medium',
    tips: ['Remember: 1 hectare = 10,000 sq meters', 'For acres: 1 hectare ≈ 2.47 acres'],
    realWorldUse: 'Agriculture, real estate, land management'
  },
  {
    id: generatePuzzleId('math', 10),
    title: 'Recipe Scaling',
    category: 'math',
    realWorldContext: 'Cooking for a larger group than the recipe serves',
    problem: 'A recipe serves 4 and calls for 2 cups of flour. You need to serve 8 people. How much flour?',
    formula: 'New Amount = Original Amount × (Desired Servings ÷ Original Servings)',
    formulaExplanation: 'Multiply original amount by the scaling factor',
    solution: '4 cups',
    steps: [
      'Calculate scaling factor: 8 ÷ 4 = 2',
      'Multiply: 2 cups × 2 = 4 cups'
    ],
    explanation: 'Doubling the servings doubles all ingredient amounts. This is proportional scaling.',
    difficulty: 'easy',
    tips: ['Scaling factor = desired servings ÷ original servings'],
    realWorldUse: 'Cooking, baking, catering, meal planning'
  },
  {
    id: generatePuzzleId('math', 11),
    title: 'Roasting Time',
    category: 'math',
    realWorldContext: 'Planning dinner and knowing when to start cooking',
    problem: 'A roast takes 20 minutes per pound to cook. You have a 5-pound chicken. Total cooking time?',
    formula: 'Total Time = Weight × Time per Pound',
    formulaExplanation: 'Multiply weight by cooking time per pound',
    solution: '100 minutes (1 hour 40 minutes)',
    steps: [
      'Multiply: 5 lbs × 20 min/lb = 100 minutes'
    ],
    explanation: 'Calculate total cooking time by multiplying weight by the time per pound specified in the recipe.',
    difficulty: 'easy',
    tips: ['Add 15-20 minutes for resting after cooking', 'Use a meat thermometer for doneness'],
    realWorldUse: 'Cooking, meal planning, food safety'
  },
  {
    id: generatePuzzleId('math', 12),
    title: 'Temperature Conversion',
    category: 'math',
    realWorldContext: 'Converting a recipe temperature for a different oven type',
    problem: 'A recipe calls for 350°F. Convert this to Celsius.',
    formula: '°C = (°F - 32) × 5/9',
    formulaExplanation: 'Subtract 32, then multiply by 5/9',
    solution: '177°C (approximately 175°C)',
    steps: [
      'Subtract 32: 350 - 32 = 318',
      'Multiply by 5/9: 318 × 5 ÷ 9 = 176.67 ≈ 177'
    ],
    explanation: 'Fahrenheit and Celsius scales have different zero points and scaling factors.',
    difficulty: 'medium',
    tips: ['Quick estimate: subtract 30 from Fahrenheit, then divide by 2', 'Most ovens round to nearest 25°F or 5°C'],
    realWorldUse: 'International recipes, oven settings, weather interpretation'
  },
  {
    id: generatePuzzleId('math', 13),
    title: 'Portion Percentage',
    category: 'math',
    realWorldContext: 'Calculating how much of a bulk package you are using',
    problem: 'A box contains 12 servings. You use 3 servings. What percentage of the box did you use?',
    formula: 'Percentage = (Portion Used ÷ Total Amount) × 100',
    formulaExplanation: 'Divide portion by total, multiply by 100',
    solution: '25%',
    steps: [
      'Divide: 3 ÷ 12 = 0.25',
      'Multiply by 100: 0.25 × 100 = 25%'
    ],
    explanation: 'To find what percentage one number is of another, divide and multiply by 100.',
    difficulty: 'easy',
    tips: ['3/12 simplifies to 1/4, which is 25%'],
    realWorldUse: 'Budget tracking, food management, inventory'
  },
  {
    id: generatePuzzleId('math', 14),
    title: 'Monthly Mortgage Estimate',
    category: 'math',
    realWorldContext: 'Planning home purchase and budgeting monthly payments',
    problem: 'House costs $300,000. You make a 20% down payment. The loan amount is $240,000 at 4% annual interest for 30 years. Estimate monthly payment (principal + interest only).',
    formula: 'Monthly Payment = P × [r(1+r)^n] / [(1+r)^n - 1]',
    formulaExplanation: 'Standard mortgage payment formula using principal, monthly rate, and number of payments',
    solution: 'Approximately $1,146',
    steps: [
      'Loan amount (principal): $300,000 - $60,000 = $240,000',
      'Monthly interest rate: 4% ÷ 12 = 0.00333',
      'Number of payments: 30 × 12 = 360',
      'Using formula: 240000 × [0.00333(1.00333)^360] / [(1.00333)^360 - 1] ≈ $1,146'
    ],
    explanation: 'Mortgage payments include principal (loan amount) and interest. This simplified calculation excludes taxes and insurance.',
    difficulty: 'hard',
    tips: ['Use online mortgage calculators for precise figures', '30-year fixed is most common mortgage type'],
    realWorldUse: 'Home buying, financial planning, budgeting'
  },
  {
    id: generatePuzzleId('math', 15),
    title: 'Budget Allocation',
    category: 'math',
    realWorldContext: 'Monthly budget planning',
    problem: 'Monthly income is $3,000. You allocate 30% to rent and 20% to food. How much money is left after these expenses?',
    formula: 'Remaining = Income - (Income × Rent%) - (Income × Food%)',
    formulaExplanation: 'Calculate each expense and subtract from income',
    solution: '$1,500',
    steps: [
      'Rent: 3000 × 0.30 = $900',
      'Food: 3000 × 0.20 = $600',
      'Total expenses: 900 + 600 = $1,500',
      'Remaining: 3000 - 1500 = $1,500'
    ],
    explanation: 'Subtract each expense category from income to find remaining budget.',
    difficulty: 'easy',
    tips: ['Alternative: calculate remaining percentage first: 100% - 30% - 20% = 50%, then 3000 × 0.50 = 1500'],
    realWorldUse: 'Personal finance, budgeting, expense tracking'
  },
  {
    id: generatePuzzleId('math', 16),
    title: 'Investment Growth',
    category: 'math',
    realWorldContext: 'Planning long-term investments',
    problem: 'You invest $5,000 at 8% annual return. How much after 5 years with compound interest?',
    formula: 'A = P × (1 + r)^t',
    formulaExplanation: 'Principal times (1 + rate) raised to time in years',
    solution: '$7,346.64',
    steps: [
      'Year 1: 5000 × 1.08 = 5400',
      'Year 2: 5400 × 1.08 = 5832',
      'Year 3: 5832 × 1.08 = 6298.56',
      'Year 4: 6298.56 × 1.08 = 6802.44',
      'Year 5: 6802.44 × 1.08 = 7346.64'
    ],
    explanation: 'Compound interest accelerates growth as each years interest earns its own interest.',
    difficulty: 'medium',
    tips: ['Rule of 72: divide 72 by interest rate to find years to double (72 ÷ 8 = 9 years)'],
    realWorldUse: 'Retirement planning, investment strategy, wealth building'
  },
  {
    id: generatePuzzleId('math', 17),
    title: 'Salary Increase',
    category: 'math',
    realWorldContext: 'Evaluating a job offer or raise',
    problem: 'Current salary is $40,000. You receive a 5% raise. What is the new salary?',
    formula: 'New Salary = Old Salary × (1 + Raise %)',
    formulaExplanation: 'Add the percentage increase to the original salary',
    solution: '$42,000',
    steps: [
      'Calculate raise amount: 40000 × 0.05 = 2000',
      'Add to original: 40000 + 2000 = 42000'
    ],
    explanation: 'A percentage raise increases your salary by that percentage of your current salary.',
    difficulty: 'easy',
    tips: ['Always calculate the dollar amount to understand the true value of a raise'],
    realWorldUse: 'Career planning, salary negotiation, personal finance'
  },
  {
    id: generatePuzzleId('math', 18),
    title: 'Circle Circumference',
    category: 'math',
    realWorldContext: 'Calculating how much border material is needed',
    problem: 'A circular garden has radius 5 meters. What is the circumference? (Use π ≈ 3.14)',
    formula: 'C = 2 × π × r',
    formulaExplanation: 'Multiply pi by 2 and by the radius',
    solution: '31.4 meters',
    steps: [
      'Multiply: 2 × 3.14 × 5 = 31.4'
    ],
    explanation: 'Circumference is the distance around a circle, calculated as 2πr.',
    difficulty: 'easy',
    tips: ['For diameter: C = π × d'],
    realWorldUse: 'Fencing, border installation, piping, wheel measurements'
  },
  {
    id: generatePuzzleId('math', 19),
    title: 'Triangle Area',
    category: 'math',
    realWorldContext: 'Calculating material needed for triangular pieces',
    problem: 'A triangular garden has base 8 meters and height 6 meters. What is the area?',
    formula: 'Area = ½ × base × height',
    formulaExplanation: 'Half the product of base and height',
    solution: '24 sq meters',
    steps: [
      'Multiply base by height: 8 × 6 = 48',
      'Divide by 2: 48 ÷ 2 = 24'
    ],
    explanation: 'The area of a triangle is half the area of a rectangle with the same base and height.',
    difficulty: 'easy',
    tips: ['Remember to use the perpendicular height, not the slanted side'],
    realWorldUse: 'Roofing, landscaping, fabric cutting, construction'
  },
  {
    id: generatePuzzleId('math', 20),
    title: 'Volume of Cylinder',
    category: 'math',
    realWorldContext: 'Calculating liquid capacity of containers',
    problem: 'A cylindrical tank has radius 3 meters and height 10 meters. What is its volume? (Use π ≈ 3.14)',
    formula: 'V = π × r² × h',
    formulaExplanation: 'Area of base circle times height',
    solution: '282.6 cubic meters',
    steps: [
      'Calculate base area: 3.14 × 3² = 3.14 × 9 = 28.26',
      'Multiply by height: 28.26 × 10 = 282.6'
    ],
    explanation: 'Volume of a cylinder is the area of the circular base times the height.',
    difficulty: 'medium',
    tips: ['Make sure radius and height use the same units'],
    realWorldUse: 'Tank sizing, liquid storage, plumbing, manufacturing'
  },
  {
    id: generatePuzzleId('math', 21),
    title: 'Cube Surface Area',
    category: 'math',
    realWorldContext: 'Painting or coating a cubic object',
    problem: 'A cube has side length 4 inches. What is the total surface area?',
    formula: 'SA = 6 × s²',
    formulaExplanation: 'Six times side squared (each face is s²)',
    solution: '96 sq inches',
    steps: [
      'Calculate one face: 4² = 16',
      'Multiply by 6 faces: 16 × 6 = 96'
    ],
    explanation: 'A cube has 6 identical square faces. Calculate one and multiply by 6.',
    difficulty: 'easy',
    tips: ['Surface area is what you paint/coat; volume is what fits inside'],
    realWorldUse: 'Packaging, painting, coating calculations'
  },
  {
    id: generatePuzzleId('math', 22),
    title: 'Sphere Surface Area',
    category: 'math',
    realWorldContext: 'Calculating material to cover a spherical object',
    problem: 'A sphere has radius 5 cm. What is the surface area? (Use π ≈ 3.14)',
    formula: 'SA = 4 × π × r²',
    formulaExplanation: 'Four times pi times radius squared',
    solution: '314 sq cm',
    steps: [
      'Square radius: 5² = 25',
      'Multiply by 4π: 4 × 3.14 × 25 = 314'
    ],
    explanation: 'A sphere has uniform curvature. The surface area formula accounts for this.',
    difficulty: 'medium',
    tips: ['Related to circle area, but with factor of 4 instead of π'],
    realWorldUse: 'Ball manufacturing, globe making, coating applications'
  },
  {
    id: generatePuzzleId('math', 23),
    title: 'Average Speed',
    category: 'math',
    realWorldContext: 'Planning travel time for a trip',
    problem: 'You drive 150 miles in 3 hours. What was your average speed?',
    formula: 'Speed = Distance ÷ Time',
    formulaExplanation: 'Divide total distance by total time',
    solution: '50 mph',
    steps: [
      'Divide: 150 ÷ 3 = 50'
    ],
    explanation: 'Average speed is total distance divided by total time, regardless of speed variations during the trip.',
    difficulty: 'easy',
    tips: ['Average speed is NOT the average of different speeds unless times are equal'],
    realWorldUse: 'Travel planning, estimating arrival times, driving efficiency'
  },
  {
    id: generatePuzzleId('math', 24),
    title: 'Unit Conversion',
    category: 'math',
    realWorldContext: 'Converting measurements between systems',
    problem: 'Convert 5 kilometers to miles. (1 km ≈ 0.621 miles)',
    formula: 'Miles = Kilometers × 0.621',
    formulaExplanation: 'Multiply by the conversion factor',
    solution: '3.105 miles',
    steps: [
      'Multiply: 5 × 0.621 = 3.105'
    ],
    explanation: 'Use conversion factors to switch between measurement systems.',
    difficulty: 'easy',
    tips: ['Remember common conversions: 1 km ≈ 0.621 mi, 1 m ≈ 3.281 ft, 1 kg ≈ 2.205 lb'],
    realWorldUse: 'International travel, scientific work, recipe conversion'
  },
  {
    id: generatePuzzleId('math', 25),
    title: 'Percentage Change',
    category: 'math',
    realWorldContext: 'Analyzing price changes or growth',
    problem: 'Price changed from $25 to $30. What is the percentage increase?',
    formula: '% Change = ((New - Old) ÷ Old) × 100',
    formulaExplanation: 'Find difference, divide by original, multiply by 100',
    solution: '20%',
    steps: [
      'Find difference: 30 - 25 = 5',
      'Divide by original: 5 ÷ 25 = 0.20',
      'Multiply by 100: 0.20 × 100 = 20%'
    ],
    explanation: 'Percentage change shows how much something increased or decreased relative to its original value.',
    difficulty: 'easy',
    tips: ['For decrease, the result will be negative', 'Always divide by the ORIGINAL value, not the new value'],
    realWorldUse: 'Finance, sales analysis, performance tracking'
  },
  {
    id: generatePuzzleId('math', 26),
    title: 'Work Rate',
    category: 'math',
    realWorldContext: 'Team productivity and project planning',
    problem: 'A worker assembles 5 products per hour. How many products in an 8-hour shift?',
    formula: 'Total = Rate × Time',
    formulaExplanation: 'Multiply rate by time for total output',
    solution: '40 products',
    steps: [
      'Multiply: 5 × 8 = 40'
    ],
    explanation: 'Work rate times time gives total work completed.',
    difficulty: 'easy',
    tips: ['Make sure units match (hours with per-hour rate)'],
    realWorldUse: 'Production planning, staffing, project estimation'
  },
  {
    id: generatePuzzleId('math', 27),
    title: 'Ratio Proportion',
    category: 'math',
    realWorldContext: 'Scaling recipes or mixtures',
    problem: 'A paint mix uses 3 parts blue to 2 parts white. You need 15 quarts total. How much blue paint?',
    formula: 'Part = Total × (Part Ratio ÷ Total Ratio)',
    formulaExplanation: 'Find the fraction each part represents of the total',
    solution: '9 quarts blue',
    steps: [
      'Total ratio parts: 3 + 2 = 5',
      'Blue fraction: 3/5',
      'Calculate: 15 × (3/5) = 9'
    ],
    explanation: 'Find what fraction of the total each component represents, then multiply by total amount needed.',
    difficulty: 'medium',
    tips: ['Total parts must include all components in the ratio'],
    realWorldUse: 'Recipes, paint mixing, concrete, cocktails'
  },
  {
    id: generatePuzzleId('math', 28),
    title: 'Discount Stacking',
    category: 'math',
    realWorldContext: 'Calculating sale prices with multiple discounts',
    problem: 'Original price $100. Take 20% off, then take additional 10% off the sale price. Final price?',
    formula: 'Final = Original × (1 - d1) × (1 - d2)',
    formulaExplanation: 'Apply each discount sequentially to the new price',
    solution: '$72',
    steps: [
      'After first discount: 100 × 0.80 = $80',
      'After second discount: 80 × 0.90 = $72'
    ],
    explanation: 'When applying multiple discounts, each discount applies to the NEW price, not the original.',
    difficulty: 'medium',
    tips: ['Never add percentages: 20% + 10% ≠ 30% off'],
    realWorldUse: 'Shopping, sales, understanding true discounts'
  },
  {
    id: generatePuzzleId('math', 29),
    title: 'Tip Calculation',
    category: 'math',
    realWorldContext: 'Calculating restaurant tip',
    problem: 'Bill is $65. You want to leave 18% tip. How much is the tip?',
    formula: 'Tip = Bill × Tip %',
    formulaExplanation: 'Multiply bill by tip percentage',
    solution: '$11.70',
    steps: [
      'Convert to decimal: 18% = 0.18',
      'Multiply: 65 × 0.18 = 11.70'
    ],
    explanation: 'Calculate tip as a percentage of the pre-tax bill amount.',
    difficulty: 'easy',
    tips: ['Quick method: 10% is $6.50, 20% is $13, so 18% is between those'],
    realWorldUse: 'Dining, services, gratitude recognition'
  },
  {
    id: generatePuzzleId('math', 30),
    title: 'Sales Tax',
    category: 'math',
    realWorldContext: 'Calculating total cost at checkout',
    problem: 'Item costs $45. Sales tax is 7.5%. What is the total cost?',
    formula: 'Total = Price + (Price × Tax Rate)',
    formulaExplanation: 'Calculate tax amount and add to price',
    solution: '$48.38',
    steps: [
      'Calculate tax: 45 × 0.075 = 3.375',
      'Round tax to cents: $3.38',
      'Add to price: 45 + 3.38 = 48.38'
    ],
    explanation: 'Sales tax is added to the purchase price. Round tax to the nearest cent.',
    difficulty: 'easy',
    tips: ['Tax rates vary by location', 'Some items are tax-exempt'],
    realWorldUse: 'Shopping, budgeting, financial planning'
  },
  {
    id: generatePuzzleId('math', 31),
    title: 'Rectangular Prism Volume',
    category: 'math',
    realWorldContext: 'Calculating storage capacity or material volume',
    problem: 'A box is 2 ft long, 1.5 ft wide, and 1 ft tall. What is the volume?',
    formula: 'V = Length × Width × Height',
    formulaExplanation: 'Multiply all three dimensions',
    solution: '3 cubic feet',
    steps: [
      'Multiply: 2 × 1.5 × 1 = 3'
    ],
    explanation: 'Volume of a rectangular box is length times width times height.',
    difficulty: 'easy',
    tips: ['All dimensions must use the same units'],
    realWorldUse: 'Shipping, packaging, moving, construction'
  },
  {
    id: generatePuzzleId('math', 32),
    title: 'Cone Volume',
    category: 'math',
    realWorldContext: 'Calculating capacity of conical containers',
    problem: 'A cone has radius 3 cm and height 12 cm. What is the volume? (Use π ≈ 3.14)',
    formula: 'V = ⅓ × π × r² × h',
    formulaExplanation: 'One-third times pi times radius squared times height',
    solution: '113.04 cubic cm',
    steps: [
      'Calculate base area: 3.14 × 3² = 3.14 × 9 = 28.26',
      'Multiply by height: 28.26 × 12 = 339.12',
      'Divide by 3: 339.12 ÷ 3 = 113.04'
    ],
    explanation: 'A cone has one-third the volume of a cylinder with the same base and height.',
    difficulty: 'hard',
    tips: ['The 1/3 factor is key - dont forget it'],
    realWorldUse: 'Container design, ice cream cones, traffic cones'
  },
  {
    id: generatePuzzleId('math', 33),
    title: 'Slope Calculation',
    category: 'math',
    realWorldContext: 'Understanding incline for construction or accessibility',
    problem: 'A ramp rises 3 feet over a horizontal distance of 12 feet. What is the slope?',
    formula: 'Slope = Rise ÷ Run',
    formulaExplanation: 'Vertical change divided by horizontal change',
    solution: '0.25 or 1:4 ratio',
    steps: [
      'Divide rise by run: 3 ÷ 12 = 0.25'
    ],
    explanation: 'Slope measures steepness. A slope of 0.25 means for every 1 foot horizontal, you rise 0.25 feet.',
    difficulty: 'easy',
    tips: ['Slope is often expressed as a ratio (rise:run) or percentage (25%)'],
    realWorldUse: 'Construction, accessibility, road design, roofing'
  },
  {
    id: generatePuzzleId('math', 34),
    title: 'Scale Factor',
    category: 'math',
    realWorldContext: 'Reading maps or scaled drawings',
    problem: 'A map scale is 1:50,000. 1 cm on map equals how many km in reality?',
    formula: 'Actual = Map Distance × Scale Denominator',
    formulaExplanation: 'Multiply map measurement by scale factor to get actual distance',
    solution: '0.5 km',
    steps: [
      '1 cm = 50,000 cm',
      'Convert to km: 50,000 cm = 500 m = 0.5 km'
    ],
    explanation: 'Scale 1:50,000 means 1 unit on map equals 50,000 units in reality.',
    difficulty: 'medium',
    tips: ['Convert units carefully: 100 cm = 1 m, 1000 m = 1 km'],
    realWorldUse: 'Maps, blueprints, architecture, engineering'
  },
  {
    id: generatePuzzleId('math', 35),
    title: 'Pyramid Volume',
    category: 'math',
    realWorldContext: 'Architectural or archaeological calculations',
    problem: 'A square pyramid has base 6 m by 6 m and height 9 m. Volume? (Use π approximation)',
    formula: 'V = ⅓ × Base Area × Height',
    formulaExplanation: 'One-third times base area times height',
    solution: '108 cubic meters',
    steps: [
      'Calculate base area: 6 × 6 = 36',
      'Multiply by height: 36 × 9 = 324',
      'Divide by 3: 324 ÷ 3 = 108'
    ],
    explanation: 'Pyramid volume is one-third the volume of a prism with the same base and height.',
    difficulty: 'hard',
    tips: ['Base area = length × width for square/rectangular base'],
    realWorldUse: 'Architecture, archaeology, construction'
  },
  {
    id: generatePuzzleId('math', 36),
    title: 'Annual Percentage Yield',
    category: 'math',
    realWorldContext: 'Comparing investment returns',
    problem: 'Investment pays 4.8% APR with monthly compounding. What is the APY?',
    formula: 'APY = (1 + r/n)^n - 1',
    formulaExplanation: 'Plus one rate over compounding periods, raise to periods, subtract one',
    solution: 'Approximately 4.91%',
    steps: [
      'Monthly rate: 4.8% ÷ 12 = 0.4% = 0.004',
      'Calculate: (1 + 0.004)^12 - 1',
      '= (1.004)^12 - 1 ≈ 0.0491 or 4.91%'
    ],
    explanation: 'APY accounts for compounding within the year, showing the true annual return.',
    difficulty: 'hard',
    tips: ['APY is always higher than APR when compounding occurs'],
    realWorldUse: 'Savings accounts, CDs, investment comparison'
  },
  {
    id: generatePuzzleId('math', 37),
    title: 'Break-Even Point',
    category: 'math',
    realWorldContext: 'Business planning and pricing strategy',
    problem: 'Fixed costs $10,000. Each product costs $50 to make and sells for $150. Break-even quantity?',
    formula: 'Break-Even = Fixed Costs ÷ (Price - Variable Cost)',
    formulaExplanation: 'Fixed costs divided by contribution margin per unit',
    solution: '100 units',
    steps: [
      'Calculate contribution margin: 150 - 50 = $100',
      'Divide fixed costs: 10000 ÷ 100 = 100'
    ],
    explanation: 'Break-even is when total revenue equals total costs. Each unit contributes margin to cover fixed costs.',
    difficulty: 'medium',
    tips: ['Contribution margin must be positive to have a break-even point'],
    realWorldUse: 'Business planning, pricing, entrepreneurship'
  },
  {
    id: generatePuzzleId('math', 38),
    title: 'Density Calculation',
    category: 'math',
    realWorldContext: 'Science experiments or material selection',
    problem: 'A block has mass 500g and volume 200 cm³. What is the density?',
    formula: 'Density = Mass ÷ Volume',
    formulaExplanation: 'Divide mass by volume',
    solution: '2.5 g/cm³',
    steps: [
      'Divide: 500 ÷ 200 = 2.5'
    ],
    explanation: 'Density measures how much mass is packed into a given volume.',
    difficulty: 'easy',
    tips: ['Units matter: g/cm³, kg/m³, etc.'],
    realWorldUse: 'Materials science, geology, shipping, cooking'
  },
  {
    id: generatePuzzleId('math', 39),
    title: 'Velocity Calculation',
    category: 'math',
    realWorldContext: 'Physics or sports analysis',
    problem: 'Object travels 100 meters in 10 seconds. What is velocity?',
    formula: 'Velocity = Displacement ÷ Time',
    formulaExplanation: 'Change in position divided by time elapsed',
    solution: '10 m/s',
    steps: [
      'Divide: 100 ÷ 10 = 10'
    ],
    explanation: 'Velocity includes direction, but speed is magnitude. Here they are equal as we measure distance.',
    difficulty: 'easy',
    tips: ['Velocity is a vector (has direction); speed is scalar'],
    realWorldUse: 'Sports, physics, navigation, transportation'
  },
  {
    id: generatePuzzleId('math', 40),
    title: 'Percent of Total',
    category: 'math',
    realWorldContext: 'Analyzing survey results or statistics',
    problem: 'In a class of 30 students, 12 play soccer. What percentage play soccer?',
    formula: 'Percentage = (Part ÷ Total) × 100',
    formulaExplanation: 'Divide part by total and multiply by 100',
    solution: '40%',
    steps: [
      'Divide: 12 ÷ 30 = 0.40',
      'Multiply by 100: 0.40 × 100 = 40%'
    ],
    explanation: 'To find what percentage a number is of a total, divide and multiply by 100.',
    difficulty: 'easy',
    tips: ['Simplify fractions first: 12/30 = 2/5 = 40%'],
    realWorldUse: 'Surveys, statistics, polling, data analysis'
  },
  {
    id: generatePuzzleId('math', 41),
    title: 'Weighted Average',
    category: 'math',
    realWorldContext: 'Calculating GPA or performance metrics',
    problem: 'Course grades: A (4.0) with 3 credits, B (3.0) with 4 credits. GPA?',
    formula: 'GPA = Σ(Grade × Credits) ÷ Σ(Credits)',
    formulaExplanation: 'Sum of grade points times credits, divided by total credits',
    solution: '3.43',
    steps: [
      'Calculate weighted points: 4.0 × 3 = 12, 3.0 × 4 = 12',
      'Sum: 12 + 12 = 24',
      'Divide by total credits: 24 ÷ 7 = 3.43'
    ],
    explanation: 'Weighted average gives more importance to courses with more credits.',
    difficulty: 'medium',
    tips: ['Never just average the grades - must weight by credits'],
    realWorldUse: 'Academic performance, employee evaluations, ratings'
  },
  {
    id: generatePuzzleId('math', 42),
    title: 'Exponential Growth',
    category: 'math',
    realWorldContext: 'Population growth or disease spread',
    problem: 'Bacteria double every hour. Starting with 10 bacteria, how many after 5 hours?',
    formula: 'Final = Initial × 2^t',
    formulaExplanation: 'Multiply initial by 2 raised to number of doubling periods',
    solution: '320 bacteria',
    steps: [
      'Hour 1: 10 × 2 = 20',
      'Hour 2: 20 × 2 = 40',
      'Hour 3: 40 × 2 = 80',
      'Hour 4: 80 × 2 = 160',
      'Hour 5: 160 × 2 = 320'
    ],
    explanation: 'Exponential growth multiplies by the growth factor each period.',
    difficulty: 'medium',
    tips: ['After t periods, multiplied by growth factor^t'],
    realWorldUse: 'Epidemiology, finance, population studies'
  },
  {
    id: generatePuzzleId('math', 43),
    title: 'Half-Life',
    category: 'math',
    realWorldContext: 'Radioactive decay or medication metabolism',
    problem: 'Substance has half-life of 3 hours. Starting with 80mg, how much after 9 hours?',
    formula: 'Remaining = Initial × (1/2)^(t/half-life)',
    formulaExplanation: 'Divide time by half-life to find number of half-lives',
    solution: '10mg',
    steps: [
      'Number of half-lives: 9 ÷ 3 = 3',
      'After 1: 80 ÷ 2 = 40',
      'After 2: 40 ÷ 2 = 20',
      'After 3: 20 ÷ 2 = 10'
    ],
    explanation: 'Half-life is the time for half the substance to decay. After each half-life, half remains.',
    difficulty: 'medium',
    tips: ['After n half-lives, fraction remaining = (1/2)^n'],
    realWorldUse: 'Radiology, pharmacology, archaeology'
  },
  {
    id: generatePuzzleId('math', 44),
    title: 'Greatest Common Divisor',
    category: 'math',
    realWorldContext: 'Simplifying fractions or finding common factors',
    problem: 'Find GCD of 24 and 36.',
    formula: 'GCD(a, b) = largest number that divides both',
    formulaExplanation: 'Find all factors of each number, identify largest common',
    solution: '12',
    steps: [
      'Factors of 24: 1, 2, 3, 4, 6, 8, 12, 24',
      'Factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36',
      'Largest common: 12'
    ],
    explanation: 'GCD is the largest number that divides both numbers without remainder.',
    difficulty: 'medium',
    tips: ['Use Euclidean algorithm for large numbers'],
    realWorldUse: 'Simplifying fractions, cryptography, scheduling'
  },
  {
    id: generatePuzzleId('math', 45),
    title: 'Least Common Multiple',
    category: 'math',
    realWorldContext: 'Finding common denominators or scheduling overlap',
    problem: 'Find LCM of 8 and 12.',
    formula: 'LCM(a, b) = |a × b| ÷ GCD(a, b)',
    formulaExplanation: 'Product divided by GCD',
    solution: '24',
    steps: [
      'GCD of 8 and 12 = 4',
      'LCM = (8 × 12) ÷ 4 = 96 ÷ 4 = 24'
    ],
    explanation: 'LCM is the smallest number that is a multiple of both numbers.',
    difficulty: 'medium',
    tips: ['List multiples until you find common one for simple cases'],
    realWorldUse: 'Adding fractions, scheduling, finding common periods'
  },
  {
    id: generatePuzzleId('math', 46),
    title: 'Standard Deviation',
    category: 'math',
    realWorldContext: 'Statistical analysis or quality control',
    problem: 'Data set: 2, 4, 4, 4, 5, 5, 7, 9. Find standard deviation.',
    formula: 'σ = √[Σ(x - μ)² ÷ n]',
    formulaExplanation: 'Square root of average of squared differences from mean',
    solution: 'Approximately 2',
    steps: [
      'Mean: (2+4+4+4+5+5+7+9) ÷ 8 = 40 ÷ 8 = 5',
      'Squared differences: (2-5)²=9, (4-5)²=1×3=3, (5-5)²=0×2=0, (7-5)²=4, (9-5)²=16',
      'Sum: 9 + 3 + 0 + 4 + 16 = 32',
      'Variance: 32 ÷ 8 = 4',
      'Standard deviation: √4 = 2'
    ],
    explanation: 'Standard deviation measures how spread out data is from the average.',
    difficulty: 'hard',
    tips: ['For sample, divide by (n-1) instead of n'],
    realWorldUse: 'Quality control, research, finance, education'
  },
  {
    id: generatePuzzleId('math', 47),
    title: 'Permutations',
    category: 'math',
    realWorldContext: 'Arranging items or seating arrangements',
    problem: 'How many ways can 3 people be arranged in a row?',
    formula: 'P(n, r) = n! ÷ (n - r)!',
    formulaExplanation: 'Number of items factorial divided by factorial of items not chosen',
    solution: '6 ways',
    steps: [
      'P(3, 3) = 3! ÷ 0! = 6 ÷ 1 = 6',
      'List: ABC, ACB, BAC, BCA, CAB, CBA'
    ],
    explanation: 'Permutations count arrangements where order matters.',
    difficulty: 'medium',
    tips: ['For all items: n! (n factorial)'],
    realWorldUse: 'Lock combinations, seating, password combinations'
  },
  {
    id: generatePuzzleId('math', 48),
    title: 'Combinations',
    category: 'math',
    realWorldContext: 'Selecting teams or groups',
    problem: 'How many ways to choose 2 people from a group of 4?',
    formula: 'C(n, r) = n! ÷ [r! × (n - r)!]',
    formulaExplanation: 'Factorial of n divided by r! times (n-r)!',
    solution: '6 ways',
    steps: [
      'C(4, 2) = 4! ÷ (2! × 2!) = 24 ÷ (2 × 2) = 24 ÷ 4 = 6'
    ],
    explanation: 'Combinations count selections where order does NOT matter.',
    difficulty: 'medium',
    tips: ['Remember: permutations = order matters, combinations = order doesnt matter'],
    realWorldUse: 'Team selection, lottery, card hands'
  },
  {
    id: generatePuzzleId('math', 49),
    title: 'Probability',
    category: 'math',
    realWorldContext: 'Games, risk assessment, decision making',
    problem: 'Drawing one card from a standard deck. Probability of drawing an Ace?',
    formula: 'P(event) = Favorable Outcomes ÷ Total Possible Outcomes',
    formulaExplanation: 'Count desired outcomes divided by all possible outcomes',
    solution: '1/13 or approximately 7.69%',
    steps: [
      'Total cards: 52',
      'Aces in deck: 4',
      'Probability: 4 ÷ 52 = 1/13 ≈ 0.0769'
    ],
    explanation: 'Probability is the ratio of favorable outcomes to total possible outcomes.',
    difficulty: 'easy',
    tips: ['Always count total possible outcomes first'],
    realWorldUse: 'Gambling, risk assessment, weather forecasting'
  },
  {
    id: generatePuzzleId('math', 50),
    title: 'Expected Value',
    category: 'math',
    realWorldContext: 'Evaluating bets or decisions with uncertain outcomes',
    problem: 'Game: Pay $5 to play. 50% chance to win $10, 50% chance to win nothing. Expected value?',
    formula: 'EV = Σ(Outcome × Probability)',
    formulaExplanation: 'Sum of each outcome multiplied by its probability',
    solution: '$0',
    steps: [
      'Win $10 with 50%: 10 × 0.50 = $5',
      'Win $0 with 50%: 0 × 0.50 = $0',
      'Expected value: $5 - $5 (cost to play) = $0'
    ],
    explanation: 'Expected value is the long-run average of repeating the situation many times.',
    difficulty: 'medium',
    tips: ['Remember to subtract the cost to play'],
    realWorldUse: 'Gambling, insurance, financial decisions'
  },
  {
    id: generatePuzzleId('math', 51),
    title: 'Area of Trapezoid',
    category: 'math',
    realWorldContext: 'Calculating land area or material needed',
    problem: 'Trapezoid has parallel sides 8m and 5m, height 4m. Area?',
    formula: 'Area = ½ × (a + b) × h',
    formulaExplanation: 'Half the sum of parallel sides times height',
    solution: '26 sq meters',
    steps: [
      'Sum parallel sides: 8 + 5 = 13',
      'Multiply by height: 13 × 4 = 52',
      'Divide by 2: 52 ÷ 2 = 26'
    ],
    explanation: 'A trapezoid has one pair of parallel sides. The average of those sides times height gives area.',
    difficulty: 'medium',
    tips: ['Make sure to use the perpendicular height'],
    realWorldUse: 'Land surveying, construction, geometry'
  },
  {
    id: generatePuzzleId('math', 52),
    title: 'Cube Root',
    category: 'math',
    realWorldContext: 'Solving equations or finding dimensions',
    problem: 'What number cubed equals 64? (Find ∛64)',
    formula: '∛x = y where y³ = x',
    formulaExplanation: 'Find the number that when cubed equals x',
    solution: '4',
    steps: [
      '4 × 4 = 16, 16 × 4 = 64'
    ],
    explanation: 'Cube root is the inverse operation of cubing a number.',
    difficulty: 'easy',
    tips: ['Know perfect cubes: 2³=8, 3³=27, 4³=64, 5³=125'],
    realWorldUse: 'Volume problems, engineering, algebra'
  },

  // ============================================
  // PHYSICS (25+ puzzles)
  // ============================================

  {
    id: generatePuzzleId('physics', 1),
    title: 'Speed Calculation',
    category: 'physics',
    realWorldContext: 'Travel planning or understanding motion',
    problem: 'A car travels 120 miles in 2.5 hours. What is the average speed?',
    formula: 'Speed = Distance ÷ Time',
    formulaExplanation: 'Divide total distance by total time',
    solution: '48 mph',
    steps: [
      'Divide: 120 ÷ 2.5 = 48'
    ],
    explanation: 'Average speed is total distance traveled divided by total time taken.',
    difficulty: 'easy',
    tips: ['Check units: miles per hour means distance in miles, time in hours'],
    realWorldUse: 'Driving, travel planning, sports analysis'
  },
  {
    id: generatePuzzleId('physics', 2),
    title: 'Free Fall Time',
    category: 'physics',
    realWorldContext: 'Engineering safety or physics experiments',
    problem: 'An object is dropped from 100m height. How long until it hits ground? (Use g = 9.8 m/s²)',
    formula: 't = √(2h ÷ g)',
    formulaExplanation: 'Time equals square root of twice height divided by gravity',
    solution: 'Approximately 4.52 seconds',
    steps: [
      'Calculate: 2 × 100 ÷ 9.8 = 200 ÷ 9.8 = 20.41',
      'Square root: √20.41 ≈ 4.52'
    ],
    explanation: 'Objects fall with increasing speed due to gravity, following this formula for time to fall.',
    difficulty: 'medium',
    tips: ['Assumes no air resistance', 'Velocity at impact: v = gt ≈ 44.3 m/s'],
    realWorldUse: 'Construction safety, sports, physics education'
  },
  {
    id: generatePuzzleId('physics', 3),
    title: 'Ohms Law',
    category: 'physics',
    realWorldContext: 'Electrical work or electronics',
    problem: 'A circuit has 120V and 60Ω resistance. What is the current?',
    formula: 'I = V ÷ R',
    formulaExplanation: 'Current equals voltage divided by resistance',
    solution: '2 Amperes',
    steps: [
      'Divide: 120 ÷ 60 = 2'
    ],
    explanation: 'Ohms Law relates voltage, current, and resistance in an electrical circuit.',
    difficulty: 'easy',
    tips: ['Remember the triangle: V = IR, I = V/R, R = V/I'],
    realWorldUse: 'Electronics, electrical work, circuit design'
  },
  {
    id: generatePuzzleId('physics', 4),
    title: 'Work Done',
    category: 'physics',
    realWorldContext: 'Physical labor or mechanical work',
    problem: 'How much work is done lifting a 20kg box 5 meters? (g = 9.8 m/s²)',
    formula: 'W = m × g × h',
    formulaExplanation: 'Work equals mass times gravity times height',
    solution: '980 Joules',
    steps: [
      'Calculate force: 20 × 9.8 = 196 N',
      'Multiply by height: 196 × 5 = 980'
    ],
    explanation: 'Work is force applied over a distance. Against gravity, force equals weight (mg).',
    difficulty: 'medium',
    tips: ['Weight = mass × gravity (not 10 unless approximating)', 'Work measured in Joules (J)'],
    realWorldUse: 'Construction, physics, exercise science'
  },
  {
    id: generatePuzzleId('physics', 5),
    title: 'Kinetic Energy',
    category: 'physics',
    realWorldContext: 'Understanding motion energy or collision analysis',
    problem: 'A 2kg ball moves at 3 m/s. What is its kinetic energy?',
    formula: 'KE = ½ × m × v²',
    formulaExplanation: 'Half mass times velocity squared',
    solution: '9 Joules',
    steps: [
      'Square velocity: 3² = 9',
      'Multiply by mass: 2 × 9 = 18',
      'Divide by 2: 18 ÷ 2 = 9'
    ],
    explanation: 'Kinetic energy depends on mass and the square of velocity - doubling speed quadruples energy.',
    difficulty: 'medium',
    tips: ['Velocity is squared, so small speed increases mean big energy changes'],
    realWorldUse: 'Car safety, sports, physics collisions'
  },
  {
    id: generatePuzzleId('physics', 6),
    title: 'Potential Energy',
    category: 'physics',
    realWorldContext: 'Understanding stored energy or dam power',
    problem: 'A 50kg person stands on a 10m diving board. What is gravitational potential energy? (g = 9.8)',
    formula: 'PE = m × g × h',
    formulaExplanation: 'Mass times gravity times height',
    solution: '4,900 Joules',
    steps: [
      'Multiply: 50 × 9.8 × 10 = 4,900'
    ],
    explanation: 'Potential energy is stored energy due to position - higher and heavier means more energy.',
    difficulty: 'easy',
    tips: ['At ground level, PE = 0 (choose reference point)'],
    realWorldUse: 'Dams, roller coasters, construction'
  },
  {
    id: generatePuzzleId('physics', 7),
    title: 'Momentum',
    category: 'physics',
    realWorldContext: 'Understanding collisions or vehicle safety',
    problem: 'A 1000kg car moves at 20 m/s. What is its momentum?',
    formula: 'p = m × v',
    formulaExplanation: 'Momentum equals mass times velocity',
    solution: '20,000 kg·m/s',
    steps: [
      'Multiply: 1000 × 20 = 20,000'
    ],
    explanation: 'Momentum measures how hard it is to stop a moving object.',
    difficulty: 'easy',
    tips: ['Momentum is a vector - direction matters'],
    realWorldUse: 'Car safety, sports, physics collisions'
  },
  {
    id: generatePuzzleId('physics', 8),
    title: 'Power',
    category: 'physics',
    realWorldContext: 'Understanding electrical usage or work rate',
    problem: 'A motor does 1000 Joules of work in 10 seconds. What is power?',
    formula: 'P = W ÷ t',
    formulaExplanation: 'Work divided by time gives power',
    solution: '100 Watts',
    steps: [
      'Divide: 1000 ÷ 10 = 100'
    ],
    explanation: 'Power measures how quickly work is done or energy is transferred.',
    difficulty: 'easy',
    tips: ['Power measured in Watts (W), where 1 W = 1 J/s'],
    realWorldUse: 'Electrical billing, motor selection, fitness'
  },
  {
    id: generatePuzzleId('physics', 9),
    title: 'Acceleration',
    category: 'physics',
    realWorldContext: 'Vehicle performance or physics problems',
    problem: 'Car goes from 0 to 60 mph (0 to 26.8 m/s) in 5 seconds. Average acceleration?',
    formula: 'a = Δv ÷ t',
    formulaExplanation: 'Change in velocity divided by time',
    solution: '5.36 m/s²',
    steps: [
      'Change in velocity: 26.8 - 0 = 26.8 m/s',
      'Divide by time: 26.8 ÷ 5 = 5.36'
    ],
    explanation: 'Acceleration measures how quickly velocity changes.',
    difficulty: 'easy',
    tips: ['Units: m/s² (velocity change in m/s per second)'],
    realWorldUse: 'Vehicle performance, sports, engineering'
  },
  {
    id: generatePuzzleId('physics', 10),
    title: 'Force',
    category: 'physics',
    realWorldContext: 'Understanding pushing/pulling or structural loads',
    problem: 'A 5kg object accelerates at 2 m/s². What force is applied?',
    formula: 'F = m × a',
    formulaExplanation: 'Newton Second Law: force equals mass times acceleration',
    solution: '10 Newtons',
    steps: [
      'Multiply: 5 × 2 = 10'
    ],
    explanation: 'Force causes acceleration - more mass needs more force for same acceleration.',
    difficulty: 'easy',
    tips: ['Force measured in Newtons (N), where 1 N = 1 kg·m/s²'],
    realWorldUse: 'Construction, vehicle engineering, sports'
  },
  {
    id: generatePuzzleId('physics', 11),
    title: 'Frequency and Period',
    category: 'physics',
    realWorldContext: 'Understanding waves, sound, or oscillations',
    problem: 'A pendulum completes 10 cycles in 5 seconds. What is the frequency?',
    formula: 'f = cycles ÷ time',
    formulaExplanation: 'Number of cycles divided by time',
    solution: '2 Hz',
    steps: [
      'Divide: 10 ÷ 5 = 2'
    ],
    explanation: 'Frequency measures how many cycles occur per second. Period is the inverse.',
    difficulty: 'easy',
    tips: ['Frequency in Hertz (Hz), period in seconds: T = 1/f'],
    realWorldUse: 'Music, radio, physics, engineering'
  },
  {
    id: generatePuzzleId('physics', 12),
    title: 'Wave Speed',
    category: 'physics',
    realWorldContext: 'Understanding light, sound, or water waves',
    problem: 'Sound wave has frequency 440 Hz and wavelength 0.77 m. Speed?',
    formula: 'v = f × λ',
    formulaExplanation: 'Speed equals frequency times wavelength',
    solution: '338.8 m/s',
    steps: [
      'Multiply: 440 × 0.77 = 338.8'
    ],
    explanation: 'Wave speed depends on the medium. Sound in air is about 343 m/s at 20°C.',
    difficulty: 'easy',
    tips: ['λ (lambda) is wavelength symbol', 'Light speed is 3×10⁸ m/s - much faster'],
    realWorldUse: 'Music, acoustics, communications'
  },
  {
    id: generatePuzzleId('physics', 13),
    title: 'Pressure',
    category: 'physics',
    realWorldContext: 'Understanding fluids or structural loads',
    problem: 'A 50N force is applied to 2 m² area. What is the pressure?',
    formula: 'P = F ÷ A',
    formulaExplanation: 'Force divided by area',
    solution: '25 Pascals',
    steps: [
      'Divide: 50 ÷ 2 = 25'
    ],
    explanation: 'Pressure is force distributed over an area. Same force on smaller area = more pressure.',
    difficulty: 'easy',
    tips: ['Pressure in Pascals (Pa) = N/m²', '1 atm ≈ 101,325 Pa'],
    realWorldUse: 'Hydraulics, weather, material science'
  },
  {
    id: generatePuzzleId('physics', 14),
    title: 'Hydraulic Lift',
    category: 'physics',
    realWorldContext: 'Understanding hydraulics or vehicle brakes',
    problem: 'Small piston 0.01 m² with 100N force. Large piston 0.5 m². Force output?',
    formula: 'F₂ = F₁ × (A₂ ÷ A₁)',
    formulaExplanation: 'Force multiplies by ratio of areas',
    solution: '5,000 N',
    steps: [
      'Area ratio: 0.5 ÷ 0.01 = 50',
      'Multiply: 100 × 50 = 5,000'
    ],
    explanation: 'Hydraulic systems multiply force by ratio of piston areas (Pascal principle).',
    difficulty: 'medium',
    tips: ['Volume is conserved, so small movement on input = large movement on output'],
    realWorldUse: 'Car brakes, hydraulic jacks, heavy equipment'
  },
  {
    id: generatePuzzleId('physics', 15),
    title: 'Temperature Change',
    category: 'physics',
    realWorldContext: 'Cooking, climate, or physics experiments',
    problem: '500g water at 20°C absorbs 10,500J heat. New temperature? (c = 4200 J/kg·°C)',
    formula: 'Q = m × c × ΔT',
    formulaExplanation: 'Heat equals mass times specific heat times temperature change',
    solution: '25°C',
    steps: [
      'Rearrange: ΔT = Q ÷ (m × c)',
      'm × c = 0.5 × 4200 = 2100',
      'ΔT = 10500 ÷ 2100 = 5',
      'New temp: 20 + 5 = 25°C'
    ],
    explanation: 'Specific heat capacity (c) is how much heat raises temperature of 1kg by 1°C.',
    difficulty: 'hard',
    tips: ['Convert grams to kg for consistent units'],
    realWorldUse: 'Cooking, climate control, chemistry'
  },
  {
    id: generatePuzzleId('physics', 16),
    title: 'Elastic Potential Energy',
    category: 'physics',
    realWorldContext: 'Springs, bows, or trampolines',
    problem: 'Spring constant 200 N/m compressed 0.1 m. Energy stored?',
    formula: 'PE = ½ × k × x²',
    formulaExplanation: 'Half spring constant times displacement squared',
    solution: '1 Joule',
    steps: [
      'Square displacement: 0.1² = 0.01',
      'Multiply by k: 200 × 0.01 = 2',
      'Divide by 2: 2 ÷ 2 = 1'
    ],
    explanation: 'Spring energy depends on how far compressed/stretched and spring stiffness.',
    difficulty: 'medium',
    tips: ['x must be displacement from equilibrium'],
    realWorldUse: 'Bouncing, archery, vehicle suspensions'
  },
  {
    id: generatePuzzleId('physics', 17),
    title: 'Centripetal Force',
    category: 'physics',
    realWorldContext: 'Curved motion or amusement parks',
    problem: '1kg object moving in circle radius 0.5m at 4 m/s. Centripetal force?',
    formula: 'F = m × v² ÷ r',
    formulaExplanation: 'Mass times velocity squared divided by radius',
    solution: '32 N',
    steps: [
      'Square velocity: 4² = 16',
      'Multiply by mass: 1 × 16 = 16',
      'Divide by radius: 16 ÷ 0.5 = 32'
    ],
    explanation: 'Centripetal force keeps objects moving in circular paths (provided by tension, friction, etc.).',
    difficulty: 'medium',
    tips: ['Force points toward center of circle'],
    realWorldUse: 'Amusement rides, planetary orbits, driving turns'
  },
  {
    id: generatePuzzleId('physics', 18),
    title: 'Density from Mass and Volume',
    category: 'physics',
    realWorldContext: 'Material identification or buoyancy',
    problem: 'Object has mass 250g and volume 100 cm³. What is density?',
    formula: 'ρ = m ÷ V',
    formulaExplanation: 'Mass divided by volume',
    solution: '2.5 g/cm³',
    steps: [
      'Divide: 250 ÷ 100 = 2.5'
    ],
    explanation: 'Density tells how much mass is packed into each unit of volume.',
    difficulty: 'easy',
    tips: ['Water density = 1 g/cm³', 'Objects with density < 1 float in water'],
    realWorldUse: 'Material science, geology, shipping'
  },
  {
    id: generatePuzzleId('physics', 19),
    title: 'Buoyant Force',
    category: 'physics',
    realWorldContext: 'Understanding flotation or ship design',
    problem: 'Object displaces 0.001 m³ of water (density 1000 kg/m³). Buoyant force?',
    formula: 'F = ρ × V × g',
    formulaExplanation: 'Density times volume times gravity',
    solution: '9.8 N',
    steps: [
      'Calculate mass of displaced water: 1000 × 0.001 = 1 kg',
      'Calculate weight: 1 × 9.8 = 9.8 N'
    ],
    explanation: 'Buoyant force equals weight of displaced fluid (Archimedes principle).',
    difficulty: 'medium',
    tips: ['If buoyant force > weight, object floats'],
    realWorldUse: 'Ship design, diving, hot air balloons'
  },
  {
    id: generatePuzzleId('physics', 20),
    title: 'Torque',
    category: 'physics',
    realWorldContext: 'Wrenches, seesaws, or rotating machinery',
    problem: '20N force applied 0.3m from pivot. Torque?',
    formula: 'τ = F × r',
    formulaExplanation: 'Force times distance from pivot',
    solution: '6 N·m',
    steps: [
      'Multiply: 20 × 0.3 = 6'
    ],
    explanation: 'Torque is the rotational equivalent of force - it causes rotation.',
    difficulty: 'easy',
    tips: ['Use perpendicular distance from pivot to line of force'],
    realWorldUse: 'Wrench design, door handles, engines'
  },
  {
    id: generatePuzzleId('physics', 21),
    title: 'Impulse',
    category: 'physics',
    realWorldContext: 'Collisions, impact, or safety equipment',
    problem: 'Force of 500N applied for 0.02 seconds. Impulse?',
    formula: 'J = F × t',
    formulaExplanation: 'Force times time equals change in momentum',
    solution: '10 N·s',
    steps: [
      'Multiply: 500 × 0.02 = 10'
    ],
    explanation: 'Impulse measures the change in momentum during a collision.',
    difficulty: 'easy',
    tips: ['Longer time (cushioning) reduces average force for same impulse'],
    realWorldUse: 'Car safety, sports equipment, packaging'
  },
  {
    id: generatePuzzleId('physics', 22),
    title: 'Thermal Expansion',
    category: 'physics',
    realWorldContext: 'Construction joints or engineering tolerances',
    problem: 'Steel rod 10m long heated 50°C. How much expansion? (α = 12 × 10⁻⁶ /°C)',
    formula: 'ΔL = α × L₀ × ΔT',
    formulaExplanation: 'Expansion coefficient times original length times temperature change',
    solution: '0.006 meters = 6mm',
    steps: [
      'Multiply: 12 × 10⁻⁶ × 10 × 50',
      '= 12 × 10⁻⁶ × 500 = 6000 × 10⁻⁶ = 0.006 m'
    ],
    explanation: 'Materials expand when heated. Different materials have different expansion coefficients.',
    difficulty: 'hard',
    tips: ['Expansion joints in bridges and railways account for this'],
    realWorldUse: 'Construction, manufacturing, materials science'
  },
  {
    id: generatePuzzleId('physics', 23),
    title: 'Gravitational Force',
    category: 'physics',
    realWorldContext: 'Understanding weight or planetary forces',
    problem: 'Two 1kg masses are 1m apart. What is gravitational force? (G = 6.67 × 10⁻¹¹)',
    formula: 'F = G × m₁ × m₂ ÷ r²',
    formulaExplanation: 'Gravitational constant times masses divided by distance squared',
    solution: '6.67 × 10⁻¹¹ N',
    steps: [
      'Calculate: 6.67 × 10⁻¹¹ × 1 × 1 ÷ 1² = 6.67 × 10⁻¹¹'
    ],
    explanation: 'Gravitational force is very weak compared to other forces - only noticeable with large masses.',
    difficulty: 'hard',
    tips: ['G is extremely small, which is why gravity seems weak in everyday situations'],
    realWorldUse: 'Astronomy, orbital mechanics, geology'
  },
  {
    id: generatePuzzleId('physics', 24),
    title: 'Index of Refraction',
    category: 'physics',
    realWorldContext: 'Understanding lenses or optical effects',
    problem: 'Light speed in glass is 2 × 10⁸ m/s. What is index of refraction? (c = 3 × 10⁸ m/s)',
    formula: 'n = c ÷ v',
    formulaExplanation: 'Speed in vacuum divided by speed in medium',
    solution: '1.5',
    steps: [
      'Divide: 3 × 10⁸ ÷ 2 × 10⁸ = 1.5'
    ],
    explanation: 'Index of refraction measures how much light slows in a material compared to vacuum.',
    difficulty: 'medium',
    tips: ['Higher n means more bending (slowing) of light'],
    realWorldUse: 'Lenses, fiber optics, gemology'
  },
  {
    id: generatePuzzleId('physics', 25),
    title: 'Doppler Effect',
    category: 'physics',
    realWorldContext: 'Understanding sirens or radar',
    problem: 'Source at 500 Hz moving toward observer at 20 m/s. Observed frequency? (speed of sound = 343 m/s)',
    formula: 'f = f₀ × (v ÷ (v - vₛ))',
    formulaExplanation: 'Frequency shifts higher when source approaches',
    solution: 'Approximately 530 Hz',
    steps: [
      'Calculate: 500 × (343 ÷ (343 - 20)) = 500 × (343 ÷ 323) ≈ 500 × 1.062 ≈ 531'
    ],
    explanation: 'Doppler effect changes observed frequency based on relative motion.',
    difficulty: 'hard',
    tips: ['Source moving toward = higher pitch', 'Source moving away = lower pitch'],
    realWorldUse: 'Radar, astronomy, emergency vehicles'
  },

  // ============================================
  // CHEMISTRY (15+ puzzles)
  // ============================================

  {
    id: generatePuzzleId('chemistry', 1),
    title: 'Concentration',
    category: 'chemistry',
    realWorldContext: 'Chemistry labs or solution preparation',
    problem: '100g salt dissolved in 1 liter of water. What is the concentration in g/L?',
    formula: 'Concentration = Mass ÷ Volume',
    formulaExplanation: 'Mass of solute divided by volume of solution',
    solution: '100 g/L',
    steps: [
      'Assume 1L water ≈ 1000g (for dilute solutions)',
      '100g ÷ 1L = 100 g/L'
    ],
    explanation: 'Concentration measures how much solute is dissolved in a given volume of solution.',
    difficulty: 'easy',
    tips: ['Assume solution volume ≈ solvent volume for dilute solutions'],
    realWorldUse: 'Cooking, medicine, water treatment'
  },
  {
    id: generatePuzzleId('chemistry', 2),
    title: 'Dilution',
    category: 'chemistry',
    realWorldContext: 'Making solutions less concentrated',
    problem: '100ml of 10% solution diluted by adding 100ml water. What is new concentration?',
    formula: 'C₁V₁ = C₂V₂',
    formulaExplanation: 'Initial concentration times volume equals final concentration times final volume',
    solution: '5%',
    steps: [
      'Initial amount: 0.10 × 100ml = 10ml solute',
      'Final volume: 100 + 100 = 200ml',
      'Final concentration: 10 ÷ 200 = 0.05 = 5%'
    ],
    explanation: 'Dilution doubles volume but halves concentration in this case.',
    difficulty: 'medium',
    tips: ['Always calculate total solute amount first'],
    realWorldUse: 'Laboratory work, cooking, medicine'
  },
  {
    id: generatePuzzleId('chemistry', 3),
    title: 'Molarity',
    category: 'chemistry',
    realWorldContext: 'Laboratory chemistry or industrial processes',
    problem: '5.85g NaCl dissolved to make 1L solution. Molar mass NaCl = 58.5 g/mol. Molarity?',
    formula: 'M = moles ÷ liters',
    formulaExplanation: 'Moles of solute divided by liters of solution',
    solution: '0.1 M',
    steps: [
      'Calculate moles: 5.85 ÷ 58.5 = 0.1 mol',
      'Molarity: 0.1 mol ÷ 1 L = 0.1 M'
    ],
    explanation: 'Molarity is moles of solute per liter of solution - a standard chemistry concentration unit.',
    difficulty: 'medium',
    tips: ['Need molar mass to convert grams to moles'],
    realWorldUse: 'Laboratory preparation, industrial chemistry'
  },
  {
    id: generatePuzzleId('chemistry', 4),
    title: 'pH Calculation',
    category: 'chemistry',
    realWorldContext: 'Water testing or biological systems',
    problem: 'Hydrogen ion concentration is 10⁻⁷ M. What is the pH?',
    formula: 'pH = -log[H⁺]',
    formulaExplanation: 'Negative log of hydrogen ion concentration',
    solution: '7',
    steps: [
      'pH = -log(10⁻⁷) = -(-7) = 7'
    ],
    explanation: 'pH measures acidity. 7 is neutral, below 7 is acidic, above 7 is basic.',
    difficulty: 'medium',
    tips: ['pH 7 = neutral (like pure water)', 'Each pH unit is 10x change in [H⁺]'],
    realWorldUse: 'Swimming pools, biology, water treatment'
  },
  {
    id: generatePuzzleId('chemistry', 5),
    title: 'Mole Calculation',
    category: 'chemistry',
    realWorldContext: 'Chemistry calculations or recipe scaling',
    problem: 'How many moles in 36g of water? (H₂O molar mass = 18 g/mol)',
    formula: 'moles = mass ÷ molar mass',
    formulaExplanation: 'Divide mass by molecular weight',
    solution: '2 moles',
    steps: [
      'Divide: 36 ÷ 18 = 2'
    ],
    explanation: 'Mole is the chemistry unit for amount of substance - 6.022 × 10²³ particles.',
    difficulty: 'easy',
    tips: ['Always need molar mass for mole calculations'],
    realWorldUse: 'Laboratory work, industrial chemistry'
  },
  {
    id: generatePuzzleId('chemistry', 6),
    title: 'Balancing Equation',
    category: 'chemistry',
    realWorldContext: 'Understanding chemical reactions or lab work',
    problem: 'Balance: H₂ + O₂ → H₂O',
    formula: 'Atoms must be equal on both sides',
    formulaExplanation: 'Count atoms of each element on both sides and adjust coefficients',
    solution: '2H₂ + O₂ → 2H₂O',
    steps: [
      'Left: 2H, 2O. Right: 2H, 1O. Not balanced.',
      'Add coefficient 2 to H₂O: Left 2H, 2O. Right 4H, 2O.',
      'Add coefficient 2 to H₂: Left 4H, 2O. Right 4H, 2O. Balanced!'
    ],
    explanation: 'Chemical equations must have equal atoms of each element on both sides.',
    difficulty: 'medium',
    tips: ['Start with most complex molecule', 'Only change coefficients, not subscripts'],
    realWorldUse: 'Laboratory work, industrial chemistry, environmental science'
  },
  {
    id: generatePuzzleId('chemistry', 7),
    title: 'Limiting Reagent',
    category: 'chemistry',
    realWorldContext: 'Industrial chemistry or cooking chemistry',
    problem: '2H₂ + O₂ → 2H₂O. If you have 4 mol H₂ and 3 mol O₂, what is limiting reagent?',
    formula: 'Compare stoichiometric ratios',
    formulaExplanation: 'Calculate how much product each reactant could make',
    solution: 'O₂ is limiting',
    steps: [
      'From H₂: 4 mol H₂ × (2 mol H₂O ÷ 2 mol H₂) = 4 mol H₂O',
      'From O₂: 3 mol O₂ × (2 mol H₂O ÷ 1 mol O₂) = 6 mol H₂O',
      'H₂ limits to 4 mol H₂O'
    ],
    explanation: 'Limiting reagent determines maximum product - it runs out first.',
    difficulty: 'hard',
    tips: ['The reactant that produces less product is limiting'],
    realWorldUse: 'Industrial synthesis, cooking, pollution control'
  },
  {
    id: generatePuzzleId('chemistry', 8),
    title: 'Percent Yield',
    category: 'chemistry',
    realWorldContext: 'Industrial processes or lab work',
    problem: 'Theoretical yield 50g, actual yield 42g. What is percent yield?',
    formula: '% Yield = (Actual ÷ Theoretical) × 100',
    formulaExplanation: 'Actual yield divided by theoretical yield, times 100',
    solution: '84%',
    steps: [
      'Divide: 42 ÷ 50 = 0.84',
      'Multiply by 100: 84%'
    ],
    explanation: 'Percent yield measures reaction efficiency. 100% means all reactants converted to product.',
    difficulty: 'easy',
    tips: ['Percent yield can never exceed 100% in ideal conditions'],
    realWorldUse: 'Industrial chemistry, laboratory work'
  },
  {
    id: generatePuzzleId('chemistry', 9),
    title: 'Ideal Gas Law',
    category: 'chemistry',
    realWorldContext: 'Gas experiments or weather',
    problem: '1 mole of gas at 273K and 1 atm. Volume? (R = 0.0821 L·atm/mol·K)',
    formula: 'PV = nRT',
    formulaExplanation: 'Solve for V: V = nRT ÷ P',
    solution: '22.4 Liters',
    steps: [
      'V = (1 × 0.0821 × 273) ÷ 1',
      '= 22.41 L'
    ],
    explanation: 'At standard temperature and pressure (STP), 1 mole of ideal gas occupies 22.4 L.',
    difficulty: 'hard',
    tips: ['Know the standard conditions: 273K (0°C), 1 atm'],
    realWorldUse: 'Scuba diving, weather, industrial gas handling'
  },
  {
    id: generatePuzzleId('chemistry', 10),
    title: 'Solution Preparation',
    category: 'chemistry',
    realWorldContext: 'Making solutions for experiments or medicine',
    problem: 'How much NaCl needed for 500ml of 0.5M solution? (Molar mass = 58.5 g/mol)',
    formula: 'Mass = M × V × MW',
    formulaExplanation: 'Molarity times volume times molecular weight',
    solution: '14.625g',
    steps: [
      'Convert volume: 500ml = 0.5L',
      'Calculate: 0.5 mol/L × 0.5 L × 58.5 g/mol = 14.625g'
    ],
    explanation: 'Preparing solutions requires calculating mass needed for desired concentration.',
    difficulty: 'medium',
    tips: ['Always use Liters for volume in molarity calculations'],
    realWorldUse: 'Laboratory preparation, medicine, photography'
  },
  {
    id: generatePuzzleId('chemistry', 11),
    title: 'Oxidation Numbers',
    category: 'chemistry',
    realWorldContext: 'Understanding redox reactions or corrosion',
    problem: 'What is oxidation number of Cr in K₂Cr₂O₇?',
    formula: 'Sum of oxidation numbers equals charge on compound',
    formulaExplanation: 'K = +1, O = -2, compound neutral',
    solution: '+6',
    steps: [
      'K₂ = 2 × (+1) = +2',
      'O₇ = 7 × (-2) = -14',
      'Compound neutral: 2 + Cr₂ + (-14) = 0',
      '2Cr₂ = +12, so Cr₂ = +12, Cr = +6'
    ],
    explanation: 'Oxidation numbers track electron transfer in redox reactions.',
    difficulty: 'hard',
    tips: ['O is usually -2 (except peroxides)', 'Elements in pure form = 0'],
    realWorldUse: 'Batteries, corrosion, metabolism'
  },
  {
    id: generatePuzzleId('chemistry', 12),
    title: 'Empirical Formula',
    category: 'chemistry',
    realWorldContext: 'Determining molecular formulas or analysis',
    problem: 'Compound is 40% C, 6.7% H, 53.3% O. Empirical formula? (C=12, H=1, O=16)',
    formula: 'Divide by atomic mass, divide by smallest',
    formulaExplanation: 'Convert percentages to moles, find simplest ratio',
    solution: 'CH₂O',
    steps: [
      'C: 40 ÷ 12 = 3.33 mol',
      'H: 6.7 ÷ 1 = 6.7 mol',
      'O: 53.3 ÷ 16 = 3.33 mol',
      'Divide by 3.33: C=1, H=2, O=1',
      'Empirical formula: CH₂O'
    ],
    explanation: 'Empirical formula shows simplest whole-number ratio of atoms.',
    difficulty: 'hard',
    tips: ['Divide each by smallest result to get simplest ratio'],
    realWorldUse: 'Chemical analysis, pharmaceutical research'
  },
  {
    id: generatePuzzleId('chemistry', 13),
    title: 'Reaction Heat',
    category: 'chemistry',
    realWorldContext: 'Exothermic/endothermic processes or calorimetry',
    problem: '1g glucose (C₆H₁₂O₆) produces 15.6 kJ. How much for 1 mole (180g)?',
    formula: 'Heat = per gram × grams per mole',
    formulaExplanation: 'Scale up by molar mass',
    solution: '2,808 kJ',
    steps: [
      'Calculate: 15.6 kJ/g × 180 g = 2,808 kJ'
    ],
    explanation: 'Reaction heats are often given per gram but needed per mole for stoichiometry.',
    difficulty: 'easy',
    tips: ['Multiply by molar mass to convert per gram to per mole'],
    realWorldUse: 'Calorimetry, nutrition, industrial processes'
  },
  {
    id: generatePuzzleId('chemistry', 14),
    title: 'Half-Life Decay',
    category: 'chemistry',
    realWorldContext: 'Nuclear chemistry or radioactive dating',
    problem: 'Isotope has half-life 5730 years (Carbon-14). After 17190 years, what fraction remains?',
    formula: 'Fraction = (1/2)^(t ÷ half-life)',
    formulaExplanation: 'Raise 1/2 to number of half-lives',
    solution: '1/8 or 12.5%',
    steps: [
      'Number of half-lives: 17190 ÷ 5730 = 3',
      'Fraction remaining: (1/2)³ = 1/8 = 12.5%'
    ],
    explanation: 'After each half-life, half of the remaining material decays.',
    difficulty: 'medium',
    tips: ['After n half-lives: fraction remaining = (1/2)^n'],
    realWorldUse: 'Carbon dating, nuclear medicine, waste management'
  },
  {
    id: generatePuzzleId('chemistry', 15),
    title: 'Titration',
    category: 'chemistry',
    realWorldContext: 'Acid-base analysis or water testing',
    problem: '25ml of 0.1M HCl neutralized by 50ml of NaOH. What is NaOH concentration?',
    formula: 'M₁V₁ = M₂V₂ (for 1:1 stoichiometry)',
    formulaExplanation: 'Moles of acid equals moles of base at neutralization',
    solution: '0.05 M',
    steps: [
      'Moles HCl: 0.1 mol/L × 0.025 L = 0.0025 mol',
      'Moles NaOH = 0.0025 mol',
      'Concentration: 0.0025 ÷ 0.050 L = 0.05 M'
    ],
    explanation: 'Titration determines concentration by reacting with a solution of known concentration.',
    difficulty: 'hard',
    tips: ['Know the stoichiometry of the reaction'],
    realWorldUse: 'Water quality, food industry, pharmaceuticals'
  },

  // ============================================
  // FINANCE (20+ puzzles)
  // ============================================

  {
    id: generatePuzzleId('finance', 1),
    title: 'Loan Payment',
    category: 'finance',
    realWorldContext: 'Understanding mortgage or car payments',
    problem: '$200,000 loan at 5% for 30 years. Monthly principal and interest payment?',
    formula: 'PMT = P × [r(1+r)^n] / [(1+r)^n - 1]',
    formulaExplanation: 'Standard loan payment formula',
    solution: 'Approximately $1,074',
    steps: [
      'Monthly rate: 5% ÷ 12 = 0.004167',
      'Number of payments: 30 × 12 = 360',
      'Using formula: 200000 × [0.004167(1.004167)^360] / [(1.004167)^360 - 1] ≈ $1,074'
    ],
    explanation: 'Monthly payment splits between interest and principal, with interest decreasing over time.',
    difficulty: 'hard',
    tips: ['Use online calculator for exact figures', 'First payment is mostly interest'],
    realWorldUse: 'Home buying, car loans, personal finance'
  },
  {
    id: generatePuzzleId('finance', 2),
    title: 'Savings Goal',
    category: 'finance',
    realWorldContext: 'Planning for a large purchase or emergency fund',
    problem: 'Need $10,000 in 5 years. How much to save monthly at 4% annual return?',
    formula: 'PMT = FV × r / [(1+r)^n - 1]',
    formulaExplanation: 'Future value payment formula rearranged',
    solution: 'Approximately $148',
    steps: [
      'Monthly rate: 4% ÷ 12 = 0.00333',
      'Number of payments: 5 × 12 = 60',
      'Calculate: 10000 × 0.00333 / [(1.00333)^60 - 1] ≈ $148'
    ],
    explanation: 'Calculate regular savings needed to reach a future financial goal.',
    difficulty: 'hard',
    tips: ['This assumes beginning of period payments'],
    realWorldUse: 'Financial planning, emergency fund, down payment'
  },
  {
    id: generatePuzzleId('finance', 3),
    title: 'Credit Card Interest',
    category: 'finance',
    realWorldContext: 'Understanding credit card debt',
    problem: '$5,000 balance at 18% APR. Daily interest rate? Daily interest on balance?',
    formula: 'Daily rate = APR ÷ 365',
    formulaExplanation: 'Annual rate divided by days in year',
    solution: 'Daily rate ≈ 0.0493%, Daily interest ≈ $2.47',
    steps: [
      'Daily rate: 18% ÷ 365 = 0.000493 = 0.0493%',
      'Daily interest: 5000 × 0.000493 = $2.47'
    ],
    explanation: 'Credit card interest is calculated daily (or monthly) on the outstanding balance.',
    difficulty: 'medium',
    tips: ['Paying more than minimum reduces interest significantly'],
    realWorldUse: 'Credit card management, debt payoff'
  },
  {
    id: generatePuzzleId('finance', 4),
    title: 'Return on Investment',
    category: 'finance',
    realWorldContext: 'Evaluating investment performance',
    problem: 'Invested $5,000, now worth $6,500. What is ROI?',
    formula: 'ROI = (Current Value - Cost) ÷ Cost × 100',
    formulaExplanation: 'Gain divided by original investment, times 100',
    solution: '30%',
    steps: [
      'Gain: 6500 - 5000 = 1500',
      'ROI: 1500 ÷ 5000 = 0.30 = 30%'
    ],
    explanation: 'Return on investment measures profit relative to amount invested.',
    difficulty: 'easy',
    tips: ['ROI can be annualized for different time periods'],
    realWorldUse: 'Investment analysis, business decisions'
  },
  {
    id: generatePuzzleId('finance', 5),
    title: 'Compound Annual Growth Rate',
    category: 'finance',
    realWorldContext: 'Comparing investment performance over time',
    problem: 'Investment grew from $10,000 to $20,000 in 10 years. What is CAGR?',
    formula: 'CAGR = (Ending ÷ Beginning)^(1/n) - 1',
    formulaExplanation: 'Growth factor raised to 1/years, minus 1',
    solution: 'Approximately 7.2%',
    steps: [
      'Growth factor: 20000 ÷ 10000 = 2',
      'CAGR: 2^(1/10) - 1 = 1.0718 - 1 = 0.0718 = 7.18%'
    ],
    explanation: 'CAGR shows the average annual growth rate, smoothing out volatility.',
    difficulty: 'hard',
    tips: ['Rule of 72: at 7.2%, money doubles in about 10 years'],
    realWorldUse: 'Fund comparison, financial planning'
  },
  {
    id: generatePuzzleId('finance', 6),
    title: 'Break-Even Analysis',
    category: 'finance',
    realWorldContext: 'Business planning or pricing strategy',
    problem: 'Fixed costs $50,000. Product sells for $25, costs $10 to make. Break-even units?',
    formula: 'Break-Even = Fixed Costs ÷ (Price - Variable Cost)',
    formulaExplanation: 'Fixed costs divided by contribution margin',
    solution: '3,333 units',
    steps: [
      'Contribution margin: 25 - 10 = $15',
      'Break-even: 50000 ÷ 15 ≈ 3333.33, round up to 3334'
    ],
    explanation: 'Break-even is when total revenue equals total costs.',
    difficulty: 'medium',
    tips: ['Always round up to whole units'],
    realWorldUse: 'Business planning, entrepreneurship, pricing'
  },
  {
    id: generatePuzzleId('finance', 7),
    title: 'Profit Margin',
    category: 'finance',
    realWorldContext: 'Business performance or pricing',
    problem: 'Product costs $40 to make, sells for $80. What is profit margin?',
    formula: 'Margin = (Price - Cost) ÷ Price × 100',
    formulaExplanation: 'Profit divided by selling price',
    solution: '50%',
    steps: [
      'Profit: 80 - 40 = 40',
      'Margin: 40 ÷ 80 = 0.50 = 50%'
    ],
    explanation: 'Profit margin shows what percentage of revenue is profit.',
    difficulty: 'easy',
    tips: ['Markup is different: 40 ÷ 40 = 100% markup'],
    realWorldUse: 'Business analysis, retail, pricing'
  },
  {
    id: generatePuzzleId('finance', 8),
    title: 'Hourly Wage',
    category: 'finance',
    realWorldContext: 'Comparing jobs or contract work',
    problem: 'Salary $60,000/year. Working 40 hours/week, 50 weeks/year. Hourly rate?',
    formula: 'Hourly = Annual Salary ÷ (Hours/Week × Weeks/Year)',
    formulaExplanation: 'Divide annual salary by total work hours',
    solution: '$30/hour',
    steps: [
      'Total hours: 40 × 50 = 2,000',
      'Hourly: 60000 ÷ 2000 = 30'
    ],
    explanation: 'Convert annual salary to hourly rate for comparison.',
    difficulty: 'easy',
    tips: ['Account for unpaid time off when comparing'],
    realWorldUse: 'Job comparison, contract negotiation, freelance pricing'
  },
  {
    id: generatePuzzleId('finance', 9),
    title: 'Tax Bracket',
    category: 'finance',
    realWorldContext: 'Tax planning or paycheck understanding',
    problem: 'Income $45,000. Tax brackets: 10% up to $11,000, 12% up to $44,725, 22% above. Tax owed?',
    formula: 'Calculate tax in each bracket',
    formulaExplanation: 'Pay each rate on income within that bracket',
    solution: '$5,167.50',
    steps: [
      'First $11,000 at 10%: 11000 × 0.10 = 1,100',
      'Next $33,725 at 12%: 33725 × 0.12 = 4,047',
      'Remaining $275 at 22%: 275 × 0.22 = 60.50',
      'Total: 1100 + 4047 + 60.50 = 5,207.50'
    ],
    explanation: 'Progressive tax means higher rates only apply to income above thresholds.',
    difficulty: 'medium',
    tips: ['Moving into higher bracket only affects that portion, not all income'],
    realWorldUse: 'Tax planning, salary negotiation'
  },
  {
    id: generatePuzzleId('finance', 10),
    title: 'Rent-to-Income Ratio',
    category: 'finance',
    realWorldContext: 'Apartment hunting or budgeting',
    problem: 'Monthly income $5,000. Rent is $1,500. What percentage of income?',
    formula: 'Percentage = Rent ÷ Income × 100',
    formulaExplanation: 'Divide rent by gross monthly income',
    solution: '30%',
    steps: [
      'Divide: 1500 ÷ 5000 = 0.30 = 30%'
    ],
    explanation: '30% is a common guideline for housing affordability.',
    difficulty: 'easy',
    tips: ['Financial experts recommend not exceeding 30%'],
    realWorldUse: 'Housing decisions, budgeting,租房'
  },
  {
    id: generatePuzzleId('finance', 11),
    title: 'Debt-to-Income Ratio',
    category: 'finance',
    realWorldContext: 'Loan applications or financial health',
    problem: 'Monthly income $6,000. Monthly debts: mortgage $1,500, car $400, credit cards $200. DTI?',
    formula: 'DTI = Total Monthly Debt ÷ Gross Monthly Income × 100',
    formulaExplanation: 'Sum all debt payments, divide by income',
    solution: '35%',
    steps: [
      'Total debt: 1500 + 400 + 200 = 2100',
      'DTI: 2100 ÷ 6000 = 0.35 = 35%'
    ],
    explanation: 'Debt-to-income ratio shows how much of income goes to debt payments.',
    difficulty: 'easy',
    tips: ['Most lenders want DTI below 36%', '36-43% may be conditional'],
    realWorldUse: 'Loan applications, financial planning'
  },
  {
    id: generatePuzzleId('finance', 12),
    title: 'Present Value',
    category: 'finance',
    realWorldContext: 'Evaluating future sums or lottery options',
    problem: '$100,000 received in 10 years. What is present value at 5% discount rate?',
    formula: 'PV = FV ÷ (1 + r)^n',
    formulaExplanation: 'Future value divided by (1 + rate) to the power of years',
    solution: '$61,359',
    steps: [
      'Calculate: 100000 ÷ (1.05)^10',
      '= 100000 ÷ 1.62889 = 61359'
    ],
    explanation: 'Present value shows what a future sum is worth today.',
    difficulty: 'medium',
    tips: ['Higher discount rate = lower present value'],
    realWorldUse: 'Investments, lottery choices, inheritance planning'
  },
  {
    id: generatePuzzleId('finance', 13),
    title: 'Inflation Impact',
    category: 'finance',
    realWorldContext: 'Long-term planning or salary negotiations',
    problem: '3% inflation for 10 years. What is $1 today worth then in todays dollars?',
    formula: 'Real Value = Nominal Value ÷ (1 + inflation)^n',
    formulaExplanation: 'Divide by (1+rate) to power of years',
    solution: 'About $0.74',
    steps: [
      'Calculate: 1 ÷ (1.03)^10',
      '= 1 ÷ 1.3439 = 0.744'
    ],
    explanation: 'Inflation erodes purchasing power over time.',
    difficulty: 'medium',
    tips: ['At 3% inflation, prices double in about 24 years (rule of 72)'],
    realWorldUse: 'Retirement planning, salary negotiations'
  },
  {
    id: generatePuzzleId('finance', 14),
    title: 'Retirement Savings',
    category: 'finance',
    realWorldContext: 'Planning for retirement',
    problem: 'Need $1 million at retirement in 30 years. How much monthly at 7% annual return?',
    formula: 'PMT = FV × r / [(1+r)^n - 1]',
    formulaExplanation: 'Future value payment formula',
    solution: 'Approximately $880/month',
    steps: [
      'Monthly rate: 7% ÷ 12 = 0.00583',
      'Payments: 30 × 12 = 360',
      'Calculate: 1000000 × 0.00583 / [(1.00583)^360 - 1] ≈ $880'
    ],
    explanation: 'Start early - compound interest dramatically increases results.',
    difficulty: 'hard',
    tips: ['Dont forget to account for employer match if applicable'],
    realWorldUse: '401k planning, IRA contributions, financial freedom'
  },
  {
    id: generatePuzzleId('finance', 15),
    title: 'Net Worth',
    category: 'finance',
    realWorldContext: 'Measuring financial health',
    problem: 'Assets: House $300,000, Savings $50,000, Investments $100,000. Liabilities: Mortgage $200,000, Car loan $20,000. Net worth?',
    formula: 'Net Worth = Assets - Liabilities',
    formulaExplanation: 'Sum all assets, subtract all debts',
    solution: '$230,000',
    steps: [
      'Total assets: 300000 + 50000 + 100000 = 450000',
      'Total liabilities: 200000 + 20000 = 220000',
      'Net worth: 450000 - 220000 = 230000'
    ],
    explanation: 'Net worth measures overall financial position.',
    difficulty: 'easy',
    tips: ['Include all assets and liabilities'],
    realWorldUse: 'Financial health check, loan applications'
  },
  {
    id: generatePuzzleId('finance', 16),
    title: 'Cost of Credit',
    category: 'finance',
    realWorldContext: 'Understanding loan costs or credit cards',
    problem: '$5,000 loan, 60 monthly payments of $110. Total interest paid?',
    formula: 'Total Interest = Total Payments - Principal',
    formulaExplanation: 'Sum all payments, subtract original loan amount',
    solution: '$1,600',
    steps: [
      'Total payments: 110 × 60 = 6,600',
      'Interest: 6600 - 5000 = 1,600'
    ],
    explanation: 'Total interest paid shows the true cost of borrowing.',
    difficulty: 'easy',
    tips: ['Calculate APR for better comparison between loans'],
    realWorldUse: 'Loan decisions, credit card comparison'
  },
  {
    id: generatePuzzleId('finance', 17),
    title: 'Rule of 72',
    category: 'finance',
    realWorldContext: 'Quick investment estimates',
    problem: 'At 8% return, how many years to double investment?',
    formula: 'Years to Double = 72 ÷ Interest Rate',
    formulaExplanation: 'Divide 72 by annual return percentage',
    solution: '9 years',
    steps: [
      'Divide: 72 ÷ 8 = 9'
    ],
    explanation: 'The Rule of 72 estimates how long to double money at compound interest.',
    difficulty: 'easy',
    tips: ['Also works for inflation: 72 ÷ 3% = 24 years for prices to double'],
    realWorldUse: 'Investment planning, financial education'
  },
  {
    id: generatePuzzleId('finance', 18),
    title: 'Emergency Fund',
    category: 'finance',
    realWorldContext: 'Financial security planning',
    problem: 'Monthly expenses $4,000. How much for 6-month emergency fund?',
    formula: 'Emergency Fund = Monthly Expenses × Months',
    formulaExplanation: 'Multiply monthly costs by desired months of coverage',
    solution: '$24,000',
    steps: [
      'Multiply: 4000 × 6 = 24,000'
    ],
    explanation: 'Emergency fund provides financial security for unexpected expenses or job loss.',
    difficulty: 'easy',
    tips: ['3-6 months is typical recommendation'],
    realWorldUse: 'Financial security, peace of mind'
  },
  {
    id: generatePuzzleId('finance', 19),
    title: 'Dividend Yield',
    category: 'finance',
    realWorldContext: 'Income investing or stock analysis',
    problem: 'Stock pays $2.50 annual dividend, price is $100/share. Dividend yield?',
    formula: 'Yield = Annual Dividend ÷ Stock Price × 100',
    formulaExplanation: 'Divide dividend by current stock price',
    solution: '2.5%',
    steps: [
      'Calculate: 2.50 ÷ 100 = 0.025 = 2.5%'
    ],
    explanation: 'Dividend yield shows return from dividends relative to stock price.',
    difficulty: 'easy',
    tips: ['Higher yield may indicate value or risk'],
    realWorldUse: 'Stock analysis, income investing, retirement'
  },
  {
    id: generatePuzzleId('finance', 20),
    title: 'Car Affordability',
    category: 'finance',
    realWorldContext: 'Car buying or budgeting',
    problem: 'Monthly budget $500 for car payment. 5-year loan at 6% APR. How much car can you afford?',
    formula: 'Car Price = PMT × [(1+r)^n - 1] / [r(1+r)^n]',
    formulaExplanation: 'Reverse loan formula to find principal',
    solution: 'Approximately $26,000',
    steps: [
      'Monthly rate: 6% ÷ 12 = 0.005',
      'Payments: 5 × 12 = 60',
      'Calculate: 500 × [(1.005)^60 - 1] / [0.005(1.005)^60]',
      '≈ 500 × 52.99 = $26,495'
    ],
    explanation: 'Calculate how much car payment fits your budget.',
    difficulty: 'hard',
    tips: ['Dont forget insurance, gas, and maintenance costs'],
    realWorldUse: 'Car buying, budgeting, transportation planning'
  },

  // ============================================
  // COOKING & NUTRITION (15+ puzzles)
  // ============================================

  {
    id: generatePuzzleId('cooking', 1),
    title: 'Calorie Count',
    category: 'cooking',
    realWorldContext: 'Tracking food intake or meal planning',
    problem: 'Meal consists of: 200 cal chicken, 150 cal rice, 100 cal vegetables, 150 cal sauce. Total calories?',
    formula: 'Total = Sum of all components',
    formulaExplanation: 'Add up calories from each ingredient',
    solution: '600 calories',
    steps: [
      'Add: 200 + 150 + 100 + 150 = 600'
    ],
    explanation: 'Total calories are the sum of all components in the meal.',
    difficulty: 'easy',
    tips: ['Read nutrition labels carefully - serving size matters'],
    realWorldUse: 'Weight management, meal planning, dieting'
  },
  {
    id: generatePuzzleId('cooking', 2),
    title: 'Macro Percentage',
    category: 'cooking',
    realWorldContext: 'Tracking macros or understanding nutrition',
    problem: 'Meal has 30g protein, 50g carbs, 15g fat. What percentage of calories from each? (Protein=4cal/g, Carbs=4cal/g, Fat=9cal/g)',
    formula: 'Percentage = (Grams × Cal/g) ÷ Total Calories × 100',
    formulaExplanation: 'Calculate calories from each macro, then percentage of total',
    solution: 'Protein: 18%, Carbs: 60%, Fat: 22%',
    steps: [
      'Protein calories: 30 × 4 = 120',
      'Carbs calories: 50 × 4 = 200',
      'Fat calories: 15 × 9 = 135',
      'Total: 120 + 200 + 135 = 455 cal',
      'Protein %: 120 ÷ 455 = 26.4%',
      'Carbs %: 200 ÷ 455 = 44%',
      'Fat %: 135 ÷ 455 = 29.7%'
    ],
    explanation: 'Different macros have different calorie densities.',
    difficulty: 'hard',
    tips: ['Protein and carbs = 4 cal/g, Fat = 9 cal/g'],
    realWorldUse: 'Diet planning, nutrition tracking, fitness'
  },
  {
    id: generatePuzzleId('cooking', 3),
    title: 'Portion Calculation',
    category: 'cooking',
    realWorldContext: 'Serving food or meal prep',
    problem: 'Large container has 3 cups of ice cream. Serving size is 1 cup. How many servings?',
    formula: 'Servings = Total Amount ÷ Serving Size',
    formulaExplanation: 'Divide total by single serving amount',
    solution: '3 servings',
    steps: [
      'Divide: 3 ÷ 1 = 3'
    ],
    explanation: 'Simple division to find how many servings in a package.',
    difficulty: 'easy',
    tips: ['Check serving size on nutrition labels'],
    realWorldUse: 'Portion control, meal prep, grocery shopping'
  },
  {
    id: generatePuzzleId('cooking', 4),
    title: 'Grocery Budget',
    category: 'cooking',
    realWorldContext: 'Shopping on a budget',
    problem: 'Weekly grocery budget $80. Spent: bread $3, milk $4, eggs $5, meat $15, vegetables $8. Remaining?',
    formula: 'Remaining = Budget - Total Spent',
    formulaExplanation: 'Subtract all purchases from budget',
    solution: '$45',
    steps: [
      'Total spent: 3 + 4 + 5 + 15 + 8 = 35',
      'Remaining: 80 - 35 = 45'
    ],
    explanation: 'Track spending against budget to avoid overspending.',
    difficulty: 'easy',
    tips: ['Make a list and stick to it to stay under budget'],
    realWorldUse: 'Budget shopping, meal planning, saving money'
  },
  {
    id: generatePuzzleId('cooking', 5),
    title: 'Recipe Conversion',
    category: 'cooking',
    realWorldContext: 'Scaling recipes for different group sizes',
    problem: 'Recipe serves 6, calls for 1.5 cups of rice. Serving 18 people. How much rice?',
    formula: 'New Amount = Original × (Desired ÷ Original)',
    formulaExplanation: 'Multiply by ratio of desired to original servings',
    solution: '4.5 cups',
    steps: [
      'Scaling factor: 18 ÷ 6 = 3',
      'New amount: 1.5 × 3 = 4.5'
    ],
    explanation: 'Scale all ingredients by the same factor when changing serving size.',
    difficulty: 'easy',
    tips: ['Some spices and leavening may need slight adjustment'],
    realWorldUse: 'Cooking for large groups, meal prep, catering'
  },
  {
    id: generatePuzzleId('cooking', 6),
    title: 'Cooking Time Adjustment',
    category: 'cooking',
    realWorldContext: 'Adjusting recipe for different quantities',
    problem: 'Recipe for 1 chicken breast (8oz) takes 20 min at 400°F. You have 2 lbs (32oz). Time?',
    formula: 'Time ≈ (Weight × Time) ÷ Original Weight',
    formulaExplanation: 'Scale time proportionally with weight',
    solution: 'Approximately 80 minutes',
    steps: [
      'Original: 8oz = 0.5 lb, Time = 20 min',
      'New: 2 lb ÷ 0.5 lb = 4× original',
      'Time: 20 × 4 = 80 min'
    ],
    explanation: 'Larger items take proportionally longer to cook through.',
    difficulty: 'medium',
    tips: ['Use meat thermometer for doneness verification'],
    realWorldUse: 'Cooking roasts, meal planning, food safety'
  },
  {
    id: generatePuzzleId('cooking', 7),
    title: 'Liquid Substitution',
    category: 'cooking',
    realWorldContext: 'Recipe modifications or dietary restrictions',
    problem: 'Recipe calls for 1 cup whole milk. Using half-and-half (40% fat) instead. Fat difference? (Whole milk = 8g fat/cup, half-and-half = 23g fat/cup)',
    formula: 'Difference = New Fat - Original Fat',
    formulaExplanation: 'Calculate fat in each, find difference',
    solution: '15g more fat',
    steps: [
      'Whole milk fat: 8g',
      'Half-and-half fat: 23g',
      'Difference: 23 - 8 = 15g'
    ],
    explanation: 'Substituting ingredients changes nutritional content.',
    difficulty: 'easy',
    tips: ['Higher fat dairy affects texture and richness'],
    realWorldUse: 'Cooking, baking, dietary modifications'
  },
  {
    id: generatePuzzleId('cooking', 8),
    title: 'Yields and Waste',
    category: 'cooking',
    realWorldContext: 'Buying ingredients or food cost analysis',
    problem: 'Whole pineapple costs $2.50. After trimming, yields 60% usable fruit. Cost per usable cup? (1 cup = about 8oz fruit)',
    formula: 'Cost = Price ÷ (Weight × Yield %) × Cup Weight',
    formulaExplanation: 'Account for waste to find true cost',
    solution: 'About $0.78/cup',
    steps: [
      'Assume whole pineapple = 4 lb = 64 oz',
      'Usable: 64 × 0.60 = 38.4 oz',
      'Cups: 38.4 ÷ 8 = 4.8 cups',
      'Cost per cup: 2.50 ÷ 4.8 ≈ $0.52'
    ],
    explanation: 'Account for trimming/waste when calculating food costs.',
    difficulty: 'hard',
    tips: ['Some items have higher waste (like spinach) than others'],
    realWorldUse: 'Cost analysis, grocery planning, food service'
  },
  {
    id: generatePuzzleId('cooking', 9),
    title: 'Sugar Substitution',
    category: 'cooking',
    realWorldContext: 'Reducing sugar or diabetic-friendly baking',
    problem: 'Recipe calls for 1 cup sugar. Using stevia (equivalent sweetness at 1/300th amount). How much stevia?',
    formula: 'Substitute Amount = Original Amount ÷ Sweetness Ratio',
    formulaExplanation: 'Divide by the relative sweetness factor',
    solution: 'About 1 teaspoon (0.0033 cup)',
    steps: [
      'Sweetness ratio: 300× sweeter',
      'Amount: 1 ÷ 300 = 0.0033 cup ≈ 1 tsp'
    ],
    explanation: 'Different sweeteners have different sweetness levels.',
    difficulty: 'medium',
    tips: ['Check conversion charts for specific sweeteners'],
    realWorldUse: 'Healthy cooking, diabetes management, baking'
  },
  {
    id: generatePuzzleId('cooking', 10),
    title: 'Thickening Power',
    category: 'cooking',
    realWorldContext: 'Gravy or sauce making',
    problem: '1 tbsp cornstarch thickens 1 cup liquid. Need to thicken 2 quarts. How much cornstarch? (16 tbsp = 1 cup)',
    formula: 'Amount = (Desired Volume ÷ Standard Volume) × Standard Amount',
    formulaExplanation: 'Scale thickening agent proportionally',
    solution: '8 tablespoons (1/2 cup)',
    steps: [
      'Convert quarts to cups: 2 qt = 8 cups',
      'Scale: 8 cups ÷ 1 cup = 8×',
      'Cornstarch: 1 tbsp × 8 = 8 tbsp = 0.5 cup'
    ],
    explanation: 'Thickening agents have different strengths - follow recipe guidelines.',
    difficulty: 'medium',
    tips: ['Mix with cold liquid first to avoid lumps'],
    realWorldUse: 'Sauces, gravies, soups, puddings'
  },
  {
    id: generatePuzzleId('cooking', 11),
    title: 'Salt Conversion',
    category: 'cooking',
    realWorldContext: 'Seasoning or recipe conversion',
    problem: 'Recipe calls for 1 tbsp salt. Using table salt vs. kosher salt. Kosher salt is half as dense. Adjust?',
    formula: 'Adjust Amount = Original × (Table Density ÷ Kosher Density)',
    formulaExplanation: 'Account for different densities',
    solution: '2 tbsp kosher salt',
    steps: [
      'Kosher is half as dense, so need twice the volume',
      'Amount: 1 tbsp × 2 = 2 tbsp'
    ],
    explanation: 'Different salt types have different densities and crystal sizes.',
    difficulty: 'easy',
    tips: ['Mortons kosher is different from diamond crystal - check labels'],
    realWorldUse: 'Baking, cooking, seasoning'
  },
  {
    id: generatePuzzleId('cooking', 12),
    title: 'Protein Content',
    category: 'cooking',
    realWorldContext: 'Meal planning or nutrition tracking',
    problem: '3oz chicken breast has 26g protein. 4oz serving has how much protein?',
    formula: 'Protein = (Serving Size ÷ Standard Size) × Standard Protein',
    formulaExplanation: 'Scale proportionally',
    solution: 'About 35g',
    steps: [
      'Ratio: 4 ÷ 3 = 1.33',
      'Protein: 26 × 1.33 = 34.67 ≈ 35g'
    ],
    explanation: 'Protein content scales with serving size.',
    difficulty: 'easy',
    tips: ['3oz is standard serving - about the size of a deck of cards'],
    realWorldUse: 'Fitness, meal planning, nutrition'
  },
  {
    id: generatePuzzleId('cooking', 13),
    title: 'Alcohol Burn-Off',
    category: 'cooking',
    realWorldContext: 'Cooking with wine or spirits',
    problem: 'Recipe adds 1 cup wine (14% alcohol) to a large pot. After 30 min simmering, 40% of alcohol remains. How much alcohol in the dish?',
    formula: 'Remaining Alcohol = Original Alcohol × Remaining %',
    formulaExplanation: 'Track alcohol reduction during cooking',
    solution: '0.056 cups pure alcohol',
    steps: [
      'Alcohol in wine: 1 cup × 0.14 = 0.14 cups pure alcohol',
      'Remaining: 0.14 × 0.40 = 0.056 cups'
    ],
    explanation: 'Alcohol burns off slowly - some remains even after long cooking.',
    difficulty: 'medium',
    tips: ['Longer cooking = more alcohol burned off'],
    realWorldUse: 'Cooking with wine, food safety for children, religious restrictions'
  },
  {
    id: generatePuzzleId('cooking', 14),
    title: 'Leavening Conversion',
    category: 'cooking',
    realWorldContext: 'Baking substitutions or altitude adjustment',
    problem: 'Recipe at sea level uses 1 tsp baking powder per cup flour. At high altitude, use 1.25× leavening. Amount?',
    formula: 'High Altitude Amount = Sea Level × Altitude Factor',
    formulaExplanation: 'Increase leavening at altitude',
    solution: '1.25 tsp',
    steps: [
      'Multiply: 1 × 1.25 = 1.25 tsp'
    ],
    explanation: 'At high altitude, less atmospheric pressure means more rising - need less leavening.',
    difficulty: 'easy',
    tips: ['Also reduce sugar and increase liquid slightly at altitude'],
    realWorldUse: 'High altitude baking, recipe adjustment'
  },
  {
    id: generatePuzzleId('cooking', 15),
    title: 'Temperature for Doneness',
    category: 'cooking',
    realWorldContext: 'Safe cooking temperatures',
    problem: 'Chicken should reach 165°F internal. Oven is 350°F. How many degrees above target?',
    formula: 'Difference = Oven Temp - Target Temp',
    formulaExplanation: 'Simple subtraction',
    solution: '185°F higher',
    steps: [
      'Calculate: 350 - 165 = 185'
    ],
    explanation: 'Oven temperature must be higher than target internal temperature.',
    difficulty: 'easy',
    tips: ['Use a meat thermometer for accuracy'],
    realWorldUse: 'Food safety, cooking, meal preparation'
  },

  // ============================================
  // HOME IMPROVEMENT (15+ puzzles)
  // ============================================

  {
    id: generatePuzzleId('home', 1),
    title: 'Flooring Cost',
    category: 'home',
    realWorldContext: 'Renovation planning and budgeting',
    problem: 'Room is 20ft by 15ft. Hardwood costs $5.50 per sq ft. Total cost?',
    formula: 'Cost = Area × Price per Sq Ft',
    formulaExplanation: 'Calculate area, multiply by unit price',
    solution: '$1,650',
    steps: [
      'Area: 20 × 15 = 300 sq ft',
      'Cost: 300 × 5.50 = 1,650'
    ],
    explanation: 'Calculate total area first, then multiply by cost per unit.',
    difficulty: 'easy',
    tips: ['Add 10% for waste and cutting mistakes'],
    realWorldUse: 'Flooring, carpet, tile, laminate installation'
  },
  {
    id: generatePuzzleId('home', 2),
    title: 'Paint Quantity',
    category: 'home',
    realWorldContext: 'Planning a painting project',
    problem: 'Wall is 12ft wide by 8ft tall. One gallon covers 350 sq ft. How many gallons needed?',
    formula: 'Gallons = Area ÷ Coverage per Gallon',
    formulaExplanation: 'Divide wall area by coverage rate',
    solution: '1 gallon (with extra for touch-ups)',
    steps: [
      'Area: 12 × 8 = 96 sq ft',
      'Gallons: 96 ÷ 350 = 0.27 gallons',
      'Round up: 1 gallon'
    ],
    explanation: 'Always round up to ensure enough paint.',
    difficulty: 'easy',
    tips: ['Two coats typically needed - double the coverage needed'],
    realWorldUse: 'Interior painting, home improvement, renovation'
  },
  {
    id: generatePuzzleId('home', 3),
    title: 'Wallpaper Rolls',
    category: 'home',
    realWorldContext: 'Wallpapering a room',
    problem: 'Room perimeter is 50ft. Wall height is 8ft. Wallpaper roll covers 30 sq ft (pattern match considered). Rolls needed?',
    formula: 'Rolls = (Perimeter × Height) ÷ Coverage per Roll',
    formulaExplanation: 'Calculate total wall area, divide by roll coverage',
    solution: 'Approximately 14 rolls',
    steps: [
      'Total wall area: 50 × 8 = 400 sq ft',
      'Rolls: 400 ÷ 30 = 13.33, round up to 14'
    ],
    explanation: 'Pattern matching and waste increase roll requirements.',
    difficulty: 'medium',
    tips: ['Always buy extra rolls from same dye lot'],
    realWorldUse: 'Wallpapering, interior design'
  },
  {
    id: generatePuzzleId('home', 4),
    title: 'Carpet Padding',
    category: 'home',
    realWorldContext: 'Installing carpet properly',
    problem: 'Stairs: 12 steps, each 3ft wide by 1ft rise. Padding costs $2.50 per sq ft. Total cost?',
    formula: 'Cost = Area × Price per Sq Ft',
    formulaExplanation: 'Calculate total area, multiply by unit cost',
    solution: '$90',
    steps: [
      'Area per step: 3 × 1 = 3 sq ft',
      'Total steps: 12',
      'Total area: 3 × 12 = 36 sq ft',
      'Cost: 36 × 2.50 = 90'
    ],
    explanation: 'Carpet padding is sold by square foot or square yard.',
    difficulty: 'medium',
    tips: ['Padding extends carpet life significantly'],
    realWorldUse: 'Carpet installation, flooring projects'
  },
  {
    id: generatePuzzleId('home', 5),
    title: 'Concrete Volume',
    category: 'home',
    realWorldContext: 'Pouring concrete for a patio or walkway',
    problem: 'Patio is 10ft by 8ft, 4 inches thick. How many cubic feet of concrete?',
    formula: 'Volume = Length × Width × Thickness',
    formulaExplanation: 'Multiply all dimensions',
    solution: '26.67 cubic feet',
    steps: [
      'Convert thickness: 4 inches = 4/12 = 0.333 ft',
      'Volume: 10 × 8 × 0.333 = 26.64 ≈ 26.7 cu ft'
    ],
    explanation: 'Convert all measurements to same units before calculating.',
    difficulty: 'medium',
    tips: ['Order slightly more than calculated (5-10%) for waste and spillage'],
    realWorldUse: 'Patios, foundations, walkways, footings'
  },
  {
    id: generatePuzzleId('home', 6),
    title: 'Fence Material',
    category: 'home',
    realWorldContext: 'Building a fence',
    problem: 'Yard perimeter is 200ft. Fence sections are 8ft wide. How many sections?',
    formula: 'Sections = Perimeter ÷ Section Width',
    formulaExplanation: 'Divide total length by width of each section',
    solution: '25 sections',
    steps: [
      'Divide: 200 ÷ 8 = 25'
    ],
    explanation: 'Divide total fence length by section width.',
    difficulty: 'easy',
    tips: ['Add extra for gates and corners'],
    realWorldUse: 'Fencing, property boundaries, privacy'
  },
  {
    id: generatePuzzleId('home', 7),
    title: 'Lumber Calculation',
    category: 'home',
    realWorldContext: 'Building projects or framing',
    problem: 'Building a deck 12ft by 10ft using 2×6 boards (1.5in actual width) with 0.25in gap. How many boards lengthwise?',
    formula: 'Boards = Width ÷ (Board Width + Gap)',
    formulaExplanation: 'Account for board width plus gap between boards',
    solution: 'About 17 boards',
    steps: [
      'Coverage per board: 1.5 + 0.25 = 1.75 in',
      'Boards needed: 120 in ÷ 1.75 = 68.57 for full coverage',
      'Direction check needed - this is for one direction only'
    ],
    explanation: 'Joist spacing and board coverage both matter for decks.',
    difficulty: 'hard',
    tips: ['Check local building codes for required joist spacing'],
    realWorldUse: 'Deck building, framing, carpentry'
  },
  {
    id: generatePuzzleId('home', 8),
    title: 'Insulation R-Value',
    category: 'home',
    realWorldContext: 'Energy efficiency or weatherization',
    problem: 'Attic needs R-38. Using R-13 batts with 4in foil foam (R-6 per inch). Total R-value?',
    formula: 'Total R = R1 + R2',
    formulaExplanation: 'R-values add when materials are layered',
    solution: 'R-19',
    steps: [
      'Foam R-value: 4in × R-6/in = R-24',
      'Total: R-13 + R-24 = R-37',
      'Need additional R-1 for R-38'
    ],
    explanation: 'R-values add when materials are stacked in series.',
    difficulty: 'medium',
    tips: ['Higher R-value means better insulation'],
    realWorldUse: 'Insulation, energy efficiency, HVAC'
  },
  {
    id: generatePuzzleId('home', 9),
    title: 'Water Heater Size',
    category: 'home',
    realWorldContext: 'Selecting a water heater for a household',
    problem: 'Family of 4 uses about 80 gallons per day. Water heater should provide 70% of daily use in first hour. Size needed?',
    formula: 'First Hour Rating = 0.70 × Daily Use',
    formulaExplanation: 'Water heater should deliver 70% of daily use in first hour',
    solution: '56 gallons minimum first-hour rating',
    steps: [
      'Calculate: 80 × 0.70 = 56 gallons'
    ],
    explanation: 'First hour rating (FHR) measures how much hot water unit can deliver in peak hour.',
    difficulty: 'medium',
    tips: ['Consider usage patterns - morning showers back-to-back'],
    realWorldUse: 'Water heater selection, plumbing, home efficiency'
  },
  {
    id: generatePuzzleId('home', 10),
    title: 'Air Filter Size',
    category: 'home',
    realWorldContext: 'HVAC maintenance',
    problem: 'Furnace requires 16×25×1 inch filter. How many square inches of filter area?',
    formula: 'Area = Length × Width',
    formulaExplanation: 'Calculate surface area of filter',
    solution: '400 sq inches',
    steps: [
      'Multiply: 16 × 25 = 400'
    ],
    explanation: 'Filter size is usually given as length × width × thickness.',
    difficulty: 'easy',
    tips: ['Check monthly and replace every 1-3 months'],
    realWorldUse: 'HVAC maintenance, air quality, energy efficiency'
  },
  {
    id: generatePuzzleId('home', 11),
    title: 'Sump Pump Capacity',
    category: 'home',
    realWorldContext: 'Basement waterproofing',
    problem: 'Basement has 1,000 sq ft. Heavy rain produces 0.5 inch per hour. Sump pump GPM needed? (1 cu ft = 7.48 gal)',
    formula: 'GPM = (Area × Rain Rate × 7.48) ÷ 60',
    formulaExplanation: 'Calculate water volume per minute',
    solution: 'Approximately 62 GPM',
    steps: [
      'Rain per hour: 1000 × 0.5 ÷ 12 = 41.67 cu ft',
      'Gallons: 41.67 × 7.48 = 312 gallons',
      'GPM: 312 ÷ 60 = 5.2 GPM',
      'Add safety factor: 5.2 × 1.5 = 7.8 GPM minimum, likely need 20+ GPM unit'
    ],
    explanation: 'Sump pump must handle peak water inflow plus safety margin.',
    difficulty: 'hard',
    tips: ['Battery backup recommended for power outages'],
    realWorldUse: 'Basement waterproofing, flood prevention'
  },
  {
    id: generatePuzzleId('home', 12),
    title: 'Grout Coverage',
    category: 'home',
    realWorldContext: 'Tile installation',
    problem: 'Tile floor 10ft by 8ft with 1/4 inch grout lines. Tile size 12×12 inches. How much grout needed?',
    formula: 'Grout = Area × Joint Width × Grout Depth',
    formulaExplanation: 'Approximate based on tile area and joint dimensions',
    solution: 'Approximately 1.5-2 quarts',
    steps: [
      'Tile area: 80 sq ft = 11,520 sq in',
      'With 1/4" grout lines, add about 15-20%',
      'Approximate grout needed: 1.5-2 quarts for this area'
    ],
    explanation: 'Grout coverage depends on tile size and joint width.',
    difficulty: 'medium',
    tips: ['Use sanded grout for joints over 1/8 inch'],
    realWorldUse: 'Tile installation, bathroom renovation'
  },
  {
    id: generatePuzzleId('home', 13),
    title: 'Drywall Sheets',
    category: 'home',
    realWorldContext: 'Hanging drywall',
    problem: 'Room 12ft × 14ft × 8ft ceiling. Excluding door (3×7) and window (4×4). Sheets needed? (4×8 sheet = 32 sq ft)',
    formula: 'Sheets = Total Wall Area ÷ Area per Sheet',
    formulaExplanation: 'Calculate wall area minus openings, divide by sheet coverage',
    solution: 'Approximately 17-18 sheets',
    steps: [
      'Perimeter: 2 × (12 + 14) = 52 ft',
      'Total wall area: 52 × 8 = 416 sq ft',
      'Door opening: 3 × 7 = 21 sq ft',
      'Window opening: 4 × 4 = 16 sq ft',
      'Net area: 416 - 21 - 16 = 379 sq ft',
      'Sheets: 379 ÷ 32 = 11.84 sheets per coat',
      'Two coats = ~24 sheets'
    ],
    explanation: 'Account for waste (typically 10-15%) and number of coats.',
    difficulty: 'hard',
    tips: ['Buy 10% extra for waste and mistakes'],
    realWorldUse: 'Drywall installation, room finishing'
  },
  {
    id: generatePuzzleId('home', 14),
    title: 'LED Bulb Savings',
    category: 'home',
    realWorldContext: 'Energy efficiency upgrade',
    problem: 'Replacing 60W incandescent with 9W LED. Using 4 hours/day. Electricity $0.12/kWh. Annual savings?',
    formula: 'Savings = (Old Watt - New Watt) × Hours × Rate',
    formulaExplanation: 'Calculate energy difference times usage',
    solution: 'About $9 per year per bulb',
    steps: [
      'Energy saved: 60 - 9 = 51W = 0.051 kW',
      'Annual kWh saved: 0.051 × 4 × 365 = 74.46 kWh',
      'Annual savings: 74.46 × 0.12 = $8.94'
    ],
    explanation: 'LEDs use much less energy for the same light output.',
    difficulty: 'medium',
    tips: ['LEDs also last 15-25× longer than incandescent'],
    realWorldUse: 'Energy savings, lighting upgrades, sustainability'
  },
  {
    id: generatePuzzleId('home', 15),
    title: 'Caulk Usage',
    category: 'home',
    realWorldContext: 'Bathroom or kitchen caulking',
    problem: 'Caulking bathtub. Tub perimeter 6ft. Joint width 0.25in, depth 0.25in. How much caulk? (10.5 oz tube covers ~50 linear ft of 0.25×0.25 joint)',
    formula: 'Length Covered = Tube ÷ Joint Size Factor',
    formulaExplanation: 'Use manufacturer coverage ratings',
    solution: 'Need 1 tube (covers 6ft easily)',
    steps: [
      'Perimeter: 6 linear feet',
      'Joint: 0.25 × 0.25 inch',
      'Tube covers ~50 linear ft at this joint size',
      '6ft ÷ 50ft = 0.12 tube, so 1 tube sufficient with plenty left'
    ],
    explanation: 'Caulk coverage depends on joint size - larger joints use more.',
    difficulty: 'easy',
    tips: ['Clean and dry surfaces before applying'],
    realWorldUse: 'Bathrooms, kitchens, windows, weatherproofing'
  },

  // ============================================
  // GARDENING (10+ puzzles)
  // ============================================

  {
    id: generatePuzzleId('gardening', 1),
    title: 'Plant Spacing',
    category: 'gardening',
    realWorldContext: 'Planning a garden layout',
    problem: 'Garden is 20ft × 20ft. Plants need 2ft × 2ft spacing (center to center). How many plants?',
    formula: 'Plants = (Length ÷ Spacing) × (Width ÷ Spacing)',
    formulaExplanation: 'Calculate plants per row times number of rows',
    solution: '100 plants',
    steps: [
      'Per row: 20 ÷ 2 = 10 plants',
      'Number of rows: 20 ÷ 2 = 10',
      'Total: 10 × 10 = 100'
    ],
    explanation: 'Divide garden dimension by spacing to get plants per direction.',
    difficulty: 'easy',
    tips: ['Consider walkways between rows for larger gardens'],
    realWorldUse: 'Vegetable gardens, landscaping, flower beds'
  },
  {
    id: generatePuzzleId('gardening', 2),
    title: 'Seed Coverage',
    category: 'gardening',
    realWorldContext: 'Seeding a lawn or garden',
    problem: 'Grass seed covers 100 sq ft per pound. Area to seed is 500 sq ft. How many pounds?',
    formula: 'Pounds = Area ÷ Coverage per Pound',
    formulaExplanation: 'Divide area by coverage rate',
    solution: '5 pounds',
    steps: [
      'Divide: 500 ÷ 100 = 5'
    ],
    explanation: 'Seed coverage rates vary by seed type and desired density.',
    difficulty: 'easy',
    tips: ['Apply slightly more than minimum for better coverage'],
    realWorldUse: 'Lawn seeding, overseeding, pastures'
  },
  {
    id: generatePuzzleId('gardening', 3),
    title: 'Water Needs',
    category: 'gardening',
    realWorldContext: 'Irrigation planning',
    problem: 'Garden area is 50 sq ft. Plants need 1 inch of water per week. How many gallons? (1 inch over 1 sq ft = 0.623 gallons)',
    formula: 'Gallons = Area × 0.623',
    formulaExplanation: 'Multiply area by gallons per square foot per inch',
    solution: '31.15 gallons',
    steps: [
      'Multiply: 50 × 0.623 = 31.15'
    ],
    explanation: 'One inch of water over one square foot equals about 0.623 gallons.',
    difficulty: 'medium',
    tips: ['Adjust for climate, soil type, and plant needs'],
    realWorldUse: 'Irrigation, gardening, water conservation'
  },
  {
    id: generatePuzzleId('gardening', 4),
    title: 'Soil Volume',
    category: 'gardening',
    realWorldContext: 'Building raised beds',
    problem: 'Raised bed is 4ft × 8ft × 1ft deep. How many cubic feet of soil?',
    formula: 'Volume = Length × Width × Depth',
    formulaExplanation: 'Multiply all dimensions',
    solution: '32 cubic feet',
    steps: [
      'Multiply: 4 × 8 × 1 = 32'
    ],
    explanation: 'Calculate volume in cubic feet for soil purchases.',
    difficulty: 'easy',
    tips: ['Soil is often sold by cubic yard (27 cu ft = 1 cu yd)'],
    realWorldUse: 'Raised beds, container gardening, soil amendments'
  },
  {
    id: generatePuzzleId('gardening', 5),
    title: 'Compost Needs',
    category: 'gardening',
    realWorldContext: 'Soil preparation',
    problem: 'Garden bed 10ft × 15ft. Want 2 inches of compost. Cubic yards needed?',
    formula: 'Cubic Yards = (Area × Depth) ÷ 324',
    formulaExplanation: 'Area times depth in inches, divide by 324',
    solution: 'About 0.77 cubic yards',
    steps: [
      'Area: 10 × 15 = 150 sq ft',
      'Volume in cu ft: 150 × (2/12) = 25 cu ft',
      'Convert to cu yd: 25 ÷ 27 = 0.93 cu yd',
      'Divide by 324: 150 × 2 ÷ 324 = 0.93 cu yd'
    ],
    explanation: 'Cubic yards = (sq ft × depth in inches) ÷ 324.',
    difficulty: 'medium',
    tips: ['Order slightly more than calculated'],
    realWorldUse: 'Soil amendment, landscaping, gardening'
  },
  {
    id: generatePuzzleId('gardening', 6),
    title: 'Mulch Coverage',
    category: 'gardening',
    realWorldContext: 'Garden maintenance',
    problem: 'Flower bed 150 sq ft. Want 3 inches of mulch. How many cubic yards?',
    formula: 'Cubic Yards = (Area × Depth in Inches) ÷ 324',
    formulaExplanation: 'Standard formula for mulch coverage',
    solution: '1.16 cubic yards',
    steps: [
      'Calculate: 150 × 3 ÷ 324 = 1.39 cu ft',
      'Convert to cu yd: 1.39 ÷ 27 = 1.16 cu yd'
    ],
    explanation: 'Mulch is typically sold by cubic yard.',
    difficulty: 'medium',
    tips: ['Mulch decomposes over time - replenish annually'],
    realWorldUse: 'Weed control, moisture retention, aesthetics'
  },
  {
    id: generatePuzzleId('gardening', 7),
    title: 'Fertilizer Rate',
    category: 'gardening',
    realWorldContext: 'Garden feeding',
    problem: 'Fertilizer recommends 1 lb nitrogen per 1000 sq ft. Garden is 500 sq ft. How much fertilizer? (Fertilizer is 10% nitrogen)',
    formula: 'Fertilizer = (Recommended Rate × Area) ÷ Fertilizer %',
    formulaExplanation: 'Calculate actual fertilizer needed based on nutrient content',
    solution: '5 pounds',
    steps: [
      'Nitrogen needed: 1 × (500 ÷ 1000) = 0.5 lb',
      'Fertilizer amount: 0.5 ÷ 0.10 = 5 lb'
    ],
    explanation: 'Fertilizer labels show nutrient percentages - adjust rate accordingly.',
    difficulty: 'medium',
    tips: ['More is not better - over-fertilization can harm plants'],
    realWorldUse: 'Lawn care, gardening, agriculture'
  },
  {
    id: generatePuzzleId('gardening', 8),
    title: 'Row Spacing',
    category: 'gardening',
    realWorldContext: 'Vegetable garden planning',
    problem: 'Carrots need 3 inches between plants, 12 inches between rows. Row length 20ft. How many plants?',
    formula: 'Plants = (Row Length ÷ Plant Spacing) × Rows',
    formulaExplanation: 'Calculate per row, multiply by rows',
    solution: 'About 80 plants per 20ft row',
    steps: [
      'Plants per row: 20 ft = 240 in ÷ 3 in = 80 plants',
      'Per row, at 12" spacing'
    ],
    explanation: 'Account for both in-row spacing and between-row spacing.',
    difficulty: 'medium',
    tips: ['Consider wheel furrow spacing for mechanical cultivation'],
    realWorldUse: 'Vegetable farming, market gardens, row crops'
  },
  {
    id: generatePuzzleId('gardening', 9),
    title: 'Harvest Yield',
    category: 'gardening',
    realWorldContext: 'Planning garden size',
    problem: 'One tomato plant produces ~25 lbs of tomatoes. Family needs 50 lbs. How many plants?',
    formula: 'Plants = Needed Yield ÷ Yield per Plant',
    formulaExplanation: 'Divide desired yield by average per-plant yield',
    solution: '2 plants',
    steps: [
      'Divide: 50 ÷ 25 = 2'
    ],
    explanation: 'Average yield per plant helps estimate garden size needs.',
    difficulty: 'easy',
    tips: ['Yields vary by variety and growing conditions'],
    realWorldUse: 'Garden planning, food preservation, self-sufficiency'
  },
  {
    id: generatePuzzleId('gardening', 10),
    title: 'Rain Barrel Capacity',
    category: 'gardening',
    realWorldContext: 'Water harvesting',
    problem: 'Rain barrel is 55 gallons. Roof area collecting water is 200 sq ft. 1 inch of rain yields 0.623 gallons per sq ft. Full barrel from 1 inch rain?',
    formula: 'Rainwater = Area × 0.623',
    formulaExplanation: 'Calculate potential collection from roof area',
    solution: '124.6 gallons (more than barrel capacity)',
    steps: [
      'Potential: 200 × 0.623 = 124.6 gallons',
      'Barrel capacity: 55 gallons',
      'Barrel will overflow'
    ],
    explanation: 'Calculate potential collection vs. storage capacity.',
    difficulty: 'easy',
    tips: ['Use overflow to direct water away from foundation'],
    realWorldUse: 'Water conservation, gardening, sustainability'
  },

  // ============================================
  // HEALTH & FITNESS (15+ puzzles)
  // ============================================

  {
    id: generatePuzzleId('health', 1),
    title: 'BMI Calculation',
    category: 'health',
    realWorldContext: 'Health assessment or fitness tracking',
    problem: 'Person is 5 feet 10 inches tall, weighs 180 lbs. What is BMI? (Formula: 703 × weight lbs ÷ height in²)',
    formula: 'BMI = 703 × Weight ÷ (Height in Inches)²',
    formulaExplanation: 'Multiply weight by 703, divide by height squared',
    solution: '25.8 (Overweight category)',
    steps: [
      'Height in inches: 5×12 + 10 = 70 in',
      'Height squared: 70² = 4,900',
      'BMI: 703 × 180 ÷ 4900 = 25.8'
    ],
    explanation: 'BMI categories: Underweight <18.5, Normal 18.5-24.9, Overweight 25-29.9, Obese 30+.',
    difficulty: 'medium',
    tips: ['BMI is a screening tool, not diagnostic'],
    realWorldUse: 'Health screening, weight management, medical assessments'
  },
  {
    id: generatePuzzleId('health', 2),
    title: 'Calorie Burn',
    category: 'health',
    realWorldContext: 'Exercise tracking or weight loss planning',
    problem: 'Exercise burns 200 calories per hour. Workout is 1.5 hours. Total calories burned?',
    formula: 'Calories = Rate × Time',
    formulaExplanation: 'Multiply burn rate by duration',
    solution: '300 calories',
    steps: [
      'Multiply: 200 × 1.5 = 300'
    ],
    explanation: 'Total calorie burn equals rate multiplied by time.',
    difficulty: 'easy',
    tips: ['Actual burn varies by weight, intensity, and individual metabolism'],
    realWorldUse: 'Weight loss, fitness tracking, exercise planning'
  },
  {
    id: generatePuzzleId('health', 3),
    title: 'Daily Water Intake',
    category: 'health',
    realWorldContext: 'Hydration planning',
    problem: 'Body weight 160 lbs. Recommendation is 0.5 oz water per lb body weight. Daily water need?',
    formula: 'Water = Body Weight × 0.5',
    formulaExplanation: 'Multiply body weight by water requirement factor',
    solution: '80 ounces (about 10 cups)',
    steps: [
      'Multiply: 160 × 0.5 = 80 oz',
      'Convert to cups: 80 ÷ 8 = 10 cups'
    ],
    explanation: 'General guideline is half body weight in ounces of water daily.',
    difficulty: 'easy',
    tips: ['Increase for exercise, hot climate, or illness'],
    realWorldUse: 'Hydration, health, athletic performance'
  },
  {
    id: generatePuzzleId('health', 4),
    title: 'Medication Dosage',
    category: 'health',
    realWorldContext: 'Prescription or over-the-counter medication',
    problem: 'Dosage is 10mg per kg body weight. Patient weighs 80 kg. What is the dose?',
    formula: 'Dose = Dosage Rate × Body Weight',
    formulaExplanation: 'Multiply dose per kg by body weight in kg',
    solution: '800 mg',
    steps: [
      'Multiply: 10 × 80 = 800'
    ],
    explanation: 'Dosage is often calculated based on body weight.',
    difficulty: 'easy',
    tips: ['Always verify units - kg vs lbs'],
    realWorldUse: 'Prescriptions, veterinary medicine, nutrition supplements'
  },
  {
    id: generatePuzzleId('health', 5),
    title: 'Running Pace',
    category: 'health',
    realWorldContext: 'Training or race planning',
    problem: '5K race completed in 25 minutes. What is pace per mile? (5K = 3.1 miles)',
    formula: 'Pace = Time ÷ Distance',
    formulaExplanation: 'Divide race time by distance',
    solution: 'About 8:04 per mile',
    steps: [
      'Convert time to minutes: 25 min',
      'Pace: 25 ÷ 3.1 = 8.06 min/mile',
      '= 8 min + 0.06×60 sec = 8:04 per mile'
    ],
    explanation: 'Pace shows time taken per mile/kilometer.',
    difficulty: 'medium',
    tips: ['Pace is more useful than speed for runners'],
    realWorldUse: 'Running, training, race planning'
  },
  {
    id: generatePuzzleId('health', 6),
    title: 'Weight Loss Timeline',
    category: 'health',
    realWorldContext: 'Goal setting or fitness planning',
    problem: 'Current weight 200 lbs, goal 170 lbs. Losing 2 lbs per week. How many weeks?',
    formula: 'Weeks = Weight to Lose ÷ Weekly Loss',
    formulaExplanation: 'Divide total weight to lose by weekly rate',
    solution: '15 weeks',
    steps: [
      'Weight to lose: 200 - 170 = 30 lbs',
      'Weeks: 30 ÷ 2 = 15 weeks'
    ],
    explanation: 'Divide total goal by weekly rate to find time needed.',
    difficulty: 'easy',
    tips: ['Healthy weight loss is 1-2 lbs per week'],
    realWorldUse: 'Weight loss planning, fitness goals'
  },
  {
    id: generatePuzzleId('health', 7),
    title: 'Total Reps',
    category: 'health',
    realWorldContext: 'Workout tracking',
    problem: 'Exercise program has 3 sets of 10 reps each. Total reps?',
    formula: 'Total = Sets × Reps per Set',
    formulaExplanation: 'Multiply sets by reps per set',
    solution: '30 reps',
    steps: [
      'Multiply: 3 × 10 = 30'
    ],
    explanation: 'Total volume is sets times reps per set.',
    difficulty: 'easy',
    tips: ['Track volume for progressive overload'],
    realWorldUse: 'Strength training, workout tracking, fitness'
  },
  {
    id: generatePuzzleId('health', 8),
    title: 'Macro Grams',
    category: 'health',
    realWorldContext: 'Tracking macronutrients',
    problem: 'Daily calories 2000. Target: 40% carbs, 30% protein, 30% fat. Grams per macro? (Carbs/Protein = 4 cal/g, Fat = 9 cal/g)',
    formula: 'Grams = (Calories × %) ÷ Calories per Gram',
    formulaExplanation: 'Calculate calories from each macro, convert to grams',
    solution: 'Carbs: 200g, Protein: 150g, Fat: 67g',
    steps: [
      'Carbs: 2000 × 0.40 = 800 cal ÷ 4 = 200g',
      'Protein: 2000 × 0.30 = 600 cal ÷ 4 = 150g',
      'Fat: 2000 × 0.30 = 600 cal ÷ 9 = 66.7g ≈ 67g'
    ],
    explanation: 'Convert percentage of calories to grams using calorie per gram values.',
    difficulty: 'medium',
    tips: ['Protein = 4 cal/g, Carbs = 4 cal/g, Fat = 9 cal/g'],
    realWorldUse: 'Meal planning, bodybuilding, nutrition tracking'
  },
  {
    id: generatePuzzleId('health', 9),
    title: 'Protein Needs',
    category: 'health',
    realWorldContext: 'Nutrition planning',
    problem: 'Person weighs 160 lbs. Protein need is 0.8g per lb body weight. Daily protein?',
    formula: 'Protein = Body Weight × Grams per Pound',
    formulaExplanation: 'Multiply body weight by protein requirement',
    solution: '128 grams',
    steps: [
      'Multiply: 160 × 0.8 = 128'
    ],
    explanation: 'Protein requirements vary by activity level and goals.',
    difficulty: 'easy',
    tips: ['Athletes may need 0.6-0.9g per pound'],
    realWorldUse: 'Fitness, muscle building, nutrition'
  },
  {
    id: generatePuzzleId('health', 10),
    title: 'Water Intake Conversion',
    category: 'health',
    realWorldContext: 'Tracking water consumption',
    problem: 'Daily goal is 64 oz water. Water bottle holds 16 oz. How many bottles?',
    formula: 'Bottles = Goal ÷ Bottle Size',
    formulaExplanation: 'Divide goal by bottle capacity',
    solution: '4 bottles',
    steps: [
      'Divide: 64 ÷ 16 = 4'
    ],
    explanation: 'Simple division to track water intake.',
    difficulty: 'easy',
    tips: ['Use a marked bottle to track throughout day'],
    realWorldUse: 'Hydration, health tracking, fitness'
  },
  {
    id: generatePuzzleId('health', 11),
    title: 'Heart Rate Zone',
    category: 'health',
    realWorldContext: 'Cardio training',
    problem: 'Max heart rate estimated as 220 - age = 220 - 35 = 185. Target zone is 70-80% of max. Heart rate range?',
    formula: 'Zone = Max HR × Percentage',
    formulaExplanation: 'Multiply max HR by percentage range',
    solution: '130-148 bpm',
    steps: [
      '70%: 185 × 0.70 = 129.5 ≈ 130',
      '80%: 185 × 0.80 = 148',
      'Range: 130-148 bpm'
    ],
    explanation: 'Training zones target different percentages of maximum heart rate.',
    difficulty: 'easy',
    tips: ['Use heart rate monitor for accuracy'],
    realWorldUse: 'Cardio training, fitness, heart health'
  },
  {
    id: generatePuzzleId('health', 12),
    title: 'One Rep Max',
    category: 'health',
    realWorldContext: 'Strength training programming',
    problem: 'Lifted 225 lbs for 5 reps. Estimated 1RM using Epley formula: 1RM = Weight × (1 + Reps ÷ 30)',
    formula: '1RM = Weight × (1 + Reps ÷ 30)',
    formulaExplanation: 'Formula to estimate max lift from submaximal reps',
    solution: '262.5 lbs',
    steps: [
      'Calculate: 225 × (1 + 5 ÷ 30)',
      '= 225 × (1 + 0.167)',
      '= 225 × 1.167 = 262.5'
    ],
    explanation: '1RM estimates maximum weight for one repetition.',
    difficulty: 'medium',
    tips: ['More reps = less accurate estimate'],
    realWorldUse: 'Strength training, powerlifting, periodization'
  },
  {
    id: generatePuzzleId('health', 13),
    title: 'Resting Metabolic Rate',
    category: 'health',
    realWorldContext: 'Calorie needs calculation',
    problem: 'RMR estimation for women: 655 + (4.35 × weight lbs) + (4.7 × height in) - (4.7 × age). Woman: 150 lbs, 64 in, age 30. RMR?',
    formula: 'RMR = 655 + (4.35 × wt) + (4.7 × ht) - (4.7 × age)',
    formulaExplanation: 'Harris-Benedict formula for women',
    solution: 'Approximately 1,448 calories',
    steps: [
      'Calculate: 655 + (4.35 × 150) + (4.7 × 64) - (4.7 × 30)',
      '= 655 + 652.5 + 300.8 - 141',
      '= 1467.3'
    ],
    explanation: 'RMR is calories burned at complete rest.',
    difficulty: 'hard',
    tips: ['Multiply by activity factor (1.2-1.9) for total daily energy expenditure'],
    realWorldUse: 'Weight management, nutrition planning'
  },
  {
    id: generatePuzzleId('health', 14),
    title: 'Sleep Cycles',
    category: 'health',
    realWorldContext: 'Sleep optimization',
    problem: 'Average sleep cycle is 90 minutes. Want 8 hours sleep. How many full cycles?',
    formula: 'Cycles = Total Sleep Time ÷ Cycle Length',
    formulaExplanation: 'Divide total sleep time by cycle duration',
    solution: 'About 5.3 cycles (aim for 5 or 6)',
    steps: [
      'Convert 8 hours to minutes: 8 × 60 = 480 min',
      'Cycles: 480 ÷ 90 = 5.33',
      'Aim for 5 (7.5 hrs) or 6 (9 hrs) full cycles'
    ],
    explanation: 'Waking at end of a cycle prevents grogginess.',
    difficulty: 'easy',
    tips: ['Average person needs 5-6 cycles (7.5-9 hours)'],
    realWorldUse: 'Sleep hygiene, health, productivity'
  },
  {
    id: generatePuzzleId('health', 15),
    title: 'Step Conversion',
    category: 'health',
    realWorldContext: 'Fitness tracking',
    problem: 'Goal is 10,000 steps daily. Walking 1 mile ≈ 2,000 steps. Daily distance?',
    formula: 'Distance = Steps ÷ Steps per Mile',
    formulaExplanation: 'Divide steps by conversion factor',
    solution: '5 miles',
    steps: [
      'Divide: 10000 ÷ 2000 = 5'
    ],
    explanation: 'Convert step count to distance using average steps per mile.',
    difficulty: 'easy',
    tips: ['Steps per mile varies by height and stride length'],
    realWorldUse: 'Walking goals, fitness tracking, activity monitoring'
  },

  // ============================================
  // TIME & SCHEDULING (15+ puzzles)
  // ============================================

  {
    id: generatePuzzleId('time', 1),
    title: 'Weekly Hours',
    category: 'time',
    realWorldContext: 'Work scheduling or payroll',
    problem: 'Work schedule is 9am to 5pm with 1 hour unpaid lunch. Daily hours? Weekly hours?',
    formula: 'Daily = End - Start - Break',
    formulaExplanation: 'Subtract break from work duration',
    solution: '7 hours/day, 35 hours/week',
    steps: [
      'Daily: (5pm - 9am) - 1hr = 8 - 1 = 7 hours',
      'Weekly: 7 × 5 = 35 hours'
    ],
    explanation: 'Calculate work hours by subtracting break time.',
    difficulty: 'easy',
    tips: ['Unpaid vs. paid break matters for payroll'],
    realWorldUse: 'Payroll, scheduling, employment'
  },
  {
    id: generatePuzzleId('time', 2),
    title: 'Overtime Pay',
    category: 'time',
    realWorldContext: 'Payroll calculation or understanding wages',
    problem: 'Worked 45 hours. Regular 40 hours, overtime rate is 1.5× regular pay. Hourly rate $20. Total pay?',
    formula: 'Pay = (Regular Hours × Rate) + (Overtime Hours × Rate × 1.5)',
    formulaExplanation: 'Calculate regular pay plus overtime premium',
    solution: '$950',
    steps: [
      'Regular pay: 40 × 20 = 800',
      'Overtime hours: 45 - 40 = 5',
      'Overtime pay: 5 × 20 × 1.5 = 150',
      'Total: 800 + 150 = 950'
    ],
    explanation: 'Overtime typically pays 1.5× regular rate for hours over 40/week.',
    difficulty: 'medium',
    tips: ['Some states have daily overtime rules'],
    realWorldUse: 'Payroll, employment, wages'
  },
  {
    id: generatePuzzleId('time', 3),
    title: 'Project Timeline',
    category: 'time',
    realWorldContext: 'Project planning or task management',
    problem: '5 tasks, each 8 hours. Working 8 hours/day. How many days?',
    formula: 'Days = Total Hours ÷ Hours per Day',
    formulaExplanation: 'Divide total work by daily capacity',
    solution: '5 days',
    steps: [
      'Total hours: 5 × 8 = 40',
      'Days: 40 ÷ 8 = 5'
    ],
    explanation: 'Total project days equals total hours divided by daily work hours.',
    difficulty: 'easy',
    tips: ['Add buffer time for unexpected issues'],
    realWorldUse: 'Project management, planning, scheduling'
  },
  {
    id: generatePuzzleId('time', 4),
    title: 'Time Zone Conversion',
    category: 'time',
    realWorldContext: 'Scheduling meetings across time zones',
    problem: 'Meeting is 3pm EST. What time is this in PST (3 hours behind)?',
    formula: 'New Time = Original Time - Time Difference',
    formulaExplanation: 'Subtract time zone difference',
    solution: '12pm (noon) PST',
    steps: [
      'Subtract 3 hours: 3pm - 3 hours = 12pm'
    ],
    explanation: 'PST is 3 hours behind EST (4 hours behind EDT in summer).',
    difficulty: 'easy',
    tips: ['Use 24-hour clock to avoid confusion'],
    realWorldUse: 'International calls, travel, remote work'
  },
  {
    id: generatePuzzleId('time', 5),
    title: 'Patient Scheduling',
    category: 'time',
    realWorldContext: 'Medical or service appointments',
    problem: 'Need to see 12 patients in 8 hours. Time per patient?',
    formula: 'Time per Patient = Total Time ÷ Number of Patients',
    formulaExplanation: 'Divide available time by patients to see',
    solution: '40 minutes per patient',
    steps: [
      'Convert 8 hours to minutes: 8 × 60 = 480 min',
      'Divide: 480 ÷ 12 = 40 minutes'
    ],
    explanation: 'Calculate appointment duration based on patient load.',
    difficulty: 'easy',
    tips: ['Build in buffer time for running late'],
    realWorldUse: 'Healthcare, services, appointments'
  },
  {
    id: generatePuzzleId('time', 6),
    title: 'Work Time',
    category: 'time',
    realWorldContext: 'Shift scheduling',
    problem: '8 hour shift. Required 30 minute unpaid break. Actual work time?',
    formula: 'Work Time = Shift Length - Break Time',
    formulaExplanation: 'Subtract break from shift duration',
    solution: '7.5 hours',
    steps: [
      'Subtract: 8 - 0.5 = 7.5 hours'
    ],
    explanation: 'Break time reduces actual working hours.',
    difficulty: 'easy',
    tips: ['Some breaks are paid (rest breaks) vs. unpaid (meal breaks)'],
    realWorldUse: 'Scheduling, payroll, shift work'
  },
  {
    id: generatePuzzleId('time', 7),
    title: 'Deadline Calculation',
    category: 'time',
    realWorldContext: 'Project planning or due dates',
    problem: 'Project due in 30 days from today. If today is January 15, what is the due date?',
    formula: 'Due Date = Start Date + Days',
    formulaExplanation: 'Add days to starting date',
    solution: 'February 14',
    steps: [
      'January has 31 days',
      'Days remaining in January: 31 - 15 = 16',
      'Need 30 days total: 30 - 16 = 14 days into February',
      'Due date: February 14'
    ],
    explanation: 'Count forward from start date.',
    difficulty: 'medium',
    tips: ['Account for weekends if not counting calendar days'],
    realWorldUse: 'Project management, contracts, deadlines'
  },
  {
    id: generatePuzzleId('time', 8),
    title: 'Travel Time',
    category: 'time',
    realWorldContext: 'Trip planning or commute',
    problem: 'Trip distance 400 miles. Driving at 60 mph. Time needed?',
    formula: 'Time = Distance ÷ Speed',
    formulaExplanation: 'Divide distance by speed',
    solution: '6 hours 40 minutes',
    steps: [
      'Divide: 400 ÷ 60 = 6.67 hours',
      'Convert: 0.67 × 60 = 40 minutes',
      'Total: 6 hours 40 minutes'
    ],
    explanation: 'Travel time equals distance divided by speed.',
    difficulty: 'easy',
    tips: ['Add time for breaks, traffic, and rest stops'],
    realWorldUse: 'Road trips, commute planning, logistics'
  },
  {
    id: generatePuzzleId('time', 9),
    title: 'Hotel Budget',
    category: 'time',
    realWorldContext: 'Trip planning',
    problem: '5-night trip. Total hotel budget $800. Maximum per night?',
    formula: 'Per Night = Total Budget ÷ Number of Nights',
    formulaExplanation: 'Divide budget by nights',
    solution: '$160 per night',
    steps: [
      'Divide: 800 ÷ 5 = 160'
    ],
    explanation: 'Calculate nightly budget from total trip budget.',
    difficulty: 'easy',
    tips: ['Include taxes and fees in calculations'],
    realWorldUse: 'Travel planning, vacation budgeting'
  },
  {
    id: generatePuzzleId('time', 10),
    title: 'Currency Conversion',
    category: 'time',
    realWorldContext: 'International travel or shopping',
    problem: 'Convert $100 USD to Euros at exchange rate 1 USD = 0.92 EUR.',
    formula: 'Euros = Dollars × Exchange Rate',
    formulaExplanation: 'Multiply by exchange rate',
    solution: '92 Euros',
    steps: [
      'Multiply: 100 × 0.92 = 92'
    ],
    explanation: 'Exchange rate determines conversion between currencies.',
    difficulty: 'easy',
    tips: ['Rates fluctuate daily - check current rate'],
    realWorldUse: 'Travel, international purchases, finance'
  },
  {
    id: generatePuzzleId('time', 11),
    title: 'Meeting Duration',
    category: 'time',
    realWorldContext: 'Calendar management',
    problem: 'Back-to-back meetings: 9am-10am, 10:30am-11:30am, 12pm-1pm. Total meeting time?',
    formula: 'Total = Sum of Individual Meeting Durations',
    formulaExplanation: 'Add up each meeting duration',
    solution: '3 hours',
    steps: [
      'Meeting 1: 1 hour',
      'Meeting 2: 1 hour',
      'Meeting 3: 1 hour',
      'Total: 3 hours'
    ],
    explanation: 'Sum durations of all meetings.',
    difficulty: 'easy',
    tips: ['Account for gaps between meetings'],
    realWorldUse: 'Schedule management, productivity'
  },
  {
    id: generatePuzzleId('time', 12),
    title: 'Flight Duration',
    category: 'time',
    realWorldContext: 'Travel planning',
    problem: 'Flight departs 8pm local time. Flight time is 6 hours. Arrival time in destination time zone (3 hours ahead)?',
    formula: 'Arrival = Departure + Flight Time ± Time Zone Difference',
    formulaExplanation: 'Add flight time, adjust for time zone',
    solution: '5am next day (8pm + 6hr = 2am, +3hr zone = 5am)',
    steps: [
      'Add flight time: 8pm + 6hr = 2am next day',
      'Time zone difference: +3 hours',
      'Arrival: 2am + 3hr = 5am'
    ],
    explanation: 'Arrival time accounts for flight duration and time zone change.',
    difficulty: 'hard',
    tips: ['Date changes when crossing midnight'],
    realWorldUse: 'Flight planning, travel, business trips'
  },
  {
    id: generatePuzzleId('time', 13),
    title: 'Time in Minutes',
    category: 'time',
    realWorldContext: 'Time tracking or billing',
    problem: 'Work task took 1 hour and 15 minutes. How many minutes?',
    formula: 'Minutes = Hours × 60 + Remaining Minutes',
    formulaExplanation: 'Convert hours to minutes, add remaining',
    solution: '75 minutes',
    steps: [
      'Convert: 1 × 60 = 60',
      'Add: 60 + 15 = 75'
    ],
    explanation: 'Convert time to minutes for precise tracking.',
    difficulty: 'easy',
    tips: ['Useful for billing and productivity tracking'],
    realWorldUse: 'Time tracking, billing, project management'
  },
  {
    id: generatePuzzleId('time', 14),
    title: 'Delivery Estimate',
    category: 'time',
    realWorldContext: 'Shipping or logistics',
    problem: 'Order placed Monday. Processing 2 days, shipping 3 days. Delivery day?',
    formula: 'Delivery = Order Day + Processing + Shipping',
    formulaExplanation: 'Add days to order date',
    solution: 'Friday',
    steps: [
      'Monday + 2 days = Wednesday (processing)',
      'Wednesday + 3 days = Saturday? Wait, shipping days typically exclude weekend',
      'More realistic: Thursday or Friday'
    ],
    explanation: 'Calculate business days for delivery estimates.',
    difficulty: 'medium',
    tips: ['Shipping often excludes weekends and holidays'],
    realWorldUse: 'Shipping, e-commerce, logistics'
  },
  {
    id: generatePuzzleId('time', 15),
    title: 'Age Calculation',
    category: 'time',
    realWorldContext: 'Age verification or milestone planning',
    problem: 'Born March 15, 2000. Today is January 10, 2024. Current age?',
    formula: 'Age = Current Year - Birth Year - (if birthday not yet reached)',
    formulaExplanation: 'Subtract birth year, adjust if birthday hasnt occurred',
    solution: '23 years (turning 24 in March 2024)',
    steps: [
      '2024 - 2000 = 24',
      'Birthday (March 15) has not occurred yet in 2024',
      'Age: 23 years'
    ],
    explanation: 'Age increases on birthday, not January 1.',
    difficulty: 'medium',
    tips: ['Full years = current year minus birth year, minus 1 if before birthday'],
    realWorldUse: 'Age verification, milestone planning, legal requirements'
  },

  // ============================================
  // STATISTICS (15+ puzzles)
  // ============================================

  {
    id: generatePuzzleId('statistics', 1),
    title: 'Mean Calculation',
    category: 'statistics',
    realWorldContext: 'Data analysis or grading',
    problem: 'Test scores: 85, 92, 78, 88, 95. What is the average?',
    formula: 'Mean = Sum of Values ÷ Count',
    formulaExplanation: 'Add all values, divide by number of values',
    solution: '87.6',
    steps: [
      'Sum: 85 + 92 + 78 + 88 + 95 = 438',
      'Count: 5',
      'Mean: 438 ÷ 5 = 87.6'
    ],
    explanation: 'Mean is the arithmetic average - sum divided by count.',
    difficulty: 'easy',
    tips: ['Mean is sensitive to extreme values'],
    realWorldUse: 'Grades, performance metrics, data analysis'
  },
  {
    id: generatePuzzleId('statistics', 2),
    title: 'Median Calculation',
    category: 'statistics',
    realWorldContext: 'Understanding typical values',
    problem: 'Data set: 10, 20, 15, 30, 25, 5, 40. What is the median?',
    formula: 'Median = Middle Value (after sorting)',
    formulaExplanation: 'Sort data, find middle value',
    solution: '20',
    steps: [
      'Sort: 5, 10, 15, 20, 25, 30, 40',
      'Middle position: (7 + 1) ÷ 2 = 4th value',
      'Median: 20'
    ],
    explanation: 'Median is the middle value when data is sorted.',
    difficulty: 'easy',
    tips: ['For even count, median is average of two middle values'],
    realWorldUse: 'Income analysis, real estate, data analysis'
  },
  {
    id: generatePuzzleId('statistics', 3),
    title: 'Percentage Increase',
    category: 'statistics',
    realWorldContext: 'Sales growth or performance metrics',
    problem: 'Sales were $1,000 last month, now $1,350 this month. What is percentage increase?',
    formula: '% Change = (New - Old) ÷ Old × 100',
    formulaExplanation: 'Find difference, divide by original, multiply by 100',
    solution: '35%',
    steps: [
      'Increase: 1350 - 1000 = 350',
      'Percentage: 350 ÷ 1000 = 0.35 = 35%'
    ],
    explanation: 'Percentage change measures relative growth.',
    difficulty: 'easy',
    tips: ['Always divide by ORIGINAL value'],
    realWorldUse: 'Business metrics, finance, performance tracking'
  },
  {
    id: generatePuzzleId('statistics', 4),
    title: 'Probability of Aces',
    category: 'statistics',
    realWorldContext: 'Card games or probability understanding',
    problem: 'Drawing one card from standard deck of 52 cards. Probability of drawing an Ace?',
    formula: 'P(Ace) = Number of Aces ÷ Total Cards',
    formulaExplanation: 'Count favorable outcomes divided by total outcomes',
    solution: '4/52 = 1/13 ≈ 7.69%',
    steps: [
      'Aces in deck: 4',
      'Total cards: 52',
      'Probability: 4 ÷ 52 = 1/13 ≈ 0.0769'
    ],
    explanation: 'Probability of an event equals favorable outcomes divided by total possible outcomes.',
    difficulty: 'easy',
    tips: ['Simplify fractions: 4/52 = 1/13'],
    realWorldUse: 'Gambling, games, risk assessment'
  },
  {
    id: generatePuzzleId('statistics', 5),
    title: 'Survey Percentage',
    category: 'statistics',
    realWorldContext: 'Survey analysis or polling',
    problem: '1000 people surveyed. 620 said they like a product. What percentage?',
    formula: 'Percentage = (Response ÷ Total) × 100',
    formulaExplanation: 'Divide response by total, multiply by 100',
    solution: '62%',
    steps: [
      'Divide: 620 ÷ 1000 = 0.62',
      'Multiply: 0.62 × 100 = 62%'
    ],
    explanation: 'Convert survey counts to percentages for easier interpretation.',
    difficulty: 'easy',
    tips: ['Consider margin of error for survey results'],
    realWorldUse: 'Market research, polling, data analysis'
  },
  {
    id: generatePuzzleId('statistics', 6),
    title: 'Growth Rate',
    category: 'statistics',
    realWorldContext: 'Business growth or population analysis',
    problem: 'Started with 100 customers, now have 285 customers. What is the growth rate?',
    formula: 'Growth Rate = (Current ÷ Original) × 100',
    formulaExplanation: 'Divide current by original, express as percentage',
    solution: '185% growth',
    steps: [
      'Growth: 285 - 100 = 185',
      'Rate: 185 ÷ 100 = 1.85 = 185%'
    ],
    explanation: 'Growth rate shows how much something increased relative to starting point.',
    difficulty: 'easy',
    tips: ['185% growth means nearly tripling'],
    realWorldUse: 'Business metrics, startups, population studies'
  },
  {
    id: generatePuzzleId('statistics', 7),
    title: 'Percentage Difference',
    category: 'statistics',
    realWorldContext: 'Comparing prices or values',
    problem: 'Product A costs $25, Product B costs $32. What is the percentage difference?',
    formula: '% Difference = |A - B| ÷ Average × 100',
    formulaExplanation: 'Absolute difference divided by average',
    solution: 'About 24.6%',
    steps: [
      'Difference: |32 - 25| = 7',
      'Average: (32 + 25) ÷ 2 = 28.5',
      'Percentage: 7 ÷ 28.5 = 0.246 = 24.6%'
    ],
    explanation: 'Percentage difference compares two values relative to their average.',
    difficulty: 'medium',
    tips: ['Dont divide by one of the values - use the average'],
    realWorldUse: 'Price comparison, statistics, analysis'
  },
  {
    id: generatePuzzleId('statistics', 8),
    title: 'Mode',
    category: 'statistics',
    realWorldContext: 'Data analysis or finding popular values',
    problem: 'Data: 3, 5, 5, 7, 8, 8, 8, 10. What is the mode?',
    formula: 'Mode = Most Frequently Occurring Value',
    formulaExplanation: 'Count occurrences of each value',
    solution: '8',
    steps: [
      'Count: 3(1), 5(2), 7(1), 8(3), 10(1)',
      'Most frequent: 8 appears 3 times'
    ],
    explanation: 'Mode is the value that appears most often.',
    difficulty: 'easy',
    tips: ['Data can have multiple modes (bimodal)'],
    realWorldUse: 'Surveys, quality control, data analysis'
  },
  {
    id: generatePuzzleId('statistics', 9),
    title: 'Range',
    category: 'statistics',
    realWorldContext: 'Understanding data spread',
    problem: 'Data: 15, 22, 18, 35, 29, 12. What is the range?',
    formula: 'Range = Maximum - Minimum',
    formulaExplanation: 'Subtract smallest from largest value',
    solution: '23',
    steps: [
      'Maximum: 35',
      'Minimum: 12',
      'Range: 35 - 12 = 23'
    ],
    explanation: 'Range shows the spread of data from lowest to highest.',
    difficulty: 'easy',
    tips: ['Range is quick measure of variability but sensitive to outliers'],
    realWorldUse: 'Data analysis, quality control, statistics'
  },
  {
    id: generatePuzzleId('statistics', 10),
    title: 'Simple Probability',
    category: 'statistics',
    realWorldContext: 'Games or risk assessment',
    problem: 'Rolling a standard die. Probability of rolling a number greater than 4?',
    formula: 'P(Event) = Favorable Outcomes ÷ Total Outcomes',
    formulaExplanation: 'Count how many outcomes satisfy condition',
    solution: '2/6 = 1/3 ≈ 33.3%',
    steps: [
      'Favorable: 5, 6 (2 outcomes)',
      'Total: 6',
      'Probability: 2/6 = 1/3'
    ],
    explanation: 'Count outcomes that match the condition, divide by total possible outcomes.',
    difficulty: 'easy',
    tips: ['Outcomes must be equally likely'],
    realWorldUse: 'Games, gambling, risk analysis'
  },
  {
    id: generatePuzzleId('statistics', 11),
    title: 'Compound Probability',
    category: 'statistics',
    realWorldContext: 'Understanding independent events',
    problem: 'Coin flip twice. Probability of two heads? (Assume fair coin)',
    formula: 'P(A and B) = P(A) × P(B)',
    formulaExplanation: 'Multiply probabilities of independent events',
    solution: '25% or 1/4',
    steps: [
      'P(heads) = 1/2 each flip',
      'P(two heads) = 1/2 × 1/2 = 1/4 = 25%'
    ],
    explanation: 'For independent events, multiply probabilities for both occurring.',
    difficulty: 'medium',
    tips: ['Events must be independent for this rule'],
    realWorldUse: 'Genetics, quality control, weather'
  },
  {
    id: generatePuzzleId('statistics', 12),
    title: 'Weighted Mean',
    category: 'statistics',
    realWorldContext: 'Grades or performance metrics',
    problem: 'Quiz: 80% (weight 20%), Midterm: 75% (weight 30%), Final: 85% (weight 50%). Final grade?',
    formula: 'Weighted Mean = Σ(Grade × Weight)',
    formulaExplanation: 'Multiply each grade by its weight, sum',
    solution: '81%',
    steps: [
      'Quiz: 80 × 0.20 = 16',
      'Midterm: 75 × 0.30 = 22.5',
      'Final: 85 × 0.50 = 42.5',
      'Total: 16 + 22.5 + 42.5 = 81'
    ],
    explanation: 'Weighted mean gives more importance to certain assessments.',
    difficulty: 'medium',
    tips: ['Weights should sum to 1.0 or 100%'],
    realWorldUse: 'Grading, performance reviews, statistics'
  },
  {
    id: generatePuzzleId('statistics', 13),
    title: 'Z-Score',
    category: 'statistics',
    realWorldContext: 'Standardized testing or data comparison',
    problem: 'Mean score 70, standard deviation 10. Student scored 85. Z-score?',
    formula: 'Z = (X - μ) ÷ σ',
    formulaExplanation: 'Subtract mean, divide by standard deviation',
    solution: '1.5',
    steps: [
      'Calculate: (85 - 70) ÷ 10 = 15 ÷ 10 = 1.5'
    ],
    explanation: 'Z-score shows how many standard deviations a value is from the mean.',
    difficulty: 'medium',
    tips: ['Z=0 is at mean', 'Z=±1 is one standard deviation'],
    realWorldUse: 'Test scores, quality control, research'
  },
  {
    id: generatePuzzleId('statistics', 14),
    title: 'Percentile',
    category: 'statistics',
    realWorldContext: 'Understanding rankings or test results',
    problem: 'Test scores: 55, 62, 68, 72, 75, 78, 82, 85, 90, 95. Score 82 is at what percentile?',
    formula: 'Percentile = (Values Below ÷ Total Values) × 100',
    formulaExplanation: 'Count values below the score, divide by total',
    solution: '70th percentile',
    steps: [
      'Values below 82: 55, 62, 68, 72, 75, 78 = 6 values',
      'Percentile: (6 ÷ 9) × 100 = 66.7% - usually round up to 70th'
    ],
    explanation: 'Percentile shows what percentage of values are below a given score.',
    difficulty: 'medium',
    tips: ['Different methods for percentile calculation exist'],
    realWorldUse: 'Test scores, growth charts, statistics'
  },
  {
    id: generatePuzzleId('statistics', 15),
    title: 'Margin of Error',
    category: 'statistics',
    realWorldContext: 'Survey results or polling',
    problem: 'Survey of 1000 people, 52% support candidate. Margin of error at 95% confidence is ±3%. Range of true support?',
    formula: 'Range = Estimate ± Margin of Error',
    formulaExplanation: 'Add and subtract margin of error',
    solution: '49% to 55%',
    steps: [
      'Lower bound: 52% - 3% = 49%',
      'Upper bound: 52% + 3% = 55%',
      'Range: 49% to 55%'
    ],
    explanation: 'Margin of error shows the range within which the true value likely falls.',
    difficulty: 'easy',
    tips: ['Larger sample size = smaller margin of error'],
    realWorldUse: 'Polling, research, quality control'
  },

  // ============================================
  // ADDITIONAL PUZZLES (reaching 200+)
  // ============================================

  {
    id: generatePuzzleId('math', 53),
    title: 'Square Root',
    category: 'math',
    realWorldContext: 'Solving equations or finding dimensions',
    problem: 'What is √144?',
    formula: '√x = y where y² = x',
    formulaExplanation: 'Find the number that when squared equals x',
    solution: '12',
    steps: [
      '12 × 12 = 144'
    ],
    explanation: 'Square root is the inverse of squaring a number.',
    difficulty: 'easy',
    tips: ['Know perfect squares up to 20²'],
    realWorldUse: 'Geometry, algebra, construction'
  },
  {
    id: generatePuzzleId('math', 54),
    title: 'Absolute Value',
    category: 'math',
    realWorldContext: 'Distance or magnitude calculations',
    problem: 'What is |-15| + |8|?',
    formula: '|x| = x if x ≥ 0, or -x if x < 0',
    formulaExplanation: 'Absolute value removes negative sign',
    solution: '23',
    steps: [
      '|-15| = 15',
      '|8| = 8',
      '15 + 8 = 23'
    ],
    explanation: 'Absolute value is always non-negative.',
    difficulty: 'easy',
    tips: ['Think of absolute value as distance from zero'],
    realWorldUse: 'Distance, temperature, error margins'
  },
  {
    id: generatePuzzleId('math', 55),
    title: 'LCM Calculation',
    category: 'math',
    realWorldContext: 'Finding common denominators or scheduling',
    problem: 'LCM of 6 and 8?',
    formula: 'LCM = |a × b| ÷ GCD(a, b)',
    formulaExplanation: 'Product divided by GCD',
    solution: '24',
    steps: [
      'GCD of 6 and 8 = 2',
      'LCM = (6 × 8) ÷ 2 = 48 ÷ 2 = 24'
    ],
    explanation: 'LCM is smallest number divisible by both numbers.',
    difficulty: 'medium',
    tips: ['List multiples for small numbers'],
    realWorldUse: 'Adding fractions, scheduling'
  },
  {
    id: generatePuzzleId('math', 56),
    title: 'Prime Factorization',
    category: 'math',
    realWorldContext: 'Simplifying or number theory',
    problem: 'Find prime factorization of 60.',
    formula: 'Divide by primes until only primes remain',
    formulaExplanation: 'Break down into prime factors',
    solution: '2² × 3 × 5',
    steps: [
      '60 ÷ 2 = 30',
      '30 ÷ 2 = 15',
      '15 ÷ 3 = 5',
      '5 is prime',
      'Factors: 2 × 2 × 3 × 5 = 2² × 3 × 5'
    ],
    explanation: 'Prime factorization breaks a number into prime factors.',
    difficulty: 'medium',
    tips: ['Always start with smallest prime (2)'],
    realWorldUse: 'Simplifying fractions, cryptography'
  },
  {
    id: generatePuzzleId('math', 57),
    title: 'Mixed Number Division',
    category: 'math',
    realWorldContext: 'Recipe adjustments or measurements',
    problem: 'What is 2½ ÷ ½?',
    formula: 'Convert to improper fractions, then divide',
    formulaExplanation: 'Multiply by reciprocal of divisor',
    solution: '5',
    steps: [
      'Convert 2½ to fraction: 5/2',
      'Divide by 1/2: (5/2) ÷ (1/2) = (5/2) × (2/1) = 5'
    ],
    explanation: 'Dividing by a fraction equals multiplying by its reciprocal.',
    difficulty: 'medium',
    tips: ['Converting to improper fractions first helps'],
    realWorldUse: 'Cooking, construction, measurements'
  },
  {
    id: generatePuzzleId('physics', 26),
    title: 'Power from Work',
    category: 'physics',
    realWorldContext: 'Understanding energy consumption',
    problem: '100 J of work done in 5 seconds. Power output?',
    formula: 'P = W ÷ t',
    formulaExplanation: 'Work divided by time',
    solution: '20 Watts',
    steps: [
      'Divide: 100 ÷ 5 = 20 W'
    ],
    explanation: 'Power measures rate of energy transfer.',
    difficulty: 'easy',
    tips: ['1 Watt = 1 Joule/second'],
    realWorldUse: 'Electrical appliances, motors, fitness'
  },
  {
    id: generatePuzzleId('physics', 27),
    title: 'Mechanical Advantage',
    category: 'physics',
    realWorldContext: 'Understanding simple machines',
    problem: 'Machine multiplies force by 4. Input force 50N. Output force?',
    formula: 'Output Force = Input Force × MA',
    formulaExplanation: 'Mechanical advantage multiplies input force',
    solution: '200 N',
    steps: [
      'Multiply: 50 × 4 = 200'
    ],
    explanation: 'Simple machines trade distance for force.',
    difficulty: 'easy',
    tips: ['You cannot get more work out than you put in'],
    realWorldUse: 'Pulleys, levers, ramps'
  },
  {
    id: generatePuzzleId('physics', 28),
    title: 'Wavelength',
    category: 'physics',
    realWorldContext: 'Light or sound waves',
    problem: 'Wave frequency 1000 Hz, speed 340 m/s. Wavelength?',
    formula: 'λ = v ÷ f',
    formulaExplanation: 'Speed divided by frequency',
    solution: '0.34 meters',
    steps: [
      'Divide: 340 ÷ 1000 = 0.34 m'
    ],
    explanation: 'Wavelength is distance between wave peaks.',
    difficulty: 'easy',
    tips: ['Higher frequency = shorter wavelength'],
    realWorldUse: 'Sound engineering, optics, communications'
  },
  {
    id: generatePuzzleId('chemistry', 16),
    title: 'Moles to Atoms',
    category: 'chemistry',
    realWorldContext: 'Chemistry calculations',
    problem: 'How many atoms in 2 moles of carbon? (Avogadro number = 6.022 × 10²³)',
    formula: 'Atoms = Moles × Avogadro Number',
    formulaExplanation: 'Multiply moles by atoms per mole',
    solution: '1.204 × 10²⁴ atoms',
    steps: [
      'Calculate: 2 × 6.022 × 10²³ = 1.2044 × 10²⁴'
    ],
    explanation: 'Avogadro number gives atoms per mole.',
    difficulty: 'medium',
    tips: ['Remember: 1 mole = 6.022 × 10²³ particles'],
    realWorldUse: 'Laboratory work, stoichiometry'
  },
  {
    id: generatePuzzleId('chemistry', 17),
    title: 'Solution Stoichiometry',
    category: 'chemistry',
    realWorldContext: 'Chemical reactions in solution',
    problem: 'HCl + NaOH → NaCl + H₂O. If 0.5 mol HCl reacts, how much NaOH needed?',
    formula: 'Mole ratio from balanced equation',
    formulaExplanation: '1:1 ratio for this reaction',
    solution: '0.5 mol NaOH',
    steps: [
      'Balanced: 1 HCl + 1 NaOH → products',
      '1:1 ratio',
      'Need 0.5 mol NaOH for 0.5 mol HCl'
    ],
    explanation: 'Stoichiometry uses balanced equation ratios.',
    difficulty: 'medium',
    tips: ['Always balance the equation first'],
    realWorldUse: 'Titration, synthesis, analysis'
  },
  {
    id: generatePuzzleId('finance', 21),
    title: 'Car Loan Interest',
    category: 'finance',
    realWorldContext: 'Auto financing',
    problem: '$25,000 car loan at 6% APR for 5 years. Monthly interest first month?',
    formula: 'Monthly Interest = Principal × Monthly Rate',
    formulaExplanation: 'Calculate interest on outstanding balance',
    solution: 'About $125',
    steps: [
      'Monthly rate: 6% ÷ 12 = 0.5% = 0.005',
      'Interest: 25000 × 0.005 = $125'
    ],
    explanation: 'First month interest on full principal.',
    difficulty: 'medium',
    tips: ['Interest decreases as principal is paid down'],
    realWorldUse: 'Auto loans, understanding interest'
  },
  {
    id: generatePuzzleId('finance', 22),
    title: 'Credit Card Minimum Payment',
    category: 'finance',
    realWorldContext: 'Debt management',
    problem: 'Balance $2,000. Minimum payment is 2% of balance or $25, whichever is greater. Minimum payment?',
    formula: 'Payment = max(2% of Balance, $25)',
    formulaExplanation: 'Take the greater of the two amounts',
    solution: '$40 (2% of 2000 = $40, greater than $25)',
    steps: [
      'Calculate 2%: 2000 × 0.02 = $40',
      'Compare to $25 minimum',
      'Maximum is $40'
    ],
    explanation: 'Minimum payment protects lender and borrower.',
    difficulty: 'easy',
    tips: ['Paying only minimum extends debt significantly'],
    realWorldUse: 'Credit cards, debt management'
  },
  {
    id: generatePuzzleId('cooking', 16),
    title: 'Dough Hydration',
    category: 'cooking',
    realWorldContext: 'Bread baking',
    problem: 'Recipe: 500g flour, 350g water. What is hydration percentage?',
    formula: 'Hydration = (Water ÷ Flour) × 100',
    formulaExplanation: 'Water as percentage of flour weight',
    solution: '70%',
    steps: [
      'Divide: 350 ÷ 500 = 0.70',
      'Convert: 70%'
    ],
    explanation: 'Hydration affects crumb structure and handling.',
    difficulty: 'easy',
    tips: ['Higher hydration = more open crumb'],
    realWorldUse: 'Bread baking, artisan baking'
  },
  {
    id: generatePuzzleId('cooking', 17),
    title: 'Volume to Weight',
    category: 'cooking',
    realWorldContext: 'Ingredient substitutions',
    problem: 'Recipe needs 1 cup flour. How many grams? (1 cup flour ≈ 120g)',
    formula: 'Weight = Volume × Weight per Cup',
    formulaExplanation: 'Convert volume to weight',
    solution: '120 grams',
    steps: [
      'Multiply: 1 × 120 = 120g'
    ],
    explanation: 'Different ingredients have different weights per cup.',
    difficulty: 'easy',
    tips: ['Flour varies: 120g AP, 130g bread, 100g cake'],
    realWorldUse: 'Baking, metric conversion'
  },
  {
    id: generatePuzzleId('home', 16),
    title: 'Deck Load Capacity',
    category: 'home',
    realWorldContext: 'Construction and safety',
    problem: 'Deck joists 16" on center. Live load rating 40 psf. What weight per square foot?',
    formula: 'Load per Sq Ft = Rating (psf)',
    formulaExplanation: 'PSF means pounds per square foot',
    solution: '40 pounds per square foot',
    steps: [
      'PSF = pounds per square foot',
      'Rating already gives the answer: 40 psf = 40 lb/ft²'
    ],
    explanation: 'PSF measures load capacity.',
    difficulty: 'easy',
    tips: ['Residential decks typically need 40 psf live load'],
    realWorldUse: 'Construction, renovation, safety'
  },
  {
    id: generatePuzzleId('home', 17),
    title: 'Circuit Breaker Size',
    category: 'home',
    realWorldContext: 'Electrical work',
    problem: 'Circuit with 1200W lights and 1500W outlet. 80% rule for continuous load. Breaker size?',
    formula: 'Amps = Watts ÷ Volts, then 80% for continuous',
    formulaExplanation: 'Calculate load, apply 80% rule',
    solution: '30 amp breaker (load = 2700W ÷ 120V = 22.5A, 80% = 28.125A)',
    steps: [
      'Total watts: 1200 + 1500 = 2700W',
      'Amps: 2700 ÷ 120 = 22.5A',
      'Continuous 80%: 22.5 ÷ 0.80 = 28.125A',
      'Standard breaker: 30A'
    ],
    explanation: 'Continuous loads require 80% derating.',
    difficulty: 'hard',
    tips: ['Standard breaker sizes: 15, 20, 30, 40, 50A'],
    realWorldUse: 'Electrical, DIY, safety'
  },
  {
    id: generatePuzzleId('gardening', 11),
    title: 'Compost Temperature',
    category: 'gardening',
    realWorldContext: 'Hot composting',
    problem: 'Compost pile needs 130-150°F for proper decomposition. Current temp 140°F. Within range?',
    formula: 'Check if Temperature within Range',
    formulaExplanation: 'Compare to target range',
    solution: 'Yes, 140°F is within optimal range',
    steps: [
      'Range: 130-150°F',
      'Current: 140°F',
      '140 ≥ 130 AND 140 ≤ 150 = Yes'
    ],
    explanation: 'Hot composting requires specific temperature range.',
    difficulty: 'easy',
    tips: ['Turn pile if too hot or cold'],
    realWorldUse: 'Composting, gardening, sustainability'
  },
  {
    id: generatePuzzleId('gardening', 12),
    title: 'Planting Density',
    category: 'gardening',
    realWorldContext: 'Garden planning',
    problem: 'Raised bed 4×8 ft. Peppers need 18" spacing. How many plants?',
    formula: 'Plants = (Length ÷ Spacing) × (Width ÷ Spacing)',
    formulaExplanation: 'Calculate in both directions',
    solution: '6-8 plants (at 18" spacing)',
    steps: [
      'Spacing: 18" = 1.5 ft',
      'Length: 8 ÷ 1.5 = 5.33, use 5',
      'Width: 4 ÷ 1.5 = 2.66, use 2',
      'Total: 5 × 2 = 10, reduced for edge spacing = 6-8'
    ],
    explanation: 'Account for edge spacing in raised beds.',
    difficulty: 'medium',
    tips: ['Reduce plant count by 20-25% for edge effects'],
    realWorldUse: 'Vegetable gardening, landscaping'
  },
  {
    id: generatePuzzleId('health', 16),
    title: 'Target Heart Rate',
    category: 'health',
    realWorldContext: 'Exercise intensity',
    problem: 'Age 45. Target heart rate zone 60-70% of max. Max HR = 220 - 45 = 175. Zone range?',
    formula: 'HR = MaxHR × Percentage',
    formulaExplanation: 'Calculate both percentages',
    solution: '105-123 bpm',
    steps: [
      '60%: 175 × 0.60 = 105',
      '70%: 175 × 0.70 = 122.5 ≈ 123',
      'Range: 105-123 bpm'
    ],
    explanation: 'Target zones guide exercise intensity.',
    difficulty: 'easy',
    tips: ['Check pulse during exercise'],
    realWorldUse: 'Cardio, fitness, health'
  },
  {
    id: generatePuzzleId('health', 17),
    title: 'BMR Calculation',
    category: 'health',
    realWorldContext: 'Calorie needs',
    problem: 'BMR formula: Men = 88.362 + (13.397 × kg) + (4.799 × cm) - (5.677 × age). Man: 80kg, 180cm, age 30. BMR?',
    formula: 'BMR = 88.362 + (13.397 × kg) + (4.799 × cm) - (5.677 × age)',
    formulaExplanation: 'Harris-Benedict BMR formula',
    solution: 'Approximately 1,830 calories/day',
    steps: [
      '88.362 + (13.397 × 80) + (4.799 × 180) - (5.677 × 30)',
      '= 88.362 + 1071.76 + 863.82 - 170.31',
      '= 1853.632 ≈ 1830'
    ],
    explanation: 'BMR is calories burned at complete rest.',
    difficulty: 'hard',
    tips: ['Multiply BMR by activity factor for TDEE'],
    realWorldUse: 'Weight management, nutrition'
  },
  {
    id: generatePuzzleId('time', 16),
    title: 'Time Decimal',
    category: 'time',
    realWorldContext: 'Time tracking or billing',
    problem: 'Worked 1 hour 45 minutes. Convert to decimal hours.',
    formula: 'Decimal Hours = Hours + (Minutes ÷ 60)',
    formulaExplanation: 'Convert minutes to fraction of hour',
    solution: '1.75 hours',
    steps: [
      '45 minutes ÷ 60 = 0.75',
      'Total: 1 + 0.75 = 1.75'
    ],
    explanation: 'Convert minutes to decimal for calculation.',
    difficulty: 'easy',
    tips: ['15 min = 0.25, 30 min = 0.50, 45 min = 0.75'],
    realWorldUse: 'Time tracking, billing, payroll'
  },
  {
    id: generatePuzzleId('time', 17),
    title: 'Project Effort',
    category: 'time',
    realWorldContext: 'Project estimation',
    problem: 'Task estimated 8 hours. 3 people working 4 hours each. Hours logged?',
    formula: 'Total Hours = People × Hours Each',
    formulaExplanation: 'Calculate total person-hours',
    solution: '12 hours',
    steps: [
      'Multiply: 3 × 4 = 12 hours'
    ],
    explanation: 'Person-hours measures total effort.',
    difficulty: 'easy',
    tips: ['Person-hours = people × hours'],
    realWorldUse: 'Project management, estimation'
  },
  {
    id: generatePuzzleId('statistics', 16),
    title: 'Interquartile Range',
    category: 'statistics',
    realWorldContext: 'Data analysis',
    problem: 'Data: 2, 4, 5, 7, 9, 12, 15, 18. Find IQR (Q3 - Q1).',
    formula: 'IQR = Q3 - Q1 (quartiles)',
    formulaExplanation: 'Find 25th and 75th percentiles',
    solution: '9',
    steps: [
      'Q1 (25th): median of lower half = (4+5)/2 = 4.5',
      'Q3 (75th): median of upper half = (12+15)/2 = 13.5',
      'IQR: 13.5 - 4.5 = 9'
    ],
    explanation: 'IQR measures spread of middle 50% of data.',
    difficulty: 'hard',
    tips: ['For even data, split at median, find median of each half'],
    realWorldUse: 'Statistics, data analysis, research'
  },
  {
    id: generatePuzzleId('statistics', 17),
    title: 'Coefficient of Variation',
    category: 'statistics',
    realWorldContext: 'Comparing variability',
    problem: 'Mean 50, standard deviation 5. CV?',
    formula: 'CV = (σ ÷ μ) × 100',
    formulaExplanation: 'Standard deviation divided by mean',
    solution: '10%',
    steps: [
      'Divide: 5 ÷ 50 = 0.10',
      'Convert: 10%'
    ],
    explanation: 'CV allows comparison of variability between datasets.',
    difficulty: 'medium',
    tips: ['Lower CV = more consistent'],
    realWorldUse: 'Quality control, finance, research'
  },
];

export function getPuzzlesByCategory(category: PuzzleCategory): EducationalPuzzle[] {
  return EDUCATIONAL_PUZZLES.filter(p => p.category === category);
}

export function getPuzzleById(id: string): EducationalPuzzle | undefined {
  return EDUCATIONAL_PUZZLES.find(p => p.id === id);
}

export function searchPuzzles(query: string): EducationalPuzzle[] {
  const lowerQuery = query.toLowerCase();
  return EDUCATIONAL_PUZZLES.filter(puzzle => 
    puzzle.title.toLowerCase().includes(lowerQuery) ||
    puzzle.problem.toLowerCase().includes(lowerQuery) ||
    puzzle.realWorldContext.toLowerCase().includes(lowerQuery)
  );
}

export function getPuzzlesByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): EducationalPuzzle[] {
  return EDUCATIONAL_PUZZLES.filter(p => p.difficulty === difficulty);
}

export function getRandomPuzzles(count: number, category?: PuzzleCategory): EducationalPuzzle[] {
  const puzzles = category ? getPuzzlesByCategory(category) : [...EDUCATIONAL_PUZZLES];
  const shuffled = puzzles.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, puzzles.length));
}

export function convertPuzzleToQuestion(puzzle: EducationalPuzzle): {
  title: string;
  content: string;
  solution: string;
  difficulty: 'easy' | 'medium' | 'hard';
  hints: string[];
} {
  return {
    title: puzzle.title,
    content: `${puzzle.realWorldContext}\n\n${puzzle.problem}${puzzle.formula ? `\n\nFormula: ${puzzle.formula}${puzzle.formulaExplanation ? `\n${puzzle.formulaExplanation}` : ''}` : ''}`,
    solution: puzzle.solution,
    difficulty: puzzle.difficulty,
    hints: puzzle.tips || [],
  };
}

export const PUZZLE_CATEGORY_INFO: Record<PuzzleCategory, { name: string; icon: string; description: string }> = {
  math: { name: 'Mathematics', icon: '🔢', description: 'Numbers, formulas, and calculations' },
  physics: { name: 'Physics', icon: '⚛️', description: 'Forces, motion, and energy' },
  chemistry: { name: 'Chemistry', icon: '🧪', description: 'Molecules, reactions, and solutions' },
  cooking: { name: 'Cooking', icon: '🍳', description: 'Recipes, nutrition, and food science' },
  finance: { name: 'Finance', icon: '💰', description: 'Money, investments, and budgeting' },
  health: { name: 'Health & Fitness', icon: '💪', description: 'Body, exercise, and nutrition' },
  time: { name: 'Time & Scheduling', icon: '⏰', description: 'Time management and planning' },
  statistics: { name: 'Statistics', icon: '📊', description: 'Data analysis and probability' },
  gardening: { name: 'Gardening', icon: '🌱', description: 'Plants, soil, and outdoor spaces' },
  home: { name: 'Home Improvement', icon: '🔧', description: 'Repairs, renovation, and maintenance' },
};
