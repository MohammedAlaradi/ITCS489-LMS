document.addEventListener("DOMContentLoaded", () => {
  const itemsPerPage = 16; // Number of Books per page
  let Books = [];
  let filteredBooks = [];
  const paginationContainer = document.querySelector(".pagination");

  // Search input
  const searchInput = document.getElementById("searchInput");
  // Year input validation: only accept 4-digit years between 1900 and current year
  const yearInput = document.getElementById("yearOfPublish");
  const currentYear = new Date().getFullYear();
  if (yearInput) {
    // ensure HTML min/max align with current year
    yearInput.setAttribute('min', '1900');
    yearInput.setAttribute('max', String(currentYear));
    // allow numeric keypad on mobile
    yearInput.setAttribute('inputmode', 'numeric');

    // sanitize input to digits only and max length 4
    yearInput.addEventListener('input', () => {
      const cleaned = yearInput.value.replace(/\D/g, '').slice(0, 4);
      if (cleaned !== yearInput.value) yearInput.value = cleaned;
    });

    // validate on blur and show message if invalid
    yearInput.addEventListener('blur', () => {
      if (!yearInput.value) {
        yearInput.setCustomValidity('');
        return;
      }
      const y = parseInt(yearInput.value, 10);
      if (isNaN(y) || yearInput.value.length !== 4 || y < 1900 || y > currentYear) {
        yearInput.setCustomValidity(`Please enter a four-digit year between 1900 and ${currentYear}.`);
        yearInput.reportValidity();
      } else {
        yearInput.setCustomValidity('');
      }
    });
  }

  // ISBN input validation: only accept 13-digit numbers
  const isbnInput = document.getElementById("bookISBN");
  if (isbnInput) {
    // use inputmode numeric for mobile and keep value as string
    isbnInput.setAttribute('inputmode', 'numeric');
    // sanitize to digits and limit to 13 chars
    isbnInput.addEventListener('input', () => {
      const cleaned = isbnInput.value.replace(/\D/g, '').slice(0, 13);
      if (cleaned !== isbnInput.value) isbnInput.value = cleaned;
    });
    // validate on blur
    isbnInput.addEventListener('blur', () => {
      if (!isbnInput.value) {
        isbnInput.setCustomValidity('');
        return;
      }
      if (isbnInput.value.length !== 13) {
        isbnInput.setCustomValidity('Please enter a 13-digit ISBN.');
        isbnInput.reportValidity();
      } else {
        isbnInput.setCustomValidity('');
      }
    });
  }

  // Load Books from localStorage if present, otherwise generate 30 dummy books and persist
  const storedBooks = localStorage.getItem('Books');
  if (storedBooks) {
    try {
      Books = JSON.parse(storedBooks);
    } catch (e) {
      console.error('Failed to parse stored Books, regenerating', e);
      Books = null;
    }
  }
  // Migrate old stored Books: ensure id and copies exist for each book
  if (Books && Array.isArray(Books)) {
    let migrated = false;
    Books.forEach((b, idx) => {
      if (b.id == null) { b.id = `b${idx + 1}`; migrated = true; }
      if (b.copies == null) { b.copies = Math.floor(Math.random() * 5) + 1; migrated = true; }
      if (b.isbn == null) { b.isbn = String(9780000000000 + idx).slice(0,13); migrated = true; }
      if (b.edition == null) { b.edition = 1 + (idx % 3); migrated = true; }
    });
    if (migrated) {
      try { localStorage.setItem('Books', JSON.stringify(Books)); } catch (e) { console.error('Failed to persist migrated Books', e); }
    }
  }
  if (!Books || !Array.isArray(Books) || Books.length === 0) {
    Books = Array.from({ length: 30 }, (_, i) => ({
      id: `b${i + 1}`,
      title: `Book ${i + 1}`,
      genre: ["Literature", "Sci-Fi", "Sports", "Novel", "Fantasy", "Computer", "Mystery"][i % 7],
      yearOfPublish: 2000 + (i % 25),
      author: `Author ${i + 1}`,
      image: "../ULiblogo.png",
      copies: Math.floor(Math.random() * 5) + 1, // 1 to 5 copies
      isbn: String(9780000000000 + i).slice(0,13),
      edition: 1 + (i % 3)
    }));
    // persist initial Books
    localStorage.setItem('Books', JSON.stringify(Books));
  }

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
    filteredBooks.slice(start, end).forEach((book, i) => {
      const idx = start + i; // absolute index into filteredBooks for this page
      const bookCard = document.createElement("div");
      bookCard.classList.add("col-md-6", "mb-2");
      bookCard.innerHTML = `
        <div class="card mb-2" style="max-width: 680px;">
          <div class="row g-0">
            <div class="col-md-4">
              <img src="${book.image || '../ULiblogo.png'}" class="img-fluid rounded-start" alt="Book Cover">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${book.title}</h5>
                <p class="card-text"><strong>Genre:</strong> ${book.genre}</p>
                <p class="card-text"><strong>Year Of Publish:</strong> ${book.yearOfPublish}</p>
                <p class="card-text"><strong>Author:</strong> ${book.author}</p>
                ${book.copies === 0 ? `<button class="btn btn-primary w-100 rounded reserve-btn">Reserve</button>` : `<button class="btn btn-primary w-100 rounded borrow-btn">Borrow</button>`}
              </div>
            </div>
          </div>
        </div>
      `;
      BooksContainer.appendChild(bookCard);
      // Attach the index to the button inside this card so click handlers can find the corresponding book
      const btn = bookCard.querySelector('.borrow-btn, .reserve-btn');
      if (btn) btn.dataset.index = String(idx);
    });
    // Add event listeners for Borrow buttons: save selectedBook then navigate to borrow page
    const borrowButtons = document.querySelectorAll(".borrow-btn");
    borrowButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const idx = parseInt(button.dataset.index, 10);
        const book = filteredBooks[idx];
        localStorage.setItem("selectedBook", JSON.stringify(book));
  // navigate to borrow page (relative to search folder)
  window.location.href = "../borrowPage/borrow.html";
      });
    });
    // Add event listeners for Reserve buttons: save selectedBook then navigate to reserve page
    const reserveButtons = document.querySelectorAll(".reserve-btn");
    reserveButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const idx = parseInt(button.dataset.index, 10);
        const book = filteredBooks[idx];
        localStorage.setItem("selectedBook", JSON.stringify(book));
        // navigate to reserve page (relative to search folder)
        window.location.href = "../reserve/reserve.html";
      });
    });
  }

  // Keep track of current sort order so sorting persists across filters
  let sortOrder = null; // 'asc' or 'desc'

  function applySort() {
    if (!sortOrder) return;
    if (sortOrder === 'asc') {
      filteredBooks.sort((a, b) => a.yearOfPublish - b.yearOfPublish);
    } else if (sortOrder === 'desc') {
      filteredBooks.sort((a, b) => b.yearOfPublish - a.yearOfPublish);
    }
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
    // If ISBN present but not 13 digits, show validation message and abort
    if (isbn && isbnInput && isbnInput.value.length !== 13) {
      isbnInput.setCustomValidity('Please enter a 13-digit ISBN.');
      isbnInput.reportValidity();
      return;
    }
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
    // apply current sort (if any) so filtered results respect user choice
    applySort();
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

  // Genre reset button (in dropdown)
  const genreResetBtn = document.getElementById("genreReset");
  if (genreResetBtn) {
    genreResetBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (genreFilter) {
        delete genreFilter.dataset.selected;
        genreFilter.querySelectorAll(".dropdown-item").forEach(i => i.classList.remove("active"));
      }
      filterBooks();
    });
  }

  // Sorting logic for filteredBooks (uses current filteredBooks array)
  const sortDropdown = document.getElementById("sortDate");
  if (sortDropdown) {
    sortDropdown.querySelectorAll(".dropdown-item").forEach(item => {
      item.addEventListener("click", function(e) {
        e.preventDefault();
        // Visually mark selected
        sortDropdown.querySelectorAll(".dropdown-item").forEach(i => i.classList.remove("active"));
        this.classList.add("active");
        const value = this.getAttribute("value");
        // Map dropdown values to behavior: 'a' -> Newest to Oldest (desc), 'd' -> Oldest to Newest (asc)
        if (value === "a") {
          sortOrder = 'desc';
        } else if (value === "d") {
          sortOrder = 'asc';
        } else {
          sortOrder = null;
        }
        // Apply sort and refresh
        applySort();
        setupPagination(filteredBooks.length);
        showPage(1);
      });
    });
  }

  // Sort reset button
  const sortResetBtn = document.getElementById("sortReset");
  if (sortResetBtn) {
    sortResetBtn.addEventListener("click", (e) => {
      e.preventDefault();
      // Clear visual selection
      sortDropdown.querySelectorAll(".dropdown-item").forEach(i => i.classList.remove("active"));
      sortOrder = null;
      // Reapply filter (which will not sort) and refresh
      filterBooks();
    });
  }

  // Initialize
  setupPagination(Books.length);
  showPage(1);
});
