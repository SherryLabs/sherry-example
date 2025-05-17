import { NextRequest, NextResponse } from "next/server";
import { avalancheFuji } from "viem/chains";
import { createMetadata, Metadata, ValidatedMetadata, ExecutionResponse } from "@sherrylinks/sdk";
import { serialize } from 'wagmi'

export async function GET(_req: NextRequest, _res: NextResponse) {
    // Contract address - must match the address in the POST endpoint
    const CONTRACT_ADDRESS = "0xYourContractAddressHere";

    try {
        const metadata: Metadata = {
            url: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
                }/api/dynamic-action`,
            icon: "https://avatars.githubusercontent.com/u/117962315",
            title: "Timestamped Message",
            baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
            description:
                "Store a message with an optimized timestamp calculated by our algorithm",
            actions: [
                {
                    type: "dynamic",
                    label: "Store Message",
                    description:
                        "Store your message with a custom timestamp calculated for optimal storage",
                    chains: { source: "fuji" },
                    path: `/api/example`,
                    params: [
                        {
                            name: "message",
                            label: "Your Message Hermano!",
                            type: "text",
                            required: true,
                            description:
                                "Enter the message you want to store on the blockchain",
                        },
                    ],
                    
                },
            ],
        };

        const validated: ValidatedMetadata = createMetadata(metadata);

        return NextResponse.json(validated, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            },
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create metadata" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest, res: NextResponse) {
    try {

        const { searchParams } = new URL(req.url);
        const message = searchParams.get("message");
        
        if (!message) {
            return NextResponse.json(
                { error: "Message parameter is required" },
                {
                    status: 400,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type, Authorization",
                    },
                }
            );
        }
        
        const tx = {
            to: '0x5ee75a1B1648C023e885E58bD3735Ae273f2cc52',
            value: BigInt(1000000),
            chainId: avalancheFuji.id,
        }

        const serialized = serialize(tx)

        const resp: ExecutionResponse = {
            serializedTransaction: serialized,
            chainId: avalancheFuji.name,
        }

        return NextResponse.json(resp, {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        });

    } catch (error) {
        console.error("Error in POST request:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );

    }
}


export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 204, // No Content
        headers: {
            "Access-Control-Allow-Origin": "*", 
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version", // Lista más completa de cabeceras comunes
        },
    });
}

