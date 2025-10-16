document.getElementById("generarBtn").addEventListener("click", generarPlan);

function generarPlan() {
  const nombre = document.getElementById("nombre").value;
  const edad = document.getElementById("edad").value;
  const experiencia = document.getElementById("experiencia").value;
  const distancia = parseInt(document.getElementById("distancia").value);
  const ritmo = document.getElementById("ritmo").value;
  const dias = parseInt(document.getElementById("dias").value);
  const duracion = document.getElementById("duracion").value;
  const terreno = document.getElementById("terreno").value;
  const gps = document.getElementById("gps").value;
  const semanas = parseInt(document.getElementById("semanas").value);

  const sesiones = generarSesiones(experiencia, dias);

  let html = `
    <div id="planContainer">
    <h2 class="text-success text-center">🏁 Plan de Entrenamiento para ${distancia}K</h2>
    <p><strong>Atleta:</strong> ${nombre} (${edad} años)</p>
    <p><strong>Nivel:</strong> ${experiencia} | <strong>Semanas:</strong> ${semanas} | <strong>Días/semana:</strong> ${dias}</p>
    <p><strong>Ritmo:</strong> ${ritmo} | <strong>Duración máx:</strong> ${duracion} min | <strong>Terreno:</strong> ${terreno}</p>
    <hr>
  `;

  for (let i = 1; i <= semanas; i++) {
    html += `<h4 class="mt-4">📆 Semana ${i}</h4>
      <table class="table table-bordered">
      <thead><tr><th>Día</th><th>Tipo</th><th>Descripción</th></tr></thead><tbody>`;

    for (let d = 0; d < dias; d++) {
      const sesion = sesiones[(i + d) % sesiones.length];
      html += `<tr><td>Día ${d + 1}</td><td>${sesion.tipo}</td><td>${sesion.descripcion}</td></tr>`;
    }

    html += `</tbody></table>`;
  }

  html += `<div class="text-center">
              <button class="btn btn-outline-success btn-download" id="pdfBtn">📄 Descargar PDF</button>
           </div></div>`;

  document.getElementById("planOutput").innerHTML = html;
  document.getElementById("pdfBtn").addEventListener("click", () => exportarPDF(nombre));
}

function generarSesiones(experiencia, dias) {
  if (experiencia === "Principiante") {
    return [
      { tipo: "Rodaje suave", descripcion: "6-8 km ritmo cómodo (5:45-6:00/km)." },
      { tipo: "Técnica de carrera", descripcion: "Ejercicios de técnica + trote 30’." },
      { tipo: "Fondo largo", descripcion: "10-14 km ritmo constante." },
      { tipo: "Descanso activo", descripcion: "Bici, yoga o caminata 40’." },
      { tipo: "Intervalos suaves", descripcion: "6x400m ritmo alegre, recuperación 200m." }
    ];
  }
  if (experiencia === "Intermedio") {
    return [
      { tipo: "Rodaje medio", descripcion: "8-10 km a 5:30-5:45/km." },
      { tipo: "Series", descripcion: "6x800m a 4:50/km con 400m suaves." },
      { tipo: "Tempo", descripcion: "25’ ritmo umbral (5:00/km)." },
      { tipo: "Fondo largo", descripcion: "14-18 km a 5:40-6:00/km." },
      { tipo: "Recuperación", descripcion: "5 km suaves o descanso." }
    ];
  }
  return [
    { tipo: "Rodaje", descripcion: "12 km a 5:00/km." },
    { tipo: "Series largas", descripcion: "4x2000m a 4:30/km con 3’ descanso." },
    { tipo: "Tempo controlado", descripcion: "40 min ritmo de carrera." },
    { tipo: "Fondo", descripcion: "20-24 km a 5:15-5:30/km." },
    { tipo: "Técnica + Core", descripcion: "Ejercicios 30-40 min." }
  ];
}

async function exportarPDF(nombre) {
  const { jsPDF } = window.jspdf;
  const plan = document.getElementById("planContainer");

  // Captura el contenido del plan
  const canvas = await html2canvas(plan, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  // Tamaño del PDF en orientación vertical
  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pdfWidth - 20; // márgenes laterales
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 10;

  // Agrega la primera página
  pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  // Si el contenido excede una página, crea más
  while (heightLeft > 0) {
    position = heightLeft - imgHeight + 10;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  pdf.save(`Plan_${nombre}.pdf`);
}



async function exportarPDF(nombre) {
  const { jsPDF } = window.jspdf;
  const plan = document.getElementById("planContainer");

  const canvas = await html2canvas(plan, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const width = pdf.internal.pageSize.getWidth();
  const height = (canvas.height * width) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, width, height);
  pdf.save(`Plan_${nombre}.pdf`);
}
