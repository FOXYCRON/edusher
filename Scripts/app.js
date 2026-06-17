import { db } from './Scripts/firebase-config.js'; // Asegúrate de que la ruta sea correcta
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('collab-form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const recurso = {
                nombre: document.getElementById('collab-name').value,
                categoria: document.getElementById('collab-category').value,
                url: document.getElementById('collab-link').value,
                notas: document.getElementById('collab-desc').value,
                fecha: new Date().toISOString()
            };

            try {
                // Esto guarda en la colección "sugerencias"
                await addDoc(collection(db, "sugerencias"), recurso);
                alert("¡Guardado en Firestore!");
                form.reset();
            } catch (error) {
                console.error("Error al guardar: ", error);
                alert("Error: " + error.message);
            }
        });
    }
});