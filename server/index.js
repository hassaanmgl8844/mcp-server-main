// import express from "express";
// import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
// import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
// import { createPost } from "./mcp.tool.js";
// import { z } from "zod";
// import fs from 'fs';
// import fetch from 'node-fetch';

// const server = new McpServer({
//     name: "example-server",
//     version: "1.0.0"
// });

// const app = express();

// // Sample math tool
// server.tool(
//     "addTwoNumbers",
//     "Add two numbers",
//     {
//         a: z.number(),
//         b: z.number()
//     },
//     async ({ a, b }) => ({
//         content: [
//             {
//                 type: "text",
//                 text: `The sum of ${a} and ${b} is ${a + b}`
//             }
//         ]
//     })
// );

// // Post to X (Twitter)
// server.tool(
//     "createPost",
//     "Create a post on X (formerly Twitter)", {
//     status: z.string()
// }, async ({ status }) => createPost(status));

// /* Pollinations Tools */

// // 🖼️ Image Generation
// server.tool(
//     "generateImage",
//     "Generate an image from a text prompt",
//     {
//         prompt: z.string(),
//         width: z.number().optional().default(1024),
//         height: z.number().optional().default(1024),
//         seed: z.number().optional().default(42),
//         model: z.string().optional().default("flux")
//     },
//     async ({ prompt, width, height, seed, model }) => {
//         const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${seed}&model=${model}`;
//         const response = await fetch(imageUrl);
//         const buffer = await response.buffer();
//         fs.writeFileSync("image.png", buffer);

//         return {
//             content: [
//                 {
//                     type: "text",
//                     text: "Image generated and saved as image.png"
//                 },
//                 {
//                     type: "image",
//                     image_url: imageUrl
//                 }
//             ]
//         };
//     }
// );

// // 📝 Text Generation
// server.tool(
//     "generateText",
//     "Generate creative text",
//     {
//         prompt: z.string()
//     },
//     async ({ prompt }) => {
//         const response = await fetch('https://text.pollinations.ai/', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 messages: [
//                     { role: 'user', content: prompt }
//                 ],
//                 model: 'openai',
//                 private: true
//             })
//         });

//         const data = await response.text();
//         return {
//             content: [
//                 {
//                     type: "text",
//                     text: `Generated Text:\n${data}`
//                 }
//             ]
//         };
//     }
// );

// // 🔊 Audio Generation (Text-to-Speech)
// server.tool(
//     "generateAudio",
//     "Convert text to speech",
//     {
//         text: z.string(),
//         voice: z.string().optional().default("nova")
//     },
//     async ({ text, voice }) => {
//         const url = `https://text.pollinations.ai/${encodeURIComponent(text)}?model=openai-audio&voice=${voice}`;
//         const response = await fetch(url);
//         const buffer = await response.buffer();
//         fs.writeFileSync("generated_audio.mp3", buffer);

//         return {
//             content: [
//                 {
//                     type: "text",
//                     text: "Audio generated and saved as generated_audio.mp3"
//                 }
//             ]
//         };
//     }
// );

// // Setup for SSE and POST message handling
// const transports = {};

// app.get("/sse", async (req, res) => {
//     const transport = new SSEServerTransport('/messages', res);
//     transports[transport.sessionId] = transport;
//     res.on("close", () => {
//         delete transports[transport.sessionId];
//     });
//     await server.connect(transport);
// });

// app.post("/messages", async (req, res) => {
//     const sessionId = req.query.sessionId;
//     const transport = transports[sessionId];
//     if (transport) {
//         await transport.handlePostMessage(req, res);
//     } else {
//         res.status(400).send('No transport found for sessionId');
//     }
// });

// app.listen(3001, () => {
//     console.log("Server is running on http://localhost:3001");
// });


import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { createPost } from "./mcp.tool.js";
import { z } from "zod";
import fs from 'fs';
import fetch from 'node-fetch';

const server = new McpServer({
    name: "example-server",
    version: "1.0.0"
});

const app = express();

// ✅ Math Tool
server.tool(
    "addTwoNumbers",
    "Add two numbers",
    {
        a: z.number(),
        b: z.number()
    },
    async ({ a, b }) => ({
        content: [
            {
                type: "text",
                text: `The sum of ${a} and ${b} is ${a + b}`
            }
        ]
    })
);

// ✅ Twitter Posting
server.tool(
    "createPost",
    "Create a post on X (formerly Twitter)",
    {
        status: z.string()
    },
    async ({ status }) => createPost(status)
);

// ✅ 🖼 Image Generation Tool (Pollinations)
server.tool(
    "generateImage",
    "Generate an image from a prompt",
    {
        prompt: z.string(),
        width: z.number().optional().default(1024),
        height: z.number().optional().default(1024),
        seed: z.number().optional().default(42),
        model: z.string().optional().default("flux")
    },
    async ({ prompt, width, height, seed, model }) => {
        const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${seed}&model=${model}&logo=${false}`;
        const response = await fetch(imageUrl);
        const buffer = await response.buffer();

        fs.writeFileSync("generated_image.png", buffer);

        return {
            content: [
                {
                    type: "text",
                    text: `✅ Image generated successfully!\n📸 URL: ${imageUrl}\n💾 Saved as generated_image.png`
                }
            ]
        };
    }
);

// ✅ 🔊 Audio Generation Tool (Pollinations)
server.tool(
    "generateAudio",
    "Generate audio from text",
    {
        text: z.string(),
        voice: z.string().optional().default("nova")
    },
    async ({ text, voice }) => {
        const audioUrl = `https://text.pollinations.ai/${encodeURIComponent(text)}?model=openai-audio&voice=${voice}`;
        const response = await fetch(audioUrl);
        const buffer = await response.buffer();

        fs.writeFileSync("generated_audio.mp3", buffer);

        return {
            content: [
                {
                    type: "text",
                    text: `✅ Audio generated successfully!\n🔊 URL: ${audioUrl}\n💾 Saved as generated_audio.mp3`
                }
            ]
        };
    }
);

// ✅ 📝 Text Generation Tool (Pollinations)
server.tool(
    "generateText",
    "Generate creative text from a prompt",
    {
        prompt: z.string()
    },
    async ({ prompt }) => {
        const response = await fetch('https://text.pollinations.ai/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'user', content: prompt }],
                model: 'openai',
                private: true
            })
        });

        const data = await response.text();

        return {
            content: [
                {
                    type: "text",
                    text: `📝 Generated Text:\n${data}`
                }
            ]
        };
    }
);

// 🧩 MCP SSE Setup
const transports = {};

app.get("/sse", async (req, res) => {
    const transport = new SSEServerTransport('/messages', res);
    transports[transport.sessionId] = transport;

    res.on("close", () => {
        delete transports[transport.sessionId];
    });

    await server.connect(transport);
});

app.post("/messages", async (req, res) => {
    const sessionId = req.query.sessionId;
    const transport = transports[sessionId];

    if (transport) {
        await transport.handlePostMessage(req, res);
    } else {
        res.status(400).send('No transport found for sessionId');
    }
});

app.listen(3001, () => {
    console.log("✅ Server running at: http://localhost:3001");
});
