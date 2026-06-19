import { db } from './firebase-config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('collab-form');

    if (!form) {
        console.error("❌ No se encontró el formulario");
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 🔹 Obtener valores correctamente
        const nombre = document.getElementById('collab-name')?.value || "Sin nombre";
        const categoria = document.getElementById('collab-category')?.value || "programas";
        const url = document.getElementById('collab-link')?.value || "#";

        const tagline = document.getElementById('collab-tagline')?.value || "";
        const size = document.getElementById('collab-size')?.value || "Por definir";
        const format = document.getElementById('collab-format')?.value || "Directo / Drive";
        const so = document.getElementById('collab-so')?.value || "Multiplataforma";
        const descripcion = document.getElementById('collab-desc')?.value || "Sin descripción";

        const recurso = {
            nombre,
            categoria,
            url,
            tagline,
            size,
            format,
            so,
            descripcion,
            fecha: new Date().toISOString()
        };

        console.log("📦 Datos a enviar:", recurso);

        try {
            const docRef = await addDoc(collection(db, "sugerencias"), recurso);

            console.log("✅ Guardado con ID:", docRef.id);
            alert("Guardado correctamente");

            form.reset();

        } catch (error) {
            console.error("❌ Error Firebase:", error);
            alert("Error: " + error.message);
        }
    });
});