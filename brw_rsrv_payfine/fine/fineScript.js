document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('fineCardsRow');
  if (!container) return;

  let records = [];
  try {
    records = JSON.parse(localStorage.getItem('borrowRecords') || '[]');
  } catch (e) {
    console.error('Failed to parse borrowRecords', e);
    records = [];
  }

  // Load books map for author/title fallback
  let booksMap = {};
  try {
    const books = JSON.parse(localStorage.getItem('Books') || '[]');
    if (Array.isArray(books)) {
      books.forEach(b => { if (b && b.id) booksMap[b.id] = b; });
    }
  } catch (e) {
    console.error('Failed to load Books for mapping', e);
  }

  // Fine calculation settings
  const ratePerDay = 0.5; // $0.50 per day
  const today = new Date();

  // Helpers
  function daysBetween(dateStr) {
    if (!dateStr) return 0;
    const d = new Date(dateStr + 'T00:00:00');
    const diff = Math.floor((today - d) / (1000 * 60 * 60 * 24));
    return diff;
  }

  // Filter overdue records and render full-row cards
  const overdue = (records || []).filter(r => {
    if (!r || !r.to) return false;
    const d = new Date(r.to + 'T00:00:00');
    return today > d;
  });

  if (!overdue || overdue.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-success">No overdue fines at the moment.</div>
      </div>
    `;
    return;
  }

  container.innerHTML = '';
  overdue.forEach(r => {
    const book = (r.bookId && booksMap[r.bookId]) ? booksMap[r.bookId] : null;
    const title = r.title || (book && book.title) || 'Untitled Book';
    // show ISBN instead of author on the fine card
    const isbn = (book && book.isbn) || r.bookId || r.isbn || '-';
    const due = r.to || '-';
    const daysOver = Math.max(0, daysBetween(due));
    const fine = (daysOver * ratePerDay).toFixed(2);

    const col = document.createElement('div');
    col.className = 'col-12';
    col.innerHTML = `
      <div class="card">
        <div class="row g-0 align-items-center">
          <div class="col">
            <div class="card-body">
              <h5 class="card-title">${title}</h5>
              <p class="card-text mb-1"><strong>ISBN:</strong> ${isbn}</p>
              <p class="card-text mb-1"><strong>Due Date:</strong> ${due} <strong class="ms-3">Days Overdue:</strong> ${daysOver}</p>
              <p class="card-text"><strong>Fine:</strong> ${fine} BD</p>
            </div>
          </div>
          <div class="col-3 pe-4 d-flex align-items-center justify-content-center">
            <button class="btn btn-primary w-100 rounded pay-btn">Pay</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(col);
    // Attach pay handler
    const payBtn = col.querySelector('.pay-btn');
    if (payBtn) {
      payBtn.addEventListener('click', () => {
        if (!confirm(`Pay $${fine} for "${title}"?`)) return;
        try {
          // Remove borrow record from storage
          let storedRecords = JSON.parse(localStorage.getItem('borrowRecords') || '[]');
          const recIndex = storedRecords.findIndex(rr => (rr.timestamp === r.timestamp) && (rr.bookId === r.bookId || rr.title === r.title));
          if (recIndex !== -1) {
            storedRecords.splice(recIndex, 1);
            localStorage.setItem('borrowRecords', JSON.stringify(storedRecords));
          }

          // Update book copies (increment)
          try {
            const storedBooks = JSON.parse(localStorage.getItem('Books') || '[]');
            const foundIdx = storedBooks.findIndex(b => (r.bookId && b.id && b.id === r.bookId) || (b.title === title) || (b.isbn && b.isbn === isbn));
            if (foundIdx !== -1) {
              storedBooks[foundIdx].copies = (storedBooks[foundIdx].copies || 0) + 1;
              localStorage.setItem('Books', JSON.stringify(storedBooks));
            }
          } catch (e) {
            console.error('Failed to update Books copies after payment', e);
          }

          // Optionally record payment
          try {
            const payments = JSON.parse(localStorage.getItem('finePayments') || '[]');
            payments.push({ bookId: r.bookId || null, title, amount: Number(fine), paidAt: new Date().toISOString() });
            localStorage.setItem('finePayments', JSON.stringify(payments));
          } catch (e) {
            console.error('Failed to record fine payment', e);
          }

          // Remove card from UI
          col.remove();

          // If no more overdue, show empty message
          const remaining = (JSON.parse(localStorage.getItem('borrowRecords') || '[]')).filter(rr => rr && rr.to && (new Date(rr.to + 'T00:00:00') < new Date()));
          if (!remaining || remaining.length === 0) {
            container.innerHTML = `\n      <div class="col-12">\n        <div class="alert alert-success">No overdue fines at the moment.</div>\n      </div>\n    `;
          }

          alert('Payment recorded. Thank you.');
        } catch (err) {
          console.error('Payment failed', err);
          alert('Failed to process payment. See console for details.');
        }
      });
    }
  });
});
