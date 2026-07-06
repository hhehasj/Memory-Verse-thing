const setting_btn = document.getElementById("setting-btn");
const quick_entry = document.getElementById("quick-entry");
const main_display = document.getElementById("main-display");
const translation_select = document.getElementById("translation-selection");
const books_select = document.getElementById("books");
const chapter_select = document.getElementById("chapter");
const save_selected = document.getElementById("save-selected");
const verse_select = document.getElementById("verse");

let Original;
let Blanks;
let cursorIndex;

function return_versions_book(version, book) {
  const default_versions = new Map([
    ["NIV", 111],
    ["AMP", 1588],
    ["NASB", 2692],
  ]);

  const abbrev_books = new Map([
    ["genesis", "GEN"],
    ["exodus", "EXO"],
    ["leviticus", "LEV"],
    ["numbers", "NUM"],
    ["deuteronomy", "DEU"],
    ["joshua", "JOS"],
    ["judges", "JDG"],
    ["ruth", "RUT"],
    ["1 samuel", "1SA"],
    ["2 samuel", "2SA"],
    ["1 kings", "1KI"],
    ["2 kings", "2KI"],
    ["1 chronicles", "1CH"],
    ["2 chronicles", "2CH"],
    ["ezra", "EZR"],
    ["nehemiah", "NEH"],
    ["esther", "EST"],
    ["job", "JOB"],
    ["psalms", "PSA"],
    ["proverbs", "PRO"],
    ["ecclesiastes", "ECC"],
    ["songs of solomon", "SNG"],
    ["songs of songs", "SNG"],
    ["isaiah", "ISA"],
    ["jeremiah", "JER"],
    ["lamentations", "LAM"],
    ["ezekiel", "EZK"],
    ["daniel", "DAN"],
    ["hosea", "HOS"],
    ["joel", "JOL"],
    ["amos", "AMO"],
    ["obadiah", "OBA"],
    ["jonah", "JON"],
    ["micah", "MIC"],
    ["nahum", "NAH"],
    ["habakkuk", "HAB"],
    ["zephaniah", "ZEP"],
    ["haggai", "HAG"],
    ["zechariah", "ZEC"],
    ["malachi", "MAL"],
    ["matthew", "MAT"],
    ["mark", "MRK"],
    ["luke", "LUK"],
    ["john", "JHN"],
    ["acts", "ACT"],
    ["romans", "ROM"],
    ["1 corinthians", "1CO"],
    ["2 corinthians", "2CO"],
    ["galatians", "GAL"],
    ["ephesians", "EPH"],
    ["philippians", "PHP"],
    ["colossians", "COL"],
    ["1 thessalonians", "1TH"],
    ["2 thessalonians", "2TH"],
    ["1 timothy", "1TI"],
    ["2 timothy", "2TI"],
    ["titus", "TIT"],
    ["philemon", "PHM"],
    ["hebrews", "HEB"],
    ["james", "JAS"],
    ["1 peter", "1PE"],
    ["2 peter", "2PE"],
    ["1 john", "1JN"],
    ["2 john", "2JN"],
    ["3 john", "3JN"],
    ["jude", "JUD"],
    ["revelation", "REV"],
  ]);

  let return_values = new Array();

  if (default_versions.has(version)) {
    return_values.push(default_versions.get(version));
  }

  if (abbrev_books.has(book)) {
    return_values.push(abbrev_books.get(book));
  }

  return return_values;
}

function renderDisplay() {
  let htmlOutput = "";

  // Display the blanks and the cursor
  for (let i = 0; i < Blanks.length; i++) {
    let className = "";

    if (Blanks[i].status === "non-alphanumeric") {
      htmlOutput += Blanks[i].character;
      continue;
    }

    // Show what the user typed, or "_" if not yet reached
    const displayCharacter = Blanks[i].character;

    if (i === cursorIndex && main_display.dataset.userType === "true") {
      className = "typing_cursor";
    } else if (Blanks[i].status === "true") {
      className = "char_correct";
    } else if (Blanks[i].status === "false") {
      className = "char_wrong";
    }
    htmlOutput += `<span class="${className}">${displayCharacter}</span>`;
  }
  main_display.innerHTML = htmlOutput;
}

quick_entry.addEventListener("keydown", async (event) => {
  if (event.key == "Enter") {
    Original = "";
    Blanks = [];
    cursorIndex = 0;

    main_display.dataset.userType = "true";
    main_display.setAttribute("contenteditable", "true");

    const [entry_book, chapter, verse] = event.target.value.split(/[\s:]/);
    const entry_translation = "NIV";

    const [translation, book] = return_versions_book(entry_translation, entry_book.toLowerCase());

    event.target.value = "";

    const mv_title = document.getElementById("mv-title");
    mv_title.innerHTML = `${entry_translation} ${entry_book} ${chapter}:${verse}`;

    const server_response = await fetch(`http://localhost:8080/${translation}/${book}/${chapter}/${verse}`);
    Original = await server_response.json();
    console.log("API: ", Original);

    // TODO: Convert letters into blanks inside an array
    for (let i = 0; i < Original.length; i++) {
      if (/[a-zA-Z0-9]/.test(Original[i])) {
        Blanks.push({
          character: "_",
          status: "pending",
        });
      } else {
        Blanks.push({
          character: Original[i],
          status: "non-alphanumeric",
        });
      }
    }

    // Initial rendering
    renderDisplay();

    quick_entry.blur();
    main_display.focus();
  }
});

