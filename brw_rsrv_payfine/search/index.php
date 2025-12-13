<?php
// We'll fetch books via JavaScript API, so remove server-side rendering
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>ULib</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="style.css">
    <script defer src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/js/bootstrap.bundle.min.js"></script>
    <script defer src="searchScript.js"></script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
<header class="p-3 navbar navbar-expand-md navbar-dark bg-dark">
    <div class="container-fluid d-flex align-items-center">
        <a class="navbar-brand d-flex align-items-center" href="index.php">
            <img src="../ULiblogo.png" alt="Logo" width="60" height="48">
            <span class="ms-2">Search For a Book</span>
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
            <a class="nav-link btn-primary active" href="index.php">Home</a>
            <hr>
            <a class="nav-link btn-primary" href="../borrowedBooks/borrowedBooks.php">Borrowed Books</a>
            <hr>
            <a class="nav-link btn-primary" href="../fine/fine.php">Fine</a>
            <hr>
            <a class="nav-link btn-primary" href="">Add a New Book</a>
            <hr>
            <a class="nav-link btn-primary" href="">Update a Book</a>
            <hr>
            <a class="nav-link btn-primary" href="">Delete a Book</a>
            <hr>
            <a class="nav-link btn-primary" href="">Reports</a>
            <hr>
            <a class="nav-link btn-primary" href="">Fine Update</a>
        </nav>
    </div>
</div>

<main class="container mt-4">
    <section class="mb-4">
        <div class="d-flex justify-content-start align-items-center w-100" style="flex-wrap: nowrap;">
            <button class="btn me-2 d-flex align-items-center justify-content-center menu" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarNav" aria-controls="sidebarNav" style="width: 40px; height: 40px; border: none;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect y="4" width="24" height="2.5" rx="1.25" fill="#fff"/>
                    <rect y="10.75" width="24" height="2.5" rx="1.25" fill="#fff"/>
                    <rect y="17.5" width="24" height="2.5" rx="1.25" fill="#fff"/>
                </svg>
            </button>

            <input type="text" id="searchInput" class="form-control" placeholder="Search For a Book..." style="border-radius: 0.375rem 0 0 0.375rem; min-width: 120px; border-right: none; margin-left: 0;">

            <div class="dropdown flex-shrink-0" style="margin-left: -1px;">
                <button class="btn btn-outline-secondary dropdown-toggle h-100" type="button" data-bs-toggle="dropdown" style="border-radius: 0; border-left: none; border-right: none;">
                    Filter
                </button>
                <ul id="genreFilter" class="dropdown-menu" aria-labelledby="filterDropdown">
                    <li><h6 class="dropdown-header">Genre</h6></li>
                    <li><a class="dropdown-item" value="Literature">Literature</a></li>
                    <li><a class="dropdown-item" value="Sci-Fi">Sci-Fi</a></li>
                    <li><a class="dropdown-item" value="Sports">Sports</a></li>
                    <li><a class="dropdown-item" value="Novel">Novel</a></li>
                    <li><a class="dropdown-item" value="Fantasy">Fantasy</a></li>
                    <li><a class="dropdown-item" value="Computer">Computer</a></li>
                    <li><a class="dropdown-item" value="Mystery">Mystery</a></li>
                    <li><a class="dropdown-item" value="Others">Others</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="#" id="genreReset">Reset Filter</a></li>
                </ul>
            </div>

            <div class="dropdown flex-shrink-0" style="margin-left: -1px;">
                <button class="btn btn-outline-secondary dropdown-toggle h-100" type="button" data-bs-toggle="dropdown" style="border-radius: 0; border-left: none; border-right: none;">
                    Sort
                </button>
                <ul class="dropdown-menu" aria-labelledby="sortDropdown" id="sortDate">
                    <li><h6 class="dropdown-header">Publication Year</h6></li>
                    <li><a class="dropdown-item" href="#" value="a">Newest to Oldest &#8595;</a></li>
                    <li><a class="dropdown-item" href="#" value="d">Oldest to Newest &#8593;</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="#" id="sortReset">Reset Sort</a></li>
                </ul>
            </div>

            <button class="btn btn-primary flex-shrink-0" type="button" data-bs-toggle="collapse" data-bs-target="#AdvancedSearch" aria-expanded="false" aria-controls="Advanced" style="border-radius: 0 0.375rem 0.375rem 0; margin-left: -1px; border-left: none;">
                Advanced Search
            </button>
        </div>
        
        <section id="AdvancedSearch" class="collapse mt-3">
            <div class="card">
                <div class="card-body">
                    <h3 class="card-title">Advanced Search</h3>
                    <form>
                        <div class="mb-3">
                            <label for="bookISBN" class="form-label">ISBN</label>
                            <input type="number" placeholder="Enter The Book ISBN" class="form-control" id="bookISBN" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="yearOfPublish">Year Of Publish:</label>
                            <input type="number" class="form-control" id="yearOfPublish" name="yearOfPublish" min="1900" max="2025" step="1" pattern="\\d{4}" placeholder="e.g. 2023" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="Author">Author:</label>
                            <input type="textarea" cols="1" placeholder="Enter The Author's Name" class="form-control" id="AuthorName" required>
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
    
    <section>
        <h3>Available Books:</h3>
        <!-- Books will be loaded here by JavaScript -->
        <div class="row" id="booksContainer">
            <div class="col-12 text-center">
                <div class="spinner-border text-primary" role="status" id="loadingSpinner">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p id="loadingText">Loading books...</p>
            </div>
        </div>
    </section>

    <section class="mt-4">
        <nav>
            <!-- Pagination will be generated by JavaScript -->
            <ul class="pagination justify-content-center" id="paginationContainer">
                <!-- JavaScript will populate this -->
            </ul>
        </nav>
    </section>
</main>

<footer class="text-center py-3 mt-5">
    &copy; 2025 ULib. All rights reserved.
</footer>

</body>

</html>
