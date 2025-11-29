// ============================
//  ULib Fine Management Script
//  Hybrid: API + LocalStorage + DOM fallback
// ============================

// نحمي نفسنا لو API_CONFIG غير موجود
const API_BASE_URL = (window.API_CONFIG && window.API_CONFIG.BASE_URL)
    ? window.API_CONFIG.BASE_URL
    : '';

console.log('fineupdate.js loaded'); // للتأكد أنه اشتغل

// --------- LocalStorage Keys ---------
const LS_FINES_KEY   = 'ulibOfflineFines';
const LS_HISTORY_KEY = 'ulibOfflineFineHistory';

// --------- Global State ---------
let fines = [];
let filteredFines = [];
let fineHistory = [];

const finesPerPage = 6;

let currentPage = 1;
let currentSort = 'none';        // 'none' | 'high' | 'low'
let currentStatus = 'all';       // 'all' | 'Paid' | 'Pending' | 'Overdue' | 'Waived'
let currentSearchTerm = '';

let advMemberId = '';
let advStartDate = '';
let advEndDate = '';
let advMinAmount = '';
let advMaxAmount = '';

// ============================
//  LocalStorage helpers
// ============================

function saveFinesToLocalStorage() {
    try {
        localStorage.setItem(LS_FINES_KEY, JSON.stringify(fines));
        console.log('✅ Fines saved to LocalStorage');
    } catch (err) {
        console.error('Error saving fines to LocalStorage:', err);
    }
}

function saveHistoryToLocalStorage() {
    try {
        localStorage.setItem(LS_HISTORY_KEY, JSON.stringify(fineHistory));
        console.log('✅ History saved to LocalStorage');
    } catch (err) {
        console.error('Error saving history to LocalStorage:', err);
    }
}

function loadLocalStorageData() {
    try {
        const storedFines   = localStorage.getItem(LS_FINES_KEY);
        const storedHistory = localStorage.getItem(LS_HISTORY_KEY);

        if (storedFines) {
            fines = JSON.parse(storedFines);
            console.log('📦 Loaded fines from LocalStorage');
        }

        if (storedHistory) {
            fineHistory = JSON.parse(storedHistory);
            console.log('📦 Loaded history from LocalStorage');
        }
    } catch (err) {
        console.error('Error loading LocalStorage data:', err);
    }
}

// --------- State Save / Load ---------

function saveState() {
    const state = {
        page: currentPage,
        sort: currentSort,
        status: currentStatus,
        searchTerm: currentSearchTerm,
        advMemberId,
        advStartDate,
        advEndDate,
        advMinAmount,
        advMaxAmount
    };

    localStorage.setItem('fineManagementState', JSON.stringify(state));

    const params = new URLSearchParams(window.location.search);
    Object.entries(state).forEach(([key, value]) => {
        if (value && value !== 'all' && !(key === 'page' && value === 1) && value !== '') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
    });

    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
}

function loadState() {
    const params = new URLSearchParams(window.location.search);
    const savedState = JSON.parse(localStorage.getItem('fineManagementState') || '{}');

    currentPage       = parseInt(params.get('page')) || savedState.page || 1;
    currentSort       = params.get('sort') || savedState.sort || 'none';
    currentStatus     = params.get('status') || savedState.status || 'all';
    currentSearchTerm = params.get('searchTerm') || savedState.searchTerm || '';

    advMemberId   = params.get('advMemberId')   || savedState.advMemberId   || '';
    advStartDate  = params.get('advStartDate')  || savedState.advStartDate  || '';
    advEndDate    = params.get('advEndDate')    || savedState.advEndDate    || '';
    advMinAmount  = params.get('advMinAmount')  || savedState.advMinAmount  || '';
    advMaxAmount  = params.get('advMaxAmount')  || savedState.advMaxAmount  || '';

    // تطبيق القيم على الـ UI
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = currentSearchTerm;

    const memberIdInputAdv = document.getElementById('memberId');
    if (memberIdInputAdv) memberIdInputAdv.value = advMemberId;

    const startDateInput = document.getElementById('startDate');
    if (startDateInput) startDateInput.value = advStartDate;

    const endDateInput = document.getElementById('endDate');
    if (endDateInput) endDateInput.value = advEndDate;

    const minAmountInput = document.getElementById('minAmount');
    if (minAmountInput) minAmountInput.value = advMinAmount;

    const maxAmountInput = document.getElementById('maxAmount');
    if (maxAmountInput) maxAmountInput.value = advMaxAmount;

    updateActiveFilterUI();
}

