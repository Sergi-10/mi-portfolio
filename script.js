// Espera a que el DOM esté completamente cargado antes de ejecutar el código
window.addEventListener("DOMContentLoaded", () => {

  // ===================== MENÚ HAMBURGUESA =====================

  // Obtiene el botón que activa el menú (icono hamburguesa)
  const menuToggle = document.getElementById("menu-toggle");
  // Obtiene el contenedor del menú que se muestra/oculta
  const navbarRight = document.getElementById("navbar-right");
  // Evento al hacer clic en el icono de menú (hamburguesa)
  menuToggle.addEventListener("click", () => {
    // Alterna la clase "active" para mostrar u ocultar el menú
    navbarRight.classList.toggle("active");
    // Cambia el icono: si es "fa-bars" lo cambia a "fa-times", y viceversa
    const icon = menuToggle.querySelector("i");
    icon.classList.toggle("fa-bars");                                    // Oculta o muestra el icono de barras
    icon.classList.toggle("fa-times");                                   // Oculta o muestra el icono de "X"
  });
  // Cierra el menú automáticamente al hacer clic en cualquier enlace del menú
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      // Oculta el menú al quitar la clase "active"
      navbarRight.classList.remove("active");
      // Restaura el icono a hamburguesa (en caso de que estuviera en forma de "X")
      const icon = menuToggle.querySelector("i");
      icon.classList.add("fa-bars");
      icon.classList.remove("fa-times");
    });
  });

  // ===================== MODO CLARO / OSCURO =====================

  // Obtiene el interruptor de modo claro/oscuro (checkbox o toggle)
  const modoToggle = document.getElementById("modo-toggle");
  // Al cambiar el interruptor, alterna la clase "modo-claro" en el <body>
  modoToggle.addEventListener("change", () => {
    document.body.classList.toggle("modo-claro");                         // Cambia entre modo claro y oscuro
  });

  // ===================== Titulos Secciones Escritos Estilo Máquina Escribir =====================
  // Cada objeto contiene el ID del elemento HTML y el texto a mostrar con efecto máquina de escribir
  const titulos = [
    { id: "typing", texto: "Sobre Mí" },
    { id: "typing-tec", texto: "Tecnologías" },
    { id: "typing-portfolio", texto: "Portfolio" },
    { id: "typing-contacto", texto: "Contacto" }
  ];
  // Función que escribe letra a letra el texto
  function escribirMaquina(id, texto) {
    const elemento = document.getElementById(id);                           // Obtiene el elemento por su ID
    if (!elemento) return;                                                  // Si no existe, se sale de la función
    let index = 0;                                                          // Posición actual de la letra que se va a escribir
    // Función interna que maneja el efecto de escritura
    const escribir = () => {
      elemento.innerHTML = "|";                                             // Reinicia el contenido con el cursor inicial
      // Usa setInterval para ir mostrando cada letra cada 200ms
      const intervalo = setInterval(() => {
        if (index < texto.length) {
          // Muestra el texto hasta la letra actual + cursor parpadeante
          elemento.innerHTML = texto.slice(0, index + 1) +
            "<span class='cursor'>|</span>";
          index++;                                                          // Avanza a la siguiente letra
        } else {
          clearInterval(intervalo);                                         // Cuando termina de escribir, detiene el intervalo
          // Después de 5 segundos, reinicia la animación
          setTimeout(() => {
            index = 0;
            escribir();                                                     // Llama de nuevo a sí misma para repetir el efecto
          }, 5000);
        }
      }, 200);
    };
    escribir();                                                             // Inicia la animación de escritura
  }
  // Aplica la animación a todos los títulos definidos
  titulos.forEach(({ id, texto }) => escribirMaquina(id, texto));

  //----------------------------------------------------------------//
  // ===================== Carrusel de imágenes =====================
  //----------------------------------------------------------------//
  const carrusel = document.getElementById("carrusel");
  if (carrusel) {                                                           // Ejecuta el codigo si el carrusel 
    // Clonar el carrusel y posicionarlo a la derecha para efecto infinito
    const duplicado = carrusel.cloneNode(true);                             // Clona el carrusel
    duplicado.id = "carrusel-duplicado";                                    // Cambia el id del clon
    duplicado.style.position = "absolute";                                  // Posiciona el clon de forma absoluta
    duplicado.style.left = `${carrusel.offsetWidth}px`;                     // Coloca el clon a la derecha del original, es decri, al final
    duplicado.style.top = "0";                                              // Alinea el clon al mismo nivel que el original
    carrusel.parentNode.appendChild(duplicado);                             // Añade el clon al DOM

    // Variables de control
    let pos = 0;                                                            // Posición inicial del carrusel
    let detenido = false;                                                   // Controla si el scroll esttá activo o no
    const velocidad = 0.4;                                                  // Velocidad de desplazamiento del carrusel

    // Movimiento automático infinito
    const scrollInfinito = () => {                                          // Bucle anmado que mueve el carrusel de forma infinita   
      if (!detenido) {                                                      // Si no está detenido, mueve el carrusel
        pos -= velocidad;
        // Aplica movimiento al carrusel y al clon                                                  
        carrusel.style.transform = `translateX(${pos}px)`;                  // Movimiento del carrusel original a la izquierda
        duplicado.style.transform = `translateX(${pos}px)`;                 // Movimiento del clon a la izquierda tambien
        if (Math.abs(pos) >= carrusel.offsetWidth) pos = 0;                 // Si el carrusel se ha desplazado completamente, reinicia la posición
      }
      requestAnimationFrame(scrollInfinito);                                // Vuelve a ejecutar el desplazamiento en el frame siguiente
    };
    scrollInfinito();                                                       // Inicia el bucle infinito al cargar la página

    // Pausar/reanudar al hacer clic en cualquier imagen
    ["#carrusel img", "#carrusel-duplicado img"].forEach(selector => {      // Selecciona las imágenes del carrusel original y del clon
      document.querySelectorAll(selector).forEach(img => {
        img.style.cursor = "pointer";                                       // Cambia el cursor al pasar por encima de las imágenes
        img.title = img.alt;                                                // Usa el atributo alt como título de la imagen
        img.addEventListener("click", () => detenido = !detenido);          // Al hacer clic en una imagen, alterna el estado de detenido
      });
    });

    // Arrastrar para mover manualmente
    let arrastrando = false;                                                // Indica si el usuario esta arrastrando
    let inicioX = 0;                                                        // Posición inicial del clic 
    let posInicial = 0;                                                     // Posicial del carrusel antes de arrastrar

    const iniciarArrastre = (e) => {
      detenido = true;                                                      // Pausa el scroll automático mientras se arrastra
      arrastrando = true;
      inicioX = e.clientX || e.touches[0].clientX;                          // Captura la posición del puntero o dedo 
      posInicial = pos;                                                     // Guarda la posición del carrusel tras dejar de moverlo
    };

    const moverArrastre = (e) => {
      if (!arrastrando) return;                                             // No hace nada si no se está arrastrando     
      const actualX = e.clientX || e.touches[0].clientX;                    // Captura la posición del carrusel  
      const desplazamiento = actualX - inicioX;                             // Calcula cuanto se ha movido el carrusel al arrastrar
      // Aplica el desplazamiento al carrusel y al duplicado
      pos = posInicial + desplazamiento;                                    // Calcula la nueva posicion sumando el desplazamiento a la posicion inicial
      carrusel.style.transform = `translateX(${pos}px)`;                    // Aplica el desplazamiento manual al carrusel original         
      duplicado.style.transform = `translateX(${pos}px)`;                   // Aplica el desplazamiento manual al carrusel duplicado
    };

    const detenerArrastre = () => {
      arrastrando = false;                                                  // Para scroll automático al pulsar 
      detenido = false;                                                     // Retoma el scroll automático al soltar
    };

    // Eventos de escritorio
    carrusel.addEventListener("mousedown", iniciarArrastre);
    window.addEventListener("mousemove", moverArrastre);
    window.addEventListener("mouseup", detenerArrastre);

    // Eventos móviles
    carrusel.addEventListener("touchstart", iniciarArrastre);
    window.addEventListener("touchmove", moverArrastre);
    window.addEventListener("touchend", detenerArrastre);
  }

  //----------------------------------------------------------------//
  // ===================== Envío Mensaje =====================
  //----------------------------------------------------------------//
  // Obtiene el formulario por su ID
  const formulario = document.getElementById('formulario-contacto');
  // Verifica que el formulario exista antes de aplicar lógica
  if (formulario) {
    // Evento al enviar el formulario
    formulario.addEventListener('submit', async function (e) {
      e.preventDefault(); // Evita que se recargue la página

      // Selecciona el campo de email y todos los campos de entrada (input y textarea)
      const email = this.querySelector('input[type="email"]');
      const campos = this.querySelectorAll('input, textarea');
      const boton = this.querySelector('button');                         // Referencia al botón de envío

      // Verifica si hay campos vacíos
      let camposVacios = false;
      campos.forEach(campo => {
        if (!campo.value.trim()) camposVacios = true;                     // Si el valor está vacío o solo espacios
      });

      // Valida que el correo tenga un formato válido
      const emailValido = validarEmail(email?.value);

      // Si hay algún campo vacío, muestra un aviso y detiene el envío
      if (camposVacios) {
        alert("Por favor, rellena todos los campos.");
        return;
      }

      // Si el correo no es válido, muestra un aviso y detiene el envío
      if (!emailValido) {
        alert("Por favor, introduce un correo electrónico válido.");
        return;
      }

      // Si pasa las validaciones, se prepara el envío con FormData
      const data = new FormData(this);
      try {
        boton.disabled = true; // Desactiva el botón mientras se envía
        mostrarMensajeExito("Enviando mensaje...");                       // Mostrar mensaje mientras espera respuesta

        // Envío de datos al servidor (FormSubmit) usando fetch
        const response = await fetch(this.action, {
          method: this.method,
          body: data,
          headers: { 'Accept': 'application/json' }                       // Indica que espera respuesta JSON
        });

        // Si la respuesta no es exitosa, lanza error para ir al catch
        if (!response.ok) throw new Error("Respuesta no válida");

        // Si fue exitoso, muestra mensaje de éxito flotante y limpia el formulario
        mostrarMensajeExito("Mensaje enviado al correo. En breve me pondré en contacto con usted. ¡Gracias!");
        this.reset();
      } catch (error) {
        // Si falla la petición (por red u otro error), muestra mensaje de error
        alert("Error al enviar el mensaje. Intente de nuevo más tarde.");
      } finally {
        boton.disabled = false; // Reactiva el botón pase lo que pase
      }
    });

    // Muestra un mensaje flotante personalizado con duración de 4 segundos
    function mostrarMensajeExito(texto) {
      // Reutiliza el mensaje si ya existe
      let mensaje = document.querySelector(".mensaje-exito");
      if (!mensaje) {
        mensaje = document.createElement("div");
        mensaje.className = "mensaje-exito";
        document.body.appendChild(mensaje);
      }

      mensaje.innerText = texto;

      // Reinicia animación
      mensaje.style.animation = "none";                                   // Borra animación previa
      void mensaje.offsetWidth;                                           // Fuerza reflow
      mensaje.style.animation = "";                                       // Vuelve a activar animación

      // Elimina el mensaje tras 4 segundos solo si es mensaje final (no "Enviando")
      if (texto !== "Enviando mensaje...") {
        setTimeout(() => mensaje.remove(), 4000);
      }
    }

    // Verifica si el correo electrónico tiene un formato válido usando expresión regular
    function validarEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;                         // Formato básico
      return regex.test(email);
    }
  }

  // ===================== Mensajes Proyectos =====================  
  // Objeto que asocia cada ID de botón con su mensaje correspondiente
  const mensajes = {
    "demo-findoutmole": "Gracias por tu interés en la demo de FindOutMole. Actualmente, está en desarrollo y estará disponible pronto. ¡Mantente atento!",
    "git-fragrances": "La aplicación está en desarrollo, pronto estará disponible. ¡Mantente atento!",
    "demo-fragrances": "Gracias por tu interés en la demo de Empire Of Fragrances. Actualmente, la aplicación está en desarrollo y la demo estará disponible pronto. ¡Mantente atento!"
  };
  // Recorre cada clave del objeto (que coincide con un ID de botón)
  Object.keys(mensajes).forEach(id => {
    const boton = document.getElementById(id);                            // Busca el botón por su ID
    // Si el botón existe en el DOM, le añade el evento de clic
    if (boton) {
      boton.addEventListener("click", function (e) {
        e.preventDefault(); // Evita que el enlace siga su ruta (por ejemplo, si tiene href="#")
        // Muestra una alerta personalizada usando SweetAlert2
        Swal.fire({
          title: 'Hola 👋',                                               // Título del popup
          text: mensajes[id],                                             // Texto personalizado según el botón
          icon: 'info',                                                   // Icono de tipo informativo
          confirmButtonText: 'Cerrar'                                     // Texto del botón de cerrar
        });
      });
    }
  });
});
