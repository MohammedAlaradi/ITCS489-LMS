<!DOCTYPE html>
<html lang="en">
  <head>
    <title>ULib</title>

    <!--Bootstrap for general styling, and self-written sheet for customization-->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"  integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="style.css">
  
    <!-- Bootstrap script for event handling -->
    <script defer src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/js/bootstrap.bundle.min.js"></script>
    <script defer src="fineScript.js"></script>
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
            <span class="ms-2">Pay Fine</span>
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
            <a class="nav-link btn-primary active" href="../borrowedBooks/borrowedBooks.php">Borrowed Books</a>
            <hr>
            <a class="nav-link btn-primary" href="fine.php">Fine</a>
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

        <section class="container mt-3">
            <h3 class="mb-3">Fines</h3>
            <div id="fineCardsRow" class="row g-3">
                <!-- Fine cards will be injected here by fineScript.js -->
            </div>
        </section>

    

    <footer class="text-center py-3 mt-5">
      &copy; 2025 ULib. All rights reserved.
    </footer>
  </main>