// import express from "express";
// import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
// import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
// import { createPost } from "./mcp.tool.js";
// import { z } from "zod";
// import fs from "fs";
// import fetch from "node-fetch";
// import { exec } from "child_process";
// import path from "path";

// const server = new McpServer({
//   name: "example-server",
//   version: "1.0.0",
// });

// const app = express();

// const mediaDir = path.resolve("./media");
// if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir);
// let mediaPaths = [];
// const getArrayFromAi = (title) => {
//     const prompt = `Generate a video script about the title: [${title}] in JSON format, structured as an array of scenes. Each scene should have the following properties:

//     - scene_duration: Number (in seconds), determined based on the audio text length.
//     - scene_description: A clear and detailed description of events in the scene, including visuals and actions relevant to the script. Make sure the scenes flow well, creating a cohesive storyline.
//     - audio_text: A fitting narration or dialogue that corresponds to the scene’s action and theme. This should be relevant to the visual description and add depth to the scene.
//     - image_prompt: A description of visual elements needed for generating images or animations based on the scene, such as colors, characters, emotions, or environments.
//     - image_file_name: Automatically generate the filename for the scene’s image, e.g., "scene1_image.png".
//     - audio_file_name: Automatically generate the filename for the scene’s audio, e.g., "scene1_audio.mp3".
    
//     You are allowed to create the scenes based on your understanding of the topic, but ensure the script fits into a 1-minute video short (around 60 seconds in total). Each scene should have an appropriate duration based on the importance of the content.
    
//     Do not ask any further questions, just generate the full script with the specified scene details.
    
//     Example response for a 1-minute video about "Naruto":
    
//     [
//       {
//         "scene_duration": 12,
//         "scene_description": "Naruto, feeling the wind on his face.",
//         "audio_text": "I've come so  so much to do.",
//         "image_prompt": "Naruto on a with a look of determination.",
//         "image_file_name": "scene1_image.png",
//         "audio_file_name": "scene1_audio.mp3"
//       },
//       {
//         "scene_duration": 22,
//         "scene_description": "Naruto recalls his childhood, the lonely days when the villagers ignored him. He clenches his fist with resolve.",
//         "audio_text": "No one believ my name.",
//         "image_prompt": "Young Narut his eyes.",
//         "image_file_name": "scene2_image.png",
//         "audio_file_name": "scene2_audio.mp3"
//       }
//     ]
//     `;
    
//     console.log(prompt);
    
// };

// server.tool(
//   "generateMediaVideo",
//   "Generate an image, audio, and video from a prompt",
//   async ({ prompt, width, height, seed, model, voice }) => {
//     const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(
//       prompt
//     )}?width=${width}&height=${height}&seed=${seed}&model=${model}&logo=false`;
//     const audioUrl = `https://text.pollinations.ai/${encodeURIComponent(
//       prompt
//     )}?model=openai-audio&voice=${voice}`;

//     const imagePath = path.join(mediaDir, "generated_image.png");
//     const audioPath = path.join(mediaDir, "generated_audio.mp3");
//     const videoPath = path.join(mediaDir, "generated_video.mp4");

//     // Download and save image
//     const imageResponse = await fetch(imageUrl);
//     const imageBuffer = await imageResponse.buffer();
//     fs.writeFileSync(imagePath, imageBuffer);

//     // Download and save audio
//     const audioResponse = await fetch(audioUrl);
//     const audioBuffer = await audioResponse.buffer();
//     fs.writeFileSync(audioPath, audioBuffer);
//   }
// );

// // Twitter Posting Tool
// server.tool(
//   "createPost",
//   "Create a post on X (formerly Twitter)",
//   {
//     status: z.string(),
//   },
//   async ({ status }) => createPost(status)
// );

// // MCP SSE Setup
// const transports = {};

// app.get("/sse", async (req, res) => {
//   const transport = new SSEServerTransport("/messages", res);
//   transports[transport.sessionId] = transport;

//   res.on("close", () => {
//     delete transports[transport.sessionId];
//   });

//   await server.connect(transport);
// });

// app.post("/messages", async (req, res) => {
//   const sessionId = req.query.sessionId;
//   const transport = transports[sessionId];

//   if (transport) {
//     await transport.handlePostMessage(req, res);
//   } else {
//     res.status(400).send("No transport found for sessionId");
//   }
// });

