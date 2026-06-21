import React from 'react';

// A recipe card: ingredients and numbered steps from data.

const recipe = {
  title: 'Pancakes',
  serves: 4,
  ingredients: [
    '200g flour',
    '2 eggs',
    '300ml milk',
    'pinch of salt',
  ],
  steps: [
    'Whisk eggs and milk.',
    'Add flour and salt, whisk until smooth.',
    'Cook each side until golden.',
  ],
};

export default (
  <>
    <h1>{recipe.title}</h1>
    <p>
      <em>Serves {recipe.serves}</em>
    </p>

    <h2>Ingredients</h2>
    <ul>
      {recipe.ingredients.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>

    <h2>Steps</h2>
    <ol>
      {recipe.steps.map((step) => (
        <li key={step}>{step}</li>
      ))}
    </ol>

    <blockquote>Tip: rest the batter for 10 minutes.</blockquote>
  </>
);
