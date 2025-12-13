# ULib – Login & Registration Module  
University of Bahrain Library Management System (ITCS489)

This project implements the **User Login** and **User Registration** module for a Library Management System using **PHP**, **MySQL**, **Bootstrap 5**, and a custom color palette.

> This branch (`hasan`) focuses only on the *authentication part*:
> - `login.php`
> - `register.php`
> - `db.php`
> - `database.sql`
> - `assets/style.css`

---

## 1. Features

- User registration with:
  - CPR  
  - First name / Last name  
  - Email  
  - Password (stored as a hashed value)  
  - Gender (Male / Female)  
  - Phone (code + number)  
  - Address (Home, Road, Block, City)  
  - Terms & Conditions + email notifications checkboxes  

- User login with:
  - Email + password  
  - Inline validation messages  
  - “Remember Me” checkbox (UI only)  
  - “Forgot Password” link (placeholder)  

- Navigation between pages:
  - From **Login** page → link to **Register** page  
  - From **Register** page → link back to **Login** page  
  - After successful registration → user is redirected to `login.php` with a success message  
  - After successful login → a placeholder “Main Page” section is displayed with instructions
    for the teammate to implement the real home page.

- Styling:
  - Built with **Bootstrap 5** (CDN)
  - Custom color palette:

    - `#DDF4E7`
    - `#67C090`
    - `#26667F`
    - `#124170`

---

## 2. Project Structure

```text
ITCS489-LMS/          (repository root – branch: hasan)
│
├── db.php            # Database connection (PDO)
├── login.php         # Login page (form + logic)
├── register.php      # Registration page (form + logic)
├── database.sql      # SQL script (database + users table)
│
└── assets/
    └── style.css     # Custom styles and color theme
