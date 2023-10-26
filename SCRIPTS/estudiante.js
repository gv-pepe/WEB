console.log("hola")
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



