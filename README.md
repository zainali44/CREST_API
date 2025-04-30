# Health and Recipes API

## Overview
This comprehensive API supports a health and nutrition application by managing users, recipes, meal plans, comments, and user interactions. It facilitates operations like creating, retrieving, updating, and deleting data across various entities.

## Installation

### Prerequisites
- Node.js
- MongoDB
- npm

### Setup
Clone the repository and install dependencies:
```bash
git clone https://your-repository-url.git
cd my-api
npm install
```

### Configuration
Create a `.env` file in the root directory and add the following environment variables:
```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/health-and-recipes
JWT_SECRET=your-secret-key
```

### Running the API
Start the API server:
```bash
npm start
```
# API Endpoints

## Users

### Register a User
```bash
POST /users
Content-Type: application/json

{
  "email": "example@example.com",
  "password": "yourPassword",
  "first_name": "John",
  "last_name": "Doe",
  "height": 175,
  "weight": 70,
  "age": 25,
  "allergies": ["Pollen", "Dust"],
  "dietary_preferences": ["Vegan"],
  "health_goals": ["Increase muscle mass"]
}

Response:
Status: 201 Created
```

### Retrieve User
```bash
GET /users/:id

Response:
Status: 200 OK
Content-Type: application/json

{
  "email": "
    "first_name": "John",
    "last_name": "Doe",
    "height": 175,
    "weight": 70,
    "age": 25,
    "allergies": ["Pollen", "Dust"],
    "dietary_preferences": ["Vegan"],
    "health_goals": ["Increase muscle mass"]
}

```

## Recipes

### Create Recipe
```bash
POST /recipes
Content-Type: application/json

{
  "recipe_name": "Tomato Soup",
  "ingredients": [
    {"ingredient": "Tomato", "amount": "5 tomatoes"},
    {"ingredient": "Salt", "amount": "1 tsp"}
  ],
  "instructions": "Blend tomatoes and boil with salt.",
  "portion_size": 3,
  "serving_size": 250,
  "calories": 80,
  "macros": {
    "protein": 2,
    "carbs": 18,
    "fat": 0.5
  },
  "dietary_category": "Vegetarian",
  "cuisine": "Italian",
  "cooking_time": 30,
  "author_id": "userId"
}

Response:
Status: 201 Created
```

### Retrieve Recipe
```bash
GET /recipes/:id

Response:
Status: 200 OK
Content-Type: application/json

{
  "recipe_name": "Tomato Soup",
  "ingredients": [
    {"ingredient": "Tomato", "amount": "5 tomatoes"},
    {"ingredient": "Salt", "amount": "1 tsp"}
  ],
  "instructions": "Blend tomatoes and boil with salt.",
  "portion_size": 3,
  "serving_size": 250,
  "calories": 80,
  "macros": {
    "protein": 2,
    "carbs": 18,
    "fat": 0.5
  },
  "dietary_category": "Vegetarian",
  "cuisine": "Italian",
  "cooking_time": 30,
  "author_id": "userId"
}
```

## Meal Plans

### Create Meal Plan
```bash
POST /mealplans
Content-Type: application/json

{
  "user_id": "userId",
  "start_date": "2023-01-01",
  "end_date": "2023-01-07",
  "health_goal": "Weight loss"
}

Response:
Status: 201 Created
```

### Retrieve Meal Plan
```bash
GET /mealplans/:id

Response:
Status: 200 OK
Content-Type: application/json

{
  "user_id": "userId",
  "start_date": "2023-01-01",
  "end_date": "2023-01-07",
  "health_goal": "Weight loss"
}
```

## Planned Recipes

### Add Planned Recipe
```bash
POST /plannedrecipes
Content-Type: application/json

{
  "meal_plan_id": "mealPlanId",
  "recipe_id": "recipeId",
  "meal_time": {
    "date": "2023-01-03",
    "time": "Dinner"
  }
}

Response:
Status: 201 Created
```

### Retrieve Planned Recipes
```bash
GET /plannedrecipes/mealplan/:mealPlanId

Response:
Status: 200 OK
Content-Type: application/json

[
  {
    "meal_plan_id": "mealPlanId",
    "recipe_id": "recipeId",
    "meal_time": {
      "date": "2023-01-03",
      "time": "Dinner"
    }
  }
]
```

## Nutrition History

### Record Nutrition Intake
```bash
POST /nutritionhistory
Content-Type: application/json

{
  "user_id": "userId",
  "date": "2023-01-02",
  "calories": 2000,
  "protein": 150,
  "carbs": 250,
  "fat": 88,
  "bmi": 22
}

Response:
Status: 201 Created
```

### Retrieve Nutrition History
```bash

GET /nutritionhistory/user/:userId

Response:
Status: 200 OK

[
  {
    "user_id": "userId",
    "date": "2023-01-02",
    "calories": 2000,
    "protein": 150,
    "carbs": 250,
    "fat": 88,
    "bmi": 22
  }
]
```

## User Interactions

### Log an Interaction
```bash
POST /userinteractions
Content-Type: application/json

{
  "user_id": "userId",
  "recipe_id": "recipeId",
  "interaction_type": "like",
  "interaction_details": {
    "message": "Loved this recipe!"
  }
}

Response:
Status: 201 Created
```

### Get User Interactions
```bash
GET /userinteractions/user/:userId

Response:
Status: 200 OK
Content-Type: application/json

[
  {
    "user_id": "userId",
    "recipe_id": "recipeId",
    "interaction_type": "like",
    "interaction_details": {
      "message": "Loved this recipe!"
    }
  }
]
```

## Comments

### Add a Comment
```bash
POST /comments
Content-Type: application/json

{
  "recipe_id": "recipeId",
  "user_id": "userId",
  "comment_text": "This recipe is fantastic!"
}

Response:
Status: 201 Created
```

### Get Comments
```bash
GET /comments/recipe/:recipeId

Response:
Status: 200 OK
Content-Type: application/json

[
  {
    "recipe_id": "recipeId",
    "user_id": "userId",
    "comment_text": "This recipe is fantastic!"
  }
]
```

## Contribution
Contributions to the API are welcome. Please fork the repository and submit a pull request with your changes.

## More Information
For detailed API documentation, refer to the provided swagger.yaml in the repository for full descriptions of all endpoints, parameters, and responses.

### Notes
- Make sure to replace placeholders like `https://your-repository-url.git` and `yourDatabaseName` with your actual repository URL and MongoDB database name.
- It's assumed that you have or will create detailed API documentation, such as Swagger or OpenAPI, to supplement this README. This documentation will provide in-depth details for each endpoint.
- This README covers basic installation, setup, and examples of how to use each endpoint with example data to help new users get started with your API.

## Developers
- [ZAIN]()

## License
This project is open source and available under the [MIT License](LICENSE).