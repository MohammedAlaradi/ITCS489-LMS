// deleteBook/deleteScript.js

document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("deleteSelect");
  const deleteBtn = document.getElementById("deleteBtn");

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
          const op = document.createElement("option");

          const isbnVal = book.ISBN ?? book.isbn ?? "";
          const titleVal = book.Title ?? book.title ?? "Untitled";

          op.value = isbnVal;
          op.textContent = `${titleVal} (ISBN: ${isbnVal})`;
          select.appendChild(op);
        });
      })
      .catch(err => {
        select.innerHTML = `<option value="">Failed to load books</option>`;
        alert("Error loading books: " + err);
      });
  }

  loadDropdownFromDB();

  deleteBtn.addEventListener("click", () => {
    const isbn = select.value;

    if (!isbn) {
      alert("Please select a book to delete.");
      return;
    }

    const confirmDelete = confirm("Are you sure you want to delete this book?");
    if (!confirmDelete) return;

    fetch("../API/deleteBook.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isbn: isbn })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Book deleted successfully!");
          loadDropdownFromDB();
        } else {
          alert("Delete failed: " + (data.message || data.error || "Unknown error"));
        }
      })
      .catch(err => {
        alert("Request error: " + err);
      });
  });
});
