// deleteBook/deleteScript.js

document.addEventListener("DOMContentLoaded", () => {

    const select = document.getElementById("deleteSelect");
    const deleteBtn = document.getElementById("deleteBtn");

    // Load books
    let books = [];
    try {
        books = JSON.parse(localStorage.getItem("Books") || "[]");
    } catch {
        books = [];
    }

    // Populate dropdown
    function loadDropdown() {
        select.innerHTML = `<option value="">Select a book...</option>`;
        
        books.forEach(book => {
            const op = document.createElement("option");
            op.value = book.id;
            op.textContent = `${book.title} (${book.id})`;
            select.appendChild(op);
        });
    }

    loadDropdown();


    // DELETE LOGIC
    deleteBtn.addEventListener("click", () => {
        const id = select.value;

        if (!id) {
            alert("Please select a book to delete.");
            return;
        }

        const book = books.find(b => b.id === id);

        if (!book) {
            alert("Book not found.");
            return;
        }

        const confirmDelete = confirm(`Are you sure you want to delete "${book.title}"?`);
        if (!confirmDelete) return;

        // Remove from array
        books = books.filter(b => b.id !== id);

        // Save updated list
        localStorage.setItem("Books", JSON.stringify(books));

        alert("Book deleted successfully!");

        // Refresh dropdown
        loadDropdown();
        select.value = "";
    });

});
