document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', function() {
            const referrer = document.referrer;
            if (referrer.includes('misProyectos.html')) {
                window.location.href = 'misProyectos.html';
            } else if (referrer.includes('proyectosSeguidos.html')) {
                window.location.href = 'proyectosSeguidos.html';
            } else {
                window.history.back();
            }
        });
    }
});
