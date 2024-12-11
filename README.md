# ERP.AREO Test Task

This project requires Docker to set up a MySQL database and Node.js to run the application, with configuration managed via `config.local.json5` and environment settings specified in `.local`.

## Prerequisites

- Docker and Docker Compose must be installed on your machine.
- Node.js and npm must be installed.

## Setting up the Project

1. **Clone the repository** (if you haven't already):

    ```bash
    git clone <repository_url>
    cd <project_directory>
    ```

2. **Set up MySQL using Docker**:

    Run the following command to start the MySQL database container using Docker Compose:

    ```bash
    docker-compose up -d
    ```

    This will:
    - Build and start the MySQL container in detached mode.
    - Expose the MySQL service so that the project can interact with it.

3. **Configure the environment**:

    - The application reads environment-specific configurations from the `config.local.json5` file.
    - Make sure you set the environment variable `app.env=local` in the `.local` file to ensure the local configuration is applied.

    Example of `.local` file contents:

    ```env
    app.env=local
    ```

    - The `config.local.json5` file contains all configuration settings specific to your local development environment (e.g., database credentials, API keys, etc.).
    - Ensure the values in this file are set correctly for your local environment.

4. **Install Node.js dependencies**:

    Before running the application, install the required Node.js packages:

    ```bash
    npm install
    ```

5. **Start the application**:

    Use the following command to start the project:

    ```bash
    npm start
    ```

    This will run the project using `nodemon` and automatically restart the server on code changes.

    **Note**: The application will use the local configuration based on the `app.env=local` setting.

## Additional Notes

- If you need to stop the MySQL container, run:

    ```bash
    docker-compose down
    ```

- Ensure that you have the correct database credentials and other configurations set in the `config.local.json5` file.
