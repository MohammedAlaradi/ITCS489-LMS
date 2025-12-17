<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Delete a Book - ULib</title>

    <!-- Bootstrap -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">

    <!-- System CSS (same theme used in other pages) -->
    <link rel="stylesheet" href="style.css">

    <!-- Bootstrap JS -->
    <script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Our script -->
    <script defer src="deleteScript.js"></script>
</head>

<body>

<!-- NAVBAR -->
<header class="p-3 navbar navbar-expand-md navbar-dark bg-dark">
    <div class="container-fluid d-flex align-items-center">
        <a class="navbar-brand d-flex align-items-center" href="../search/index.html">
            <img src="../ULiblogo.png" alt="Logo" width="60" height="48">
            <span class="ms-2">Delete a Book</span>
        </a>
    </div>
</header>


<!-- SIDEBAR -->
<div class="offcanvas offcanvas-start sidebar" tabindex="-1" id="sidebarNav" aria-labelledby="sidebarNavLabel">
    <div class="offcanvas-header d-flex justify-content-between align-items-center">
        <h5 class="offcanvas-title mb-0" id="sidebarNavLabel">Navigation</h5>
        <button type="button" class="btn-close ms-2" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>

    <div class="offcanvas-body">
        <nav class="nav flex-column">
            <a class="nav-link btn-primary" href="../search/index.php">Home</a>
            <hr>
            <a class="nav-link btn-primary" href="../borrowedBooks/borrowedBooks.php">Borrowed Books</a>
            <hr>
            <a class="nav-link btn-primary" href="../fine/fine.php">Fine</a>
            <hr>
            <a class="nav-link btn-primary" href="../addBook/add.php">Add a New Book</a>
            <hr>
            <a class="nav-link btn-primary" href="../updateBook/update.php">Update a Book</a>
            <hr>
            <a class="nav-link btn-primary active" href="delete.php">Delete a Book</a>
            <hr>
            <a class="nav-link btn-primary" href="../reports/report_generation.php">Reports</a>
            <hr>
            <a class="nav-link btn-primary" href="../fine/fineupdate.php">Fine Policy</a>
        </nav>
    </div>
</div>


<!-- MAIN CONTENT -->
<main class="container mt-4">

    <!-- Sidebar toggle + page title -->
    <section class="mb-4">
        <div class="d-flex justify-content-start align-items-center w-100">

            <button class="btn me-2 d-flex align-items-center justify-content-center menu" 
                type="button"
                data-bs-toggle="offcanvas" 
                data-bs-target="#sidebarNav"
                aria-controls="sidebarNav"
                style="width: 40px; height: 40px; border: none;">

                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect y="4" width="24" height="2.5" rx="1.25" fill="#fff"/>
                    <rect y="10.75" width="24" height="2.5" rx="1.25" fill="#fff"/>
                    <rect y="17.5" width="24" height="2.5" rx="1.25" fill="#fff"/>
                </svg>

            </button>

            <h3 class="mb-0">Delete a Book</h3>
        </div>
    </section>


    <!-- DELETE CARD -->
    <section class="mb-3">
        <div class="card">
            <div class="card-body">

                <!-- SELECT BOOK TO DELETE -->
                <div class="mb-3">
                    <label class="form-label">Choose a Book to Delete</label>
                    <select id="deleteSelect" class="form-select">
                        <option value="">Select a book...</option>
                    </select>
                </div>

                <!-- DELETE BUTTON -->
                <button class="btn btn-danger w-100" id="deleteBtn">
                    Delete Selected Book
                </button>

            </div>
        </div>
    </section>

    <footer class="text-center py-3 mt-5">
        &copy; 2025 ULib. All rights reserved.
    </footer>

</main>

</body>
</html>

