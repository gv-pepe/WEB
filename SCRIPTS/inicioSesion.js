import {ref, db, get, set} from "./FirebaseConfig.js";
//Colocar aqui Rutas dependiendo el rol 
var rutaEstudiante = "/FORMULARIO/Estudiante.html";
var rutaMaestro = "/FORMULARIO/generador.html";

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
          return false;
        }
      } else {
        console.log("No se encontraron datos para la clave ingresada.");
        return false; 
      }
    })
    .catch((error) => {
      console.error("Error al buscar elemento:", error);
      return false; 
    });
}


document.getElementById("iniciar").addEventListener("click", function () {
  var nombre = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  buscarElementoPorClave(nombre, password).then((resultado) => {
    if (resultado) {
      // Los datos coinciden, hacer algo en consecuencia (por ejemplo, redirigir a otra página)
      console.log("Inicio de sesión exitoso");
    } else {
      // Los datos no coinciden, mostrar un mensaje de error o tomar otras acciones
      console.log("Inicio de sesión fallido");
    }
  });
});

document.getElementById("login-form").addEventListener("submit", function (event) {
  event.preventDefault();

  var nombre = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  buscarElementoPorClave(nombre, password).then((resultado) => {
    if (resultado) {
      // Redirigir a la página adecuada dependiendo del rol
      redirigirSegunRol(nombre);
    } else {
      console.log("Inicio de sesión fallido");
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
          console.log("Rol desconocido");
        }
      } else {
        console.log("No se encontraron datos para el usuario.");
      }
    })
    .catch((error) => {
      console.error("Error al obtener datos del usuario:", error);
    });
}



