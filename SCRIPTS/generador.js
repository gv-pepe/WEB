const firebaseConfig = {
    apiKey: "AIzaSyBNSS_nbz1M5zbPIjVjgQqmcLyOsp4tFlc",
    authDomain: "examenmauricio-db808.firebaseapp.com",
    databaseURL: "https://examenmauricio-db808-default-rtdb.firebaseio.com",
    projectId: "examenmauricio-db808",
    storageBucket: "examenmauricio-db808.appspot.com",
    messagingSenderId: "818692025535",
    appId: "1:818692025535:web:b36baca2f51bd91918ea0a",
    measurementId: "G-V56XN42HWN"
};

firebase.initializeApp(firebaseConfig);

const nombreUsuario = localStorage.getItem("nombreUsuario");
const correoUsuario = localStorage.getItem("correoUsuario");

if (nombreUsuario) {
    const userNombreElement = document.getElementById("user-name");
    const correoElement = document.getElementById("user-email");

    userNombreElement.textContent = nombreUsuario;
    correoElement.textContent = correoUsuario;
}
let cuestionario;


function verCuestionarios() {
    const nombreUsuario = localStorage.getItem("nombreUsuario");

    if (!nombreUsuario) {
        alert('Por favor, ingresa con un usuario para ver los cuestionarios.');
        return;
    }

    const database = firebase.database();
    const cuestionariosRef = database.ref('cuestionarios');

    cuestionariosRef.once('value', (snapshot) => {
        if (snapshot.exists()) {
            const cuestionariosData = snapshot.val();
            const listaCuestionarios = document.getElementById('listaCuestionarios');
            listaCuestionarios.innerHTML = '';

            // Itera a través de los cuestionarios y muestra solo los del usuario actual
            for (const key in cuestionariosData) {
                if (cuestionariosData.hasOwnProperty(key)) {
                    const cuestionario = cuestionariosData[key];

                    // Verifica si el nombre de usuario del cuestionario coincide con el usuario actual
                    if (cuestionario.usuario === nombreUsuario) {
                        const cuestionarioItem = document.createElement('li');
                        cuestionarioItem.textContent = cuestionario.titulo;
                        cuestionarioItem.addEventListener('click', () => {
                            mostrarCuestionario(cuestionario, key); // Pasa la clave como argumento
                        });
                        listaCuestionarios.appendChild(cuestionarioItem);
                    }
                }
            }

            // Muestra el contenedor de los cuestionarios
            document.getElementById('cuestionariosContainer').style.display = 'block';
        }
    });
}

function mostrarCuestionario(selectedCuestionario, cuestionarioKey) {
    // Almacena el cuestionario seleccionado en la variable global
    cuestionario = selectedCuestionario;

    // Almacena la clave del cuestionario seleccionado en la variable global
    cuestionario.key = cuestionarioKey;

    // Muestra el contenido del cuestionario seleccionado
    const cuestionarioSeleccionado = document.getElementById('cuestionarioSeleccionado');
    cuestionarioSeleccionado.style.display = 'block';

    // Muestra el título del cuestionario seleccionado
    const tituloCuestionarioSeleccionado = document.getElementById('tituloCuestionarioSeleccionado');
    tituloCuestionarioSeleccionado.textContent = `Cuestionario: ${selectedCuestionario.titulo}`;

    // Crea un objeto que contiene solo las propiedades deseadas
    const cuestionarioSimplificado = {
        descripcion: selectedCuestionario.descripcion,
        key: cuestionarioKey,
        preguntas: selectedCuestionario.preguntas,
        titulo: selectedCuestionario.titulo
    };

    // Imprime el objeto cuestionario simplificado en la consola
    console.log("Cuestionario seleccionado (simplificado):", cuestionarioSimplificado);
}





function compartirCuestionario() {
    if (!cuestionario) {
        alert('Por favor, selecciona un cuestionario primero.');
        return;
    }

    // Obtiene el código del cuestionario seleccionado (clave)
    const codigoCuestionario = cuestionario.key;

    if (!codigoCuestionario) {
        alert('No se encontró el código del cuestionario.');
        return;
    }

    // Agregar un salto de línea al mensaje
    const mensaje = `\n${codigoCuestionario}`;

    Swal.fire({
        title: 'Código del Cuestionario',
        text: mensaje,
        icon: 'info',
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
        confirmButtonText: 'Copiar al Portapapeles',
    }).then((result) => {
        if (result.isConfirmed) {
            // Copiar el código al portapapeles
            const tempInput = document.createElement('input');
            tempInput.value = codigoCuestionario;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            Swal.fire('¡Código copiado!', 'El código se ha copiado al portapapeles.', 'success');
        }
    });
}


