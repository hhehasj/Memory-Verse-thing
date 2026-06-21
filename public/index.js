const setting_btn = document.getElementById("setting-btn");
const quick_entry = document.getElementById("quick-entry");

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
    ["1 corinthians", "2CO"],
    ["2 corinthians", "2CO"],
    ["galatians", "GAL"],
    ["ephesians", "EPH"],
    ["philippians", "PHP"],
    ["colossians", "COl"],
    ["1 thessalonians", "1TH"],
    ["2 thessalonians", "2TH"],
    ["1 timothy", "1TI"],
    ["2 timothy", "2TI"],
    ["titus", "TIT"],
    ["philemon", "PHM"],
    ["hebrew", "HEB"],
    ["james", "JAS"],
    ["1 peter", "1PE"],
    ["2 peter", "2PE"],
    ["1 john", "1JN"],
    ["2 john", "2JN"],
    ["3 john", "3JN"],
    ["jude", "JUD"],
    ["revalation", "REV"],
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
    const [entry_book, chapter, verse] = event.target.value.split(/[\s:]/);
    const entry_translation = "NIV";
    // TEST: console.log(entry_book, typeof entry_book);
    // TEST: console.log(chapter, typeof chapter);
    // TEST: console.log(verse, typeof verse);

    const [translation, book] = return_versions_book(entry_translation, entry_book.toLowerCase());
    // TEST: console.log(translation, typeof translation);
    // TEST: console.log(book, typeof book);

    event.target.value = "";

    const mv_title = document.getElementById("mv-title");
    mv_title.innerHTML = `${entry_translation} ${entry_book} ${chapter}:${verse}`;

    await fetch(`http://localhost:8080/${translation}/${book}/${chapter}/${verse}`);
    console.log("Received");
  }
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
