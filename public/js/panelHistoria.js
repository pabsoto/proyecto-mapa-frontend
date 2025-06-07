document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const slider = document.getElementById('rango-fechas');
    const textoAnio = document.getElementById('rango-actual');
    const tabs = document.querySelectorAll('.tab-button');
    const contenedorRevoluciones = document.getElementById('contenedor-revoluciones');
    const contenedorPersonajes = document.getElementById('contenedor-personajes');
    
    // 1. Configuración inicial del slider
    slider.min = 1809;
    slider.max = 1825;
    slider.value = 1825;
    textoAnio.textContent = '1825';
    
    // 2. Cargar y mostrar datos
    function cargarDatos() {
        fetch('./data/historia.json')  // Ruta relativa corregida
            .then(response => {
                if (!response.ok) throw new Error('Error al cargar datos');
                return response.json();
            })
            .then(data => {
                console.log('Datos cargados:', data); // Verifica en consola
                mostrarEventos(data.revoluciones, contenedorRevoluciones);
                
                // Configurar pestañas
                tabs.forEach(tab => {
                    tab.addEventListener('click', function() {
                        tabs.forEach(t => t.classList.remove('active'));
                        this.classList.add('active');
                        
                        if (this.dataset.tab === 'revoluciones') {
                            contenedorPersonajes.style.display = 'none';
                            contenedorRevoluciones.style.display = 'block';
                        } else {
                            contenedorRevoluciones.style.display = 'none';
                            contenedorPersonajes.style.display = 'block';
                            if (data.personajes) mostrarEventos(data.personajes, contenedorPersonajes);
                        }
                    });
                });
            })
            .catch(error => {
                console.error('Error:', error);
                contenedorRevoluciones.innerHTML = '<p>Error al cargar los datos. Recarga la página.</p>';
            });
    }
    
    // 3. Mostrar eventos en el panel
    function mostrarEventos(eventos, contenedor) {
        contenedor.innerHTML = '';
        
        eventos.forEach(evento => {
            const celda = document.createElement('div');
            celda.className = 'celda-evento';
            celda.innerHTML = `
                <h3>${evento.titulo || evento.nombre}</h3>
                <p><strong>📅 ${evento.fecha || evento.fechas}</strong></p>
                ${evento.ubicacion ? `<p>📍 ${evento.ubicacion}</p>` : ''}
                ${evento.lideres ? `<p>🧑‍🤝‍🧑 ${evento.lideres}</p>` : ''}
                <p>📌 ${evento.importancia || evento.contribucion}</p>
                ${evento.enlace ? `<a href="${evento.enlace}" target="_blank">🔗 Más info</a>` : ''}
            `;
            contenedor.appendChild(celda);
        });
    }
    
    // 4. Sincronizar slider con texto
    slider.addEventListener('input', function() {
        textoAnio.textContent = this.value;
    });
    
    // Iniciar
    cargarDatos();
});