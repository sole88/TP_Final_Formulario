//creo 2 xhttp request para traer de base datos el tipo de documento y las vacantes de empleo y 1 para enviar los datos del formulario
var xhttp = new XMLHttpRequest();
var xhttp2 = new XMLHttpRequest();
var xhttp3 = new XMLHttpRequest();

//como lo voy a usar frecuentemente lo guardo en variable
var div_error = $("#error");

//con ajax traigo los datos del servidor (tipo documento y vacantes)
xhttp.onreadystatechange = recuperar_datos;
xhttp2.onreadystatechange = recuperar_vacantes;

//cuando el documento este cargado llamo a iniciar
window.addEventListener("load", iniciar);


//indico de que php traigo los datos y hago el send
function iniciar() {
    xhttp.open("GET", "http://localhost/TP_FINAL_PROMOCION_APIS/php/get_datos_formulario.php");
    xhttp.send();

    xhttp2.open("GET", "http://localhost/TP_FINAL_PROMOCION_APIS/php/get_datos_vacantes.php");
    xhttp2.send();
}

$("#btnEnviar").on("click", enviar);
$("#btnSiguiente").on("click", siguiente);


//recorro el json que recibo (lo parsea JSON al request que recibi) sacado de ejemplo teoria ajax_04_JSON_alumnos
function recuperar_datos() {
    if (this.readyState == 4 && this.status == 200) {
        let jsondoc = xhttp.responseText;
        let obj = JSON.parse(jsondoc);
        for (i in obj) {
            let opcion = $("<option/>");
            opcion.attr("value", obj[i][0]); //seteo value y obtengo id
            opcion.text(obj[i][1]); //obtengo el texto que sera el nombre del tipo de documento
            $("#tipo_doc").append(opcion); //agrego cada opcion como hijo del select
        }
    }
}
//lo mismo para vacantes
function recuperar_vacantes() {
    if (this.readyState == 4 && this.status == 200) {
        let jsondoc = xhttp2.responseText;
        let obj = JSON.parse(jsondoc);
        for (i in obj) {
            let opcion = $("<option/>");
            opcion.attr("value", obj[i][0]);
            opcion.text(obj[i][1]);
            $("#vacantes").append(opcion);
        }
    }
}



//funcion para avanzar en formulario usando la potencia ajax (sin recargar pagina)...similar a tp encuesta jquery y visto en practica
function siguiente() {
    var contador = 0;

    if (contador == 0)
        if (validar_datos() === true) {
            div_error.hide();
            $("#datos").hide();
            $("#div_foto").show();
            contador++;
        }



    if (contador == 1) {
        if (validar_foto() === true) {
            div_error.hide();
            $("#div_foto").hide(),
                $("#div_vacantes").show();
            contador++;
        }
    }

    if (contador == 2) {
        if (validar_vacante() === true) {
            div_error.hide();
            $("#div_vacantes").hide();
            $("#div_cv").show();
            contador++;
        }
    }

    if (contador == 3) {
        if (validar_cv() === true) {
            div_error.hide();
            $("#div_cv").hide();
            $("#parrafo").hide();
            $("#btnSiguiente").hide();
            $("#btnEnviar").show();
            contador++;
        }
    }


}

$("#buscar").on("click", buscar_id);
//obtengo valor ingresado en input, si no esta vacio envio a evaluar si existe en base datos
function buscar_id() {
    var id_Busqueda = $("#busqueda").val();
    if (id_Busqueda != "") {
        var xhttp4 = new XMLHttpRequest;

        xhttp4.open('POST', 'http://localhost/TP_FINAL_PROMOCION_APIS/php/buscar.php');

        var dato_id = new FormData();
        dato_id.append("busqueda", id_Busqueda);
        xhttp4.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsondoc = xhttp4.responseText;
                let obj = JSON.parse(jsondoc);
                $("#verificar_id").hide();
                $("#datos").show();
                $("#btnSiguiente").show();
                //si existe "obj" obtengo los valores de la base de datos y los muestro en los inputs para editar
                if (obj) {
                    $("#id_postulante").val(obj.id_postulante);
                    $("#nombre").val(obj.nombre);
                    $("#apellido").val(obj.apellido);
                    $("#tipo_doc").val(obj.id_tipo_documento);
                    $("#nro_doc").val(obj.nro_documento);
                    $("#email").val(obj.email);
                    $("#fecha_nac").val(obj.fecha_nacimiento);
                    $("#foto_miniatura").html("<img src='fotos_perfil/" + obj.foto + "' width='140px'>");
                    $("#cv_enlace").html("<a href='cv/cv_" + obj.apellido + "_" + obj.nombre + ".pdf' target='_blank'>" + "cv_" + obj.apellido + "_" + obj.nombre + ".pdf</a>");
                    $("#btnEnviar").val('Actualizar datos');
                }

            }
        }

        xhttp4.send(dato_id);
    }
}

