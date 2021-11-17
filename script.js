feather.replace()


// USER INTERFACE FUNCTIONALITY

// LGA Data within Circle
let lgaCircle = document.querySelector('.circleDataBar');
let lgaPercent = lgaCircle.querySelector('.percent');
let lgaTitle = lgaCircle.querySelector('.circleLGA');

// MAP FUNCTIONALITY

// Getting colour values of map, lightest to darkest
var canopy1 = document.getElementsByClassName('cls-6');
var canopy2 = document.getElementsByClassName('cls-5');
var canopy3 = document.getElementsByClassName('cls-4');
var canopy4 = document.getElementsByClassName('cls-3');
var canopy5 = document.getElementsByClassName('cls-2');
var canopy6 = document.getElementsByClassName('cls-1');

// Get the grouped LGA's as a nodeList
const lgas = document.getElementsByTagName('g');

// Setting up the Map
const heatMap = document.getElementById("heatMap");


var isHover = true;

function detailMaps() {
    for (i = 0; i < canopy1.length; i++) {
        canopy1[i].classList.add("canopy1");
        canopy1[i].setAttribute("data-canopy", "75");
        canopy1[i].setAttribute("data-tree", "Forestry Reserve");
        canopy1[i].setAttribute('data-temp', '1');
    }
    for (i = 0; i < canopy2.length; i++) {
        canopy2[i].classList.add("canopy2");
        canopy2[i].setAttribute("data-canopy", "50");
        canopy2[i].setAttribute("data-tree", "Dense Vegetation");
        canopy2[i].setAttribute('data-temp', '2');
    }
    for (i = 0; i < canopy3.length; i++) {
        canopy3[i].classList.add("canopy3");
        canopy3[i].setAttribute("data-canopy", "25");
        canopy3[i].setAttribute("data-tree", "Leafy & Urban");
        canopy3[i].setAttribute('data-temp', '3');
    }
    for (i = 0; i < canopy4.length; i++) {
        canopy4[i].classList.add("canopy4");
        canopy4[i].setAttribute("data-canopy", "15");
        canopy4[i].setAttribute("data-tree", "Sparse Vegetation");
        canopy4[i].setAttribute('data-temp', '4');
    }
    for (i = 0; i < canopy5.length; i++) {
        canopy5[i].classList.add("canopy5");
        canopy5[i].setAttribute("data-canopy", "10");
        canopy5[i].setAttribute("data-tree", "Concrete & Roads");
        canopy5[i].setAttribute('data-temp', '5');
    }
    for (i = 0; i < canopy6.length; i++) {
        canopy6[i].classList.add("canopy6");
        canopy6[i].setAttribute("data-canopy", "5");
        canopy6[i].setAttribute("data-tree", "Industrial Wasteland");
        canopy6[i].setAttribute('data-temp', '6');
    }
}
function groupLGA() {

    var counter = 1;
    for (i = 0; i < lgas.length; i++) {
        lgas[i].setAttribute('data-lga', counter);
        lgas[i].setAttribute('data-temp', Math.round(Math.random() * (5 - 1) + 1));
        counter++;
    }
}

// LGA Object
class LGA {
    constructor(element) {
        this.element = element;
        this.children = Array.prototype.slice.call(element.getElementsByTagName('polygon'));
        this.maxDist = 100;
        this.clickedOn = false;
        this.hovered = false;
        this.id = element.getAttribute('id');
        this.timeout;
    }

    update(mouseX, mouseY, cursor) {
        if (isScaled || introActive) {
            return;
        } else {

            var d = this.calcD(this.element, mouseX, mouseY);

            if (d > this.maxDist) {
                this.children.forEach((el, i) => {
                    el.style.transform = "scale(1.0)";
                })
            } else {
                this.children.forEach((el, i) => {
                    var dist = this.calcD(el, mouseX, mouseY);

                    if (dist > this.maxDist) {
                        el.style.transform = "scale(1.0)";
                    } else {
                        var v = mapRange(dist, 0, this.maxDist, 1.0, 0.5);
                        el.style.transform = "scale(" + v + ")";
                        //el.style.transition = "transform ease .5s";
                    }
                })
            }
        }
    }

    calcD(polygon, mouseX, mouseY) {
        var pos = polygon.getBoundingClientRect();

        var dx = Math.round(pos.left + pos.width / 2);
        var dy = Math.round(pos.top + pos.height / 2);

        var a = dx - mouseX;
        var b = dy - mouseY;

        return Math.sqrt(a * a + b * b);
    }

    clickOn() {
        this.element.addEventListener('click', (e) => {
            console.log("You clicked on me");
            e.stopPropagation();
            this.clickedOn = true;
            for (i = 0; i < lgaGroup.length; i++) {
                if (lgaGroup[i].element !== this.element) {
                    lgaGroup[i].clickedOn = false;
                    lgaGroup[i].children.forEach((el, i) => {
                        el.style.fill = "#082321";
                        /*
                        gsap.set(el, {
                            fill: "#082321"
                        }); */
                    })
                } else {
                    this.children.forEach((el) => {
                        //el.style.fill = "";

                        gsap.set(el, {
                            fill: (i, el) => currentCol(el.getAttribute('data-canopy'))
                        })
                    })
                }
            }
        })
    }

