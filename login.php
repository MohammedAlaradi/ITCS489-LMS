<?php
session_start();
require 'db.php';

$errors = [];
$success_message = '';
$logged_in = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email    = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($email === '' || $password === '') {
        $errors[] = 'Please enter email and password.';
    } else {
        $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            // Login successful
            $_SESSION['user_id']   = $user['id'];
            $_SESSION['user_name'] = $user['first_name'];
            $logged_in = true;
            $success_message = 'Login successful. Welcome, ' . htmlspecialchars($user['first_name']) . '!';
        } else {
            $errors[] = 'Invalid email or password.';
        }
    }
}
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>ULib - Login</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="assets/style.css">
</head>
<body>

<header class="ulib-header d-flex align-items-center justify-content-between">
    <div>
        <h1>ULib</h1>
        <small>University of Bahrain Library Management System</small>
    </div>
    <div class="d-none d-md-block">
        <span class="badge bg-light text-dark">Login</span>
    </div>
</header>

<div class="form-card">
    <h3 class="text-center mb-3" style="color:#124170;">LOGIN</h3>

    <!-- If user just came from registration -->
    <?php if (isset($_GET['registered'])): ?>
        <div class="alert alert-success">
            Your account has been created successfully. Please log in with your email and password.
        </div>
    <?php endif; ?>

    <!-- Success message after login -->
    <?php if ($success_message): ?>
        <div class="alert alert-success">
            <?= $success_message ?>
        </div>
    <?php endif; ?>

    <!-- Error messages -->
    <?php if (!empty($errors)): ?>
        <div class="alert alert-danger">
            <?php foreach ($errors as $e): ?>
                <div><?= htmlspecialchars($e) ?></div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>

    <!-- Info about register link -->
    <div class="alert alert-info py-2">
        If you do not have an account yet, please
        <a href="register.php" class="alert-link">click here to go to the registration page</a>.
    </div>

    <?php if (!$logged_in): ?>
        <!-- Login form (only shown if not logged in) -->
        <form method="post" novalidate>
            <div class="mb-3">
                <label class="form-label">E-mail</label>
                <input type="email" name="email" maxlength="30" class="form-control"
                       value="<?= htmlspecialchars($_POST['email'] ?? '') ?>" required>
            </div>

            <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" name="password" maxlength="12" class="form-control" required>
            </div>

            <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="remember">
                    <label class="form-check-label">Remember Me</label>
                </div>
                <a href="#">Forgot Password</a>
            </div>

            <button type="submit" class="btn btn-ulib w-100 mb-2">Login</button>

            <div class="text-center">
                Not a member? <a href="register.php">Register here</a>
            </div>
        </form>
    <?php endif; ?>

    <?php if ($logged_in): ?>
        <!-- Placeholder for main page AFTER successful login -->
        <div class="mt-4 p-4 border rounded" style="min-height: 220px;">
            <h5>Main Page Placeholder (for teammate)</h5>
            <p>
                This empty area is reserved for the <strong>main/home page</strong> of the Library System.
                After a successful login, the user should be redirected here or should see the main content here.
            </p>
            <p>
                <strong>Instructions for teammate:</strong><br>
                Replace this box with the real home page design and functionality
                (for example: navigation menu, list of books, search bar, profile area, etc.).
            </p>
            <p class="mb-0">
                You can keep the login logic above and simply insert your HTML/PHP code in this section.
            </p>
        </div>
    <?php endif; ?>
</div>

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
