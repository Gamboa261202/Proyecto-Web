document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formEgresados');
    const inputNombre = document.getElementById('nombre');
    const inputCedula = document.getElementById('cedula');
    const inputTelefono = document.getElementById('telefono');
    const inputCorreo = document.getElementById('correoEgresado');
    const inputContrasena = document.getElementById('contrasena');
    const botonSubmit = formulario.querySelector('button[type="submit"]');
    const cuerpoTabla = document.getElementById('cuerpoTablaEgresados');

    const errorNombre = document.getElementById('errorNombre');
    const errorCedula = document.getElementById('errorCedula');
    const errorTelefono = document.getElementById('errorTelefono');
    const errorCorreo = document.getElementById('errorCorreoEgresado');
    const errorContrasena = document.getElementById('errorContrasena');

    let indiceEdicion = -1;

    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/;
    const regexCedula = /^[1-9]-\d{4}-\d{4}$/;
    const regexTelefono = /^[24678]\d{7}$/;
    const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const regexContrasena = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;


    function obtenerListaStorage() {
        return JSON.parse(localStorage.getItem('listaEgresados')) || [];
    }

    function guardarListaStorage(lista) {
        localStorage.setItem('listaEgresados', JSON.stringify(lista));
    }
    function renderizarTabla() {
        const lista = obtenerListaStorage();
        cuerpoTabla.innerHTML = ''; 

        if (lista.length === 0) {
            cuerpoTabla.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; color: #777;">
                        No hay egresados registrados aún.
                    </td>
                </tr>`;
            console.log("--- LOCAL STORAGE VACÍO ---");
            return;
        }

        lista.forEach((egresado, index) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${egresado.nombre}</td>
                <td>${egresado.cedula}</td>
                <td>${egresado.telefono}</td>
                <td>${egresado.correo}</td>
                <td>
                    <button type="button" class="btn-accion btn-editar" data-index="${index}">✏️ Editar</button>
                    <button type="button" class="btn-accion btn-eliminar" data-index="${index}">🗑️ Eliminar</button>
                </td>
            `;
            cuerpoTabla.appendChild(fila);
        });
        document.querySelectorAll('.btn-editar').forEach(boton => {
            boton.addEventListener('click', (e) => cargarParaEditar(e.target.dataset.index));
        });

        document.querySelectorAll('.btn-eliminar').forEach(boton => {
            boton.addEventListener('click', (e) => borrarRegistro(e.target.dataset.index));
        });

        console.log("--- LISTA ACTUALIZADA EN CONSOLA ---", lista);
    }

    function borrarRegistro(index) {
        if (confirm("¿Está seguro de que desea eliminar este registro?")) {
            let lista = obtenerListaStorage();
            lista.splice(index, 1); // Remueve el elemento en esa posición
            guardarListaStorage(lista);
            renderizarTabla();
            alert("Registro eliminado exitosamente.");
        }
    }
    function cargarParaEditar(index) {
        const lista = obtenerListaStorage();
        const egresado = lista[index];

        inputNombre.value = egresado.nombre;
        inputCedula.value = egresado.cedula;
        inputTelefono.value = egresado.telefono;
        inputCorreo.value = egresado.correo;
        inputContrasena.value = egresado.contrasena || '';

        indiceEdicion = index;
        botonSubmit.textContent = "Actualizar Registro";
        botonSubmit.style.backgroundColor = "#e67e22"; 
        
        formulario.scrollIntoView({ behavior: 'smooth' });
    }
    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();

        let formularioValido = true;

        if (!regexNombre.test(inputNombre.value.trim())) {
            errorNombre.textContent = "Nombre inválido (mínimo 3 letras).";
            formularioValido = false;
        } else { errorNombre.textContent = ""; }

        if (!regexCedula.test(inputCedula.value.trim())) {
            errorCedula.textContent = "Formato de cédula inválido (Ej: 1-1234-5678).";
            formularioValido = false;
        } else { errorCedula.textContent = ""; }

        if (!regexTelefono.test(inputTelefono.value.trim())) {
            errorTelefono.textContent = "Teléfono inválido (debe tener 8 dígitos).";
            formularioValido = false;
        } else { errorTelefono.textContent = ""; }

        if (!regexCorreo.test(inputCorreo.value.trim())) {
            errorCorreo.textContent = "Formato de correo electrónico inválido.";
            formularioValido = false;
        } else { errorCorreo.textContent = ""; }

        if (inputContrasena.value.trim() !== "" && !regexContrasena.test(inputContrasena.value)) {
            errorContrasena.textContent = "La contraseña debe tener mín. 8 caracteres, letras y números.";
            formularioValido = false;
        } else { errorContrasena.textContent = ""; }

        if (formularioValido) {
            let lista = obtenerListaStorage();

            const datosEgresado = {
                nombre: inputNombre.value.trim(),
                cedula: inputCedula.value.trim(),
                telefono: inputTelefono.value.trim(),
                correo: inputCorreo.value.trim(),
                contrasena: inputContrasena.value
            };

            if (indiceEdicion === -1) {
                lista.push(datosEgresado);
                alert("¡Egresado registrado con éxito!");
            } else {
                lista[indiceEdicion] = datosEgresado;
                indiceEdicion = -1; // Resetear modo
                botonSubmit.textContent = "Guardar en Sistema";
                botonSubmit.style.backgroundColor = ""; // Restaurar color CSS original
                alert("¡Registro actualizado correctamente!");
            }

            guardarListaStorage(lista);
            formulario.reset();
            renderizarTabla();
        }
    });

    renderizarTabla();
});