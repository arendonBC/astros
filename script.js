"use strict";

// ==========================
// Constantes Globales
// ==========================

const infoMenor1968 = [
    {
        astro: "Júpiter",
        color: "Azul",
        arcangel: "Michael",
        reySuplente: "Gregorio Vila",
        regidor: "Rasputín",
        virtud: "Creatividad",
        irradia: "Órganos sexuales"
    },
    {
        astro: "Marte",
        color: "Rojo",
        arcangel: "Uriel",
        reySuplente: "Candelario",
        regidor: "Dragón",
        virtud: "Justicia y Fuerza",
        irradia: "Corazón y Sangre"
    },
    {
        astro: "Sol",
        color: "Amarillo",
        arcangel: "Raphael",
        reySuplente: "Saturnino",
        regidor: "El Gato de la Suerte",
        virtud: "Disciplina y Responsabilidad",
        irradia: "Círculo estomacal"
    },
    {
        astro: "Venus",
        color: "Verde",
        arcangel: "Gabriel",
        reySuplente: "San Benito",
        regidor: "San Nicolás",
        virtud: "Amor",
        irradia: "Articulaciones"
    },
    {
        astro: "Mercurio",
        color: "Violeta",
        arcangel: "Urifiel",
        reySuplente: "Luis Marín",
        regidor: "El Mohán",
        virtud: "Verdad y Comunicación",
        irradia: "Vías respiratorias"
    },
    {
        astro: "Luna",
        color: "Blanco",
        arcangel: "Sachariel",
        reySuplente: "Mago Top",
        regidor: "Eloy Perdomo",
        virtud: "Serenidad",
        irradia: "Cabeza"
    },
    {
        astro: "Saturno",
        color: "Negro",
        arcangel: "Samael",
        reySuplente: "Serapio",
        regidor: "Nerón",
        virtud: "Lógica y Matemáticas",
        irradia: "Sistema óseo"
    }
];

const infoMayor1968 = JSON.parse(JSON.stringify(infoMenor1968));
infoMayor1968[0].arcangel = "Emmanuel";
infoMayor1968[1].arcangel = "Aniel";
infoMayor1968[2].arcangel = "Anael";
infoMayor1968[3].arcangel = "Otiel";
infoMayor1968[4].arcangel = "Ariel";
infoMayor1968[5].arcangel = "Azael";
infoMayor1968[6].arcangel = "Shamuel";

const ordenCorrecto = ["Júpiter", "Marte", "Sol", "Venus", "Mercurio", "Luna", "Saturno"];

const astroRigeDia = {
    0: "Júpiter",   // Domingo
    1: "Venus",     // Lunes
    2: "Saturno",   // Martes
    3: "Sol",       // Miércoles
    4: "Luna",      // Jueves
    5: "Marte",     // Viernes
    6: "Mercurio"   // Sábado
};

const colorMapping = {
    "Azul": "#0000FF",   // Azul intenso
    "Rojo": "#FF0000",   // Rojo puro
    "Amarillo": "#FFD700", // Amarillo dorado
    "Verde": "#008000",  // Verde fuerte
    "Violeta": "#8A2BE2", // Violeta eléctrico
    "Blanco": "#FFFFFF",  // Blanco
    "Negro": "#000000"   // Negro puro
};

const textColorMapping = {
    "Azul": "white",
    "Rojo": "white",
    "Amarillo": "black",
    "Verde": "white",
    "Violeta": "black",
    "Blanco": "black",
    "Negro": "white"
};

const simbolosImagenes = ordenCorrecto.reduce((acc, astro) => {
    acc[astro] = `./imagenes/${astro}.png`;
    return acc;
}, {});

// ==========================
// Funciones Auxiliares
// ==========================

/**
 * Convierte una imagen (objeto Image) en una cadena Base64.
 * @param {HTMLImageElement} img 
 * @returns {string} Data URL en formato PNG.
 */
function getBase64Image(img) {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/png");
}

/**
 * Carga las imágenes definidas en simbolosImagenes y las convierte a data URLs.
 * @returns {Promise<Object>} Objeto con claves de astro y valores en data URL.
 */
const cargarImagenes = async () => {
    const imagenesCargadas = {};
    const promesas = Object.entries(simbolosImagenes).map(([astro, ruta]) => {
        return new Promise((resolve) => {
            const img = new Image();
            // Si las imágenes provienen de otro dominio, descomenta la siguiente línea:
            img.crossOrigin = "Anonymous";
            img.src = ruta;
            img.onload = () => {
                const dataUrl = getBase64Image(img);
                imagenesCargadas[astro] = dataUrl;
                resolve();
            };
            img.onerror = () => {
                console.error("Error cargando la imagen:", ruta);
                resolve();
            };
        });
    });
    await Promise.all(promesas);
    return imagenesCargadas;
};

