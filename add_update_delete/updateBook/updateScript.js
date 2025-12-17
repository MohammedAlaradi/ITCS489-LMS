// updateBook/updateScript.js

document.addEventListener("DOMContentLoaded", () => {

  const select = document.getElementById("bookSelect");
  const form = document.getElementById("updateBookForm");

  const uTitle   = document.getElementById("uTitle");
  const uAuthor  = document.getElementById("uAuthor");
  const uGenre   = document.getElementById("uGenre");
  const uYear    = document.getElementById("uYear");
  const uEdition = document.getElementById("uEdition");
  const uIsbn    = document.getElementById("uIsbn");
  const uCopies  = document.getElementById("uCopies");
  const uImage   = document.getElementById("uImage");

  const cancelBtn = document.getElementById("cancelUpdate");

  // -----------------------------
  // 1) LOAD BOOKS INTO DROPDOWN
  // -----------------------------
  function loadDropdownFromDB() {
    select.innerHTML = `<option value="">Loading books...</option>`;

    fetch("../API/getBooks.php")
      .then(res => res.json())
      .then(books => {
        select.innerHTML = `<option value="">Select a book...</option>`;

        if (!Array.isArray(books) || books.length === 0) {
          const op = document.createElement("option");
          op.value = "";
          op.textContent = "No books found";
          select.appendChild(op);
          return;
        }

        books.forEach(book => {
          const isbn = book.ISBN ?? book.isbn ?? "";
          const title = book.Title ?? book.title ?? "Untitled";

          const op = document.createElement("option");
          op.value = isbn; // IMPORTANT: value = ISBN
          op.textContent = `${title} (ISBN: ${isbn})`;
          select.appendChild(op);
        });
      })
      .catch(err => {
        alert("Error loading books: " + err);
      });
  }

  loadDropdownFromDB();

  // ----------------------------------
  // 2) LOAD SELECTED BOOK DETAILS
  // ----------------------------------
  select.addEventListener("change", () => {
    const isbn = select.value;

    if (!isbn) {
      form.style.display = "none";
      return;
    }

    fetch(`../API/getBook.php?isbn=${encodeURIComponent(isbn)}`)
      .then(res => res.json())
      .then(book => {
        uTitle.value   = book.Title ?? book.title ?? "";
        uAuthor.value  = book.Author ?? book.author ?? "";
        uGenre.value   = book.Genre ?? book.genre ?? "";
        uYear.value    = book.YearofPublish ?? book.yearOfPublish ?? "";
        uEdition.value = book.Edition ?? book.edition ?? "";
        uIsbn.value    = book.ISBN ?? book.isbn ?? isbn;
        uCopies.value  = book.Copies ?? book.copies ?? 0;
        uImage.value   = book.Image ?? book.image ?? "";

        uIsbn.readOnly = true; // ISBN should not change
        form.style.display = "block";
      })
      .catch(err => {
        alert("Error loading book details: " + err);
      });
  });

  // -----------------------------
  // 3) SUBMIT UPDATE TO DATABASE
  // -----------------------------
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (uIsbn.value.length !== 13 || !/^\d+$/.test(uIsbn.value)) {
      alert("ISBN must be exactly 13 digits.");
      return;
    }

    const yearNum = Number(uYear.value);
    const editionNum = Number(uEdition.value);
    const copiesNum = Number(uCopies.value);

    if (yearNum < 1900 || yearNum > 2100) {
      alert("Year must be between 1900 and 2100.");
      return;
    }
    if (editionNum < 1) {
      alert("Edition must be at least 1.");
      return;
    }
    if (copiesNum < 0) {
      alert("Copies cannot be negative.");
      return;
    }

    fetch("../API/updateBook.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isbn: uIsbn.value.trim(),
        title: uTitle.value.trim(),
        author: uAuthor.value.trim(),
        genre: uGenre.value,
        year: yearNum,
        edition: editionNum,
        copies: copiesNum
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Book updated successfully!");
          loadDropdownFromDB();
          form.style.display = "none";
          form.reset();
        } else {
          alert("Update failed: " + (data.message || data.error || "Unknown error"));
        }
      })
      .catch(err => {
        alert("Request error: " + err);
      });
  });

  // -----------------------------
  // 4) CANCEL BUTTON
  // -----------------------------
  cancelBtn.addEventListener("click", () => {
    form.reset();
    form.style.display = "none";
    select.value = "";
  });

});
