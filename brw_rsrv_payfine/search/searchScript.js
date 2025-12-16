document.addEventListener("DOMContentLoaded", () => {
  const itemsPerPage = 16;
  let Books = [];
  let filteredBooks = [];
  const paginationContainer = document.querySelector(".pagination");
  const searchInput = document.getElementById("searchInput");

  // Input validations remain the same
  const yearInput = document.getElementById("yearOfPublish");
  const currentYear = new Date().getFullYear();
  if (yearInput) {
    yearInput.setAttribute('min', '1900');
    yearInput.setAttribute('max', String(currentYear));
    yearInput.setAttribute('inputmode', 'numeric');
    yearInput.addEventListener('input', () => {
      const cleaned = yearInput.value.replace(/\D/g, '').slice(0, 4);
      if (cleaned !== yearInput.value) yearInput.value = cleaned;
    });
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

  const isbnInput = document.getElementById("bookISBN");
  if (isbnInput) {
    isbnInput.setAttribute('inputmode', 'numeric');
    isbnInput.addEventListener('input', () => {
      const cleaned = isbnInput.value.replace(/\D/g, '').slice(0, 13);
      if (cleaned !== isbnInput.value) isbnInput.value = cleaned;
    });
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

  
  const serverCards = document.querySelectorAll("section > .row > .col-md-6[data-title]");
  if (serverCards && serverCards.length) {
    
  }

  
  async function fetchBooksFromDB() {
    try {
      
      const response = await fetch('../API/getBooks.php');
      if (!response.ok) {
        throw new Error('Could not fetch books from database');
      }
      const booksData = await response.json();
      
      
      Books = booksData.map(book => ({
        isbn: book.ISBN || '',
        title: book.Title || 'Untitled',
        genre: book.Genre || '',
        yearOfPublish: book.YearofPublish || null,
        author: book.Author || '',
        image: book.Cover || '../ULiblogo.png',
        copies: parseInt(book.Copies || 0),
        
      }));
      
      
      const loadingSpinner = document.getElementById('loadingSpinner');
      const loadingText = document.getElementById('loadingText');
      if (loadingSpinner) loadingSpinner.style.display = 'none';
      if (loadingText) loadingText.style.display = 'none';
      
      // Initialize filteredBooks and render
      filteredBooks = Books.slice();
      setupPagination(filteredBooks.length);
      showPage(1);
    } catch (error) {
      console.error('Error fetching books:', error);
      
      
      const loadingSpinner = document.getElementById('loadingSpinner');
      const loadingText = document.getElementById('loadingText');
      if (loadingSpinner) loadingSpinner.style.display = 'none';
      if (loadingText) {
        loadingText.textContent = 'Error loading books. Please try again.';
        loadingText.className = 'text-danger';
      }
      
      Books = [];
      filteredBooks = [];
      setupPagination(0);
      showPage(1);
    }
  }

  // Render a page of books
  function showPage(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const BooksContainer = document.querySelector("section > .row");
    BooksContainer.innerHTML = "";

    const BooksRow = BooksContainer;
    BooksRow.classList.remove("mb-4", "g-3", "g-2");
    BooksRow.classList.add("g-1");
    
    // If no books, show message
    if (filteredBooks.length === 0) {
      BooksContainer.innerHTML = '<p class="text-muted text-center w-100">No books found.</p>';
      return;
    }
    
    filteredBooks.slice(start, end).forEach((book, i) => {
      const idx = start + i;
      const bookCard = document.createElement("div");
      bookCard.classList.add("col-md-6", "mb-2");
      bookCard.innerHTML = `
        <div class="card mb-2" style="max-width: 680px; max-height: 220px;">
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
                ${book.copies === 0 ?
                  `<button class="btn btn-primary w-100 rounded reserve-btn" data-book-isbn="${book.isbn}">Reserve</button>` : 
                  `<button class="btn btn-primary w-100 rounded borrow-btn" data-book-isbn="${book.isbn}">Borrow</button>`}
              </div>
            </div>
          </div>
        </div>
      `;
      BooksContainer.appendChild(bookCard);
    });
    
    // Attach event listeners for buttons
    attachButtonListeners();
  }

  // NEW: Attach event listeners to borrow/reserve buttons
  function attachButtonListeners() {
    // Borrow buttons
    const borrowButtons = document.querySelectorAll(".borrow-btn");
    borrowButtons.forEach((button) => {
      button.addEventListener("click", async (e) => {
        e.preventDefault();
        const bookISBN = button.dataset.bookIsbn;
        if (!bookISBN) return;
        
        try {
          // Fetch book details from database using ISBN
          const response = await fetch(`../API/getBook.php?isbn=${bookISBN}`);
          if (!response.ok) throw new Error('Failed to fetch book');
          const book = await response.json();
          
          // Navigate with book ISBN as query parameter instead of localStorage
          window.location.href = `../borrowPage/borrow.php?bookISBN=${bookISBN}&title=${encodeURIComponent(book.Title)}&author=${encodeURIComponent(book.Author)}`;
        } catch (error) {
          console.error('Error fetching book details:', error);
          // Fallback: navigate with just ISBN
          window.location.href = `../borrowPage/borrow.php?bookISBN=${bookISBN}`;
        }
      });
    });
    
    // Reserve buttons
    const reserveButtons = document.querySelectorAll(".reserve-btn");
    reserveButtons.forEach((button) => {
      button.addEventListener("click", async (e) => {
        e.preventDefault();
        const bookISBN = button.dataset.bookIsbn;
        if (!bookISBN) return;
        
        try {
          const response = await fetch(`../API/getBook.php?isbn=${bookISBN}`);
          if (!response.ok) throw new Error('Failed to fetch book');
          const book = await response.json();
          
          window.location.href = `../reserve/reserve.php?bookISBN=${bookISBN}&title=${encodeURIComponent(book.Title)}&author=${encodeURIComponent(book.Author)}`;
        } catch (error) {
          console.error('Error fetching book details:', error);
          window.location.href = `../reserve/reserve.php?bookISBN=${bookISBN}`;
        }
      });
    });
  }

  let sortOrder = null;

  function applySort() {
    if (!sortOrder) return;
    if (sortOrder === 'asc') {
      filteredBooks.sort((a, b) => a.yearOfPublish - b.yearOfPublish);
    } else if (sortOrder === 'desc') {
      filteredBooks.sort((a, b) => b.yearOfPublish - a.yearOfPublish);
    }
  }

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
    if (isbn && isbnInput && isbnInput.value.length !== 13) {
      isbnInput.setCustomValidity('Please enter a 13-digit ISBN.');
      isbnInput.reportValidity();
      return;
    }
    const year = document.getElementById("yearOfPublish").value.trim();
    const author = document.getElementById("AuthorName").value.trim().toLowerCase();

    let genre = "";
    const genreFilter = document.getElementById("genreFilter");
    if (genreFilter && genreFilter.dataset.selected) {
      genre = genreFilter.dataset.selected;
    }

    filteredBooks = Books.filter(book => {
      if (search && !(book.title.toLowerCase().includes(search) || book.author.toLowerCase().includes(search))) {
        return false;
      }
      if (isbn && book.isbn && String(book.isbn) !== isbn) {
        return false;
      }
      if (genre && genre !== "Others") {
        if (book.genre !== genre) return false;
      } else if (genre === "Others") {
        const mainGenres = ["Literature", "Sci-Fi", "Sports", "Novel", "Fantasy", "Computer", "Mystery"];
        if (mainGenres.includes(book.genre)) return false;
      }
      if (year && String(book.yearOfPublish) !== year) {
        return false;
      }
      if (author && !book.author.toLowerCase().includes(author)) {
        return false;
      }
      return true;
    });
    
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
    const genreFilter = document.getElementById("genreFilter");
    if (genreFilter) {
      delete genreFilter.dataset.selected;
      genreFilter.querySelectorAll(".dropdown-item").forEach(item => item.classList.remove("active"));
    }
    filterBooks();
  });

  // NEW: Fetch books from database on page load
  fetchBooksFromDB();

  // Listen for search input
  searchInput.addEventListener("input", filterBooks);

  // Genre filter
  const genreFilter = document.getElementById("genreFilter");
  if (genreFilter) {
    genreFilter.querySelectorAll(".dropdown-item").forEach(item => {
      item.addEventListener("click", function(e) {
        e.preventDefault();
        genreFilter.dataset.selected = this.getAttribute("value") || this.textContent.trim();
        genreFilter.querySelectorAll(".dropdown-item").forEach(i => i.classList.remove("active"));
        this.classList.add("active");
        filterBooks();
      });
    });
  }

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

  // Sorting logic
  const sortDropdown = document.getElementById("sortDate");
  if (sortDropdown) {
    sortDropdown.querySelectorAll(".dropdown-item").forEach(item => {
      item.addEventListener("click", function(e) {
        e.preventDefault();
        sortDropdown.querySelectorAll(".dropdown-item").forEach(i => i.classList.remove("active"));
        this.classList.add("active");
        const value = this.getAttribute("value");
        if (value === "a") {
          sortOrder = 'desc';
        } else if (value === "d") {
          sortOrder = 'asc';
        } else {
          sortOrder = null;
        }
        applySort();
        setupPagination(filteredBooks.length);
        showPage(1);
      });
    });
  }

  const sortResetBtn = document.getElementById("sortReset");
  if (sortResetBtn) {
    sortResetBtn.addEventListener("click", (e) => {
      e.preventDefault();
      sortDropdown.querySelectorAll(".dropdown-item").forEach(i => i.classList.remove("active"));
      sortOrder = null;
      filterBooks();
    });
  }
});