document.addEventListener('DOMContentLoaded', () => {
    
    
    const formulario = document.getElementById('formLogin');
    const inputCorreo = document.getElementById('correo');
    const inputContrasena = document.getElementById('contrasena');

    
    const errorCorreo = document.getElementById('errorCorreo');
    const errorContrasena = document.getElementById('errorContrasena');

    
    const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    
    const regexContrasena = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    
    formulario.addEventListener('submit', (evento) => {
       
        evento.preventDefault();

        
        let formularioValido = true;

        
        if (inputCorreo.value.trim() === "") {
            errorCorreo.textContent = "El correo electrónico es obligatorio.";
            formularioValido = false;
        } else if (!regexCorreo.test(inputCorreo.value.trim())) {
            errorCorreo.textContent = "Por favor, ingrese un formato de correo válido (ejemplo@dominio.com).";
            formularioValido = false;
        } else {
            errorCorreo.textContent = ""; 
        }

        
        if (inputContrasena.value.trim() === "") {
            errorContrasena.textContent = "La contraseña es obligatoria.";
            formularioValido = false;
        } else if (!regexContrasena.test(inputContrasena.value)) {
            errorContrasena.textContent = "La contraseña debe tener al menos 8 caracteres, incluyendo letras y números.";
            formularioValido = false;
        } else {
            errorContrasena.textContent = ""; 
        }

        
        if (formularioValido) {
            alert("¡Validación exitosa! Iniciando sesión...");
            sessionStorage.setItem('sesionActiva', 'true');
            window.location.href = "perfil.html";
        }
    });
});