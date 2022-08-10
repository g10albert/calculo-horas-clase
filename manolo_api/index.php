<?php

// require_once '../calculo-horas-clase/administrador/proceso.php'; 
require_once '../administrador/proceso.php'; 

header('Access-Control-Allow-Origin: *');
$con = mysqli_connect($dbhost, $dbuser, $dbpassword, $dbname);
if ($con) {
    $sql = "select * from dias_festivos";
    $result = mysqli_query($con,$sql);
    if ($result) {
        $i = 0;
        while($row = mysqli_fetch_assoc($result)){
            $response[$i]["id_dia"] = $row ["id_dia"];
            $response[$i]["dia_festivo"] = $row ["dia_festivo"];
            $i++;
        }
        echo json_encode($response,JSON_PRETTY_PRINT);
    }
} else {
    echo "Database connection failed";
}
?>