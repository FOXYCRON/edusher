        // Importación de módulos Firebase para almacenamiento en tiempo real en la nube
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
        import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
        import { 
            getFirestore, 
            collection, 
            doc, 
            addDoc, 
            onSnapshot, 
            deleteDoc,
            setDoc,
            getDoc   // 🔥 ESTE TE FALTABA
        } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

        // BASE DE DATOS DE RECURSOS ORIGINALES
        const resources = [
            {
                id: "visual-studio-code",
                name: "Visual Studio Code - Configurado",
                category: "programas",
                tagline: "El editor de código optimizado con las extensiones clave del profe.",
                description: "Edición instalable y portable configurada con los themes, accesos directos y configuraciones para HTML, CSS, JavaScript y Python listos para usar en tus asignaturas.\n\nIncluye el compilador GCC integrado para C/C++ directamente configurado en el PATH.",
                size: "148 MB",
                date: "02/06/2026",
                so: "Windows & macOS",
                format: "ZIP/EXE",
                icon: "terminal",
                color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
                downloadUrl: "https://drive.google.com/drive/folders/dummy1",
                isFeatured: true,

                fromCloud: false
            },
            {
                id: "matlab-r2024",
                name: "MATLAB R2024a Student Edition",
                category: "programas",
                tagline: "El entorno computacional definitivo con Simulink pre-instalado.",
                description: "La edición recomendada por el laboratorio de Ingeniería. Permite simular sistemas mecánicos, procesar señales de forma matricial y generar modelos avanzados.\n\nContiene los toolboxes más solicitados como Control System, Signal Processing e Image Processing.",
                size: "4.2 GB",
                date: "25/05/2026",
                so: "Windows",
                format: "ISO",
                icon: "binary",
                color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
                downloadUrl: "https://drive.google.com/drive/folders/dummy2",
                isFeatured: true,

                fromCloud: false
            },
            {
                id: "apuntes-redes-completos",
                name: "Apuntes Completos de Redes (S6)",
                category: "archivos",
                tagline: "Toda la teoría y fórmulas del sexto semestre ordenados por temas.",
                description: "Apuntes en PDF ultra prolijos y limpios que cubren todo el plan de estudios, desde el modelo OSI y TCP/IP hasta enrutamiento OSPF y seguridad en capa 2.\n\nContiene los resúmenes de cada parcial e incluye ejemplos resueltos de direccionamiento IP e IPv6 paso a paso.",
                size: "24.5 MB",
                date: "12/06/2026",
                so: "Cualquiera",
                format: "PDF",
                icon: "file-text",
                color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
                downloadUrl: "https://drive.google.com/drive/folders/dummy5",
                isFeatured: true,

                fromCloud: false
            },
            {
                id: "formulario-calculo-vectorial",
                name: "Formulario de Cálculo Vectorial & Ecuaciones",
                category: "archivos",
                tagline: "El salvavidas definitivo para el segundo parcial de matemáticas.",
                description: "Documento de una sola página en PDF optimizado para impresión que contiene todas las fórmulas de integrales múltiples, derivadas parciales, teorema de Green, Stokes, Gauss y transformadas de Laplace comunes.",
                size: "4.8 MB",
                date: "30/05/2026",
                so: "Cualquiera",
                format: "PDF",
                icon: "sigma",
                color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                downloadUrl: "https://drive.google.com/drive/folders/dummy7",
                isFeatured: true,

                fromCloud: false
            },
            {
                id: "autocad-hatch-library",
                name: "Librería Completa de Hatches (AutoCAD)",
                category: "plugins",
                tagline: "Más de 500 sombreados de texturas arquitectónicas y estructurales.",
                description: "Ahorra tiempo agregando patrones avanzados como piedras, ladrillos estilizados, mallas metálicas o texturas de césped hiperrealistas para tus planos finales en el taller de dibujo.",
                size: "15.4 MB",
                date: "28/05/2026",
                so: "Windows & macOS",
                format: "PAT",
                icon: "brush",
                color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
                downloadUrl: "https://drive.google.com/drive/folders/dummy9",
                isFeatured: false,

                fromCloud: false
            }
        ];

        // VARIABLES DE ESTADO LOCAL
        let currentCategory = 'programas';
        let currentActiveItem = null;
        let dbEnabled = false;
        let dbInstance = null;
        let authInstance = null;
        let appIdVal = typeof __app_id !== 'undefined' ? __app_id : 'edushare-portales';

        // Arreglos de control para el administrador
        window.recursosSugeridos = [];
        window.reportesCaidos = [];

        // Inicialización y autenticación de base de datos segura para almacenamiento público
        const initCloudDatabase = async () => {
            try {
                const firebaseConfig = {
                    apiKey: "AIzaSyBhGyKRRDL3EDHJYsi5nuQv6NC6AoMMtxw",
                    authDomain: "edushare-6c6dc.firebaseapp.com",
                    projectId: "edushare-6c6dc",
                    storageBucket: "edushare-6c6dc.firebasestorage.app",
                    messagingSenderId: "79794860583",
                    appId: "1:79794860583:web:1be58b82ed5e77b9845402"
                };

                const app = initializeApp(firebaseConfig);
                authInstance = getAuth(app);
                dbInstance = getFirestore(app);

                await signInAnonymously(authInstance);

                dbEnabled = true;

                console.log("🔥 Firebase conectado correctamente");

                listenToCloudData();

            } catch (e) {
                console.error("❌ Error Firebase:", e);
            }
        };


        const categorias = ["programas", "archivos", "plugins"];

        // Escucha en tiempo real de sugerencias y reportes desde la base de datos de Google Drive
        const listenToCloudData = () => {
            if (!dbEnabled || !dbInstance) return;

            // =========================
            // 🔹 SUGERENCIAS
            // =========================
            const suggCol = collection(dbInstance, "sugerencias");

                onSnapshot(suggCol, (snapshot) => {
                    window.recursosSugeridos = [];

                    snapshot.forEach((docSnap) => {
                        const data = docSnap.data();

                        window.recursosSugeridos.push({
                            cloudId: docSnap.id,
                            ...data // ya incluye category
                        });
                    });

                    renderAdminPanel();
                });

            // =========================
            // 🔥 RECURSOS APROBADOS (AQUÍ ESTÁ LA MAGIA)
            // =========================
            const approvedCol = collection(dbInstance, "recursos_aprobados");

                onSnapshot(approvedCol, (snapshot) => {

                    // limpiar solo los de firebase
                    for (let i = resources.length - 1; i >= 0; i--) {
                        if (resources[i].fromCloud) {
                            resources.splice(i, 1);
                        }
                    }

                    snapshot.forEach((docSnap) => {
                        resources.push({
                            id: docSnap.id,
                            fromCloud: true,
                            ...docSnap.data()
                        });
                    });

                    renderCategoryItems();
                    renderRecentUploads();
                });

            const repCol = collection(dbInstance, "reportes_enlaces");

                onSnapshot(repCol, (snapshot) => {
                    window.reportesCaidos = [];

                    snapshot.forEach((docSnap) => {
                        window.reportesCaidos.push({
                            cloudId: docSnap.id,
                            ...docSnap.data()
                        });
                    });

                    renderAdminPanel();
                });
        };

        // ENVIAR RECURSO DESDE EL PORTAL (Se envía a la base de datos)
            window.handleSubmitRecurso = async (event) => {
                event.preventDefault();

                console.log("🚀 Enviando formulario...");

                // 🔹 Obtener valores seguros
                const getVal = (id) => document.getElementById(id)?.value?.trim() || "";

                const name = getVal('collab-name');
                const category = getVal('collab-category');
                const link = getVal('collab-link');
                const description = getVal('collab-desc');

                const newSuggestion = {
                    name: name || "Sin nombre",
                    category: category || "programas",
                    link: link || "#",
                    icon: getVal('collab-icon') || "terminal",

                    tagline: getVal('collab-tagline'),
                    size: getVal('collab-size') || "Por definir",
                    format: getVal('collab-format') || "Directo / Drive",
                    so: getVal('collab-so') || "Multiplataforma",

                    description: description || "Sin descripción",
                    date: new Date().toLocaleDateString(),

                    timestamp: Date.now()
                };

                console.log("📦 Datos a enviar:", newSuggestion);

                // 🔥 Guardar
                if (dbEnabled && dbInstance) {
                    try {
                         const suggCol = collection(dbInstance, "sugerencias");
                        await addDoc(suggCol, newSuggestion);

                        showToast('Guardado en la nube', `Recurso "${newSuggestion.name}" enviado correctamente.`, 'check-circle');
                    } catch (e) {
                        console.error("❌ Error Firebase:", e);
                    }
                } else {
                    // modo local
                    window.recursosSugeridos.push({
                        cloudId: Date.now().toString(),
                        ...newSuggestion
                    });

                    renderAdminPanel();
                    showToast("Modo local", "Recurso guardado temporalmente", "check-circle");
                }

                // 🔹 Limpiar inputs
                document.getElementById('collab-name').value = '';
                document.getElementById('collab-link').value = '';
                document.getElementById('collab-desc').value = '';

                if (document.getElementById('collab-tagline')) document.getElementById('collab-tagline').value = '';
                if (document.getElementById('collab-size')) document.getElementById('collab-size').value = '';
                if (document.getElementById('collab-format')) document.getElementById('collab-format').value = '';
                if (document.getElementById('collab-so')) document.getElementById('collab-so').value = '';

                // 🔹 Cerrar modal
                closeCollabModal();

                console.log("✅ Formulario enviado correctamente");
            };

            // ACTUALIZAR RECURSO (Solo en la base de datos)
            window.updateResource = async (id, category, newData) => {
                try {
                    await setDoc(
                    doc(dbInstance, "recursos_aprobados", id),
                    newData,
                    { merge: true }
                );

                    showToast("Actualizado", "Recurso actualizado correctamente", "check");

                } catch (e) {
                    console.error("❌ Error actualizando:", e);
                }
            };

        // REPORTAR LINK CAÍDO (Se envía a la base de datos)
            window.reportBrokenLink = async () => {
                if (!currentActiveItem) return;

                if (!dbEnabled || !dbInstance) {
                    console.warn("⚠️ Firebase no listo");
                    return;
                }

                const categoria = currentActiveItem.category || "general";

                const brokenReport = {
                    resourceId: currentActiveItem.id,
                    resourceName: currentActiveItem.name,
                    downloadUrl: currentActiveItem.downloadUrl,
                    category: categoria,
                    timestamp: Date.now(),
                    status: 'pendiente'
                };

                try {
                        const repCol = collection(
                            dbInstance,
                            "reportes_enlaces"
                        );

                        await addDoc(repCol, brokenReport);

                    console.log("✅ Reporte enviado:", brokenReport);

                    showToast(
                        '¡Link Caído Reportado!',
                        'Se envió correctamente.',
                        'alert-triangle'
                    );

                } catch (e) {
                    console.error("❌ Error enviando reporte:", e);
                }
            };

            const getIconByCategory = (category) => {
                if (category === "programas") return "binary";
                if (category === "archivos") return "file-text";
                if (category === "plugins") return "puzzle";
                return "box";
            };

        // CONTROLADOR DE ACCIONES EN PANEL ADMINISTRADOR (APROBAR/RECHAZAR)
            window.approveSuggestion = async (cloudId) => {
                try {

                    const ref = doc(dbInstance, "sugerencias", cloudId);

                    // 🔥 1. PRIMERO toma lo que tienes en memoria (editado)
                    const localItem = window.recursosSugeridos.find(r => r.cloudId === cloudId);

                    if (!localItem) {
                        console.error("❌ No se encontró en memoria");
                        return;
                    }

                    // 🔥 2. GUARDA LOS CAMBIOS EDITADOS EN FIREBASE
                    await setDoc(ref, localItem, { merge: true });

                    // 🔥 3. AHORA SÍ lee actualizado
                    const snap = await getDoc(ref);
                    const item = snap.data();

                    // 🔥 4. CREAR RECURSO FINAL
                    const finalResource = {
                        id: cloudId,

                        name: item.name || "Sin nombre",
                        category: item.category || "programas",

                        tagline: item.tagline || "",
                        description: item.description || "",

                        size: item.size || "Por definir",
                        so: item.so || "Multiplataforma",
                        format: item.format || "Directo",

                        icon: item.icon || getIconByCategory(item.category),

                        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",

                        downloadUrl: item.downloadUrl || item.link || "#",

                        isFeatured: true,
                        fromCloud: true,

                        date: new Date().toLocaleDateString()
                    };

                    // 🔥 5. GUARDAR EN APROBADOS
                    await setDoc(
                        doc(dbInstance, "recursos_aprobados", cloudId),
                        finalResource
                    );

                    // 🔥 6. BORRAR SUGERENCIA
                    await deleteDoc(ref);

                    showToast("Aprobado", "Ahora sí respeta los cambios", "check-circle");

                } catch (e) {
                    console.error("❌ Error aprobando:", e);
                }
            };

        window.removeSuggestion = async (cloudId, categoria) => {
            if (!categoria) {
                console.error("❌ Falta categoria en removeSuggestion");
                return;
            }

            try {
                await deleteDoc(
                    doc(dbInstance, "sugerencias", cloudId)
                );

                console.log("🗑️ Eliminado:", cloudId, categoria);

            } catch (e) {
                console.error("❌ Error eliminando sugerencia:", e);
            }
        };

        window.removeReport = async (cloudId) => {
            try {
                await deleteDoc(
                    doc(dbInstance, "reportes_enlaces", cloudId)
                );

                showToast("Corregido", "Reporte eliminado correctamente", "check-circle");

            } catch (e) {
                console.error("❌ Error eliminando reporte:", e);
            }
        };
            
        // RENDERIZADOR DEL PANEL DE CONTROL PRIVADO (HTML)
        const renderAdminPanel = () => {
            const suggContainer = document.getElementById('admin-suggestions-container');
            const repContainer = document.getElementById('admin-reports-container');

            // Renderizar Sugerencias
            if (window.recursosSugeridos.length === 0) {
                suggContainer.innerHTML = `
                    <div class="text-center py-10 text-gray-500 text-sm">
                        <i data-lucide="check-check" class="w-8 h-8 text-indigo-400 mx-auto mb-2"></i>
                        No hay programas o archivos sugeridos pendientes por revisar.
                    </div>
                `;
            } else {
                suggContainer.innerHTML = '';
                window.recursosSugeridos.forEach(item => {
                    const row = document.createElement('div');
                    row.className = "p-4 bg-gray-900/60 border border-gray-800 rounded-2xl flex flex-col gap-3 justify-between";
                    row.innerHTML = `
                        <div>
                            <span class="text-xs font-bold text-indigo-400 capitalize bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">${item.category}</span>
                            <h4 class="text-white font-bold text-md mt-1.5">${item.name}</h4>
                            <p class="text-gray-400 text-xs mt-1 leading-relaxed">${item.tagline || 'Sin descripción.'}</p>
                            <a href="${item.link}" target="_blank" class="text-xs text-blue-400 hover:underline inline-flex items-center gap-1 mt-2 break-all">
                                <i data-lucide="link" class="w-3 h-3"></i> Enlace Drive
                            </a>
                        </div>
                        <div class="flex gap-2 border-t border-gray-800/80 pt-3">
                            <button class="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 rounded-lg transition-all" id="btn-approve-${item.cloudId}">
                                Aprobar en Web
                            </button>
                            <button class="bg-gray-800 hover:bg-red-950/20 hover:text-red-400 text-gray-400 p-2 rounded-lg transition-all" id="btn-reject-${item.cloudId}" title="Rechazar">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                            </button>
                        </div>
                    `;
                    suggContainer.appendChild(row);

                    // Adjuntar listeners de eventos de manera segura
                    // ✅ BOTÓN APROBAR
                    document.getElementById(`btn-approve-${item.cloudId}`)
                        .addEventListener('click', () => {
                            approveSuggestion(item.cloudId, item.category);
                        });

                    // ✅ BOTÓN RECHAZAR
                    document.getElementById(`btn-reject-${item.cloudId}`)
                        .addEventListener('click', () => {
                            removeSuggestion(item.cloudId, item.category);
                        });
                    });
            }

            // Renderizar Reportes de enlaces rotos
            if (window.reportesCaidos.length === 0) {
                repContainer.innerHTML = `
                    <div class="text-center py-10 text-gray-500 text-sm">
                        <i data-lucide="smile" class="w-8 h-8 text-emerald-400 mx-auto mb-2"></i>
                        ¡Felicitaciones! Todos los enlaces de Drive funcionan perfectamente.
                    </div>
                `;
            } else {
                repContainer.innerHTML = '';
                window.reportesCaidos.forEach(item => {
                    const row = document.createElement('div');
                    row.className = "p-4 bg-gray-900/60 border border-gray-800 rounded-2xl flex flex-col gap-3 justify-between";
                    row.innerHTML = `
                        <div>
                            <div class="flex items-center gap-2 text-yellow-500">
                                <i data-lucide="alert-circle" class="w-4 h-4"></i>
                                <span class="text-xs font-bold uppercase tracking-wider">RECURSO INACCESIBLE</span>
                            </div>
                            <h4 class="text-white font-bold text-md mt-1">${item.resourceName}</h4>
                            <p class="text-xs text-gray-400">
                                Estado: <span class="text-yellow-400">${item.status}</span>
                            </p>
                            <p class="text-gray-500 text-xs mt-1">Identificador del recurso: ${item.resourceId}</p>
                        </div>
                        <div class="flex gap-2 border-t border-gray-800/80 pt-3">
                            <a href="${item.downloadUrl}" target="_blank" class="flex-1 bg-yellow-600/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-600/20 text-xs font-bold py-2 rounded-lg transition-all text-center flex items-center justify-center gap-1">
                                <i data-lucide="search" class="w-3.5 h-3.5"></i> Revisar en Drive
                            </a>
                            <button class="bg-gray-800 hover:bg-emerald-950/20 hover:text-emerald-400 text-gray-400 p-2 rounded-lg transition-all" id="btn-fix-${item.cloudId}" title="Marcar como corregido">
                                <i data-lucide="check-check" class="w-4 h-4"></i>
                            </button>
                        </div>
                    `;
                    repContainer.appendChild(row);

                    // Adjuntar listener de corrección
                    document
                        .getElementById(`btn-fix-${item.cloudId}`)
                        .addEventListener('click', () => {
                        window.removeReport(item.cloudId, item.category);
                    });
                });
            }

            lucide.createIcons();
        };

        // INICIALIZADOR PRINCIPAL
        window.addEventListener('DOMContentLoaded', () => {
            initCloudDatabase();
            lucide.createIcons();
            renderRecentUploads();

            // Atajos de búsqueda en inputs
            document.getElementById('global-search-input').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = e.target.value.trim();
                    if (query) {
                        navigateToCategory('programas');
                        document.getElementById('category-search-input').value = query;
                        filterCategoryItems();
                        e.target.value = '';
                    }
                }
            });

            document.getElementById('home-search').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleHomeSearch();
                }
            });
        });

        // MANEJO DE VISTAS (Navegación dinámica SPA)
        window.navigateTo = (viewId) => {
            document.querySelectorAll('.view-section').forEach(sec => {
                sec.classList.add('hidden');
            });

            const targetView = document.getElementById(`view-${viewId}`);
            if (targetView) {
                targetView.classList.remove('hidden');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            document.getElementById('mobile-menu').classList.add('hidden');
            document.getElementById('menu-icon').setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        };

        window.toggleMobileMenu = () => {
            const menu = document.getElementById('mobile-menu');
            const icon = document.getElementById('menu-icon');
            if (menu.classList.contains('hidden')) {
                menu.classList.remove('hidden');
                icon.setAttribute('data-lucide', 'x');
            } else {
                menu.classList.add('hidden');
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        };

        window.navigateToCategory = (category) => {
            currentCategory = category;
            navigateTo('category');

            const breadcrumb = document.getElementById('category-breadcrumb');
            const title = document.getElementById('category-title');
            const desc = document.getElementById('category-description');

            if (category === 'programas') {
                breadcrumb.innerText = 'Programas';
                title.innerText = 'Repositorio de Programas';
                desc.innerText = 'Instaladores de software y utilidades listos para tus clases prácticas.';
            } else if (category === 'archivos') {
                breadcrumb.innerText = 'Archivos y Apuntes';
                title.innerText = 'Documentos, Guías y Apuntes';
                desc.innerText = 'Guías de estudio, apuntes limpios y plantillas LaTeX organizados.';
            } else if (category === 'plugins') {
                breadcrumb.innerText = 'Plugins';
                title.innerText = 'Plugins, Extensiones y Librerías';
                desc.innerText = 'Bloques CAD, librerías MATLAB y recursos de formateo.';
            }

            document.getElementById('category-search-input').value = '';
            renderCategoryItems();
        };

        window.handleHomeSearch = () => {
            const query = document.getElementById('home-search').value.trim();
            if (!query) return;

            navigateToCategory('programas');
            document.getElementById('category-search-input').value = query;
            filterCategoryItems();
            document.getElementById('home-search').value = '';
        };

        const renderRecentUploads = () => {
            const grid = document.getElementById('recent-uploads-grid');
            const featured = resources.filter(r => r.isFeatured);
            grid.innerHTML = '';

            featured.forEach(item => {
                const card = document.createElement('div');
                card.className = "group bg-brand-card hover:bg-brand-cardHover border border-gray-800 hover:border-indigo-500/50 rounded-2xl p-6 cursor-pointer transition-all duration-300 flex gap-4 items-start shadow-md";
                card.innerHTML = `
                    <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}">
                        <i data-lucide="${item.icon}" class="w-6 h-6"></i>
                    </div>
                    <div class="flex-grow">
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-xs font-bold text-indigo-400 capitalize">${item.category}</span>
                            <span class="text-xs bg-gray-900 border border-gray-800 text-gray-400 px-2.5 py-1 rounded-full font-semibold">${item.size}</span>
                        </div>
                        <h3 class="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors mb-1.5">${item.name}</h3>
                        <p class="text-gray-400 text-sm line-clamp-2">${item.tagline}</p>
                    </div>
                `;
                card.addEventListener('click', () => showResourceDetail(item.id));
                grid.appendChild(card);
            });
            lucide.createIcons();
        };

        const renderCategoryItems = () => {
            const grid = document.getElementById('category-items-grid');
            const noResults = document.getElementById('no-results-state');
            grid.innerHTML = '';

            const filtered = resources.filter(r => r.category === currentCategory);

            if (filtered.length === 0) {
                grid.classList.add('hidden');
                noResults.classList.remove('hidden');
                return;
            }

            grid.classList.remove('hidden');
            noResults.classList.add('hidden');

            filtered.forEach(item => {
                const card = document.createElement('div');
                card.className = "group bg-brand-card border border-gray-800 hover:border-indigo-500/50 rounded-2xl p-6 cursor-pointer transition-all duration-300 flex flex-col h-full hover:-translate-y-1 shadow-lg";
                card.innerHTML = `
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-10 h-10 rounded-xl flex items-center justify-center ${item.color}">
                            <i data-lucide="${item.icon}" class="w-5 h-5"></i>
                        </div>
                        <span class="text-xs bg-gray-900 border border-gray-800 text-gray-400 px-2.5 py-1 rounded-full font-semibold">${item.size}</span>
                    </div>
                    <h3 class="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors mb-2">${item.name}</h3>
                    <p class="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">${item.tagline}</p>
                    
                    <div class="flex items-center justify-between pt-4 border-t border-gray-900 text-xs text-gray-500">
                        <span>S.O: ${item.so}</span>
                        <span class="text-indigo-400 font-bold flex items-center gap-1 group-hover:underline">Detalles <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></span>
                    </div>
                `;
                card.addEventListener('click', () => showResourceDetail(item.id));
                grid.appendChild(card);
            });
            lucide.createIcons();
        };

        function parseDescription(text) {
            if (!text) return '';

            // Convertir saltos de línea a <br>
            let parsed = text.replace(/\n/g, '<br>');

            // Convertir (texto)[link] → <a href="link">texto</a>
            parsed = parsed.replace(
                /\((.*?)\)\[(https?:\/\/.*?)\]/g,
                '<a href="$2" target="_blank" class="text-blue-400 hover:underline">$1</a>'
            );

            return parsed;
        }

        window.filterCategoryItems = () => {
            const query = document.getElementById('category-search-input').value.toLowerCase().trim();
            const grid = document.getElementById('category-items-grid');
            const noResults = document.getElementById('no-results-state');

            const filtered = resources.filter(r => 
                r.category === currentCategory && 
                (r.name.toLowerCase().includes(query) || r.tagline.toLowerCase().includes(query) || r.description.toLowerCase().includes(query))
            );

            grid.innerHTML = '';

            if (filtered.length === 0) {
                grid.classList.add('hidden');
                noResults.classList.remove('hidden');
                return;
            }

            grid.classList.remove('hidden');
            noResults.classList.add('hidden');

            filtered.forEach(item => {
                const card = document.createElement('div');
                card.className = "group bg-brand-card border border-gray-800 hover:border-indigo-500/50 rounded-2xl p-6 cursor-pointer transition-all duration-300 flex flex-col h-full hover:-translate-y-1 shadow-lg";
                card.innerHTML = `
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-10 h-10 rounded-xl flex items-center justify-center ${item.color}">
                            <i data-lucide="${item.icon}" class="w-5 h-5"></i>
                        </div>
                        <span class="text-xs bg-gray-900 border border-gray-800 text-gray-400 px-2.5 py-1 rounded-full font-semibold">${item.size}</span>
                    </div>
                    <h3 class="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors mb-2">${item.name}</h3>
                    <p class="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">${item.tagline}</p>
                    
                    <div class="flex items-center justify-between pt-4 border-t border-gray-900 text-xs text-gray-500">
                        <span>S.O: ${item.so}</span>
                        <span class="text-indigo-400 font-bold flex items-center gap-1 group-hover:underline">Detalles <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></span>
                    </div>
                `;
                card.addEventListener('click', () => showResourceDetail(item.id));
                grid.appendChild(card);
            });
            lucide.createIcons();
        };

        window.showResourceDetail = (id) => {
            const item = resources.find(r => r.id === id);

            if (!item) {
                navigateTo('error');
                return;
            }

            currentActiveItem = item;
            navigateTo('detail');

            document.getElementById('detail-name').innerText = item.name || "Sin nombre";
            document.getElementById('detail-tagline').innerText = item.tagline || "Sin subtítulo";
            document.getElementById('detail-size').innerText = item.size || "Por definir";
            document.getElementById('detail-date').innerText = item.date || "Sin fecha";
            document.getElementById('detail-so').innerText = item.so || "Multiplataforma";
            document.getElementById('detail-format').innerText = item.format || "Directo / Drive";

            // 🔥 descripción con links
            document.getElementById('detail-description').innerHTML =
                parseDescription(item.description || "Sin descripción");

            // 🔥 botón descarga
            document.getElementById('detail-download-btn')
                .setAttribute('href', item.downloadUrl || "#");

            // 🔥 ICONO DINÁMICO (ESTO TE FALTABA)
            const iconContainer = document.getElementById('detail-icon');
            if (iconContainer) {
                iconContainer.innerHTML = "";

                const iconEl = document.createElement("i");
                iconEl.setAttribute("data-lucide", item.icon || "box");
                iconEl.className = "w-10 h-10";

                iconContainer.appendChild(iconEl);

                lucide.createIcons();
            }

            lucide.createIcons();
        };

        window.goBackToCategory = () => {
            navigateToCategory(currentCategory);
        };

        window.showToast = (title, msg, icon = 'check') => {
            const toast = document.getElementById('toast');
            const toastIcon = document.getElementById('toast-icon');
            const toastTitle = document.getElementById('toast-title');
            const toastMsg = document.getElementById('toast-message');

            toastIcon.setAttribute('data-lucide', icon);
            toastTitle.innerText = title;
            toastMsg.innerText = msg;
            lucide.createIcons();

            toast.classList.remove('translate-y-20', 'opacity-0');
            toast.classList.add('translate-y-0', 'opacity-100');

            setTimeout(() => {
                toast.classList.remove('translate-y-0', 'opacity-100');
                toast.classList.add('translate-y-20', 'opacity-0');
            }, 5000);
        };

        window.openCollabModal = () => {
            document.getElementById('collab-modal').classList.remove('hidden');
            document.getElementById('collab-modal').classList.add('flex');
        };

        window.closeCollabModal = () => {
            document.getElementById('collab-modal').classList.add('hidden');
            document.getElementById('collab-modal').classList.remove('flex');
        };