main_display.addEventListener("keydown", (event) => {
  if (main_display.dataset.userType !== "true") {
    return;
  }

  if (event.key === "Backspace") {
    event.preventDefault();
    if (cursorIndex > 0) {
      cursorIndex--;

      while (cursorIndex > 0 && Blanks[cursorIndex].status === "non-alphanumeric") {
        cursorIndex--;
      }
      Blanks[cursorIndex].character = "_";
      Blanks[cursorIndex].status = "pending";
      renderDisplay();
    }
    return;
  }

  if (event.key.length !== 1 || !/[a-zA-Z0-9]/.test(event.key)) {
    return;
  }

  event.preventDefault();

  // Store what the user typed, then mark correct or wrong.
  Blanks[cursorIndex].character = event.key;
  if (event.key === Original[cursorIndex]) {
    Blanks[cursorIndex].status = "true";
  } else {
    Blanks[cursorIndex].status = "false";
  }
  cursorIndex++;

  while (cursorIndex < Blanks.length && Blanks[cursorIndex].status !== "pending") {
    cursorIndex++;
  }

  if (cursorIndex >= Blanks.length) {
    main_display.dataset.userType = "false";
    main_display.setAttribute("contenteditable", "false");
  }

  renderDisplay();
});

books_select.addEventListener("click", async (event) => {
  const max_chapters = new Map([
    ["genesis", 50],
    ["exodus", 40],
    ["leviticus", 27],
    ["numbers", 36],
    ["deuteronomy", 34],
    ["joshua", 24],
    ["judges", 21],
    ["ruth", 4],
    ["1 samuel", 31],
    ["2 samuel", 24],
    ["1 kings", 22],
    ["2 kings", 25],
    ["1 chronicles", 29],
    ["2 chronicles", 36],
    ["ezra", 10],
    ["nehemiah", 13],
    ["esther", 10],
    ["job", 42],
    ["psalms", 150],
    ["proverbs", 31],
    ["ecclesiastes", 12],
    ["songs of solomon", 8],
    ["isaiah", 66],
    ["jeremiah", 52],
    ["lamentations", 5],
    ["ezekiel", 48],
    ["daniel", 12],
    ["hosea", 14],
    ["joel", 3],
    ["amos", 9],
    ["obadiah", 1],
    ["jonah", 4],
    ["micah", 7],
    ["nahum", 3],
    ["habakkuk", 3],
    ["zephaniah", 3],
    ["haggai", 2],
    ["zechariah", 14],
    ["malachi", 4],
    ["matthew", 28],
    ["mark", 16],
    ["luke", 24],
    ["john", 21],
    ["acts", 28],
    ["romans", 16],
    ["1 corinthians", 16],
    ["2 corinthians", 13],
    ["galatians", 6],
    ["ephesians", 6],
    ["philippians", 4],
    ["colossians", 4],
    ["1 thessalonians", 5],
    ["2 thessalonians", 3],
    ["1 timothy", 6],
    ["2 timothy", 4],
    ["titus", 3],
    ["philemon", 1],
    ["hebrews", 13],
    ["james", 5],
    ["1 peter", 5],
    ["2 peter", 3],
    ["1 john", 5],
    ["2 john", 1],
    ["3 john", 1],
    ["jude", 1],
    ["revelation", 22],
  ]);
  const users_book_selected = event.target.value;

  let chaptersOutput = "";
  if (max_chapters.has(users_book_selected)) {
    const max_chapter_book = max_chapters.get(users_book_selected);

    for (let i = 0; i < max_chapter_book; i++) {
      chaptersOutput += `<option value=${i + 1}>${i + 1}</option>`; // Makes getting the max easier I think
    }

    chapter_select.innerHTML = chaptersOutput;
  }
});

chapter_select.addEventListener("click", async (event) => {
  try {
    console.log(event.target.value);
    const [translation_id, book_abbrev] = return_versions_book("NIV", books_select.value);
    // TEST: console.log(translation_id, book_abbrev, event.target.value);

    const response = await fetch(`http://localhost:8080/${translation_id}/${book_abbrev}/${event.target.value}/`);
    const api_data = await response.json();
    // TEST: console.log(api_data.data.length);

    const verses_select = document.getElementById("verse");
    let max_verses = api_data.data.length;

    let versesOutput = "";
    for (let j = 0; j < max_verses; j++) {
      versesOutput += `<option value=${j + 1}>${j + 1}</option>`;
    }

    verses_select.innerHTML = versesOutput;
  } catch (err) {
    console.error(err);
  }
});

save_selected.addEventListener("click", async (event) => {
  console.log("Saving\n");

  const selected = document.getElementById("verse").selectedOptions;
  const start = Number(selected[0].value);
  const end = Number(selected[selected.length - 1].value);

  let verse_formatted = start === end ? `${start}` : `${start}-${end}`;

  const [translation_id, book_abbrev] = return_versions_book(translation_select.value, books_select.value);
  console.log(translation_id, book_abbrev, chapter_select.value, verse_formatted);
  try {
    const server_response = await fetch(`http://localhost:8080/add_verse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        translationID: translation_id,
        book: book_abbrev,
        chapter: chapter_select.value,
        verse: verse_formatted,
      }),
    });
  } catch (err) {
    console.error("Network error:", err);
  }
});

let clicked = false;
setting_btn.addEventListener("click", () => {
  const setting_window = document.getElementById("settings-window");
  const overlay = document.getElementById("overlay");

  if (!clicked) {
    clicked = true;
    setting_window.style.transform = "translateX(0)";
    overlay.style.opacity = "1";
    overlay.style.visibility = "visible";
  } else {
    clicked = false;
    setting_window.style.transform = "translateX(-150%)";
    overlay.style.opacity = "0";
    overlay.style.visibility = "hidden";
  }
});
