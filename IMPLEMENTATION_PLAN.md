# Plan de Implementación de Funcionalidades Pendientes

Este documento describe el plan y la priorización para implementar las funcionalidades que faltan en el proyecto `TomodachiMusumeNg`, basándose en el prototipo original.

## Orden de Implementación Sugerido

El plan se divide en prioridades para abordar primero las funcionalidades más críticas que bloquean un flujo de juego completo.

---

### Prioridad 1: Flujo de Juego Esencial

Estas son las funcionalidades mínimas para que la experiencia de juego sea coherente y completa desde el inicio hasta el final de una sesión.

1.  **Crear el Sistema de Notificaciones**:
    *   **Objetivo**: Crear un componente y servicio de notificaciones reutilizable para dar feedback al usuario (ej: "Fondos insuficientes", "Compra realizada", "Misión completada").
    *   **Pasos**:
        *   Crear un `NotificationService` que gestione una lista de notificaciones.
        *   Crear un `NotificationComponent` que se suscriba al servicio y muestre las notificaciones en la pantalla (por ejemplo, en una esquina).
        *   Reemplazar todos los comentarios `// TODO: Show notification` y `console.log` de feedback por llamadas al nuevo servicio.

2.  **Implementar la Escena de Introducción (`TutorialComponent`)**:
    *   **Objetivo**: Recrear la escena de introducción del prototipo para que los nuevos jugadores puedan configurar su partida.
    *   **Pasos**:
        *   Desarrollar la UI del `TutorialComponent` para que sea un modal a pantalla completa.
        *   Implementar la lógica de múltiples pasos, similar al prototipo.
        *   Añadir la selección de idioma y la entrada para el nombre del jugador.
        *   Al finalizar, guardar los datos iniciales a través del `GameStateService` y redirigir al jugador a la ruta `/main`.
        *   Modificar el enrutamiento para que, si no hay partida guardada, se redirija a un `/tutorial` en lugar de `/title`.

3.  **Añadir Botón de Guardado en el Menú**:
    *   **Objetivo**: Permitir al jugador guardar la partida en cualquier momento desde el menú principal del juego.
    *   **Pasos**:
        *   Añadir un botón "Guardar" en el `MenuComponent`.
        *   Hacer que el `MenuComponent` emita un evento `(saveGame)`.
        *   En el `LayoutComponent`, escuchar este evento y llamar al método `saveGame()` del `GameStateService`.

---

### Prioridad 2: Interacción y UI Auxiliar

Estas funcionalidades enriquecen la experiencia de juego y completan las acciones disponibles.

1.  **Implementar el Modal de Interacción (`Interact`)**:
    *   **Objetivo**: Crear la interfaz y la lógica para interactuar con el personaje (ej: alimentarlo).
    *   **Pasos**:
        *   Crear un nuevo componente `InteractComponent` que se mostrará como un modal.
        *   Añadir botones para las acciones ("Alimentar", "Jugar Minijuego").
        *   Implementar la lógica de "Alimentar" para que consuma objetos (si es necesario) y modifique las estadísticas (`satiety`, `affinity`) a través de los servicios correspondientes.
        *   Integrar el `InteractComponent` en el `LayoutComponent`.

2.  **Crear el Modal de Opciones**:
    *   **Objetivo**: Permitir al jugador cambiar opciones (como el idioma) durante la partida.
    *   **Pasos**:
        *   Crear un `OptionsComponent` que se muestre como un modal.
        *   Añadir un selector de idioma que, al cambiar, actualice el estado en `GameStateService`.
        *   Integrar el `OptionsComponent` en el `LayoutComponent`.

3.  **Crear el Modal del Libro de Recetas**:
    *   **Objetivo**: Mostrar al jugador las recetas de crafteo que ha descubierto.
    *   **Pasos**:
        *   Crear un `RecipeBookComponent`.
        *   El componente deberá obtener la lista de recetas conocidas (`knownRecipes`) del `GameStateService`.
        *   Mostrará los ingredientes y el resultado de cada receta conocida.
        *   Integrar el `RecipeBookComponent` en el `LayoutComponent` (podría abrirse desde el modal de `Crafting` o desde el `Inventory`).

---

### Prioridad 3: Pulido y Finalización

Pasos finales para asegurar la calidad y estabilidad del juego.

1.  **Revisar `// TODO:` y `console.log`**:
    *   **Objetivo**: Limpiar el código de comentarios temporales y logs de depuración.
    *   **Pasos**:
        *   Buscar en todo el proyecto `// TODO:` y `console.log`.
        *   Implementar las funcionalidades pendientes o eliminar los comentarios si ya no son necesarios.

2.  **Pruebas Generales y Corrección de Errores**:
    *   **Objetivo**: Realizar un recorrido completo por todas las funcionalidades del juego para encontrar y solucionar errores.
    *   **Pasos**:
        *   Probar el flujo de nueva partida.
        *   Probar el guardado y la carga.
        *   Verificar que todas las acciones, modales y botones funcionen como se espera.
        *   Asegurar que las estadísticas se actualizan correctamente.
