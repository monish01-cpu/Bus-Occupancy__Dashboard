<?php
// insert.php - Receives data from ESP32 and saves it to data.json

// Set timezone
date_default_timezone_set('Asia/Kolkata');

// Check if parameters are set (using $_GET as requested)
if (isset($_GET['lat']) && isset($_GET['lon']) && isset($_GET['speed']) && isset($_GET['count'])) {
    
    // Sanitize and validate inputs
    $lat = filter_var($_GET['lat'], FILTER_VALIDATE_FLOAT);
    $lon = filter_var($_GET['lon'], FILTER_VALIDATE_FLOAT);
    $speed = filter_var($_GET['speed'], FILTER_VALIDATE_INT);
    $count = filter_var($_GET['count'], FILTER_VALIDATE_INT);
    $prediction = isset($_GET['prediction']) ? filter_var($_GET['prediction'], FILTER_VALIDATE_INT) : 0;

    if ($lat === false || $lon === false) {
        http_response_code(400);
        die("Invalid coordinates");
    }

    // Prepare data array
    $data = [
        'lat' => $lat,
        'lon' => $lon,
        'speed' => $speed,
        'count' => $count,
        'prediction' => $prediction,
        'timestamp' => date('Y-m-d H:i:s')
    ];

    // Convert to JSON
    $jsonData = json_encode($data, JSON_PRETTY_PRINT);

    // Save to file
    if (file_put_contents('data.json', $jsonData)) {
        echo "Data inserted successfully";
    } else {
        http_response_code(500);
        echo "Error saving data";
    }

} else {
    echo "Waiting for data... Send parameters: ?lat=X&lon=Y&speed=S&count=C&prediction=P";
}
?>
