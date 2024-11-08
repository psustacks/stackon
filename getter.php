<?php
include 'db_connect.php';

/**
 * Fetch all records from a specified table.
 *
 * @param string $tableName The name of the table to query.
 * @return array|false Array of records if successful, false if an error occurs.
 */
function getAllFromTable($tableName) {
    global $conn;
    $sql = "SELECT * FROM `$tableName`";
    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        return $result->fetch_all(MYSQLI_ASSOC);
    } else {
        return false;
    }
}

/**
 * Fetch records from a specified table where area matches a given value.
 *
 * @param string $tableName The name of the table to query.
 * @param string $area The area value to filter by.
 * @return array|false Array of records if successful, false if an error occurs.
 */
function getByArea($tableName, $area) {
    global $conn;
    $sql = "SELECT * FROM `$tableName` WHERE `area` = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $area);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        return $result->fetch_all(MYSQLI_ASSOC);
    } else {
        return false;
    }
}

/**
 * Fetch records from a specified table where category and area match given values.
 *
 * @param string $tableName The name of the table to query.
 * @param string $category The category value to filter by.
 * @param string $area The area value to filter by.
 * @return array|false Array of records if successful, false if an error occurs.
 */
function getByCategoryAndArea($tableName, $category, $area) {
    global $conn;
    $sql = "SELECT * FROM `$tableName` WHERE `category` = ? AND `area` = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $category, $area);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        return $result->fetch_all(MYSQLI_ASSOC);
    } else {
        return false;
    }
}
?>