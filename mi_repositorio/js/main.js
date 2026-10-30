
// Esperar a que el HTML esté cargado
document.addEventListener('DOMContentLoaded', () => {

  // ========================================
  // 1. MODO CLARO Y OSCURO
  // ========================================

  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const startDark = savedTheme ? savedTheme === 'dark' : prefersDark;

  document.documentElement.classList.toggle('dark', startDark);
  updateThemeIcon();

  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');

    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');

    updateThemeIcon();
  });

  function updateThemeIcon() {
    const isDark = document.documentElement.classList.contains('dark');

    themeIcon.className = isDark
      ? 'fas fa-sun text-yellow-400'
      : 'fas fa-moon text-gray-600';
  }


  // ========================================
  // 2. MENÚ MÓVIL
  // ========================================

  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');

    const isOpen = !mobileMenu.classList.contains('hidden');
    mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    });
  });


  // ========================================
  // 3. BARRA DE PROGRESO
  // ========================================

  const progressBar = document.getElementById('scroll-progress');

  function updateProgress() {
    const totalHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress = totalHeight > 0
      ? (window.scrollY / totalHeight) * 100
      : 0;

    progressBar.style.width = `${progress}%`;
  }

  window.addEventListener('scroll', updateProgress);
  updateProgress();


  // ========================================
  // 4. FILTROS DE PROYECTOS
  // ========================================

  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(item => item.classList.remove('active'));
      button.classList.add('active');

      const selectedFilter = button.dataset.filter;

      projectCards.forEach(card => {
        const categories = (card.dataset.category || '').split(' ');
        const shouldShow =
          selectedFilter === 'all' || categories.includes(selectedFilter);

        card.style.display = shouldShow ? 'flex' : 'none';
      });
    });
  });


  
  // ========================================
  // 5. MODAL DE PROYECTOS
  // ========================================

  const modal = document.getElementById('project-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const modalTech = document.getElementById('modal-tech');
  const modalRepo = document.getElementById('modal-repo');

  // Abrir y mostrar los detalles del proyecto
  document.querySelectorAll('.open-modal-btn').forEach(button => {
    button.addEventListener('click', event => {

      const card = event.currentTarget.closest('.project-card');

      if (!card) return;

      const title = card.dataset.title || 'Proyecto';
      const description = card.dataset.description || '';
      const tech = card.dataset.tech || '';
      const repoUrl = (card.dataset.repo || '').trim();

      // Mostrar información
      modalTitle.textContent = title;
      modalDescription.textContent = description;
      modalTech.textContent = tech;

      // Mostrar enlace al repositorio
      if (repoUrl.startsWith('https://github.com/')) {
        modalRepo.href = repoUrl;
        modalRepo.classList.remove('hidden');
      } else {
        modalRepo.href = 'https://github.com/juandonoso1661';
      }

      // Abrir ventana
      modal.classList.add('open');
      closeModalBtn.focus();
    });
  });

  // Cerrar ventana
  function closeModal() {
    modal.classList.remove('open');
  }

  closeModalBtn.addEventListener('click', closeModal);

  // Cerrar al hacer clic fuera de la ventana
  modal.addEventListener('click', event => {
    if (event.target === modal) {
      closeModal();
    }
  });

  // Cerrar con Escape
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeModal();
    }
  });



  // ========================================
  // 6. ACORDEÓN DE EJERCICIOS
  // ========================================

  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const icon = header.querySelector('i');

      content.classList.toggle('hidden');

      if (icon) {
        icon.classList.toggle('rotate-180');
      }
    });
  });


  // ========================================
  // 7. COPIAR CORREO
  // ========================================

  const copyEmailBtn = document.getElementById('copy-email-btn');
  const emailText = document.getElementById('email-text').textContent.trim();

  copyEmailBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(emailText);
      copyEmailBtn.textContent = '¡Copiado!';

      setTimeout(() => {
        copyEmailBtn.textContent = 'Copiar correo';
      }, 2000);
    } catch (error) {
      window.prompt('Copia este correo:', emailText);
    }
  });


  // ========================================
  // 8. FORMULARIO DE CONTACTO
  // ========================================

  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  contactForm.addEventListener('submit', event => {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      formStatus.textContent = 'Completa todos los campos antes de continuar.';
      formStatus.className = 'text-sm mt-3 text-red-600 block';
      return;
    }

    const subject = encodeURIComponent(`Mensaje desde el portafolio de ${name}`);
    const body = encodeURIComponent(
      `Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`
    );

    formStatus.textContent = 'Se abrirá tu aplicación de correo para enviar el mensaje.';
    formStatus.className = 'text-sm mt-3 text-green-600 dark:text-green-400 block';

    window.location.href =
      `mailto:juanjosedonoso.2008@gmail.com?subject=${subject}&body=${body}`;
  });

});
