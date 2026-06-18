import { db } from './firebase-config.js'; // Asegúrate de que la ruta sea correcta
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
                console.log("Intentando guardar en la colección: sugerencias");
                const docRef = await addDoc(collection(db, "sugerencias"), recurso);
                
                // Si esto se ejecuta, el dato SÍ salió de tu computadora
                console.log("¡ÉXITO! Documento guardado con ID: ", docRef.id);
                alert("¡Guardado correctamente! ID del documento: " + docRef.id);
                
                form.reset();
            } catch (error) {
                console.error("Error al guardar en Firebase: ", error);
                alert("Error técnico: " + error.message);
            }
        });
    }
});