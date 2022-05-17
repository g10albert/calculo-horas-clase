<?php

session_start();

$conexion = new mysqli("localhost", "root", "", "infotep_cursos") or die(mysqli_error($mysqli));

$id = 0;
$update = false;
$date = '';

if (isset($_POST['guardar'])) {
    $date = $_POST['dia_festivo'];

    if (!empty($date)) {
        $consulta_insert = "INSERT INTO dias_festivos (dia_festivo) VALUES ('$date')";
        $resultado_insert = mysqli_query($conexion, $consulta_insert);

        if (!$resultado_insert) {
            $_SESSION['message'] = "La fecha ya existe";
            $_SESSION['msg_type'] = 'danger';
        } else {
            $_SESSION['message'] = "Se ingresó el registro";
            $_SESSION['msg_type'] = "success";
        }

        header("location: administrador.php");
    } else {
        header("location: administrador.php");
    }
}

if (isset($_GET['delete'])) {

    $id = $_GET['delete'];

    $consulta_delete = "DELETE FROM dias_festivos WHERE id_dia = $id";
    $resultado_delete = mysqli_query($conexion, $consulta_delete) or die("Error en el query");

    $_SESSION['message'] = "Se eliminó el registro";
    $_SESSION['msg_type'] = "danger";

    header("location: administrador.php");
}

if (isset($_GET['edit'])) {
    $id = $_GET['edit'];
    $update = true;

    $consulta_edit = "SELECT * FROM dias_festivos WHERE id_dia = $id";
    $resultado_edit = mysqli_query($conexion, $consulta_edit) or die("Error en el query");

    if ($resultado_edit->num_rows == 1) {
        $row = mysqli_fetch_array($resultado_edit);
        $date = $row['dia_festivo'];
    }
}

if (isset($_POST['actualizar'])) {
    $id = $_POST['id'];
    $date = $_POST['dia_festivo'];

    $consulta_update = "UPDATE dias_festivos SET dia_festivo = '$date' WHERE id_dia = $id";
    $resultado_update = mysqli_query($conexion, $consulta_update) or die("Error en el query");

    $_SESSION['message'] = 'Se actualizó el registro';
    $_SESSION['msg_type'] = "warning";

    header('location: administrador.php');
}
