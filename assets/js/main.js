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
const navLink = document.querySelectorAll('.nav__link')

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

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
        }else{
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/* SHOW SCROLL TOP */ 
function scrollTop(){
    const scrollTop = document.getElementById('scroll-top');
    /* When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top class */
    if(this.scrollY >= 200) scrollTop.classList.add('show-scroll'); else scrollTop.classList.remove('show-scroll')
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

    // Make all sections visible for PDF
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('section-visible');
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
}

/* GENERATE PDF */ 

/* PDF generated area */
let areaCv = document.getElementById('area-cv')

let resumeButton = document.getElementById('resume-button')

/* Html2pdf options */
let opt = {
  margin:       0,
  filename:     'Muhammad-hamza-Resume.pdf',
  image:        { type: 'jpeg', quality: 0.98 },
  html2canvas:  { scale: 4 },
  jsPDF:        { format: 'a4', orientation: 'portrait' }
};

/* Function to call areaCv and Html2Pdf options */
    function generateResume(){
        try {
           var pedf = html2pdf(areaCv, opt)  ;
           pedf.save('my.pdf')
            console.log('success ',pedf) 
        } catch (error) {
            console.log('err is ',error)
        }
  
}

/* When the button is clicked, it executes the three functions */
    resumeButton.addEventListener('click', () =>{

    /* 1. The class .scale-cv is added to the body, where it reduces the size of the elements */
    scaleCv()

    /* 2. The PDF is generated */
    generateResume()

    /* 3. The .scale-cv class is removed from the body after 5 seconds to return to normal size. */
       // setTimeout(removeScale, 5000)
})

/* SCROLL REVEAL ANIMATION */
const revealSection = () => {
    const sections = document.querySelectorAll('.section');
    const windowHeight = window.innerHeight;

    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const revealPoint = 150;

        if(sectionTop < windowHeight - revealPoint) {
            section.classList.add('section-visible');
        }
    });
}

// Initial check for sections already in view
window.addEventListener('load', revealSection);
window.addEventListener('scroll', revealSection);

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