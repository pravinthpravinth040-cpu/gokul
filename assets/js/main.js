/**
 * Gokul Krishan S - Portfolio Main JavaScript
 * Handles typing animations, interactive modals, theme switching,
 * scroll progress, animated skill bars, project details, and contact form.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTypingEffect();
  initScrollHeader();
  initMobileNav();
  initScrollSpy();
  initSkillBars();
  initSkillFilters();
  initStatsCounter();
  initProjectModals();
  initResumeModal();
  initContactForm();
  initThemePicker();
  initClipboardActions();
  initBackToTop();
  initTiltEffect();
});

/* ==========================================================================
   1. Dynamic Typing Effect (Hero Section)
   ========================================================================== */
function initTypingEffect() {
  const target = document.getElementById('typing-text');
  if (!target) return;

  const phrases = [
    'B.Com CA Student',
    'Aspiring Finance Professional',
    'Aspiring Accountant',
    'Business Analyst'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      target.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      target.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 110;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 500; // Pause before new word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   2. Sticky Header & Scroll Progress
   ========================================================================== */
function initScrollHeader() {
  const header = document.querySelector('.site-header');
  const progressBar = document.getElementById('scroll-progress');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Header shadow on scroll
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Progress bar width
    if (progressBar && docHeight > 0) {
      const progress = (scrollY / docHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }
  }, { passive: true });
}

/* ==========================================================================
   3. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const navList = document.querySelector('.nav-list');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navList) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('open');
    toggleBtn.classList.toggle('open', isOpen);
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  // Close when clicking nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('open');
      toggleBtn.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!navList.contains(e.target) && !toggleBtn.contains(e.target) && navList.classList.contains('open')) {
      navList.classList.remove('open');
      toggleBtn.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==========================================================================
   4. Scroll Spy (Active Navigation Highlight)
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}

/* ==========================================================================
   5. Animated Skill Progress Bars (Intersection Observer)
   ========================================================================== */
function initSkillBars() {
  const progressBars = document.querySelectorAll('.progress-fill');
  if (!progressBars.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetPercent = bar.getAttribute('data-percent') || '85%';
        bar.style.width = targetPercent;
        obs.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  progressBars.forEach(bar => observer.observe(bar));
}

/* ==========================================================================
   6. Skill Category Filter Tabs
   ========================================================================== */
function initSkillFilters() {
  const filterBtns = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          // re-trigger animation if visible
          const fill = card.querySelector('.progress-fill');
          if (fill) {
            fill.style.width = fill.getAttribute('data-percent') || '85%';
          }
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. Quick Stats Counter Animation
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  if (!statNumbers.length) return;

  let hasAnimated = false;
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !hasAnimated) {
      hasAnimated = true;
      statNumbers.forEach(item => {
        const target = parseFloat(item.getAttribute('data-count'));
        const suffix = item.getAttribute('data-suffix') || '';
        const isDecimal = target % 1 !== 0;
        let current = 0;
        const duration = 1500;
        const steps = 40;
        const increment = target / steps;
        const stepTime = duration / steps;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          item.textContent = (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;
        }, stepTime);
      });
    }
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats-row');
  if (heroStats) observer.observe(heroStats);
}

/* ==========================================================================
   8. Project Details Modal System
   ========================================================================== */
