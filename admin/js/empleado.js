let empleados = [];

//const filtrador = new mdb.Datatable(document.getElementById('tbodyEmpleados'));

/*ESTA FUNCION NOS SIRVE PARA INICIALIZAR
 EL MODULO DE EMPLEADOS.              */
export async function inicializar()
{
    setDetalleEmpleadoVisible(false);
    refreshTableEmpleados();
    cargarSucursales();
}


//INSERT Y UPDATE EN EL MISMO METODO:
export async function save()
{
    //Declaramos variables.
    let url = "http://localhost:8080/sicefa_backend/api/empleado/save";
    let params = null;
    let resp = null;
    let datos = null;

    //UN OBJETO DONDE GUARDEMOS LOS DATOS DEL EMPLEADO:
    let emp = null;

    //PARA SABER SI UN EMPLEADO YA EXISTE O NO.
    let idEmpleado = 0;
    let idPersona = 0;
    let idUsuario = 0;

    // Revisamos si hay un ID de empleado:
    if (document.getElementById("txtIdEmpleado").value.trim().length > 0)
    {
        idEmpleado = parseInt(document.getElementById("txtIdEmpleado").value.trim());
        idPersona = parseInt(document.getElementById("txtIdPersona").value.trim());
        idUsuario = parseInt(document.getElementById("txtIdUsuario").value.trim());
    }

    // Si no hay un empleado con el ID descrito,
    // creamos una nueva instancia del Objeto:
    emp = new Object();
    emp.id = idEmpleado;

    emp.persona = new Object();
    emp.persona.id = idPersona;

    emp.usuario = new Object();
    emp.usuario.id = idUsuario;

    emp.sucursal = new Object();
    emp.sucursal.id = 0;

    // Si posicion es mayor o igual a 0, si encontramos un empleado:
//    if (posicion >= 0)
//        emp = empleados[posicion];
//    else
//    {
// 
// 
//        // Insertamos el objeto emp dentro del arreglo de empleados:
//        empleados.push(emp);
//    }

    //CONTINUAMOS LLENANDO LOS DATOS DEL OBJETO.
    //DATOS DEPERSONA:
    emp.persona.nombre = document.getElementById("txtNombre").value;
    emp.persona.apellidoPaterno = document.getElementById("txtApellidoPaterno").value;
    emp.persona.apellidoMaterno = document.getElementById("txtApellidoMaterno").value;
    emp.persona.genero = document.getElementById("cmbGenero").value;
    emp.persona.fechaNacimiento = document.getElementById("txtFechaNacimiento").value;
    emp.persona.rfc = document.getElementById("txtRfc").value;
    emp.persona.curp = document.getElementById("txtCurp").value;
    emp.persona.domicilio = document.getElementById("txtDomicilio").value;
    emp.persona.ciudad = document.getElementById("txtCiudad").value;
    emp.persona.estado = document.getElementById("txtEstado").value;
    emp.persona.telefono = document.getElementById("txtTelefono").value;
    emp.persona.codigoPostal = document.getElementById("txtCodPos").value;

    //DATOS DEL EMPLEADO:
    emp.codigo = document.getElementById("txtCodigoEmpleado").value;
    emp.fechaContratacion = document.getElementById("txtFechaIngreso").value;
    emp.puesto = document.getElementById("cmbPuesto").value;
    emp.salarioBruto = document.getElementById("txtSalarioBruto").value;
    emp.email = document.getElementById("txtEmail").value;
    emp.sucursal.id = document.getElementById("cmbSucursal").value;

    //DATOS DEL USUARIO:
    emp.usuario.nombreUsuario = document.getElementById("txtNombreUsuario").value;
    emp.usuario.contrasenia = document.getElementById("txtContrasenia").value;
    emp.usuario.rol = document.getElementById("cmbRol").value;

    params = {
        datosEmpleado: JSON.stringify(emp)
    };

    let ctype = 'application/x-www-form-urlencoded;charset=UTF-8';
    resp = await fetch(url,
            {
                method: "POST",
                headers: {'Content-Type': ctype},
                body: new URLSearchParams(params)
            });

    datos = await resp.json();
    if (datos.error != null)
    {
        Swal.fire('Error al guardar los datos del empleado.', datos.error, 'warning');
        return;
    }
    if (datos.exception != null)
    {
        Swal.fire('', datos.exception, 'danger');
        return;
    }


    Swal.fire('Movimiento Realizado',
            'Datos de Empleado Actualizados correctamente',
            'succes');
    cargarDatosEmpleadoEnFormulario(datos);
    fillTableEmpleado();


    //REFRESCAMOS EL CATALOGO DE EMPLEADOS:



    //Swal.fire('Movimiento Realizado', 'Datos de Empleado Actualizados correctamente.', 'success');
}


