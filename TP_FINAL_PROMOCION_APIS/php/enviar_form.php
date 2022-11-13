<?php

include "conexion.php";

$jsondata = array();
$cant_campos = 0;
$mensajes = "";

//comprobacion de campos seteados
if ( isset($_POST['nombre']) && !empty($_POST['nombre']) ){
    $nombre = $_POST['nombre'];
} else {
    $jsondata['error'] .= "Hubo un error al intentar obtener el nombre<br>";
}

if(isset($_POST['apellido']) && !empty($_POST['apellido']) ){
    $apellido = $_POST['apellido'];
} else {
    $jsondata['error'] .= "Hubo un error al intentar obtener el apellido</br>";
}

if (isset($_POST['tipo_doc']) && !empty($_POST['tipo_doc'])) {
    $tipo_doc = $_POST['tipo_doc'];
} else {
    $jsondata['error'] .= "Hubo un error obteniendo el tipo de documento<br>";
}

if (isset($_POST['nro_doc']) && !empty($_POST['nro_doc'])) {
    $nro_doc = $_POST['nro_doc'];
}  else {
    $jsondata['error'] .= "Hubo un error obteniendo el numero de documento</br>";
}

if (isset($_POST['email']) && !empty($_POST['email'])) {
    $email = $_POST['email'];
} else {
    $jsondata['error'] .= "Hubo un error obteniendo el email</br>";
}


if (isset($_POST['fecha_nac']) && !empty($_POST['fecha_nac'])) {
    $fecha_nac = $_POST['fecha_nac'];
    //paso fecha de dd/mm/yy a yy/mm/dd
    $fch = explode("-",$fecha_nac);
    $tfecha = $fch[2]."-".$fch[1]."-".$fch[0];
} else {
    $jsondata['error'] .= "Hubo un error tratando de obtener su fecha de nacimiento</br>";
}


if (isset($_FILES['foto_perfil']) && !empty($_FILES['foto_perfil'])) {
    $foto_perfil = $_FILES['foto_perfil'];

    $carpeta_perfil = '../fotos_perfil/'.basename($foto_perfil["name"]); 
    
    if( !move_uploaded_file($foto_perfil["tmp_name"], $carpeta_perfil) ) {

        $jsondata['error'] .= "Hubo un problema subiendo la foto de perfil, intente nuevamente.<br>";
    }
}



if (isset($_FILES['cv']) && !empty($_FILES['cv'])) {
    $curriculum = $_FILES['cv'];

    $carpeta_cv = '../cv/'.basename($curriculum["name"]); 

    if( !move_uploaded_file($curriculum["tmp_name"], $carpeta_cv) ) {

        $jsondata['error'] .= "Hubo un problema subiendo el cv, intente nuevamente.<br>";
    }
} else {
    $jsondata['error'] .= "Hubo un error obteniendo el cv</br>";
}

if (isset($_POST['vacantes']) && !empty($_POST['vacantes'])) {
    $vacante = $_POST['vacantes'];
} else {
    $jsondata['error'] .= "Hubo un error obteniendo la vacante</br>";
}

if (isset($_POST['motivos']) && !empty($_POST['motivos'])) {
    $motivo = $_POST['motivos'];
} else {
    $jsondata['error'] .= "Hubo un error obteniendo los motivos laborales</br>";
}

if ( !isset( $jsondata['error'] ) ) {
    //para guardar el nombre de la foto en base datos
    $nombre_foto_perfil = $foto_perfil['name'];

    $editando = false;
    //verifico si el div_id_postulante que estaba oculto esta seteado (eso indica que ya esta registrado por ello edito datos y no inserto)
    if( isset( $_POST['id_postulante'] ) && !empty( $_POST['id_postulante'] ) ) {
        $editando = true;
    }

    //me fijo que no exista el mail en la base de datos y tampoco el DNI
    $buscar_mail = "SELECT * from public.postulantes WHERE ( email = '$email' OR nro_documento = $nro_doc )";
   
    //si estoy editando verifico que no halla otro postulante con mi mail
    if( $editando ) {
        $buscar_mail .= " AND id_postulante <> " . intval( $_POST['id_postulante'] );
    }

    $resultado_mail = pg_query($buscar_mail);
//si el mail esta en la base de datos no permito que la persona se registre con ese mail
    if(  pg_num_rows( $resultado_mail ) >= 1 ) {

        $jsondata['error'] = "El mail ya existe</br>";

    } else {

        if( $editando ) {
            $consulta = "UPDATE public.postulantes SET nombre = '$nombre',apellido = '$apellido' ,nro_documento = '$nro_doc',email = '$email',fecha_nacimiento = '$tfecha',foto = '$nombre_foto_perfil',motivo_puesto = '$motivo', id_vacante = '$vacante',id_tipo_documento = '$tipo_doc' WHERE id_postulante = " . intval( $_POST['id_postulante'] ) . " RETURNING id_postulante;";
        } else {
            $consulta = "INSERT INTO public.postulantes(nombre,apellido,nro_documento,email,fecha_nacimiento,foto,motivo_puesto, id_vacante,id_tipo_documento)  values('$nombre','$apellido','$nro_doc','$email','$tfecha','$nombre_foto_perfil', '$motivo','$vacante','$tipo_doc' ) RETURNING id_postulante;";
        }

        $resultado = pg_query($consulta);
        if ( ! $resultado ) {
            $jsondata['error'] = 'No pudo insertarse:'. pg_last_error();
        } else {
            $id_insertado = pg_fetch_row( $resultado )[0];

            $total_postulantes_puestos = "SELECT count(*) FROM postulantes WHERE id_vacante =".$vacante.";";

            $resultado_postulantes = pg_query($total_postulantes_puestos);
            if ( ! $resultado_postulantes ) {
                $jsondata['error'] = 'La consulta fallo'. pg_last_error() . '<br>';
            } else {
                $total_postulantes_puestos= pg_fetch_row($resultado_postulantes);
                if ($total_postulantes_puestos) {
                    $mensajes .= "<h2>Sus datos han sido ingresados correctamente su ID es " . $id_insertado . "</h2><h3>En el puesto de trabajo solicitado hay:<strong> ".$total_postulantes_puestos['0']." </strong>postulantes</h3>";
                } else {
                    $jsondata['error'] = 'Hubo un error consultando los postulantes';
                }
            }
        }
    }
}
$jsondata['mensajes'] = $mensajes;
header('Content-type: application/json; charset=utf-8');
echo json_encode($jsondata);
exit();

?>