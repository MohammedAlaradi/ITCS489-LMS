document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('borrowedCardsRow');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const userID = params.get('userID');

    if (!userID) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    User not identified. Please log in again.
                </div>
            </div>
        `;
        return;
}


    fetch(`../API/getBorrowed.php?userID=${encodeURIComponent(userID)}`)
        .then(res => res.json())
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                container.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-info">You have no borrowed books recorded.</div>
                    </div>
                `;
                return;
            }

            container.innerHTML = '';
            data.forEach(record => renderBorrowedCard(record));
        })
        .catch(err => {
            console.error('Fetching Error:', err);
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger">Failed to load borrowed books.</div>
                </div>
            `;
        });


    function renderBorrowedCard(rec) {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6';

        const title = rec.Title || "Untitled Book";
        const author = rec.Author || "-";
        const img = fetch("../getCover.php") || "../ULiblogo.png";

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
                            <p class="card-text mb-1">
                                <strong>From:</strong> ${rec.borrow_date}
                                <strong class="ms-3">To:</strong> ${rec.return_date ?? "-"}
                            </p>

                            <div class="d-flex justify-content-end mt-2">
                                <button class="btn btn-primary w-100 rounded return-btn">Return</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(col);


        const returnBtn = col.querySelector('.return-btn');
        returnBtn.addEventListener('click', () => {
            if (!confirm(`Mark "${title}" as returned?`)) return;

            fetch('../API/returnRequest.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ISBN: rec.ISBN })
            })
                .then(res => res.json())
                .then(resp => {
                    if (resp.success) {
                        col.remove();

                        if (container.children.length === 0) {
                            container.innerHTML = `
                                <div class="col-12">
                                    <div class="alert alert-info">You have no borrowed books recorded.</div>
                                </div>
                            `;
                        }

                        alert("Book marked as returned.");
                    } else {
                        alert("Failed to return book.");
                    }
                })
                .catch(err => {
                    console.error("Return API error:", err);
                    alert("Failed to contact server.");
                });
        });
    }
});
