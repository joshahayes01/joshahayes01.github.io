feather.replace()

// Page Transition Load In
function loadIn() {
    let tl = gsap.timeline();
    tl.set('.homeMap polygon', {
        fill: 'rgba(1, 242, 207, 0.05)'
    }).set('.homeAnim', {
        opacity: 0
    });
    tl.from('.titleLine h1', 1.5, {
        yPercent: 150,
        skewY: 10,
        delay: 1,
        ease: 'power4.out',
        stagger: {
            amount: 0.5
        }
    }).from('.titleWrapper p', 1, {
        yPercent: 250,
        skewY: 10,
        ease: 'power4.out',
        stagger: {
            amount: 0.5
        }
    }, 2).from('.titleArrow', 0.5, {
        yPercent: 100,
        opacity: 0,
        ease: 'power3.out'
    }).to('.homeAnim', {
        opacity: 1
    }, 2);
}
loadIn();

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


// ARROW BUTTON
let arrowBtn = document.querySelector('.titleArrow');

arrowBtn.addEventListener('mousemove', () => {
    cursor.classList.add('click');
    gsap.to(arrowBtn, 0.5, {
        background: '#01F2CF',
        scale: 0.7,
        ease: 'power4.out'
    });
})
arrowBtn.addEventListener('mouseleave', () => {
    cursor.classList.remove('click');
    gsap.to(arrowBtn, 0.5, {
        background: 'white',
        scale: 1,
        ease: 'power4.out'
    });
})
arrowBtn.addEventListener('mousedown', () => {
    window.location.href = 'map.html';
})

// Background Map Parallax and Styling
var homeMap = document.querySelector('.homeMap');
var parallaxEl = document.querySelectorAll('.parallax');

document.addEventListener('mousemove', function (e) {

    Array.prototype.forEach.call(parallaxEl, el => {
        const speed = el.getAttribute('data-speed');

        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;
        el.style.transform = 'translateX(' + x + 'px) translateY(' + y + 'px)';
    })

})



// Background Elements
function randomBG() {
    var tl = new TimelineMax({ repeat: -1 });
    tl.set('.bgElement', {
        x: "random(-1000, 1000)",
        y: "random(-1000, 500)",
        opacity: 0.1
    });
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