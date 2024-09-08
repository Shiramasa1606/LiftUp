document.addEventListener('DOMContentLoaded', function() {
    // Asigna el valor recaudado y el objetivo
    const totalRecaudado = 5000; // Cambia este valor con el total recaudado real
    const objetivo = 10000;

    const porcentaje = (totalRecaudado / objetivo) * 100;
    document.getElementById('progress-bar').style.width = `${porcentaje}%`;
    document.getElementById('progress-bar').textContent = `${Math.round(porcentaje)}%`;
    document.getElementById('progress-percentage').textContent = `${Math.round(porcentaje)}%`;
    document.getElementById('progress-goal').textContent = `Objetivo: $${objetivo.toLocaleString('en-US')}`;
});
