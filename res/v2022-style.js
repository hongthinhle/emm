
class CLG_Toast {
    constructor(options) {
        var defaults = [];
        options = [...defaults, ...options];
        var _this = this;
        var toast_temp = '<div class="clg-toast-content">\n        <i class="%toast-icon% clg-toast-icon"></i>\n        <div class="clg-toast-message">\n            <span class="clg-toast-text clg-toast-text-title">%message-title%</span>\n            <span class="clg-toast-text clg-toast-text-message">%message-content%</span>\n        </div>\n    </div>\n    <i id="%toast-id%-close" class="fa-duotone fa-xmark clg-toast-close"></i>\n    <div id="%toast-id%-progress" class="clg-toast-progress"></div>';

        this.createElement_Content = (toast_id, toast_type, toast_icon, toast_title, message, timeout)=>{
            let toast_html = toast_temp;
            toast_html = toast_html.replace(/%toast-id%/g, toast_id);
            toast_html = toast_html.replace(/%toast-type%/g, toast_type);
            toast_html = toast_html.replace(/%toast-icon%/g, toast_icon);
            toast_html = toast_html.replace(/%message-title%/g, toast_title);
            toast_html = toast_html.replace(/%message-content%/g, message);

            const divElement = document.createElement("div");
            divElement.innerHTML = toast_html;
            divElement.id = toast_id;
            divElement.classList.add('clg-toast');
            divElement.classList.add(toast_type);
            divElement.classList.add('active');

            var elementToastMain = document.getElementById('clg-toast-main');
            elementToastMain.appendChild(divElement);

            const toast_close = document.getElementById(toast_id+'-close');
            const toast_progress = document.getElementById(toast_id+'-progress');
            toast_progress.classList.add('active');
            var toast_progress_style = toast_progress.style;
            

            toast_close.addEventListener('click', ()=>{
                divElement.classList.remove('active');
                toast_progress.classList.remove('active');
                elementToastMain.removeChild(divElement);
            })
            if(0<timeout){
                toast_progress_style.setProperty('--animation', 'progress '+timeout/1000+'s linear forwards');
                setTimeout(()=>{
                    try {
                        divElement.classList.remove('active');
                        toast_progress.classList.remove('active');
                        elementToastMain.removeChild(divElement);
                    } catch (error) {
                        
                    }
                }, timeout)
            } else {
                toast_progress_style.setProperty('--animation', 'progress '+0+'s linear forwards');
            }
            elementToastMain.classList.add('active');
        }
        this.success = (title = 'Success', message, timeout)=>{
            let toast_id = md5(Date.now()+Math.random()*1000);
            let toast_type = 'clg-toast-success';
            let toast_icon = 'fa-solid fa-circle-check';
            let toast_title = title;
            
            _this.createElement_Content(toast_id, toast_type, toast_icon, toast_title, message, timeout);
        }
        this.infor = (title = 'Information', message, timeout)=>{
            let toast_id = md5(Date.now()+Math.random()*1000);
            let toast_icon = 'fa-solid fa-circle-info';
            let toast_type = 'clg-toast-primary';
            let toast_title = title;
            
            _this.createElement_Content(toast_id, toast_type, toast_icon, toast_title, message, timeout);
        }
        this.warning = (title = 'Warning', message, timeout)=>{
            let toast_id = md5(Date.now()+Math.random()*1000);
            let toast_icon = 'fa-solid fa-triangle-exclamation';
            let toast_type = 'clg-toast-warning';
            let toast_title = title;
            
            _this.createElement_Content(toast_id, toast_type, toast_icon, toast_title, message, timeout);
        }
        this.init = () => {
            const elementToast_Main = document.createElement("div");
            elementToast_Main.id = 'clg-toast-main';
            document.body.appendChild(elementToast_Main);
        };
        _this.init();
        // CLG_Toast_Class.success('Upload', 'Xin chào Việt Nam + Success', 5000);
    }
}

class CLG_Navigation {
    constructor(options) {
        var defaults = {
            nav: '.clg-apps-nav',
            navMenu: '.clg-apps-nav-menu',
            navToggle: '.clg-apps-nav-toggle',
            navContent: '.clg-apps-nav-content'
        };

        options = {...defaults, ...options};
        const 
            nav = document.querySelector(options.nav),
            navToggle = document.querySelector(options.navToggle),
            navMenu = document.querySelector(options.navMenu),
            navcontent = document.querySelector(options.navContent);

        var _this = this;

        this.menuToggle_onclick = () => {
            navToggle.classList.toggle('active');
            nav.classList.toggle('active');
            navcontent.classList.toggle('active');
        }

        this.init = () => {
            navMenu.addEventListener("mouseenter", function( event ) {
                _this.menuToggle_onclick();
            })
            navMenu.addEventListener("mouseleave", function( event ) {
                _this.menuToggle_onclick();
            })

            let list = document.querySelectorAll('.clg-apps-nav-list-menu');
            for (let i = 0; i < list.length; i++) {
                list[i].onclick = function(){
                    let j=0;
                    while (j<list.length) {
                        list[j++].className = 'clg-apps-nav-list-menu';
                    }
                    list[i].className = 'clg-apps-nav-list-menu active';

                    let navigation_pane = document.getElementsByClassName('clg-apps-nav-pane');
                    for (let p = 0; p < navigation_pane.length; p++) {
                        navigation_pane[p].className = "clg-apps-nav-pane";
                    }

                    let navpage_value = list[i].getAttribute("navpage");
                    let navpage = document.getElementById(navpage_value);
                    navpage.classList.toggle('show');
                }
            }
        }
        _this.init();
    }
}

