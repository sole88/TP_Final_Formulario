<?php

include 'conexion.php';
//inicio conexion base datos

$jsondata = "";

//Realizo consulta SQL
$query = 'SELECT * FROM tipo_documento';
$result = pg_query($query) or die("La consulta fallo ". pg_last_error());

//Recorriendo los resultados
$tipo ="";
$tipo = "{";
    $array = array();
    while ($line = pg_fetch_array($result)){
      
    $array[] = $line;
  }
$tipos = substr($tipo,0,-1); //elimino la ultima "," antes de finalizar el json
$tipos = "}";

//Liberando conjunto de resultados
pg_free_result($result);

header ("Content-type: application/json; charset = UTF-8"); //indico tipo de archivo a enviar y la codificacion
echo json_encode($array); //codifico arreglo en formato json
exit();

?>

