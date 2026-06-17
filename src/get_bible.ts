import { FreeUseBibleApi } from "free-use-bible-api";

const api = new FreeUseBibleApi();

const available = await api.getAvailableTranslations();
console.log("Total translations:", available.translations.length);

const books = await api.getTranslationBooks("BSB");
console.log("Books in BSB:", books.books.length);

const chapter = await api.getTranslationBookChapter("BSB", "GEN", 1);
console.log("Verses in Genesis 1:", chapter.numberOfVerses);
