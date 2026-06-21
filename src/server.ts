import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { get_passage } from "./get_bible.ts";

const app = express();
const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../public")));
app.use(cors());

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public"));
});

app.get("/:translation/:book/:chapter/:verse", async (req, res) => {
  const { translation, book, chapter, verse } = req.params;
  // TEST: console.log(Number(translation), book, chapter, verse);
  // TEST: console.log(typeof Number(translation), typeof book, typeof chapter, typeof verse);

  get_passage(Number(translation), book, chapter, verse);
});
