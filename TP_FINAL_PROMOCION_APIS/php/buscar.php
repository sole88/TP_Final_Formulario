<?php

//Archivo de conexión a la base de datos
require('conexion.php');

//verifico si campo busqueda esta seteado
if ( isset($_POST['busqueda']) && !empty($_POST['busqueda']) ){
    $id_nro_doc_enviado = intval( $_POST['busqueda'] );
}   

$consulta = "SELECT * FROM public.postulantes WHERE id_postulante = " . $id_nro_doc_enviado. " OR nro_documento = " . $id_nro_doc_enviado;
$resultado = pg_query( $consulta );

$postulante = pg_fetch_array( $resultado, NULL, PGSQL_ASSOC );
echo json_encode( $postulante );
exit();
