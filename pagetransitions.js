
let playhead = { frame: 0 };
var animation = bodymovin.loadAnimation({
    container: document.getElementById('logoAnim'),
    render: 'svg',
    loop: false,
    autoplay: false,
    path: 'https://assets1.lottiefiles.com/packages/lf20_ddiooebr.json'
});

var introActive = true;
var rule = CSSRulePlugin.getRule(".bar:after");

// COLOUR DATA
var currentCol; // Variable which stores the current colour palette for each map
var greenMapCol = d3.scaleLinear().domain([75, 50, 15, 5]).range(['#016556', '#01b297', '#9afeef', '#e6fffb']);
var grayscaleCol = d3.scaleLinear().domain([5, 10, 15, 25, 50, 75]).range(['#727272', '#686868', '#515151', '#3A3A3A', '#252525', '#131313']);
var heatMapCol = d3.scaleLinear().domain([75, 50, 25, 15, 10, 5]).range(["#f9f8f4", "#ffecb8", "#ffdf7b", "#ffc152", "#fc933d", "#ff6833"]);


let to = document.querySelector('.explain');
// Setting everything before start
function setUp() {
    gsap.set('.mapContainer', {
        yPercent: -100
    });
    gsap.set('.ui', {
        xPercent: -200,
    });
    gsap.set('.dataBar', {
        opacity: 0
    });
    gsap.set('polygon', {
        fill: (i, el) => greenMapCol(el.getAttribute('data-canopy'))
    });
    gsap.set('.innerCircle', {
        background: 'linear-gradient(317deg, rgba(3, 179, 218, 1) 0%, rgba(3, 218, 154, 1) 49%, rgba(1, 242, 207, 1) 100%)'
    });
    gsap.set(rule, {
        background: 'linear-gradient(317deg, rgba(3, 179, 218, 1) 0%, rgba(3, 218, 154, 1) 49%, rgba(1, 242, 207, 1) 100%)'
    });
    gsap.set('#heatMapTip', {
        display: 'none'
    });

    gsap.set(to, {
        display: 'none',
        opacity: 0
    });

    gsap.set('.refContainer', {
        opacity: 0
    });

    gsap.set('#ending', {
        display: 'none',
    });


    gsap.set('.polyMap', {
        opacity: 0.4
    });
}
setUp();


// PAGE LOAD INTRO
animation.addEventListener('DOMLoaded', function () {
    let tl = gsap.timeline();
    currentCol = greenMapCol;

    tl.to(playhead, {
        frame: animation.totalFrames - 1,
        duration: 3,
        ease: "none",
        delay: 1,
        onUpdate: () => animation.goToAndStop(playhead.frame, true)
    });
    tl.to('.loadingWrap', {
        opacity: 0,
        ease: "power2.inOut",
        duration: 1,
        onComplete: () => {
            loadIn();
        },
    });
    tl.set('.loadingWrap', {
        display: "none",
        delay: 1
    });
})


// LOADING FIRST SECTION
function loadIn() {
    let tl = gsap.timeline({
        onEnter: () => stopScroll = true,
        onComplete: () => {
            section1();
            stopScroll = false;
        }
    });

    tl.to('.mapContainer', {
        yPercent: 0,
        ease: 'power3.out',
        duration: 2
    }).to('.ui', {
        xPercent: 0,
        ease: 'power3.inOut',
        duration: 1,
        stagger: 0.2,
        onComplete: () => {
            introActive = false;
            mapContainer.classList.add('moving');
            //locationsOn = true;
        }
    }, "<+=1").set('.dataBar', {
        xPercent: -200
    }).set(to, {
        display: "block"
    }).to(to, {
        opacity: 1,
        duration: 1,
        ease: "power2.inOut"
    });
}


// LISTENER TO DETECT WHEEL EVENTS AND THEN TRANSITION TO NEXT / PREV SECTION
let sections = [section1, section2, section3, section4, section5],
    clampIndex = gsap.utils.clamp(0, sections.length - 1),
    curIndex = 0,
    prevCounter = curIndex,
    stopScroll; // Stops the scroll behaviour at the end

window.addEventListener("wheel", e => goto(e.deltaY < 0 ? -1 : 1));

function goto(direction) {
    if (!menuOpen && stopScroll == false) {
        prevCounter = curIndex;
        let newIndex = clampIndex(curIndex + direction);
        if (newIndex !== curIndex) {
            delayScroll();
            sections[newIndex](direction);
            curIndex = newIndex;
        }
    }
}

// Variables for sections
var timeDots = document.querySelectorAll('.timeDot');
var arrows = document.querySelectorAll('.arrow-right');
var bgElement = document.querySelectorAll('.bgElement');
var endingActive = false;

