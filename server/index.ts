import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "*", // Secure in prod
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3000;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("request_sanction_flavor", async (data) => {
    const { actionType, title, context } = data;
    console.log(`Generating flavor for ${actionType}...`);

    try {
      const prompt = `
        You are the Royal Scribe of a medieval kingdom.
        The King is considering the following action: "${title}".
        Context: ${JSON.stringify(context)}
        
        Write a short, immersive paragraph (max 3 sentences) describing the situation and the potential consequences. 
        Use a tone appropriate for a ${
          context.authorityTier || "normal"
        } authority ruler.
        If authority is 'ignored', be slightly disrespectful or urgent.
        If authority is 'revered', be highly praiseful and obedient.
        
        Output ONLY the korean text, no quotes.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      socket.emit("sanction_flavor_response", { text });
    } catch (error) {
      console.error("Gemini Error:", error);
      socket.emit("sanction_flavor_response", {
        text: "The scribes are silent... (AI Error)",
      });
    }
  });

  socket.on("chat", async (msg) => {
    console.log("Message received:", msg);

    try {
      // Simple Chatbot for now
      const prompt = `
        You are a wise advisor to the King.
        User says: "${msg}"
        Respond briefly in character.
      `;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      io.emit("chat", { user: "Advisor", text });
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      io.emit("chat", { user: "System", text: "The advisor is confused." });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Echoes of History API Server with Gemini");
});

// [UptimeRobot 전용 라우트]
// 브라우저에서 /ping으로 접속하면 "pong"이라고 0.001초 만에 대답함.
app.get("/ping", (req, res) => {
  res.send("pong");
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
