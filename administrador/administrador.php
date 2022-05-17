<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Link to CSS -->
    <link rel="stylesheet" href="../css/administrador.css">
    <title>Administrador</title>
</head>

<body>
    <?php require_once './dia.php'; ?>
    <?php require_once './proceso.php'; ?>

    <?php
    if (isset($_SESSION['message'])) :
    ?>

        <div class="alerts alert-<?= $_SESSION['msg_type'] ?>">

            <?php
            echo $_SESSION['message'];
            unset($_SESSION['message']);
            ?>
        </div>
    <?php endif ?>

    <h1 class="title">Administración de dias feriados</h1>
    <div class="wraper">
        <form action="proceso.php" method="POST">
            <input type="hidden" name="id" value="<?php echo $id; ?>">
            <label class="label" for="date">Introduzca la fecha</label>
            <input value="<?php echo $date; ?>" id="date" type="date" name="dia_festivo" placeholder="YYYY-MM-DD" class="date input">
            <?php
            if ($update == true) :
            ?>
                <button class="btn" type="submit" name="actualizar">Actualizar</button>
            <?php else : ?>
                <button id="btn" class="btn" type="submit" name="guardar">Guardar</button>
            <?php endif; ?>
        </form>
    </div>

    <?php

    $conexion = new mysqli("localhost", "root", "", "infotep_cursos") or die(mysqli_error($mysqli));

    $consulta_datos = "SELECT * FROM dias_festivos ORDER BY dia_festivo DESC";
    $resultado_datos = mysqli_query($conexion, $consulta_datos) or die("Error en el query");
    ?>

    <div class="fechas">
        <h2 class="fecha-titulo">Fechas</h2>
        <div class="fechas-info">
            <?php
            while ($row = mysqli_fetch_assoc($resultado_datos)) : ?>
                <div class="dia_festivo">
                    <?php echo $row['dia_festivo'] ?>
                    <?php
                    echo get_nombre_dia($row['dia_festivo']);
                    ?>
                </div>
                <div>
                    <a class="edit_btn btn" href="administrador.php?edit=<?php echo $row['id_dia']; ?>">Editar</a>
                    <a class="delete_btn btn" href="proceso.php?delete=<?php echo $row['id_dia']; ?>">Eliminar</a>
                </div>
            <?php endwhile ?>
        </div>

    </div>




    <!-- CDN de momentjs -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js" integrity="sha512-qTXRIMyZIFb8iQcfjXWCO8+M5Tbc38Qi5WzdPOYZHIlZpzBHG3L3by84BBBOiRGiEb7KKtAOAs5qYdUiZiQNNQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <!-- JS link -->
    <script src="../js/administrador.js"></script>
</body>

</html>