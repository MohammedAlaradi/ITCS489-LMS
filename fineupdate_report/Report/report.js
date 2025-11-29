console.log("🔥 report.js loaded");

// ===============================
// LocalStorage Key & Constants
// ===============================
const LS_REPORT_HISTORY_KEY = "ulibReportHistory";
const HISTORY_PAGE_SIZE = 6;

// ===============================
// Global State
// ===============================
let selectedReportType = "";
let selectedDateRange = "";
let customStartDate = "";
let customEndDate = "";

let reportHistory = [];
let historyFilterTerm = "";
let historyCurrentPage = 1;

// ===============================
// DOM Ready
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    console.log("🔥 DOM Ready - Reports");

    loadReportHistory();
    setupEventListeners();
    renderReportHistory(); // أول عرض للهستوري
});

// ===============================
// Load & Save History
// ===============================
function loadReportHistory() {
    const raw = localStorage.getItem(LS_REPORT_HISTORY_KEY);
    if (!raw) {
        console.log("📌 No history found → using sample reports");
        reportHistory = getSampleReports();
        saveReportHistory();
        return;
    }
    try {
        reportHistory = JSON.parse(raw) || [];
        console.log("📦 Loaded history:", reportHistory);
    } catch (err) {
        console.error("❌ Error parsing history:", err);
        reportHistory = getSampleReports();
        saveReportHistory();
    }
}

function saveReportHistory() {
    localStorage.setItem(LS_REPORT_HISTORY_KEY, JSON.stringify(reportHistory));
    console.log("💾 History saved:", reportHistory);
}

// ===============================
// Sample Reports (First Time)
// ===============================
function getSampleReports() {
    return [
        { id: "RPT-001", type: "borrowed",    dateRange: "Today",       generatedOn: "2025-03-15 14:30", records: 42 },
        { id: "RPT-002", type: "overdue",     dateRange: "This Week",   generatedOn: "2025-03-14 10:15", records: 8 },
        { id: "RPT-003", type: "popular",     dateRange: "This Month",  generatedOn: "2025-03-10 09:45", records: 25 },
        { id: "RPT-004", type: "userActivity",dateRange: "Last Month",  generatedOn: "2025-02-28 16:20", records: 156 },
        { id: "RPT-005", type: "inventory",   dateRange: "This Quarter",generatedOn: "2025-03-01 11:30", records: 1247 },
        { id: "RPT-006", type: "fines",       dateRange: "This Year",   generatedOn: "2025-01-15 13:10", records: 34 }
    ];
}

