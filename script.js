document.getElementById("generarBtn").addEventListener("click", generarPlan);
// ... (código anterior)

// 🧠 Prompt base del entrenador experto, mejorado para fidedignidad y formato JSON
const promptBase = `
Eres un entrenador experto en running y deportes de resistencia, con gran experiencia en deportistas que son aficionados.

---
**REGLAS CRUCIALES DE ENTRENAMIENTO:**
1.  **SEGURIDAD Y PROGRESIÓN:** Asegura una progresión gradual en el volumen total de kilómetros semanal no mayor al **10%** respecto a la semana anterior.
2.  **ESTRUCTURA SEMANAL:** Incluye al menos una sesión de **Velocidad/Fartlek/Intervalos** y una sesión de **Fondo Largo** por semana.
3.  **RECUPERACIÓN:** Asigna días de **descanso total** o **descanso activo** (ej: estiramiento, yoga) y recomienda una sesión de **revisión kinésica o masaje deportivo** al menos una vez cada 4 semanas, o si el atleta tiene historial de lesiones.
4.  **PRESCRIPCIÓN:** Los entrenamientos deben ser en base a **ritmos (min/km)** (ajustados a su ritmo actual y objetivo) y **zonas de frecuencia cardiaca** (Zonas 2-5).

---
**FORMATO DE SALIDA (OBLIGATORIO):**
Debes entregar el plan de entrenamiento para las semanas solicitadas en un **único bloque de código JSON** que contenga un array de objetos. NO INCLUYAS NINGÚN OTRO TEXTO fuera del JSON.

**Estructura JSON:**
[
  {
    "semana": 1,
    "objetivo": "Adaptación de volumen",
    "dias": [
      {
        "dia": "Lunes",
        "tipo": "Descanso Total",
        "descripcion": "Recuperación completa."
      },
      {
        "dia": "Martes",
        "tipo": "Rodaje Suave",
        "descripcion": "Calentamiento (5min trote suave). 30 minutos a ritmo de 6:00 min/km (Zona 2). Vuelta a la calma (5min caminar y estirar)."
      }
      // ... más días
    ],
    "volumen_total_km": 15
  }
  // ... más semanas
]
`;

// Función para recopilar los nuevos datos del formulario
function generarPlan() {
  const nombre = document.getElementById("nombre").value;
  const edad = document.getElementById("edad").value;
  const experiencia = document.getElementById("experiencia").value;
  const distancia = parseInt(document.getElementById("distancia").value);
  const tiempo_objetivo = document.getElementById("tiempo_objetivo").value; // NUEVO
  const ritmo_actual = document.getElementById("ritmo_actual").value; // NUEVO
  const dias = parseInt(document.getElementById("dias").value);
  // Eliminadas las variables 'duracion' y 'gps' ya que no son tan cruciales como los nuevos campos.
  const terreno = document.getElementById("terreno").value;
  const salud = document.getElementById("salud").value; // NUEVO
  const lesiones = document.getElementById("lesiones").value; // NUEVO
  const semanas = document.getElementById("semanas").value;

  // Validación básica del nuevo campo
  if (!tiempo_objetivo || !ritmo_actual) {
    alert("Por favor, completa el Tiempo Objetivo y el Ritmo Actual.");
    return;
  }
  
  // Ocultar formulario, mostrar carga
  document.getElementById("planOutput").style.display = "block";
  document.getElementById("planLoading").style.display = "block";
  document.getElementById("planContent").innerHTML = "";
  document.getElementById("downloadBtn").disabled = true;

  const datosAtleta = {
    nombre: nombre,
    edad: edad,
    experiencia: experiencia,
    distancia_km: distancia,
    tiempo_objetivo: tiempo_objetivo,
    ritmo_actual_min_km: ritmo_actual,
    dias_entrenamiento_semana: dias,
    terreno_habitual: terreno,
    condicion_salud: salud,
    historial_lesiones: lesiones,
    semanas_preparacion: semanas
  };
  
  generarPlanIA(datosAtleta);
}

// ... (El resto de las funciones siguen, pero se modificará 'generarPlanIA')



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




