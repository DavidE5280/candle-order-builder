# Candle Order Builder

This is a monday.com board view app that lets users create candle orders directly from a board.

The goal was to keep things simple, follow the requirements closely, and avoid over-engineering or making assumptions where the prompt was vague.

## What it does

Users can:

- Enter first name, last name, and quantity
- Select exactly 3 fragrances
- Submit the form to create a new item in the connected monday board

Fragrance options are fetched from a backend API and displayed in a multi-select dropdown.

## Tech

### Frontend

React
monday SDK
Vibe components

### Backend

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

1. Create a new app in the monday developer center
2. Add a Board View feature
3. Run the frontend locally
4. Follow the prompts to open the monday tunnel
5. Install the app on a board and open the board view

The app uses the current board context automatically, so no extra configuration is needed once it’s installed.

## Fragrance API

The backend exposes a simple CRUD API for managing fragrances.

Get all fragrances:

curl http://localhost:3001/api/fragrances

Add a fragrance:

curl -X POST http://localhost:3001/api/fragrances -H "Content-Type: application/json" -d '{"name":"Midnight Rose","description":"A deep floral scent with rich rose and dark undertones.","category":"Floral","image_url":"https://example.com/midnight-rose.jpg"}'

Update a fragrance (replace ID with an existing id):

curl -X PUT http://localhost:3001/api/fragrances/ID -H "Content-Type: application/json" -d '{"name":"Midnight Rose Reserve","description":"Updated description","category":"Floral","image_url":"https://example.com/midnight-rose-reserve.jpg"}'

Delete a fragrance (replace ID with an existing id):

curl -X DELETE http://localhost:3001/api/fragrances/ID

## Notes and tradeoffs

Fragrance data
The prompt included a schema but didn’t specify how data should be stored. I used a simple Express API with in-memory storage to support full CRUD and keep things easy to run locally.

CORS and local development
Since the app runs inside a monday iframe, direct requests to localhost were blocked. This was handled using a Vite proxy so the frontend can call /api while the backend runs on a different port.

Form validation
The requirement to select exactly 3 fragrances was handled at the form level. Users can select freely, but the form won’t submit unless exactly three are selected. The dropdown also shows an error state once the user interacts with it.

Inscription column
The board includes an "Inscription Request" column, which seems to represent a custom message for the candle. The provided form requirements didn’t include any input for this, so I didn’t try to guess how it should be used. I left it unused rather than introducing extra fields or assumptions.

Data usage in the board
The fragrance API includes additional fields like description, category, and image URL. These aren’t currently used in the board. I kept the board aligned with the example instead of adding new columns that weren’t part of the requirements.

## Future improvements

If this were a real project:

- Persist fragrance data in a database
- Map form inputs to specific monday columns instead of only setting the item name
- Add better error handling and user feedback
- Add tests for the API and form behavior
