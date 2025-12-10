// addBook/addScript.js

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("addBookForm");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Get values
        const title   = document.getElementById("title").value.trim();
        const author  = document.getElementById("author").value.trim();
        const genre   = document.getElementById("genre").value;
        const year    = document.getElementById("year").value.trim();
        const edition = document.getElementById("edition").value.trim();
        const isbn    = document.getElementById("isbn").value.trim();
        const copies  = document.getElementById("copies").value.trim();
        let image     = document.getElementById("image").value.trim();

        // Basic validation
        if (!title || !author || !genre || !year || !edition || !isbn || !copies) {
            alert("Please fill all required fields.");
            return;
        }

        // ISBN validation
        if (isbn.length !== 13 || !/^\d+$/.test(isbn)) {
            alert("ISBN must be exactly 13 digits.");
            return;
        }

        // Validate numbers
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

        // Load existing books
        let books = [];
        try {
            books = JSON.parse(localStorage.getItem("Books") || "[]");
        } catch {
            books = [];
        }

        // Generate new ID (b1, b2, b3...)
        let maxNum = 0;
        books.forEach(book => {
            if (!book.id) return;
            const n = parseInt(book.id.replace(/\D/g, ""), 10);
            if (!isNaN(n) && n > maxNum) maxNum = n;
        });

        const newId = "b" + (maxNum + 1);

        // Build new book object (MUST match the project's structure)
        const newBook = {
            id: newId,
            title,
            genre,
            yearOfPublish: yearNum,
            author,
            image,
            copies: copiesNum,
            isbn,
            edition: editionNum
        };

        // Save to localStorage
        books.push(newBook);
        localStorage.setItem("Books", JSON.stringify(books));

        alert("Book added successfully!");
        form.reset();
    });

});
