document.addEventListener('DOMContentLoaded', () => {
  try {
    const stored = localStorage.getItem('selectedBook');
    const book = stored ? JSON.parse(stored) : null;
    const coverImg = document.getElementById('coverImg');
    const titleField = document.getElementById('titleField');
    const isbnField = document.getElementById('isbnField');
    const editionField = document.getElementById('editionField');
    const authorField = document.getElementById('authorField');

    if (book) {
      // normalize image path: if the stored path is a simple filename (e.g. "ULiblogo.png"),
      // prefix with ../ because this page is inside the `borrow/` folder.
      let imgPath = book.image || '';
      if (imgPath && !imgPath.match(/^(https?:|\/|\.\.)/)) {
        imgPath = '../' + imgPath;
      }
      coverImg.src = imgPath || '../ULiblogo.png';
      titleField.textContent = book.title || '-';
      isbnField.textContent = book.isbn || '-';
      editionField.textContent = book.edition || '-';
      authorField.textContent = book.author || '-';
    } else {
      // no selected book
      coverImg.src = '../ULiblogo.png';
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
    }
    if (toInput) {
      toInput.setAttribute('min', todayStr);
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
        toInput.setCustomValidity('The Start of The Borrowing Period Cannot Be After The End.');
        toInput.reportValidity();
        return false;
      }
      return true;
    }

    const confirmBtn = document.getElementById('confirmBorrow');

    function updateConfirmButton() {
      // Only enable when there is a selected book and dates are present & valid
      const hasBook = !!book;
      const datesValid = validateDates();
      if (confirmBtn) {
        confirmBtn.disabled = !(hasBook && datesValid);
      }
    }

    if (fromInput) fromInput.addEventListener('change', () => { validateDates(); updateConfirmButton(); });
    if (toInput) toInput.addEventListener('change', () => { validateDates(); updateConfirmButton(); });

    // initial update to set button state on load
    updateConfirmButton();

    // Cancel button: return to index
    const cancelBtn = document.getElementById('cancelBorrow');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        // navigate back to the search page index
        window.location.href = '../search/index.html';
      });
    }

    // simple confirmation handler (stores a brief record in localStorage and gives feedback)
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        if (!book) return;
        if (!validateDates()) {
          // defensive: don't proceed if dates invalid
          updateConfirmButton();
          return;
        }
        const borrowRecord = {
          bookId: book.id || book.isbn || null,
          title: book.title || '',
          from: fromInput.value,
          to: toInput.value,
          timestamp: new Date().toISOString()
        };
        // append to an array of borrows in localStorage for demo purposes
        try {
          const existing = JSON.parse(localStorage.getItem('borrowRecords') || '[]');
          existing.push(borrowRecord);
          localStorage.setItem('borrowRecords', JSON.stringify(existing));
        } catch (e) {
          console.error('Failed to save borrow record', e);
        }
        // give feedback and disable the button to avoid duplicate clicks
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Confirmed';
        // optionally you could navigate back or show a nicer UI; keep it simple for now
        alert('Borrow confirmed for "' + (book.title || 'selected book') + '" from ' + borrowRecord.from + ' to ' + borrowRecord.to + '.');
      });
    }
  } catch (err) {
    console.error('Failed to load selected book:', err);
  }
});
