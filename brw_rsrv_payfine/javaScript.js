document.addEventListener("DOMContentLoaded", () => {
  const itemsPerPage = 16; // Number of Books per page
  let Books = [];
  const paginationContainer = document.querySelector(".pagination");

  // Generate 30 dummy books for demonstration
  Books = Array.from({ length: 30 }, (_, i) => ({
    title: `Book ${i + 1}`,
    genre: ["Literature", "Sci-Fi", "Sports", "Novel", "Fantasy", "Computer", "Mystery"][i % 7],
    yearOfPublish: 2000 + (i % 25),
    author: `Author ${i + 1}`,
    image: "ULiblogo.png"
  }));

  // Render a page of books
  function showPage(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
  // Use the .row inside the 'Available Books' section only
  const BooksContainer = document.querySelector("section > .row");
    BooksContainer.innerHTML = "";
    // Reduce vertical and horizontal spacing by using mb-2 and Bootstrap's g-1 for the row
    const BooksRow = BooksContainer;
    BooksRow.classList.remove("mb-4", "g-3", "g-2");
    BooksRow.classList.add("g-1");
    Books.slice(start, end).forEach((book) => {
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
        const book = Books[start + index];
        localStorage.setItem("selectedBook", JSON.stringify(book));
      });
    });
  }

  // Setup pagination controls
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

  // Initialize
  setupPagination(Books.length);
  showPage(1);
});