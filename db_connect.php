<?php
// $dbHost = 'localhost';

$dbHost = 'srv917.hstgr.io';

// Database Username
$dbUser = 'u426693394_hfs';

// Database Password
$dbPass = 'Hfs@905870698';

// Database Name
$dbName = 'u426693394_hfs';

// Base URL (Without http:// & https://)
$baseURL = 'hfs.medilance.in';

// Create the connection using variables from config.php
$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