// app.listen(3001, () => {
//   console.log("✅ Server running at: http://localhost:3001");
// });

// import express from "express";
// import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
// import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
// import { createPost } from "./mcp.tool.js";
// import { z } from "zod";
// import fs from "fs";
// import fetch from "node-fetch";
// import { exec } from "child_process";
// import path from "path";
// import bodyParser from "body-parser";

// const server = new McpServer({
//   name: "example-server",
//   version: "1.0.0",
// });

// const app = express();
// app.use(bodyParser.json());

// const mediaDir = path.resolve("./media");
// if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir);

// let mediaPaths = [];

// // Util to download and process each scene
// const processScenes = async (scenes) => {
//   mediaPaths = []; // reset for each new run

//   for (const scene of scenes) {
//     const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(scene.image_prompt)}?width=512&height=512&seed=123&model=stable-diffusion&logo=false`;
//     const audioUrl = `https://text.pollinations.ai/${encodeURIComponent(scene.audio_text)}?model=openai-audio&voice=onyx`;

//     const imagePath = path.join(mediaDir, scene.image_file_name);
//     const audioPath = path.join(mediaDir, scene.audio_file_name);

//     try {
//       const imageResponse = await fetch(imageUrl);
//       const imageBuffer = await imageResponse.buffer();
//       fs.writeFileSync(imagePath, imageBuffer);

//       const audioResponse = await fetch(audioUrl);
//       const audioBuffer = await audioResponse.buffer();
//       fs.writeFileSync(audioPath, audioBuffer);

//       mediaPaths.push({ image: imagePath, audio: audioPath });
//       console.log(`✅ Downloaded: ${scene.image_file_name} & ${scene.audio_file_name}`);
//     } catch (err) {
//       console.error(`❌ Error downloading media for scene: ${scene.image_file_name}`, err);
//     }
//   }

//   console.log("🎉 All media downloaded.");
//   console.log(mediaPaths);
// };

// // Simulated AI Scene Generator (replace this with actual AI call if needed)
// const getArrayFromAi = async (title) => {
//   const exampleScenes = [
//     {
//       scene_duration: 10,
//       scene_description: "A bustling city street at sunrise.",
//       audio_text: "The day begins with endless possibilities.",
//       image_prompt: "City street at sunrise with golden light and people walking.",
//       image_file_name: "scene1_image.png",
//       audio_file_name: "scene1_audio.mp3"
//     },
//     {
//       scene_duration: 15,
//       scene_description: "A young woman sits at a cafe, deep in thought.",
//       audio_text: "She reflects on the choices that led her here.",
//       image_prompt: "Woman at outdoor cafe with coffee, thoughtful expression.",
//       image_file_name: "scene2_image.png",
//       audio_file_name: "scene2_audio.mp3"
//     }
//   ];

//   await processScenes(exampleScenes);
//   return exampleScenes;
// };

// // MCP tool to generate media for a given prompt
// server.tool(
//   "generateMediaVideo",
//   "Generate image, audio, and video from a prompt",
//   async ({ prompt }) => {
//     const scenes = await getArrayFromAi(prompt);
//     return {
//       message: "Media generated successfully.",
//       mediaPaths,
//       scenes
//     };
//   }
// );

// // Twitter Posting Tool
// server.tool(
//   "createPost",
//   "Create a post on X (formerly Twitter)",
//   {
//     status: z.string(),
//   },
//   async ({ status }) => createPost(status)
// );

// // SSE Transport Setup
// const transports = {};

// app.get("/sse", async (req, res) => {
//   const transport = new SSEServerTransport("/messages", res);
//   transports[transport.sessionId] = transport;

//   res.on("close", () => {
//     delete transports[transport.sessionId];
//   });

//   await server.connect(transport);
// });

// app.post("/messages", async (req, res) => {
//   const sessionId = req.query.sessionId;
//   const transport = transports[sessionId];

//   if (transport) {
//     await transport.handlePostMessage(req, res);
//   } else {
//     res.status(400).send("No transport found for sessionId");
//   }
// });

// // Manual test endpoint (optional)
// app.get("/generate/:title", async (req, res) => {
//   try {
//     const scenes = await getArrayFromAi(req.params.title);
//     res.status(200).json({ message: "Media generated successfully", mediaPaths, scenes });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to generate media", details: err.message });
//   }
// });

