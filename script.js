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

// ---- Orden de los astros según el año de nacimiento ----

// Para nacidos a partir de 1968
const ordenCorrectoMayor1968 = ["Júpiter", "Marte", "Sol", "Venus", "Mercurio", "Luna", "Saturno"];

// Para nacidos antes de 1968
const ordenCorrectoMenor1967 = ["Sol", "Venus", "Mercurio", "Luna", "Saturno", "Júpiter", "Marte"];

// ---- Astro que rige el día según el año de nacimiento ----

// Para nacidos a partir de 1968
const astroRigeDiaMayor1968 = {
    0: "Júpiter",   // Domingo
    1: "Venus",     // Lunes
    2: "Saturno",   // Martes
    3: "Sol",       // Miércoles
    4: "Luna",      // Jueves
    5: "Marte",     // Viernes
    6: "Mercurio"   // Sábado
};

// Para nacidos antes de 1968
const astroRigeDiaMenor1967 = {
    0: "Sol",       // Domingo
    1: "Luna",      // Lunes
    2: "Marte",     // Martes
    3: "Mercurio",  // Miércoles
    4: "Júpiter",   // Jueves
    5: "Venus",     // Viernes
    6: "Saturno"    // Sábado
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
    "Violeta": "white",
    "Blanco": "black",
    "Negro": "white"
};

