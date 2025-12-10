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

    // Load existing books
    let books = [];
    try {
        books = JSON.parse(localStorage.getItem("Books") || "[]");
    } catch {
        books = [];
    }

    // Fill dropdown
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


    // When selecting a book → load data into form
    select.addEventListener("change", () => {
        const id = select.value;

        if (!id) {
            form.style.display = "none";
            return;
        }

        const book = books.find(b => b.id === id);
        if (!book) return;

        // Fill form
        uTitle.value = book.title;
        uAuthor.value = book.author;
        uGenre.value = book.genre;
        uYear.value = book.yearOfPublish;
        uEdition.value = book.edition;
        uIsbn.value = book.isbn;
        uCopies.value = book.copies;
        uImage.value = book.image || "";

        form.style.display = "block";
    });


    // Save changes
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const id = select.value;
        if (!id) return alert("Please select a book first.");

        // Validation
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

        // Update the book in the array
        const index = books.findIndex(b => b.id === id);
        if (index === -1) return;

        books[index] = {
            id,
            title: uTitle.value.trim(),
            author: uAuthor.value.trim(),
            genre: uGenre.value,
            yearOfPublish: yearNum,
            edition: editionNum,
            isbn: uIsbn.value.trim(),
            copies: copiesNum,
            image: uImage.value.trim() || "../ULiblogo.png"
        };

        // Save to storage
        localStorage.setItem("Books", JSON.stringify(books));

        alert("Book updated successfully!");

        form.reset();
        form.style.display = "none";
        select.value = "";

        // Reload dropdown so updated name appears
        loadDropdown();
    });


    // Cancel button hides form
    cancelBtn.addEventListener("click", () => {
        form.reset();
        form.style.display = "none";
        select.value = "";
    });

});