/**
 * Calcula el índice según la función establecida.
 * @param {number} diaSemana 
 * @param {number} hora 
 * @returns {number} Índice calculado.
 */
function calcularIndiceActual(diaSemana, hora) {
    const horasTranscurridas = (diaSemana * 24 + hora - 1 + 168) % 168;
    return horasTranscurridas % 7;
}

/**
 * Convierte la hora en formato AM/PM.
 * @param {number} hora 
 * @param {number} minutos 
 * @returns {string} Hora formateada (ej. "11:35 AM").
 */
function formatoAMPM(hora, minutos) {
    const ampm = hora >= 12 ? "PM" : "AM";
    const hora12 = hora % 12 || 12;
    return `${hora12}:${minutos.toString().padStart(2, '0')} ${ampm}`;
}

/**
 * Devuelve el nombre del día de la semana a partir de su índice.
 * @param {number} indice 
 * @returns {string} Nombre del día.
 */
function obtenerNombreDia(indice) {
    return ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"][indice];
}

/**
 * Devuelve la fecha y hora actuales formateadas para un input datetime-local.
 * @returns {string} Formato "YYYY-MM-DDTHH:MM"
 */
const getCurrentDateTimeString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// ==========================
// Funciones de la Aplicación
// ==========================

/**
 * Genera la tabla y la vista responsiva con la información.
 */
const generarTabla = async () => {
    const nombre = document.getElementById("nombre").value;
    const fechaInput = document.getElementById("fecha").value;
    if (!nombre || !fechaInput) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const fecha = new Date(fechaInput);
    const anio = fecha.getFullYear();
    const diaSeleccionado = fecha.getDay();
    const hora = fecha.getHours();
    const minutos = fecha.getMinutes();
    const horaCompleta = formatoAMPM(hora, minutos);
    const fechaNacimiento = `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${anio}`;
    const primerDiaMes = new Date(anio, fecha.getMonth(), 1).getDay();
    const primerDiaAnio = new Date(anio, 0, 1).getDay();
    const informacionActual = anio < 1968 ? infoMenor1968 : infoMayor1968;

    // Los "dias" que se mostrarán en la tabla:
    const dias = [
        { tipo: "Año", diaSemana: primerDiaAnio },
        { tipo: "Mes", diaSemana: primerDiaMes },
        { tipo: "Día", diaSemana: fecha.getDay() },
        { tipo: "Hora", diaSemana: diaSeleccionado }
    ];

    let tablaHTML = `
        <h2>${nombre}</h2>
        <h3>Fecha de Nacimiento: <strong>${fechaNacimiento}</strong></h3>
        <h4>Hora de Nacimiento: <strong>${horaCompleta}</strong></h4>
        <table class="normal-table">
            <tr>
                <th>Día</th>
                <th>Astro</th>
                <th>Color</th>
                <th>Arcángel</th>
                <th>Rey Suplente</th>
                <th>Regidor</th>
                <th>Virtud</th>
                <th>Irradia</th>
                <th>Símbolo</th>
            </tr>
    `;
    let tablaResponsiveHTML = `<div class="responsive-table">`;
    const imagenes = await cargarImagenes();

    dias.forEach(({ tipo, diaSemana }, index) => {
        let astro;
        // Para la fila de tipo "Hora" usamos el cálculo con la hora;
        // para los demás, usamos el mapeo fijo según el día.
        if (tipo === "Hora") {
            const indice = calcularIndiceActual(diaSemana, hora);
            astro = ordenCorrecto[indice];
        } else {
            astro = astroRigeDia[diaSemana];
        }
        
        const infoActual = informacionActual.find(info => info.astro === astro);
        if (!infoActual) {
            console.error(`No se encontró información para el astro: ${astro}`);
            return;
        }

        // En la fila "Hora" se muestra la hora; en las demás, el nombre del día.
        const diaCell = (tipo === "Hora") ? horaCompleta : obtenerNombreDia(diaSemana);
        // Solo en la fila "Hora" se agrega "Ángel Guía" debajo del arcángel.
        const arcangelContent = (tipo === "Hora")
            ? `${infoActual.arcangel}<br><small> (Ángel Guía) </small>`
            : infoActual.arcangel;

        // Genera la fila de la tabla con background y color de texto
        tablaHTML += `
            <tr style="background-color: ${colorMapping[infoActual.color]}; color: ${textColorMapping[infoActual.color]};">
                <td><strong>${tipo}:</strong> ${diaCell}</td>
                <td>${infoActual.astro}</td>
                <td>${infoActual.color}</td>
                <td>${arcangelContent}</td>
                <td>${infoActual.reySuplente}</td>
                <td>${infoActual.regidor}</td>
                <td>${infoActual.virtud}</td>
                <td>${infoActual.irradia}</td>
                <td>
                    <img src="${simbolosImagenes[infoActual.astro]}" alt="${infoActual.astro}" width="20">
                </td>
            </tr>
        `;
        // Genera el bloque para la vista responsiva (mobile)
        tablaResponsiveHTML += `
            <div class="entry" style="background-color: ${colorMapping[infoActual.color]}; color: ${textColorMapping[infoActual.color]};">
                <div><strong>${tipo}:</strong> ${diaCell}</div>
                <div><strong>Astro:</strong> ${infoActual.astro}</div>
                <div><strong>Color:</strong> ${infoActual.color}</div>
                <div><strong>Arcángel:</strong> ${arcangelContent}</div>
                <div><strong>Rey Suplente:</strong> ${infoActual.reySuplente}</div>
                <div><strong>Regidor:</strong> ${infoActual.regidor}</div>
                <div><strong>Virtud:</strong> ${infoActual.virtud}</div>
                <div><strong>Irradia:</strong> ${infoActual.irradia}</div>
                <div><strong>Símbolo:</strong>
                    <img src="${simbolosImagenes[infoActual.astro]}" alt="${infoActual.astro}" width="20">
                </div>
            </div>
        `;
    });

    tablaHTML += `</table>`;
    tablaResponsiveHTML += `</div>`;

    document.getElementById("resultado").innerHTML = tablaHTML + tablaResponsiveHTML + `
        <button onclick="guardarInformacion()">Guardar Información</button>
        <button onclick="volverADigitar()">Volver a digitar</button>
    `;
    document.getElementById("inputDiv").style.display = "none";
    document.getElementById("resultado").style.display = "block";
};

