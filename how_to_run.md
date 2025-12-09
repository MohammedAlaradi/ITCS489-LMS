Installation & Running Guide (For Instructor)

This guide explains how to set up and run the Library Login & Registration System using PHP, MySQL, and XAMPP.

Repository Branch

Student implementation exists in this branch:

https://github.com/MohammedAlaradi/ITCS489-LMS/tree/hasan

Requirements
Requirement	Notes
XAMPP	Includes Apache + MySQL
phpMyAdmin	Included with XAMPP
Browser	Chrome / Edge / Firefox
Project files	Must be placed inside htdocs

Download XAMPP: https://www.apachefriends.org/

Project Structure
ulib/
 ├── login.php
 ├── register.php
 ├── db.php
 ├── database.sql
 └── assets/
     └── style.css

Step 1 – Move project to XAMPP

Place the project folder inside:

C:\xampp\htdocs\ulib

Step 2 – Start Apache and MySQL

Open XAMPP Control Panel

Press Start for:

Apache

MySQL

Step 3 – Create the Database

Go to:

http://localhost/phpmyadmin


Open SQL tab

Copy and paste content of database.sql

Click Go

This creates:

Database name: ulib

Table name: users

Step 4 – Run the Project

Open in browser:

Page	URL
Login	http://localhost/ulib/login.php

Register	http://localhost/ulib/register.php
Usage

Open register.php

Create an account

You will be redirected to login.php

Log in using the registered email and password

A placeholder page will appear (home page to be implemented later)

View Stored Users

Open phpMyAdmin

Select database ulib

Open table users

Click Browse

Summary
Feature	Status
Registration	✔
Login	✔
Database storage	✔
Bootstrap UI	✔
Ready for LMS expansion	✔