    uiDisplay() {

        this.children.forEach((el, i) => {
            el.addEventListener('mousemove', () => {
                if (this.hovered) {
                    coverType.innerHTML = el.getAttribute('data-tree');
                    tempInfo.innerHTML = el.getAttribute('data-temp') + "°C";

                    // UI LGA Data Percentage
                    if (currentCol == greenMapCol) {
                        lgaPercent.innerHTML = el.getAttribute('data-canopy') + '%';
                        treeInfo.innerHTML = el.getAttribute('data-canopy') + '%';
                    } else if (currentCol == heatMapCol) {
                        lgaPercent.innerHTML = el.getAttribute('data-temp') + 'C°';
                    }

                } else {
                    return;
                }
            })
        })

        this.element.addEventListener('mousemove', () => {
            lgaName.forEach((el, i) => {
                el.innerHTML = this.id;
            })
            //lgaName.innerHTML = this.id;
            //tempInfo.innerHTML = this.element.getAttribute('data-temp') + "°C";
            this.hovered = true;


            // UI LGA Data Name
            lgaTitle.innerHTML = this.id;

        });
        this.element.addEventListener('mouseleave', () => {
            this.hovered = false;
        })

    }


}

// Variable container for mouse positions
const mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

// Timer to set the gsap ticker function on or off
let timer;

window.addEventListener('mousemove', (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
    isHover = true;

    clearTimeout(timer);
    timer = setTimeout(() => {
        isHover = false;
    }, 2000);
})


// Declaring an array of LGA Objects
const lgaGroup = gsap.utils.toArray(lgas).map(el => new LGA(el));

// Ticker which provides the hover effects using an in-class function
gsap.ticker.add(() => {

    if (!isHover) {
        return;
    }
    if (menuOpen) {
        return;
    }

    isHover = false;

    for (i = 0; i < lgaGroup.length; i++) {
        lgaGroup[i].update(mousePos.x, mousePos.y, cursor);
    }
})

// Constantly checking to see if any of the LGAs are being clicked on
for (i = 0; i < lgaGroup.length; i++) {
    lgaGroup[i].clickOn();
    lgaGroup[i].uiDisplay();
}

window.addEventListener('click', (e) => {
    if (introActive) {
        console.log("Intro is active");
        return;
    } else {
        e.stopPropagation();
        console.log("You clicked in the window");
        for (i = 0; i < lgaGroup.length; i++) {
            if (lgaGroup[i].clickedOn == true) {
                lgaGroup[i].clickedOn = false;
            } else {
                lgaGroup[i].children.forEach((el) => {

                    gsap.set(el, {
                        fill: (i, el) => currentCol(el.getAttribute('data-canopy'))
                    });

                    //el.style.fill = currentCol(el.getAttribute('data-canopy'));
                })
            }
        }
    }
})

groupLGA();
detailMaps();


// Function for mapping values to a range like the transform scale property
function mapRange(val, a, b, c, d) {
    val = (val - a) / (b - a);
    return c + val * (d - c);
}



// UI BUTTONS
var buttons = document.querySelectorAll('.button');
const scaleBtn = document.getElementById('scaleBtn');
const locationBtn = document.getElementById('locationBtn');
var canopyScale = d3.scaleLinear().domain([5, 75]).range([0.8, 0.3]);


buttons.forEach((el) => {
    el.addEventListener('mousemove', () => {
        cursor.classList.add('click');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('click');
    });
})

var locationsOn = true;
var isScaled = false; // Scaling data
scaleBtn.addEventListener('click', () => {
    if (introActive) {
        return;
    }
    if (isScaled) {

        scaleBtn.classList.remove('selected');

        for (i = 0; i < lgaGroup.length; i++) {
            lgaGroup[i].children.forEach((el, i) => {
                el.style.transform = "";
                el.style.fill = "";
                isScaled = false;
            });
        }
    } else {

        scaleBtn.classList.add('selected');

        for (i = 0; i < lgaGroup.length; i++) {
            lgaGroup[i].children.forEach((el, i) => {
                isScaled = true;
                var d = parseInt(el.getAttribute('data-canopy'));
                var data = canopyScale(d);

                el.style.transform = "scale(" + data + ")";
                //el.style.fill = "#082321";
            })
        }
    }
});


