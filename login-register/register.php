<?php
session_start();
require 'db.php';

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $cpr          = trim($_POST['cpr'] ?? '');
    $first_name   = trim($_POST['first_name'] ?? '');
    $last_name    = trim($_POST['last_name'] ?? '');
    $email        = trim($_POST['email'] ?? '');
    $password     = $_POST['password'] ?? '';
    $gender       = $_POST['gender'] ?? null;
    $phone_code   = trim($_POST['phone_code'] ?? '');
    $phone_number = trim($_POST['phone_number'] ?? '');
    $home         = trim($_POST['home'] ?? '');
    $road         = trim($_POST['road'] ?? '');
    $block        = trim($_POST['block'] ?? '');
    $city         = trim($_POST['city'] ?? '');
    $terms        = isset($_POST['terms']) ? 1 : 0;
    $newsletter   = isset($_POST['newsletter']) ? 1 : 0;

    // Simple validation for basic required fields
    if ($cpr === '' || $first_name === '' || $last_name === '' || $email === '' || $password === '') {
        $errors[] = 'Please fill in all required fields (CPR, first name, last name, email, password).';
    }

    if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Please enter a valid email address.';
    }

    try {
        // Check if email or CPR already exists
        if (empty($errors)) {
            $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? OR cpr = ? LIMIT 1');
            $stmt->execute([$email, $cpr]);
            if ($stmt->fetch()) {
                $errors[] = 'An account with this email or CPR already exists.';
            }
        }

        // Insert new user and redirect to login
        if (empty($errors)) {
            $password_hash = password_hash($password, PASSWORD_DEFAULT);

            $stmt = $pdo->prepare('INSERT INTO users 
                (cpr, first_name, last_name, email, password_hash, gender,
                 phone_country, phone_number, home, road, block, city, terms, newsletter)
                 VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)');

            $stmt->execute([
                $cpr, $first_name, $last_name, $email, $password_hash, $gender,
                $phone_code, $phone_number, $home, $road, $block, $city, $terms, $newsletter
            ]);

            // After successful registration: go directly to login page
            header('Location: login.php?registered=1');
            exit;
        }
    } catch (Exception $e) {
        $errors[] = 'Error while creating account: ' . $e->getMessage();
    }
}
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>ULib - Register</title>
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
        <span class="badge bg-light text-dark">Register</span>
    </div>
</header>

<div class="form-card">
    <h3 class="text-center mb-3" style="color:#124170;">REGISTER</h3>

    <!-- Info about login link -->
    <div class="alert alert-info py-2">
        This page is for creating a <strong>new account</strong>.<br>
        If you already have an account, please
        <a href="login.php" class="alert-link">click here to go to the login page</a>.
    </div>

    <?php if (!empty($errors)): ?>
        <div class="alert alert-danger">
            <?php foreach ($errors as $e): ?>
                <div><?= htmlspecialchars($e) ?></div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>

    <form method="post" novalidate>
        <!-- User Information -->
        <div class="form-section-title">User Information</div>
        <div class="mb-2">
            <label class="form-label">CPR</label>
            <input type="text" name="cpr" maxlength="9" class="form-control"
                   value="<?= htmlspecialchars($_POST['cpr'] ?? '') ?>" required>
        </div>

        <div class="row">
            <div class="mb-2 col-md-6">
                <label class="form-label">First Name</label>
                <input type="text" name="first_name" maxlength="10" class="form-control"
                       value="<?= htmlspecialchars($_POST['first_name'] ?? '') ?>" required>
            </div>
            <div class="mb-2 col-md-6">
                <label class="form-label">Last Name</label>
                <input type="text" name="last_name" maxlength="10" class="form-control"
                       value="<?= htmlspecialchars($_POST['last_name'] ?? '') ?>" required>
            </div>
        </div>

        <div class="mb-2">
            <label class="form-label">E-mail</label>
            <input type="email" name="email" maxlength="30" class="form-control"
                   value="<?= htmlspecialchars($_POST['email'] ?? '') ?>" required>
        </div>

        <div class="mb-3">
            <label class="form-label">Password</label>
            <input type="password" name="password" maxlength="12" class="form-control" required>
        </div>

        <div class="mb-3">
            <label class="form-label d-block">Gender</label>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="gender" value="Male"
                    <?= (($_POST['gender'] ?? '') === 'Male') ? 'checked' : '' ?>>
                <label class="form-check-label">Male</label>
            </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="gender" value="Female"
                    <?= (($_POST['gender'] ?? '') === 'Female') ? 'checked' : '' ?>>
                <label class="form-check-label">Female</label>
            </div>
        </div>

        <div class="mb-3">
            <label class="form-label">Phone</label>
            <div class="row g-2">
                <div class="col-4">
                    <input type="text" name="phone_code" maxlength="4" class="form-control"
                           placeholder="Code" value="<?= htmlspecialchars($_POST['phone_code'] ?? '') ?>">
                </div>
                <div class="col-8">
                    <input type="text" name="phone_number" maxlength="9" class="form-control"
                           placeholder="Number" value="<?= htmlspecialchars($_POST['phone_number'] ?? '') ?>">
                </div>
            </div>
        </div>

        <!-- Address -->
        <div class="form-section-title">Address</div>

        <div class="row g-2">
            <div class="col-md-3 mb-2">
                <label class="form-label">Home</label>
                <input type="text" name="home" maxlength="5" class="form-control"
                       value="<?= htmlspecialchars($_POST['home'] ?? '') ?>">
            </div>
            <div class="col-md-3 mb-2">
                <label class="form-label">Road</label>
                <input type="text" name="road" maxlength="4" class="form-control"
                       value="<?= htmlspecialchars($_POST['road'] ?? '') ?>">
            </div>
            <div class="col-md-3 mb-2">
                <label class="form-label">Block</label>
                <input type="text" name="block" maxlength="3" class="form-control"
                       value="<?= htmlspecialchars($_POST['block'] ?? '') ?>">
            </div>
            <div class="col-md-3 mb-2">
                <label class="form-label">City</label>
                <input type="text" name="city" maxlength="15" class="form-control"
                       value="<?= htmlspecialchars($_POST['city'] ?? '') ?>">
            </div>
        </div>

        <div class="form-check mt-3">
            <input class="form-check-input" type="checkbox" name="terms"
                <?= isset($_POST['terms']) ? 'checked' : '' ?>>
            <label class="form-check-label">
                I agree to <a href="#">Terms and Conditions</a>
            </label>
        </div>

        <div class="form-check mt-1 mb-3">
            <input class="form-check-input" type="checkbox" name="newsletter"
                <?= isset($_POST['newsletter']) ? 'checked' : '' ?>>
            <label class="form-check-label">
                I would like to receive e-mail notifications
            </label>
        </div>

        <div class="d-flex justify-content-between mt-3">
            <a href="login.php" class="btn btn-outline-secondary">Back to Login</a>
            <button type="submit" class="btn btn-ulib">Register</button>
        </div>

        <div class="mt-3 text-center">
            Already have an account? <a href="login.php">Login here</a>
        </div>
    </form>
</div>

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
