<?php

//Indico los datos de conexion

$dbhost = '127.0.0.1'; //localhost
$dbport = "";
$dbname = 'empresa';

$usuario = "usuarioapp";
$password = "123456";

$dbconm = null;

//selecciono base dato y conecto

$dbconm = pg_connect("host=$dbhost dbname=$dbname user=$usuario password=$password")
    or die ("No se ha podido conectar: ". pg_last_error());


// Cerrando la conexión
function cerrar_conexion(){
pg_close($dbconn);
}
?>
