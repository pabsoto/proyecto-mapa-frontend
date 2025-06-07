// 1. Inicializar el mapa 
const map = L.map('map').setView([-16.5, -64.5], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// 2. Capa para resaltar departamentos
const highlightLayer = L.geoJSON(null, {
    style: {
        fillColor: '#4CAF50',
        color: '#2E7D32',
        weight: 3,
        fillOpacity: 0.5
    }
}).addTo(map);

// 3. Icono personalizado para eventos
const historyIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [32, 32],
    popupAnchor: [0, -15]
});

const departamentoLayers = {};
let selectedLayer = null;
let markers = [];

// 4. Cargar departamentos desde bo.json
fetch('data/bo.json')
    .then(response => response.json())
    .then(data => {
        data.features.forEach(feature => {
            const nombre = feature.properties.name || feature.properties.nombre;
            const layer = L.geoJSON(feature, {
                style: {
                    color: "#666",
                    weight: 1,
                    fillOpacity: 0.1
                },
                interactive: false
            }).addTo(map);
            departamentoLayers[nombre] = layer;
        });
    });

// 5. Función para resaltar departamento
function resaltarDepartamento(nombre) {
    if (selectedLayer) {
        selectedLayer.setStyle({
            color: "#666",
            weight: 1,
            fillOpacity: 0.1
        });
    }

    if (nombre && departamentoLayers[nombre]) {
        selectedLayer = departamentoLayers[nombre];
        selectedLayer.setStyle({
            color: "#4CAF50",
            weight: 3,
            fillOpacity: 0.5,
            fillColor: "#4CAF50"
        });

        map.flyToBounds(selectedLayer.getBounds(), {
            padding: [50, 50],
            duration: 1
        });
    }
}

// 6. Función para mostrar eventos
function mostrarEventos(eventos) {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    eventos.forEach(evento => {
        const marker = L.marker(evento.coordenadas, {
            icon: historyIcon
        }).addTo(map).bindPopup(`
            <div class="popup-historia">
                <h6 class="fw-bold mb-1">${evento.titulo}</h6>
                <p class="mb-1"><b>Año:</b> ${evento.año}</p>
                <p class="mb-0">${evento.descripcion}</p>
            </div>
        `);
        markers.push(marker);
    });
}

// 7. Eventos de filtro
document.addEventListener('DOMContentLoaded', () => {
    const eventos = [
        {
            titulo: "Independencia de Bolivia",
            año: 1825,
            departamento: "Chuquisaca",
            descripcion: "Proclamación de la independencia en Sucre.",
            coordenadas: [-19.0475, -65.2596]
        },
        {
            titulo: "Revolución Nacional",
            año: 1952,
            departamento: "La Paz",
            descripcion: "Reforma agraria y voto universal.",
            coordenadas: [-16.4958, -68.1335]
        }
    ];

    // 🔁 Hacer los eventos globales para el slider
    window.eventosGlobales = eventos;

    mostrarEventos(eventos);

    const filtroDepartamento = document.getElementById('filtro-departamento');
    const filtroAnio = document.getElementById('filtro-anio');
    const anioTooltip = document.getElementById('anio-tooltip');
    const btnLimpiar = document.getElementById('btn-limpiar');

    function aplicarFiltros() {
        const departamento = filtroDepartamento.value;
        const anio = filtroAnio.value;

        const eventosFiltrados = eventos.filter(e => {
            const coincideDepartamento = departamento === "" || e.departamento === departamento;
            const coincideAnio = anio === "" || e.año <= parseInt(anio);
            return coincideDepartamento && coincideAnio;
        });

        resaltarDepartamento(departamento);
        mostrarEventos(eventosFiltrados);
    }

    filtroDepartamento.addEventListener('change', aplicarFiltros);

    filtroAnio.addEventListener('input', () => {
        anioTooltip.textContent = filtroAnio.value;
        aplicarFiltros();
    });

    btnLimpiar.addEventListener('click', () => {
        filtroDepartamento.value = '';
        filtroAnio.value = '';
        anioTooltip.textContent = '';
        highlightLayer.clearLayers();
        resaltarDepartamento(null);
        mostrarEventos(eventos);
    });
});