$("#btnActualizar").on("click", siguiente);

//para validar los caracteres que permite el input mail
function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function validar_datos() {

    let mensaje_error = [];

    //verificacion de campos vacios
    if ($("#nombre").val() == "") { mensaje_error.push("Ingrese su nombre") }
    if ($("#apellido").val() == "") { mensaje_error.push("Ingrese su apellido") }
    if ($("#nro_doc").val() == "") { mensaje_error.push("Ingrese su numero de documento") }
    if ($("#email").val() == "") { mensaje_error.push("Ingrese su email") }
    if ($("#fecha_nac").val() == "") { mensaje_error.push("Ingrese su fecha de nacimiento") }
    if (!isEmail($("#email").val())) { mensaje_error.push("Formato de mail no válido") }

    if (mensaje_error.length > 0) {
        div_error.show();
        div_error.html("");
        div_error.html((mensaje_error).join("<br>"));
        return false;
    }
    return true;
}

//la asigno a variable fuera de validar_foto porque la necesito en funcion enviar
var foto = document.getElementById("foto_perfil");

function validar_foto() {
    var mensaje_error_foto = [];


    //obtengo el nombre de la foto y a partir de él su extension
    if (foto.files[0]) {
        var nombre_foto = foto.files[0].name;
        var extension_foto = nombre_foto.split(".").pop();
    };

    //saco espacios detras y delante y luego si hay en el medio reeemplazo con _
    var nomb = $.trim($("#nombre").val());
    var nombre = nomb.replace(/\s+/g, '_');
    var apell = $.trim($("#apellido").val());
    var apellido = apell.replace(/\s+/g, '_');

    /*genero la convension de nombres  con los datos del usuario que pide para la foto de perfil 
    (con toUpperCase paso todo a mayuscula para luego comparar tmb el nombre del archivo en mayuscula)*/ //detalle sugerido por Nico en practica
    var nombre_archivo_foto = ("foto_" + apellido + "_" + nombre + "." + extension_foto).toUpperCase();


    //me fijo si selecciono un archivo para luego poder controlar si respeta los 300kb y la convension de nombre
    if (foto.files.length == 0) {
        mensaje_error_foto.push("Elija su foto de perfil");
    }
    else if (foto.files[0].size > 300000) { //300.000 bytes = 300kb 
        mensaje_error_foto.push("El peso de la imagen no puede exceder los 300kb");
    } else if (foto.files[0].name.toUpperCase() != nombre_archivo_foto) {
        mensaje_error_foto.push("El nombre de la foto no es valido");
    }


    if (mensaje_error_foto.length > 0) {
        div_error.show();
        div_error.html("");
        div_error.html((mensaje_error_foto).join("</br>"));
        return false;
    }
    return true;
}


$("#vacante").on('change', validar_vacante);

function validar_vacante() {
    if ($("#vacantes").val() == '0' || $("#motivos").val() === '') {
        div_error.show();
        div_error.html("Debe seleccionar un puesto y detallar sus motivos")
        return false;
    }
    return true;
}


var cv = document.getElementById("cv");

function validar_cv() {
    let mensaje_error_cv = [];

    var nomb = $.trim($("#nombre").val());
    var nombre = nomb.replace(/\s+/g, '_');
    var apell = $.trim($("#apellido").val());
    var apellido = apell.replace(/\s+/g, '_');

    var nombre_archivo_cv = ("cv_" + apellido + "_" + nombre + ".pdf").toUpperCase();

    if (cv.files.length == 0) {
        mensaje_error_cv.push("Debe subir su curriculum");
    } else if (cv.files[0].name.toUpperCase() != nombre_archivo_cv) {
        mensaje_error_cv.push("El nombre del archivo CV es incorrecto");
    }
    if (mensaje_error_cv.length > 0) {
        div_error.show();
        div_error.html("");
        div_error.html(mensaje_error_cv.join("<br>"));
        return false;
    }
    return true;
}


//sacado de teoria ejemplo ajax_07_formdata_formulario
function enviar() {
    $("#btnEnviar").hide();
    var form = document.getElementById("form_postulaciones");

    xhttp3.open('POST', 'http://localhost/TP_FINAL_PROMOCION_APIS/php/enviar_form.php', false);

    // obtengo los valores de los inputs del formulario
    var datos = new FormData(form);
    //agrego foto y cv
    datos.append('foto_perfil', foto.files[0]);
    datos.append('cv', cv.files[0]);

    xhttp3.onreadystatechange = function () {

        if (xhttp3.readyState == 4 && xhttp3.status == 200) {
            let jsondoc = xhttp3.responseText;
            let obj = JSON.parse(jsondoc);

            if (obj.error) {
                div_error.show();
                div_error.html(obj.error);
            } else {
                $("#respuesta").html(obj.mensajes);
            }
        }
    }


    xhttp3.send(datos);
}

