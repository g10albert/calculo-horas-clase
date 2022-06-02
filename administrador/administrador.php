<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- CDN de Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
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


        <div class="alert alerts alert-dismissible fade show  alert-<?= $_SESSION['msg_type'] ?>" role="alert">

            <?php
            echo $_SESSION['message'];
            unset($_SESSION['message']);
            ?>

            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
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
                    <a class="delete_btn btn" value="<?php echo $row['id_dia'] ?>" href="proceso.php?delete=<?php echo $row['id_dia']; ?>">Eliminar</a>
                </div>
            <?php endwhile ?>
        </div>

        <style>
            .edit_btn,
            .delete_btn {
                color: white;
            }

            .edit_btn:hover,
            .delete_btn:hover {
                color: white
            }

            #date {
                /* background: #000; */
                height: 3rem;
            }

            .alerts {
                color: #000;
            }
        </style>

    </div>




    <!-- CDN de momentjs -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js" integrity="sha512-qTXRIMyZIFb8iQcfjXWCO8+M5Tbc38Qi5WzdPOYZHIlZpzBHG3L3by84BBBOiRGiEb7KKtAOAs5qYdUiZiQNNQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <!-- JS link -->
    <script src="../js/administrador.js"></script>
    <!-- CDN de JavaScript con Popper de Bootstrap -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
    <!-- CDN de jquery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
    <!-- CDN de sweetalert -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.4.17/dist/sweetalert2.all.min.js"></script>


    <script>
        $(document).ready(function() {
            $('.delete_btn').on('click', function(e) {
                var id = $(this).attr('value');
                e.preventDefault();
                Swal.fire({
                    title: 'Quieres eliminar este registro?',
                    showDenyButton: true,
                    denyButtonText: 'Cancelar',
                    confirmButtonText: 'Eliminar',
                    // confirmButtonText: id,
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = "proceso.php?delete=" + id;
                    } else if (result.isDenied) {
                        Swal.fire('No se eliminó el registro', '', 'info')
                    }
                })
            })
        });
    </script>

</body>

</html>