async function generarPlanIA(datosAtleta) {
  // **IMPORTANTE:** Reemplaza 'TU_API_KEY_GEMINI' con tu clave real.
  const GEMINI_API_KEY = 'AIzaSyBGAXQHUfoFpD0iF3UA7EqcjUhg5_C3P2Y'; 

  // **SUGERENCIA:** Usar Gemini 2.5 Flash para un buen rendimiento/velocidad.
  const GEMINI_MODEL = "gemini-2.5-flash"; 

  const promptCompleto = `
  ${promptBase}

  Aquí tienes los datos del atleta:\n${JSON.stringify(datosAtleta, null, 2)}
  `;

  // Adaptación para el formato de la API de Google Gemini (similar a OpenAI)
  const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: promptCompleto }] }],
      config: {
        // La temperatura (aleatoriedad) baja ayuda a mantener la fidedignidad
        temperature: 0.2, 
      }
    }),
  });
  
  document.getElementById("planLoading").style.display = "none";
  document.getElementById("downloadBtn").disabled = false;

  if (!response.ok) {
    // Manejo de errores de la API
    document.getElementById("planContent").innerHTML = `
        <div class="alert alert-danger" role="alert">
            Error de la API: ${response.status}. Verifica tu clave de API o la configuración de cuota.
        </div>`;
    return;
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
      document.getElementById("planContent").innerHTML = `
        <div class="alert alert-warning" role="alert">
            No se pudo generar el plan. Intenta con un prompt más simple o revisa el JSON de respuesta.
        </div>`;
      return;
  }
  
  // 1. Extraer el bloque JSON del texto
  // Busca el bloque de código JSON (lo que obliga el prompt)
  const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```|\[[\s\S]*\]/);
  
  let planJSON;
  if (jsonMatch) {
      try {
          // Intenta parsear la parte del texto que parece JSON
          planJSON = JSON.parse(jsonMatch[1] || jsonMatch[0]);
          mostrarPlan(planJSON); // Llama a la nueva función de visualización
      } catch (e) {
          console.error("Error al parsear JSON:", e);
          document.getElementById("planContent").innerHTML = `
              <div class="alert alert-warning" role="alert">
                  Error de formato: La IA no entregó un JSON válido. Plan en texto plano:
                  <pre>${rawText}</pre>
              </div>`;
      }
  } else {
       // Si no hay JSON, muestra el texto plano (plan de respaldo)
       document.getElementById("planContent").innerHTML = `
            <div class="alert alert-info" role="alert">
                Plan generado en texto plano (sin formato de tabla):
                <pre>${rawText}</pre>
            </div>`;
  }
}

// NUEVA función para mostrar el plan desde el JSON estructurado (más robusto)
function mostrarPlan(planArray) {
  let html = '<div class="accordion" id="planAccordion">';
  
  planArray.forEach((semana, index) => {
    const isExpanded = index === 0 ? 'true' : 'false';
    const showClass = index === 0 ? 'show' : '';
    const headerId = `heading${index}`;
    const collapseId = `collapse${index}`;

    // Título de la Semana
    html += `
      <div class="accordion-item">
        <h2 class="accordion-header" id="${headerId}">
          <button class="accordion-button club-red" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="${isExpanded}" aria-controls="${collapseId}">
            Semana ${semana.semana}: ${semana.objetivo} (Volumen: ${semana.volumen_total_km} km)
          </button>
        </h2>
        <div id="${collapseId}" class="accordion-collapse collapse ${showClass}" aria-labelledby="${headerId}" data-bs-parent="#planAccordion">
          <div class="accordion-body">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Día</th>
                  <th>Tipo de Sesión</th>
                  <th>Descripción Detallada</th>
                </tr>
              </thead>
              <tbody>`;

    // Detalles de los días de entrenamiento
    semana.dias.forEach(dia => {
        const isRest = dia.tipo.toLowerCase().includes('descanso');
        html += `
          <tr class="${isRest ? 'table-secondary' : ''}">
            <td><strong>${dia.dia}</strong></td>
            <td>${dia.tipo}</td>
            <td>${dia.descripcion}</td>
          </tr>`;
    });

    html += `
              </tbody>
            </table>
          </div>
        </div>
      </div>`;
  });

  html += '</div>'; // Fin del acordeón
  document.getElementById("planContent").innerHTML = html;
}

// ... (El resto de funciones como 'exportarPDF' y 'generarPlan' al inicio)