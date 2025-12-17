// addBook/addScript.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addBookForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title   = document.getElementById("title").value.trim();
    const author  = document.getElementById("author").value.trim();
    const genre   = document.getElementById("genre").value;
    const year    = document.getElementById("year").value.trim();
    const edition = document.getElementById("edition").value.trim();
    const isbn    = document.getElementById("isbn").value.trim();
    const copies  = document.getElementById("copies").value.trim();
    let image     = document.getElementById("image").value.trim();

    if (!title || !author || !genre || !year || !edition || !isbn || !copies) {
      alert("Please fill all required fields.");
      return;
    }

    if (isbn.length !== 13 || !/^\d+$/.test(isbn)) {
      alert("ISBN must be exactly 13 digits.");
      return;
    }

    const yearNum = Number(year);
    const editionNum = Number(edition);
    const copiesNum = Number(copies);

    if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
      alert("Year must be between 1900 and 2100.");
      return;
    }

    if (isNaN(editionNum) || editionNum < 1) {
      alert("Edition must be 1 or more.");
      return;
    }

    if (isNaN(copiesNum) || copiesNum < 0) {
      alert("Copies cannot be negative.");
      return;
    }

    if (!image) image = "../ULiblogo.png";

    // Send to database via teammate API folder
    fetch("../API/addBook.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isbn: isbn,
        title: title,
        author: author,
        genre: genre,
        year: yearNum,
        edition: editionNum,
        copies: copiesNum
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Book added successfully!");
        form.reset();
      } else {
        alert("Add failed: " + (data.message || data.error || "Unknown error"));
      }
    })
    .catch(err => {
      alert("Request error: " + err);
    });
  });
});