// ===============================
// Event Listeners Setup
// ===============================
function setupEventListeners() {
    console.log("🎯 Setting up listeners");

    // Report Type Dropdown
    const reportTypeMenu = document.getElementById("reportType");
    if (reportTypeMenu) {
        reportTypeMenu.addEventListener("click", (e) => {
            const item = e.target;
            if (!item.classList.contains("dropdown-item")) return;
            if (item.id === "reportTypeReset") return;

            const value = item.getAttribute("value");
            if (!value) return;

            selectedReportType = value;
            const btn = reportTypeMenu.previousElementSibling;
            if (btn) btn.textContent = item.textContent.trim();
        });
    }

    const reportTypeReset = document.getElementById("reportTypeReset");
    if (reportTypeReset) {
        reportTypeReset.addEventListener("click", (e) => {
            e.preventDefault();
            selectedReportType = "";
            const btn = reportTypeMenu?.previousElementSibling;
            if (btn) btn.textContent = "Report Type";
        });
    }

    // Date Range Dropdown
    const dateRangeMenu = document.getElementById("dateRange");
    if (dateRangeMenu) {
        dateRangeMenu.addEventListener("click", (e) => {
            const item = e.target;
            if (!item.classList.contains("dropdown-item")) return;
            if (item.id === "dateRangeReset") return;

            const value = item.getAttribute("value");
            if (!value) return;

            selectedDateRange = value;
            handleDateRangeSelection(item);
        });
    }

    const dateRangeReset = document.getElementById("dateRangeReset");
    if (dateRangeReset) {
        dateRangeReset.addEventListener("click", (e) => {
            e.preventDefault();
            selectedDateRange = "";
            customStartDate = "";
            customEndDate = "";

            const btn = dateRangeMenu?.previousElementSibling;
            if (btn) btn.textContent = "Date Range";

            const customSection = document.getElementById("customDateRange");
            if (customSection && window.bootstrap) {
                new bootstrap.Collapse(customSection, { toggle: false });
            }

            const s = document.getElementById("startDate");
            const d = document.getElementById("endDate");
            if (s) s.value = "";
            if (d) d.value = "";
        });
    }

    // Custom Date Buttons
    const applyCustomDateBtn = document.getElementById("applyCustomDate");
    if (applyCustomDateBtn) {
        applyCustomDateBtn.addEventListener("click", applyCustomDate);
    }

    const resetCustomDateBtn = document.getElementById("resetCustomDate");
    if (resetCustomDateBtn) {
        resetCustomDateBtn.addEventListener("click", () => {
            customStartDate = "";
            customEndDate = "";
            const s = document.getElementById("startDate");
            const d = document.getElementById("endDate");
            if (s) s.value = "";
            if (d) d.value = "";
        });
    }

    // Generate Report
    const generateReportBtn = document.getElementById("generateReport");
    if (generateReportBtn) {
        generateReportBtn.addEventListener("click", () => {
            if (!selectedReportType) {
                alert("Please select a report type.");
                return;
            }
            if (!selectedDateRange) {
                alert("Please select a date range.");
                return;
            }
            const resultsSection = document.getElementById("reportResults");
            if (resultsSection) resultsSection.style.display = "block";
            generateReportPreview();
        });
    }

    // Save Report
    const saveReportBtn = document.getElementById("saveReport");
    if (saveReportBtn) {
        saveReportBtn.addEventListener("click", saveNewReport);
    }

    // Export CSV
    const exportCSVBtn = document.getElementById("exportCSV");
    if (exportCSVBtn) {
        exportCSVBtn.addEventListener("click", exportCSV);
    }

    // Export PDF
    const exportPDFBtn = document.getElementById("exportPDF");
    if (exportPDFBtn) {
        exportPDFBtn.addEventListener("click", exportPDF);
    }

    // History Search
    const historySearchInput = document.getElementById("historySearch");
    if (historySearchInput) {
        historySearchInput.addEventListener("input", () => {
            historyFilterTerm = historySearchInput.value.toLowerCase();
            historyCurrentPage = 1;
            renderReportHistory();
        });
    }

    const clearHistorySearchBtn = document.getElementById("clearHistorySearch");
    if (clearHistorySearchBtn) {
        clearHistorySearchBtn.addEventListener("click", () => {
            historyFilterTerm = "";
            const input = document.getElementById("historySearch");
            if (input) input.value = "";
            historyCurrentPage = 1;
            renderReportHistory();
        });
    }
}

// ===============================
// Date Range Handling
// ===============================
function handleDateRangeSelection(item) {
    const value = item.getAttribute("value");
    const btn = document.getElementById("dateRange")?.previousElementSibling;

    if (value === "custom") {
        const customSection = document.getElementById("customDateRange");
        if (customSection && window.bootstrap) {
            new bootstrap.Collapse(customSection, { toggle: true });
        }
    } else {
        const customSection = document.getElementById("customDateRange");
        if (customSection && window.bootstrap) {
            new bootstrap.Collapse(customSection, { toggle: false });
        }
        if (btn) btn.textContent = item.textContent.trim();
    }
}