function updateActiveFilterUI() {
    // حالة الفلتر حسب الحالة (Status)
    document.querySelectorAll('#statusFilter .dropdown-item').forEach(item => {
        const val = item.getAttribute('value');
        if (!val) return;
        item.classList.toggle('active', val === currentStatus);
    });

    // حالة الفرز
    document.querySelectorAll('#sortDate .dropdown-item').forEach(item => {
        const val = item.getAttribute('value');
        if (!val) return;
        const isHigh = currentSort === 'high' && val === 'high';
        const isLow  = currentSort === 'low' && val === 'low';
        item.classList.toggle('active', isHigh || isLow);
    });
}

// popstate للزر back/forward
window.addEventListener('popstate', () => {
    loadState();
    applyFiltersAndDisplay();
});

// --------- DOM Ready ---------

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');

    loadLocalStorageData();
    loadState();
    setupEventListeners();

    fetchFines();
    fetchFineHistory();

    // ⭐ إصلاح history ليعمل بشكل مؤكد
    setTimeout(() => {
        renderFineHistory('');
    }, 300);
});


// --------- Event Listeners ---------

function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            currentSearchTerm = searchInput.value.trim();
            currentPage = 1;
            applyFiltersAndDisplay();
            saveState();
        });
    }

    // Status filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.querySelectorAll('.dropdown-item').forEach(item => {
            const value = item.getAttribute('value');
            if (!value) return;
            item.addEventListener('click', (e) => {
                e.preventDefault();
                currentStatus = value;
                currentPage = 1;
                updateActiveFilterUI();
                applyFiltersAndDisplay();
                saveState();
            });
        });

        const statusReset = document.getElementById('statusReset');
        if (statusReset) {
            statusReset.addEventListener('click', (e) => {
                e.preventDefault();
                currentStatus = 'all';
                currentPage = 1;
                updateActiveFilterUI();
                applyFiltersAndDisplay();
                saveState();
            });
        }
    }

    // Sort by amount
    const sortMenu = document.getElementById('sortDate');
    if (sortMenu) {
        sortMenu.querySelectorAll('.dropdown-item').forEach(item => {
            const value = item.getAttribute('value');
            if (!value) return;
            item.addEventListener('click', (e) => {
                e.preventDefault();
                currentSort = value === 'high' ? 'high' : 'low';
                currentPage = 1;
                updateActiveFilterUI();
                applyFiltersAndDisplay();
                saveState();
            });
        });

        const sortReset = document.getElementById('sortReset');
        if (sortReset) {
            sortReset.addEventListener('click', (e) => {
                e.preventDefault();
                currentSort = 'none';
                currentPage = 1;
                updateActiveFilterUI();
                applyFiltersAndDisplay();
                saveState();
            });
        }
    }

    // Advanced Search Apply
    const applyFilterBtn = document.getElementById('applyFilter');
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', () => {
            advMemberId  = (document.getElementById('memberId')?.value || '').trim();
            advStartDate = document.getElementById('startDate')?.value || '';
            advEndDate   = document.getElementById('endDate')?.value || '';
            advMinAmount = document.getElementById('minAmount')?.value || '';
            advMaxAmount = document.getElementById('maxAmount')?.value || '';

            currentPage = 1;
            applyFiltersAndDisplay();
            saveState();
        });
    }

    // Advanced Search Reset
    const resetFilterBtn = document.getElementById('resetFilter');
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', () => {
            advMemberId = advStartDate = advEndDate = advMinAmount = advMaxAmount = '';
            const ids = ['memberId','startDate','endDate','minAmount','maxAmount'];
            ids.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
            currentPage = 1;
            applyFiltersAndDisplay();
            saveState();
        });
    }

    // Update Fine form submit
    const updateFineForm = document.getElementById('updateFineForm');
    if (updateFineForm) {
        updateFineForm.addEventListener('submit', handleFineUpdateSubmit);
    }

    const resetFormBtn = document.getElementById('resetForm');
    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', () => {
            hideMemberInfo();
            hideBookInfo();
        });
    }

    // Member info blur
    const memberIdInput = document.getElementById('memberIdInput');
    if (memberIdInput) {
        memberIdInput.addEventListener('blur', () => {
            const id = memberIdInput.value.trim();
            if (id) fetchMemberInfo(id);
            else hideMemberInfo();
        });
    }

    const bookIdInput = document.getElementById('bookIdInput');
    if (bookIdInput) {
        bookIdInput.addEventListener('blur', () => {
            const id = bookIdInput.value.trim();
            if (id) fetchBookInfo(id);
            else hideBookInfo();
        });
    }

    // History search (لو عندك input باسم historySearch)
    const historySearchInput = document.getElementById('historySearch');
    if (historySearchInput) {
        historySearchInput.addEventListener('input', () => {
            renderFineHistory(historySearchInput.value.trim());
        });
    }
}

