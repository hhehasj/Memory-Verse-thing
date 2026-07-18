import { MongoClient, ServerApiVersion } from "mongodb";
import { get_passage } from "./get_bible.ts";
import "dotenv/config";

const url = process.env.MONGO_URL;

const clientOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true, // Changed ; to nothing (or a comma if more properties follow)
  },
};
const client = new MongoClient(url, clientOptions);

const databaseName = "MemoryVerse-Thing";

export async function loadVerses() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    // TEST: console.log("CONNECTED");

    const db = client.db(databaseName);
    const collection = db.collection("Verses");

    const VersesArray: Array<Array<string>> = new Array();

    const db_Verses_array = await collection.find({}).toArray();

    db_Verses_array.forEach((db_Verse) => {
      let VersesContent: Array<string> = new Array();
      VersesContent.push(db_Verse.completed);
      VersesContent.push(db_Verse.passage);

      VersesArray.push(VersesContent);
    });

    // TEST: console.dir(VersesArray);
    return VersesArray;
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
}

export async function addVerse(translation_id: number, book_abbrev: string, chapter: string, verses: string) {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    // TEST: console.log("CONNECTED");

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
    // TEST: console.log("Inserted documents =>", insertResult);

    return "done";
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
}
