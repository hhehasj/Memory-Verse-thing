const setting_btn = document.getElementById("setting-btn");
const quick_entry = document.getElementById("quick-entry");
const main_display = document.getElementById("main-display");

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

quick_entry.addEventListener("keydown", async (event) => {
  if (event.key == "Enter") {
    Original = "";
    Blanks = [];
    cursorIndex = 0;

    main_display.dataset.userType = "true";

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

main_display.addEventListener("keydown", (event) => {
  if (main_display.dataset.userType !== "true") {
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
  }

  renderDisplay();
});

let clicked = false;
setting_btn.addEventListener("click", () => {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  if (!clicked) {
    clicked = true;
    sidebar.style.transform = "translateX(0)";
    overlay.style.opacity = "1";
    overlay.style.visibility = "visible";
  } else {
    clicked = false;
    sidebar.style.transform = "translateX(-100%)";
    overlay.style.opacity = "0";
    overlay.style.visibility = "hidden";
  }
});