function applyCustomDate() {
    const start = document.getElementById("startDate")?.value;
    const end   = document.getElementById("endDate")?.value;

    if (!start || !end) {
        alert("Please select both start and end dates.");
        return;
    }

    customStartDate = start;
    customEndDate   = end;
    selectedDateRange = "custom";

    const btn = document.getElementById("dateRange")?.previousElementSibling;
    if (btn) {
        const startFormatted = new Date(start).toLocaleDateString();
        const endFormatted   = new Date(end).toLocaleDateString();
        btn.textContent = `${startFormatted} - ${endFormatted}`;
    }

    const customSection = document.getElementById("customDateRange");
    if (customSection && window.bootstrap) {
        new bootstrap.Collapse(customSection, { toggle: false });
    }
}

// ===============================
// Generate Report Preview (Real Content)
// ===============================
function generateReportPreview() {
    const preview = document.getElementById("reportPreview");
    const title   = document.getElementById("reportTitle");
    if (!preview || !title) return;

    const names = {
        borrowed: "Borrowed Books",
        overdue: "Overdue Books",
        popular: "Popular Books",
        userActivity: "User Activity",
        inventory: "Inventory Status",
        fines: "Fines Collected"
    };

    title.textContent = `${names[selectedReportType]} Report`;

    let html = "";
    switch (selectedReportType) {
        case "borrowed":     html = generateBorrowedBooksReport(); break;
        case "overdue":      html = generateOverdueBooksReport(); break;
        case "popular":      html = generatePopularBooksReport(); break;
        case "userActivity": html = generateUserActivityReport(); break;
        case "inventory":    html = generateInventoryReport(); break;
        case "fines":        html = generateFinesReport(); break;
        default:
            html = "<p>No report data available.</p>";
    }

    preview.innerHTML = html;
}

