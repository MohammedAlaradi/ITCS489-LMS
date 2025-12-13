<!DOCTYPE html>
<html lang="en">
  <head>
    <title>ULib </title>

    <!--Bootstrap for general styling, and self-written sheet for customization-->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"  integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="fineStyle.css">
  
    <!-- Bootstrap script for event handling -->
    <script defer src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/js/bootstrap.bundle.min.js"></script>


    <script defer src="fineupdate.js"></script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <style>
      /* Custom styles for the fine management page */
      .fine-card {
        transition: transform 0.2s;
      }
      .fine-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }
      .status-paid {
        background-color: #d4edda;
        color: #155724;
      }
      .status-pending {
        background-color: #fff3cd;
        color: #856404;
      }
      .status-overdue {
        background-color: #f8d7da;
        color: #721c24;
      }
      .status-waived {
        background-color: #e2e3e5;
        color: #383d41;
      }
      .history-table {
        font-size: 0.9rem;
      }
      .search-history-section {
        background-color: #f8f9fa;
        border-radius: 0.5rem;
        padding: 1.5rem;
      }
      .badge {
        font-size: 0.75em;
        padding: 0.35em 0.65em;
      }
      .member-info, .book-info {
        background-color: #f8f9fa;
        border-radius: 0.375rem;
        padding: 1rem;
        margin-bottom: 1rem;
      }
      .info-display {
        font-weight: 500;
        color: #2E5077;
      }
    </style>
  </head>
  <body>
    <!-- Top of the page, contains the reference for other modules -->
    <!-- Header -->
    <!-- Top Navbar with Logo and Sidebar Button -->
    <header class="p-3 navbar navbar-expand-md navbar-dark bg-dark">
        <div class="container-fluid d-flex align-items-center">
            <a class="navbar-brand d-flex align-items-center" href="index.html">
                <img src="ULiblogo.png" alt="Logo" width="60" height="48">
                <span class="ms-2">Fine Update</span>
            </a>
        </div>
    </header>

    <!-- Sidebar Navigation Offcanvas -->
    <div class="offcanvas offcanvas-start sidebar" tabindex="-1" id="sidebarNav" aria-labelledby="sidebarNavLabel">
        <div class="offcanvas-header d-flex justify-content-between align-items-center">
            <h5 class="offcanvas-title mb-0" id="sidebarNavLabel">Menu</h5>
            <button type="button" class="btn-close ms-2" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <nav class="nav flex-column">
                <a class="nav-link btn-primary" href="">Home</a>
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
                <a class="nav-link btn-primary" href="">Reports</a>
                <hr>
                <a class="nav-link btn-primary" href="">Fine Policy</a>
            </nav>
        </div>
    </div>

    <main class="container mt-4">
      <!-- Search, Filter, and Sort Section -->
      <section class="mb-4">
          <div class="d-flex justify-content-start align-items-center w-100" style="flex-wrap: nowrap;">
              <!-- Sidebar Toggle Button (left of search/filter/sort/add) -->
              <button class="btn me-2 d-flex align-items-center justify-content-center menu" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarNav" aria-controls="siedebarNav" style="width: 40px; height: 40px;  border: none;">
                  <!-- Custom SVG menu icon -->
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect y="4" width="24" height="2.5" rx="1.25" fill="#fff"/>
                      <rect y="10.75" width="24" height="2.5" rx="1.25" fill="#fff"/>
                      <rect y="17.5" width="24" height="2.5" rx="1.25" fill="#fff"/>
                  </svg>
              </button>

              <!-- Search Bar (Left corners not rounded) -->
              <input type="text" id="searchInput" class="form-control" placeholder="Search for a Member..." style="border-radius: 0.375rem 0 0 0.375rem; min-width: 120px; border-right: none; margin-left: 0;">

              <!-- Filter Dropdown (No rounded corners) -->
              <div class="dropdown flex-shrink-0" style="margin-left: -1px;">
                  <button class="btn btn-outline-secondary dropdown-toggle h-100" type="button" data-bs-toggle="dropdown" style="border-radius: 0; border-left: none; border-right: none;">
                      Filter
                  </button>
                  <ul id="statusFilter" class="dropdown-menu" aria-labelledby="filterDropdown">
                      <!-- Status Header and Options -->
                      <li><h6 class="dropdown-header">Fine Status</h6></li>
                      <li><a class="dropdown-item" value="Paid">Paid</a></li>
                      <li><a class="dropdown-item" value="Pending">Pending</a></li>
                      <li><a class="dropdown-item" value="Overdue">Overdue</a></li>
                      <li><a class="dropdown-item" value="Waived">Waived</a></li>
                      <li><hr class="dropdown-divider"></li>
                      <li><a class="dropdown-item text-danger" href="#" id="statusReset">Reset Filter</a></li>
                  </ul>
              </div>
          
              <!-- Sort Dropdown (No rounded corners) -->
              <div class="dropdown flex-shrink-0" style="margin-left: -1px;">
                  <button class="btn btn-outline-secondary dropdown-toggle h-100" type="button" data-bs-toggle="dropdown"  style="border-radius: 0; border-left: none; border-right: none;">
                      Sort
                  </button>
                  <ul class="dropdown-menu" aria-labelledby="sortDropdown" id="sortDate">
                    <li><h6 class="dropdown-header">Fine Amount</h6></li>
                    <li><a class="dropdown-item" href="#" value="high">Highest to Lowest &#8595;</a></li>
                    <li><a class="dropdown-item" href="#" value="low">Lowest to Highest &#8593;</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="#" id="sortReset">Reset Sort</a></li>
                  </ul>
              </div>
      
              <!-- Add New Activity Button (Right corner rounded) -->
              <button class="btn btn-primary flex-shrink-0" type="button" data-bs-toggle="collapse" data-bs-target="#AdvancedSearch" aria-expanded="false" aria-controls="Advanced" style="border-radius: 0 0.375rem 0.375rem 0; margin-left: -1px; border-left: none;">
                  Advanced Search
              </button>
          </div>
          <!-- Move collapse section outside the flex row for proper opening -->
          <section id="AdvancedSearch" class="collapse mt-3">
              <div class="card">
                  <div class="card-body">
                      <h3 class="card-title">Advanced Search</h3>
                      <form>
                          <div class="mb-3">
                              <label for="memberId" class="form-label">Member ID</label>
                              <input type="text" placeholder="Enter Member ID" class="form-control" id="memberId">
                          </div>
                          
                          <div class="mb-3">
                              <label class="form-label" for="dateRange">Date Range:</label>
                              <div class="row">
                                  <div class="col-md-6 mb-2">
                                      <input type="date" class="form-control" id="startDate" name="startDate">
                                  </div>
                                  <div class="col-md-6">
                                      <input type="date" class="form-control" id="endDate" name="endDate">
                                  </div>
                              </div>
                          </div>
                          <div class="mb-3">
                              <label class="form-label" for="fineAmount">Fine Amount Range:</label>
                              <div class="row">
                                  <div class="col-md-6 mb-2">
                                      <input type="number" placeholder="Min Amount" class="form-control" id="minAmount">
                                  </div>
                                  <div class="col-md-6">
                                      <input type="number" placeholder="Max Amount" class="form-control" id="maxAmount">
                                  </div>
                              </div>
                          </div>
                          <div class="mb-3 row gx-2">
                              <div class="col-12 col-md-6 mb-2 mb-md-0">
                                  <button type="button" id="resetFilter" class="btn btn-secondary w-100">Reset</button>
                              </div>
                              <div class="col-12 col-md-6">
                                  <button type="button" id="applyFilter" class="btn btn-success w-100">Apply Advanced Search</button>
                              </div>
                          </div>
                          <div class="mb-3">
                              <button type="button" class="btn btn-danger w-100" data-bs-toggle="collapse" data-bs-target="#AdvancedSearch">Cancel</button>
                          </div>
                      </form>
                  </div>
              </div>
          </section>
      </section>

      <!-- Update Fine Section -->
      <section class="mb-5">
        <h3>Update Fine</h3>
        <div class="card">
          <div class="card-body">
            <form id="updateFineForm">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="memberIdInput" class="form-label">Member ID *</label>
                  <input type="text" class="form-control" id="memberIdInput" placeholder="Enter Member ID (e.g., M001)" required>
                  <div class="member-info mt-2" id="memberInfo" style="display: none;">
                    <div class="row">
                      <div class="col-12">
                        <span class="info-display">Member: </span><span id="memberName">-</span>
                      </div>
                      <div class="col-12">
                        <span class="info-display">Email: </span><span id="memberEmail">-</span>
                      </div>
                      <div class="col-12">
                        <span class="info-display">Phone: </span><span id="memberPhone">-</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="bookIdInput" class="form-label">Book ID *</label>
                  <input type="text" class="form-control" id="bookIdInput" placeholder="Enter Book ID (e.g., B001)" required>
                  <div class="book-info mt-2" id="bookInfo" style="display: none;">
                    <div class="row">
                      <div class="col-12">
                        <span class="info-display">Title: </span><span id="bookTitle">-</span>
                      </div>
                      <div class="col-12">
                        <span class="info-display">Author: </span><span id="bookAuthor">-</span>
                      </div>
                      <div class="col-12">
                        <span class="info-display">ISBN: </span><span id="bookISBN">-</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-4 mb-3">
                  <label for="fineAmount" class="form-label">Fine Amount ($) *</label>
                  <input type="number" class="form-control" id="fineAmount" min="0" step="0.01" placeholder="0.00" required>
                </div>
                <div class="col-md-4 mb-3">
                  <label for="fineReason" class="form-label">Reason *</label>
                  <select class="form-select" id="fineReason" required>
                    <option value="" selected disabled>Select reason...</option>
                    <option value="Late Return">Late Return</option>
                    <option value="Book Damage">Book Damage</option>
                    <option value="Lost Book">Lost Book</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div class="col-md-4 mb-3">
                  <label for="fineStatus" class="form-label">Status *</label>
                  <select class="form-select" id="fineStatus" required>
                    <option value="Pending" selected>Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Waived">Waived</option>
                  </select>
                </div>
              </div>
              <div class="mb-3">
                <label for="notes" class="form-label">Notes (Optional)</label>
                <textarea class="form-control" id="notes" rows="3" placeholder="Add any additional notes..."></textarea>
              </div>
              <div class="d-flex justify-content-end">
                <button type="reset" class="btn btn-secondary me-2" id="resetForm">Reset</button>
                <button type="submit" class="btn btn-success">Update Fine</button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <!-- Current Fines Section -->
  <section class="mb-5">
  <h3>Current Fines</h3>
  <div class="row" id="currentFinesContainer">
    <!-- الكروت (John, Sarah, Michael) تبقى نفسها داخل هذا الـ div -->


          <!-- Fine Card 1 -->
          <div class="col-md-6 col-lg-4 mb-3">
            <div class="card fine-card h-100">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <h5 class="card-title">John Smith</h5>
                  <span class="badge status-pending rounded-pill">Pending</span>
                </div>
                <p class="card-text mb-1"><strong>Member ID:</strong> M001</p>
                <p class="card-text mb-1"><strong>Book ID:</strong> B001</p>
                <p class="card-text mb-1"><strong>Book:</strong> The Great Gatsby</p>
                <p class="card-text mb-1"><strong>Amount:</strong> $5.00</p>
                <p class="card-text mb-1"><strong>Due Date:</strong> 2025-03-15</p>
                <p class="card-text"><strong>Reason:</strong> Late Return</p>
                <div class="d-flex justify-content-end">
                  <button class="btn btn-primary btn-sm me-1">Edit</button>
                  <button class="btn btn-success btn-sm">Mark Paid</button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Fine Card 2 -->
          <div class="col-md-6 col-lg-4 mb-3">
            <div class="card fine-card h-100">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <h5 class="card-title">Sarah Johnson</h5>
                  <span class="badge status-overdue rounded-pill">Overdue</span>
                </div>
                <p class="card-text mb-1"><strong>Member ID:</strong> M002</p>
                <p class="card-text mb-1"><strong>Book ID:</strong> B002</p>
                <p class="card-text mb-1"><strong>Book:</strong> To Kill a Mockingbird</p>
                <p class="card-text mb-1"><strong>Amount:</strong> $10.00</p>
                <p class="card-text mb-1"><strong>Due Date:</strong> 2025-03-10</p>
                <p class="card-text"><strong>Reason:</strong> Book Damage</p>
                <div class="d-flex justify-content-end">
                  <button class="btn btn-primary btn-sm me-1">Edit</button>
                  <button class="btn btn-success btn-sm">Mark Paid</button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Fine Card 3 -->
          <div class="col-md-6 col-lg-4 mb-3">
            <div class="card fine-card h-100">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <h5 class="card-title">Michael Brown</h5>
                  <span class="badge status-paid rounded-pill">Paid</span>
                </div>
                <p class="card-text mb-1"><strong>Member ID:</strong> M003</p>
                <p class="card-text mb-1"><strong>Book ID:</strong> B003</p>
                <p class="card-text mb-1"><strong>Book:</strong> 1984</p>
                <p class="card-text mb-1"><strong>Amount:</strong> $2.50</p>
                <p class="card-text mb-1"><strong>Paid Date:</strong> 2025-03-12</p>
                <p class="card-text"><strong>Reason:</strong> Late Return</p>
                <div class="d-flex justify-content-end">
                  <button class="btn btn-primary btn-sm me-1">Edit</button>
                  <button class="btn btn-secondary btn-sm" disabled>Paid</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Fine History Section -->
      <section class="mb-5 search-history-section">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h3>Fine Update History</h3>
          <div class="d-flex" style="max-width: 300px;">
            <input type="text" class="form-control" id="historySearch" placeholder="Search by Member ID, Book ID...">
            <button class="btn btn-primary ms-2">Search</button>
          </div>
        </div>
        
        <div class="table-responsive">
          <table class="table table-striped table-hover history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Member ID</th>
                <th>Book ID</th>
                <th>Amount</th>
                <th>Previous Status</th>
                <th>New Status</th>
                <th>Updated By</th>
                <th>Notes</th>
              </tr>
            </thead>
          <tbody id="historyTableBody">
              <tr>
                <td>2025-03-14</td>
                <td>M001</td>
                <td>B001</td>
                <td>$5.00</td>
                <td><span class="badge status-pending">Pending</span></td>
                <td><span class="badge status-paid">Paid</span></td>
                <td>Admin User</td>
                <td>Paid via credit card</td>
              </tr>
              <tr>
                <td>2025-03-13</td>
                <td>M002</td>
                <td>B002</td>
                <td>$10.00</td>
                <td><span class="badge status-overdue">Overdue</span></td>
                <td><span class="badge status-pending">Pending</span></td>
                <td>Admin User</td>
                <td>Extended due date</td>
              </tr>
              <tr>
                <td>2025-03-12</td>
                <td>M003</td>
                <td>B003</td>
                <td>$2.50</td>
                <td><span class="badge status-pending">Pending</span></td>
                <td><span class="badge status-paid">Paid</span></td>
                <td>Admin User</td>
                <td>Paid in cash</td>
              </tr>
              <tr>
                <td>2025-03-10</td>
                <td>M004</td>
                <td>B004</td>
                <td>$7.50</td>
                <td><span class="badge status-overdue">Overdue</span></td>
                <td><span class="badge status-waived">Waived</span></td>
                <td>Admin User</td>
                <td>Fine waived due to library card issue</td>
              </tr>
              <tr>
                <td>2025-03-08</td>
                <td>M001</td>
                <td>B001</td>
                <td>$5.00</td>
                <td>-</td>
                <td><span class="badge status-pending">Pending</span></td>
                <td>System</td>
                <td>Auto-generated for late return</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <nav>
          <ul class="pagination justify-content-center">
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