<!DOCTYPE html>
<html lang="en">
<head>
       <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>ULib - Reports</title>

    <!-- CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="report.css">

    <!-- JS -->
    <script defer src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/js/bootstrap.bundle.min.js"></script>
    <script defer src="report.js"></script>

<!-- PDF Library -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
</body>
</html>

    
</head>
<body>
    <!-- Top Navbar with Logo and Sidebar Button -->
    <header class="p-3 navbar navbar-expand-md navbar-dark bg-dark">
        <div class="container-fluid d-flex align-items-center">
            <a class="navbar-brand d-flex align-items-center" href="index.html">
                <img src="https://via.placeholder.com/60x48/124170/FFFFFF?text=UL" alt="Logo" width="60" height="48">
                <span class="ms-2">Report Generation</span>
            </a>
        </div>
    </header>

    <!-- Sidebar Navigation Offcanvas -->
    <div class="offcanvas offcanvas-start sidebar" tabindex="-1" id="sidebarNav" aria-labelledby="sidebarNavLabel">
        <div class="offcanvas-header d-flex justify-content-between align-items-center">
            <h5 class="offcanvas-title mb-0" id="sidebarNavLabel">Navigation</h5>
            <button type="button" class="btn-close ms-2" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <nav class="nav flex-column">
                <a class="nav-link btn-primary" href="index.html">Home</a>
                <hr>
                <a class="nav-link btn-primary" href="">Borrow a Book</a>
                <hr>
                <a class="nav-link btn-primary" href="">Fine</a>
                <hr>
                <a class="nav-link btn-primary" href="">Add a New Book</a>
                <hr>
                <a class="nav-link btn-primary" href="">Update a Book</a>
                <hr>
                <a class="nav-link btn-primary" href="">Delete a Book</a>
                <hr>
                <a class="nav-link btn-primary active" href="report.html">Reports</a>
                <hr>
                <a class="nav-link btn-primary" href="">Fine Policy</a>
            </nav>
        </div>
    </div>

    <main class="container mt-4">
        <!-- Report Generation Section -->
        <section class="mb-4">
            <div class="d-flex justify-content-start align-items-center w-100" style="flex-wrap: nowrap;">
                <!-- Sidebar Toggle Button -->
                <button class="btn me-2 d-flex align-items-center justify-content-center menu" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarNav" aria-controls="siedebarNav" style="width: 40px; height: 40px;  border: none;">
                    <!-- Custom SVG menu icon -->
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect y="4" width="24" height="2.5" rx="1.25" fill="#fff"/>
                        <rect y="10.75" width="24" height="2.5" rx="1.25" fill="#fff"/>
                        <rect y="17.5" width="24" height="2.5" rx="1.25" fill="#fff"/>
                    </svg>
                </button>

                <!-- Report Type Dropdown -->
                <div class="dropdown flex-shrink-0" style="margin-left: 0;">
                    <button class="btn btn-outline-secondary dropdown-toggle h-100" type="button" data-bs-toggle="dropdown" style="border-radius: 0.375rem 0 0 0.375rem; border-right: none;">
                        Report Type
                    </button>
                    <ul id="reportType" class="dropdown-menu" aria-labelledby="reportTypeDropdown">
                        <li><h6 class="dropdown-header">Select Report Type</h6></li>
                        <li><a class="dropdown-item" value="borrowed">Borrowed Books</a></li>
                        <li><a class="dropdown-item" value="overdue">Overdue Books</a></li>
                        <li><a class="dropdown-item" value="popular">Popular Books</a></li>
                        <li><a class="dropdown-item" value="userActivity">User Activity</a></li>
                        <li><a class="dropdown-item" value="inventory">Inventory Status</a></li>
                        <li><a class="dropdown-item" value="fines">Fines Collected</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item text-danger" href="#" id="reportTypeReset">Reset</a></li>
                    </ul>
                </div>
            
                <!-- Date Range Dropdown -->
                <div class="dropdown flex-shrink-0" style="margin-left: -1px;">
                    <button class="btn btn-outline-secondary dropdown-toggle h-100" type="button" data-bs-toggle="dropdown"  style="border-radius: 0; border-left: none; border-right: none;">
                        Date Range
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dateRangeDropdown" id="dateRange">
                        <li><h6 class="dropdown-header">Select Date Range</h6></li>
                        <li><a class="dropdown-item" href="#" value="today">Today</a></li>
                        <li><a class="dropdown-item" href="#" value="week">This Week</a></li>
                        <li><a class="dropdown-item" href="#" value="month">This Month</a></li>
                        <li><a class="dropdown-item" href="#" value="quarter">This Quarter</a></li>
                        <li><a class="dropdown-item" href="#" value="year">This Year</a></li>
                        <li><a class="dropdown-item" href="#" value="custom">Custom Range</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item text-danger" href="#" id="dateRangeReset">Reset</a></li>
                    </ul>
                </div>
        
                <!-- Generate Report Button -->
                <button class="btn btn-primary flex-shrink-0" type="button" id="generateReport" style="border-radius: 0 0.375rem 0.375rem 0; margin-left: -1px; border-left: none;">
                    Generate Report
                </button>
            </div>
            
            <!-- Custom Date Range Section -->
            <section id="customDateRange" class="collapse mt-3">
                <div class="card">
                    <div class="card-body">
                        <h3 class="card-title">Custom Date Range</h3>
                        <form id="customDateForm">
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="startDate" class="form-label">Start Date</label>
                                    <input type="date" class="form-control" id="startDate" required>
                                </div>
                                <div class="col-md-6">
                                    <label for="endDate" class="form-label">End Date</label>
                                    <input type="date" class="form-control" id="endDate" required>
                                </div>
                            </div>
                            <div class="mb-3 row gx-2">
                                <div class="col-12 col-md-6 mb-2 mb-md-0">
                                    <button type="button" id="resetCustomDate" class="btn btn-secondary w-100">Reset</button>
                                </div>
                                <div class="col-12 col-md-6">
                                    <button type="button" id="applyCustomDate" class="btn btn-success w-100">Apply Date Range</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </section>
        
        <!-- Report Results Section -->
        <section id="reportResults" class="mb-4" style="display: none;">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h3 class="mb-0" id="reportTitle">Generated Report</h3>
                    <div>
                        <button class="btn btn-outline-primary me-2" id="exportPDF">Export as PDF</button>
                        <button class="btn btn-outline-success me-2" id="exportCSV">Export as CSV</button>
                        <button class="btn btn-outline-info" id="saveReport">Save Report</button>
                    </div>
                </div>
                <div class="card-body">
                    <div id="reportPreview" class="report-preview">
                        <!-- Report content will be generated here -->
                    </div>
                </div>
            </div>
        </section>
        
        <!-- Report History Section -->
        <section>
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h3>Report History</h3>
                <div class="d-flex" style="max-width: 300px;">
                    <input type="text" id="historySearch" class="form-control" placeholder="Search Report History...">
                    <button class="btn btn-outline-secondary ms-2" id="clearHistorySearch">Clear</button>
                </div>
            </div>
            
            <div class="row" id="reportHistoryContainer">
                <!-- Report History Cards will be populated here -->
            </div>
        </section>  

        <!-- Pagination for Report History -->
        <section class="mt-4">
            <nav>
                <ul class="pagination justify-content-center">
                    <li class="page-item"><a class="page-link" href="#">&laquo;</a></li>
                    <li class="page-item active"><a class="page-link" href="#">1</a></li>
                    <li class="page-item"><a class="page-link" href="#">2</a></li>
                    <li class="page-item"><a class="page-link" href="#">3</a></li>
                    <li class="page-item"><a class="page-link" href="#">&raquo;</a></li>
                </ul>
            </nav>
        </section>
    </main>

    <footer class="text-center py-3 mt-5">
        &copy; 2025 ULib. All rights reserved.
    </footer>

  
</body>
</html>