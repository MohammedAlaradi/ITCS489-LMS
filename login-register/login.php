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

            // REDIRECT AFTER LOGIN
            header('Location: ../brw_rsrv_payfine/search/index.php');
            exit;

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
    <div class="d-flex align-items-center gap-3">
        <!-- LOGO ADDED -->
        <img src="ULiblogo.webp" alt="ULib Logo" style="height:60px;">
        <div>
            <h1>ULib</h1>
            <small>University of Bahrain Library Management System</small>
        </div>
    </div>
    <div class="d-none d-md-block">
        <span class="badge bg-light text-dark">Login</span>
    </div>
</header>

<div class="form-card">
    <h3 class="text-center mb-3" style="color:#124170;">LOGIN</h3>

    <?php if (isset($_GET['registered'])): ?>
        <div class="alert alert-success">
            Your account has been created successfully. Please log in with your email and password.
        </div>
    <?php endif; ?>

    <?php if (!empty($errors)): ?>
        <div class="alert alert-danger">
            <?php foreach ($errors as $e): ?>
                <div><?= htmlspecialchars($e) ?></div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>

    <div class="alert alert-info py-2">
        If you do not have an account yet, please
        <a href="register.php" class="alert-link">click here to go to the registration page</a>.
    </div>

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
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

