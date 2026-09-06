/* SHOW MENU */
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)
    
    /* Validate that variables exist */
    if(toggle && nav){
        toggle.addEventListener('click', ()=>{
            /* We add the show-menu class to the div tag with the nav__menu class */
            nav.classList.toggle('show-menu')
        })
    }
}
showMenu('nav-toggle','nav-menu')

/* REMOVE MENU MOBILE */
const navLink = document.querySelectorAll('.nav_link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    /* When we click on each nav__link, we remove the show-menu class */
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/* SCROLL SECTIONS ACTIVE LINK */
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50;
        const sectionId = current.getAttribute('id')

        /* The markup uses single-underscore BEM (.nav_menu), so the old
           '.nav__menu' selector matched nothing and threw on every scroll. */
        const link = document.querySelector('.nav_menu a[href*="' + sectionId + '"]')
        if(!link) return

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            link.classList.add('active-link')
        }else{
            link.classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/* SHOW SCROLL TOP */ 
function scrollTop(){
    /* The element id in the markup is 'scrolltop', not 'scroll-top' -- the
       old lookup returned null and threw on every scroll event. */
    const scrollTopBtn = document.getElementById('scrolltop');
    if(!scrollTopBtn) return

    /* Show the button once the page has scrolled past 200px */
    if(window.scrollY >= 200) scrollTopBtn.classList.add('show-scroll'); else scrollTopBtn.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollTop)

/* DARK LIGHT THEME */ 
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'bx-sun'

/* Previously selected topic (if user selected) */
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

/* We obtain the current theme that the interface has by validating the dark-theme class */
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'bx-moon' : 'bx-sun'

/* We validate if the user previously chose a topic */
if (selectedTheme) {
  /* If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark */
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'bx-moon' ? 'add' : 'remove'](iconTheme)
}

/* Activate / deactivate the theme manually with the button */
themeButton.addEventListener('click', () => {
    /* Add or remove the dark / icon theme */
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    /* We save the theme and the current icon that the user chose */
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})

/* REDUCE THE SIZE AND PRINT ON AN A4 SHEET */
function scaleCv(){
    document.body.classList.add('scale-cv')

    // Make all sections visible for PDF and clear any stagger delay left
    // by the reveal animation (inline styles beat the stylesheet, so these
    // have to be cleared here rather than only in CSS).
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('section-visible');
        section.style.transitionDelay = '0s';
    });

    // Remove typing animation styling for PDF
    const nameElement = document.querySelector('.home_title');
    if(nameElement) {
        nameElement.style.borderRight = 'none';
        nameElement.style.animation = 'none';
        nameElement.style.overflow = 'visible';
        nameElement.style.whiteSpace = 'normal';
    }
}

/* REMOVE THE SIZE WHEN THE CV IS DOWNLOADED */
function removeScale(){
    document.body.classList.remove('scale-cv')

    // Undo the inline overrides scaleCv() applied to the title
    const nameElement = document.querySelector('.home_title');
    if(nameElement) {
        nameElement.style.borderRight = '';
        nameElement.style.animation = '';
        nameElement.style.overflow = '';
        nameElement.style.whiteSpace = '';
    }
}

/* GENERATE PDF */ 

/* PDF generated area */
let areaCv = document.getElementById('area-cv')

let resumeButton = document.getElementById('resume-button')

/* Html2pdf options.
   `margin` gives the slicer room to move a block down instead of cutting it,
   and `pagebreak.mode` makes html2pdf honour the CSS break rules in
   styles.css. Without 'css' in that list the break-inside rules are ignored
   and content is split mid-element. */
let opt = {
  margin:       [10, 8, 12, 8], // top, left, bottom, right (mm)
  filename:     'Muhammad-Hamza-Khalil-Resume.pdf',
  image:        { type: 'jpeg', quality: 0.98 },
  html2canvas:  { scale: 2, useCORS: true, letterRendering: true, scrollY: 0, windowWidth: 900 },
  jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
  pagebreak:    {
    mode:  ['css', 'legacy'],
    avoid: ['li', '.experience_content', '.certificate_content',
            '.references_content', '.education_content', '.interests_content']
  }
};

/* Function to call areaCv and Html2Pdf options.
   Returns the promise so the caller can restore the page only once the
   render has actually finished. */
function generateResume(){
    return html2pdf().set(opt).from(areaCv).save();
}

/* When the button is clicked, it executes the three functions */
resumeButton.addEventListener('click', () => {

    /* 1. Switch to PDF layout: .scale-cv shrinks type and collapses the
          two-column grid into a single flow. */
    scaleCv()

    /* 2. Wait for the browser to finish reflowing and for webfonts to settle
          before capturing. scaleCv() changes the layout substantially, and
          capturing on the same tick photographs the OLD two-column layout at
          the NEW font sizes -- which is what splits content across pages.
          Two rAFs guarantee a completed layout pass. */
    const afterReflow = new Promise(resolve => {
        requestAnimationFrame(() => requestAnimationFrame(resolve))
    })

    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve()

    /* 3. Generate, then restore the page only once the render has finished.
          Removing the class early (or on a fixed timer) changes the layout
          mid-capture and corrupts the output. */
    Promise.all([afterReflow, fontsReady])
        .then(() => generateResume())
        .then(() => removeScale())
        .catch((error) => {
            console.error('PDF generation failed:', error)
            removeScale()
        })
})

/* SCROLL REVEAL ANIMATION
   IntersectionObserver replaces the old scroll handler: it fires only when a
   section actually crosses the viewport instead of re-measuring every element
   on each scroll event. Sections already on screen at load are staggered so
   they arrive in sequence rather than all at once. */
const revealSections = () => {
    const sections = document.querySelectorAll('.section');

    // No observer support (or reduced motion) -> just show everything.
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!('IntersectionObserver' in window) || prefersReducedMotion) {
        sections.forEach(section => section.classList.add('section-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                observer.unobserve(entry.target); // reveal once, then stop watching
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

    const viewportHeight = window.innerHeight;
    let staggerIndex = 0;

    sections.forEach(section => {
        const isAlreadyVisible = section.getBoundingClientRect().top < viewportHeight;

        if(isAlreadyVisible) {
            // Stagger the initial paint, capped so nothing waits too long.
            section.style.transitionDelay = `${Math.min(staggerIndex * 90, 540)}ms`;
            staggerIndex++;
            requestAnimationFrame(() => section.classList.add('section-visible'));
        } else {
            observer.observe(section);
        }
    });

    // Drop the delays once the opening sequence is done, so later
    // scroll-triggered reveals are immediate.
    setTimeout(() => {
        sections.forEach(section => { section.style.transitionDelay = ''; });
    }, 1200);
}

window.addEventListener('load', revealSections);

/* TYPING ANIMATION FOR NAME */
const nameElement = document.querySelector('.home_title');
if(nameElement) {
    nameElement.style.display = 'inline-block';
    nameElement.classList.add('typing-animation');

    // Remove animation after it completes
    setTimeout(() => {
        nameElement.style.borderRight = 'none';
        nameElement.style.animation = 'none';
    }, 4000);
}

/* SMOOTH SCROLL FOR NAVIGATION LINKS */
const navLinks = document.querySelectorAll('.nav_link');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if(targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ADD ANIMATION TO ELEMENTS ON HOVER */
const addHoverAnimation = (selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Apply hover animations
addHoverAnimation('.certificate_content');
addHoverAnimation('.references_content');

/* PROGRESSIVE COUNTER ANIMATION FOR EXPERIENCE YEARS */
const animateValue = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}