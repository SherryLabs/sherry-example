# Dynamic Action Example with Sherry SDK in Next.js

This project demonstrates how to implement a "Dynamic Action" (Mini App) using the [Sherry SDK](https://docs.sherry.social/) within a Next.js application. It shows how to expose metadata for an action and handle its execution, creating interactive blockchain applications that can be embedded in different platforms.

## 🌟 Features

- **Dynamic Action Metadata**: Exposes a `GET` endpoint serving metadata required by Sherry SDK to define a dynamic action
- **Action Execution**: Implements a `POST` endpoint that handles action execution, receiving parameters and returning serialized transactions
- **CORS Support**: Complete CORS handling for cross-origin requests, including `OPTIONS` preflight requests
- **Blockchain Integration**: Uses `viem` for chain details (Avalanche Fuji) and `wagmi` for transaction serialization
- **Parameter Validation**: Robust parameter handling and validation
- **TypeScript Support**: Full TypeScript implementation with proper types

## 📋 Prerequisites

- Node.js (version 18.x or higher recommended)
- npm, yarn, or pnpm
- Basic understanding of Next.js and blockchain concepts

## 🚀 Project Setup

### 1. Clone or Create Project

```bash
# Clone this repository or create a new Next.js project
npx create-next-app@latest sherry-example --typescript --eslint --tailwind --src-dir --app --import-alias "@/*"
cd sherry-example
```

### 2. Install Dependencies

```bash
npm install @sherrylinks/sdk viem wagmi
# or
yarn add @sherrylinks/sdk viem wagmi
# or
pnpm add @sherrylinks/sdk viem wagmi
```

### 3. Optional: Configure ESLint

To avoid build errors, you can disable ESLint in `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
```

## 🏃‍♂️ Running the Project

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000`. The API endpoint will be accessible at `http://localhost:3000/api/example`.

## 📡 API Endpoints

### `GET /api/example` - Action Metadata

**Purpose**: Returns metadata for the dynamic action, used by platforms to display and interact with your mini app.

**Response Example**:
```json
{
    "url": "https://sherry.social",
    "icon": "https://avatars.githubusercontent.com/u/117962315",
    "title": "Timestamped Message",
    "baseUrl": "http://localhost:3000",
    "description": "Store a message with an optimized timestamp calculated by our algorithm",
    "actions": [
        {
            "type": "dynamic",
            "label": "Store Message",
            "description": "Store your message with a custom timestamp calculated for optimal storage",
            "chains": { "source": "fuji" },
            "path": "/api/example",
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

### `POST /api/example` - Action Execution

**Purpose**: Executes the dynamic action, processes parameters, and returns a serialized transaction.

**Query Parameters**:
- `message` (string, required): The message to process

**Example Request**:
```
POST http://localhost:3000/api/example?message=HelloSherry
```

**Success Response**:
```json
{
    "serializedTransaction": "0x...",
    "chainId": "avalancheFuji"
}
```

**Error Response** (400 - Missing Parameter):
```json
{
    "error": "Message parameter is required"
}
```

### `OPTIONS /api/example` - CORS Preflight

**Purpose**: Handles CORS preflight requests for cross-origin compatibility.

**Response**: 204 No Content with appropriate CORS headers.

## 🧪 Testing Your Mini App

You have several options to test your dynamic action:

### Option 1: Sherry Social Platform
1. Visit [https://app.sherry.social/home](https://app.sherry.social/home)
2. Enter your endpoint URL:
   - **During development**: `http://localhost:3000/api/example` (only works if your local server is publicly accessible)
   - **After deployment**: Use your actual deployed URL (e.g., `https://your-app-name.vercel.app/api/example`)
3. The platform will automatically render your mini app

> **Important**: The localhost URL is only provided as a reference. For actual integration with the Sherry platform, you must deploy your application and use the public URL. The Sherry platform cannot access your localhost unless you're using a tunneling service.

### Option 2: Sherry Debugger (Recommended for Development)
1. Go to [https://app.sherry.social/debugger](https://app.sherry.social/debugger)
2. Test using one of three methods:
   - **URL**: Paste your GET endpoint URL (localhost during development, deployed URL in production)
   - **JSON**: Copy and paste the metadata JSON
   - **TypeScript**: Paste your TypeScript code directly

**Note**: The debugger is in active development and may contain bugs. You can report issues directly from the debugger interface.

### Testing Steps:

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Verify GET Endpoint**:
   - Navigate to `http://localhost:3000/api/example` locally
   - After deployment, use your deployed URL (e.g., `https://your-app-name.vercel.app/api/example`)
   - Confirm you see the metadata JSON response

3. **Test in Debugger**:
   - Use appropriate URL based on environment (local or deployed)
   - Verify input fields render correctly
   - Test form completion and submission

4. **Verify Execution**:
   - Fill in required parameters
   - Click the action button
   - Confirm you receive a serialized transaction

## 🏗️ Project Structure

```
├── app/
│   ├── api/
│   │   └── example/
│   │       └── route.ts          # Main API endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── README.md                    # This file
└── package.json                 # Dependencies
```

## 🔧 Key Components

### Sherry SDK Integration

- `createMetadata`: Validates and structures metadata objects
- `Metadata`, `ValidatedMetadata`, `ExecutionResponse`: TypeScript types for proper data handling
- Parameter validation and processing

### Blockchain Integration

- **viem**: Provides chain configurations (Avalanche Fuji)
- **wagmi**: Handles transaction serialization
- Support for multiple blockchain networks

### CORS Implementation

Complete CORS setup allowing cross-origin requests from any domain, essential for platform integration.

## 🛠️ Customization

### Adding New Parameters

To add new input fields, extend the `params` array in your metadata:

```typescript
params: [
    // ... existing params
    {
        name: "newParam",
        label: "New Parameter",
        type: "number",
        required: false,
        description: "Description of the new parameter"
    }
]
```

### Changing Target Blockchain

Update the chain configuration:

```typescript
import { mainnet } from "viem/chains"; // or any other chain

const tx = {
    to: '0x...',
    value: BigInt(1000000),
    chainId: mainnet.id, // Update chain ID
}

const response: ExecutionResponse = {
    serializedTransaction: serialized,
    chainId: mainnet.name, // Update chain name
}
```

### Adding Business Logic

Extend the POST handler with your custom logic:

```typescript
export async function POST(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const message = searchParams.get("message");
        
        // Add your custom business logic here
        const processedData = await processMessage(message);
        
        // Create transaction based on processed data
        const tx = createCustomTransaction(processedData);
        
        // ... rest of the handler
    } catch (error) {
        // Handle errors
    }
}
```

## 🐛 Troubleshooting

### Common Issues

**CORS Errors**:
- Ensure all endpoints include proper CORS headers
- Verify OPTIONS method is implemented

**Metadata Validation Failures**:
- Check all required fields are present
- Verify data types match expected formats
- Use `createMetadata()` for validation

**Parameter Issues**:
- Confirm parameter names match between metadata and POST handler
- Verify required parameters are marked correctly

**Transaction Serialization**:
- Ensure values are in correct format (BigInt for wei amounts)
- Verify chainId is valid for target network
- Check destination address format

### Debug Tips

1. **Check Browser Console**: Look for JavaScript errors when testing
2. **Verify JSON Response**: Ensure GET endpoint returns valid JSON
3. **Test Parameters**: Use browser developer tools to inspect network requests
4. **Console Logging**: Add console.log statements to trace execution flow

## 📚 Additional Resources

- [Sherry SDK Documentation](https://docs.sherry.social/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Viem Documentation](https://viem.sh/)
- [Wagmi Documentation](https://wagmi.sh/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).