export async function deleteEmpleado() {
    let idEmpleado = document.getElementById("txtIdEmpleado").value.trim();

    if (idEmpleado.length > 0) {
        let confirmacion = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el registro de empleado de forma lógica.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo'
        });

        if (confirmacion.isConfirmed) {
            // Realiza la eliminación lógica
            try {
                let urlEliminar = `http://localhost:8080/sicefa_backend/api/empleado/delete/${idEmpleado}`;
                let respEliminar = await fetch(urlEliminar, { method: 'DELETE' });

                // Verificar la respuesta del servidor
                if (respEliminar.ok) {
                    // Mostrar un mensaje y actualizar la tabla después de eliminar el empleado
                    Swal.fire('Movimiento realizado.', 'Registro de empleado eliminado de forma lógica.', 'success');
                    fillTableEmpleado();  // <-- Llamada para actualizar la tabla
                } else {
                    // Mostrar un mensaje de error si falla la eliminación
                    Swal.fire('', 'Error al eliminar el empleado de forma lógica.', 'error');
                }
            } catch (error) {
                // Mostrar un mensaje de error en caso de problemas con la solicitud DELETE
                Swal.fire('', `Error al realizar la solicitud DELETE: ${error.message}`, 'error');
            }
        }
    } else {
        // Mostrar un mensaje si no se especifica un ID de empleado
        Swal.fire('', 'Especifique un ID de empleado', 'warning');
    }
}




export function getEmpleados()
{

}


export async function refreshTableEmpleados()
{
    let url = "http://localhost:8080/sicefa_backend/api/empleado/getAll";
    let resp = await fetch(url);
    let datos = await resp.json();

    alert(JSON.stringify(datos));

    if (datos.error != null)
    {
        Swal.fire('', datos.error, 'warning');
        return;
    }
    if (datos.exception != null)
    {
        Swal.fire('', datos.exception, 'danger');
        return;
    }
    empleados = datos;
    fillTableEmpleado();
}

/*LLENA LA TABLA DE EMPLEADOS
 CON EL ARREGLO.           */
function fillTableEmpleado()
{
    /*AQUI VAMOS A IR GUARDANDO EL CONTENIDO
     DEL TBODY DE LA TABLA EMPLEADOS:     */
    let contenido = '';

    /*RECORREMOS EL ARREGLO ELEMENTO POR ELEMENTO: */
    for (let i = 0; i < empleados.length; i++)
    {
        contenido += '<tr>' +
                '<td>' +
                empleados[i].persona.nombre + ' ' +
                empleados[i].persona.apellidoPaterno + ' ' +
                empleados[i].persona.apellidoMaterno +
                '</td>' +
                '<td>' + empleados[i].codigo + '</td>' +
                '<td>' + empleados[i].persona.rfc + '</td>' +
                '<td>' + empleados[i].email + '</td>' +
                '<td>' + empleados[i].persona.telefono + '</td>' +
                '<td>' +
                '<a href="#" class="text-info" onclick="cm.cargarDatosEmpleadoEnFormulario(' + i + ');"><i class="h4 fa-solid fa-street-view"></i></a>' +
                '</td>' +
                '</tr>';
    }

    document.getElementById("tbodyEmpleados").innerHTML = contenido;
}


//export function cargarDetalleEmpleado(posicion)
export function cargarDatosEmpleadoEnFormulario(emp) {
    // Para que notifiquen los datos que se envían.
    alert(JSON.stringify(emp));

    // Verificar si emp y emp.persona están definidos
    if (emp && emp.persona) {
        document.getElementById("txtIdEmpleado").value = emp.id ? emp.id : '';

        // Verificar si emp.persona.id está definido
        if (emp.persona.id !== undefined) {
            document.getElementById("txtIdPersona").value = emp.persona.id;
        } else {
            console.error('La propiedad "id" de persona es undefined o null.');
        }

        document.getElementById("txtIdUsuario").value = emp.usuario ? emp.usuario.id : '';

    } else {
        console.error('La propiedad persona o la propiedad "id" es undefined o null.');
    }

    document.getElementById("txtIdUsuario").value = emp.usuario ? emp.usuario.id : '';

    //DATOS DEPERSONA:
    document.getElementById("txtNombre").value = emp.persona ? emp.persona.nombre : '';
    //DATOS DE PERSONA:
    document.getElementById("txtApellidoPaterno").value = emp.persona ? emp.persona.apellidoPaterno : '';
    document.getElementById("txtApellidoMaterno").value = emp.persona ? emp.persona.apellidoMaterno : '';
    document.getElementById("cmbGenero").value = emp.persona ? emp.persona.genero : '';
    document.getElementById("txtFechaNacimiento").value = emp.persona ? emp.persona.fechaNacimiento : '';
    document.getElementById("txtRfc").value = emp.persona ? emp.persona.rfc : '';
    document.getElementById("txtCurp").value = emp.persona ? emp.persona.curp : '';
    document.getElementById("txtDomicilio").value = emp.persona ? emp.persona.domicilio : '';
    document.getElementById("txtCodPos").value = emp.persona ? emp.persona.cp : '';
    document.getElementById("txtCiudad").value = emp.persona ? emp.persona.ciudad : '';
    document.getElementById("txtEstado").value = emp.persona ? emp.persona.estado : '';
    document.getElementById("txtTelefono").value = emp.persona ? emp.persona.telefono : '';

//DATOS DEL EMPLEADO:
    document.getElementById("txtCodigoEmpleado").value = emp.codigo ? emp.codigo : '';
    document.getElementById("txtFechaIngreso").value = emp.fechaContratacion ? emp.fechaContratacion : '';
    document.getElementById("cmbPuesto").value = emp.puesto ? emp.puesto : '';
    document.getElementById("txtSalarioBruto").value = emp.salarioBruto ? emp.salarioBruto : '';
    document.getElementById("txtEmail").value = emp.email ? emp.email : '';
    document.getElementById("txtEstatus").value = emp.estatus ? emp.estatus : '';

//DATOS DEL USUARIO:
    document.getElementById("txtNombreUsuario").value = emp.usuario ? emp.usuario.nombreUsuario : '';
    document.getElementById("txtContrasenia").value = emp.usuario ? emp.usuario.contrasenia : '';
    document.getElementById("cmbRol").value = emp.usuario ? emp.usuario.rol : '';


    setDetalleEmpleadoVisible(true);


}

