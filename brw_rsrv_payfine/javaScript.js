document.addEventListener("DOMContentLoaded", () => {
  const itemsPerPage = 16; // Number of Books per page
  let Books = [];
  let filteredBooks = [];
  const paginationContainer = document.querySelector(".pagination");

  // Search input
  const searchInput = document.getElementById("searchInput");

  // Generate 30 dummy books for demonstration
  Books = Array.from({ length: 30 }, (_, i) => ({
    title: `Book ${i + 1}`,
    genre: ["Literature", "Sci-Fi", "Sports", "Novel", "Fantasy", "Computer", "Mystery"][i % 7],
    yearOfPublish: 2000 + (i % 25),
    author: `Author ${i + 1}`,
    image: "ULiblogo.png"
  }));

  // Render a page of books (from filteredBooks)
  function showPage(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const BooksContainer = document.querySelector("section > .row");
    BooksContainer.innerHTML = "";
    // Reduce vertical and horizontal spacing by using mb-2 and Bootstrap's g-1 for the row
    const BooksRow = BooksContainer;
    BooksRow.classList.remove("mb-4", "g-3", "g-2");
    BooksRow.classList.add("g-1");
    filteredBooks.slice(start, end).forEach((book) => {
      const bookCard = document.createElement("div");
      bookCard.classList.add("col-md-6", "mb-2");
      bookCard.innerHTML = `
        <div class="card mb-2" style="max-width: 680px;">
          <div class="row g-0">
            <div class="col-md-4">
              <img src="${book.image || 'ULiblogo.png'}" class="img-fluid rounded-start" alt="Book Cover">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${book.title}</h5>
                <p class="card-text"><strong>Genre:</strong> ${book.genre}</p>
                <p class="card-text"><strong>Year Of Publish:</strong> ${book.yearOfPublish}</p>
                <p class="card-text"><strong>Author:</strong> ${book.author}</p>
                <a href="borrowBook.html"><button class="btn btn-primary w-100 rounded">view more</button></a>
              </div>
            </div>
          </div>
        </div>
      `;
      BooksContainer.appendChild(bookCard);
    });
    // Add event listeners for view more buttons
    const viewButtons = document.querySelectorAll(".btn-success");
    viewButtons.forEach((button, index) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const book = filteredBooks[start + index];
        localStorage.setItem("selectedBook", JSON.stringify(book));
      });
    });
  }

  // Setup pagination controls (for filteredBooks)
  function setupPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    paginationContainer.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      const pageItem = document.createElement("li");
      pageItem.classList.add("page-item");
      if (i === 1) pageItem.classList.add("active");
      const pageLink = document.createElement("a");
      pageLink.classList.add("page-link");
      pageLink.href = "#";
      pageLink.textContent = i;
      pageLink.addEventListener("click", (e) => {
        e.preventDefault();
        showPage(i);
        document.querySelectorAll(".pagination .page-item").forEach((item) => item.classList.remove("active"));
        pageItem.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      pageItem.appendChild(pageLink);
      paginationContainer.appendChild(pageItem);
    }
  }


  // Advanced filter logic
  function filterBooks() {
    const search = searchInput.value.trim().toLowerCase();
    const isbn = document.getElementById("bookISBN").value.trim();
    const year = document.getElementById("yearOfPublish").value.trim();
    const author = document.getElementById("AuthorName").value.trim().toLowerCase();

    // Genre filter: get selected genre from dropdown (by click)
    let genre = "";
    const genreFilter = document.getElementById("genreFilter");
    if (genreFilter && genreFilter.dataset.selected) {
      genre = genreFilter.dataset.selected;
    }

    filteredBooks = Books.filter(book => {
      // Search bar: match title or author
      if (search && !(book.title.toLowerCase().includes(search) || book.author.toLowerCase().includes(search))) {
        return false;
      }
      // ISBN (if present in book)
      if (isbn && book.isbn && String(book.isbn) !== isbn) {
        return false;
      }
      // Genre
      if (genre && genre !== "Others") {
        if (book.genre !== genre) return false;
      } else if (genre === "Others") {
        const mainGenres = ["Literature", "Sci-Fi", "Sports", "Novel", "Fantasy", "Computer", "Mystery"];
        if (mainGenres.includes(book.genre)) return false;
      }
      // Year
      if (year && String(book.yearOfPublish) !== year) {
        return false;
      }
      // Author (advanced filter)
      if (author && !book.author.toLowerCase().includes(author)) {
        return false;
      }
      return true;
    });
    setupPagination(filteredBooks.length);
    showPage(1);
  }

  // Advanced filter buttons
  const applyFilterBtn = document.getElementById("applyFilter");
  const resetFilterBtn = document.getElementById("resetFilter");

  applyFilterBtn.addEventListener("click", filterBooks);

  resetFilterBtn.addEventListener("click", () => {
    document.getElementById("bookISBN").value = "";
    document.getElementById("yearOfPublish").value = "";
    document.getElementById("AuthorName").value = "";
    // Reset genre selection
    const genreFilter = document.getElementById("genreFilter");
    if (genreFilter) {
      delete genreFilter.dataset.selected;
      // Optionally, visually reset selection
      genreFilter.querySelectorAll(".dropdown-item").forEach(item => item.classList.remove("active"));
    }
    filterBooks();
  });

  // Initialize
  filteredBooks = Books.slice();
  setupPagination(filteredBooks.length);
  showPage(1);

  // Listen for search input
  searchInput.addEventListener("input", filterBooks);

  // Listen for genre filter selection (dropdown click)
  const genreFilter = document.getElementById("genreFilter");
  if (genreFilter) {
    genreFilter.querySelectorAll(".dropdown-item").forEach(item => {
      item.addEventListener("click", function(e) {
        e.preventDefault();
        // Store selected genre in dataset
        genreFilter.dataset.selected = this.getAttribute("value") || this.textContent.trim();
        // Visually mark selected
        genreFilter.querySelectorAll(".dropdown-item").forEach(i => i.classList.remove("active"));
        this.classList.add("active");
        filterBooks();
      });
    });
  }

  // Initialize
  setupPagination(Books.length);
  showPage(1);
});

