<?php

$hostname = "localhost"; // the hostname you created when creating the database
$username = "root";      // the username specified when setting up the database
$password = "";      // the password specified when setting up the database
$database = "oneProject";      // the database name chosen when setting up the database 

$dbConnect = mysqli_connect($hostname, $username, $password, $database);
if (mysqli_connect_errno()) {
    die("Connect failed: %s\n" + mysqli_connect_error());
    exit();
};