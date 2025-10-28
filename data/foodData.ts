import { FoodSearchItem } from '../types';

export const FOOD_DATA: FoodSearchItem[] = [
    {
        id: 1,
        description: 'Breakfast cereals, rice puffed, cocoa coated, fortified vitamins B1, B2, B3 & folate, & Fe',
        nutrients_per_100g: {
            energy: 359,
            carbohydrates: 80.1,
            proteins: 5.55,
            fats: 1,
            fibre: 1.3,
            water: 4.2,
        },
        measures: [
            { name: 'Servings', grams: 63 },
            { name: 'Cup', grams: 35 },
            { name: 'g', grams: 1 },
        ],
    },
    {
        id: 2,
        description: 'Cracker, rice, barbecue flavoured',
        nutrients_per_100g: {
            energy: 420,
            carbohydrates: 75.3,
            proteins: 8.1,
            fats: 8.9,
            fibre: 2.1,
            water: 3.5,
        },
        measures: [
            { name: 'Serving', grams: 25 },
            { name: 'Cracker', grams: 5 },
             { name: 'g', grams: 1 },
        ],
    },
    {
        id: 3,
        description: 'Cracker, Rice Cracker Seaweed, Fantastic',
        nutrients_per_100g: {
            energy: 477,
            carbohydrates: 70.3,
            proteins: 6.9,
            fats: 17.9,
            fibre: 2.0,
            water: 2.5,
        },
        measures: [
            { name: 'Serving', grams: 25 },
            { name: 'g', grams: 1 },
        ],
    },
    {
        id: 4,
        description: 'Cracker, Rice Cracker Seaweed, Pams',
        nutrients_per_100g: {
            energy: 485,
            carbohydrates: 68.4,
            proteins: 6.5,
            fats: 20.2,
            fibre: 1.9,
            water: 2.4,
        },
        measures: [
            { name: 'Serving', grams: 25 },
            { name: 'g', grams: 1 },
        ],
    },
    {
        id: 5,
        description: 'Cracker, rice, plain',
        nutrients_per_100g: {
            energy: 384,
            carbohydrates: 80.4,
            proteins: 8.5,
            fats: 2.2,
            fibre: 2.3,
            water: 4.0,
        },
        measures: [
            { name: 'Serving', grams: 25 },
            { name: 'Cracker', grams: 7 },
            { name: 'g', grams: 1 },
        ],
    },
    {
        id: 6,
        description: 'Cracker, rice, seaweed flavoured, Sakata®',
        nutrients_per_100g: {
            energy: 426,
            carbohydrates: 84.5,
            proteins: 6.5,
            fats: 6.3,
            fibre: 1.0,
            water: 2.2,
        },
        measures: [
            { name: 'Serving', grams: 25 },
            { name: 'g', grams: 1 },
        ],
    },
    {
        id: 7,
        description: 'Drink, almond milk, sweetened with rice syrup',
        nutrients_per_100g: {
            energy: 54,
            carbohydrates: 7.2,
            proteins: 1.1,
            fats: 2.3,
            fibre: 0.8,
            water: 88.3,
        },
        measures: [
            { name: 'mL', grams: 1 }, // Assuming 1g = 1mL for milk-like liquid
            { name: 'Cup (250mL)', grams: 250 },
        ],
    },
    {
        id: 8,
        description: 'Flour, rice, brown',
        nutrients_per_100g: {
            energy: 363,
            carbohydrates: 76.4,
            proteins: 7.2,
            fats: 2.7,
            fibre: 4.6,
            water: 10.1,
        },
        measures: [
            { name: 'g', grams: 1 },
            { name: 'Cup', grams: 158 },
        ],
    },
    {
        id: 9,
        description: 'Flour, rice, white',
        nutrients_per_100g: {
            energy: 366,
            carbohydrates: 80.1,
            proteins: 6.0,
            fats: 1.4,
            fibre: 2.4,
            water: 11.3,
        },
        measures: [
            { name: 'g', grams: 1 },
            { name: 'Cup', grams: 158 },
        ],
    },
    {
        id: 10,
        description: 'Fried rice, combination, Chinese, takeaway',
        nutrients_per_100g: {
            energy: 168,
            carbohydrates: 25.4,
            proteins: 6.9,
            fats: 4.2,
            fibre: 1.5,
            water: 61.3,
        },
        measures: [
            { name: 'Serving', grams: 350 },
            { name: 'g', grams: 1 },
        ],
    },
     {
        id: 11,
        description: 'Rice, white, boiled',
        nutrients_per_100g: {
            energy: 130,
            carbohydrates: 28.2,
            proteins: 2.7,
            fats: 0.3,
            fibre: 0.4,
            water: 68.6,
        },
        measures: [
            { name: 'Cup, cooked', grams: 158 },
            { name: 'g', grams: 1 },
        ],
    },
];
