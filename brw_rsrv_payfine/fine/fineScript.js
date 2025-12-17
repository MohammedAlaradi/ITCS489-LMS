document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('fineCardsRow');
  if (!container) return;

  fetchFines();

  async function fetchFines() {
    try {
      const response = await fetch('../API/getFines.php');
      if (!response.ok) throw new Error('Failed to fetch fines');

      const fines = await response.json();

      if (!Array.isArray(fines) || fines.length === 0) {
        showEmptyState();
        return;
      }

      renderFines(fines);
    } catch (err) {
      console.error(err);
      container.innerHTML = `
        <div class="col-12">
          <div class="alert alert-danger">
            Failed to load fines. Please try again later.
          </div>
        </div>
      `;
    }
  }

  function renderFines(fines) {
    container.innerHTML = '';

    fines.forEach(fine => {
      const {
        fine_id,
        ISBN,
        Title,
        DueDate,
        FineAmount,
        Status
      } = fine;

      const col = document.createElement('div');
      col.className = 'col-12';

col.innerHTML = `
  <div class="card mb-3">
    <div class="row g-0 align-items-center">


      <div class="col-md-2 d-flex align-items-center justify-content-center p-2">
        <img
          src="../API/getCover.php?isbn=${encodeURIComponent(ISBN)}"
          alt="Book Cover"
          class="img-fluid rounded"
          style="max-height: 120px; object-fit: contain;"
        >
      </div>

      <!-- Book Info -->
      <div class="col-md-7">
        <div class="card-body">
          <h5 class="card-title">${Title ?? 'Unknown Book'}</h5>
          <p class="card-text mb-1">
            <strong>ISBN:</strong> ${ISBN ?? '-'}
          </p>
          <p class="card-text mb-1">
            <strong>Due Date:</strong> ${DueDate ?? '-'}
          </p>
          <p class="card-text">
            <strong>Fine:</strong> ${FineAmount} BD
          </p>
          <span class="badge ${
            Status === 'Overdue' ? 'bg-danger' : 'bg-warning text-dark'
          }">
            ${Status}
          </span>
        </div>
      </div>

      <!-- Pay Button -->
      <div class="col-md-3 pe-4 d-flex align-items-center justify-content-center">
        <button class="btn btn-primary w-100 pay-btn rounded">
          Pay
        </button>
      </div>

    </div>
  </div>
`;


      container.appendChild(col);

      const payBtn = col.querySelector('.pay-btn');
      payBtn.addEventListener('click', () => payFine(fine_id, FineAmount, col));
    });
  }

  async function payFine(fineID, amount, cardElement) {
    if (!confirm(`Pay ${amount} BD for this fine?`)) return;

    try {
      const response = await fetch('../API/payFine.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fine_id: fineID })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Payment failed');
      }

      // Remove card from UI
      cardElement.remove();

      // If no fines left, show empty state
      if (container.children.length === 0) {
        showEmptyState();
      }

      alert('Fine paid successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to process payment. Please try again.');
    }
  }

  function showEmptyState() {
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-success">
          No outstanding fines 🎉
        </div>
      </div>
    `;
  }
});
