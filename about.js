// ABOUT PAGE TRANSITION
let logo = document.querySelector('.logo');
let backBtn = document.querySelector('.backBtn');

gsap.set('#aboutContent > p', {
    opacity: 0
});
gsap.set(backBtn, {
    opacity: 0
});
let aboutTL = gsap.timeline({
    onComplete: () => {
        logo.classList.add('aboutLogo');
    }
});


aboutTL.from('.aboutBG > .el', {
    opacity: 0,
    duration: 1
});
aboutTL.to('#aboutContent > p', {
    opacity: 1,
    ease: 'power2.inOut',
    delay: 1,
    duration: 1.5
});
aboutTL.to(backBtn, {
    opacity: 1
});


// Back Button Header Element
backBtn.addEventListener('mousemove', () => {
    gsap.to(backBtn, {
        color: 'rgba(1, 242, 207, 1)',
        duration: .5
    });
    gsap.to('.backBtn > p', {
        xPercent: 20,
        ease: 'power2.inOut'
    });
    cursor.classList.add('click');
})
backBtn.addEventListener('mouseleave', () => {
    gsap.to(backBtn, {
        color: '',
        duration: 1
    });
    gsap.to('.backBtn > p', {
        xPercent: 0,
        ease: 'power2.inOut'
    });
    cursor.classList.remove('click');
})

















// CUSTOM CURSOR STUFF

const cursor = document.querySelector('.cursor');
const navBtn = document.getElementById('navIcon');
const dot = document.querySelector('.dot');

window.addEventListener('mousemove', (e) => {

    gsap.to(dot, 0, {
        css: {
            left: e.clientX,
            top: e.clientY
        }
    });

    gsap.to(cursor, 0.35, {
        css: {
            left: e.clientX,
            top: e.clientY
        }
    });
});

document.addEventListener('mousedown', function () {
    cursor.classList.add('click');
});
document.addEventListener('mouseup', function () {
    cursor.classList.remove('click');
});
navBtn.addEventListener('mouseover', function () {
    cursor.classList.add('click');
})
navBtn.addEventListener('mouseleave', function () {
    cursor.classList.remove('click');
})


// NAV MENU
var navBtns = document.querySelectorAll('.navBtn');
var menuOpen = false;
var socialBtn = document.querySelectorAll('.socialBtn');

navBtns.forEach((el) => {
    el.addEventListener('mousemove', () => {
        cursor.classList.add('expand');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('expand');
    });
})

gsap.set('.navWrapper', {
    opacity: 0,
    display: "none"
});

gsap.set('.navBtn', {
    xPercent: -100
});


navBtn.onmousedown = function () {
    if (!menuOpen) {

        gsap.set(logo, {
            margin: '0',
            ease: 'power2.inOut',
            scale: '1'
        });

        navBtn.classList.add('opened');

        gsap.set('.navWrapper', {
            display: "block"
        });
        gsap.to('.navWrapper', {
            opacity: 1,
            ease: 'power2.inOut',
            duration: 1
        });

        gsap.to(navBtns, {
            xPercent: 0,
            delay: 1,
            stagger: 0.2
        });

        menuOpen = true;
    } else {

        navBtn.classList.remove('opened');

        gsap.to(navBtns, {
            xPercent: -100,
            stagger: 0.1
        });

        gsap.to('.navWrapper', {
            opacity: 0,
            ease: 'power3.inOut',
            duration: 1,
            delay: 1.5
        });
        gsap.set('.navWrapper', {
            display: "none",
            delay: 2.5
        });

        gsap.set(logo, {
            margin: '0 0 0 47%',
            ease: 'power2.inOut',
            scale: '1.5',
            delay: 1
        });

        menuOpen = false;
    }
}

// RANDOM MOVING BACKGROUND FUNCTIONALITY
function randomBG() {
    var tl = new TimelineMax({ repeat: -1 });
    tl.to(".bgElement", {
        x: "random(-1000, 1000)",
        y: "random(-1000, 500)",
        duration: 50,
        ease: "power2.out",
        repeat: -1,
        repeatRefresh: true
    });
}

randomBG();

// Parallax FX on mouse move
var about = document.getElementById('aboutContent');

document.addEventListener('mousemove', function (e) {

    const speed = about.getAttribute('data-speed');

    const x = (window.innerWidth - e.pageX * speed) / 100;
    const y = (window.innerHeight - e.pageY * speed) / 100;
    about.style.transform = 'translateX(' + x + 'px) translateY(' + y + 'px)';

})