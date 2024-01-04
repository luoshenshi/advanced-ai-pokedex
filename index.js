require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
const fs = require("fs");
const { pokedex } = require("real-pokedex");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.static(__dirname + "/public"));

app.get("/pokemonInfo", async (req, res) => {
  const nameOrNumb = req.query.nn;
  await pokedex(nameOrNumb, (response) => {
    res.json(response);
  });
});

app.post("/predict", async (req, res) => {
  let base64Image = req.body.image.replace(/^data:image\/\w+;base64,/, "");
  let buffer = Buffer.from(base64Image, "base64");

  fs.writeFile("imagepip.jpeg", buffer, async (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error saving the image");
    } else {
      try {
        let data = fs.readFileSync("imagepip.jpeg");
        // Convert the image data to base64
        let base64Image = Buffer.from(data).toString("base64");

        const result = await model.generateContent([
          "I want you to answer in one word only. Which pokemon is this, answer in one word only!",
          { inlineData: { data: base64Image, mimeType: "image/png" } },
        ]);
        res.json(result.response.candidates[0].content.parts[0].text);
      } catch (err) {
        console.error(err);
      }
    }
  });
});

app.listen(3000, () => {
  console.log("listening");
});