let prevInnerHTML;
locationBtn.addEventListener('click', () => {
    if (introActive) {
        return;
    }
    if (!locationsOn) {
        gsap.to('#refMap', {
            opacity: 1,
            duration: 0.5
        });
        gsap.to('.polyMap', {
            opacity: 0.3
        });
        gsap.to(locationBtn, {
            background: 'rgba(1, 242, 207, 1)'
        });
        prevInnerHTML = to.innerHTML;
        to.innerHTML = "Locations are now toggled on";
        locationsOn = true;
        console.log(locationsOn);
    } else if (locationsOn == true) {
        gsap.to('#refMap', {
            opacity: 0,
            duration: 0.5
        });
        gsap.to('.polyMap', {
            opacity: 1
        });
        gsap.to(locationBtn, {
            background: '',
        });
        to.innerHTML = prevInnerHTML;
        locationsOn = false;
        console.log(locationsOn);
    }

})









// Parallax FX on mouse move
var polyMap = document.querySelector('.polyMap');
var mapContainer = document.querySelector('.mapContainer');
var ending = document.getElementById('ending');

document.addEventListener('mousemove', function (e) {
    if (!introActive && !endingActive) {
        const speed = mapContainer.getAttribute('data-speed');

        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;
        mapContainer.style.transform = 'translateX(' + x + 'px) translateY(' + y + 'px)';
    } else {
        const speed = ending.getAttribute('data-speed');

        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;
        ending.style.transform = 'translateX(' + x + 'px) translateY(' + y + 'px)';
    }
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




// CUSTOM TOOLTIP HOVER
const heatMapTip = document.getElementById("heatMapTip");
const greenMapTip = document.getElementById("greenMapTip");
const mouse = document.querySelector('.cursor');
const tip = document.querySelectorAll('.tip');
var tempInfo = document.getElementById('tempInfo').getElementsByTagName('h2')[0];
var treeInfo = document.getElementById('treeInfo').getElementsByTagName('h2')[0];
var lgaName = Array.from(document.querySelectorAll('.lgaName'));
var coverType = document.querySelector('.coverType');

document.addEventListener("mousemove", function (e) {
    var x = e.clientX;
    var y = e.clientY;

    gsap.to(".toolTip", 0.5, {
        css: {
            left: x,
            top: y
        }
    });
});


// Setting the tooltip to appear below the tooltip wrapper
gsap.set(tip, {
    yPercent: 200
});
gsap.set('.greenInfo', {
    xPercent: -150
});
gsap.set('.tipData', {
    yPercent: -150
});
gsap.set(lgaName, {
    opacity: 0
});
// Tooltip Hovering Functionality with Timeouts
let hoverOutTimeout; // Timeout for hovering out

let bindCurID = new Date() * Math.random();

// GO through grouped elements with an event listener on mouse move, and use timeouts to delay hover
function hoverBinder() {

    for (i = 0; i < lgas.length; i++) {
        lgas[i].onmouseover = function () {
            clearTimeout(hoverOutTimeout);

            let bindID = bindCurID;

            //console.log("Hovered over with an id of " + bindID);
            setTimeout(function () {
                if (bindID != bindCurID) {
                    return;
                }
                //console.log("Play Animation");

                gsap.to(tip, {
                    yPercent: 0,
                    ease: 'power2.inOut',
                    duration: 1
                });
                gsap.to(lgaName, {
                    opacity: 1,
                    delay: 1
                });
                gsap.to('.tipData', {
                    yPercent: 0,
                    delay: 1
                });
                gsap.to(tempInfo, {
                    xPercent: 0,
                    delay: 1.5
                });
                cursor.classList.add('expand');
            }, 4000);
        }

        lgas[i].onmouseleave = function () {
            hoverOutTimeout = setTimeout(function () {

                gsap.to(tip, {
                    yPercent: 200,
                    ease: 'back.in',
                    duration: 1
                });
                bindCurID = new Date() * Math.random();
                cursor.classList.remove('expand');
                //console.log("Mouse has left");
            }, 2000);

        }
    }

}
hoverBinder();


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

        menuOpen = false;
    }
}


// INTERACTIVE TIMELINE

var dot1 = document.getElementById('first');
var dot2 = document.getElementById('second');
var dot3 = document.getElementById('third');
var dot4 = document.getElementById('fourth');

var dotNodes = document.querySelector('.timeline').children;

for (i = 0; i < dotNodes.length; i++) {
    dotNodes[i].addEventListener('mousemove', function () {
        let child = this.children[0];
        gsap.to(child, {
            opacity: 1,
            duration: .5
        });

        cursor.classList.add('click');
    });
    dotNodes[i].addEventListener('mouseleave', function () {
        let child = this.children[0];
        gsap.to(child, {
            opacity: 0,
            duration: 1
        });

        cursor.classList.remove('click');
    });
}

dot1.onmousedown = function () {
    prevCounter = curIndex;
    curIndex = 0;
    section1();
};
dot2.onmousedown = function () {
    prevCounter = curIndex;
    curIndex = 1;
    section2();
};
dot3.onmousedown = function () {
    prevCounter = curIndex;
    curIndex = 2;
    section3();
};
dot4.onmousedown = function () {
    prevCounter = curIndex;
    curIndex = 3;
    section4();
};

