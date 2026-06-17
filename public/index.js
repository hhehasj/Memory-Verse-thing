// const translation = "NIV";
// const book = "GEN";
// const chapter = "1";
// const verse = "11";

// const response = await fetch(`http://localhost:8080/${translation}/${book}/${chapter}/${verse}`);

// const data = await response.json();
// console.log(data);
// --------------------------------------------------------------------------------------
const setting_btn = document.getElementById("setting-btn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

let clicked = false;

setting_btn.addEventListener("click", () => {
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
