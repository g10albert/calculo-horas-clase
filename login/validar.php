<?php
$usuario = $_POST['usuario'];
$contrasena = $_POST['contrasena'];
session_start();
$SESSION['usuario'] = $usuario;

$conexion = new mysqli("localhost", "root", "", "infotep_cursos");

$consulta = "SELECT * FROM usuarios WHERE nombre_de_usuario = '$usuario' AND contrasena = '$contrasena'";
$resultado = mysqli_query($conexion, $consulta)or die("Error en el query");

$filas = mysqli_num_rows($resultado);

if ($filas) {
    header("location:../administrador/administrador.php");
} else {
    ?>
    <?php
    include("./login.html");
    ?>
    <h1>Este usuario no existe</h1>
    <?php
}
mysqli_free_result($resultado);
mysqli_close($conexion);