// app.listen(3001, () => {
//   console.log("✅ Server running at: http://localhost:3001");
// });


import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { createPost } from "./mcp.tool.js";
import { z } from "zod";
import fs from "fs";
import fetch from "node-fetch";
import { exec } from "child_process";
import path from "path";
import bodyParser from "body-parser";

const server = new McpServer({
  name: "example-server",
  version: "1.0.0",
});

const app = express();

const mediaDir = path.resolve("./media");
if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir);

let mediaPaths = [];

// ✅ Skip body-parser for `/messages`
app.use((req, res, next) => {
  if (req.path === "/messages") return next();
  bodyParser.json()(req, res, next);
});

// Utility to generate media
const processScenes = async (scenes) => {
  mediaPaths = [];

  for (const scene of scenes) {
    const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(scene.image_prompt)}?width=512&height=512&seed=123&model=stable-diffusion&logo=false`;
    const audioUrl = `https://text.pollinations.ai/${encodeURIComponent(scene.audio_text)}?model=openai-audio&voice=onyx`;

    const imagePath = path.join(mediaDir, scene.image_file_name);
    const audioPath = path.join(mediaDir, scene.audio_file_name);

    try {
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.buffer();
      fs.writeFileSync(imagePath, imageBuffer);

      const audioResponse = await fetch(audioUrl);
      const audioBuffer = await audioResponse.buffer();
      fs.writeFileSync(audioPath, audioBuffer);

      mediaPaths.push({ image: imagePath, audio: audioPath });
      console.log(`✅ Downloaded: ${scene.image_file_name} & ${scene.audio_file_name}`);
    } catch (err) {
      console.error(`❌ Error downloading media for ${scene.image_file_name}`, err);
    }
  }

  console.log("🎉 All media downloaded.");
};

// Simulated AI response
const getArrayFromAi = async (title) => {
  const exampleScenes = [
    {
      scene_duration: 10,
      scene_description: "A bustling city street at sunrise.",
      audio_text: "The day begins with endless possibilities.",
      image_prompt: "City street at sunrise with golden light and people walking.",
      image_file_name: "scene1_image.png",
      audio_file_name: "scene1_audio.mp3"
    },
    {
      scene_duration: 15,
      scene_description: "A young woman sits at a cafe, deep in thought.",
      audio_text: "She reflects on the choices that led her here.",
      image_prompt: "Woman at outdoor cafe with coffee, thoughtful expression.",
      image_file_name: "scene2_image.png",
      audio_file_name: "scene2_audio.mp3"
    }
  ];

  await processScenes(exampleScenes);
  return exampleScenes;
};

// MCP tool: generate media
// server.tool(
//   "generateMediaVideo",
//   "Generate image, audio, and video from a prompt",
//   async ({ prompt }) => {
//     const scenes = await getArrayFromAi(prompt);
//     return {
//       message: "Media generated successfully.",
//       mediaPaths,
//       scenes
//     };
//   }
// );
server.tool(
    "generateMediaVideo",
    "Generate image, audio, and video from a prompt",
    async ({ prompt }) => {
      const scenes = await getArrayFromAi(prompt);
  
      const content = [
        {
          type: "text",
          text: `Media generated for topic: "${prompt}"`,
        },
        ...mediaPaths.flatMap(({ image, audio }, index) => [
          {
            type: "image",
            image: { url: `file://${image}` },
          },
          {
            type: "audio",
            audio: { url: `file://${audio}` },
          },
          {
            type: "text",
            text: `Scene ${index + 1}: ${scenes[index]?.scene_description}`,
          }
        ])
      ];
  
      return { content };
    }
  );
  


// MCP tool: post to Twitter/X
server.tool(
  "createPost",
  "Create a post on X (formerly Twitter)",
  {
    status: z.string(),
  },
  async ({ status }) => createPost(status)
);

// SSE transport setup
const transports = {};

app.get("/sse", async (req, res) => {
  const transport = new SSEServerTransport("/messages", res);
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
    res.status(400).send("No transport found for sessionId");
  }
});

// Optional test endpoint
app.get("/generate/:title", async (req, res) => {
  try {
    const scenes = await getArrayFromAi(req.params.title);
    res.status(200).json({ message: "Media generated successfully", mediaPaths, scenes });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate media", details: err.message });
  }
});

app.listen(3001, () => {
  console.log("✅ Server running at: http://localhost:3001");
});
