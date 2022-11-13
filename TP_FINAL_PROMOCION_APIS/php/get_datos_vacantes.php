<?php

include 'conexion.php';
//inicaio conexion base datos

$jsondata = "";

//Realizo consulta SQL
$query = 'SELECT * FROM vacantes';
$result = pg_query($query) or die("La consulta fallo ". pg_last_error());

//Recorriendo los resultados
$vacante ="";
$vacante = "{";
    $array = array();
    while ($line = pg_fetch_array($result)){
      
    $array[] = $line;
  }
$vacante = substr($vacante,0,-1); //elimino la ultima como antes de finalizar el json
$vacante = "}";

//Liberando conjunto de resultados
pg_free_result($result);

header ("Content-type: application/json; charset = UTF-8"); 
echo json_encode($array); //codifico arreglo en formato json
exit();

?>