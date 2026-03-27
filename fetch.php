<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$url = "http://10.205.75.82/";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

// Fix single quotes → double quotes
$response = str_replace("'", '"', $response);

$data = json_decode($response, true);

if ($data === null) {
    echo json_encode(["error" => "Invalid JSON source"]);
} else {
    echo json_encode($data);
}