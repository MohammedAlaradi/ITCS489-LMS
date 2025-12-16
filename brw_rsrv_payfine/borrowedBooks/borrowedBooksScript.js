document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('borrowedCardsRow');
    if (!container) return;

    // Fetch borrowed books for the logged-in user
    fetch('../API/getBorrowed.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch borrowed books');
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                container.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-info">
                            You have no borrowed books recorded.
                        </div>
                    </div>
                `;
                return;
            }

            container.innerHTML = '';
            data.forEach(record => renderBorrowedCard(record));
        })
        .catch(error => {
            console.error('Fetching Error:', error);
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger">
                        Failed to load borrowed books. Please try again later.
                    </div>
                </div>
            `;
        });

    function renderBorrowedCard(rec) {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6 mb-3';

        const title  = rec.Title || 'Untitled Book';
        const author = rec.Author || '-';

        // Cover image URL (safe fallback)
        const imgSrc = rec.ISBN
            ? `../API/getCover.php?isbn=${encodeURIComponent(rec.ISBN)}`
            : '../ULiblogo.png';

        col.innerHTML = `
            <div class="card shadow-sm h-100">
                <div class="row g-0">
                    <div class="col-4">
                        <img src="${imgSrc}" class="img-fluid rounded-start" alt="Book cover"
                            onerror="this.src='../ULiblogo.png'">
                    </div>
                    <div class="col-8">
                        <div class="card-body d-flex flex-column h-100">
                            <h5 class="card-title">${title}</h5>

                            <p class="card-text mb-1">
                                <strong>Author:</strong> ${author}
                            </p>

                            <p class="card-text mb-2">
                                <strong>From:</strong> ${rec.borrow_date}<br>
                                <strong>To:</strong> ${rec.return_date ?? '-'}
                            </p>

                            <div class="mt-auto">
                                <button class="btn btn-primary w-100 return-btn">
                                    Return
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(col);

        // Return book handler
        const returnBtn = col.querySelector('.return-btn');
        returnBtn.addEventListener('click', () => {
            if (!confirm(`Mark "${title}" as returned?`)) return;

            fetch('../API/returnRequest.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ISBN: rec.ISBN })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Return request failed');
                    }
                    return response.json();
                })
                .then(resp => {
                    if (resp.success) {
                        col.remove();

                        if (container.children.length === 0) {
                            container.innerHTML = `
                                <div class="col-12">
                                    <div class="alert alert-info">
                                        You have no borrowed books recorded.
                                    </div>
                                </div>
                            `;
                        }

                        alert('Book marked as returned.');
                    } else {
                        alert(resp.message || 'Failed to return book.');
                    }
                })
                .catch(err => {
                    console.error('Return API error:', err);
                    alert('Failed to contact server.');
                });
        });
    }
});
