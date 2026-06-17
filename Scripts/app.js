import { db } from './Scripts/firebase-config.js'; 
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Escuchamos el evento de submit directamente desde el JS, no desde el HTML
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form'); // Esto selecciona tu formulario
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            console.log("Detectado submit, enviando a Firebase...");

            const recurso = {
                nombre: document.getElementById('collab-name').value,
                categoria: document.getElementById('collab-category').value,
                url: document.getElementById('collab-link').value,
                notas: document.getElementById('collab-desc').value,
                fecha: new Date().toISOString()
            };

            try {
                await addDoc(collection(db, "sugerencias"), recurso);
                alert("¡Guardado correctamente en la colección 'sugerencias'!");
                form.reset();
            } catch (e) {
                console.error("Error al guardar: ", e);
                alert("Error: " + e.message);
            }
        });
    }
});