var Pu = {
    kS: "MBDRTNFJCAPOSQEIGWLHVYZUKXmbdrtnfjcaposqeigwlhvyzukx3508749216+/=",

    // Get a cookie value by name
    gC: function(name) {
        var match = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "$1") + "=([^;]*)"));
        return match ? decodeURIComponent(match[1]) : undefined;
    },

    // Set a cookie with options
    sC: function(name, value, options = {}) {
        options = { path: "/", ...options };
        if (options.expires instanceof Date) {
            options.expires = options.expires.toUTCString();
        }
        let cookieStr = encodeURIComponent(name) + "=" + encodeURIComponent(value);
        for (var prop in options) {
            cookieStr += "; " + prop;
            var propValue = options[prop];
            if (propValue !== true) {
                cookieStr += "=" + propValue;
            }
        }
        document.cookie = cookieStr;
    },

    // Delete a cookie
    dC: function(name) {
        this.sC(name, "", { "max-age": -1 });
    },

    // Set item in localStorage
    sLS: function(key, value) {
        localStorage.setItem(key, value);
    },

    // Get item from localStorage
    gLS: function(key) {
        return localStorage.getItem(key);
    },

    // Remove item from localStorage
    rLS: function(key) {
        localStorage.removeItem(key);
    },

    // Set item in sessionStorage
    sSS: function(key, value) {
        sessionStorage.setItem(key, value);
    },

    // Get item from sessionStorage
    gSS: function(key) {
        return sessionStorage.getItem(key);
    },

    // Remove item from sessionStorage
    rSS: function(key) {
        sessionStorage.removeItem(key);
    },

    // Get a random item from an array
    rdm: function(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    // Abbreviate a number
    abv: function(num) {
        const sign = Math.sign(+num);
        if (Math.abs(+num) >= 1e9) {
            return sign * (Math.abs(+num) / 1e9).toFixed(2) + "B";
        } else if (Math.abs(+num) >= 1e6) {
            return sign * (Math.abs(+num) / 1e6).toFixed(2) + "M";
        } else if (Math.abs(+num) >= 1e3) {
            return sign * (Math.abs(+num) / 1e3).toFixed(2) + "K";
        } else {
            return Math.abs(+num);
        }
    },

    // Make an AJAX GET request
    gAj: function(options) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    options.success(xhr.responseText);
                } else if (typeof options.error === "function") {
                    options.error(xhr);
                }
            }
        };
        xhr.open("GET", options.url, options.async);
        xhr.send();
    }
};

// Helper functions for DOM manipulation
function getid(id) {
    return document.getElementById(id);
}

function getclass(className) {
    return document.getElementsByClassName(className);
}

function qSel(selector) {
    return document.querySelector(selector);
}

function qSell(selector) {
    return document.querySelectorAll(selector);
}

function remAttr(element, ...attributes) {
    attributes.forEach(attr => element.removeAttribute(attr));
}

function rEl(...selectors) {
    const elements = qSell(selectors);
    if (elements.length > 0) {
        for (let i = 0; i < elements.length; i++) {
            elements[i].parentNode.removeChild(elements[i]);
        }
    }
}

function addCt(element, className) {
    element.classList.add(className);
}

function remCt(element, className) {
    element.classList.remove(className);
}

function stS(elementId) {
    window.scroll({ top: getid(elementId).offsetTop - 20, left: 0, behavior: "smooth" });
}

function stC(elementId) {
    getid(elementId).scrollIntoView({ behavior: "smooth", block: "center" });
}

function stE(elementId) {
    getid(elementId).scrollIntoView({ behavior: "smooth", block: "end" });
}

// Load a JavaScript file dynamically
function ldJs(src, id, async, parentSelector, callback) {
    const script = document.createElement("script");
    script.id = id;
    script.async = async;
    script.src = src;
    if (callback) {
        script.onload = callback;
    }
    qSel(parentSelector).appendChild(script);
}

// Load a CSS file dynamically
function ldCss(href, id, callback) {
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = href;
    if (callback) {
        link.onload = callback;
    }
    document.head.appendChild(link);
}

// Escape and unescape HTML strings
(function(context, element) {
    var t = function(str) {
        return typeof str === "string";
    };
    var textarea = element.textarea;
    context.target[element.escape] = function(str) {
        return t(str) || (str = ""), textarea.innerText = str, textarea.innerHTML;
    };
    context.target[element.unescape] = function(str) {
        return t(str) || (str = ""), textarea.innerHTML = str, textarea.innerText;
    };
}).call(this, { target: window, escape: "esHTML", unescape: "ueHTML" }, { textarea: document.createElement("textarea") });





// Base URL for external resources
var baseUrl = "https://cdn.jsdelivr.net/gh/fineshop/plus-ui@2.6";

// Google Translate Initialization
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: PuSet.gTranslate.pageLang,
        includedLanguages: PuSet.gTranslate.includedLangs,
        autoDisplay: PuSet.gTranslate.autoDisplay,
        multilanguagePage: PuSet.gTranslate.multiLangPage,
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, "google_translate_element");
}

// Track and display post views using Firebase
function puViews() {
    if (PuSet.realViews.databaseUrl && null != getid("fb-db") && 0 < firebase.apps.length) {
        var elements = qSell(".pu-views");
        var database = firebase.database();

        elements.forEach(function(element) {
            var postId = element.getAttribute("data-id");
            var postRef = database.ref("BlogID_" + blogID + "/PostID_" + postId);

            postRef.once("value", function(snapshot) {
                var viewsCount = snapshot.exists() ? snapshot.val() : 0;
                if (viewsCount > 0) {
                    if (PuSet.realViews.abbreviation) {
                        element.setAttribute("data-text", Pu.abv(viewsCount));
                    } else {
                        element.setAttribute("data-text", viewsCount);
                    }
                    remCt(element, "hidden");
                }
                // Increment view count if applicable
                if (element.getAttribute("data-add") === "true") {
                    element.setAttribute("data-add", false);
                    viewsCount += 1;
                    postRef.set(viewsCount);
                }
            });
        });
    }
}

// Blog Admin Handling
function blogAdmin() {
    var maintainCont = qSel("#maintainCont");
    if (maintainCont) {
        addCt(maintainCont, "hdn");
    }
}


// load javascript exampe 
ldJs(baseUrl + "/js/CopyPreContent.min.js", "pre-js", true, "body");

// load css example
ldCss(baseUrl + "/css/MobileFonts.min.css", "mbf-css");

// Countdown Download Box
if (qSell(".dldCo").length > 0) {
    ldJs(baseUrl + "/js/CountdownDownloadBox.min.js", "cdb-js", true, "body", function() {
        ldCss(baseUrl + "/css/CountdownDownloadBox.min.css", "cdb-css");
    });