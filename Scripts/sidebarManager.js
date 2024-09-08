document.addEventListener('DOMContentLoaded', function() {
    // Obtener elementos para las sidebars
    const sidebarToggle = document.getElementById('sidebarToggle');
    const profileToggle = document.getElementById('profileToggle');
    const filterIcon = document.querySelector('.filter-icon');
    const contentOverlay = document.getElementById('content-overlay'); // Asegúrate de usar el ID correcto

    // Sidebars
    const sidebar = document.getElementById('projectsSidebar'); // Sidebar general
    const profileSidebar = document.getElementById('profileSidebar'); // Sidebar de perfil

    // Función para abrir una sidebar
    function openSidebar(sidebar) {
        if (sidebar) {
            sidebar.classList.add('open');
            contentOverlay.style.display = 'block'; // Mostrar overlay
        }
    }

    // Función para cerrar una sidebar
    function closeSidebar(sidebar) {
        if (sidebar) {
            sidebar.classList.remove('open');
            // Verifica si alguna sidebar sigue abierta
            const anySidebarOpen = document.querySelector('.sidebar.open') || document.querySelector('.profile-sidebar.open');
            if (!anySidebarOpen) {
                contentOverlay.style.display = 'none'; // Ocultar overlay solo si no hay sidebars abiertas
            }
        }
    }

    // Manejar clic en el botón de abrir la sidebar de proyectos
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            openSidebar(sidebar);
        });
    }

    // Manejar clic en el botón de abrir la sidebar del perfil
    if (profileToggle) {
        profileToggle.addEventListener('click', function() {
            openSidebar(profileSidebar);
        });
    }

    // Manejar clic en el overlay para cerrar las sidebars abiertas
    if (contentOverlay) {
        contentOverlay.addEventListener('click', function() {
            if (sidebar && sidebar.classList.contains('open')) {
                closeSidebar(sidebar);
            }
            if (profileSidebar && profileSidebar.classList.contains('open')) {
                closeSidebar(profileSidebar);
            }
        });
    }
});
