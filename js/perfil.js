document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('sesionActiva') !== 'true') {
        alert("Acceso denegado. Debe iniciar sesión para ver su perfil.");
        window.location.href = "login.html";
    }
});