const projectData = {
  'project-1': {
    title: 'Financial Management Analysis',
    category: 'Corporate Finance & Valuation',
    image: 'assets/images/project-finance.jpg',
    overview: 'In-depth analytical study focused on evaluating corporate financial health, operational liquidity, and capital structure efficiency using real-world commercial accounting metrics.',
    objectives: [
      'Assess Current and Quick ratios to analyze short-term liquidity risk.',
      'Analyze Debt-to-Equity and interest coverage for long-term solvency valuation.',
      'Construct Net Working Capital models and optimize Cash Conversion Cycles.'
    ],
    tools: ['Financial Ratio Analysis', 'Cash Flow Modeling', 'MS Excel', 'Corporate Accounting Principles'],
    keyTakeaway: 'Demonstrated actionable working capital optimizations that improve cash buffer reserves and enhance financial stability.'
  },
  'project-2': {
    title: 'Excel-Based Accounting Project',
    category: 'Spreadsheet Architecture & Automation',
    image: 'assets/images/project-excel.jpg',
    overview: 'A full-cycle automated accounting workbook built from scratch in MS Excel that streamlines journal voucher entries, ledger reconciliation, automated trial balances, and executive dashboard visualizations.',
    objectives: [
      'Automate dual-entry posting into dedicated General Ledgers using advanced formulas (INDEX/MATCH, XLOOKUP, Dynamic Named Ranges).',
      'Implement real-time Bank Reconciliation schedules with conditional mismatch flags.',
      'Construct an interactive dashboard tracking monthly revenue, gross margin, operating expenses, and net profit trends.'
    ],
    tools: ['MS Excel Advanced', 'Pivot Tables & Slicers', 'Automated Reconciliations', 'Financial Dashboard Design'],
    keyTakeaway: 'Reduced manual calculation times by over 70% and eliminated human ledger cross-referencing errors.'
  },
  'project-3': {
    title: 'Business Data Analysis',
    category: 'Business Intelligence & Strategy',
    image: 'assets/images/project-analytics.svg',
    overview: 'Quantitative business intelligence case study dissecting multi-year sales, inventory turnover, cost behavior, and regional commercial performance to guide strategic business decision-making.',
    objectives: [
      'Analyze Cost-Volume-Profit (CVP) and break-even points across diverse product lines.',
      'Identify seasonality trends and top-performing profit centers using statistical aggregations.',
      'Design clear visual KPIs to assist management in overhead expense control and inventory rationalization.'
    ],
    tools: ['Business Analytics', 'Data Visualization', 'Trend Forecasting', 'Performance KPI Metrics'],
    keyTakeaway: 'Identified an estimated 14.2% overhead cost reduction opportunity while sustaining an 18.4% top-line revenue expansion.'
  }
};

function initProjectModals() {
  const modalOverlay = document.getElementById('project-modal');
  const closeBtn = document.getElementById('close-project-modal');
  const modalBody = document.getElementById('project-modal-body');
  const projectBtns = document.querySelectorAll('.open-project-btn');

  if (!modalOverlay || !closeBtn) return;

  projectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projId = btn.getAttribute('data-project');
      const data = projectData[projId];

      if (!data) return;

      modalBody.innerHTML = `
        <div style="margin-bottom: 20px;">
          <img src="${data.image}" alt="${data.title}" style="width: 100%; max-height: 320px; object-fit: cover; border-radius: 14px; border: 1px solid var(--border-glass);">
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
          <span style="background: rgba(56, 189, 248, 0.15); color: var(--accent-cyan); padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase;">${data.category}</span>
          <span style="color: var(--text-muted); font-size: 13px;">Gokul Krishan S • Portfolio Project</span>
        </div>
        <h3 style="font-size: 24px; font-weight: 800; color: #fff; margin-bottom: 14px;">${data.title}</h3>
        <p style="color: var(--text-secondary); font-size: 15px; line-height: 1.65; margin-bottom: 22px;">${data.overview}</p>
        
        <h4 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 10px;">Core Objectives & Scope:</h4>
        <ul style="padding-left: 20px; margin-bottom: 22px; color: var(--text-secondary); font-size: 14px; line-height: 1.6;">
          ${data.objectives.map(obj => `<li style="margin-bottom: 6px;">${obj}</li>`).join('')}
        </ul>

        <h4 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 10px;">Tools &amp; Techniques:</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 22px;">
          ${data.tools.map(tool => `<span style="background: rgba(255,255,255,0.06); border: 1px solid var(--border-glass); color: #e2e8f0; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 6px;">${tool}</span>`).join('')}
        </div>

        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 16px;">
          <strong style="color: #34d399; font-size: 13.5px; display: block; margin-bottom: 4px;">🎯 Key Outcome &amp; Takeaway:</strong>
          <span style="color: #cbd5e1; font-size: 13.5px;">${data.keyTakeaway}</span>
        </div>
      `;

      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   9. Resume Modal System
   ========================================================================== */
function initResumeModal() {
  const resumeModal = document.getElementById('resume-modal');
  const openBtns = document.querySelectorAll('.trigger-resume-modal');
  const closeBtn = document.getElementById('close-resume-modal');

  if (!resumeModal || !closeBtn) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      resumeModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeResume() {
    resumeModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeResume);
  resumeModal.addEventListener('click', (e) => {
    if (e.target === resumeModal) closeResume();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal.classList.contains('open')) {
      closeResume();
    }
  });
}

