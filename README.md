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

- **Order Management**: Create, edit, assign, and complete delivery orders, each containing critical information such as weight, destination, observations, and assigned vehicle. Every order affects the vehicle's available capacity.
- **Vehicle Management**: Track vehicle details, including maximum and available capacity. Mark vehicles as favorites to prioritize them in selection lists, facilitating quicker assignment for high-priority vehicles.
- **Optimal Route Calculation**: Use the HERE API to calculate the optimal delivery sequence for each vehicle, minimizing travel distances and optimizing routes from the starting location (Fintech House in Lisbon).
- **Real-time Capacity Updates**: Automatically update each vehicle’s available capacity as orders are assigned or completed, ensuring accurate tracking and preventing overloading.
- **Search and Sorting**: Easily search for orders by destination and sort both orders and vehicles based on various attributes, such as weight, capacity, and favorites.
- **Persistent Notifications**: Display notifications for key actions like order assignment, deletion, and completion, providing immediate feedback and helping users monitor ongoing operations.
- **Data Persistence**: Simulate persistent storage of order and vehicle data through API calls to a JSON server, enabling easy testing and local development.
- **Polished UI with Modals for Enhanced Interaction**: Built with Material UI, the interface uses modals for focused interactions, such as creating/editing orders and assigning vehicles, resulting in a user-friendly experience.
- **Event-driven Actions**: Trigger automatic updates for key events, such as adjusting available capacity upon order completion, to provide a near real-time experience for managers.
- **Containerized Development**: Leverage Docker for consistent setup across environments, with separate services for the main application and JSON server.

## Tech Stack

- **Frontend**: Next.js, React, Material UI
- **State Management**: Redux Toolkit
- **Backend Simulation**: JSON Server (via Docker)
- **API**: HERE API for distance calculations
- **Notifications**: React Toastify
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

- **Continuous Integration**: Set up an automated CI/CD pipeline using GitHub Actions or CircleCI to run tests on every push and pull request.
- **Comprehensive Testing Suite**: Introduce Jest and React Testing Library for unit and integration tests, covering critical components like order and vehicle management, API interactions, and state management to ensure reliability and maintainability.
- **Backend**: Replace the JSON server with a real backend powered by Node.js and MongoDB for persistent data storage, enabling the application to handle larger datasets and scale as needed.
- **User Authentication**: Add user authentication to enhance security and allow for role-based access control.
- **Real-time Notifications**: Implement WebSocket or server-sent events to provide live updates on order and vehicle statuses, improving the user experience for fleet managers and drivers.