function md5cycle(x, k) {
    var a = x[0], b = x[1], c = x[2], d = x[3];
    
    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17,  606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12,  1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7,  1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7,  1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22,  1236535329);
    
    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14,  643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9,  38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5,  568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20,  1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14,  1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);
    
    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16,  1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11,  1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4,  681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23,  76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16,  530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);
    
    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10,  1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6,  1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6,  1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21,  1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15,  718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);
    
    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);
    
}
    
function cmn(q, a, b, x, s, t) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
}

function ff(a, b, c, d, x, s, t) {
    return cmn((b & c) | ((~b) & d), a, b, x, s, t);
}

function gg(a, b, c, d, x, s, t) {
    return cmn((b & d) | (c & (~d)), a, b, x, s, t);
}

function hh(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
}

function ii(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | (~d)), a, b, x, s, t);
}

function md51(s) {
    txt = '';
    var n = s.length,
    state = [1732584193, -271733879, -1732584194, 271733878], i;
    for (i=64; i<=s.length; i+=64) {
    md5cycle(state, md5blk(String(s).substring(i-64, i)));
    }
    s = String(s).substring(i-64);
    var tail = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
    for (i=0; i<s.length; i++)
    tail[i>>2] |= s.charCodeAt(i) << ((i%4) << 3);
    tail[i>>2] |= 0x80 << ((i%4) << 3);
    if (i > 55) {
    md5cycle(state, tail);
    for (i=0; i<16; i++) tail[i] = 0;
    }
    tail[14] = n*8;
    md5cycle(state, tail);
    return state;
}

function md5blk(s) { /* I figured global was faster.   */
    var md5blks = [], i; /* Andy King said do it this way. */
    for (i=0; i<64; i+=4) {
    md5blks[i>>2] = s.charCodeAt(i)
    + (s.charCodeAt(i+1) << 8)
    + (s.charCodeAt(i+2) << 16)
    + (s.charCodeAt(i+3) << 24);
    }
    return md5blks;
}

var hex_chr = '0123456789abcdef'.split('');

function rhex(n){
    var s='', j=0;
    for(; j<4; j++)
    s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
    + hex_chr[(n >> (j * 8)) & 0x0F];
    return s;
}

function hex(x) {
    for (var i=0; i<x.length; i++)
    x[i] = rhex(x[i]);
    return x.join('');
}

function md5(s) {
    return hex(md51(s));
}

/* this function is much faster,
so if possible we use it. Some IEs
are the only ones I know of that
need the idiotic second function,
generated by an if clause.  */

function add32(a, b) {
    return (a + b) & 0xFFFFFFFF;
}

if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
    function add32(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF),
        msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
}

(function(factory) {
    if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
    } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
    } else {
    // Browser globals
    factory(jQuery);
    }
}(function($) {
    var $originalAjax = $.ajax.bind($);

    $.ajax = function (url, options) {
    if (typeof url === 'object') {
        options = url;
        url = undefined;
    }

    options = options || {
        chunking: false
    };

    // Get current xhr object
    var xmlHttpReq = options.xhr ? options.xhr() : $.ajaxSettings.xhr();
    var chunking = options.chunking || $.ajaxSettings.chunking;

    // Make it use our own.
    options.xhr = function () {
        if (typeof options.uploadProgress === 'function') {
        if (!xmlHttpReq.upload) {
            return;
        }

        // this line looks strange, but without it chrome doesn't catch `progress` event on uploading. Seems like chromium bug
        xmlHttpReq.upload.onprogress = null;

        // Upload progress listener
        xmlHttpReq.upload.addEventListener('progress', function (e) {
            options.uploadProgress.call(this, e);
        }, false);
        }

        if (typeof options.progress === 'function') {
        var lastChunkLen = 0;

        // Download progress listener
        xmlHttpReq.addEventListener('progress', function (e) {
            var params = [e],
            chunk = '';

            if (this.readyState === XMLHttpRequest.LOADING && chunking) {
            chunk = this.responseText.substr(lastChunkLen);
            lastChunkLen = this.responseText.length;
            params.push(chunk);
            }

            options.progress.apply(this, params);
        }, false);
        }

        return xmlHttpReq;
    };

    return $originalAjax(url, options);
    };
}));