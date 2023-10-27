import { ref, db, get } from "./FirebaseConfig.js";

var rutaEstudiante = "/FORMULARIO/Estudiante.html";
var rutaMaestro = "/FORMULARIO/generador.html";

function mostrarMensajeError(mensaje) {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: mensaje,
  });
}

function buscarElementoPorClave(clave, password) {
  const dbRef = ref(db, "usuario/" + clave);
  return get(dbRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const datosElemento = snapshot.val();
        const nombreEnFirebase = datosElemento.nombre;
        const claveEnFirebase = datosElemento.clave;

        if (nombreEnFirebase === clave && claveEnFirebase === password) {
          return true;
        } else {
          mostrarMensajeError("Usuario o contraseña incorrectos");
          document.getElementById('username').style.borderColor = 'red';
          document.getElementById('password').style.borderColor = 'red';
          document.getElementById('username').style.backgroundColor = '#ffd0d0';
          document.getElementById('password').style.backgroundColor = '#ffd0d0';
          return false;
        }
      } else {
          
        mostrarMensajeError("Usuario no encontrado");
        
        return false;
      }
    })
    .catch((error) => {
      mostrarMensajeError("Error al buscar elemento: " + error);
      return false;
    });
}

document.getElementById("iniciar").addEventListener("click", function () {
  var nombre = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  buscarElementoPorClave(nombre, password).then((resultado) => {
    if (resultado) {
      console.log("Inicio de sesión exitoso");
    }
  });
});

document.getElementById("login-form").addEventListener("submit", function (event) {
  event.preventDefault();

  var nombre = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  buscarElementoPorClave(nombre, password).then((resultado) => {
    if (resultado) {
      redirigirSegunRol(nombre);
    }
  });
});

function redirigirSegunRol(nombre) {
  const usuarioRef = ref(db, "usuario/" + nombre);

  get(usuarioRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const datosUsuario = snapshot.val();
        const rol = datosUsuario.rol;
        const cor = datosUsuario.correo;

        if (rol === "Estudiante") {
          localStorage.setItem("nombreUsuario", nombre);
          localStorage.setItem("correoUsuario", cor);
          window.location.href = rutaEstudiante;
        } else if (rol === "Maestro") {
          localStorage.setItem("nombreUsuario", nombre);
          localStorage.setItem("correoUsuario", cor);
          window.location.href = rutaMaestro;
        } else {
          mostrarMensajeError("Rol desconocido");
        }
      } else {
        mostrarMensajeError("No se encontraron datos para el usuario");
      }
    })
    .catch((error) => {
      mostrarMensajeError("Error al obtener datos del usuario: " + error);
    });
}
