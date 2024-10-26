# TasksTrack

TasksTrack is a task tracking app with integrated Pomodoro timer functionality to enhance productivity.

## Features

- **Task Tracking:** Manage and track tasks.
- **Pomodoro Timer:** Enhance focus during work sessions.
- **User Authentication:** Register, log in, and log out securely.
- **Session History:** Review completed Pomodoro sessions.

## Technologies

- **Backend:**
  - [ASP.NET Core](https://dotnet.microsoft.com/apps/aspnet) for web API development.
  - [PostgreSQL](https://www.postgresql.org/) for data storage.

- **Frontend:**
  - [React.js](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/).

## Getting Started

1. **Clone the Repository:**

     ```bash
     git clone https://github.com/akarambizi/TasksTrack.git
     ```

2. **Run the Project with Docker Compose:**

     Ensure you have Docker and Docker Compose installed. [Docker](https://www.docker.com/)

     ```bash
     docker-compose up --build
     ```

     **Access the Application:**

     - Client: Open your browser and navigate to <http://localhost:3000>.
     - Server: Open your browser and navigate to <http://localhost:5206>.

     ***Additional Commands***

     - Stop the Services:

         ```bash
         docker-compose down
         ```

     - Rebuild the Services:

         ```bash
         docker-compose up --build
         ```

     - View Logs:

         ```bash
         docker-compose logs -f
         ```

3. **Run the Client Locally:**

     Navigate to the `./client` folder and use the scripts defined in the `package.json` to run the client.

     1. Start Development Server with Mock Server:

        ```bash
        yarn dev:mock
        ```

     2. Start Development Server and Mock Server separately

        - Start Development Server:

            ```bash
            yarn dev
            ```

            This will start the Vite development server on <http://localhost:3000>.

        - Start Mock Server:

            This will start the mock server on <http://localhost:4200>.

            ```bash
            yarn mock-server
            ```