// SECTIONS
function section1() {
    to.innerHTML = "Here's a <em>green</em> map of Brisbane";
    prevInnerHTML = to.innerHTML;
    for (i = 0; i < timeDots.length; i++) {
        if (i == 0) {
            gsap.to(timeDots[i], 0.4, {
                background: 'white'
            });
        } else {
            gsap.to(timeDots[i], 0.4, {
                background: ""
            });
        }
    }


    gsap.to('#refMap', {
        opacity: 1,
        duration: .5
    });
    gsap.to('.polyMap', {
        opacity: 0.4,
        duration: .5
    });


    if (prevCounter == 0) {

        console.log('Loading intro for first time');
        let tl = gsap.timeline();

        gsap.to('.refContainer', {
            opacity: 1,
            ease: 'power3.inOut'
        });

        tl.set(rule, {
            background: 'linear-gradient(317deg, rgba(3, 179, 218, 1) 0%, rgba(3, 218, 154, 1) 49%, rgba(1, 242, 207, 1) 100%)'
        });
        tl.to('polygon', {
            fill: (i, el) => greenMapCol(el.getAttribute('data-canopy'))
        });
        tl.to('.innerCircle', {
            background: 'linear-gradient(317deg, rgba(3, 179, 218, 1) 0%, rgba(3, 218, 154, 1) 49%, rgba(1, 242, 207, 1) 100%)'
        });
    } else {
        gsap.set(to, {
            opacity: 0,
            yPercent: 100
        });
        to.innerHTML = "Here's a <em>green</em> map of Brisbane";

        gsap.to(to, {
            opacity: 1,
            yPercent: 0,
            delay: 1
        });
    }
    if (prevCounter >= 3) {

        gsap.to('.refContainer', {
            opacity: 1,
            ease: 'power3.inOut'
        });

        currentCol = greenMapCol;

        let tl = gsap.timeline();

        tl.set(rule, {
            background: 'linear-gradient(317deg, rgba(3, 179, 218, 1) 0%, rgba(3, 218, 154, 1) 49%, rgba(1, 242, 207, 1) 100%)'
        });
        tl.to('polygon', {
            fill: (i, el) => greenMapCol(el.getAttribute('data-canopy'))
        });
        tl.to('.innerCircle', {
            background: 'linear-gradient(317deg, rgba(3, 179, 218, 1) 0%, rgba(3, 218, 154, 1) 49%, rgba(1, 242, 207, 1) 100%)'
        });

        gsap.to(bgElement, {
            background: ''
        });

        gsap.set('#greenMapTip', {
            display: 'block'
        });
        gsap.set('#heatMapTip', {
            display: 'none'
        });
        arrows.forEach((el) => {
            el.classList.remove('heatMap');
        })
    }
}

function section2() {
    if (delayScrollTimer) {
        clearTimeout(delayScrollTimer);
    }

    for (i = 0; i < timeDots.length; i++) {
        if (i == 1) {
            gsap.to(timeDots[i], 0.4, {
                background: 'white'
            });
        } else {
            gsap.to(timeDots[i], 0.4, {
                background: ""
            });
        }
    }

    gsap.set(to, {
        opacity: 0,
        yPercent: 100
    });
    to.innerHTML = "The shades of <em>green</em> represent the level of <em>tree</em> coverage throughout the city";

    gsap.to(to, {
        opacity: 1,
        yPercent: 0,
        delay: 1,
        //onEnter: () => stopScroll = true
    });

    gsap.to('#refMap', {
        opacity: 0,
        duration: .5
    });

    gsap.to('.polyMap', {
        opacity: 1,
        duration: .5
    });

    // If coming from section succeeding this one
    if (prevCounter == 2) {
        gsap.to('.refContainer', {
            opacity: 1,
            ease: 'power3.inOut'
        });
    }

    // If coming from the heatmap section
    if (prevCounter >= 3) {
        currentCol = greenMapCol;

        let tl = gsap.timeline();

        tl.set(rule, {
            background: 'linear-gradient(317deg, rgba(3, 179, 218, 1) 0%, rgba(3, 218, 154, 1) 49%, rgba(1, 242, 207, 1) 100%)'
        });
        tl.to('polygon', {
            fill: (i, el) => greenMapCol(el.getAttribute('data-canopy'))
        });
        tl.to('.innerCircle', {
            background: 'linear-gradient(317deg, rgba(3, 179, 218, 1) 0%, rgba(3, 218, 154, 1) 49%, rgba(1, 242, 207, 1) 100%)'
        });

        gsap.to(bgElement, {
            background: ''
        });

        gsap.set('#greenMapTip', {
            display: 'block'
        });
        gsap.set('#heatMapTip', {
            display: 'none'
        });
        arrows.forEach((el) => {
            el.classList.remove('heatMap');
        })
    }
    setTimeout(function () {

        window.addEventListener("wheel", (e) => {
            if (e.deltaY >= 1) {
                to.innerHTML = "More <em>trees</em> means more shade and in turn, cooler average temperatures.";
                gsap.from(to, 1, {
                    opacity: 0,
                    yPercent: 100,
                    ease: 'power4.out',
                    onComplete: () => stopScroll = false
                });
            } else if (e.deltaY <= -1) {
                stopScroll = false;
                prevCounter = curIndex;
                curIndex = 0;
                section1();
                delayScroll();
            }
        }, { once: true });

    }, 800);
}

