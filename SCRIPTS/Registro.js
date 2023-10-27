import {ref, db, get, set} from "./FirebaseConfig.js";
document.getElementById("crear").addEventListener("click", function(e){
    e.preventDefault();
    const contrasena1= document.getElementById("contra").value;
    const contrasena2 = document.getElementById("confirm").value;
    if(contrasena1  != contrasena2){
      document.getElementById('contra').style.borderColor = 'red';
      document.getElementById('confirm').style.borderColor = 'red';
      document.getElementById('contra').style.backgroundColor = '#ffd0d0';
      document.getElementById('confirm').style.backgroundColor = '#ffd0d0';
    }else{
        registrar();
    }
});

const registrar = () => {
  const nombre = document.getElementById("name").value;
  const clave = document.getElementById("contra").value;
  const correo = document.getElementById("correo").value;
  const estudianteCheckbox = document.getElementById("estudiante");
  const maestroCheckbox = document.getElementById("maestro");
  let rol = "";

  if (estudianteCheckbox.checked) {
    rol = "Estudiante";
  } else if (maestroCheckbox.checked) {
    rol = "Maestro";
  }

  const usuarioRef = ref(db, "usuario/" + nombre);

  // Utiliza set con los valores que deseas guardar en Firebase
  set(usuarioRef, {
    nombre: nombre,
    clave: clave,
    correo: correo,
    rol: rol // Agrega el campo "rol" con el valor seleccionado
  })
    .then(() => {
      alert("Registrado Correctamente");
      window.location.href = "/index.html";
    })
    .catch((error) => {
      console.error("Error al registrar en Firebase:", error);
      alert("Error al registrar en Firebase");
    });
};






