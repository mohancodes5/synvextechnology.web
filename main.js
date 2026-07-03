/*
  Synvex Technology - Interactive JS Controller
  Features: Loading screen dismissal, dark/light theme manager, sticky navbar,
  mobile burger toggle, FAQ accordion, scroll reveal observers, statistical counters, and form validation.
*/

document.addEventListener('DOMContentLoaded', () => {
  const dismissPreloader = () => {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    preloader.style.opacity = '0';
    preloader.style.visibility = 'hidden';

    window.setTimeout(() => {
      if (preloader.parentNode) {
        preloader.remove();
      }
    }, 400);
  };

  window.addEventListener('load', dismissPreloader);
  dismissPreloader();
  window.setTimeout(dismissPreloader, 2500);

  try {
    // =========================================================================
    // 1. Light / Dark Theme Manager
  // =========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme');

  // Set default preference if cached
  if (currentTheme === 'light') {
    document.documentElement.classList.add('light-theme');
  }

  // Toggle Theme on Click
  themeToggleBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('light-theme');
    
    // Save selection
    let theme = 'dark';
    if (document.documentElement.classList.contains('light-theme')) {
      theme = 'light';
    }
    localStorage.setItem('theme', theme);
  });


  // =========================================================================
  // 3. Mobile Navigation Menu
  // =========================================================================
  const burgerToggle = document.getElementById('burger-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Toggle hamburger and nav menu active states
  burgerToggle.addEventListener('click', () => {
    const isExpanded = burgerToggle.getAttribute('aria-expanded') === 'true';
    burgerToggle.setAttribute('aria-expanded', !isExpanded);
    burgerToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when links are clicked (useful for anchors on single page)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      burgerToggle.setAttribute('aria-expanded', 'false');
      burgerToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });


  // =========================================================================
  // 4. Sticky Header & Scroll Position Progress
  // =========================================================================
  const header = document.getElementById('main-header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });


  // =========================================================================
  // 5. Scroll Active Link Indicator
  // =========================================================================
  const sections = document.querySelectorAll('section');
  
  const navObserverOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Highlighting menu links when sections cross mid-screen
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(section => {
    navObserver.observe(section);
  });


  // =========================================================================
  // 6. Scroll Reveal Observer
  // =========================================================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  const revealObserverOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px', // Trigger slightly before element enters view
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve to keep static reveal after initial scroll
        observer.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });


  // =========================================================================
  // 7. Stat Numeric Counters (About Section)
  // =========================================================================
  const statsElements = document.querySelectorAll('.stat-num');
  
  const countToVal = (el) => {
    const targetValue = parseInt(el.getAttribute('data-val'), 10);
    const suffix = el.querySelector('span') ? el.querySelector('span').outerHTML : '';
    let startValue = 0;
    const duration = 2000; // Counter takes 2 seconds to complete
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = targetValue / steps;
    
    let currentStep = 0;
    
    const counterTimer = setInterval(() => {
      currentStep++;
      startValue += increment;
      
      if (currentStep >= steps) {
        clearInterval(counterTimer);
        el.innerHTML = targetValue + suffix;
      } else {
        el.innerHTML = Math.floor(startValue) + suffix;
      }
    }, stepDuration);
  };

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countToVal(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statsElements.forEach(el => {
    statsObserver.observe(el);
  });


  // =========================================================================
  // 8. FAQ Accordion Action
  // =========================================================================
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const faqItem = header.parentElement;
      const faqBody = faqItem.querySelector('.faq-body');
      const isExpanded = header.getAttribute('aria-expanded') === 'true';

      // Close all other open items for accordion behavior
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem && item.classList.contains('active')) {
          item.classList.remove('active');
          item.querySelector('.faq-header').setAttribute('aria-expanded', 'false');
          item.querySelector('.faq-body').style.maxHeight = '0px';
        }
      });

      // Toggle current item
      if (isExpanded) {
        header.setAttribute('aria-expanded', 'false');
        faqItem.classList.remove('active');
        faqBody.style.maxHeight = '0px';
      } else {
        header.setAttribute('aria-expanded', 'true');
        faqItem.classList.add('active');
        faqBody.style.maxHeight = `${faqBody.scrollHeight}px`;
      }
    });
  });


  // =========================================================================
  // 9. Client-side Form Validation (FormSubmit)
  // =========================================================================
  const inquiryForm = document.getElementById('inquiry-form');
  const nameInput = document.getElementById('full-name');
  const emailInput = document.getElementById('email-addr');
  const phoneInput = document.getElementById('phone-num');
  const projectInput = document.getElementById('project-type');
  const messageInput = document.getElementById('message');

  const setError = (element, errorElId, message) => {
    const errorEl = document.getElementById(errorElId);
    element.classList.add('error');
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  };

  const clearError = (element, errorElId) => {
    const errorEl = document.getElementById(errorElId);
    element.classList.remove('error');
    errorEl.style.display = 'none';
  };

  // Helper validation functions
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  };

  const isValidPhone = (phone) => {
    // Allows country codes, parentheses, dashes, and standard 8-15 digit range
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;
    return phoneRegex.test(phone.trim());
  };

  // Real-time Validation Triggers
  nameInput.addEventListener('input', () => {
    if (nameInput.value.trim() !== '') {
      clearError(nameInput, 'name-error');
    }
  });

  emailInput.addEventListener('input', () => {
    if (isValidEmail(emailInput.value)) {
      clearError(emailInput, 'email-error');
    }
  });

  phoneInput.addEventListener('input', () => {
    if (isValidPhone(phoneInput.value)) {
      clearError(phoneInput, 'phone-error');
    }
  });

  projectInput.addEventListener('change', () => {
    if (projectInput.value !== '') {
      clearError(projectInput, 'project-error');
    }
  });

  messageInput.addEventListener('input', () => {
    if (messageInput.value.trim().length >= 15) {
      clearError(messageInput, 'message-error');
    }
  });

  // Submit Handler
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      let hasError = false;

      // Validate Name
    if (nameInput.value.trim() === '') {
      setError(nameInput, 'name-error', 'Please enter your full name.');
      hasError = true;
    } else {
      clearError(nameInput, 'name-error');
    }

    // Validate Email
    if (!isValidEmail(emailInput.value)) {
      setError(emailInput, 'email-error', 'Please enter a valid email address (e.g., mail@domain.com).');
      hasError = true;
    } else {
      clearError(emailInput, 'email-error');
    }

    // Validate Phone
    if (!isValidPhone(phoneInput.value)) {
      setError(phoneInput, 'phone-error', 'Please enter a valid phone number (minimum 7 digits).');
      hasError = true;
    } else {
      clearError(phoneInput, 'phone-error');
    }

    // Validate Project Type
    if (projectInput.value === '') {
      setError(projectInput, 'project-error', 'Please choose a project type from the list.');
      hasError = true;
    } else {
      clearError(projectInput, 'project-error');
    }

    // Validate Message
    if (messageInput.value.trim().length < 15) {
      setError(messageInput, 'message-error', 'Description must be at least 15 characters long.');
      hasError = true;
    } else {
      clearError(messageInput, 'message-error');
    }

      // Block submission if errors exist
      if (hasError) {
        e.preventDefault();
        
        // Scroll to the first error element smoothly
        const firstError = document.querySelector('.form-input.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
      }
    });
  }

  } catch (error) {
    console.error('Synvex page initialization failed:', error);
    dismissPreloader();
  }

});