function section3() {

    for (i = 0; i < timeDots.length; i++) {
        if (i == 2) {
            gsap.to(timeDots[i], 0.4, {
                background: 'white'
            });
        } else {
            gsap.to(timeDots[i], 0.4, {
                background: ""
            });
        }
    }

    gsap.to('#refMap', {
        opacity: 0,
        duration: .5
    });
    gsap.to('.refContainer', {
        opacity: 0,
        ease: 'power3.inOut'
    });
    gsap.to('.polyMap', {
        opacity: 1,
        duration: .5
    });

    currentCol = greenMapCol;

    if (prevCounter == 3) {
        console.log('Reloading Palette');
        let tl = gsap.timeline();

        tl.to('polygon', {
            fill: (i, el) => greenMapCol(el.getAttribute('data-canopy'))
        });
        tl.to('.innerCircle', {
            background: 'linear-gradient(317deg, rgba(3, 179, 218, 1) 0%, rgba(3, 218, 154, 1) 49%, rgba(1, 242, 207, 1) 100%)'
        });
        tl.set(rule, {
            background: 'linear-gradient(317deg, rgba(3, 179, 218, 1) 0%, rgba(3, 218, 154, 1) 49%, rgba(1, 242, 207, 1) 100%)'
        });
        gsap.to(bgElement, {
            background: ''
        });
        arrows.forEach((el) => {
            el.classList.remove('heatMap');
        })
    }

    gsap.set('#greenMapTip', {
        display: 'block'
    });
    gsap.set('#heatMapTip', {
        display: 'none'
    });

    gsap.set(to, {
        opacity: 0,
        yPercent: 100
    });
    to.innerHTML = "Hover over the map to see the differences in coverage";

    gsap.to(to, {
        opacity: 1,
        yPercent: 0,
        delay: 1
    });
}

function section4() {
    endingActive = false;

    if (delayScrollTimer) {
        clearTimeout(delayScrollTimer);
    }

    for (i = 0; i < timeDots.length; i++) {
        if (i == 3) {
            gsap.to(timeDots[i], 0.4, {
                background: 'white'
            });
        } else {
            gsap.to(timeDots[i], 0.4, {
                background: ""
            });
        }
    }

    gsap.set('#greenMapTip', {
        display: 'none'
    });
    gsap.set('#heatMapTip', {
        display: 'block'
    });

    currentCol = heatMapCol;

    gsap.to('#refMap', {
        opacity: 0,
        duration: .5
    });
    gsap.to('.polyMap', {
        opacity: 1,
        duration: .5
    });
    gsap.set(to, {
        opacity: 0,
        yPercent: 100
    });
    to.innerHTML = "Now how does it compare to the <i>heat</i>?";

    gsap.set('.dataBar', {
        opacity: 1
    });
    gsap.to('.dataBar', {
        xPercent: 0,
        duration: 1,
        ease: 'power2.inOut',
        delay: .5
    });

    gsap.to(to, {
        opacity: 1,
        yPercent: 0,
        delay: 1
    });

    gsap.to('polygon', {
        fill: (i, el) => heatMapCol(el.getAttribute('data-canopy'))
    });
    gsap.to('.innerCircle', {
        background: 'linear-gradient(317deg, rgb(249, 248, 244) 0%, rgb(255, 223, 123) 25%, rgb(255, 193, 82) 50%, rgb(252, 147, 61) 75%, rgb(255, 104, 51) 100%)'
    });

    var rule = CSSRulePlugin.getRule(".bar:after");
    gsap.to(rule, {
        background: 'linear-gradient(317deg, rgb(249, 248, 244) 0%, rgb(255, 223, 123) 25%, rgb(255, 193, 82) 50%, rgb(252, 147, 61) 75%, rgb(255, 104, 51) 100%)'
    });

    gsap.to(bgElement, {
        background: '#ffc152'
    });

    arrows.forEach((el) => {
        el.classList.add('heatMap');
    });

    setTimeout(function () {
        window.addEventListener("wheel", (e) => {
            if (e.deltaY >= 1) {
                to.innerHTML = "Colours here represent the <i>increase</i> in average temperatures for each local area.";
                gsap.from(to, 1, {
                    opacity: 0,
                    yPercent: 100,
                    ease: 'power4.out',
                    onComplete: () => stopScroll = false
                });
            } else {
                stopScroll = false;
                prevCounter = curIndex;
                curIndex = 2;
                section3();
                delayScroll();
            }
        }, { once: true });
    }, 800);


    if (prevCounter == 4) {
        gsap.to('.endWrap1 h3', 1.8, {
            yPercent: -300,
            ease: 'power4.out',
            skewY: -10,
            stagger: {
                amount: 0.4
            }
        });
        gsap.to('.mapContainer', {
            yPercent: 0,
            ease: 'power4.out',
            duration: 1,
            delay: 0.8
        });
        gsap.set('#ending', {
            display: 'none',
            delay: 1
        });
        gsap.to('.ui', {
            xPercent: 0,
            ease: 'power3.inOut',
            stagger: 0.05
        });
    }
}

