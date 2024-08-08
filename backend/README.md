# Online Store Backend

This is the backend API for the Online Store, built with Flask and PostgreSQL.

## Prerequisites

- Python 3.11.7
- pip
- PostgreSQL
- Redis

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-repo/online-store.git
   cd online-store/backend
   ```

2. Set up a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update `.env` with your database URL, Redis URL, and other configuration

5. Initialize the database:
   ```
   flask db upgrade
   ```

## Running the Application

To start the development server:

```
flask run
```

The API will be available at `http://localhost:5000/`.

## Docker Setup

1. Make sure you have Docker and Docker Compose installed.

2. Build and start the containers:
   ```
   docker-compose up --build
   ```

3. The API will be available at `http://localhost:5000/`.

## Database Migrations

To run database migrations within the Docker container:

- Create a new migration:
  ```
  docker compose exec flask_app flask db migrate -m "Description of changes"
  ```

- Apply migrations:
  ```
  docker compose exec flask_app flask db upgrade
  ```

- Show the current migration version:
  ```
  docker compose exec flask_app flask db current
  ```

- Show migration history:
  ```
  docker compose exec flask_app flask db history
  ```

## Generating Sample Data

To generate sample products within the Docker container:

- Generate 500 sample products (default):
  ```
  docker compose exec flask_app flask generate-products
  ```

- Generate a specific number of products:
  ```
  docker compose exec flask_app flask generate-products --count 1000
  ```

## Running Flask Shell

To access the Flask shell within the Docker container:

```
docker compose exec flask_app flask shell
```

This opens an interactive Python shell with your Flask application context, useful for debugging and testing.

## Viewing Logs

To view the logs of the Flask application:

```
docker compose logs flask_app
```

Add the `-f` flag to follow the logs in real-time:

```
docker compose logs -f flask_app
```

## API Endpoints

- POST `/api/auth/register`: Register a new user
- POST `/api/auth/login`: Login a user
- GET `/api/products`: Get all products
- GET `/api/products/<id>`: Get a specific product
- POST `/api/orders`: Place a new order
- GET `/api/orders`: Get all orders for the authenticated user

## Project Structure

- `app/`: Main application package
  - `models/`: Database models
  - `routes/`: API route handlers
  - `services/`: Business logic
  - `cli/`: Custom CLI commands
- `migrations/`: Database migration scripts
- `tests/`: Unit and integration tests

## Testing

To run tests:

```
pytest
```

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.