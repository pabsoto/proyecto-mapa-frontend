function resaltarDepartamento(departamento) {
    // Limpiar resaltado anterior
    highlightLayer.clearLayers();

    if (!departamento) return;

    // Obtener GeoJSON y aplicar estilo VERDE
    fetch(`/geojson/${departamento.toLowerCase().replace(' ', '_')}.geojson`)
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar el departamento');
            return response.json();
        })
        .then(data => {
            highlightLayer.addData(data).setStyle({
                fillColor: '#4CAF50',  // Verde brillante
                fillOpacity: 0.5,       // 50% de opacidad
                color: '#2E7D32',      // Borde verde oscuro
                weight: 3               // Grosor del borde
            });

            // Zoom al departamento seleccionado (con animación)
            map.fitBounds(highlightLayer.getBounds(), {
                padding: [50, 50],
                animate: true
            });
        })
        .catch(error => {
            console.error("Error:", error);
            // Mostrar mensaje en el mapa si falla
            L.popup()
                .setLatLng(map.getCenter())
                .setContent(`Error al cargar ${departamento}`)
                .openOn(map);
        });
}