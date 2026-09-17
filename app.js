// =========================================================
// Asistente de envío nacional — lógica de interfaz
// Prototipo académico: toda la lógica corre en el navegador,
// no consulta APIs externas ni sistemas reales de Chilexpress.
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     1) Selección visual de un servicio (classList: is-selected)
  --------------------------------------------------------- */
  const tarjetasServicio = document.querySelectorAll('.card-service');
  const textoSeleccion = document.getElementById('servicio-elegido-texto');
  const selectUrgencia = document.getElementById('urgencia');

  const nombreServicio = {
    basico: 'Básico',
    estandar: 'Estándar',
    prioritario: 'Prioritario',
  };

  // Un servicio elegido manualmente en las tarjetas sugiere,
  // pero no reemplaza, la urgencia que la persona indique en el formulario.
  const urgenciaSugerida = {
    basico: 'baja',
    estandar: 'media',
    prioritario: 'alta',
  };

  tarjetasServicio.forEach((tarjeta) => {
    const boton = tarjeta.querySelector('.card-service__pick');

    boton.addEventListener('click', () => {
      tarjetasServicio.forEach((otra) => otra.classList.remove('is-selected'));
      tarjeta.classList.add('is-selected');

      const servicio = tarjeta.dataset.service;
      textoSeleccion.textContent = `Servicio elegido: ${nombreServicio[servicio]}.`;

      if (selectUrgencia && !selectUrgencia.value) {
        selectUrgencia.value = urgenciaSugerida[servicio];
      }
    });
  });

  /* ---------------------------------------------------------
     2) Mostrar / ocultar bloque de datos adicionales
  --------------------------------------------------------- */
  const botonToggle = document.getElementById('toggle-detalles');
  const bloqueExtra = document.getElementById('detalles-adicionales');

  botonToggle.addEventListener('click', () => {
    const oculto = bloqueExtra.hasAttribute('hidden');

    if (oculto) {
      bloqueExtra.removeAttribute('hidden');
      botonToggle.textContent = '− Ocultar datos adicionales del embalaje';
    } else {
      bloqueExtra.setAttribute('hidden', '');
      botonToggle.textContent = '+ Mostrar datos adicionales del embalaje';
    }

    botonToggle.setAttribute('aria-expanded', String(oculto));
  });

  /* ---------------------------------------------------------
     3) y 4) Validar el formulario al enviarlo (submit + preventDefault)
        y generar/actualizar el panel de resultado dinámicamente
  --------------------------------------------------------- */
  const formulario = document.getElementById('form-envio');
  const panelResultado = document.getElementById('panel-resultado');

  const reglaDeServicio = {
    baja: 'basico',
    media: 'estandar',
    alta: 'prioritario',
  };

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const esValido = formulario.checkValidity();

    // Estado visual de validación por campo (Bootstrap + clases propias)
    formulario.classList.add('was-validated');

    if (!esValido) {
      panelResultado.classList.remove('result-panel--empty', 'is-valid');
      panelResultado.classList.add('is-error');
      panelResultado.innerHTML = `
        <p>Hay datos incompletos o inválidos en el formulario. Revisa los
        campos marcados en rojo antes de continuar.</p>
      `;
      panelResultado.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const datos = {
      origen: formulario.origen.value.trim(),
      destino: formulario.destino.value.trim(),
      tipoEnvio: formulario.tipoEnvio.value,
      urgencia: formulario.urgencia.value,
      peso: Number(formulario.peso.value),
    };

    const servicioSugerido = reglaDeServicio[datos.urgencia];

    panelResultado.classList.remove('result-panel--empty', 'is-error');
    panelResultado.classList.add('is-valid');

    panelResultado.innerHTML = `
      <h3 class="result-panel__title">Resumen del envío</h3>
      <ul class="result-panel__list">
        <li><strong>Origen:</strong> ${datos.origen}</li>
        <li><strong>Destino:</strong> ${datos.destino}</li>
        <li><strong>Tipo de envío:</strong> ${datos.tipoEnvio}</li>
        <li><strong>Peso:</strong> ${datos.peso} kg</li>
        <li><strong>Servicio sugerido:</strong> ${nombreServicio[servicioSugerido]}</li>
      </ul>
      <p class="mt-2 mb-0"><small>Recomendación generada por una regla académica simple
      (urgencia baja = Básico, media = Estándar, alta = Prioritario). No representa
      la lógica comercial real de Chilexpress.</small></p>
    `;

    // Refleja también la elección en las tarjetas de servicio
    tarjetasServicio.forEach((tarjeta) => {
      tarjeta.classList.toggle('is-selected', tarjeta.dataset.service === servicioSugerido);
    });
    textoSeleccion.textContent = `Servicio elegido: ${nombreServicio[servicioSugerido]} (según la urgencia indicada).`;

    panelResultado.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  /* ---------------------------------------------------------
     Acción para limpiar el formulario y volver al estado inicial
  --------------------------------------------------------- */
  formulario.addEventListener('reset', () => {
    // Se ejecuta después de que el navegador limpia los valores nativos
    setTimeout(() => {
      formulario.classList.remove('was-validated');

      tarjetasServicio.forEach((tarjeta) => tarjeta.classList.remove('is-selected'));
      textoSeleccion.textContent = 'Aún no has elegido un servicio de la lista.';

      bloqueExtra.setAttribute('hidden', '');
      botonToggle.textContent = '+ Mostrar datos adicionales del embalaje';
      botonToggle.setAttribute('aria-expanded', 'false');

      panelResultado.classList.remove('is-valid', 'is-error');
      panelResultado.classList.add('result-panel--empty');
      panelResultado.innerHTML = '<p>Completa el formulario para ver aquí tu recomendación de servicio.</p>';
    }, 0);
  });

});
