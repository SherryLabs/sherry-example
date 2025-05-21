# Dynamic Action Example with Sherry SDK in Next.js

This project is an example of how to implement a "Dynamic Action" using the [Sherry SDK](https://docs.sherry.social/) within a Next.js application. It demonstrates how to expose metadata for an action and how to handle the execution of that action.

## Features

*   **Dynamic Action Metadata**: Exposes a `GET` endpoint that serves the metadata required by the Sherry SDK to define a dynamic action.
*   **Action Handling**: Implements a `POST` endpoint that simulates the execution of the action, receiving parameters and returning an execution response (in this case, a serialized transaction).
*   **CORS Support**: Includes CORS handling to allow requests from different origins, including managing `OPTIONS` (preflight) requests.
*   **Integration with `viem` and `wagmi`**: Uses `viem` for chain details (Avalanche Fuji) and `wagmi` for serializing transactions.

## Prerequisites

*   Node.js (version 18.x or higher recommended)
*   npm, yarn, or pnpm

## Project Setup

1.  **Clone the repository (if applicable) or create your Next.js project:**
    ```bash
    # If creating a new Next.js project
    npx create-next-app@latest sherry-example --typescript --eslint --tailwind --src-dir --app --import-alias "@/*"
    cd sherry-example
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```
    Ensure you have the necessary packages installed, including `@sherrylinks/sdk`, `viem`, and `wagmi`:
    ```bash
    npm install @sherrylinks/sdk viem wagmi
    # or
    yarn add @sherrylinks/sdk viem wagmi
    # or
    pnpm add @sherrylinks/sdk viem wagmi
    ```

3.  **Remove ESLint:**
    To avoid build errors, we'll remove ESLint from the project:
    ```bash
    # Remove ESLint package
    npm uninstall eslint
    # or
    yarn remove eslint
    # or
    pnpm remove eslint
    
    # Delete ESLint configuration files
    rm .eslintrc.json .eslintrc.js
    ```
    You can also disable ESLint in your next.config.js by adding:
    ```javascript
    module.exports = {
      eslint: {
        ignoreDuringBuilds: true,
      },
    }
    ```


## Running the Project

To start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000` by default. The example API endpoint will be at `http://localhost:3000/api/example`.

## API Endpoint: `/api/example`

This file (`app/api/example/route.ts`) defines the handlers for the dynamic action.

### `GET /api/example`

*   **Purpose**: Returns the metadata for the dynamic action. This metadata is used by platforms integrating Sherry Links to display information about the action and how to interact with it.
*   **Successful Response (200 OK)**:
    ```json
    {
        "url": "http://localhost:3000/api/dynamic-action", // Base URL for the action
        "icon": "https://avatars.githubusercontent.com/u/117962315",
        "title": "Timestamped Message",
        "baseUrl": "http://localhost:3000",
        "description": "Store a message with an optimized timestamp calculated by our algorithm",
        "actions": [
            {
                "type": "dynamic",
                "label": "Store Message", // Label for the button/action
                "description": "Store your message with a custom timestamp calculated for optimal storage",
                "chains": { "source": "fuji" }, // Source chain
                "path": "/api/example", // Path of the POST endpoint to execute the action
                "params": [
                    {
                        "name": "message",
                        "label": "Your Message Hermano!",
                        "type": "text",
                        "required": true,
                        "description": "Enter the message you want to store on the blockchain"
                    }
                ]
            }
        ]
    }
    ```

### `POST /api/example`

*   **Purpose**: Executes the dynamic action. In this example, it expects a `message` query parameter, simulates the creation of a transaction, and returns an execution response with the serialized transaction.
*   **Query Parameters**:
    *   `message` (string, required): The message to process.
*   **Example Request**:
    `POST http://localhost:3000/api/example?message=HelloSherry`
*   **Successful Response (200 OK)**:
    ```json
    {
        "serializedTransaction": "0x...", // The serialized transaction
        "chainId": "avalancheFuji" // The name of the chain
    }
    ```
*   **Error Response (400 Bad Request)**: If the `message` parameter is missing.
    ```json
    {
        "error": "Message parameter is required"
    }
    ```

### `OPTIONS /api/example`

*   **Purpose**: Handles CORS preflight requests. This is necessary for browsers to allow `POST` requests (or other methods) from different origins, especially if they include custom headers or `Content-Type` like `application/json`.
*   **Successful Response (204 No Content)**: An empty response with the appropriate CORS headers (`Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers`).

## Sherry SDK

This example uses `@sherrylinks/sdk` for:

*   `createMetadata`: To validate and help structure the metadata object for the action.
*   Types like `Metadata`, `ValidatedMetadata`, and `ExecutionResponse` to ensure correct data shaping.

Consult the [official Sherry documentation](https://docs.sherry.social/) for more details on creating and integrating actions.

## Contributing

Contributions are welcome. Please open an issue or a pull request.