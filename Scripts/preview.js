document.addEventListener('DOMContentLoaded', function() {
    // Selector para el archivo de avatar
    const avatarUpload = document.getElementById('avatar-upload');
    const avatarPreview = document.getElementById('avatar-preview');

    // Manejo del cambio de archivo para mostrar vista previa
    if (avatarUpload && avatarPreview) {
        avatarUpload.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    avatarPreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Selector para el botón de añadir red social
    const addSocialMediaButton = document.getElementById('add-social-media');
    const socialMediaList = document.getElementById('social-media-list');

    // Manejo del botón de añadir red social
    if (addSocialMediaButton && socialMediaList) {
        addSocialMediaButton.addEventListener('click', function() {
            const newItem = document.createElement('div');
            newItem.classList.add('social-media-item');
            newItem.innerHTML = `
                <input type="text" class="form-control mb-2" placeholder="Nombre de la Red Social">
                <input type="url" class="form-control" placeholder="URL">
            `;
            socialMediaList.appendChild(newItem);
        });
    }

    // Inicialización de Flatpickr para el selector de fecha
    const datePicker = flatpickr('#date-picker', {
        minDate: "today", // Bloquea fechas anteriores a hoy
        dateFormat: "d/m/Y",
        allowInput: true,

        disableMobile: true // Desactiva el teclado de móvil para solo usar el calendario
    });

    // Manejo del botón "Cancelar"
    const clearDateButton = document.getElementById('clear-date');
    if (clearDateButton) {
        clearDateButton.addEventListener('click', function() {
            datePicker.clear(); // Limpia la fecha seleccionada
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Selector para el archivo de imágenes
    const imagesUpload = document.getElementById('images-upload');
    const imagesPreview = document.getElementById('images-preview');

    // Manejo del cambio de archivo de imágenes para mostrar vista previa
    if (imagesUpload && imagesPreview) {
        imagesUpload.addEventListener('change', function(event) {
            imagesPreview.innerHTML = ''; // Limpiar vista previa anterior
            Array.from(event.target.files).forEach(file => {
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        imagesPreview.appendChild(img);
                    };
                    reader.readAsDataURL(file);
                }
            });
        });
    }

    // Selector para el archivo de videos
    const videosUpload = document.getElementById('videos-upload');
    const videosPreview = document.getElementById('videos-preview');

    // Manejo del cambio de archivo de videos para mostrar vista previa
    if (videosUpload && videosPreview) {
        videosUpload.addEventListener('change', function(event) {
            videosPreview.innerHTML = ''; // Limpiar vista previa anterior
            Array.from(event.target.files).forEach(file => {
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const video = document.createElement('video');
                        video.src = e.target.result;
                        video.controls = true; // Agrega controles de reproducción
                        videosPreview.appendChild(video);
                    };
                    reader.readAsDataURL(file);
                }
            });
        });
    }

    // Manejo del botón "Limpiar Imágenes"
    const clearImagesButton = document.getElementById('clear-images');
    if (clearImagesButton) {
        clearImagesButton.addEventListener('click', function() {
            imagesPreview.innerHTML = ''; // Limpiar vista previa de imágenes
            imagesUpload.value = ''; // Limpiar archivo seleccionado
        });
    }

    // Manejo del botón "Limpiar Videos"
    const clearVideosButton = document.getElementById('clear-videos');
    if (clearVideosButton) {
        clearVideosButton.addEventListener('click', function() {
            videosPreview.innerHTML = ''; // Limpiar vista previa de videos
            videosUpload.value = ''; // Limpiar archivo seleccionado
        });
    }
});