/**
 * Reinicia la vista para volver a digitar.
 */
const volverADigitar = () => {
    document.getElementById("inputDiv").style.display = "block";
    document.getElementById("resultado").style.display = "none";
    document.getElementById("resultado").innerHTML = "";
};

/**
 * Genera el PDF usando jsPDF y autoTable, incluyendo las imágenes.
 */
const guardarInformacion = async () => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');

    const nombre = document.querySelector("#resultado h2").innerText;
    const nombreArchivo = nombre.split(' ')[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

    const fechaNacimiento = document.querySelector("#resultado h3").innerText;
    const horaNacimiento = document.querySelector("#resultado h4").innerText;
    const table = document.querySelector(".normal-table");

    pdf.setFont("Helvetica", "bold");
    pdf.setFontSize(16);
    const pageWidth = pdf.internal.pageSize.getWidth();

    let textWidth = pdf.getTextWidth(nombre);
    let textX = (pageWidth - textWidth) / 2;
    pdf.text(nombre, textX, 20);

    pdf.setFontSize(14);
    textWidth = pdf.getTextWidth(fechaNacimiento);
    textX = (pageWidth - textWidth) / 2;
    pdf.text(fechaNacimiento, textX, 30);

    textWidth = pdf.getTextWidth(horaNacimiento);
    textX = (pageWidth - textWidth) / 2;
    pdf.text(horaNacimiento, textX, 40);

    const imagenes = await cargarImagenes();
    const headers = Array.from(table.querySelectorAll("th")).map(th => th.innerText);
    const rows = Array.from(table.querySelectorAll("tr")).slice(1).map(tr =>
        Array.from(tr.querySelectorAll("td")).map(td => td.innerText)
    );

    const startY = 50;
    pdf.autoTable({
        head: [headers],
        body: rows,
        startY: startY,
        styles: { font: "helvetica", fontStyle: "normal" },
        didDrawCell: function(data) {
            if (data.column.index === 8) {
                const astro = data.row.raw[1];
                const dataUrl = imagenes[astro];
                if (dataUrl) {
                    pdf.addImage(dataUrl, "PNG", data.cell.x + 2, data.cell.y + 2, 6, 6);
                }
            }
        }
    });

    pdf.save(`${nombreArchivo}.pdf`);
};

// ==========================
// Inicialización al cargar el DOM
// ==========================
document.addEventListener("DOMContentLoaded", () => {
    // Establece los valores por defecto: en este caso, el nombre fijo y la fecha/hora actuales.
    document.getElementById("fecha").value = getCurrentDateTimeString();
    // document.getElementById("nombre").value = "Agustín Rendón Cadavid";
    // document.getElementById("fecha").value = "2024-05-30T17:28";
    // document.getElementById("nombre").value = "Alexis David Rendón Chica";
    // document.getElementById("fecha").value = "1992-10-29T11:35";
});