// ============================
//  API Calls + Hybrid Logic
// ============================

async function fetchFines() {
    // لو ما عندنا API → نشتغل من LocalStorage أو من الـ DOM
    if (!API_BASE_URL) {
        if (!fines || fines.length === 0) {
            console.warn('No API_BASE_URL, loading fines from DOM');
            buildFinesFromDOM();
            saveFinesToLocalStorage();
        } else {
            console.log('Using fines from LocalStorage (no API)');
        }
        applyFiltersAndDisplay();
        return;
    }

    // عندنا API
    try {
        const response = await fetch(`${API_BASE_URL}?action=getFines`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
            fines = data.data;
            saveFinesToLocalStorage();
            console.log('Fines loaded from API');
        } else {
            console.warn('Unexpected fines format from API, using LocalStorage/DOM fallback');
            if (!fines || fines.length === 0) {
                buildFinesFromDOM();
                saveFinesToLocalStorage();
            }
        }
    } catch (err) {
        console.error('Error fetching fines from API, fallback to LocalStorage/DOM:', err);
        if (!fines || fines.length === 0) {
            buildFinesFromDOM();
            saveFinesToLocalStorage();
        }
    }

    applyFiltersAndDisplay();
}

async function fetchFineHistory() {
    if (!API_BASE_URL) {
        if (!fineHistory || fineHistory.length === 0) {
            console.warn('No API_BASE_URL, loading history from DOM');
            buildHistoryFromDOM();
            saveHistoryToLocalStorage();
        } else {
            console.log('Using history from LocalStorage (no API)');
        }
        renderFineHistory('');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}?action=getFineHistory`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
            fineHistory = data.data;
            saveHistoryToLocalStorage();
            console.log('History loaded from API');
        } else {
            console.warn('Unexpected history format from API, using LocalStorage/DOM fallback');
            if (!fineHistory || fineHistory.length === 0) {
                buildHistoryFromDOM();
                saveHistoryToLocalStorage();
            }
        }
    } catch (err) {
        console.error('Error fetching history from API, fallback to LocalStorage/DOM:', err);
        if (!fineHistory || fineHistory.length === 0) {
            buildHistoryFromDOM();
            saveHistoryToLocalStorage();
        }
    }

    renderFineHistory('');
}

async function handleFineUpdateSubmit(e) {
    e.preventDefault();

    const memberId = document.getElementById('memberIdInput').value.trim();
    const bookId   = document.getElementById('bookIdInput').value.trim();
    const amount   = parseFloat(document.getElementById('fineAmount').value);
    const reason   = document.getElementById('fineReason').value;
    const status   = document.getElementById('fineStatus').value;
    const notes    = document.getElementById('notes').value.trim();

    if (!memberId || !bookId || isNaN(amount) || !reason || !status) {
        alert('Please fill all required fields.');
        return;
    }

    const fineId = findFineIdByMemberAndBook(memberId, bookId);

    const payload = {
        fine_id: fineId,
        member_id: memberId,
        book_id: bookId,
        amount,
        reason,
        status,
        notes
    };

    const btn = e.target.querySelector('button[type="submit"]');

    try {
        if (btn) { btn.disabled = true; btn.textContent = 'Updating...'; }

        // لا يوجد API → نعدّل في LocalStorage فقط
        if (!API_BASE_URL) {
            console.warn('No API_BASE_URL, updating fine in LocalStorage only');

            let target = null;
            if (fineId != null) {
                target = fines.find(f => String(f.id) === String(fineId));
            }

            const previousStatus = target ? target.status : '-';

            if (target) {
                target.amount = amount;
                target.reason = reason;
                target.status = status;
                target.notes  = notes;
            } else {
                // إنشاء غرامة جديدة لو لم نجد واحدة
                const newId = getNextFineId();
                target = {
                    id: newId,
                    member_id: memberId,
                    member_name: memberId, // تستطيع تعديله لاحقاً
                    book_id: bookId,
                    book_title: bookId,
                    amount,
                    due_date: new Date().toISOString().split('T')[0],
                    status,
                    reason,
                    notes
                };
                fines.push(target);
            }

            saveFinesToLocalStorage();

            fineHistory.push({
                date: new Date().toISOString().split('T')[0],
                member_id: memberId,
                book_id: bookId,
                amount,
                previous_status: previousStatus,
                new_status: status,
                updated_by: 'Offline User',
                notes
            });

            saveHistoryToLocalStorage();

            alert('Fine updated locally (no API).');
            applyFiltersAndDisplay();
            renderFineHistory('');
        } else {
            // يوجد API
            const response = await fetch(`${API_BASE_URL}?action=updateFine`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (!result.success) throw new Error(result.message || 'Failed to update fine');
            alert('Fine updated successfully!');
            await fetchFines();
            await fetchFineHistory();
        }
    } catch (err) {
        console.error('Error updating fine:', err);
        alert('Error updating fine: ' + err.message);
    } finally {
        if (btn) { btn.disabled = false; btn.textContent = 'Update Fine'; }
    }
}

async function fetchMemberInfo(memberId) {
    if (!API_BASE_URL) {
        console.warn('No API_BASE_URL for member info');
        return;
    }
    try {
        const res = await fetch(`${API_BASE_URL}?action=getMember&memberId=${encodeURIComponent(memberId)}`);
        const data = await res.json();
        if (data.success && data.member) showMemberInfo(data.member);
        else hideMemberInfo();
    } catch (err) {
        console.error('Error member info:', err);
        hideMemberInfo();
    }
}

async function fetchBookInfo(bookId) {
    if (!API_BASE_URL) {
        console.warn('No API_BASE_URL for book info');
        return;
    }
    try {
        const res = await fetch(`${API_BASE_URL}?action=getBook&bookId=${encodeURIComponent(bookId)}`);
        const data = await res.json();
        if (data.success && data.book) showBookInfo(data.book);
        else hideBookInfo();
    } catch (err) {
        console.error('Error book info:', err);
        hideBookInfo();
    }
}

// --------- Member/Book Info ---------

function showMemberInfo(member) {
    const info = document.getElementById('memberInfo');
    if (!info) return;
    document.getElementById('memberName').textContent  = member.name || '-';
    document.getElementById('memberEmail').textContent = member.email || '-';
    document.getElementById('memberPhone').textContent = member.phone || '-';
    info.style.display = 'block';
}

function hideMemberInfo() {
    const info = document.getElementById('memberInfo');
    if (info) info.style.display = 'none';
}

function showBookInfo(book) {
    const info = document.getElementById('bookInfo');
    if (!info) return;
    document.getElementById('bookTitle').textContent  = book.title || '-';
    document.getElementById('bookAuthor').textContent = book.author || '-';
    document.getElementById('bookISBN').textContent   = book.isbn || '-';
    info.style.display = 'block';
}

function hideBookInfo() {
    const info = document.getElementById('bookInfo');
    if (info) info.style.display = 'none';
}

// --------- Build from DOM (fallback) ---------

function buildFinesFromDOM() {
    fines = [];
    const container = document.getElementById('currentFinesContainer');
    if (!container) {
        console.warn('currentFinesContainer not found');
        return;
    }

    const cards = container.querySelectorAll('.fine-card');
    cards.forEach((card, index) => {
        const name       = card.querySelector('.card-title')?.textContent.trim() || '';
        const statusText = card.querySelector('.badge')?.textContent.trim() || 'Pending';
        const memberId   = card.querySelector('p:nth-of-type(1)')?.textContent.split(':')[1]?.trim() || '';
        const bookId     = card.querySelector('p:nth-of-type(2)')?.textContent.split(':')[1]?.trim() || '';
        const book       = card.querySelector('p:nth-of-type(3)')?.textContent.split(':')[1]?.trim() || '';
        const amountStr  = card.querySelector('p:nth-of-type(4)')?.textContent.replace(/[^0-9.]/g, '') || '0';
        const dateText   = card.querySelector('p:nth-of-type(5)')?.textContent.split(':')[1]?.trim() || '';

        fines.push({
            id: index + 1,
            member_id: memberId,
            member_name: name,
            book_id: bookId,
            book_title: book,
            amount: parseFloat(amountStr),
            due_date: dateText,
            status: statusText,
            reason: card.querySelector('p:nth-of-type(6)')?.textContent.split(':')[1]?.trim() || '',
            notes: ''
        });
    });

    console.log('Built fines from DOM:', fines);
}

function buildHistoryFromDOM() {
    fineHistory = [];
    const tbody = document.getElementById('historyTableBody') || document.querySelector('.history-table tbody');
    if (!tbody) return;

    tbody.querySelectorAll('tr').forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 8) return;
        fineHistory.push({
            date: cells[0].textContent.trim(),
            member_id: cells[1].textContent.trim(),
            book_id: cells[2].textContent.trim(),
            amount: parseFloat(cells[3].textContent.replace(/[^0-9.]/g, '') || '0'),
            previous_status: cells[4].textContent.trim(),
            new_status: cells[5].textContent.trim(),
            updated_by: cells[6].textContent.trim(),
            notes: cells[7].textContent.trim()
        });
    });

    console.log('Built history from DOM:', fineHistory);
}

// --------- Filter + Display ---------

function applyFiltersAndDisplay() {
    filteredFines = [...fines];

    if (currentSearchTerm) {
        const term = currentSearchTerm.toLowerCase();
        filteredFines = filteredFines.filter(f =>
            (f.member_name || '').toLowerCase().includes(term) ||
            (f.member_id || '').toLowerCase().includes(term) ||
            (f.book_id || '').toLowerCase().includes(term) ||
            (f.book_title || '').toLowerCase().includes(term)
        );
    }

    if (currentStatus !== 'all') {
        filteredFines = filteredFines.filter(f =>
            (f.status || '').toLowerCase() === currentStatus.toLowerCase()
        );
    }

    if (advMemberId) {
        const term = advMemberId.toLowerCase();
        filteredFines = filteredFines.filter(f =>
            (f.member_id || '').toLowerCase().includes(term)
        );
    }

    if (advStartDate) {
        const start = new Date(advStartDate);
        filteredFines = filteredFines.filter(f => {
            const d = new Date(f.due_date);
            return !isNaN(d) && d >= start;
        });
    }
    if (advEndDate) {
        const end = new Date(advEndDate);
        filteredFines = filteredFines.filter(f => {
            const d = new Date(f.due_date);
            return !isNaN(d) && d <= end;
        });
    }

    if (advMinAmount) {
        const min = parseFloat(advMinAmount);
        filteredFines = filteredFines.filter(f => parseFloat(f.amount) >= min);
    }
    if (advMaxAmount) {
        const max = parseFloat(advMaxAmount);
        filteredFines = filteredFines.filter(f => parseFloat(f.amount) <= max);
    }

    if (currentSort === 'high') {
        filteredFines.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
    } else if (currentSort === 'low') {
        filteredFines.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
    }

    const totalPages = Math.max(1, Math.ceil(filteredFines.length / finesPerPage));
    if (currentPage > totalPages) currentPage = totalPages;

    displayFines();
    updatePagination(filteredFines.length);
}

function displayFines() {
    const container = document.getElementById('currentFinesContainer');
    if (!container) return;

    if (filteredFines.length === 0) {
        container.innerHTML = '<p class="text-center w-100">No fines found matching your criteria.</p>';
        return;
    }

    const startIndex = (currentPage - 1) * finesPerPage;
    const endIndex   = startIndex + finesPerPage;
    const finesToShow = filteredFines.slice(startIndex, endIndex);

    container.innerHTML = finesToShow.map(f => {
        const statusClass = getStatusBadgeClass(f.status);
        const dueOrPaidLabel = (f.status || '').toLowerCase() === 'paid' ? 'Paid Date' : 'Due Date';
        const dateValue = f.due_date || '-';

        return `
        <div class="col-md-6 col-lg-4 mb-3">
          <div class="card fine-card h-100" data-fine-id="${f.id || ''}">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="card-title">${escapeHtml(f.member_name || 'Unknown Member')}</h5>
                <span class="badge ${statusClass} rounded-pill">${escapeHtml(f.status || 'Pending')}</span>
              </div>
              <p class="card-text mb-1"><strong>Member ID:</strong> ${escapeHtml(f.member_id || '-')}</p>
              <p class="card-text mb-1"><strong>Book ID:</strong> ${escapeHtml(f.book_id || '-')}</p>
              <p class="card-text mb-1"><strong>Book:</strong> ${escapeHtml(f.book_title || '-')}</p>
              <p class="card-text mb-1"><strong>Amount:</strong> $${Number(f.amount || 0).toFixed(2)}</p>
              <p class="card-text mb-1"><strong>${dueOrPaidLabel}:</strong> ${escapeHtml(dateValue)}</p>
              <p class="card-text"><strong>Reason:</strong> ${escapeHtml(f.reason || '-')}</p>
              <div class="d-flex justify-content-end">
                <button class="btn btn-primary btn-sm me-1 fine-edit-btn">Edit</button>
                <button class="btn btn-success btn-sm fine-mark-paid-btn" ${(f.status || '').toLowerCase() === 'paid' ? 'disabled' : ''}>Mark Paid</button>
              </div>
            </div>
          </div>
        </div>
        `;
    }).join('');

    // Attach actions
    container.querySelectorAll('.fine-edit-btn').forEach(btn => {
        btn.addEventListener('click', handleEditFineClick);
    });

    container.querySelectorAll('.fine-mark-paid-btn').forEach(btn => {
        btn.addEventListener('click', handleMarkPaidClick);
    });
}

function updatePagination(totalFines) {
    const pagination = document.getElementById('finesPagination');
    if (!pagination) return;

    const totalPages = Math.ceil(totalFines / finesPerPage);
    let html = '';

    // Prev
    html += `
      <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
      </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            html += `
              <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
              </li>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }

    // Next
    html += `
      <li class="page-item ${(currentPage === totalPages || totalPages === 0) ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
      </li>
    `;

    pagination.innerHTML = html;

    pagination.querySelectorAll('.page-link').forEach(link => {
        const page = parseInt(link.getAttribute('data-page'));
        if (!isNaN(page)) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (page > 0 && page <= totalPages && page !== currentPage) {
                    currentPage = page;
                    displayFines();
                    updatePagination(filteredFines.length);
                    saveState();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        }
    });
}

// --------- History Rendering ---------

function renderFineHistory(searchTerm) {
    const tbody = document.getElementById('historyTableBody') || document.querySelector('.history-table tbody');
    if (!tbody) return;

    let rows = [...fineHistory];

    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        rows = rows.filter(r =>
            (r.member_id || '').toLowerCase().includes(term) ||
            (r.book_id || '').toLowerCase().includes(term)
        );
    }

    if (rows.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="8" class="text-center">No history records found.</td>
          </tr>
        `;
        return;
    }

    tbody.innerHTML = rows.map(r => `
      <tr>
        <td>${escapeHtml(r.date || '-')}</td>
        <td>${escapeHtml(r.member_id || '-')}</td>
        <td>${escapeHtml(r.book_id || '-')}</td>
        <td>$${Number(r.amount || 0).toFixed(2)}</td>
        <td><span class="badge ${getStatusBadgeClass(r.previous_status)}">${escapeHtml(r.previous_status || '-')}</span></td>
        <td><span class="badge ${getStatusBadgeClass(r.new_status)}">${escapeHtml(r.new_status || '-')}</span></td>
        <td>${escapeHtml(r.updated_by || '-')}</td>
        <td>${escapeHtml(r.notes || '-')}</td>
      </tr>
    `).join('');
}

