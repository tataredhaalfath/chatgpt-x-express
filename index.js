require('dotenv').config()
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const express = require("express");
const app = express();
const axios = require("axios");
const { OpenAI } = require("openai");

// Ganti dengan API Key yang Anda peroleh dari OpenAI
console.log("OPENAI :", OPENAI_API_KEY)

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

global.openai = openai;
global.testing = "testing";
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Menampilkan halaman utama
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/chat", async (req, res) => {
  const { conversation } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      messages: conversation,
      model: "gpt-3.5-turbo",
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });

    // const stream = await openai.chat.completions.create({
    //   model: 'gpt-3.5-turbo',
    //   messages: [{ role: 'user', content: message}],
    //   stream: true,
    // });
    // for await (const part of stream) {
    //   console.log("Part :", part.choices[0]?.delta)
    //   // process.stdout.write(part.choices[0]?.delta?.content || '');
    // }
    // res.send("oke")
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(8000, () => console.log("Server listen on port 8000"));
