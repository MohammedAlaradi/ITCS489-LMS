document.addEventListener('DOMContentLoaded', () => {
  try {
    // Get book ISBN from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const bookISBN = urlParams.get('bookISBN');

    let book = null;

    const coverImg = document.getElementById('coverImg');
    const titleField = document.getElementById('titleField');
    const isbnField = document.getElementById('isbnField');
    const editionField = document.getElementById('editionField');
    const authorField = document.getElementById('authorField');
    const publisherField = document.getElementById('publisherField');

    // Fetch book details
    async function fetchBookDetails() {
      if (!bookISBN) {
        alert('No book selected. Please select a book from the list.');
        window.location.href = '../search/index.php';
        return;
      }

      try {
        console.log('Fetching book details for ISBN:', bookISBN);

        //
        const response = await fetch(`../API/getBook.php?isbn=${bookISBN}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const bookData = await response.json();
        console.log('Book data received:', bookData);

        if (bookData.error) {
          throw new Error(bookData.error);
        }

        if (!bookData || Object.keys(bookData).length === 0) {
          throw new Error('Book not found in database');
        }

        //
        book = {
          isbn: bookData.ISBN,
          title: bookData.Title || 'Unknown Title',
          author: bookData.Author || 'Unknown Author',
          cover: `../API/getCover.php?isbn=${bookISBN}`,
          edition: bookData.Edition || '-',
          copies: parseInt(bookData.Copies || 0),
          genre: bookData.Genre || '',
          yearOfPublish: bookData.YearofPublish || '',
          publisher: bookData.Publisher || ''
        };

        updateBookUI();
        updateConfirmButton();

      } catch (error) {
        console.error('Error fetching book details:', error);
        alert(`Error loading book details: ${error.message}`);
        updateBookUI();
        updateConfirmButton();
      }
    }

    // Update UI
    function updateBookUI() {
      if (book) {
        coverImg.src = book.cover;

        titleField.textContent = book.title || '-';
        isbnField.textContent = book.isbn || '-';
        editionField.textContent = book.edition || '-';
        authorField.textContent = book.author || '-';
        publisherField.textContent = book.publisher || '-';

        const copiesField = document.getElementById('copiesField');
        if (copiesField) {
          copiesField.textContent = String(book.copies);

          if (book.copies > 3) {
            copiesField.className = 'form-control-plaintext text-success';
          } else if (book.copies > 0) {
            copiesField.className = 'form-control-plaintext text-warning';
          } else {
            copiesField.className = 'form-control-plaintext text-danger';
          }
        }
      } else {
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

    // Date inputs
    const fromInput = document.getElementById('fromDate');
    const toInput = document.getElementById('toDate');

    const today = new Date().toISOString().split('T')[0];
    if (fromInput) {
      fromInput.setAttribute('min', today);
      fromInput.value = today;
    }

    if (toInput) {
      toInput.setAttribute('min', today);
      const defaultReturn = new Date();
      defaultReturn.setDate(defaultReturn.getDate() + 7);
      toInput.value = defaultReturn.toISOString().split('T')[0];
    }

    function validateDates() {
      if (!fromInput || !toInput) return false;
      toInput.setCustomValidity('');

      if (!fromInput.value || !toInput.value) return false;

      if (toInput.value < fromInput.value) {
        toInput.setCustomValidity('Return date cannot be before borrow date.');
        toInput.reportValidity();
        return false;
      }
      return true;
    }

    const confirmBtn = document.getElementById('confirmBorrow');

    function updateConfirmButton() {
      const enabled = book && validateDates() && book.copies > 0;

      if (confirmBtn) {
        confirmBtn.disabled = !enabled;

        if (!enabled && book && book.copies === 0) {
          confirmBtn.textContent = 'No Copies Available';
          confirmBtn.className = 'btn btn-danger w-100 py-2';
        } else {
          confirmBtn.textContent = 'Confirm Borrow';
          confirmBtn.className = enabled
            ? 'btn btn-primary w-100 py-2'
            : 'btn btn-secondary w-100 py-2';
        }
      }
    }

    if (fromInput) fromInput.addEventListener('change', updateConfirmButton);
    if (toInput) toInput.addEventListener('change', updateConfirmButton);

    const cancelBtn = document.getElementById('cancelBorrow');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        window.location.href = '../search/index.php';
      });
    }

    // Borrow confirmation
    if (confirmBtn) {
      confirmBtn.addEventListener('click', async () => {
        if (!book || !validateDates()) return;

        const fromDate = fromInput.value;
        const toDate = toInput.value;

        if (!confirm(`Confirm borrowing "${book.title}"?\n\nBorrow Date: ${fromDate}\nReturn Date: ${toDate}`)) {
          return;
        }

        try {
          const response = await fetch('../API/borrowRequest.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bookISBN: book.isbn,
              borrow_date: fromDate,
              return_date: toDate
            })
          });

          const result = await response.json();

          if (response.ok && result.success) {
            alert(`Book "${book.title}" successfully borrowed!\n\nPlease return by ${toDate}`);
            window.location.href = '../borrowedBooks/borrowedBooks.php';
          } else {
            alert(`Failed to borrow book: ${result.message || 'Unknown error'}`);
          }
        } catch (error) {
          console.error('Borrow error:', error);
          alert('Failed to process borrow request.');
        }
      });
    }

    fetchBookDetails();
    updateBookUI();
    updateConfirmButton();

  } catch (err) {
    console.error('Failed to load borrow page:', err);
    alert('Error loading page. Please try again.');
  }
});
