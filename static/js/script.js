console.log('%cCopyright © 2022-2025 GitHub@ShameimaruAya',
    'background-color: #ff00ff; color: white; font-size: 24px; font-weight: bold; padding: 10px;'
);
console.log('%c   /\\_/\\', 'color: #8B4513; font-size: 20px;');
console.log('%c  ( o.o )', 'color: #8B4513; font-size: 20px;');
console.log(' %c  > ^ <', 'color: #8B4513; font-size: 20px;');
console.log('  %c /  ~ \\', 'color: #8B4513; font-size: 20px;');
console.log('  %c/______\\', 'color: #8B4513; font-size: 20px;');

document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});

function handlePress(event) {
    this.classList.add('pressed');
}

function handleRelease(event) {
    this.classList.remove('pressed');
}

function handleCancel(event) {
    this.classList.remove('pressed');
}

var buttons = document.querySelectorAll('.projectItem');
buttons.forEach(function (button) {
    button.addEventListener('mousedown', handlePress);
    button.addEventListener('mouseup', handleRelease);
    button.addEventListener('mouseleave', handleCancel);
    button.addEventListener('touchstart', handlePress);
    button.addEventListener('touchend', handleRelease);
    button.addEventListener('touchcancel', handleCancel);
});

function toggleClass(selector, className) {
    var elements = document.querySelectorAll(selector);
    elements.forEach(function (element) {
        element.classList.toggle(className);
    });
}

function pop(imageURL) {
    var tcMainElement = document.querySelector(".tc-img");
    if (imageURL) {
        tcMainElement.src = imageURL;
    }
    toggleClass(".tc-main", "active");
    toggleClass(".tc", "active");
}

var tc = document.getElementsByClassName('tc');
var tc_main = document.getElementsByClassName('tc-main');
if (tc.length > 0) {
    tc[0].addEventListener('click', function (event) {
        pop();
    });
}
if (tc_main.length > 0) {
    tc_main[0].addEventListener('click', function (event) {
        event.stopPropagation();
    });
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) == 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}

document.addEventListener('DOMContentLoaded', function () {

    var html = document.querySelector('html');
    var themeState = getCookie("themeState") || "Light";
    
    const basePath = window.location.pathname.includes('/about-us/') ? '../' : './';

    function changeTheme(theme) {
        var tanChiShe = document.getElementById("tanChiShe");
        if (tanChiShe) {
            tanChiShe.src = basePath + "static/svg/snake-" + theme + ".svg";
        }
        html.dataset.theme = theme;
        setCookie("themeState", theme, 365);
        themeState = theme;
    }

    var Checkbox = document.getElementById('myonoffswitch')
    if (Checkbox) {
        Checkbox.addEventListener('change', function () {
            if (themeState == "Dark") {
                changeTheme("Light");
            } else if (themeState == "Light") {
                changeTheme("Dark");
            } else {
                changeTheme("Dark");
            }
        });

        if (themeState == "Dark") {
            Checkbox.checked = false;
        }
    }

    changeTheme(themeState);

    var loadingCenter = document.getElementById('marisa-loading-center');
    if (loadingCenter && loadingCenter.childElementCount === 0) {
        loadingCenter.innerHTML = ''
            + '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">'
            + '  <path d="M 200 50 A 150 150 0 0 1 200 350 A 75 75 0 0 1 200 200 A 75 75 0 0 0 200 50 Z" fill="#E31E24"/>'
            + '  <circle cx="200" cy="275" r="20" fill="#FFFFFF"/>'
            + '</svg>'
            + '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">'
            + '  <path d="M 200 50 A 75 75 0 0 1 200 200 A 75 75 0 0 0 200 350 A 150 150 0 0 1 200 50 Z" fill="#FFFFFF"/>'
            + '  <circle cx="200" cy="125" r="20" fill="#E31E24"/>'
            + '</svg>';
    }

    var fpsElement = document.createElement('div');
    fpsElement.id = 'fps';
    fpsElement.style.zIndex = '10000';
    fpsElement.style.position = 'fixed';
    fpsElement.style.left = '0';
    document.body.insertBefore(fpsElement, document.body.firstChild);

    var showFPS = (function () {
        var requestAnimationFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };

        var fps = 0,
            last = Date.now(),
            offset, step, appendFps;

        step = function () {
            offset = Date.now() - last;
            fps += 1;

            if (offset >= 1000) {
                last += offset;
                appendFps(fps);
                fps = 0;
            }

            requestAnimationFrame(step);
        };

        appendFps = function (fpsValue) {
            fpsElement.textContent = 'FPS: ' + fpsValue;
        };

        step();
    })();

    //pop('./static/img/tz.jpg')

});

 var pageLoading = document.querySelector("#marisa-loading");
var mainContent = document.querySelector(".marisa-main");
var navbar = document.querySelector(".marisa-navbar");
 
if (pageLoading) {
    var rippleIntervalId;
    var presetRipples = document.querySelectorAll('#marisa-loading-wrapper .loading-ripple');
    presetRipples.forEach(function (node) {
        if (node && node.parentNode) {
            node.parentNode.removeChild(node);
        }
    });
    function spawnRipple() {
        var wrapper = document.getElementById('marisa-loading-wrapper');
        var center = document.getElementById('marisa-loading-center');
        if (!wrapper) return;
        var ripple = document.createElement('div');
        ripple.className = 'loading-ripple';
        ripple.style.animation = 'ripple-anim 3s linear forwards';
        ripple.style.animationPlayState = 'running';
        if (center) {
            wrapper.insertBefore(ripple, center);
        } else {
            wrapper.appendChild(ripple);
        }
        setTimeout(function () {
            if (ripple && ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 3200);
    }

    setTimeout(function () {
        spawnRipple();
        rippleIntervalId = setInterval(spawnRipple, 1000);
    }, 300);

    var minLoadingPromise = new Promise(function(resolve) {
        setTimeout(resolve, 3000);
    });
 
    var windowLoadPromise = new Promise(function(resolve) {
        if (document.readyState === 'complete') {
            resolve();
        } else {
            window.addEventListener('load', resolve);
        }
    });
 
    Promise.all([minLoadingPromise, windowLoadPromise]).then(function() {
        if (rippleIntervalId) {
            clearInterval(rippleIntervalId);
        }
        pageLoading.classList.add('center-open');
        var centerNode = document.getElementById('marisa-loading-center');
        var svgs = centerNode ? centerNode.querySelectorAll('svg') : [];
        function startFinish() {
            pageLoading.classList.add('loading-finish');
            if (mainContent) mainContent.style.opacity = '1';
            if (navbar) navbar.style.opacity = '1';
            setTimeout(function () {
                pageLoading.style.display = 'none';
            }, 1100);
        }
        if (svgs && svgs.length > 0) {
            var remaining = svgs.length;
            svgs.forEach(function (svg) {
                svg.addEventListener('animationend', function () {
                    remaining--;
                    if (remaining === 0) {
                        startFinish();
                    }
                }, { once: true });
            });
        } else {
            startFinish();
        }
    });
} else {
    if (mainContent) mainContent.style.opacity = '1';
    if (navbar) navbar.style.opacity = '1';
}
