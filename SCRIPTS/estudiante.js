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

function mostrarCuestionario(codigoFormulario) {
    const db = firebase.database();
    const formularioContent = document.getElementById("formularioContent");

    // Primero, verifica si el cuestionario existe en la base de datos
    const formulariosRef = db.ref("formularios");

    formulariosRef.once("value", function(snapshot) {
        const formulariosData = snapshot.val();
        const formularioData = formulariosData[codigoFormulario];

        if (formularioData) {
            formularioContent.innerHTML = "";

            // Resto del código para construir la interfaz del cuestionario
            const titulo = document.createElement("h1");
            titulo.className = "card-title";
            titulo.textContent = formularioData.titulo;

            const descripcion = document.createElement("p");
            descripcion.textContent = formularioData.descripcion;

            formularioContent.appendChild(titulo);
            formularioContent.appendChild(descripcion);

            formularioData.preguntas.forEach((pregunta, index) => {
                const preguntaElement = document.createElement("p");
                preguntaElement.textContent = `Pregunta ${index + 1}: ${pregunta.pregunta}`;
                formularioContent.appendChild(preguntaElement);

                if (pregunta.tipo === "radio") {
                    pregunta.opciones.forEach((opcion, i) => {
                        const label = document.createElement("label");
                        label.className = "form-check-label";
                        label.textContent = opcion.texto;

                        const radio = document.createElement("input");
                        radio.type = "radio";
                        radio.name = `respuesta_${index}`;
                        radio.value = i;

                        formularioContent.appendChild(label);
                        formularioContent.appendChild(radio);
                    });
                }
            });
        } else {
            formularioContent.innerHTML = "<p>Formulario no encontrado.</p>";
        }
    });
}

function verificarRespuestaUsuario(codigoFormulario) {
    const db = firebase.database();
    
    // Obtén el nombre de usuario desde localStorage o donde lo almacenes
    const nombreUsuario = localStorage.getItem("nombreUsuario");

    // Verifica en la base de datos si el usuario ya ha respondido al cuestionario
    const contestadosRef = db.ref("Contestados");

    contestadosRef.orderByChild("nombre").equalTo(nombreUsuario).once("value", function(snapshot) {
        const contestadosData = snapshot.val();

        if (contestadosData) {
            // El usuario ya ha respondido al cuestionario
            const cuestionarioContestado = Object.values(contestadosData).find(contestado => contestado.codigoFormulario === codigoFormulario);

            if (cuestionarioContestado) {
                // El usuario ya respondió a este cuestionario
                const calificacion = cuestionarioContestado.cal;
                const mensaje = `Ya has respondido a este cuestionario. Tu calificación obtenida es: ${calificacion}%`;
                
                // Muestra el mensaje en lugar del cuestionario
                const formularioContent = document.getElementById("formularioContent");
                formularioContent.innerHTML = `<p>${mensaje}</p>`;
            } else {
                // El usuario no ha respondido a este cuestionario, muestra el cuestionario
                mostrarCuestionario(codigoFormulario);
            }
        } else {
            // El usuario no ha respondido a ningún cuestionario, muestra el cuestionario
            mostrarCuestionario(codigoFormulario);
        }
    });
}

document.getElementById('empezarBtn').addEventListener('click', function() {
    const codigoFormulario = document.getElementById('codigoFormulario').value;
    verificarRespuestaUsuario(codigoFormulario);
    toggleElement("empezarBtn", "o");
});

</script>

