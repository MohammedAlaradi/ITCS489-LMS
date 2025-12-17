<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add a New Book - ULib</title>


    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">

    
    <link rel="stylesheet" href="style.css">

    <!-- Bootstrap JS -->
    <script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Our script -->
    <script defer src="addScript.js"></script>
</head>

<body>


<header class="p-3 navbar navbar-expand-md navbar-dark bg-dark">
    <div class="container-fluid d-flex align-items-center">
        <a class="navbar-brand d-flex align-items-center" href="../search/index.html">
            <img src="../ULiblogo.png" alt="Logo" width="60" height="48">
            <span class="ms-2">Add a New Book</span>
        </a>
    </div>
</header>



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
            <a class="nav-link btn-primary active" href="add.html">Add a New Book</a>
            <hr>
            <a class="nav-link btn-primary" href="../updateBook/update.html">Update a Book</a>
            <hr>
            <a class="nav-link btn-primary" href="../deleteBook/delete.html">Delete a Book</a>
            <hr>
            <a class="nav-link btn-primary" href="../reports/report_generation.html">Reports</a>
            <hr>
            <a class="nav-link btn-primary" href="../fine/fineupdate.html">Fine Policy</a>
        </nav>
    </div>
</div>


<!-- MAIN CONTENT -->
<main class="container mt-4">

    <!-- Sidebar toggle button + title -->
    <section class="mb-4">
        <div class="d-flex justify-content-start align-items-center w-100" style="flex-wrap: nowrap;">
            <button class="btn me-2 d-flex align-items-center justify-content-center menu" type="button"
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

            <h3 class="mb-0">Add a New Book</h3>
        </div>
    </section>

    <!-- FORM CARD -->
    <section class="mb-3">
        <div class="card">
            <div class="card-body">

                <form id="addBookForm">
                    <div class="row g-3">

                        <!-- TITLE -->
                        <div class="col-md-6">
                            <label class="form-label">Title</label>
                            <input type="text" id="title" class="form-control" required>
                        </div>

                        <!-- AUTHOR -->
                        <div class="col-md-6">
                            <label class="form-label">Author</label>
                            <input type="text" id="author" class="form-control" required>
                        </div>

                        <!-- GENRE -->
                        <div class="col-md-6">
                            <label class="form-label">Genre</label>
                            <select id="genre" class="form-select" required>
                                <option value="">Select genre...</option>
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

                        <!-- YEAR -->
                        <div class="col-md-3">
                            <label class="form-label">Year of Publish</label>
                            <input type="number" id="year" class="form-control" min="1900" max="2100" required>
                        </div>

                        <!-- EDITION -->
                        <div class="col-md-3">
                            <label class="form-label">Edition</label>
                            <input type="number" id="edition" class="form-control" min="1" value="1" required>
                        </div>

                        <!-- ISBN -->
                        <div class="col-md-4">
                            <label class="form-label">ISBN (13 digits)</label>
                            <input type="text" id="isbn" class="form-control" maxlength="13" required>
                        </div>

                        <!-- COPIES -->
                        <div class="col-md-4">
                            <label class="form-label">Number of Copies</label>
                            <input type="number" id="copies" class="form-control" min="0" value="1" required>
                        </div>

                        <!-- IMAGE URL -->
                        <div class="col-md-4">
                            <label class="form-label">Image URL (optional)</label>
                            <input type="text" id="image" class="form-control" placeholder="../ULiblogo.png">
                        </div>

                    </div>

                    <!-- BUTTONS -->
                    <div class="row mt-4">
                        <div class="col-6">
                            <button type="reset" class="btn btn-outline-secondary w-100">Reset</button>
                        </div>
                        <div class="col-6">
                            <button type="submit" class="btn btn-primary w-100">Save Book</button>
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
