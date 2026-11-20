const API_URL = "http://localhost:8080/servicio";

// ---------- Utilidades ----------
function leerFormulario() {
    return {
        documento: document.getElementById("id").value.trim(),
        nombre: document.getElementById("nombre").value.trim(),
        telefono: document.getElementById("telefono").value.trim(),
        edad: Number(document.getElementById("edad").value) || 0,
        profesion: document.getElementById("profesion").value.trim(),
        password: document.getElementById("password").value,
        tipo: Number(document.getElementById("tipo").value) || 0
    };
}

function llenarFormulario(p) {
    document.getElementById("id").value = p.documento || "";
    document.getElementById("nombre").value = p.nombre || "";
    document.getElementById("telefono").value = p.telefono || "";
    document.getElementById("edad").value = p.edad || "";
    document.getElementById("profesion").value = p.profesion || "";
    document.getElementById("password").value = p.password || "";
    document.getElementById("tipo").value = p.tipo || "";
}

function limpiarFormulario() {
    llenarFormulario({});
}

async function manejarRespuesta(respuesta) {
    if (!respuesta.ok) {
        const mensaje = await respuesta.text();
        throw new Error(mensaje || `Error ${respuesta.status}`);
    }
    const tipo = respuesta.headers.get("content-type") || "";
    return tipo.includes("application/json") ? respuesta.json() : respuesta.text();
}

// ---------- BUSCAR ----------
async function obtenerPersona() {
    const documento = document.getElementById("id").value.trim();
    if (!documento) {
        alert("Por favor, ingresa un documento válido.");
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/personas/${encodeURIComponent(documento)}`);
        const persona = await manejarRespuesta(respuesta);
        llenarFormulario(persona);
        console.log("Persona encontrada:", persona);
    } catch (error) {
        console.error("Error al obtener la persona:", error);
        alert("Problema al buscar la persona: " + error.message);
    }
}

// ---------- REGISTRAR ----------
async function registrarPersona() {
    const persona = leerFormulario();
    if (!persona.documento || !persona.nombre) {
        alert("Documento y nombre son obligatorios.");
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/guardar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(persona)
        });
        await manejarRespuesta(respuesta);
        alert("Persona registrada correctamente.");
        limpiarFormulario();
    } catch (error) {
        console.error("Error al registrar:", error);
        alert("No se pudo registrar: " + error.message);
    }
}

// ---------- ACTUALIZAR ----------
async function actualizarPersona() {
    const persona = leerFormulario();
    if (!persona.documento) {
        alert("Ingresa el documento de la persona a actualizar.");
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/atualizar`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(persona)
        });
        await manejarRespuesta(respuesta);
        alert("Persona actualizada correctamente.");
    } catch (error) {
        console.error("Error al actualizar:", error);
        alert("No se pudo actualizar: " + error.message);
    }
}

// ---------- ELIMINAR ----------
async function eliminarPersona() {
    const documento = document.getElementById("id").value.trim();
    if (!documento) {
        alert("Ingresa el documento de la persona a eliminar.");
        return;
    }
    if (!confirm(`¿Eliminar a la persona con documento ${documento}?`)) return;

    try {
        const respuesta = await fetch(`${API_URL}/borral/${encodeURIComponent(documento)}`, {
            method: "DELETE"
        });
        await manejarRespuesta(respuesta);
        alert("Persona eliminada.");
        limpiarFormulario();
    } catch (error) {
        console.error("Error al eliminar:", error);
        alert("No se pudo eliminar: " + error.message);
    }
}

// ---------- LISTAR ----------
async function obtenerListaPersonas() {
    try {
        const respuesta = await fetch(`${API_URL}/personas-lista`);
        const lista = await manejarRespuesta(respuesta);

        const tabla = document.getElementById("tablaPersonas");
        const cuerpo = tabla.querySelector("tbody");
        cuerpo.innerHTML = "";

        lista.forEach(p => {
            const fila = document.createElement("tr");
            [p.documento, p.nombre, p.telefono, p.edad, p.profesion, p.tipo].forEach(valor => {
                const celda = document.createElement("td");
                celda.textContent = valor ?? "";
                fila.appendChild(celda);
            });
            cuerpo.appendChild(fila);
        });

        tabla.style.display = "table";
    } catch (error) {
        console.error("Error al listar:", error);
        alert("No se pudo obtener la lista: " + error.message);
    }
}