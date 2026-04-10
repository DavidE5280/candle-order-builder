# Candle Order Builder

This is a simple monday.com app that allows users to create candle orders directly from a board view.

The app collects basic order information, validates the input, and creates a new item in the connected monday board. The app uses the current board context automatically, so no configuration is required once installed.

## What it does

Users can:

- Enter first name, last name, and quantity
- Select exactly 3 fragrances
- Submit the form to create a new order in monday

Fragrance options are fetched from a small backend API and displayed in a multi-select dropdown.

## Tech

Frontend
React
monday SDK
Vibe components

Backend
Express
In-memory data store for fragrances

## Running locally

Start the backend:

cd server
node index.js

Start the frontend:

cd quickstart-react
npm run start

Make sure the monday tunnel is running so the app can render inside the board view.

## Running inside monday.com

To test the app inside monday:

1. Create a new app in monday.com developer center
2. Add a Board View feature
3. Run the frontend locally (`npm run start`)
4. When prompted, provide your monday API token to open the tunnel
5. Install the app on a board and open the board view

The app will load inside the board and allow order creation.

## Notes and tradeoffs

There were a few areas where requirements were unclear or intentionally open-ended.

Fragrance data
The prompt provided a schema but no backend or persistence strategy. I chose to implement a simple Express API with in-memory storage to support full CRUD operations and simulate a real data source.

CORS and local development
Because the app runs inside a monday iframe, requests to localhost were blocked. This was resolved using a Vite proxy to route /api requests to the backend.

Form validation
The requirement to select exactly 3 fragrances created an interesting UX decision. Instead of blocking selection, the form allows users to choose freely and enforces the constraint at submission time, while also visually indicating an error state.

Inscription column
The role of the inscription field in the provided board was ambiguous. Based on the description, it appears to be something handled later in the workflow rather than during order creation. I chose not to populate it automatically.

## Future improvements

If this were productionized:

- Persist fragrance data in a database
- Map form fields to specific monday columns instead of only setting the item name
- Add loading and error states for API calls
- Add tests for API routes and form behavior
