document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('borrowedCardsRow');
  if (!container) return;

  // Load borrowRecords (array of { bookId, title, from, to, timestamp })
  let records = [];
  try {
    records = JSON.parse(localStorage.getItem('borrowRecords') || '[]');
  } catch (e) {
    console.error('Failed to parse borrowRecords', e);
    records = [];
  }

  if (!records || records.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-info">You have no borrowed books recorded.</div>
      </div>
    `;
    return;
  }

  // Try to load Books map to show author/cover if possible
  let booksMap = {};
  try {
    const books = JSON.parse(localStorage.getItem('Books') || '[]');
    if (Array.isArray(books)) {
      books.forEach(b => { if (b && b.id) booksMap[b.id] = b; });
    }
  } catch (e) {
    console.error('Failed to load Books for mapping', e);
  }

  // Render each record as a Bootstrap card
  container.innerHTML = '';
  records.slice().reverse().forEach(rec => {
    const book = (rec.bookId && booksMap[rec.bookId]) ? booksMap[rec.bookId] : null;
    const title = rec.title || (book && book.title) || 'Untitled Book';
    const author = (book && book.author) || rec.author || '-';
    const from = rec.from || '-';
    const to = rec.to || '-';
    const ts = rec.timestamp ? new Date(rec.timestamp).toLocaleString() : '';
    const img = (book && book.image) ? ((book.image.match(/^(https?:|\/|\.\.)/)) ? book.image : '../' + book.image) : '../ULiblogo.png';

    const col = document.createElement('div');
    col.className = 'col-12 col-md-6';
    col.innerHTML = `
      <div class="card">
        <div class="row g-0">
          <div class="col-4">
            <img src="${img}" class="img-fluid rounded-start" alt="cover">
          </div>
          <div class="col-8">
            <div class="card-body">
              <h5 class="card-title">${title}</h5>
              <p class="card-text mb-1"><strong>Author:</strong> ${author}</p>
              <p class="card-text mb-1"><strong>From:</strong> ${from} <strong class="ms-3">To:</strong> ${to}</p>
              <p class="card-text"><small class="text-muted">Borrowed at ${ts}</small></p>
              <div class="d-flex justify-content-end mt-2">
                <button class="btn btn-primary w-100 rounded return-btn">Return</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    container.appendChild(col);
    // Attach handler for returning this book
    const returnBtn = col.querySelector('.return-btn');
    if (returnBtn) {
      returnBtn.addEventListener('click', () => {
        if (!confirm(`Mark "${title}" as returned?`)) return;
        try {
          // Remove this borrow record from localStorage.borrowRecords
          let storedRecords = JSON.parse(localStorage.getItem('borrowRecords') || '[]');
          const recIndex = storedRecords.findIndex(r => (r.timestamp === rec.timestamp) && (r.bookId === rec.bookId || r.title === rec.title));
          if (recIndex !== -1) {
            storedRecords.splice(recIndex, 1);
            localStorage.setItem('borrowRecords', JSON.stringify(storedRecords));
          }

          // Update Books: increment copies for the corresponding book
          try {
            const storedBooks = JSON.parse(localStorage.getItem('Books') || '[]');
            const foundIdx = storedBooks.findIndex(b => (rec.bookId && b.id && b.id === rec.bookId) || (b.title === rec.title && b.author === author));
            if (foundIdx !== -1) {
              storedBooks[foundIdx].copies = (storedBooks[foundIdx].copies || 0) + 1;
              localStorage.setItem('Books', JSON.stringify(storedBooks));
            }
          } catch (e) {
            console.error('Failed to update Books copies on return', e);
          }

          // Remove card from UI
          col.remove();

          // If no more records, show empty message
          const remaining = JSON.parse(localStorage.getItem('borrowRecords') || '[]');
          if (!remaining || remaining.length === 0) {
            container.innerHTML = `
              <div class="col-12">
                <div class="alert alert-info">You have no borrowed books recorded.</div>
              </div>
            `;
          }

          alert('Book marked as returned and copies updated.');
        } catch (err) {
          console.error('Return action failed', err);
          alert('Failed to mark the book as returned. See console for details.');
        }
      });
    }
  });
});
