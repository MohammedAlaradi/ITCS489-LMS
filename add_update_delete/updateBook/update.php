<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Update a Book - ULib</title>

    <!-- Bootstrap -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">

    <!-- Reuse main system CSS -->
    <link rel="stylesheet" href="style.css">

    <!-- Bootstrap JS -->
    <script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Our script -->
    <script defer src="updateScript.js"></script>
</head>

<body>

<!-- NAVBAR -->
<header class="p-3 navbar navbar-expand-md navbar-dark bg-dark">
    <div class="container-fluid d-flex align-items-center">
        <a class="navbar-brand d-flex align-items-center" href="../search/index.html">
            <img src="../ULiblogo.png" alt="Logo" width="60" height="48">
            <span class="ms-2">Update a Book</span>
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
            <a class="nav-link btn-primary" href="../search/index.html">Home</a>
            <hr>
            <a class="nav-link btn-primary" href="../borrowedBooks/borrowedBooks.html">Borrowed Books</a>
            <hr>
            <a class="nav-link btn-primary" href="../fine/fine.html">Fine</a>
            <hr>
            <a class="nav-link btn-primary" href="../addBook/add.html">Add a New Book</a>
            <hr>
            <a class="nav-link btn-primary active" href="update.html">Update a Book</a>
            <hr>
            <a class="nav-link btn-primary" href="../deleteBook/delete.html">Delete a Book</a>
            <hr>
            <a class="nav-link btn-primary" href="../reports/report_generation.html">Reports</a>
            <hr>
            <a class="nav-link btn-primary" href="../fine/fineupdate.html">Fine Policy</a>
        </nav>
    </div>
</div>


<!-- MAIN -->
<main class="container mt-4">

    <!-- Sidebar button + title -->
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

            <h3 class="mb-0">Update a Book</h3>
        </div>
    </section>


    <!-- CARD -->
    <section class="mb-3">
        <div class="card">
            <div class="card-body">

                <!-- SELECT BOOK -->
                <div class="mb-3">
                    <label class="form-label" for="bookSelect">Choose a Book to Update</label>
                    <select id="bookSelect" class="form-select">
                        <option value="">Select a book...</option>
                    </select>
                </div>

                <!-- FORM (hidden until book selected) -->
                <form id="updateBookForm" class="mt-3" style="display:none;">

                    <div class="row g-3">

                        <div class="col-md-6">
                            <label class="form-label">Title</label>
                            <input type="text" id="uTitle" class="form-control" required>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Author</label>
                            <input type="text" id="uAuthor" class="form-control" required>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Genre</label>
                            <select id="uGenre" class="form-select">
                                <option>Literature</option>
                                <option>Sci-Fi</option>
                                <option>Sports</option>
                                <option>Novel</option>
                                <option>Fantasy</option>
                                <option>Computer</option>
                                <option>Mystery</option>
                                <option>Others</option>
                            </select>
                        </div>

                        <div class="col-md-3">
                            <label class="form-label">Year of Publish</label>
                            <input type="number" id="uYear" class="form-control" min="1900" max="2100" required>
                        </div>

                        <div class="col-md-3">
                            <label class="form-label">Edition</label>
                            <input type="number" id="uEdition" class="form-control" min="1" required>
                        </div>

                        <div class="col-md-4">
                            <label class="form-label">ISBN (13 digits)</label>
                            <input type="text" id="uIsbn" class="form-control" maxlength="13" required>
                        </div>

                        <div class="col-md-4">
                            <label class="form-label">Number of Copies</label>
                            <input type="number" id="uCopies" class="form-control" min="0" required>
                        </div>

                        <div class="col-md-4">
                            <label class="form-label">Image URL</label>
                            <input type="text" id="uImage" class="form-control">
                        </div>

                    </div>

                    <!-- BUTTONS -->
                    <div class="row mt-4">
                        <div class="col-6">
                            <button type="button" id="cancelUpdate" class="btn btn-outline-secondary w-100">Cancel</button>
                        </div>
                        <div class="col-6">
                            <button type="submit" class="btn btn-primary w-100">Save Changes</button>
                        </div>
                    </div>

                </form>

            </div>
        </div>
    </section>

    <footer class="text-center py-3 mt-5">
        &copy; 2025 ULib. All rights reserved.
    </footer>

</main>

</body>
</html>
