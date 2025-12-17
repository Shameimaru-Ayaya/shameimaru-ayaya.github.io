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