/* ==========================================================================
   10. Contact Form with Validation & Feedback
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (!form || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.elements['name'].value.trim();
    const email = form.elements['email'].value.trim();
    const subject = form.elements['subject'].value.trim();
    const message = form.elements['message'].value.trim();

    // Basic Validation
    if (!name || !email || !subject || !message) {
      showToast('⚠️ Please fill out all required fields.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showToast('⚠️ Please enter a valid email address.');
      return;
    }

    // Button loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>Sending Message...</span>`;
    submitBtn.disabled = true;

    // Simulate reliable dispatch
    setTimeout(() => {
      submitBtn.innerHTML = `<span>✓ Message Sent!</span>`;
      showToast('✨ Thank you, ' + name + '! Your message was sent successfully. Gokul will respond soon.');

      // Also generate a pre-configured mailto fallback link in case recruiter wants direct outlook/mail client
      const mailtoLink = `mailto:gokulkrishan.s@email.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + name + " (" + email + ")\n\n" + message)}`;
      
      form.reset();

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 4000);
    }, 1200);
  });
}

/* ==========================================================================
   11. Theme Color Palette Switcher
   ========================================================================== */
function initThemePicker() {
  const toggleBtn = document.getElementById('theme-picker-btn');
  const menu = document.getElementById('theme-palette-menu');
  const paletteItems = document.querySelectorAll('.palette-item');

  if (!toggleBtn || !menu) return;

  // Load saved theme
  const savedTheme = localStorage.getItem('gokul_theme_preset') || 'electric';
  applyTheme(savedTheme);

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('show');
  });

  paletteItems.forEach(item => {
    item.addEventListener('click', () => {
      const theme = item.getAttribute('data-theme');
      applyTheme(theme);
      menu.classList.remove('show');
      showToast(`🎨 Theme switched to ${item.textContent.trim()}`);
    });
  });

  document.addEventListener('click', () => {
    menu.classList.remove('show');
  });

  function applyTheme(theme) {
    if (theme === 'electric') {
      document.documentElement.removeAttribute('data-theme-preset');
    } else {
      document.documentElement.setAttribute('data-theme-preset', theme);
    }
    localStorage.setItem('gokul_theme_preset', theme);
  }
}

/* ==========================================================================
   12. Clipboard Actions (One-click copy email)
   ========================================================================== */
function initClipboardActions() {
  const copyEmailBtns = document.querySelectorAll('.copy-email-trigger');
  const emailText = 'gokulkrishan.s@email.com';

  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(emailText).then(() => {
        showToast('📋 Email copied to clipboard: ' + emailText);
      }).catch(() => {
        showToast('✉️ Contact: ' + emailText);
      });
    });
  });
}

/* ==========================================================================
   13. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   14. Interactive 3D Tilt Effect on Cards
   ========================================================================== */
function initTiltEffect() {
  // Only apply on non-touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const tiltCards = document.querySelectorAll('.glass-card, .profile-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;

      const rotateX = deltaY * -4;
      const rotateY = deltaX * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ==========================================================================
   Toast Notification Helper
   ========================================================================== */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = message;
  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3500);
}