// ====== نفس التقارير اللي كانت في HTML الأصلي ======
function generateBorrowedBooksReport() {
    return `
        <div class="report-stat">
            <h4>Summary</h4>
            <p>Total Books Borrowed: <strong>42</strong></p>
            <p>Active Borrowers: <strong>35</strong></p>
            <p>Average Borrow Duration: <strong>14 days</strong></p>
        </div>
        <div class="chart-container">
            <h5>Borrowing Trends</h5>
            <p><em>Chart visualization would appear here</em></p>
        </div>
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Book Title</th>
                        <th>Borrower</th>
                        <th>Borrow Date</th>
                        <th>Due Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>The Great Gatsby</td>
                        <td>John Smith</td>
                        <td>2025-03-10</td>
                        <td>2025-03-24</td>
                    </tr>
                    <tr>
                        <td>To Kill a Mockingbird</td>
                        <td>Jane Doe</td>
                        <td>2025-03-12</td>
                        <td>2025-03-26</td>
                    </tr>
                    <tr>
                        <td>1984</td>
                        <td>Robert Johnson</td>
                        <td>2025-03-08</td>
                        <td>2025-03-22</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

function generateOverdueBooksReport() {
    return `
        <div class="report-stat">
            <h4>Summary</h4>
            <p>Total Overdue Books: <strong>8</strong></p>
            <p>Total Fines Owed: <strong>$42.50</strong></p>
            <p>Average Overdue Days: <strong>5.2 days</strong></p>
        </div>
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Book Title</th>
                        <th>Borrower</th>
                        <th>Due Date</th>
                        <th>Days Overdue</th>
                        <th>Fine Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Pride and Prejudice</td>
                        <td>Alice Brown</td>
                        <td>2025-03-05</td>
                        <td>10</td>
                        <td>$5.00</td>
                    </tr>
                    <tr>
                        <td>The Catcher in the Rye</td>
                        <td>Michael Wilson</td>
                        <td>2025-03-08</td>
                        <td>7</td>
                        <td>$3.50</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

function generatePopularBooksReport() {
    return `
        <div class="report-stat">
            <h4>Summary</h4>
            <p>Most Popular Genre: <strong>Fiction</strong></p>
            <p>Total Checkouts This Period: <strong>156</strong></p>
            <p>Average Rating: <strong>4.2/5</strong></p>
        </div>
        <div class="chart-container">
            <h5>Popularity by Genre</h5>
            <p><em>Chart visualization would appear here</em></p>
        </div>
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Book Title</th>
                        <th>Author</th>
                        <th>Checkouts</th>
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>The Hobbit</td>
                        <td>J.R.R. Tolkien</td>
                        <td>23</td>
                        <td>4.8</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Harry Potter and the Sorcerer's Stone</td>
                        <td>J.K. Rowling</td>
                        <td>19</td>
                        <td>4.7</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>The Da Vinci Code</td>
                        <td>Dan Brown</td>
                        <td>15</td>
                        <td>4.2</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

function generateUserActivityReport() {
    return `
        <div class="report-stat">
            <h4>Summary</h4>
            <p>Active Users: <strong>89</strong></p>
            <p>New Registrations: <strong>12</strong></p>
            <p>Average Visits Per User: <strong>3.4</strong></p>
        </div>
        <div class="chart-container">
            <h5>User Activity Over Time</h5>
            <p><em>Chart visualization would appear here</em></p>
        </div>
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Last Login</th>
                        <th>Books Borrowed</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>U001</td>
                        <td>John Smith</td>
                        <td>2025-03-15</td>
                        <td>5</td>
                        <td><span class="badge bg-success">Active</span></td>
                    </tr>
                    <tr>
                        <td>U002</td>
                        <td>Jane Doe</td>
                        <td>2025-03-14</td>
                        <td>3</td>
                        <td><span class="badge bg-success">Active</span></td>
                    </tr>
                    <tr>
                        <td>U003</td>
                        <td>Robert Johnson</td>
                        <td>2025-02-28</td>
                        <td>0</td>
                        <td><span class="badge bg-warning">Inactive</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

function generateInventoryReport() {
    return `
        <div class="report-stat">
            <h4>Summary</h4>
            <p>Total Books: <strong>1,247</strong></p>
            <p>Books Available: <strong>987</strong></p>
            <p>Books Borrowed: <strong>260</strong></p>
            <p>Inventory Value: <strong>$24,850</strong></p>
        </div>
        <div class="chart-container">
            <h5>Inventory by Category</h5>
            <p><em>Chart visualization would appear here</em></p>
        </div>
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Total Books</th>
                        <th>Available</th>
                        <th>Borrowed</th>
                        <th>% Available</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Fiction</td>
                        <td>450</td>
                        <td>320</td>
                        <td>130</td>
                        <td>71%</td>
                    </tr>
                    <tr>
                        <td>Non-Fiction</td>
                        <td>380</td>
                        <td>310</td>
                        <td>70</td>
                        <td>82%</td>
                    </tr>
                    <tr>
                        <td>Science</td>
                        <td>210</td>
                        <td>180</td>
                        <td>30</td>
                        <td>86%</td>
                    </tr>
                    <tr>
                        <td>History</td>
                        <td>207</td>
                        <td>177</td>
                        <td>30</td>
                        <td>86%</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

function generateFinesReport() {
    return `
        <div class="report-stat">
            <h4>Summary</h4>
            <p>Total Fines Collected: <strong>$245.75</strong></p>
            <p>Outstanding Fines: <strong>$87.50</strong></p>
            <p>Average Fine Amount: <strong>$7.25</strong></p>
        </div>
        <div class="chart-container">
            <h5>Fines Collection Over Time</h5>
            <p><em>Chart visualization would appear here</em></p>
        </div>
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Book</th>
                        <th>Fine Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>John Smith</td>
                        <td>The Great Gatsby</td>
                        <td>2025-03-10</td>
                        <td>$5.00</td>
                        <td><span class="badge bg-success">Paid</span></td>
                    </tr>
                    <tr>
                        <td>Jane Doe</td>
                        <td>To Kill a Mockingbird</td>
                        <td>2025-03-12</td>
                        <td>$3.50</td>
                        <td><span class="badge bg-warning">Pending</span></td>
                    </tr>
                    <tr>
                        <td>Robert Johnson</td>
                        <td>1984</td>
                        <td>2025-03-15</td>
                        <td>$7.00</td>
                        <td><span class="badge bg-danger">Overdue</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

// ===============================
// Save New Report
// ===============================
function saveNewReport() {
    if (!selectedReportType || !selectedDateRange) {
        alert("Please select report type and date range before saving.");
        return;
    }

    const reportId = "RPT-" + Date.now().toString().slice(-6);

    const report = {
        id: reportId,
        type: selectedReportType,
        dateRange:
            selectedDateRange === "custom"
                ? `${customStartDate} to ${customEndDate}`
                : selectedDateRange,
        generatedOn: new Date().toLocaleString(),
        records: Math.floor(Math.random() * 100) + 10
    };

    reportHistory.unshift(report);
    saveReportHistory();
    historyCurrentPage = 1;
    renderReportHistory();

    alert(`Report saved with ID: ${reportId}`);
}

// ===============================
// Render History + Pagination
// ===============================
function renderReportHistory() {
    const container = document.getElementById("reportHistoryContainer");
    const pagination = document.querySelector(".pagination");
    if (!container) return;

    container.innerHTML = "";

    let filtered = [...reportHistory];
    if (historyFilterTerm) {
        filtered = filtered.filter(r =>
            (r.id || "").toLowerCase().includes(historyFilterTerm) ||
            (r.type || "").toLowerCase().includes(historyFilterTerm) ||
            (r.dateRange || "").toLowerCase().includes(historyFilterTerm)
        );
    }

    if (!filtered.length) {
        container.innerHTML = `<p class="text-muted">No reports found.</p>`;
        if (pagination) pagination.innerHTML = "";
        return;
    }

    const totalPages = Math.ceil(filtered.length / HISTORY_PAGE_SIZE);
    if (historyCurrentPage > totalPages) historyCurrentPage = totalPages;

    const start = (historyCurrentPage - 1) * HISTORY_PAGE_SIZE;
    const end   = start + HISTORY_PAGE_SIZE;
    const pageItems = filtered.slice(start, end);

    pageItems.forEach(r => container.appendChild(createHistoryCard(r)));

    if (pagination) {
        renderPagination(pagination, totalPages);
    }
}

function createHistoryCard(report) {
    const typeDisplayNames = {
        borrowed: "Borrowed Books",
        overdue: "Overdue Books",
        popular: "Popular Books",
        userActivity: "User Activity",
        inventory: "Inventory Status",
        fines: "Fines Collected"
    };

    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4 mb-4 report-history-card";

    col.innerHTML = `
        <div class="card h-100">
            <div class="card-header d-flex justify-content-between">
                <span class="badge bg-primary">${typeDisplayNames[report.type] || "Report"}</span>
                <small class="text-muted">${report.dateRange}</small>
            </div>
            <div class="card-body">
                <h5 class="card-title">${typeDisplayNames[report.type] || "Report"} Report</h5>
                <p class="card-text">ID: ${report.id}</p>
                <p class="card-text">Generated on: ${report.generatedOn}</p>
                <p class="card-text">Records: ${report.records}</p>
            </div>
            <div class="card-footer">
                <button class="btn btn-sm btn-outline-info me-1">View</button>
                <button class="btn btn-sm btn-outline-success me-1">Export CSV</button>
                <button class="btn btn-sm btn-outline-danger">Delete</button>
            </div>
        </div>
    `;

    const [viewBtn, exportBtn, deleteBtn] = col.querySelectorAll(".btn");

    if (viewBtn) {
        viewBtn.addEventListener("click", () => viewReport(report.id));
    }
    if (exportBtn) {
        exportBtn.addEventListener("click", () => {
            generateReportFromType(report.type); // preview
            exportCSV();                         // then CSV
        });
    }
    if (deleteBtn) {
        deleteBtn.addEventListener("click", () => deleteReport(report.id));
    }

    return col;
}

function renderPagination(pagination, totalPages) {
    pagination.innerHTML = "";

    const addPageItem = (label, page, disabled = false, active = false) => {
        const li = document.createElement("li");
        li.className = `page-item ${disabled ? "disabled" : ""} ${active ? "active" : ""}`;
        const a = document.createElement("a");
        a.className = "page-link";
        a.href = "#";
        a.textContent = label;
        if (!disabled) {
            a.addEventListener("click", (e) => {
                e.preventDefault();
                if (page >= 1 && page <= totalPages) {
                    historyCurrentPage = page;
                    renderReportHistory();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }
            });
        }
        li.appendChild(a);
        pagination.appendChild(li);
    };

    addPageItem("«", historyCurrentPage - 1, historyCurrentPage === 1);

    for (let i = 1; i <= totalPages; i++) {
        addPageItem(i.toString(), i, false, i === historyCurrentPage);
    }

    addPageItem("»", historyCurrentPage + 1, historyCurrentPage === totalPages);
}

// ===============================
// View Report from History
// ===============================
function viewReport(reportId) {
    const r = reportHistory.find(x => x.id === reportId);
    if (!r) {
        alert("Report not found.");
        return;
    }

    selectedReportType = r.type;

    // تحديث اسم الزر
    const names = {
        borrowed: "Borrowed Books",
        overdue: "Overdue Books",
        popular: "Popular Books",
        userActivity: "User Activity",
        inventory: "Inventory Status",
        fines: "Fines Collected"
    };
    const typeBtn = document.getElementById("reportType")?.previousElementSibling;
    if (typeBtn) typeBtn.textContent = names[r.type] || "Report Type";

    const resultsSection = document.getElementById("reportResults");
    if (resultsSection) resultsSection.style.display = "block";

    generateReportPreview();
    alert(`Viewing saved report: ${reportId}`);
}

// ===============================
// Delete Report
// ===============================
function deleteReport(id) {
    if (!confirm(`Are you sure you want to delete report ${id}?`)) return;
    reportHistory = reportHistory.filter(r => r.id !== id);
    saveReportHistory();
    renderReportHistory();
    alert(`Report ${id} deleted successfully.`);
}

// ===============================
// Export CSV (Report Preview Table)
// ===============================
function exportCSV() {
    const preview = document.getElementById("reportPreview");
    if (!preview) return;

    const table = preview.querySelector("table");
    if (!table) {
        alert("No table found to export. Please generate a report with a table.");
        return;
    }

    let csv = "";
    const rows = table.querySelectorAll("tr");
    rows.forEach(row => {
        const cols = row.querySelectorAll("th, td");
        const rowData = [];
        cols.forEach(col => {
            let text = col.innerText.replace(/"/g, '""');
            rowData.push(`"${text}"`);
        });
        csv += rowData.join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = "report.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ===============================
// Export PDF (Placeholder with Optional Library)
// ===============================
function exportPDF() {
    const preview = document.getElementById("reportPreview");
    if (!preview || !preview.innerHTML.trim()) {
        alert("Please generate a report first.");
        return;
    }

    if (window.html2pdf) {
        // لو أضفت مكتبة html2pdf.js في HTML، هذا سيعمل فعلياً
        html2pdf().from(preview).save("report.pdf");
    } else {
        alert("PDF export requires html2pdf.js or jsPDF.\nFor the project, mention this as a planned feature.");
    }
}

// ===============================
// Helper: Generate preview based on type (for export from history)
// ===============================
function generateReportFromType(type) {
    selectedReportType = type;
    const resultsSection = document.getElementById("reportResults");
    if (resultsSection) resultsSection.style.display = "block";
    generateReportPreview();
}
