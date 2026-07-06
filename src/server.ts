import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { get_passage, get_max_verses } from "./get_bible.ts";
import { addVerse } from "./database.ts";

const app = express();
const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public"));
});

app.get("/:translation/:book/:chapter/", async (req, res) => {
  // console.log("Function invoked");
  const { translation, book, chapter } = req.params;
  // TEST: console.log(Number(translation), book, chapter);
  // TEST: console.log(typeof Number(translation), typeof book, typeof chapter);

  try {
    const api_return = await get_max_verses(Number(translation), book, chapter);
    // TEST: console.log(api_return, typeof api_return);
    res.json(api_return);
  } catch (err) {
    console.error(err);
  }
});

app.get("/:translation/:book/:chapter/:verse", async (req, res) => {
  const { translation, book, chapter, verse } = req.params;
  // TEST: console.log(Number(translation), book, chapter, verse);
  // TEST: console.log(typeof Number(translation), typeof book, typeof chapter, typeof verse);

  try {
    const api_passage = await get_passage(Number(translation), book, chapter, verse);
    // TEST: console.log(passage, typeof passage);
    res.json(api_passage);
  } catch (err) {
    console.error(err);
  }
});

app.post("/add_verse/", async (req, res) => {
  console.log("In server\n");

  try {
    const { translationID, book, chapter, verse } = req.body;
    // console.log(translationID, book, chapter, verse);
    addVerse(Number(translationID), book, chapter, verse);
  } catch (err) {
    console.log(err);
  }
});
