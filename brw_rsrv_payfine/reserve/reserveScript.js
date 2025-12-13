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

    // Fetch book details from database
    async function fetchBookDetails() {
      if (!bookISBN) {
        alert('No book selected. Please select a book from the list.');
        window.location.href = '../search/index.php';
        return;
      }

      try {
        console.log('Fetching book details for ISBN:', bookISBN);

        // FIX 1: correct parameter name
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

        // FIX 2: use Cover URL returned by backend
        book = {
          isbn: bookData.ISBN || bookISBN,
          title: bookData.Title || 'Unknown Title',
          author: bookData.Author || 'Unknown Author',
          cover: bookData.Cover || '../ULiblogo.png',
          edition: bookData.Edition || '-',
          copies: parseInt(bookData.Copies || 0),
          genre: bookData.Genre || '',
          yearOfPublish: bookData.YearofPublish || ''
        };

        console.log('Book object created:', book);

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
        // FIX 3: consistent cover usage
        coverImg.src = book.cover || '../ULiblogo.png';

        titleField.textContent = book.title || '-';
        isbnField.textContent = book.isbn || '-';
        editionField.textContent = book.edition || '-';
        authorField.textContent = book.author || '-';

        const copiesField = document.getElementById('copiesField');
        if (copiesField) {
          copiesField.textContent = (book.copies != null) ? String(book.copies) : '-';

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

    // Date handling
    const fromInput = document.getElementById('fromDate');
    const toInput = document.getElementById('toDate');

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    if (fromInput) {
      fromInput.setAttribute('min', todayStr);
      fromInput.value = todayStr;
    }

    if (toInput) {
      toInput.setAttribute('min', todayStr);
      const defaultReturn = new Date();
      defaultReturn.setDate(defaultReturn.getDate() + 7);
      toInput.value = defaultReturn.toISOString().split('T')[0];
    }

    function validateDates() {
      if (!fromInput || !toInput) return false;
      const f = fromInput.value;
      const t = toInput.value;
      toInput.setCustomValidity('');

      if (!f || !t) return false;

      if (t < f) {
        toInput.setCustomValidity('End date cannot be before start date.');
        toInput.reportValidity();
        return false;
      }
      return true;
    }

    const confirmBtn = document.getElementById('confirmReserve');

    function updateConfirmButton() {
      const hasBook = !!book;
      const datesValid = validateDates();

      if (confirmBtn) {
        confirmBtn.disabled = !(hasBook && datesValid);
        confirmBtn.textContent = 'Confirm Reservation';
        confirmBtn.className = confirmBtn.disabled
          ? 'btn btn-secondary w-100 py-2'
          : 'btn btn-primary w-100 py-2';
      }
    }

    if (fromInput) fromInput.addEventListener('change', () => { validateDates(); updateConfirmButton(); });
    if (toInput) toInput.addEventListener('change', () => { validateDates(); updateConfirmButton(); });

    const cancelBtn = document.getElementById('cancelReserve');
    cancelBtn.addEventListener('click', () => {
      window.location.href = '../search/index.php';
    });

    // Confirm reservation
    if (confirmBtn) {
      confirmBtn.addEventListener('click', async () => {
        if (!book || !validateDates()) return;

        const fromDate = fromInput.value;
        const toDate = toInput.value;

        if (!confirm(`Confirm reserving "${book.title}"?\n\nStart Date: ${fromDate}\nEnd Date: ${toDate}`)) {
          return;
        }

        try {
          const response = await fetch('../API/reserveRequest.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bookISBN: book.isbn,
              reserve_start: fromDate,
              reserve_end: toDate
            })
          });

          const result = await response.json();

          if (response.ok && result.success) {
            confirmBtn.disabled = true;
            confirmBtn.textContent = 'Book Reserved!';
            confirmBtn.className = 'btn btn-success w-100 py-2';

            alert(`Book "${book.title}" successfully reserved!\n\n${fromDate} to ${toDate}`);

            setTimeout(() => {
              window.location.href = '../search/index.php';
            }, 2000);
          } else {
            alert(`Failed to reserve book: ${result.message || 'Unknown error'}`);
          }
        } catch (error) {
          console.error('Reservation error:', error);
          alert('Failed to process reservation request.');
        }
      });
    }

    fetchBookDetails();
    updateBookUI();
    updateConfirmButton();

  } catch (err) {
    console.error('Failed to load reserve page:', err);
    alert('Error loading page. Please try again.');
  }
});
