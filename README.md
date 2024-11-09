# Fleet Management Dashboard

A fleet management dashboard application built with Next.js, Redux, and Material UI to allow fleet managers to assign, track, and manage delivery orders across vehicles. This project also includes containerization using Docker for both the main application and a JSON server for data simulation.

## Table of Contents

1.  [Features](#features)
2.  [Tech Stack](#tech-stack)
3.  [Setup Instructions](#setup-instructions)
4.  [Environment Variables](#environment-variables)
5.  [Running the Application](#running-the-application)
6.  [Dockerization](#dockerization)
7.  [File Structure](#file-structure)
8.  [Future Improvements](#future-improvements)

## Features

- **Order Management**: Create, edit, assign, and complete delivery orders. Orders include information such as weight, destination, observations, and vehicle assignment.
- **Vehicle Management**: Track vehicles with details on maximum capacity and available capacity. Mark vehicles as favorites for quicker assignment.
- **Optimal Route Calculation**: Calculate the optimal order sequence for a vehicle based on distance from a starting point using the HERE API.
- **Search and Sorting**: Search for orders by destination and sort both orders and vehicles based on various attributes.
- **Persistent Notifications**: Show notifications for key actions (e.g., order assignment, deletion, and completion).
- **Data Persistence**: Store order and vehicle information through API calls using a JSON server.
- **User-Friendly UI**: Use Material UI for a polished interface, including modals for creating/editing orders and assigning vehicles.
- **Containerized Development**: Use Docker for consistent and easy setup across environments.

## Tech Stack

- **Frontend**: Next.js, React, Material UI
- **State Management**: Redux Toolkit
- **Backend Simulation**: JSON Server (via Docker)
- **API**: HERE API for distance calculations
- **Notifications**: React Toastify
- **Testing**: Jest, React Testing Library (optional)
- **Containerization**: Docker, Docker Compose

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/fleet-management-dashboard.git
   cd fleet-management-dashboard
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a .env file in the root directory and add your API key from [HERE API](https://developer.here.com/develop/rest-apis):

   ```plaintext
   NEXT_PUBLIC_HERE_API_KEY==your_api_key_here
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

## Running the Application

To run the application locally:

```bash
npm run json-server
```

```bash
npm run dev
```

The application should now be running at http://localhost:3000, and the JSON server API will be available at http://localhost:4000.

## Dockerization

The project includes a Docker setup for consistent and isolated development.

1.  ```bash
    docker-compose up --build
    ```

2.  **Services**:
    - fleet-management: The main Next.js application, exposed on port 3000.
    - json-server: The JSON server for simulating order and vehicle data, exposed on port 4000.

## File Structure

- **/components**: Reusable React components like OrderList, VehicleList, VehicleSelectionDialog.
- **/redux**: Redux setup and slices for orders and vehicles.
- **/pages**: Contains main pages like the dashboard.
- **/hooks**: Custom hooks, e.g., useDashboardHandlers for handling core business logic.
- **/utils**: Utility functions for sorting and debouncing search.
- **/public**: Static assets.
- **/Dockerfile**: Dockerfile for the main application.
- **Dockerfile.json-server**: Dockerfile for JSON server.
- **docker-compose.yml**: Docker Compose configuration for multi-service setup.

## Future Improvements

- **Continuous Integration**: Set up automated testing and CI/CD pipeline using GitHub Actions or CircleCI.
- **Enhanced Testing**: Expand Jest and React Testing Library tests for comprehensive coverage.
- **User Authentication**: Add user authentication for enhanced security.
- **Real-time Notifications**: Implement WebSocket or server-sent events for live updates on orders and vehicle statuses.