function eliminarCuestionario() {
    Swal.fire({
        title: 'Eliminar cuestionario',
        text: '¿Estás seguro de que deseas eliminar este cuestionario?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Aquí puedes eliminar el cuestionario de la base de datos
            const database = firebase.database();
            const cuestionariosRef = database.ref('cuestionarios');

            if (cuestionario && cuestionario.key) {
                cuestionariosRef.child(cuestionario.key).remove()
                    .then(() => {
                        Swal.fire('Cuestionario eliminado', 'El cuestionario ha sido eliminado', 'success')
                            .then(() => {
                                // Remove the cuestionario from the UI
                                const listaCuestionarios = document.getElementById('listaCuestionarios');
                                const cuestionarioItems = listaCuestionarios.getElementsByTagName('li');

                                // Loop through cuestionario items and remove the one that matches the deleted cuestionario
                                for (let i = 0; i < cuestionarioItems.length; i++) {
                                    if (cuestionarioItems[i].textContent === cuestionario.titulo) {
                                        listaCuestionarios.removeChild(cuestionarioItems[i]);
                                        toggleElement('cuestionarioSeleccionado', "o")
                                        
                                        break;
                                    }
                                }
                            });
                    })
                    .catch((error) => {
                        Swal.fire('Error al eliminar', 'Hubo un error al eliminar el cuestionario', 'error');
                    });
            }
        }
    });
}


agregarPregunta();
toggleElement("botonActualizar", "o");


function agregarPregunta() {
    const preguntasDiv = document.getElementById('preguntas');
    const nuevaPregunta = document.createElement('div');

    nuevaPregunta.innerHTML = `
        <form>
            <input class="preg" type="text" name="preguntass" required placeholder="Titulo de la Pregunta">
            <select id="quitar" style="display:none;" class="opcionesType" name="opcionesType" onchange="cambiarTipoOpcion(this)">
                <option  value="radio">Multiple</option>
            </select>
            <div class="opciones"></div>
            <button type="button" onclick="agregarOpcion(this)">Agregar opción</button>
            <button type="button" onclick="quitarOpcion(this)">Quitar Opción</button>
        </form>
    `;

    preguntasDiv.appendChild(nuevaPregunta);
    
}

function agregarOpcion(btn) {
    const preguntaForm = btn.closest('form');
    const opcionesDiv = preguntaForm.querySelector('.opciones');
    const inputType = preguntaForm.querySelector('.opcionesType').value;
    const nuevaOpcion = document.createElement('div');
    const count = opcionesDiv.childElementCount + 1;

    if (inputType === 'radio' || inputType === 'checkbox') {
        nuevaOpcion.innerHTML = `
            <input  type="${inputType}" name="opciones" value="opcion${count}" disabled="disabled">
            <input class="respues" type="text" name="texto${count}" placeholder="Texto de la opción">
            <input type="${inputType}" name="correcta" value="opcion${count}"> Correcta
        `;
    } else if (inputType === 'text') {
        nuevaOpcion.innerHTML = `
            <input type="text" name="texto${count}" placeholder="Texto de la opción">
            <input type="checkbox" name="correcta" value="opcion${count}"> Correcta
        `;
    }

    opcionesDiv.appendChild(nuevaOpcion);
}



function quitarOpcion(btn) {
    const pregunta = btn.closest('form');
    const opcionesDiv = pregunta.querySelector('.opciones');

    if (opcionesDiv.childElementCount > 0) {
        opcionesDiv.removeChild(opcionesDiv.lastChild);
    }
}

function cambiarTipoOpcion(select) {
    const pregunta = select.closest('form');
    const opcionesDiv = pregunta.querySelector('.opciones');
    const inputType = select.value;

    Array.from(opcionesDiv.children).forEach((opcion, index) => {
        opcion.innerHTML = `
    <input type="${inputType}" name="opciones" value="opcion${index + 1}">
    <input type="text" name="texto${index + 1}" placeholder="Texto de la opción">
    <input type="${inputType}" name="correcta" value="opcion${index + 1}"> Correcta
`;
    });
}



