# Online Store Frontend

This is the frontend application for the Online Store, built with Angular.

## Prerequisites

- Node.js (version 14.x or later)
- npm (usually comes with Node.js)
- Angular CLI (`npm install -g @angular/cli`)

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-repo/online-store.git
   cd online-store/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `src/environments/environment.example.ts` to `src/environments/environment.ts`
   - Update `environment.ts` with your backend API URL

## Running the Application

To start the development server:

```
ng serve
```

Navigate to `http://localhost:4200/` in your browser. The app will automatically reload if you change any of the source files.

## Building for Production

To build the project for production:

```
ng build --prod
```

The build artifacts will be stored in the `dist/` directory.

## Running Tests

- To execute unit tests via Karma:
  ```
  ng test
  ```

- To execute end-to-end tests via Protractor:
  ```
  ng e2e
  ```

## Project Structure

- `src/app/components/`: Contains all Angular components
- `src/app/services/`: Contains services for API communication and state management
- `src/app/models/`: Contains TypeScript interfaces for data models
- `src/app/guards/`: Contains route guards for authentication
- `src/app/interceptors/`: Contains HTTP interceptors (e.g., for adding authentication tokens to requests)
- `src/environments/`: Contains environment-specific variables

## Key Features

- User authentication (login/register)
- Product listing and details
- Shopping cart functionality
- Order placement
- HTTP Interceptors for handling authentication tokens and error responses

## Interceptors

The application uses HTTP interceptors to handle cross-cutting concerns:

- `AuthInterceptor`: Adds the authentication token to outgoing HTTP requests
- `ErrorInterceptor`: Handles HTTP error responses globally (if implemented)

To add or modify interceptors, work in the `src/app/interceptors/` directory and ensure they are properly provided in `app.config.ts`.

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.