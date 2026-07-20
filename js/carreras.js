document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formCarreras');
    const inputCodigo = document.getElementById('codigoCarrera');
    const inputNombre = document.getElementById('nombreCarrera');
    const inputIcono = document.getElementById('iconoCarrera');
    const inputDescripcion = document.getElementById('descripcionCarrera');
    const botonSubmit = formulario.querySelector('button[type="submit"]');
    const cuerpoTabla = document.getElementById('cuerpoTablaCarreras');

    const errorCodigo = document.getElementById('errorCodigoCarrera');
    const errorNombre = document.getElementById('errorNombreCarrera');
    const errorIcono = document.getElementById('errorIconoCarrera');
    const errorDescripcion = document.getElementById('errorDescripcionCarrera');

    let indiceEdicion = -1;
    const regexCodigo = /^[A-Z]{3}-\d{3}$/; // Formato obligatorio: 3 Letras mayúsculas - 3 Números (Ej: CAR-101)
    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{4,50}$/;
    const carrerasIniciales = [
        { codigo: "CAR-101", nombre: "Desarrollo de Software", icono: "💻", descripcion: "Diseño y construcción de software robusto." },
        { codigo: "CAR-102", nombre: "Ciberseguridad", icono: "🛡️", descripcion: "Protección de entornos digitales y redes." },
        { codigo: "CAR-103", nombre: "Desarrollo de Videojuegos", icono: "🎮", descripcion: "Creación de experiencias interactivas y motores 3D." },
        { codigo: "CAR-104", nombre: "Ciencia de Datos", icono: "📊", descripcion: "Análisis estadístico e Inteligencia Artificial." },
        { codigo: "CAR-105", nombre: "Sistemas de Información", icono: "☁️", descripcion: "Administración de infraestructura y nube." }
    ];
    function obtenerCarrerasStorage() {
        const datos = localStorage.getItem('listaCarreras');
        if (!datos) {
            localStorage.setItem('listaCarreras', JSON.stringify(carrerasIniciales));
            return carrerasIniciales;
        }
        return JSON.parse(datos);
    }

    function guardarCarrerasStorage(lista) {
        localStorage.setItem('listaCarreras', JSON.stringify(lista));
    }
    function renderizarTabla() {
        const lista = obtenerCarrerasStorage();
        cuerpoTabla.innerHTML = '';

        if (lista.length === 0) {
            cuerpoTabla.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; color: #777;">
                        No hay carreras registradas actualmente.
                    </td>
                </tr>`;
            return;
        }

        lista.forEach((carrera, index) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td style="font-size: 1.5rem; text-align: center;">${carrera.icono || '🎓'}</td>
                <td><strong>${carrera.codigo}</strong></td>
                <td>${carrera.nombre}</td>
                <td>${carrera.descripcion}</td>
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
            boton.addEventListener('click', (e) => borrarCarrera(e.target.dataset.index));
        });

        console.log("--- CARRERAS EN LOCAL STORAGE ---", lista);
    }
    function borrarCarrera(index) {
        if (confirm("¿Desea eliminar esta carrera de la oferta académica?")) {
            let lista = obtenerCarrerasStorage();
            lista.splice(index, 1);
            guardarCarrerasStorage(lista);
            renderizarTabla();
            alert("Carrera eliminada exitosamente.");
        }
    }
    function cargarParaEditar(index) {
        const lista = obtenerCarrerasStorage();
        const carrera = lista[index];

        inputCodigo.value = carrera.codigo;
        inputNombre.value = carrera.nombre;
        inputIcono.value = carrera.icono;
        inputDescripcion.value = carrera.descripcion;

        indiceEdicion = index;
        botonSubmit.textContent = "Actualizar Carrera";
        botonSubmit.style.backgroundColor = "#e67e22";

        formulario.scrollIntoView({ behavior: 'smooth' });
    }
    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();

        let esValido = true;
        if (!regexCodigo.test(inputCodigo.value.trim().toUpperCase())) {
            errorCodigo.textContent = "Formato requerido: 3 letras mayúsculas, guión y 3 números (Ej: CAR-101).";
            esValido = false;
        } else { errorCodigo.textContent = ""; }
        if (!regexNombre.test(inputNombre.value.trim())) {
            errorNombre.textContent = "El nombre de la carrera debe tener al menos 4 letras.";
            esValido = false;
        } else { errorNombre.textContent = ""; }
        if (inputDescripcion.value.trim().length < 5) {
            errorDescripcion.textContent = "Ingrese una descripción de al menos 5 caracteres.";
            esValido = false;
        } else { errorDescripcion.textContent = ""; }

        if (esValido) {
            let lista = obtenerCarrerasStorage();

            const nuevaCarrera = {
                codigo: inputCodigo.value.trim().toUpperCase(),
                nombre: inputNombre.value.trim(),
                icono: inputIcono.value.trim() || '🎓',
                descripcion: inputDescripcion.value.trim()
            };

            if (indiceEdicion === -1) {
                lista.push(nuevaCarrera);
                alert("¡Carrera agregada exitosamente!");
            } else {
                lista[indiceEdicion] = nuevaCarrera;
                indiceEdicion = -1;
                botonSubmit.textContent = "Guardar Carrera";
                botonSubmit.style.backgroundColor = "";
                alert("¡Carrera actualizada correctamente!");
            }

            guardarCarrerasStorage(lista);
            formulario.reset();
            renderizarTabla();
        }
    });
    renderizarTabla();
});