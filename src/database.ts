import { MongoClient } from "mongodb";
import { get_passage } from "./get_bible.ts";

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

const databaseName = "MemoryVerse-Thing";

export async function loadVerses() {
  console.log("Reading\n");
  await client.connect();

  const db = client.db(databaseName);
  const collection = db.collection("Verses");

  const results = await collection.find({}).toArray();
  console.log("Found documents => ", results);
}

export async function addVerse(translation_id: number, book_abbrev: string, chapter: string, verses: string) {
  await client.connect();

  const db = client.db(databaseName);
  const collection = db.collection("Verses");

  const api_response = await get_passage(translation_id, book_abbrev, chapter, verses);

  const insertResult = await collection.insertOne({
    passage: api_response.content,
    components: {
      translation_id: translation_id,
      book_abbrev: book_abbrev,
      chapter: chapter,
      verses: verses,
    },
    api_id: api_response.id,
    completed: api_response.reference,
  });
  console.log("Inserted documents =>", insertResult);

  return "done";
}