// --------- Actions ---------

function handleEditFineClick(e) {
    const card = e.target.closest('.fine-card');
    if (!card) return;
    const fineId = card.getAttribute('data-fine-id');
    const fine = fines.find(f => String(f.id) === String(fineId));
    if (!fine) return;

    document.getElementById('memberIdInput').value = fine.member_id || '';
    document.getElementById('bookIdInput').value   = fine.book_id || '';
    document.getElementById('fineAmount').value    = fine.amount || 0;
    document.getElementById('fineReason').value    = fine.reason || 'Late Return';
    document.getElementById('fineStatus').value    = fine.status || 'Pending';
    document.getElementById('notes').value         = fine.notes || '';

    showMemberInfo({
        name:  fine.member_name,
        email: fine.member_email,
        phone: fine.member_phone
    });

    showBookInfo({
        title:  fine.book_title,
        author: fine.book_author,
        isbn:   fine.book_isbn
    });

    document.getElementById('updateFineForm').scrollIntoView({ behavior: 'smooth' });
}

async function handleMarkPaidClick(e) {
    const btn = e.target;
    const card = btn.closest('.fine-card');
    if (!card) return;
    const fineId = card.getAttribute('data-fine-id');
    const fine = fines.find(f => String(f.id) === String(fineId));
    if (!fine) return;

    if (!confirm('Mark this fine as paid?')) return;

    const previousStatus = fine.status || 'Pending';

    try {
        btn.disabled = true;
        btn.textContent = 'Processing...';

        if (!API_BASE_URL) {
            console.warn('No API_BASE_URL, simulate mark paid (LocalStorage)');
            fine.status = 'Paid';
            saveFinesToLocalStorage();

            fineHistory.push({
                date: new Date().toISOString().split('T')[0],
                member_id: fine.member_id,
                book_id: fine.book_id,
                amount: fine.amount,
                previous_status: previousStatus,
                new_status: 'Paid',
                updated_by: 'Offline User',
                notes: 'Marked paid offline'
            });
            saveHistoryToLocalStorage();

            applyFiltersAndDisplay();
            renderFineHistory('');
            alert('Fine marked as paid (local only).');
        } else {
            const response = await fetch(`${API_BASE_URL}?action=markFinePaid`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fine_id: fine.id })
            });
            const result = await response.json();
            if (!result.success) throw new Error(result.message || 'Failed to mark paid');
            alert('Fine marked as paid.');
            await fetchFines();
            await fetchFineHistory();
        }
    } catch (err) {
        console.error('Error mark paid:', err);
        alert('Error marking fine as paid: ' + err.message);
    } finally {
        btn.disabled = false;
        btn.textContent = 'Mark Paid';
    }
}

// --------- Helpers ---------

function getStatusBadgeClass(status) {
    const s = (status || '').toLowerCase();
    if (s === 'paid')    return 'status-paid';
    if (s === 'pending') return 'status-pending';
    if (s === 'overdue') return 'status-overdue';
    if (s === 'waived')  return 'status-waived';
    return 'status-pending';
}

function findFineIdByMemberAndBook(memberId, bookId) {
    const fine = fines.find(f =>
        String(f.member_id || '').toLowerCase() === memberId.toLowerCase() &&
        String(f.book_id || '').toLowerCase() === bookId.toLowerCase()
    );
    return fine ? fine.id : null;
}

function getNextFineId() {
    if (!fines.length) return 1;
    return fines.reduce((max, f) => {
        const idNum = Number(f.id) || 0;
        return idNum > max ? idNum : max;
    }, 0) + 1;
}

function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
