// Seleccionar botones de estilos
const estiloButtons = document.querySelectorAll('.selector-estilos button');
let formato24h = true;
let sonidoActivo = false;
const tickAudio = new Audio('tick.mp3'); // Asegúrate de tener un archivo tick.mp3 en tu proyecto

// Función para actualizar el reloj
function updateClock() {
    const now = new Date();

    // Obtener zona horaria seleccionada
    const timezoneSelect = document.getElementById('timezone');
    if (!timezoneSelect) {
        console.error("Elemento timezone no encontrado");
        return;
    }
    const timezone = timezoneSelect.value;

    // Opciones para formatear la hora y fecha
    const timeOptions = { 
        timeZone: timezone, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: !formato24h 
    };
    const dateOptions = { 
        timeZone: timezone, 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };

    try {
        // Hora y fecha ajustadas a la zona horaria
        const timeString = now.toLocaleTimeString('es-ES', timeOptions);
        const dateString = now.toLocaleDateString('es-ES', dateOptions);

        // Actualizar elementos del DOM con verificación de existencia
        const timeElement = document.getElementById('time');
        const dateElement = document.getElementById('date');
        
        if (timeElement) timeElement.textContent = timeString;
        if (dateElement) dateElement.textContent = dateString;

        // Reproducir sonido de reloj si está activo
        if (sonidoActivo) {
            tickAudio.currentTime = 0;
            tickAudio.play().catch(e => console.log("Error al reproducir sonido:", e));
        }
    } catch (error) {
        console.error("Error al formatear hora/fecha:", error);
    }
}

// Fondo interactivo dinámico con partículas
function setupParticles() {
    const background = document.getElementById('background');
    if (!background) return;

    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.animationDuration = `${Math.random() * 3 + 2}s`;
        background.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 5000);
    }

    // Generar partículas cada 500ms
    const particleInterval = setInterval(createParticle, 500);
    
    // Limpiar intervalo si es necesario
    return () => clearInterval(particleInterval);
}

// Definir modos visuales
const modos = {
    neon: {
        icon: 'lightbulb',
        colors: {
            fondo: '#0f0f1a',
            texto: '#00fffc',
            acento: '#0084ff',
            boton: 'rgba(0, 255, 252, 0.1)'
        },
        animation: 'neonGlow 2s infinite alternate'
    },
    minimal: {
        icon: 'clock',
        colors: {
            fondo: '#ffffff',
            texto: '#333333',
            acento: '#666666',
            boton: 'rgba(0, 0, 0, 0.05)'
        },
        animation: 'none'
    },
    nature: {
        icon: 'leaf',
        colors: {
            fondo: '#1a2f1a',
            texto: '#a5d6a7',
            acento: '#4caf50',
            boton: 'rgba(76, 175, 80, 0.1)'
        },
        animation: 'breathe 6s infinite'
    },
    retro: {
        icon: 'gamepad',
        colors: {
            fondo: '#2d1b3d',
            texto: '#ffeb3b',
            acento: '#ff5722',
            boton: 'rgba(255, 87, 34, 0.1)'
        },
        animation: 'pixelate 0.5s infinite steps(2)'
    },
    matrix: {
        icon: 'code',
        colors: {
            fondo: '#000000',
            texto: '#00ff41',
            acento: '#008f11',
            boton: 'rgba(0, 255, 65, 0.1)'
        },
        animation: 'matrixEffect 0.5s infinite'
    },
    sunset: {
        icon: 'sun',
        colors: {
            fondo: '#2c3e50',
            texto: '#e74c3c',
            acento: '#f39c12',
            boton: 'rgba(243, 156, 18, 0.1)'
        },
        animation: 'colorPulse 8s infinite alternate'
    }
};

// Aplicar un modo visual
function aplicarModo(modo) {
    const config = modos[modo];
    
    if (!config) {
        console.error(`El modo ${modo} no existe.`);
        return;
    }

    // Aplicar colores
    const root = document.documentElement;
    root.style.setProperty('--color-fondo', config.colors.fondo);
    root.style.setProperty('--color-texto', config.colors.texto);
    root.style.setProperty('--color-acento', config.colors.acento);
    root.style.setProperty('--color-boton', config.colors.boton);

    // Aplicar animación
    const contenedor = document.querySelector('.container');
    if (contenedor) {
        contenedor.style.animation = 'none';
        setTimeout(() => {
            contenedor.style.animation = config.animation;
        }, 10);
    }

    // Guardar preferencia
    localStorage.setItem('modoPreferido', modo);
}

