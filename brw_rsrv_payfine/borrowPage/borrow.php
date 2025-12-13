<!DOCTYPE html>
<html lang="en">
  <head>
    <title>ULib</title>

    <!--Bootstrap for general styling, and self-written sheet for customization-->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"  integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="style.css">
  
    <!-- Bootstrap script for event handling -->
    <script defer src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/js/bootstrap.bundle.min.js"></script>
    <script defer src="borrowScript.js"></script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body>
    <!-- Top of the page, contains the reference for other modules -->
    <!-- Header -->
    <!-- Top Navbar with Logo and Sidebar Button -->
<header class="p-3 navbar navbar-expand-md navbar-dark bg-dark">
    <div class="container-fluid d-flex align-items-center">
            <a class="navbar-brand d-flex align-items-center" href="../search/index.php">
            <img src="../ULiblogo.png" alt="Logo" width="60" height="48">
            <span class="ms-2">Borrow a Book</span>
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
            <a class="nav-link btn-primary" href="../search/index.php">Home</a>
            <hr>
            <a class="nav-link btn-primary active" href="../borrowPage/borrow.php">Borrow a Book</a>
            <hr>
            <a class="nav-link btn-primary" href="../fine/fine.php">Fine</a>
            <hr>
            <a class="nav-link btn-primary" href="">Add a New Book</a>
            <hr>
            <a class="nav-link btn-primary" href="">Update a Book</a>
            <hr>
            <a class="nav-link btn-primary" href="">Delete a Book</a>
            <hr>
            <a class="nav-link btn-primary" href="../fineupdate_report/Report/report_generation.php">Reports</a>
            <hr>
            <a class="nav-link btn-primary" href="../fineupdate_report/fineUpdate/fineupdate.php">Fine Update</a>
        </nav>
    </div>
</div>
<main class="container mt-4">
    <!-- Search, Filter, and Sort Section -->
    <section class="mb-4">
        <div class="d-flex justify-content-start align-items-center w-100" style="flex-wrap: nowrap;">
            <!-- Sidebar Toggle Button (keep navigation) -->
            <button class="btn me-2 d-flex align-items-center justify-content-center menu" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarNav" aria-controls="siedebarNav" style="width: 40px; height: 40px;  border: none;">
                <!-- Custom SVG menu icon -->
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect y="4" width="24" height="2.5" rx="1.25" fill="#fff"/>
                    <rect y="10.75" width="24" height="2.5" rx="1.25" fill="#fff"/>
                    <rect y="17.5" width="24" height="2.5" rx="1.25" fill="#fff"/>
                </svg>
            </button>
        </div>
    </section>

    <section class="mb-3 borrow-detail">
      <div class="container-fluid">
        <h3 class="mt-2">Book Information:</h3>
        <div class="row mt-3 g-3 align-items-stretch">
          <div class="col-md-4">
            <div class="card h-100">
              <div class="card-body d-flex align-items-center justify-content-center">
                <img id="coverImg" src="../ULiblogo.png" alt="Book Cover" class="img-fluid" style="max-height:300px; object-fit:contain; width:100%;">
              </div>
            </div>
          </div>
          <div class="col-md-8">
            <div class="card h-100">
              <div class="card-body d-flex flex-column justify-content-start">
                <div class="mb-3">
                  <label class="form-label"><strong>Title</strong></label>
                  <p id="titleField" class="form-control-plaintext">-</p>
                </div>
                <div class="mb-3">
                  <label class="form-label"><strong>ISBN</strong></label>
                  <p id="isbnField" class="form-control-plaintext">-</p>
                </div>
                <div class="mb-3">
                  <label class="form-label"><strong>Edition</strong></label>
                  <p id="editionField" class="form-control-plaintext">-</p>
                </div>
                <div class="mb-3">
                  <label class="form-label"><strong>Author</strong></label>
                  <p id="authorField" class="form-control-plaintext">-</p>
                </div>
                <div class="mb-3">
                  <label class="form-label"><strong>Copies left</strong></label>
                  <p id="copiesField" class="form-control-plaintext">-</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mb-3">
      <div class="container-fluid">
        <h5 class="mb-3"><strong>Borrowing Period:</strong></h5>
        <div class="row g-3">
          <div class="col-md-6">
            <label for="fromDate" class="form-label">From</label>
            <input type="date" id="fromDate" class="form-control">
          </div>
          <div class="col-md-6">
            <label for="toDate" class="form-label">To</label>
            <input type="date" id="toDate" class="form-control">
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-6">
            <button id="cancelBorrow" type="button" class="btn btn-outline-secondary w-100">Cancel</button>
          </div>
          <div class="col-6">
            <button id="confirmBorrow" type="button" class="btn btn-primary w-100" disabled>Confirm Borrow</button>
          </div>
        </div>
      </div>
    </section>



    <footer class="text-center py-3 mt-5">
      &copy; 2025 ULib. All rights reserved.
    </footer>

  </main>
