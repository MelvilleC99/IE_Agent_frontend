import { NextResponse } from 'next/server';

// The system prompt for the industrial engineering agent - updated to be more conversational
const industrialEngineeringPrompt = `
You are Megan, a friendly and helpful industrial engineering AI assistant for a manufacturing facility. You should be conversational, concise, and helpful.

When responding:
- Keep your answers brief and to the point (2-3 sentences when possible)
- Use a casual, friendly tone as if talking to a colleague
- Be direct and helpful without unnecessary formality
- Only offer analytical details when specifically asked
- For greetings or simple questions, respond in a natural, conversational way
- Don't list multiple numbered options unless asked for alternatives

You have access to the factory's production data and can analyze efficiency, quality, and resource utilization when asked.
`;

// Sample factory data (in a real implementation, this would come from your database)
const factoryData = {
    "production": {
        "overallEfficiency": 87.3,
        "productionOutput": 24892,
        "downtime": 4.2,
        "productionByLine": {
            "line1": 8245,
            "line2": 6932,
            "line3": 5478,
            "line4": 4237
        }
    },
    "efficiency": {
        "assembly": 92,
        "packaging": 87,
        "qualityControl": 94
    },
    "quality": {
        "firstPassYield": 98.7,
        "defectRate": 0.8,
        "customerReturns": 0.3,
        "reworkRate": 1.2
    },
    "resources": {
        "laborUtilization": {
            "productive": 82,
            "setup": 8,
            "idle": 6,
            "downtime": 4
        },
        "equipmentUtilization": {
            "running": 78,
            "setup": 12,
            "idle": 6,
            "maintenance": 4
        }
    }
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { query } = body;

        console.log("Received query:", query);
        console.log("DeepSeek API key exists:", !!process.env.DEEPSEEK_API_KEY);

        // Call DeepSeek API
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content: industrialEngineeringPrompt
                    },
                    {
                        role: "user",
                        content: `Here is the current factory data:
            
${JSON.stringify(factoryData, null, 2)}

Based on this data, please answer the following query:
${query}`
                    }
                ],
            })
        });

        console.log("DeepSeek API response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("DeepSeek API error:", errorText);
            throw new Error(`DeepSeek API error: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log("DeepSeek API response:", data);

        // Return the AI response
        return NextResponse.json({
            aiResponse: data.choices[0].message.content
        });
    } catch (error: unknown) {
        console.error('Error processing query:', error);

        let errorMessage = 'Failed to process query';
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return NextResponse.json(
            { error: 'Failed to process query', details: errorMessage },
            { status: 500 }
        );
    }
}