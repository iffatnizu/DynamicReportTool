<?php

$hostname = "localhost"; // the hostname you created when creating the database
$username = "root";      // the username specified when setting up the database
$password = "";      // the password specified when setting up the database
$database = "oneProject";      // the database name chosen when setting up the database 

$dbi = mysqli_connect($hostname, $username, $password, $database);
if (mysqli_connect_errno()) {
    die("Connect failed: %s\n" + mysqli_connect_error());
    exit();
}
$cmd = $dbi->real_escape_string(htmlspecialchars($_POST['cmd']));
if ($cmd == 'get') {
    //@todo Select accoring to their roles
    //$sql = "SELECT ReportID,Section,Title,Description FROM ReportDB WHERE IsDeleted='N' ORDER BY Section,Title";	
    $sql = "SELECT reportdb.*" .
            "FROM reportdb " .
            "ORDER BY Title;";
    if (!$result = $dbi->query($sql)) {
        $retValue['Status'] = "SQL Error: $dbi->error";
        echo json_encode($retValue);
        exit(0);
    }
    for ($retValue['ListData'] = array(); $row = $result->fetch_assoc();) {
        $retValue['ListData'][] = $row;
    }
    $retValue['Status'] = 'Ok';
    echo json_encode($retValue);
    exit(0);
}
if ($cmd == 'getReportField') {
    $ReportID = $dbi->real_escape_string(htmlspecialchars($_POST['ReportID']));
    $sql = "SELECT * " .
            "FROM reportdbfields " .
            "WHERE ReportID = $ReportID;";
    $retValue['sql'] = $sql;
    if (!$result = $dbi->query($sql)) {
        $retValue['Status'] = "SQL Error: $dbi->error";
        echo json_encode($retValue);
        exit(0);
    }
    for ($retValue['Result'] = array(); $row = $result->fetch_assoc();) {
        $retValue['Result'][] = $row;
//        $output['Status'] = 'Ok';
//        $output['sql'] = $sql;
//        $retValue = array();
//        while ($row = $result->fetch_assoc()) {
//            array_push($retValue, $row);
//        }
//        $output['Result'] = $retValue;
//        echo json_encode($output);
//        exit(0);
    }
    $retValue['Status'] = 'Ok';
    echo json_encode($retValue);
    exit(0);
}