function section5() {
    endingActive = true;
    //stopScroll = true;

    for (i = 0; i < timeDots.length; i++) {
        if (i == 4) {
            gsap.to(timeDots[i], 0.4, {
                background: 'white'
            });
        } else {
            gsap.to(timeDots[i], 0.4, {
                background: ""
            });
        }
    }

    gsap.to(bgElement, {
        background: 'rgba(0, 212, 208, 0.8)'
    });

    let tl = gsap.timeline();

    tl.set('.line h3', {
        yPercent: 300,
        skewY: 10
    }).set('.endWrap2', {
        display: 'none'
    }).set('.endBtns', {
        display: 'none'
    });

    tl.to('.mapContainer', {
        yPercent: -150,
        duration: 1,
        ease: 'power2.inOut'
    }).to('.ui', {
        xPercent: -200,
        ease: 'power3.inOut',
        stagger: 0.02
    }).to(to, {
        opacity: 0
    }).set('#ending', {
        display: 'flex'
    }).to('.endWrap1 h3', 1.8, {
        yPercent: 0,
        ease: 'power4.out',
        delay: 1,
        skewY: 0,
        stagger: {
            amount: 0.4
        }
    }).from('#ending p', {
        yPercent: 100,
        ease: 'power4.out',
        delay: .5,
        skewY: 10,
        opacity: 0
    });

    window.addEventListener("wheel", (e) => {
        if (stopScroll) {
            return;
        }
        if (e.deltaY >= 1) {
            stopScroll = true;

            let endTl = gsap.timeline();
            endTl.to('.timeDot', {
                xPercent: 300,
                opacity: 0,
                duration: .5,
                ease: 'power3.inOut'
            }).to('#scrollAnim', {
                xPercent: 300,
                opacity: 0,
                duration: .5,
                ease: 'power3.inOut'
            }, '<0.2').to('.endWrap1 h3', 1.8, {
                yPercent: -300,
                ease: 'power4.in',
                skewY: 10,
                stagger: {
                    amount: 0.4
                }
            }).to('#ending p', 1, {
                yPercent: -100,
                stagger: 0.5,
                ease: 'power4.out',
                opacity: 0
            }, '<1').set('#ending p', {
                display: 'none'
            }).set('.endWrap1', {
                display: 'none'
            }).set('.endBtns', {
                display: 'flex'
            }).set('.endWrap2', {
                display: 'block'
            }).to('.endWrap2 h3', 1.8, {
                yPercent: 0,
                ease: 'power4.out',
                skewY: 0,
                stagger: {
                    amount: 0.4
                }
            }).from('.endBtns a', 1, {
                opacity: 0,
                xPercent: 100,
                ease: 'power4.out',
                stagger: {
                    amount: 0.5
                }
            });


            // End Buttons: 'Learn More' and 'Restart'
            let endBtns = document.querySelector('.endBtns');
            let resetBtn = document.querySelector('.resetBtn');

            Array.prototype.forEach.call(endBtns.children, child => {
                child.addEventListener('mousemove', function () {
                    cursor.classList.add('click');
                    gsap.to(this, {
                        yPercent: 15,
                        ease: 'power4.out'
                    });
                })

                child.addEventListener('mouseleave', function () {
                    cursor.classList.remove('click');
                    gsap.to(this, {
                        yPercent: 0,
                        ease: 'power4.out'
                    });
                })
            })

            resetBtn.addEventListener('mousedown', () => {
                window.location.reload();
            })

        } else {
        }
    });
}

let delayScrollTimer;
function delayScroll() {
    if (delayScrollTimer) {
        clearTimeout(delayScroll);
    }
    stopScroll = true;
    delayScrollTimer = setTimeout(function () {
        stopScroll = false;
        console.log('Unlock scroll!');
    }, 2000);
}