const simbolosImagenes = (function() {
    // Se usa un orden fijo para definir la ruta de cada imagen.
    const orden = ["Júpiter", "Marte", "Sol", "Venus", "Mercurio", "Luna", "Saturno"];
    return orden.reduce((acc, astro) => {
        acc[astro] = `./img/${astro}.png`;
        return acc;
    }, {});
})();

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
function generarTabla() {
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
    
    // Seleccionar la información astrológica y mapeos según el año
    const informacionActual = anio < 1968 ? infoMenor1968 : infoMayor1968;
    const ordenCorrectoActual = anio < 1968 ? ordenCorrectoMenor1967 : ordenCorrectoMayor1968;
    const astroRigeDiaActual = anio < 1968 ? astroRigeDiaMenor1967 : astroRigeDiaMayor1968;

    // Los "dias" que se mostrarán en la tabla:
    const dias = [
        { tipo: "Año", diaSemana: primerDiaAnio },
        { tipo: "Mes", diaSemana: primerDiaMes },
        { tipo: "Día", diaSemana: diaSeleccionado },
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

    cargarImagenes().then(imagenes => {

        dias.forEach(({ tipo, diaSemana }) => {
            let astro;
            // Para la fila "Hora" se utiliza el cálculo con la hora;
            // para los demás se usa el mapeo fijo según el día.
            if (tipo === "Hora") {
                const indice = calcularIndiceActual(diaSemana, hora);
                astro = ordenCorrectoActual[indice];
            } else {
                astro = astroRigeDiaActual[diaSemana];
            }
            
            const infoActual = informacionActual.find(info => info.astro === astro);
            if (!infoActual) {
                console.error(`No se encontró información para el astro: ${astro}`);
                return;
            }

            const diaCell = (tipo === "Hora") ? horaCompleta : obtenerNombreDia(diaSemana);
            const arcangelContent = (tipo === "Hora")
                ? `${infoActual.arcangel}<br><small> (Ángel Guía) </small>`
                : infoActual.arcangel;

            // Fila de la tabla para versión escritorio
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
            // Bloque para la vista responsiva (mobile)
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

        document.getElementById("resultado").innerHTML = tablaHTML + tablaResponsiveHTML;
        document.getElementById("botones").innerHTML = `
            <button onclick="guardarInformacionPNG()">Guardar Foto</button>
            <button onclick="guardarInformacion()">Guardar PDF</button>
            <button onclick="volverADigitar()">Volver a digitar</button>
        `;
        document.getElementById("inputDiv").style.display = "none";
        document.getElementById("resultado").style.display = "block";
        document.getElementById("botones").style.display = "block";
    });
}

/**
 * Reinicia la vista para volver a digitar.
 */
function volverADigitar() {
    document.getElementById("inputDiv").style.display = "block";
    document.getElementById("resultado").style.display = "none";
    document.getElementById("botones").style.display = "none";
    document.getElementById("resultado").innerHTML = "";
}

/**
 * Genera el PDF usando jsPDF y autoTable, incluyendo las imágenes.
 */
const guardarInformacion = async () => {
  try {
    // Inicialización del documento PDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Detección de dispositivo móvil (ancho ≤ 768px)
    const isMobile = window.innerWidth <= 768;

    // ============================================================
    // Extracción de encabezados y configuración de tamaños de fuente
    // ============================================================
    const headerContainer = document.querySelector("#resultado");
    if (!headerContainer) {
      console.error("No se encontró el contenedor de resultado (#resultado).");
      return;
    }
    const nombreEl = headerContainer.querySelector("h2");
    const fechaNacimientoEl = headerContainer.querySelector("h3");
    const horaNacimientoEl = headerContainer.querySelector("h4");

    if (!nombreEl || !fechaNacimientoEl || !horaNacimientoEl) {
      console.error("Faltan algunos de los elementos de encabezado (h2, h3, h4).");
      return;
    }

    const nombre = nombreEl.innerText;
    const fechaNacimiento = fechaNacimientoEl.innerText;
    const horaNacimiento = horaNacimientoEl.innerText;

    // Definir tamaños de fuente según dispositivo
    const headerFontSize = {
      h2: isMobile ? 14 : 16,
      h3: isMobile ? 12 : 14,
      h4: isMobile ? 10 : 14
    };

    // Función auxiliar para dibujar texto centrado
    const drawCenteredText = (text, y, fontSize, fontStyle = "bold") => {
      pdf.setFont("Helvetica", fontStyle);
      pdf.setFontSize(fontSize);
      const textWidth = pdf.getTextWidth(text);
      const textX = (pageWidth - textWidth) / 2;
      pdf.text(text, textX, y);
    };

    // Dibujar los encabezados
    drawCenteredText(nombre, 20, headerFontSize.h2);
    drawCenteredText(fechaNacimiento, 30, headerFontSize.h3);
    drawCenteredText(horaNacimiento, 40, headerFontSize.h4);

    // ============================================================
    // Cargar imágenes (se asume que la función cargarImagenes existe)
    // ============================================================
    const imagenes = await cargarImagenes();

    // ============================================================
    // Funciones auxiliares para conversión de colores
    // ============================================================
    const colorNameToHex = (name) => {
      const map = {
        white: "#FFFFFF",
        black: "#000000"
      };
      return map[name.toLowerCase()] || name;
    };

    const hexToRgb = (hex) => {
      let cleanedHex = hex.replace('#', '');
      if (cleanedHex.length === 3) {
        cleanedHex = cleanedHex.split('').map(ch => ch + ch).join('');
      }
      const bigint = parseInt(cleanedHex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return [r, g, b];
    };

    // ============================================================
    // Generación de contenido según el tipo de dispositivo
    // ============================================================
    if (isMobile) {
      // ===============================
      // Versión Mobile
      // ===============================
      const entries = Array.from(document.querySelectorAll(".responsive-table .entry"));
      const boxWidth = pageWidth * 0.4; // 40% del ancho de la página
      const boxX = (pageWidth - boxWidth) / 2; // Centrado horizontalmente
      let currentY = 50; // Posición vertical inicial

      // Configuración de estilos para cada cuadro
      const topPadding = 2;
      const leftPadding = 2;
      const lineHeight = 5;

      entries.forEach((entry) => {
        // Obtener los divs hijos que contienen la información (en orden)
        const divs = Array.from(entry.querySelectorAll('div'));
        // Calcular la altura total del cuadro
        const boxHeight = divs.length * lineHeight + 2 * topPadding;

        // Extraer el color (desde el div que comienza con "Color:")
        const colorDiv = divs.find(div => div.innerText.trim().startsWith("Color:"));
        let colorName = "Blanco"; // Valor por defecto
        if (colorDiv) {
          colorName = colorDiv.innerText.split(":")[1].trim();
        }
        // Se asume que existen los mapeos globales "colorMapping" y "textColorMapping"
        const bgColor = colorMapping[colorName] || "#FFFFFF";
        const txtColorName = textColorMapping[colorName] || "black";
        const txtColor = colorNameToHex(txtColorName);

        // Dibujar el fondo del cuadro
        pdf.setFillColor(bgColor);
        pdf.rect(boxX, currentY, boxWidth, boxHeight, 'F');

        // Dibujar el borde del cuadro (1px solid #dfdfdf)
        pdf.setDrawColor("#dfdfdf");
        pdf.setLineWidth(0.5);
        pdf.rect(boxX, currentY, boxWidth, boxHeight, 'S');

        // Configurar el color del texto
        const [r, g, b] = hexToRgb(txtColor);
        pdf.setTextColor(r, g, b);
        pdf.setFont("Helvetica", "normal");
        pdf.setFontSize(10);

        // Procesar cada línea (cada div)
        divs.forEach((div, i) => {
          const textY = currentY + topPadding + lineHeight * (i + 1) - 1;
          const textX = boxX + leftPadding;

          const imgElement = div.querySelector('img');
          if (imgElement) {
            // Se asume que existe un <strong> con el texto (ejemplo: "Símbolo:")
            const strongEl = div.querySelector('strong');
            const textPart = strongEl ? strongEl.innerText.trim() : "";
            pdf.text(textPart, textX, textY);
            const txtWidth = pdf.getTextWidth(textPart);
            // Alinear la imagen (5×5 mm) verticalmente con un offset fijo
            const imageY = textY - 3.5;
            // Dibujar fondo para el símbolo con color #f5f5dc
            pdf.setFillColor("#f5f5dc");
            pdf.rect(textX + txtWidth + 1, imageY, 5, 5, 'F');
            // Agregar la imagen encima
            const astroName = imgElement.alt;
            const dataUrl = imagenes[astroName];
            if (dataUrl) {
              pdf.addImage(dataUrl, "PNG", textX + txtWidth + 1, imageY, 5, 5);
            }
            // Restaurar el color de relleno para las siguientes líneas
            pdf.setFillColor(bgColor);
          } else {
            const text = div.innerText.replace(/\n/g, ' ');
            pdf.text(text, textX, textY);
          }
        });

        // Actualizar la posición vertical para el siguiente cuadro
        currentY += boxHeight + 5;
        if (currentY > pdf.internal.pageSize.getHeight() - 20) {
          pdf.addPage();
          currentY = 20;
        }
      });
    } else {
      // ===============================
      // Versión Desktop con autoTable
      // ===============================
      const table = document.querySelector(".normal-table");
      if (!table) {
        console.error("No se encontró la tabla (.normal-table).");
        return;
      }
      // Obtener filas y encabezados del HTML
      const htmlRows = Array.from(table.querySelectorAll("tr")).slice(1);
      const headers = Array.from(table.querySelectorAll("th")).map(th => th.innerText);
      const rows = htmlRows.map(tr => {
        const cells = Array.from(tr.querySelectorAll("td"));
        // Se omite el contenido de la columna 8 (índice 8)
        return cells.map((td, index) => (index === 8 ? "" : td.innerText));
      });

      const startY = 50;
      pdf.autoTable({
        head: [headers],
        body: rows,
        startY: startY,
        headStyles: {
          fillColor: '#7e7e7e',    // Fondo de la cabecera
          textColor: '#ffffff',    // Texto de la cabecera
          halign: 'center',
          valign: 'middle',
          lineWidth: 0.5,
          lineColor: '#dfdfdf'
        },
        bodyStyles: {
          halign: 'center',
          valign: 'middle',
          lineWidth: 0.5,
          lineColor: '#dfdfdf'
        },
        tableLineColor: '#dfdfdf',
        tableLineWidth: 0.5,
        // Aplicar estilos computados de la fila HTML a cada celda
        didParseCell: function (data) {
          if (data.section === 'body') {
            const htmlRow = htmlRows[data.row.index];
            if (htmlRow) {
              const computedStyle = window.getComputedStyle(htmlRow);
              const bg = computedStyle.backgroundColor;
              const color = computedStyle.color;
              if (bg && bg !== 'rgba(0, 0, 0, 0)') {
                data.cell.styles.fillColor = bg;
              }
              if (color && color !== 'rgba(0, 0, 0, 0)') {
                data.cell.styles.textColor = color;
              }
            }
          }
        },
        // Insertar el símbolo en la columna 8 con su fondo correspondiente
        didDrawCell: function (data) {
          if (data.column.index === 8) {
            const astro = data.row.raw[1];
            const dataUrl = imagenes[astro];
            if (dataUrl) {
              // Definir dimensiones para el símbolo (por ejemplo, 6×6 mm)
              const desiredWidth = 6;
              const desiredHeight = 6;
              // Calcular posición centrada dentro de la celda
              const offsetX = data.cell.x + (data.cell.width - desiredWidth) / 2;
              const offsetY = data.cell.y + (data.cell.height - desiredHeight) / 2;
              // Dibujar fondo para el símbolo
              pdf.setFillColor("#f5f5dc");
              pdf.rect(offsetX, offsetY, desiredWidth, desiredHeight, 'F');
              // Agregar la imagen encima
              pdf.addImage(dataUrl, "PNG", offsetX, offsetY, desiredWidth, desiredHeight);
            }
          }
        }
      });
    }

    // ============================================================
    // Generación y descarga del PDF
    // ============================================================
    const nombreArchivo = nombre
      .split(' ')[0]
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();

    pdf.save(`${nombreArchivo}.pdf`);
  } catch (error) {
    console.error("Error al generar el PDF:", error);
  }
};

const guardarInformacionPNG = async () => {    
  // Clonamos el contenedor que se desea capturar (con id "resultado")
  const originalElement = document.getElementById("resultado");
  const clone = originalElement.cloneNode(true);

  // Eliminar los botones del clon (si están presentes)
  const botones = clone.querySelectorAll("button");
  botones.forEach(btn => btn.remove());

  // Para cada tabla en el clon, forzamos el estilo inline en la última celda de cada fila
  clone.querySelectorAll("table").forEach(table => {
      table.querySelectorAll("tr").forEach(tr => {
      const cells = tr.querySelectorAll("th, td");
      if (cells.length > 0) {
          const lastCell = cells[cells.length - 1];
          // Forzar centrado horizontal y vertical en la celda
          lastCell.style.setProperty("text-align", "center", "important");
          lastCell.style.setProperty("vertical-align", "middle", "important");
          
          // Si la imagen se comporta como bloque, centramos la imagen
          const images = lastCell.querySelectorAll("img");
          images.forEach(img => {
          img.style.display = "block";      // Para que margin auto tenga efecto
          img.style.margin = "auto";          // Centra la imagen dentro del contenedor
          });
      }
      });
  });

  // Posicionamos el clon fuera de la vista para que html2canvas lo capture completo
  clone.style.position = "absolute";
  clone.style.top = "-10000px";
  clone.style.left = "-10000px";
  document.body.appendChild(clone);

  // Opciones para html2canvas, usando las dimensiones completas del clon
  const options = {
    scale: 4,                // Factor de escala para ultra calidad
    useCORS: true,
    allowTaint: false,
    backgroundColor: null,
    width: clone.scrollWidth,
    height: clone.scrollHeight
  };

  try {
    const canvas = await html2canvas(clone, options);
    document.body.removeChild(clone);

    // Convertir el canvas a Blob en formato PNG (calidad 1.0)
    canvas.toBlob((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      const nombre = document.querySelector("#resultado h2").innerText;
      const nombreArchivo = nombre.split(' ')[0]
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();
      link.download = `${nombreArchivo}.png`;
      link.click();
      URL.revokeObjectURL(link.href);
    }, "image/png", 1.0);
  } catch (error) {
    console.error("Error al generar la imagen PNG:", error);
  }
};

// ==========================
// Inicialización al cargar el DOM
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  // Convierte a mayúsculas en tiempo real el contenido del input de nombre
    const nombreInput = document.getElementById("nombre");
    nombreInput.addEventListener("input", () => {
        nombreInput.value = nombreInput.value.toUpperCase();
    });
  // Establece los valores por defecto: en este caso, el nombre fijo y la fecha/hora actuales.
  document.getElementById("fecha").value = getCurrentDateTimeString();
  // document.getElementById("nombre").value = "Agustín Rendón Cadavid";
  // document.getElementById("fecha").value = "2024-05-30T17:28";
  // document.getElementById("nombre").value = "Alexis David Rendón Chica";
  // document.getElementById("fecha").value = "1992-10-29T11:35";
  // document.getElementById("nombre").value = "Tatiana Cadavid Sánchez";
  // document.getElementById("fecha").value = "1989-07-08T14:35";
});