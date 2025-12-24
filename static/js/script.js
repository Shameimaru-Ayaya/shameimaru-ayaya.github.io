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

var themeState = getCookie("themeState") || "Light";

function changeTheme(theme) {
    var html = document.querySelector('html');
    var tanChiShe = document.getElementById("tanChiShe");
    var basePath = getBasePath();
    if (tanChiShe) {
        tanChiShe.src = basePath + "static/svg/snake-" + theme + ".svg";
    }
    if (html) {
        html.dataset.theme = theme;
    }
    setCookie("themeState", theme, 365);
    themeState = theme;
}

function initThemeSwitch() {
    var Checkbox = document.getElementById('myonoffswitch');
    if (Checkbox) {
        // Remove old event listeners by cloning (optional, but safer if called multiple times)
        // var newCheckbox = Checkbox.cloneNode(true);
        // Checkbox.parentNode.replaceChild(newCheckbox, Checkbox);
        // Checkbox = newCheckbox;
        // Actually, simple addEventListener is fine if we don't bind multiple times to the SAME element.
        // When renderRightHeader runs, it creates a NEW element.
        
        Checkbox.addEventListener('change', function () {
            if (themeState == "Dark") {
                changeTheme("Light");
            } else {
                changeTheme("Dark");
            }
        });

        if (themeState == "Dark") {
            Checkbox.checked = false;
        } else {
            Checkbox.checked = true;
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {

    changeTheme(themeState);
    initThemeSwitch();



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

    var nonHomeSlugs = ['about-us','contact-us','tools','privacy-policy','terms-and-conditions','download'];
    var isHome = !nonHomeSlugs.some(function (slug) {
        return window.location.pathname.indexOf('/' + slug + '/') !== -1;
    }) && (window.location.pathname === '/' || window.location.pathname.indexOf('/index.html') !== -1 || /\/KirisameMarisa-DAZE.github\.io\/?$/.test(window.location.pathname));
    var minDurationMs = isHome ? 3000 : 1000;
    var minLoadingPromise = new Promise(function(resolve) {
        setTimeout(resolve, minDurationMs);
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

var originalTitle = document.title;
var currentTitlePair = null;
var titleRecoveryTimer = null;
var TITLE_PAIRS = [
    { away: '( - ω - ) zzZ 睡着啦 ~', back: '( ･ω･)ﾉ 醒来了哦 ~' },
    { away: '┌(。Д。)┐ 藏起来了 ~', back: '(^・ω・^ ) 找到你啦 ~' },
    { away: '(；ω；) 人家想你 ~', back: '(*^▽^*) 好开心呀 ~' },
    { away: '(>_<) 页面崩溃！', back: '(^_^) 又好了呢！' },
    { away: '(￣ω￣;) 休息一下 ~', back: '(｀・ω・´) 开始工作！' },
    { away: '(´⊙ω⊙) 面煮好啦 ~', back: '(๑¯∀¯๑) 开动啦 ~' },
    { away: '(´⊙ω⊙) 去探险啦！', back: '(●´ω｀●) 带回宝藏 ~' },
    { away: '🌧️ 下雨收衣服啦', back: '🌈 天晴晒太阳 ~' },
    { away: '( ˘ω˘ )ｽﾔｧ 电量不足…', back: '(๑•̀ㅂ•́)و✧ 充满活力！' },
    { away: '(｡•́︿•̀｡) 偷偷说再见…', back: '(っ´ω｀ｃ) 悄悄回来啦' },
    { away: '(＞﹏＜) 故事暂停…', back: '(๑´ㅂ๑) 继续读下去 ~' },
    { away: '(☆▽☆) 变成小星星 ~', back: '(´▽｀) 变回月亮啦' },
    { away: '(ﾟ⊿ﾟ) 突然消失！', back: '(★ω★) 魔法出现 ~' },
    { away: '(´･ω･) 乖乖等你 ~', back: '(っ´▽｀)っ 欢迎回来！' },
    { away: '(=｀ω´=) 嗷呜，走开啦', back: '(^・x・^) 呼噜，蹭蹭你' },
    { away: '(⊙ˍ⊙) 天黑请闭眼', back: '(◕‿◕) 天亮啦 ~'},
    { away: '(×_×) 螺丝飞走啦', back: '(✔ᴗ✔) 修好咯！' },
    { away: '( •́ _ •̀) 演出暂停…', back: '(✧∇✧) 好戏继续！' },
    { away: '(ｏ・_・)ノ” 咻~飞走了', back: '( ﾟ▽ﾟ)/ 噗，又出现' },
    { away: '(。-ω-) 秋天落叶…', back: '(๑•̀ㅂ•́)و 春天发芽！' },
    { away: '(◉_◉) 角色掉线！', back: '(^∇^) 重新连接 ~' }
];
function pickTitlePair() {
    var i = Math.floor(Math.random() * TITLE_PAIRS.length);
    return TITLE_PAIRS[i];
}
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        if (titleRecoveryTimer) {
            clearTimeout(titleRecoveryTimer);
            titleRecoveryTimer = null;
        }
        currentTitlePair = pickTitlePair();
        document.title = currentTitlePair.away;
    } else {
        var backTitle = currentTitlePair ? currentTitlePair.back : originalTitle;
        document.title = backTitle;
        titleRecoveryTimer = setTimeout(function () {
            document.title = originalTitle;
            titleRecoveryTimer = null;
            currentTitlePair = null;
        }, 3000);
    }
});

function updateCopyrightYear() {
    function applyYear(year) {
        var footers = document.querySelectorAll('footer');
        footers.forEach(function (footer) {
            var html = footer.innerHTML;
            var yearStr = String(year);
            html = html.replace(/(Copyright[^\\d]*?\\s*\\d{4})-(\\d{4})/i, function (match, startPart, endYear) {
                return startPart + '-' + yearStr;
            });
            footer.innerHTML = html;
        });
    }
    fetch('https://worldtimeapi.org/api/ip').then(function (resp) {
        return resp.json();
    }).then(function (data) {
        var dateStr = data && data.datetime;
        var y = dateStr ? new Date(dateStr).getFullYear() : new Date().getFullYear();
        applyYear(y);
    }).catch(function () {
        applyYear(new Date().getFullYear());
    });
}
document.addEventListener('DOMContentLoaded', function () {
    updateCopyrightYear();
});

function getSidebarDefaults() {
    return {
        addressLines: ['幻想郷 妖怪の山', '文々。新聞'],
        titles: { personal: 'Personal', acgn: 'ACGMN+', xp: 'XP' },
        personalTags: ['二次元', '和风', '文化底蕴', '圣地巡礼', '飞友', '铁宅', '技术宅(存疑)', '军迷(伪)', '交响乐(雅)', '面向AI编程'],
        acgnTags: ['東方Project', 'GalGame', '魔女の旅々', 'YuzuSoft', 'Key', '京アニ', '废萌', '纯爱', '致郁', '关系性', 'ボカロ'],
        xpTags: ['JK&JC', '和服', '魔女', '巫女', '白毛', '黑长直', '醋溜便当', '貧乳は希少価値だ', '白丝', '黑丝', '百合', '后宫'],
        updates: [
            { title: 'style update', date: '2025-12-17' },
            { title: 'projects information update', date: '2025-12-16' },
            { title: 'homepage update', date: '2025-09-27' },
            { title: 'information update for about-us', date: '2025-09-22' },
            { title: 'information update', date: '2025-07-18' },
            { title: 'Downloader', date: '2025-03-08' },
            { title: 'About us', date: '2025-03-07' },
            { title: 'ver 2.1.1', date: '2025-03-06' },
            { title: 'ver 2.1.0', date: '2025-03-05' },
            { title: 'ver 2.0.0', date: '2025-03-05' },
            { title: 'ver 1.0.0', date: '2025-02-24' }
        ]
    };
}

function renderSidebar() {
    var container = document.querySelector('.marisa-left');
    if (!container) return;
    var defaults = getSidebarDefaults();
    var overrides = window.sidebarOverrides || {};
    var data = {
        addressLines: overrides.addressLines || defaults.addressLines,
        titles: Object.assign({}, defaults.titles, overrides.titles || {}),
        personalTags: overrides.personalTags || defaults.personalTags,
        acgnTags: overrides.acgnTags || defaults.acgnTags,
        xpTags: overrides.xpTags || defaults.xpTags,
        updates: overrides.updates || defaults.updates
    };
    container.querySelectorAll('.left-div.left-des, .left-div.left-tag, .left-div.left-time').forEach(function (el) {
        if (el && el.parentNode) el.parentNode.removeChild(el);
    });
    var leftDes = document.createElement('div');
    leftDes.className = 'left-div left-des';
    var addrIcon1 = '<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M512 249.976471c-99.388235 0-180.705882 81.317647-180.705882 180.705882s81.317647 180.705882 180.705882 180.705882 180.705882-81.317647 180.705882-180.705882-81.317647-180.705882-180.705882-180.705882z m0 301.17647c-66.258824 0-120.470588-54.211765-120.470588-120.470588s54.211765-120.470588 120.470588-120.470588 120.470588 54.211765 120.470588 120.470588-54.211765 120.470588-120.470588 120.470588z"></path><path d="M512 39.152941c-216.847059 0-391.529412 174.682353-391.529412 391.529412 0 349.364706 391.529412 572.235294 391.529412 572.235294s391.529412-222.870588 391.529412-572.235294c0-216.847059-174.682353-391.529412-391.529412-391.529412z m0 891.482353C424.658824 873.411765 180.705882 686.682353 180.705882 430.682353c0-183.717647 147.576471-331.294118 331.294118-331.294118s331.294118 147.576471 331.294118 331.294118c0 256-243.952941 442.729412-331.294118 499.952941z"></path></svg>';
    var addrIcon2 = '<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M729.6 234.666667H294.4V157.866667a51.2 51.2 0 0 1 51.2-51.2h332.8a51.2 51.2 0 0 1 51.2 51.2v76.8z m179.2 51.2a51.2 51.2 0 0 1 51.2 51.2v512a51.2 51.2 0 0 1-51.2 51.2H115.2a51.2 51.2 0 0 1-51.2-51.2v-512a51.2 51.2 0 0 1 51.2-51.2h793.557333z m-768 172.032c0 16.384 13.312 29.696 29.696 29.696h683.008a29.696 29.696 0 1 0 0-59.392H170.410667a29.696 29.696 0 0 0-29.696 29.696z m252.416 118.784c0 16.384 13.312 29.696 29.696 29.696h178.176a29.696 29.696 0 1 0 0-59.392H422.912a29.738667 29.738667 0 0 0-29.696 29.696z"></path></svg>';
    var item1 = document.createElement('div');
    item1.className = 'left-des-item';
    item1.innerHTML = addrIcon1 + data.addressLines[0];
    var item2 = document.createElement('div');
    item2.className = 'left-des-item';
    item2.innerHTML = addrIcon2 + data.addressLines[1];
    leftDes.appendChild(item1);
    leftDes.appendChild(item2);
    container.appendChild(leftDes);
    function makeTagSection(title, tags) {
        var wrap = document.createElement('div');
        wrap.className = 'left-div left-tag';
        var header = document.createElement('div');
        header.className = 'left-des-item';
        var tagIcon = '<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M483.2 790.3L861.4 412c1.7-1.7 2.5-4 2.3-6.3l-25.5-301.4c-0.7-7.8-6.8-13.9-14.6-14.6L522.2 64.3c-2.3-0.2-4.7 0.6-6.3 2.3L137.7 444.8c-3.1 3.1-3.1 8.2 0 11.3l334.2 334.2c3.1 3.2 8.2 3.2 11.3 0z m62.6-651.7l224.6 19 19 224.6L477.5 694 233.9 450.5l311.9-311.9z" fill="#ffffff"></path><path d="M605.958852 324.826232a48 48 0 1 0 67.881066-67.883435 48 48 0 1 0-67.881066 67.883435Z" fill="#ffffff"></path><path d="M889.7 539.8l-39.6-39.5c-3.1-3.1-8.2-3.1-11.3 0l-362 361.3-237.6-237c-3.1-3.1-8.2-3.1-11.3 0l-39.6 39.5c-3.1 3.1-3.1 8.2 0 11.3l243.2 242.8 39.6 39.5c3.1 3.1 8.2 3.1 11.3 0l407.3-406.6c3.1-3.1 3.1-8.2 0-11.3z" fill="#ffffff"></path></svg>';
        header.innerHTML = tagIcon + title;
        wrap.appendChild(header);
        tags.forEach(function (t) {
            var d = document.createElement('div');
            d.className = 'left-tag-item';
            d.textContent = t;
            wrap.appendChild(d);
        });
        return wrap;
    }
    container.appendChild(makeTagSection(data.titles.personal, data.personalTags));
    container.appendChild(makeTagSection(data.titles.acgn, data.acgnTags));
    container.appendChild(makeTagSection(data.titles.xp, data.xpTags));
    var leftTime = document.createElement('div');
    leftTime.className = 'left-div left-time';
    var ul = document.createElement('ul');
    ul.id = 'line';
    data.updates.forEach(function (u) {
        var li = document.createElement('li');
        var focus = document.createElement('div');
        focus.className = 'focus';
        var div1 = document.createElement('div');
        div1.textContent = u.title;
        var div2 = document.createElement('div');
        div2.textContent = u.date;
        li.appendChild(focus);
        li.appendChild(div1);
        li.appendChild(div2);
        ul.appendChild(li);
    });
    leftTime.appendChild(ul);
    container.appendChild(leftTime);
}
document.addEventListener('DOMContentLoaded', function () {
    renderSidebar();
});

function getBasePath() {
    var slugs = ['about-us', 'contact-us', 'tools', 'privacy-policy', 'terms-and-conditions', 'download'];
    var isSub = slugs.some(function (slug) {
        return window.location.pathname.indexOf('/' + slug + '/') !== -1;
    }) || !(/\/$|\/index\.html$|\/KirisameMarisa-DAZE\.github\.io\/?$/.test(window.location.pathname));
    return isSub ? '../' : './';
}

function getNavbarDefaults() {
    var basePath = getBasePath();
    return {
        logoSrc: basePath + 'static/img/title.jpeg',
        logoHref: 'https://Shameimaru-Ayaya.github.io/',
        logoText: '射命丸文',
        links: [
            { href: 'https://Shameimaru-Ayaya.github.io/', text: 'Home' },
            { href: 'https://Shameimaru-Ayaya.github.io/about-us/', text: 'About us' },
            { href: 'https://Shameimaru-Ayaya.github.io/contact-us/', text: 'Contact us' },
            { href: 'https://Shameimaru-Ayaya.github.io/tools/', text: 'Tools' },
            { href: 'https://Shameimaru-Ayaya.github.io/download/', text: 'Download' },
            { href: 'https://Shameimaru-Ayaya.github.io/privacy-policy/', text: 'Privacy Policy' },
            { href: 'https://Shameimaru-Ayaya.github.io/terms-and-conditions/', text: 'Terms and Conditions' }
        ]
    };
}

function renderNavbar() {
    var container = document.querySelector('.marisa-navbar');
    if (!container) return;
    var defaults = getNavbarDefaults();
    var overrides = window.navbarOverrides || {};
    var data = {
        logoSrc: overrides.logoSrc || defaults.logoSrc,
        logoHref: overrides.logoHref || defaults.logoHref,
        logoText: overrides.logoText || defaults.logoText,
        links: overrides.links || defaults.links
    };
    container.innerHTML = '';
    var navbarContainer = document.createElement('div');
    navbarContainer.className = 'navbar-container';
    var navbarLogo = document.createElement('div');
    navbarLogo.className = 'navbar-logo';
    var logoImg = document.createElement('img');
    logoImg.src = data.logoSrc;
    logoImg.alt = 'Logo';
    var logoAnchor = document.createElement('a');
    logoAnchor.href = data.logoHref;
    var logoSpan = document.createElement('span');
    logoSpan.textContent = data.logoText;
    logoAnchor.appendChild(logoSpan);
    navbarLogo.appendChild(logoImg);
    navbarLogo.appendChild(logoAnchor);
    var navbarLinks = document.createElement('div');
    navbarLinks.className = 'navbar-links';
    data.links.forEach(function (l) {
        var a = document.createElement('a');
        a.href = l.href;
        a.className = 'navbar-link';
        a.textContent = l.text;
        navbarLinks.appendChild(a);
    });
    var navbarToggle = document.createElement('div');
    navbarToggle.className = 'navbar-toggle';
    var toggleSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    toggleSvg.setAttribute('class', 'icon');
    toggleSvg.setAttribute('viewBox', '0 0 1024 1024');
    toggleSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    var togglePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    togglePath.setAttribute('d', 'M128 256h768v86H128v-86zm0 298v-84h768v84H128zm0 256v-86h768v86H128z');
    toggleSvg.appendChild(togglePath);
    navbarToggle.appendChild(toggleSvg);
    navbarContainer.appendChild(navbarLogo);
    navbarContainer.appendChild(navbarLinks);
    navbarContainer.appendChild(navbarToggle);
    container.appendChild(navbarContainer);
    navbarToggle.addEventListener('click', function () {
        navbarLinks.classList.toggle('active');
    });
}
document.addEventListener('DOMContentLoaded', function () {
    renderNavbar();
});

/* 标签云布局算法优化版 */
function initWordCloud() {
    const containers = document.querySelectorAll('.left-tag');
    
    containers.forEach(container => {
        // 标记已初始化，防止重复，但允许Resize时强制刷新
        if (container.dataset.cloud === 'on' && !window.isResizing) return;
        container.dataset.cloud = 'on';

        let items = Array.from(container.querySelectorAll('.left-tag-item'));
        if (items.length === 0) return;

        // --- 配置参数 ---
        const config = {
            maxFontSize: 32,
            minFontSize: 12,
            padding: 8,         // 增加间距
            maxItems: 60,       // 限制数量优化性能
            spiralStep: 5,      // 螺旋步长
            angleStep: 0.2      // 角度步长 (更精细)
        };

        // --- 1. 预处理与测量 (减少回流) ---
        
        // 限制标签数量
        if (items.length > config.maxItems) {
            items.slice(config.maxItems).forEach(el => el.style.display = 'none');
            items = items.slice(0, config.maxItems);
        } else {
            items.forEach(el => el.style.display = '');
        }

        // 批量设置样式并测量
        const measuredItems = items.map((item, index) => {
            // 样式计算
            const ratio = index / items.length;
            const fontSize = Math.max(config.minFontSize, config.maxFontSize - (config.maxFontSize - config.minFontSize) * ratio);
            const opacity = Math.max(0.6, 1 - ratio * 0.4);
            const fontWeight = index === 0 ? 900 : (index < 5 ? 700 : 400);

            // 应用样式
            item.style.fontSize = fontSize + 'px';
            item.style.fontWeight = fontWeight;
            item.style.opacity = opacity;
            item.style.position = 'absolute';
            item.style.transition = 'transform 0.3s ease, opacity 0.3s ease'; // 优化交互动画

            // 交互事件 (鼠标靠近高亮)
            item.onmouseenter = () => {
                items.forEach(el => {
                    if (el === item) {
                        el.style.opacity = '1';
                        el.style.zIndex = '100';
                        el.style.transform = 'scale(1.2)';
                    } else {
                        el.style.opacity = '0.3';
                    }
                });
            };
            item.onmouseleave = () => {
                items.forEach((el, idx) => {
                    const r = idx / items.length;
                    el.style.opacity = Math.max(0.6, 1 - r * 0.4);
                    el.style.zIndex = '';
                    el.style.transform = '';
                });
            };

            return {
                element: item,
                width: item.offsetWidth,
                height: item.offsetHeight,
                area: item.offsetWidth * item.offsetHeight
            };
        });

        // 按面积大小排序，优先放置大标签
        measuredItems.sort((a, b) => b.area - a.area);

        // --- 2. 空间分区 (加速碰撞检测) ---
        const gridSize = 60; // 网格大小
        const grid = {}; 

        function addToGrid(rect) {
            const startX = Math.floor(rect.left / gridSize);
            const endX = Math.floor(rect.right / gridSize);
            const startY = Math.floor(rect.top / gridSize);
            const endY = Math.floor(rect.bottom / gridSize);

            for (let x = startX; x <= endX; x++) {
                for (let y = startY; y <= endY; y++) {
                    const key = `${x},${y}`;
                    if (!grid[key]) grid[key] = [];
                    grid[key].push(rect);
                }
            }
        }

        function checkCollision(rect) {
            const startX = Math.floor(rect.left / gridSize);
            const endX = Math.floor(rect.right / gridSize);
            const startY = Math.floor(rect.top / gridSize);
            const endY = Math.floor(rect.bottom / gridSize);

            for (let x = startX; x <= endX; x++) {
                for (let y = startY; y <= endY; y++) {
                    const key = `${x},${y}`;
                    if (grid[key]) {
                        for (const other of grid[key]) {
                            // 严格碰撞检测 (包含padding)
                            if (!(rect.right < other.left || 
                                  rect.left > other.right || 
                                  rect.bottom < other.top || 
                                  rect.top > other.bottom)) {
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        }

        // --- 3. 布局计算 ---
        const containerWidth = container.offsetWidth;
        // 初始中心点
        const centerX = containerWidth / 2;
        const centerY = 170; // 预设一个起始高度中心，随内容扩展

        let minTop = centerY;
        let maxBottom = centerY;

        measuredItems.forEach(item => {
            // 包含padding的尺寸
            const w = item.width + config.padding;
            const h = item.height + config.padding;
            
            let angle = 0;
            let radius = 0;
            let x = 0;
            let y = 0;
            let found = false;
            // 限制尝试次数，防止死循环
            let maxIter = 1000; 

            while(maxIter-- > 0) {
                // 螺旋公式
                x = centerX + radius * Math.cos(angle) - w / 2;
                y = centerY + radius * Math.sin(angle) - h / 2;

                const rect = {
                    left: x,
                    top: y,
                    right: x + w,
                    bottom: y + h
                };

                // 边界检查 (增加垂直方向限制)
                if (rect.left < 0 || rect.right > containerWidth || rect.top < 25 || rect.bottom > config.maxContainerHeight) {
                    // 超出边界，继续寻找
                } else {
                    if (!checkCollision(rect)) {
                        // 找到位置
                        found = true;
                        
                        // 记录实际位置 (去掉padding偏移，居中放置)
                        item.element.style.left = (x + config.padding / 2) + 'px';
                        item.element.style.top = (y + config.padding / 2) + 'px';
                        
                        addToGrid(rect);
                        
                        // 更新整体边界
                        if (rect.top < minTop) minTop = rect.top;
                        if (rect.bottom > maxBottom) maxBottom = rect.bottom;
                        break;
                    }
                }

                // 步长递增
                angle += config.angleStep;
                radius += config.spiralStep * config.angleStep / (2 * Math.PI);
            }

            if (!found) {
                // 降级处理：隐藏
                item.element.style.opacity = '0';
                item.element.style.pointerEvents = 'none';
            }
        });

        // --- 4. 调整容器高度 ---
        // 确保容器足够高以容纳所有内容
        const finalHeight = Math.max(300, maxBottom + 50);
        container.style.height = finalHeight + 'px';
    });
}

document.addEventListener('DOMContentLoaded', function () {
    
    // 渲染公共组件
    renderRightHeader();
    renderFooter();

    // 延迟执行确保字体加载和样式应用
    setTimeout(initWordCloud, 100);
});

// 窗口大小改变时重排
let resizeTimer;
window.addEventListener('resize', () => {
    window.isResizing = true;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.querySelectorAll('.left-tag').forEach(c => c.dataset.cloud = ''); // 重置标记
        initWordCloud();
        window.isResizing = false;
    }, 300);
});

function getRightHeaderDefaults() {
    var basePath = getBasePath();
    return {
        logoBgUrl: basePath + 'static/img/title.jpeg',
        logoFrameUrl: basePath + 'static/img/logokuang.png',
        welcomeHtml: '夢と現と交えては、<span class="gradientText">幻想郷</span>に、遊ぶがいい',
        desc1Html: '私は　伝統の幻想ブン屋　<span class="purpleText">射命丸文</span>　や',
        desc2Html: '<span class="purpleText textBackground">あなた、ご自分の事ばかりですのね</span>',
        showSnake: false,
        icons: [
            {
                tip: 'GitHub',
                href: 'https://github.com/Shameimaru-Ayaya',
                onclick: '',
                target: '_blank',
                viewBox: '0 0 1024 1024',
                path: 'M682.215454 981.446137c-25.532318 0-42.553863-17.021545-42.553864-42.553864v-165.960067c4.255386-34.043091-8.510773-59.575409-29.787704-80.852341-12.766159-12.766159-17.021545-29.787704-8.510773-42.553864 4.255386-17.021545 21.276932-25.532318 34.043091-29.787704 123.406204-12.766159 238.301635-55.320023 238.301635-255.323181 0-46.80925-17.021545-93.6185-51.064636-131.916976-12.766159-12.766159-12.766159-29.787704-8.510772-42.553864 12.766159-34.043091 12.766159-68.086182 4.255386-102.129272-21.276932 4.255386-55.320023 17.021545-110.640045 55.320022-8.510773 8.510773-21.276932 8.510773-34.043091 4.255387-89.363113-25.532318-187.236999-25.532318-276.600112 0-12.766159 4.255386-25.532318 4.255386-38.298477-4.255387C307.741455 104.836549 269.442978 92.07039 248.166047 87.815004c-8.510773 34.043091-8.510773 68.086182 4.255386 102.129272 4.255386 17.021545 4.255386 34.043091-8.510773 42.553864-34.043091 38.298477-51.064636 85.107727-51.064636 131.916976 0 200.003158 114.895431 242.557022 238.301635 255.323181 17.021545 0 29.787704 12.766159 34.043091 29.787704 4.255386 17.021545 0 34.043091-8.510773 42.553864-21.276932 21.276932-29.787704 46.80925-29.787704 76.596954v165.960068c0 25.532318-17.021545 42.553863-42.553863 42.553863s-42.553863-17.021545-42.553864-42.553863v-72.341568c-127.66159 21.276932-182.981613-51.064636-221.28009-97.873886-17.021545-21.276932-29.787704-38.298477-46.80925-42.553864-21.276932-4.255386-38.298477-29.787704-29.787704-51.064636 4.255386-21.276932 29.787704-38.298477 51.064636-29.787704 42.553863 12.766159 68.086182 42.553863 93.6185 72.341568 34.043091 46.80925 63.830795 80.852341 153.193908 63.830795v-4.255386c0-25.532318 4.255386-55.320023 12.766159-76.596955-119.150818-25.532318-246.812408-102.129272-246.812408-327.664748 0-63.830795 21.276932-123.406204 59.575409-170.215454-17.021545-59.575409-12.766159-114.895431 12.766159-170.215454 4.255386-12.766159 12.766159-21.276932 25.532318-25.532318 17.021545-4.255386 72.341568-12.766159 187.236999 59.575409 93.6185-21.276932 191.492386-21.276932 280.855499 0 110.640045-72.341568 170.215454-63.830795 187.236999-59.575409 12.766159 4.255386 21.276932 12.766159 25.532319 25.532318 21.276932 55.320023 25.532318 110.640045 12.766159 165.960067 38.298477 46.80925 59.575409 106.384659 59.575408 170.215454 0 242.557022-144.683136 306.387817-246.812408 331.920135 8.510773 25.532318 12.766159 55.320023 12.766159 80.852341V938.892273c0 25.532318-17.021545 42.553863-42.553863 42.553864z'
            },
            {
                tip: 'Mail',
                href: 'mailto:shameimaru.ayaaya@gmail.com',
                onclick: '',
                target: '_blank',
                viewBox: '0 0 1024 1024',
                path: 'M858.656 192 165.344 192C109.472 192 64 237.44 64 293.312l0 469.376C64 818.56 109.472 864 165.344 864l693.312 0C914.528 864 960 818.56 960 762.688L960 293.312C960 237.44 914.528 192 858.656 192zM858.656 800 165.344 800C144.736 800 128 783.264 128 762.688L128 293.312C128 272.736 144.736 256 165.344 256l684.544 0-307.488 279.808c-14.592 14.56-38.272 14.528-54.752-1.792l-244.256-206.752C229.856 315.84 209.664 317.504 198.272 331.008c-11.424 13.472-9.76 33.664 3.744 45.088l242.304 204.96c19.904 19.904 46.048 29.792 72.032 29.792 25.632 0 51.136-9.632 70.176-28.736L896 300.544l0 462.144C896 783.264 879.264 800 858.656 800z'
            },
            {
                tip: 'X',
                href: 'https://x.com/__MasterSpark__',
                onclick: '',
                target: '_blank',
                viewBox: '0 0 1088 1024',
                path: 'M647.488 433.344L1052.544 0h-96L604.864 376.32 323.968 0H0l424.768 568.96L0 1023.552h96l371.392-397.44 296.64 397.44H1088l-440.512-590.08zM516.032 574.08l-43.008-56.64-342.4-450.88h147.392l276.352 363.904 43.008 56.64L956.608 960h-147.456l-293.12-385.92z'
            },
            {
                tip: 'Facebook',
                href: 'https://www.facebook.com/share/18ScAECBgU/?mibextid=wwXIfr',
                onclick: '',
                target: '_blank',
                viewBox: '0 0 1024 1024',
                path: 'M764.276115 324.243956a66.170784 66.170784 0 0 0-52.936627-26.468313H610.429042v-66.170785h66.170784a66.170784 66.170784 0 0 0 66.170784-66.170784V66.177898a66.170784 66.170784 0 0 0-66.170784-66.170785h-92.639098a226.800363 226.800363 0 0 0-114.144603 29.776853C428.459385 54.59801 378.831297 105.880368 378.831297 208.445084v87.676289H312.660512a60.049987 60.049987 0 0 0-46.319549 19.851235A73.118717 73.118717 0 0 0 246.489728 362.292157v99.256177a66.170784 66.170784 0 0 0 66.170784 66.170784h66.170785v430.110098a66.170784 66.170784 0 0 0 66.170784 66.170784h99.256176a66.170784 66.170784 0 0 0 66.170785-66.170784v-430.110098h77.750671a66.170784 66.170784 0 0 0 62.862245-47.973819l23.159775-99.256176a58.561144 58.561144 0 0 0-9.925618-56.245167z m-76.096402 137.304378H544.258257v496.280882h-99.256176v-496.280882H312.660512v-99.256177h132.341569v-153.847073C445.002081 74.449246 557.492414 66.177898 583.960728 66.177898H676.599826v99.256176h-86.02202c-47.973819 0-46.319549 39.702471-46.319549 39.702471v157.155612h167.081231z'
            },
            {
                tip: 'Instagram',
                href: 'https://www.instagram.com/shikikamiyama/profilecard/?igsh=MWFnZWVmZHJpeDN2aQ==',
                onclick: '',
                target: '_blank',
                viewBox: '0 0 1024 1024',
                path: 'M725.333333 341.333333a42.666667 42.666667 0 1 1 0-85.333333 42.666667 42.666667 0 0 1 0 85.333333zM341.333333 170.666667a170.666667 170.666667 0 0 0-170.666666 170.666666v341.333334a170.666667 170.666667 0 0 0 170.666666 170.666666h341.333334a170.666667 170.666667 0 0 0 170.666666-170.666666V341.333333a170.666667 170.666667 0 0 0-170.666666-170.666666H341.333333z m0-85.333334h341.333334a256 256 0 0 1 256 256v341.333334a256 256 0 0 1-256 256H341.333333a256 256 0 0 1-256-256V341.333333a256 256 0 0 1 256-256z m90.88 624.554667a42.666667 42.666667 0 0 1 31.957334-79.104 128 128 0 1 0-70.869334-70.826667 42.666667 42.666667 0 1 1-79.104 32 213.333333 213.333333 0 1 1 118.058667 117.930667z'
            }
        ]
    };
}

function renderRightHeader() {
    var container = document.querySelector('.marisa-right header');
    if (!container) return;
    
    // Allow overrides
    var defaults = getRightHeaderDefaults();
    var overrides = window.rightHeaderOverrides || {};
    var data = {
        logoBgUrl: overrides.logoBgUrl || defaults.logoBgUrl,
        logoFrameUrl: overrides.logoFrameUrl || defaults.logoFrameUrl,
        welcomeHtml: overrides.welcomeHtml || defaults.welcomeHtml,
        desc1Html: overrides.desc1Html || defaults.desc1Html,
        desc2Html: overrides.desc2Html || defaults.desc2Html,
        showSnake: (overrides.showSnake !== undefined) ? overrides.showSnake : defaults.showSnake,
        icons: overrides.icons || defaults.icons
    };

    container.innerHTML = '';
    
    // Logo
    var logoDiv = document.createElement('div');
    logoDiv.className = 'index-logo';
    logoDiv.style.backgroundImage = 'url(' + data.logoBgUrl + ')';
    var logoImg = document.createElement('img');
    logoImg.style.cssText = 'position: absolute;top:-20%;left:-14%;width: 133%; aspect-ratio: 1/1;';
    logoImg.src = data.logoFrameUrl;
    logoDiv.appendChild(logoImg);
    container.appendChild(logoDiv);
    
    // Welcome
    var welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'welcome';
    welcomeDiv.innerHTML = data.welcomeHtml;
    container.appendChild(welcomeDiv);
    
    // Description 1
    var desc1Div = document.createElement('div');
    desc1Div.className = 'description';
    desc1Div.innerHTML = data.desc1Html;
    container.appendChild(desc1Div);
    
    // Description 2
    var desc2Div = document.createElement('div');
    desc2Div.className = 'description';
    desc2Div.innerHTML = data.desc2Html;
    container.appendChild(desc2Div);
    
    // Icon Container
    var iconContainer = document.createElement('div');
    iconContainer.className = 'iconContainer';
    
    data.icons.forEach(function(icon) {
        var a = document.createElement('a');
        a.className = 'iconItem';
        if (icon.target) a.target = icon.target;
        if (icon.onclick) a.setAttribute('onclick', icon.onclick);
        a.href = icon.href;
        
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'icon');
        svg.setAttribute('viewBox', icon.viewBox);
        svg.setAttribute('width', '20');
        svg.setAttribute('height', '20');
        
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', icon.path);
        
        svg.appendChild(path);
        a.appendChild(svg);
        
        var tip = document.createElement('div');
        tip.className = 'iconTip';
        tip.textContent = icon.tip;
        a.appendChild(tip);
        
        iconContainer.appendChild(a);
    });
    
    // Switch
    var switchLink = document.createElement('a');
    switchLink.className = 'switch';
    switchLink.href = 'javascript:void(0)';
    var switchHtml = '<div class="onoffswitch">' +
        '<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch" checked>' +
        '<label class="onoffswitch-label" for="myonoffswitch">' +
        '<span class="onoffswitch-inner"></span>' +
        '<span class="onoffswitch-switch"></span>' +
        '</label></div>';
    switchLink.innerHTML = switchHtml;
    iconContainer.appendChild(switchLink);
    
    container.appendChild(iconContainer);

    // Snake
    if (data.showSnake) {
        var snakeDiv = document.createElement('div');
        snakeDiv.className = 'tanChiShe';
        var snakeImg = document.createElement('img');
        snakeImg.id = 'tanChiShe';
        snakeImg.src = getBasePath() + 'static/svg/snake-' + themeState + '.svg';
        snakeImg.alt = '';
        snakeDiv.appendChild(snakeImg);
        container.appendChild(snakeDiv);
    }

    initThemeSwitch();
}

function getFooterDefaults() {
    return {
        startYear: 2022,
        author: 'GitHub@Shameimaru-Ayaya',
        authorUrl: 'https://github.com/Shameimaru-Ayaya',
        rights: 'All rights reserved.'
    };
}

function renderFooter() {
    var footer = document.querySelector('footer');
    if (!footer) return;
    
    var defaults = getFooterDefaults();
    var overrides = window.footerOverrides || {};
    var data = {
        startYear: overrides.startYear || defaults.startYear,
        author: overrides.author || defaults.author,
        authorUrl: overrides.authorUrl || defaults.authorUrl,
        rights: overrides.rights || defaults.rights
    };
    
    var currentYear = new Date().getFullYear();
    var yearStr = data.startYear + '-' + currentYear;
    
    footer.innerHTML = 'Copyright © ' + yearStr + ' <a href="' + data.authorUrl + '">' + data.author + '.</a><br>' + data.rights;
}
