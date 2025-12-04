document.addEventListener('DOMContentLoaded', () => {
  try {
    // Get book ISBN from URL parameters - only need ISBN, everything else comes from DB
    const urlParams = new URLSearchParams(window.location.search);
    const bookISBN = urlParams.get('bookISBN');
    
    // Initialize empty book object - will be populated from database
    let book = null;
    
    const coverImg = document.getElementById('coverImg');
    const titleField = document.getElementById('titleField');
    const isbnField = document.getElementById('isbnField');
    const editionField = document.getElementById('editionField');
    const authorField = document.getElementById('authorField');

    // Fetch ALL book details from database using only ISBN
    async function fetchBookDetails() {
      if (!bookISBN) {
        alert('No book selected. Please select a book from the list.');
        window.location.href = '../search/index.php';
        return;
      }
      
      try {
        console.log('Fetching book details for ISBN:', bookISBN);
        const response = await fetch(`../API/getBook.php?ISBN=${bookISBN}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const bookData = await response.json();
        console.log('Book data received:', bookData);
        
        // Check for error in response
        if (bookData.error) {
          throw new Error(bookData.error);
        }
        
        // Check if book was found
        if (!bookData || Object.keys(bookData).length === 0) {
          throw new Error('Book not found in database');
        }
        
        // Create book object with data from database
        // Note: Field names should match what your API returns
        book = {
          isbn: bookData.ISBN || bookData.isbn || bookISBN,
          title: bookData.Title || bookData.title || 'Unknown Title',
          author: bookData.Author || bookData.author || 'Unknown Author',
          image: bookData.image || bookData.Image || '../ULiblogo.png',
          edition: bookData.Edition || bookData.edition || '-',
          copies: parseInt(bookData.Copies || bookData.copies || 0),
          genre: bookData.Genre || bookData.genre || '',
          yearOfPublish: bookData.YearofPublish || bookData.yearOfPublish || ''
        };
        
        console.log('Book object created:', book);
        
        // Update the UI with fetched data
        updateBookUI();
        updateConfirmButton();
        
      } catch (error) {
        console.error('Error fetching book details:', error);
        
        // Show error to user
        const errorMessage = `Error loading book details: ${error.message}`;
        console.error(errorMessage);
        alert(errorMessage);
        
        // Update UI with error state
        updateBookUI();
        updateConfirmButton();
      }
    }

    // Update UI with book data
    function updateBookUI() {
      if (book) {
        // Set cover image
        let imgPath = book.image || '';
        if (imgPath && !imgPath.match(/^(https?:|\/|\.\.)/)) {
          imgPath = '../' + imgPath;
        }
        coverImg.src = imgPath || '../ULiblogo.png';
        
        // Set text fields with data from database
        titleField.textContent = book.title || '-';
        isbnField.textContent = book.isbn || '-';
        editionField.textContent = book.edition || '-';
        authorField.textContent = book.author || '-';
        
        // Show copies if available
        const copiesField = document.getElementById('copiesField');
        if (copiesField) {
          copiesField.textContent = (book.copies != null) ? String(book.copies) : '-';
          // Add color coding for copies
          if (book.copies > 3) {
            copiesField.className = 'form-control-plaintext text-success';
          } else if (book.copies > 0) {
            copiesField.className = 'form-control-plaintext text-warning';
          } else {
            copiesField.className = 'form-control-plaintext text-danger';
          }
        }
      } else {
        // No book data loaded yet or error occurred
        coverImg.src = '../ULiblogo.png';
        titleField.textContent = 'Loading...';
        isbnField.textContent = bookISBN || '-';
        editionField.textContent = 'Loading...';
        authorField.textContent = 'Loading...';
        const copiesField = document.getElementById('copiesField');
        if (copiesField) {
          copiesField.textContent = 'Loading...';
        }
      }
    }

    // Date inputs: set min to today and validate relationship
    const fromInput = document.getElementById('fromDate');
    const toInput = document.getElementById('toDate');
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    if (fromInput) {
      fromInput.setAttribute('min', todayStr);
      fromInput.value = todayStr; // Set default to today
    }
    if (toInput) {
      toInput.setAttribute('min', todayStr);
      // Set default return date to 14 days from now
      const defaultReturn = new Date();
      defaultReturn.setDate(defaultReturn.getDate() + 14);
      const returnYyyy = defaultReturn.getFullYear();
      const returnMm = String(defaultReturn.getMonth() + 1).padStart(2, '0');
      const returnDd = String(defaultReturn.getDate()).padStart(2, '0');
      toInput.value = `${returnYyyy}-${returnMm}-${returnDd}`;
    }

    function validateDates() {
      // require both inputs to be present on the page
      if (!fromInput || !toInput) return false;
      const f = fromInput.value;
      const t = toInput.value;
      // clear previous validity
      toInput.setCustomValidity('');
      // both dates must be provided
      if (!f || !t) {
        return false;
      }
      // To date must not be before From date
      if (t < f) {
        toInput.setCustomValidity('Return date cannot be before borrow date.');
        toInput.reportValidity();
        return false;
      }
      return true;
    }

    const confirmBtn = document.getElementById('confirmBorrow');

    function updateConfirmButton() {
      // Only enable when there is a selected book, dates are valid, and copies are available
      const hasBook = !!book;
      const datesValid = validateDates();
      const copiesAvailable = book && (book.copies == null || book.copies > 0);
      if (confirmBtn) {
        const enabled = hasBook && datesValid && copiesAvailable;
        confirmBtn.disabled = !enabled;
        // adjust button text when disabled due to no copies
        if (!enabled) {
          if (book && book.copies === 0) {
            confirmBtn.textContent = 'No Copies Available';
            confirmBtn.className = 'btn btn-danger w-100 py-2';
          } else if (!book) {
            confirmBtn.textContent = 'Loading Book Data...';
            confirmBtn.className = 'btn btn-secondary w-100 py-2';
          } else {
            confirmBtn.textContent = 'Confirm Borrow';
            confirmBtn.className = 'btn btn-primary w-100 py-2';
          }
        } else {
          confirmBtn.textContent = 'Confirm Borrow';
          confirmBtn.className = 'btn btn-primary w-100 py-2';
        }
      }
    }

    if (fromInput) fromInput.addEventListener('change', () => { validateDates(); updateConfirmButton(); });
    if (toInput) toInput.addEventListener('change', () => { validateDates(); updateConfirmButton(); });

    // Cancel button: return to index
    const cancelBtn = document.getElementById('cancelBorrow');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        // navigate back to the search page index
        window.location.href = '../search/index.php';
      });
    }

    // Borrow confirmation handler - sends data to API
    if (confirmBtn) {
      confirmBtn.addEventListener('click', async () => {
        if (!book) {
          alert('Book data not loaded yet. Please wait.');
          return;
        }
        
        if (!validateDates()) {
          updateConfirmButton();
          return;
        }

        // Get dates
        const fromDate = fromInput.value;
        const toDate = toInput.value;
        
        // Confirm with user
        if (!confirm(`Confirm borrowing "${book.title}"?\n\nBorrow Date: ${fromDate}\nReturn Date: ${toDate}`)) {
          return;
        }

        try {
          // Send borrow request to API
          const response = await fetch('../API/borrowBook.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              bookISBN: book.isbn,
              borrowDate: fromDate,
              returnDate: toDate
              // User info will be handled by session on the server side
            })
          });

          const result = await response.json();
          
          if (response.ok && result.success) {
            // Success - update UI
            confirmBtn.disabled = true;
            confirmBtn.textContent = 'Book Borrowed!';
            confirmBtn.className = 'btn btn-success w-100 py-2';
            
            // Update copies count
            if (book.copies > 0) {
              book.copies -= 1;
              const copiesField = document.getElementById('copiesField');
              if (copiesField) {
                copiesField.textContent = String(book.copies);
                // Update color coding
                if (book.copies > 3) {
                  copiesField.className = 'form-control-plaintext text-success';
                } else if (book.copies > 0) {
                  copiesField.className = 'form-control-plaintext text-warning';
                } else {
                  copiesField.className = 'form-control-plaintext text-danger';
                  confirmBtn.textContent = 'No Copies Available';
                  confirmBtn.className = 'btn btn-danger w-100 py-2';
                }
              }
            }
            
            // Show success message
            alert(`Book "${book.title}" successfully borrowed!\n\nPlease return by: ${toDate}`);
            
            // Optionally redirect after success
            setTimeout(() => {
              window.location.href = '../borrowedBooks/borrowedBooks.php';
            }, 2000);
            
          } else {
            // Show error message
            alert(`Failed to borrow book: ${result.message || 'Unknown error'}`);
          }
        } catch (error) {
          console.error('Error borrowing book:', error);
          alert('Failed to process borrow request. Please try again.');
        }
      });
    }

    // Fetch book details and initialize
    fetchBookDetails();
    updateBookUI(); // Show initial loading state
    updateConfirmButton();

  } catch (err) {
    console.error('Failed to load borrow page:', err);
    alert('Error loading page. Please try again.');
  }
});