// Controladores de eventos
function setupEventListeners() {
    const cambiarFormatoBtn = document.getElementById('cambiarFormato');
    if (cambiarFormatoBtn) {
        cambiarFormatoBtn.addEventListener('click', () => {
            formato24h = !formato24h;
            cambiarFormatoBtn.innerHTML = formato24h ? 
                '<i class="fas fa-exchange-alt"></i> 24H' : 
                '<i class="fas fa-exchange-alt"></i> 12H';
            localStorage.setItem('formato24h', formato24h);
            updateClock();
        });
    }

    const toggleSonidoBtn = document.getElementById('toggleSonido');
    if (toggleSonidoBtn) {
        toggleSonidoBtn.addEventListener('click', () => {
            sonidoActivo = !sonidoActivo;
            toggleSonidoBtn.innerHTML = sonidoActivo ? 
                '<i class="fas fa-volume-up"></i>' : 
                '<i class="fas fa-volume-mute"></i>';
            localStorage.setItem('sonidoActivo', sonidoActivo);
        });
    }

    estiloButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modo = button.dataset.estilo;

            // Actualizar botón activo
            estiloButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Aplicar modo seleccionado
            aplicarModo(modo);
        });
    });
}

// Cargar preferencias al iniciar
function cargarPreferencias() {
    // Cargar modo
    const modoGuardado = localStorage.getItem('modoPreferido') || 'neon';
    aplicarModo(modoGuardado);

    // Marcar botón activo
    const botonActivo = document.querySelector(`[data-estilo="${modoGuardado}"]`);
    if (botonActivo) {
        botonActivo.classList.add('active');
    }

    // Cargar formato de hora
    const formatoGuardado = localStorage.getItem('formato24h');
    if (formatoGuardado !== null) {
        formato24h = formatoGuardado === 'true';
    }

    // Actualizar botón de formato
    const cambiarFormatoBtn = document.getElementById('cambiarFormato');
    if (cambiarFormatoBtn) {
        cambiarFormatoBtn.innerHTML = formato24h ? 
            '<i class="fas fa-exchange-alt"></i> 24H' : 
            '<i class="fas fa-exchange-alt"></i> 12H';
    }

    // Cargar sonido
    const sonidoGuardado = localStorage.getItem('sonidoActivo');
    if (sonidoGuardado !== null) {
        sonidoActivo = sonidoGuardado === 'true';
    }

    // Actualizar botón de sonido
    const toggleSonidoBtn = document.getElementById('toggleSonido');
    if (toggleSonidoBtn) {
        toggleSonidoBtn.innerHTML = sonidoActivo ? 
            '<i class="fas fa-volume-up"></i>' : 
            '<i class="fas fa-volume-mute"></i>';
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    try {
        cargarPreferencias();
        setupEventListeners();
        setupParticles();
        
        // Configurar intervalo para el reloj
        setInterval(updateClock, 1000);
        updateClock();
    } catch (error) {
        console.error("Error durante la inicialización:", error);
    }
});
// Aplicar un modo visual
function aplicarModo(modo) {
    const config = modos[modo];
    
    if (!config) {
        console.error(`El modo ${modo} no existe.`);
        return;
    }

    // Aplicar colores
    const root = document.documentElement;
    root.style.setProperty('--color-fondo', config.colors.fondo);
    root.style.setProperty('--color-texto', config.colors.texto);
    root.style.setProperty('--color-acento', config.colors.acento);
    root.style.setProperty('--color-boton', config.colors.boton);

    // Actualizar el fondo según el modo
    const background = document.getElementById('background');
    if (background) {
        background.style.background = getBackgroundForMode(modo);
    }

    // Aplicar animación
    const contenedor = document.querySelector('.container');
    if (contenedor) {
        contenedor.style.animation = 'none';
        setTimeout(() => {
            contenedor.style.animation = config.animation;
        }, 10);
    }

    // Guardar preferencia
    localStorage.setItem('modoPreferido', modo);
}

// Función para obtener el fondo según el modo
function getBackgroundForMode(modo) {
    const backgrounds = {
        neon: 'linear-gradient(135deg, #0f0f1a, #1a1a2e)',
        minimal: 'linear-gradient(135deg, #f5f5f5, #e0e0e0)',
        nature: 'linear-gradient(135deg, #1a2f1a, #2d5a2d)',
        retro: 'linear-gradient(135deg, #2d1b3d, #4b2c5e)',
        matrix: 'linear-gradient(135deg, #000000, #001a00)',
        sunset: 'linear-gradient(135deg, #2c3e50, #4a6491)'
    };
    return backgrounds[modo] || 'linear-gradient(135deg, #3a3d42, #1d2025)';
}