// Configuración inicial del mapa
const map = L.map('map').setView([-16.5, -64.5], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// Capa para resaltar departamentos (VERDE)
const highlightLayer = L.geoJSON(null, {
    style: {
        fillColor: '#4CAF50',   // Verde vibrante
        color: '#2E7D32',       // Borde verde oscuro
        weight: 3,              // Grosor del borde
        fillOpacity: 0.5        // 50% de transparencia
    }
}).addTo(map);

// Icono personalizado para eventos
const historyIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [32, 32],
    popupAnchor: [0, -15]    // Ajuste para que el popup no cubra el marcador
});

let markers = [];

// Función para mostrar eventos
function mostrarEventos(eventos) {
    // Limpiar marcadores anteriores
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    // Añadir nuevos marcadores
    eventos.forEach(evento => {
        const marker = L.marker(evento.coordenadas, {
            icon: historyIcon,
            riseOnHover: true   // Efecto al pasar el mouse
        }).addTo(map)
        .bindPopup(`
            <div class="popup-historia">
                <h6 class="fw-bold mb-1">${evento.titulo}</h6>
                <p class="mb-1"><b>Año:</b> ${evento.año}</p>
                <p class="mb-0">${evento.descripcion}</p>
            </div>
        `, {
            maxWidth: 300,      // Ancho máximo del popup
            className: 'custom-popup'   // Clase para estilos CSS
        });
        markers.push(marker);
    });

    // Ajustar vista del mapa si hay eventos
    if (eventos.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.2), {
            animate: true,   // Animación suave
            duration: 1     // Duración en segundos
        });
    }
}

// Función para resaltar departamento (llamada desde filtros.js o script.js)
function resaltarDepartamento(departamento) {
    highlightLayer.clearLayers(); // Limpia cualquier resaltado anterior
    if (!departamento) return;   // Si no hay departamento, no hacer nada

    // Efecto visual durante la carga (opcional, requiere leaflet.spin)
    // map.spin(true);

    // Construye la ruta al archivo GeoJSON del departamento
    const geojsonFile = `/geojson/${departamento.toLowerCase().replace(' ', '_')}.geojson`;

    fetch(geojsonFile)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Departamento no encontrado: ${departamento}`);
            }
            return response.json();
        })
        .then(data => {
            highlightLayer.addData(data); // Agrega los datos GeoJSON a la capa de resaltado
            map.fitBounds(highlightLayer.getBounds(), { // Ajusta la vista al departamento
                padding: [50, 50],
                animate: true
            });
        })
        .catch(error => {
            console.error('Error al cargar el GeoJSON del departamento:', error);
            // Aquí podrías mostrar un mensaje de error al usuario si lo deseas
        })
        // .finally(() => map.spin(false)); // Desactiva el indicador de carga (opcional)
}

// ¡IMPORTANTE!
// Asegúrate de que esta función 'resaltarDepartamento' sea accesible desde el archivo
// donde manejas la selección del bar (por ejemplo, 'script.js' o 'filtros.js').
// Puedes hacerlo asegurándote de que este script 'main.js' se cargue ANTES
// del script donde llamas a 'resaltarDepartamento', o adjuntando la función
// al objeto 'window' para que sea globalmente accesible (menos recomendado).
// Ejemplo (si 'script.js' se carga después):
// window.resaltarDepartamento = resaltarDepartamento;