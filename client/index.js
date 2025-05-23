// import { config } from "dotenv";
// import readline from "readline/promises";
// import { GoogleGenAI } from "@google/genai";
// import { Client } from "@modelcontextprotocol/sdk/client/index.js";
// import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

// config();
// let tools = [];
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// const mcpClient = new Client({
//   name: "example-client",
//   version: "1.0.0",
// });

// const chatHistory = [];
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// mcpClient
//   .connect(new SSEClientTransport(new URL("http://localhost:3001/sse")))
//   .then(async () => {
//     console.log("Connected to mcp server");

//     tools = (await mcpClient.listTools()).tools.map((tool) => {
//       return {
//         name: tool.name,
//         description: tool.description,
//         parameters: {
//           type: tool.inputSchema.type,
//           properties: tool.inputSchema.properties,
//           required: tool.inputSchema.required,
//         },
//       };
//     });

//     chatLoop();
//   });

// async function chatLoop(toolCall) {
//   if (toolCall) {
//     console.log("calling tool ", toolCall.name);

//     chatHistory.push({
//       role: "model",
//       parts: [
//         {
//           text: `calling tool ${toolCall.name}`,
//           type: "text",
//         },
//       ],
//     });

//     const toolResult = await mcpClient.callTool({
//       name: toolCall.name,
//       arguments: toolCall.args,
//     });

//     chatHistory.push({
//       role: "user",
//       parts: [
//         {
//           text: "Tool result : " + toolResult.content[0].text,
//           type: "text",
//         },
//       ],
//     });
//   } else {
//     const question = await rl.question("You: ");
//     chatHistory.push({
//       role: "user",
//       parts: [
//         {
//           text: question,
//           type: "text",
//         },
//       ],
//     });
//   }

//   const response = await ai.models.generateContent({
//     model: "gemini-2.0-flash-001",
//     contents: chatHistory,
//     config: {
//       tools: [
//         {
//           functionDeclarations: tools,
//         },
//       ],
//     },
//   });

//   const functionCall = response.candidates[0].content.parts[0].functionCall;
//   const responseText = response.candidates[0].content.parts[0].text;

//   if (functionCall) {
//     return chatLoop(functionCall);
//   }

//   chatHistory.push({
//     role: "model",
//     parts: [
//       {
//         text: responseText,
//         type: "text",
//       },
//     ],
//   });

//   console.log(`AI: ${responseText}`);

//   chatLoop();
// }


// // import { config } from "dotenv";
// // import readline from "readline/promises";
// // import { GoogleGenAI } from "@google/genai";
// // import { Client } from "@modelcontextprotocol/sdk/client/index.js";
// // import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

// // config();
// // let tools = [];
// // const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// // const mcpClient = new Client({
// //   name: "example-client",
// //   version: "1.0.0",
// // });

// // const chatHistory = [];
// // const rl = readline.createInterface({
// //   input: process.stdin,
// //   output: process.stdout,
// // });

// // mcpClient
// //   .connect(new SSEClientTransport(new URL("http://localhost:3001/sse")))
// //   .then(async () => {
// //     console.log("Connected to mcp server");

// //     tools = (await mcpClient.listTools()).tools.map((tool) => {
// //       return {
// //         name: tool.name,
// //         description: tool.description,
// //         parameters: {
// //           type: tool.inputSchema.type,
// //           properties: tool.inputSchema.properties,
// //           required: tool.inputSchema.required,
// //         },
// //       };
// //     });

// //     chatLoop();
// //   });

// // async function chatLoop(toolCall) {
// //   if (toolCall) {
// //     console.log("calling tool ", toolCall.name);

// //     chatHistory.push({
// //       role: "model",
// //       parts: [
// //         {
// //           text: `calling tool ${toolCall.name}`,
// //           type: "text",
// //         },
// //       ],
// //     });

// //     const toolResult = await mcpClient.callTool({
// //       name: toolCall.name,
// //       arguments: toolCall.args,
// //     });

// //     chatHistory.push({
// //       role: "user",
// //       parts: [
// //         {
// //           text: "Tool result : " + toolResult.content[0].text,
// //           type: "text",
// //         },
// //       ],
// //     });
// //   } else {
// //     const question = await rl.question("You: ");
// //     chatHistory.push({
// //       role: "user",
// //       parts: [
// //         {
// //           text: question,
// //           type: "text",
// //         },
// //       ],
// //     });
// //   }

// //   const response = await ai.models.generateContent({
// //     // model: "gemini-2.0-flash",
// //     model: "gemini-2.0-flash-001",
// //     contents: chatHistory,
// //     config: {
// //       tools: [
// //         {
// //           functionDeclarations: tools,
// //         },
// //       ],
// //     },
// //   });
// //   const functionCall = response.candidates[0].content.parts[0].functionCall;
// //   const responseText = response.candidates[0].content.parts[0].text;

// //   if (functionCall) {
// //     return chatLoop(functionCall);
// //   }

// //   chatHistory.push({
// //     role: "model",
// //     parts: [
// //       {
// //         text: responseText,
// //         type: "text",
// //       },
// //     ],
// //   });

// //   console.log(`AI: ${responseText}`);

// //   chatLoop();
// // }

// const data = [
//   {
//     fileName: "image1.png",
//     fileType: "image/png",
//     filePath: "/path/to/image1.png",
//   }
// ]

// const audio = [
//   {
//     fileName: "image1.png",
//     fileType: "image/png",
//     filePath: "/path/to/image1.png",
//   }
// ]


import { config } from "dotenv";
import readline from "readline/promises";
import { GoogleGenAI } from "@google/genai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const chatHistory = [];
let tools = [];

const mcpClient = new Client({ name: "example-client", version: "1.0.0" });

mcpClient
  .connect(new SSEClientTransport(new URL("http://localhost:3001/sse")))
  .then(async () => {
    console.log("✅ Connected to MCP server");
    tools = (await mcpClient.listTools()).tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      parameters: {
        type: tool.inputSchema.type,
        properties: tool.inputSchema.properties,
        required: tool.inputSchema.required,
      },
    }));
    chatLoop();
  });

async function chatLoop(toolCall) {
  if (toolCall) {
    console.log("⚙️ Calling tool:", toolCall.name);
    const toolResult = await mcpClient.callTool({ name: toolCall.name, arguments: toolCall.args });

    chatHistory.push({ role: "model", parts: [{ type: "text", text: `Tool result:\n${toolResult.content[0].text}` }] });
  } else {
    const userInput = await rl.question("You: ");
    chatHistory.push({ role: "user", parts: [{ type: "text", text: userInput }] });
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-001",
    contents: chatHistory,
    config: {
      tools: [{ functionDeclarations: tools }],
    },
  });

  const part = response.candidates[0].content.parts[0];
  const functionCall = part.functionCall;
  const responseText = part.text;

  if (functionCall) return chatLoop(functionCall);

  chatHistory.push({ role: "model", parts: [{ type: "text", text: responseText }] });
  console.log(`🤖 AI: ${responseText}`);
  chatLoop();
}