const Actualizar = document.getElementById("botonActualizar");
Actualizar.addEventListener("click", function (event) {
    event.preventDefault();
    const database = firebase.database();
    const cuestionariosRef = database.ref('cuestionarios');
    if (cuestionario && cuestionario.key) {
        cuestionariosRef.child(cuestionario.key).remove()
            .then(() => {
                verCuestionarios()
            })
            .catch((error) => {
                Swal.fire('Error de Actualizacion', 'Hubo un error al actualizar el cuestionario', 'error');
            });
    }
    guardarCuestionario();
    
});

function guardarCuestionario() {
    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const preguntas = [];

    const preguntaForms = document.querySelectorAll('#preguntas form');
    preguntaForms.forEach((preguntaForm) => {
        const pregunta = preguntaForm.querySelector('input[placeholder="Titulo de la Pregunta"]').value;
        const tipo = preguntaForm.querySelector('.opcionesType').value;
        const opciones = [];

        const opcionForms = preguntaForm.querySelectorAll('.opciones div');
        opcionForms.forEach((opcionForm) => {
            const texto = opcionForm.querySelector('input[placeholder="Texto de la opción"]').value;
            const esCorrecta = opcionForm.querySelector('input[name="correcta"]').checked;
            opciones.push({ texto, esCorrecta });
        });

        preguntas.push({ pregunta, tipo, opciones });
    });

    // Obtener el nombre de usuario del almacenamiento local
    const nombreUsuario = localStorage.getItem("nombreUsuario");

    // Verificar si se encontró el nombre de usuario
    if (nombreUsuario) {
        // Agregar el nombre de usuario al objeto del cuestionario
        const cuestionario = {
            titulo,
            descripcion,
            preguntas,
            usuario: nombreUsuario  // Agrega el nombre de usuario como un campo adicional
        };

        // Obtener una referencia a la base de datos de Firebase
        const database = firebase.database();

        // Crear una nueva clave única para el cuestionario
        const cuestionarioKey = database.ref('cuestionarios').push().key;

        // Guardar el cuestionario en la base de datos
        const updates = {};
        updates['/cuestionarios/' + cuestionarioKey] = cuestionario;

        database.ref().update(updates);

        // Utiliza SweetAlert para mostrar un mensaje
        Swal.fire({
            title: 'Cuestionario guardado',
            text: 'Listo',
            icon: 'success',
            confirmButtonText: 'Aceptar'
            
        }).then(() => {
            regre()
            console.log('Proceso de actualizacion terminado')
        });
    } else {
        // Si no se encontró el nombre de usuario, muestra un mensaje de error
        Swal.fire({
            title: 'Error',
            text: 'No se pudo obtener el nombre de usuario.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
}

//_________________________________________ Esta parte va a manejar la vista ocultando y mostrando elementos _________________________

const enlace = document.getElementById("redireccionar");
enlace.addEventListener("click", function (event) {
    event.preventDefault();
    redir();
   
});

const redir = () => {
    toggleElement("miFormulario", "o");
    toggleElement("redireccionar", "o");
    toggleElement("container", "m");
    toggleElement("regresar", "m");
    toggleElement("botonActualizar", "m");
    verCuestionarios();
    toggleElement('cuestionarioSeleccionado', "o")
}


const irActualizar = document.getElementById("botonIrActualizar");
irActualizar.addEventListener("click", function (event) {
    event.preventDefault();
    irActual()
    if (cuestionario) {
        llenarCamposDelFormulario();
        
    } else {
        alert('Por favor, selecciona un cuestionario primero.');
    }
});

const irActual = () => {
    toggleElement("miFormulario", "m");
    toggleElement("redireccionar", "m");
    toggleElement("container", "o");
    toggleElement("regresar", "o");
    toggleElement("botonActualizar", "m");
    toggleElement("botonGuardar", "o");
    const inputTitulo = document.getElementById('titulo');
    inputTitulo.setAttribute('readonly', true);
}

const enl = document.getElementById("regresar");
enl.addEventListener("click", function (event) {
    regre()
});

const regre = () => {
    location.reload()
}

function toggleElement(id, accion) {
    var elemento = document.getElementById(id);
    if (accion == "o") {
        elemento.style.display = "none";
    } else if (accion == "m") {
        elemento.style.display = "block";
    }
}

//___________________________________________________________________________________________________________________________________________________

function llenarCamposDelFormulario() {
    // Llena los campos del formulario con los datos del objeto cuestionario
    const tituloInput = document.getElementById('titulo');
    const descripcionInput = document.getElementById('descripcion');
    const preguntasDiv = document.getElementById('preguntas');
    
    tituloInput.value = cuestionario.titulo;
    descripcionInput.value = cuestionario.descripcion;
    
    // Borra todas las preguntas del formulario
    preguntasDiv.innerHTML = '';
    
    // Itera a través de las preguntas del cuestionario y crea elementos en el formulario
    cuestionario.preguntas.forEach((pregunta, index) => {
        const nuevaPregunta = document.createElement('div');
        nuevaPregunta.innerHTML = `
            <form>
                <input class="preg" type="text" name="preguntass" required placeholder="Titulo de la Pregunta" value="${pregunta.pregunta}">
                <select id="quitar" style="display:none;" class="opcionesType" name="opcionesType" onchange="cambiarTipoOpcion(this)">
                    <option value="radio" ${pregunta.tipo === 'radio' ? 'selected' : ''}>Multiple</option>
                </select>
                <div class="opciones"></div>
                <button type="button" onclick="agregarOpcion(this)">Agregar opción</button>
                <button type="button" onclick="quitarOpcion(this)">Quitar Opción</button>
            </form>
        `;
        preguntasDiv.appendChild(nuevaPregunta);
        

        const opcionesDiv = nuevaPregunta.querySelector('.opciones');
        pregunta.opciones.forEach((opcion, opIndex) => {
            
            agregarOpciones(nuevaPregunta.querySelector('button'), pregunta.tipo, opcion.texto, opcion.esCorrecta, opIndex);
            
        });
    });
}

// Función para agregar opciones a una pregunta existente
function agregarOpciones(btn, inputType, texto, esCorrecta, opIndex) {
    const pregunta = btn.closest('form');
    const opcionesDiv = pregunta.querySelector('.opciones');
    const nuevaOpcion = document.createElement('div');
    const count = opcionesDiv.childElementCount + 1;

    if (inputType === 'radio' || inputType === 'checkbox') {
        nuevaOpcion.innerHTML = `
            <input type="${inputType}" name="opciones" value="opcion${count}" disabled="disabled" ${esCorrecta ? 'checked' : ''}>
            <input type="text" name="texto${count}" placeholder="Texto de la opción" value="${texto}">
            <input type="${inputType}" name="correcta" value="opcion${count}" ${esCorrecta ? 'checked' : ''}> Correcta
        `;
    } else if (inputType === 'text') {
        nuevaOpcion.innerHTML = `
            <input type="text" name="texto${count}" placeholder="Texto de la opción" value="${texto}">
            <input type="checkbox" name="correcta" value="opcion${count}" ${esCorrecta ? 'checked' : ''}> Correcta
        `;
    }

    opcionesDiv.appendChild(nuevaOpcion);
}

document.getElementById("cerrarSesionButton").addEventListener("click", function() {
    // Redirige a la página deseada
    window.location.href = "/index.html"; // Reemplaza "URL_DE_TU_PAGINA" con la URL a la que deseas redirigir.
  });

  document.getElementById("botonResultados").addEventListener("click", function() {
    const cuestionarioSeleccionado = document.getElementById('cuestionarioSeleccionado');
    verResultados();
});

function mostrarResultados(codigoFormularioSeleccionado) {
    const database = firebase.database();
    const contestadosRef = database.ref('Contestados');
    const tablaResultados = document.getElementById('tablaResultados');
    tablaResultados.innerHTML = ''; // Limpia la tabla antes de llenarla con nuevos datos

    contestadosRef.once('value', (snapshot) => {
        if (snapshot.exists()) {
            const contestadosData = snapshot.val();

            for (const key in contestadosData) {
                if (contestadosData.hasOwnProperty(key)) {
                    const contestado = contestadosData[key];

                    if (contestado.codigoFormulario === codigoFormularioSeleccionado) {
                        // Encontraste un objeto de "Contestados" con el código de formulario coincidente
                        const fila = document.createElement('tr');
                        const nombreCelda = document.createElement('td');
                        nombreCelda.textContent = contestado.nombre;
                        const calificacionCelda = document.createElement('td');
                        calificacionCelda.textContent = contestado.cal;

                        fila.appendChild(nombreCelda);
                        fila.appendChild(calificacionCelda);
                        tablaResultados.appendChild(fila);
                    }
                }
            }
            toggleElement("container-table", "m")
            if (tablaResultados.innerHTML === '') {
                alert('Ningún usuario ha contestado el formulario seleccionado.');
            }
        }
    });
}






function verResultados() {
    if (cuestionario && cuestionario.key) {
        console.log('Código del cuestionario:', cuestionario.key); // Agrega esta línea para depurar
        mostrarResultados(cuestionario.key);
    } else {
        alert('Por favor, selecciona un cuestionario primero.');
    }
}