export function clearForm()
{
    document.getElementById("txtIdEmpleado").value = '';
    document.getElementById("txtIdPersona").value = '';
    document.getElementById("txtIdUsuario").value = '';

    //DATOS DE PERSONA:
    document.getElementById("txtNombre").value = '';
    document.getElementById("txtApellidoPaterno").value = '';
    document.getElementById("txtApellidoMaterno").value = '';
    document.getElementById("cmbGenero").value = '';
    document.getElementById("txtFechaNacimiento").value = '';
    document.getElementById("txtRfc").value = '';
    document.getElementById("txtCurp").value = '';
    document.getElementById("txtDomicilio").value = '';
    document.getElementById("txtCodPos").value = '';
    document.getElementById("txtCiudad").value = '';
    document.getElementById("txtEstado").value = '';
    document.getElementById("txtTelefono").value = '';

    //DATOS DEL EMPLEADO:
    document.getElementById("txtCodigoEmpleado").value = '';
    document.getElementById("txtFechaIngreso").value = '';
    document.getElementById("cmbPuesto").value = '';
    document.getElementById("txtSalarioBruto").value = '';
    document.getElementById("txtEmail").value = '';

    //DATOS DEL USUARIO:
    document.getElementById("txtNombreUsuario").value = '';
    document.getElementById("txtContrasenia").value = '';
    document.getElementById("cmbRol").value = '';
    refreshTableEmpleados();
}


/*BUSCA LA POSICION DE UN OBJETO EMPLEADO CON BASE
 CON BASE EN LA PROPIEDAD ID Y LA DEVUELVE.
 SI NO SE ENCUENTRA EL ID BUSCADO, EL METODO DEVUELVE -1.  */
function buscarPosicionEmpleadoPorId(id)
{
    //let pos = -1;

    for (let i = 0;
    i < empleados.length; i++)
    {
        if (empleados[i].id === id)
            return i;
    }
    return -1;
}


export function setDetalleEmpleadoVisible(valor)
{
    if (valor === true)
    {
        //OCULTAMOS LA SECCION DEL CATALOGO DE EMPLEADOS:
        document.getElementById('divCatalogoEmpleados').style.display = 'none';

        //MOSTRAMOS LA SECCION DEL DETALLE:
        document.getElementById('divDetalleEmpleado').style.display = '';
    } else
    {
        //OCULTAMOS LA SECCION DEL DETALLE:
        document.getElementById('divDetalleEmpleado').style.display = 'none';

        //MOSTRAMOS LA SECCION DEL CATALOGO DE EMPLEADOS:
        document.getElementById('divCatalogoEmpleados').style.display = '';
    }
}

export function clearAndShowDetalleEmpleado()
{
    clearForm();
    setDetalleEmpleadoVisible(true);
}

export async function cargarSucursales()
{
    let url = "http://localhost:8080/sicefa_backend/api/sucursal/getAll";
    let resp = await fetch(url);
    let datos = await resp.json();
    let contenido = '';

    if (datos.error != null)
    {
        Swal.fire('', datos.error, 'warning');
        return;
    }

    if (datos.exception != null)
    {
        Swal.fire('', datos.exception, 'danger');
        return;
    }

    //LLenamos las opciones del combo box con el ID y Nombre de la Sucursal:
    for (let i = 0; i < datos.length; i++)
        contenido += '<option value="' + datos[i].id + '">' + datos[i].nombre + '</option>';

    document.getElementById("cmbSucursal").innerHTML = contenido;
}