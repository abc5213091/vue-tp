/*公共js文件 by lihui on 2016-06-11 13:47:26*/
var ENV={
        dev:'http://192.168.18.30/niiwoo-api/', //开发服
        devF:'http://192.168.10.34:8080/niiwoo-api/', //阿福
        devK:'http://192.168.10.99:8080/niiwoo-api/',  //薛玉科
        devJ:'http://192.168.10.50:8080/niiwoo-api/',  //冀超
        test:'https://test.niiwoo.com:5003/niiwoo-api/',//测试环境
        exp:'https://exp.niiwoo.com:4003/niiwoo-api/',  //体验环境
        tiyan:'https://tiyan.niiwoo.com:4003/niiwoo-api/',  //体验环境
        bbs:'https://app.niiwoo.com:5004/niiwoo-api/',  //线上环境
        www:'https://app.niiwoo.com:5004/niiwoo-api/'  //线上环境
    },
    AENV={
        test:'https://test.niiwoo.com:5016/activity-api/niwoportservice.svc/',
        exp:'http://exp.niiwoo.com:4009/activity-api/niwoportservice.svc/',
        bbs:'https://activity.niiwoo.com:5104/activity-api/niwoportservice.svc/',
        www:'https://activity.niiwoo.com:5104/activity-api/niwoportservice.svc/',
    },
    APPID = {
        test: 'wxb3d25457b5a6fe49',
        exp: 'wx9e8fdcf44113d422',
        bbs: 'wxb3614de5b694321c'
    },
    localURL = location.href.substring(0,location.href.indexOf('h5')+3),
    env = (function(){
        var host = location.hostname.substring(0,location.hostname.indexOf('.'));
        return isNaN(host)?host:'test';
    })(),
    DATA_KEY = 'INVEST', //项目key
    COMMON_DATA = 'COMMON_DATA,Pay_Data,PayData,userToken,userId', //公共key
    appid = APPID[env],
    API = ENV[env];
var _ ={
    // 接口地址
    routerUrl: API+'niwoportservice.svc/',

    jsjPath: {
        recharge: '/h5/project/pay/',   //充值目录配置
        myGift: '/h5/app/project/sign-in/index.html#/myGift?_k=p0fl2p'   //我的礼品
    },
    lljPath:{
        login: 'weixin/official-accounts/cash-emu/login.php',
    },
    loadingStack:[],
    /*
        获取微信认证地址
        @type 0：极速借 1：蓝领借
        @path 路由
    */
    getWXURL: function(path){
        path = path || 'login';
        var params = [
            'appid='+ appid,
            'redirect_uri='+ encodeURIComponent(localURL+path),
            'response_type=code',
            'scope=snsapi_base',
            'state=niiwoo#wechat_redirect'
        ];
        return 'https://open.weixin.qq.com/connect/oauth2/authorize?'+params.join('&');
    },
    // 从 userAgent 判断是否在你我金融 app 中
    isInNiiwooApp: function() {
        var ua = navigator.userAgent.toLowerCase();
        var mark = ua.indexOf('niiwoo');
        if (mark > 0) {
            return true;
        } else {
            return false;
        }
    },
    ua: navigator.userAgent,
    /*判断是否微信*/
    isWeChat: function() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    },
    //android终端或者uc浏览器
    isAndroid: function(){
        return _.ua.indexOf('Android') > -1 || this.ua.indexOf('Linux') > -1
    },
    //ios终端
    isIOS: function(){
        return !!_.ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    }, 
    // 获取你我金融app版本号
    getNiiwooAppVersion: function() {
        var ua = navigator.userAgent.toLowerCase();
        var v = ua.match(/niiwoo\/([\d.]+)/)[1];
        return v;
    },

    // 验证手机号码
    checkPhoneNum: function(num) {
        var re = /^(0|86|17951)?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/;
        if (!num) {
            return '请输入手机号码';
        } else if (num.length != 11) {
            return '手机号码格式错误';
        } else if (!re.test(num)) {
            return '手机号码格式错误';
        } else {
            return 1;
        }
    },

    // 验证密码是否合格
    checkPassword: function(pwd) {
        var re = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,16}$/;
        if (!pwd) {
            return '请输入密码';
        } else if (!re.test(pwd)) {
            return '密码应为6-16个字符，含字母和数字';
        } else {
            return 1;
        }
    },

    // 存储 sesstionStorage
    setSessionStorage: function(name, value) {
        sessionStorage.setItem(name, value);
    },

    // 获取 sesstionStorage
    getSessionStorage: function(name) {
        return sessionStorage.getItem(name);
    },

    // 存储 localStorage  update by lihui on 2017年2月27日
    setLocalStorage: function(name, value) {
        var data = localStorage.getItem(DATA_KEY) || '';
        data = data ? JSON.parse(data) : {};

        if( COMMON_DATA.indexOf(name) > -1){
            localStorage.setItem(name, value);
            return;
        }

        if( typeof name == 'string'){
            data[name] = value;
        }else if( typeof name == 'object'){
            for(var item in name){
                data[item] = name[item];
            }
        }  
        
        localStorage.setItem(DATA_KEY, JSON.stringify(data));
    },

    // 获取 localStorage
    getLocalStorage: function(name) {
        var data = localStorage.getItem(DATA_KEY) || '';

        if(COMMON_DATA.indexOf(name) > -1){
            return localStorage.getItem(name);
        }

        if(data){
            data = JSON.parse(data);
            return data[name] ? data[name] : '' ;
        }
        return '';
    },
    //清除 localstorage
    clearLocalStorage: function(){
        localStorage.setItem(DATA_KEY, '');
    },

    // 写入 cookie
    setCookie: function(name, value , day) {
        var Days = day || 360;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    },

    // 获取 cookie
    getCookie: function(name) {
        var arr,
            reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    },

    // 获取 url 中的参数值
    getRequest: function(key) {
        var url = location.href;
        var theRequest = {};
        if(url.indexOf("?") != -1){
            var str = url.substr(url.indexOf('?')+1);
            var strs = str.replace(/\?/g,'&').split("&");
            for(var i = 0,length = strs.length;i < length;i++){
                theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
            }
        }
        return key?theRequest[key]:theRequest;
    },
    // 参数合并
    extend:function(opt,args){
        for(var name in args){
            opt[name] = args[name];
        }
        return opt
    },
    // 重组参数
    assembly:function(opt){
        var  jsonString , signStr , sign , userToken = opt.params.userToken || _.getLocalStorage("userToken") || null,
        _default={
            url : _.routerUrl,
            method : '',
            version : '',
            params : {}
        };

        // 开启loading
        if(opt.loading === false){
            _.loading(false)
        }else{
            _.loading(true)
            _.loadingStack.push(1)
        }

        opt = _.extend(_default,opt);

        /*加入时间戳*/
        opt.params = _.extend(opt.params,{t : new Date().getTime()});

        /*update by lihui */
        if(opt.isAct){
            opt.url = AENV[env]
        }

        jsonString = JSON.stringify(opt.params);
        jsonString = aesEncrypt(jsonString, appKeySecret, appKeySecret);
        signStr = appKeySecret + 'appKey' + appKey + 'jsonString' + jsonString + (userToken?'userToken' + userToken : '') + 'v' + opt.version + appKeySecret;
        sign = CryptoJS.SHA1(signStr).toString().toUpperCase();

        opt.url += opt.method;
        opt.url += opt.url.indexOf('?')>-1?'&':'?'+'appKey=' + appKey + '&v=' + opt.version +'&sign=' + sign + (userToken?'&userToken=' + userToken :'');

        return {url:opt.url,data:{jsonString:jsonString}};
    },
    ajax: function(opt){
        /*是否需要加密*/
        if(!opt.noEncrypt){
            opt = _.assembly(opt);
        }

        $.ajax({
            url: opt.url ,
            type: opt.type || 'POST',
            dataType: opt.dataType || 'json',
            async:  opt.async=='undefined' ? true : opt.async,
            data: opt.data ,
            success: function(db) {
                db = _.formatData(db);
                opt.cb && opt.cb(db);
            }
        });
    },
    formatData:function(db){
        // 关闭loading
        _.loadingStack.pop();
        _.loading(false);

        if(!db) return {};
        if(typeof db =='string'){
            try{
                db = JSON.parse(db);
            }catch(e){
                console.log('数据格式有误，不能进行JSON转化！');
            }
        }
        return db;
    },
    loading:function(isok){
        var tmp=
                '<div class="loading" style=" position: fixed; top:0;right:0;bottom:0;left:0;width:100%;height:100; display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align: center;box-align: center;-webkit-align-items: center;align-items: center;-webkit-box-pack: center;box-pack: center;-webkit-justify-content: center;justify-content: center;-webkit-box-align: center;box-align: center;-webkit-align-items: center;align-items: center;z-index:9999">'+
                    '<div style="background: rgba(0,0,0,0.6); padding:15px; border-radius: 8px;color:#fff; font-size:initial"><img src="images/loading.svg"></div>'+
                '</div>';
        var box = document.querySelector('.loading');
        box || document.body.insertAdjacentHTML('beforeend',tmp);
        _[isok?'fadeIn':'fadeOut']('.loading')
    },
    /*
        提示框
        @param msg String 消息
        @param delay Number 毫秒
    */
    toast:function(msg,callback,delay){
        if(!msg) return
        var tmp=
                '<div class="toastBox" style="position: fixed; top:0;right:0;bottom:0;left:0;width:100%;height:100; display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align: center;box-align: center;-webkit-align-items: center;align-items: center;-webkit-box-pack: center;box-pack: center;-webkit-justify-content: center;justify-content: center;-webkit-box-align: center;box-align: center;-webkit-align-items: center;align-items: center;z-index:99999">'+
                    '<div style="width:80%;background: rgba(0,0,0,0.6); padding: 10px 15px; border-radius: 8px;color:#fff;font-size:.2rem">'+msg+'</div>'+
            '</div>';
        var box = document.querySelector('.toastBox div');
        box ? box.innerHTML = msg : document.body.insertAdjacentHTML('beforeend',tmp);
        
        _.fadeIn('.toastBox');
              
        setTimeout(function(){
             _.fadeOut('.toastBox',callback);
        }, delay || 2000)
    },
    fadeIn:function(el) {
        var el = document.querySelector(el)
      el.style.opacity = 0;

      var last = +new Date();
      var tick = function() {
        el.style.opacity = +el.style.opacity + (new Date() - last) / 400;
        last = +new Date();
        if (+el.style.opacity < 1) {
          (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
        }
      };
      tick();
    }, 
    fadeOut:function(el,cb) {
        var el = document.querySelector(el)
          el.style.opacity = 1;

          var last = +new Date();
          var tick = function() {
            el.style.opacity = +el.style.opacity - (new Date() - last) / 400;
            last = +new Date();
            if (+el.style.opacity > 0) {
              (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
            }else{
                cb && cb();
                el && el.parentNode.removeChild(el);
            }
          };
      tick();
    },     
    CursorMoveEnd:function(obj){ //光标移动到最后
        var Obj = document.getElementById(obj);
        Obj.focus(); 
        var len = Obj.value.length; 
        if (document.selection) { 
            var sel = Obj.createTextRange(); 
            sel.moveStart('character',len); 
            sel.collapse(); 
            sel.select(); 
        } else if (typeof Obj.selectionStart == 'number' && typeof Obj.selectionEnd == 'number') { 
            Obj.selectionStart = Obj.selectionEnd = len; 
        } 
    },
    Encode: function (str) {  /*字符转换*/
        var s = "";
        if(typeof str != 'string') return str;
        if (str.length == 0) return "";
        s = str.replace(/&/g, "&amp;");
        s = s.replace(/</g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        s = s.replace(/ /g, "&nbsp;");
        s = s.replace(/\'/g, "&#39;");
        s = s.replace(/\"/g, "&quot;");
        s = s.replace(/\n/g, "<br>");
        return s;
    },
    Decode: function (str) {  /*字符转换*/
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&amp;/g, "&");
        s = s.replace(/&lt;/g, "<");
        s = s.replace(/&gt;/g, ">");
        s = s.replace(/&nbsp;/g, " ");
        s = s.replace(/&#39;/g, "\'");
        s = s.replace(/&quot;/g, "\"");
        s = s.replace(/<br>/g, "\n");
        return s;
    },

}


// 加密相关
var appKey = "00002";
var appKeySecret = "A0B5C2D4E7F90301";
var aesEncrypt = function(data, keyStr, ivStr) {
    var sendData = CryptoJS.enc.Utf8.parse(data);
    var key = CryptoJS.enc.Utf8.parse(keyStr);
    var iv = CryptoJS.enc.Utf8.parse(ivStr);
    var encrypted = CryptoJS.AES.encrypt(sendData, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}


// 与 app 交互的 JsBridge
function cMwebViewJsBridge(callback) {
    var u = navigator.userAgent,
        app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    if (isAndroid) { //android 
        callback && callback(window.WebViewJavascriptBridge, isAndroid);
    } else { // ios
        if (window.WebViewJavascriptBridge) {
            //主动调用执行这里
            callback && callback(WebViewJavascriptBridge, isAndroid);
        } else {
            //初始化执行这里
            document.addEventListener('WebViewJavascriptBridgeReady', function() {
                callback && callback(WebViewJavascriptBridge, isAndroid);
            }, false);
        };
    };
}

function cMwebViewJsBridgeInit(){
    if(_.isIOS()){
        cMwebViewJsBridge(function(bridge) {  
            bridge.init(function(message, responseCallback) {
                var data = { 'Javascript Responds':'Wee!' }
                responseCallback(data)
            })
        })  
    }
}

/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS = CryptoJS || function(e, m) {
    var p = {},
        j = p.lib = {},
        l = function() {},
        f = j.Base = {
            extend: function(a) {
                l.prototype = this;
                var c = new l;
                a && c.mixIn(a);
                c.hasOwnProperty("init") || (c.init = function() { c.$super.init.apply(this, arguments) });
                c.init.prototype = c;
                c.$super = this;
                return c
            },
            create: function() {
                var a = this.extend();
                a.init.apply(a, arguments);
                return a
            },
            init: function() {},
            mixIn: function(a) {
                for (var c in a) a.hasOwnProperty(c) && (this[c] = a[c]);
                a.hasOwnProperty("toString") && (this.toString = a.toString)
            },
            clone: function() {
                return this.init.prototype.extend(this)
            }
        },
        n = j.WordArray = f.extend({
            init: function(a, c) {
                a = this.words = a || [];
                this.sigBytes = c != m ? c : 4 * a.length
            },
            toString: function(a) {
                return (a || h).stringify(this)
            },
            concat: function(a) {
                var c = this.words,
                    q = a.words,
                    d = this.sigBytes;
                a = a.sigBytes;
                this.clamp();
                if (d % 4)
                    for (var b = 0; b < a; b++) c[d + b >>> 2] |= (q[b >>> 2] >>> 24 - 8 * (b % 4) & 255) << 24 - 8 * ((d + b) % 4);
                else if (65535 < q.length)
                    for (b = 0; b < a; b += 4) c[d + b >>> 2] = q[b >>> 2];
                else c.push.apply(c, q);
                this.sigBytes += a;
                return this
            },
            clamp: function() {
                var a = this.words,
                    c = this.sigBytes;
                a[c >>> 2] &= 4294967295 <<
                    32 - 8 * (c % 4);
                a.length = e.ceil(c / 4)
            },
            clone: function() {
                var a = f.clone.call(this);
                a.words = this.words.slice(0);
                return a
            },
            random: function(a) {
                for (var c = [], b = 0; b < a; b += 4) c.push(4294967296 * e.random() | 0);
                return new n.init(c, a)
            }
        }),
        b = p.enc = {},
        h = b.Hex = {
            stringify: function(a) {
                var c = a.words;
                a = a.sigBytes;
                for (var b = [], d = 0; d < a; d++) {
                    var f = c[d >>> 2] >>> 24 - 8 * (d % 4) & 255;
                    b.push((f >>> 4).toString(16));
                    b.push((f & 15).toString(16))
                }
                return b.join("")
            },
            parse: function(a) {
                for (var c = a.length, b = [], d = 0; d < c; d += 2) b[d >>> 3] |= parseInt(a.substr(d,
                    2), 16) << 24 - 4 * (d % 8);
                return new n.init(b, c / 2)
            }
        },
        g = b.Latin1 = {
            stringify: function(a) {
                var c = a.words;
                a = a.sigBytes;
                for (var b = [], d = 0; d < a; d++) b.push(String.fromCharCode(c[d >>> 2] >>> 24 - 8 * (d % 4) & 255));
                return b.join("")
            },
            parse: function(a) {
                for (var c = a.length, b = [], d = 0; d < c; d++) b[d >>> 2] |= (a.charCodeAt(d) & 255) << 24 - 8 * (d % 4);
                return new n.init(b, c)
            }
        },
        r = b.Utf8 = {
            stringify: function(a) {
                try {
                    return decodeURIComponent(escape(g.stringify(a)))
                } catch (c) {
                    throw Error("Malformed UTF-8 data");
                }
            },
            parse: function(a) {
                return g.parse(unescape(encodeURIComponent(a)))
            }
        },
        k = j.BufferedBlockAlgorithm = f.extend({
            reset: function() {
                this._data = new n.init;
                this._nDataBytes = 0
            },
            _append: function(a) {
                "string" == typeof a && (a = r.parse(a));
                this._data.concat(a);
                this._nDataBytes += a.sigBytes
            },
            _process: function(a) {
                var c = this._data,
                    b = c.words,
                    d = c.sigBytes,
                    f = this.blockSize,
                    h = d / (4 * f),
                    h = a ? e.ceil(h) : e.max((h | 0) - this._minBufferSize, 0);
                a = h * f;
                d = e.min(4 * a, d);
                if (a) {
                    for (var g = 0; g < a; g += f) this._doProcessBlock(b, g);
                    g = b.splice(0, a);
                    c.sigBytes -= d
                }
                return new n.init(g, d)
            },
            clone: function() {
                var a = f.clone.call(this);
                a._data = this._data.clone();
                return a
            },
            _minBufferSize: 0
        });
    j.Hasher = k.extend({
        cfg: f.extend(),
        init: function(a) {
            this.cfg = this.cfg.extend(a);
            this.reset()
        },
        reset: function() {
            k.reset.call(this);
            this._doReset()
        },
        update: function(a) {
            this._append(a);
            this._process();
            return this
        },
        finalize: function(a) {
            a && this._append(a);
            return this._doFinalize()
        },
        blockSize: 16,
        _createHelper: function(a) {
            return function(c, b) {
                return (new a.init(b)).finalize(c)
            }
        },
        _createHmacHelper: function(a) {
            return function(b, f) {
                return (new s.HMAC.init(a,
                    f)).finalize(b)
            }
        }
    });
    var s = p.algo = {};
    return p
}(Math);
(function() {
    var e = CryptoJS,
        m = e.lib,
        p = m.WordArray,
        j = m.Hasher,
        l = [],
        m = e.algo.SHA1 = j.extend({
            _doReset: function() { this._hash = new p.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520]) },
            _doProcessBlock: function(f, n) {
                for (var b = this._hash.words, h = b[0], g = b[1], e = b[2], k = b[3], j = b[4], a = 0; 80 > a; a++) {
                    if (16 > a) l[a] = f[n + a] | 0;
                    else {
                        var c = l[a - 3] ^ l[a - 8] ^ l[a - 14] ^ l[a - 16];
                        l[a] = c << 1 | c >>> 31
                    }
                    c = (h << 5 | h >>> 27) + j + l[a];
                    c = 20 > a ? c + ((g & e | ~g & k) + 1518500249) : 40 > a ? c + ((g ^ e ^ k) + 1859775393) : 60 > a ? c + ((g & e | g & k | e & k) - 1894007588) : c + ((g ^ e ^
                        k) - 899497514);
                    j = k;
                    k = e;
                    e = g << 30 | g >>> 2;
                    g = h;
                    h = c
                }
                b[0] = b[0] + h | 0;
                b[1] = b[1] + g | 0;
                b[2] = b[2] + e | 0;
                b[3] = b[3] + k | 0;
                b[4] = b[4] + j | 0
            },
            _doFinalize: function() {
                var f = this._data,
                    e = f.words,
                    b = 8 * this._nDataBytes,
                    h = 8 * f.sigBytes;
                e[h >>> 5] |= 128 << 24 - h % 32;
                e[(h + 64 >>> 9 << 4) + 14] = Math.floor(b / 4294967296);
                e[(h + 64 >>> 9 << 4) + 15] = b;
                f.sigBytes = 4 * e.length;
                this._process();
                return this._hash
            },
            clone: function() {
                var e = j.clone.call(this);
                e._hash = this._hash.clone();
                return e
            }
        });
    e.SHA1 = j._createHelper(m);
    e.HmacSHA1 = j._createHmacHelper(m)
})();

/*
CryptoJS v3.0.2
code.google.com/p/crypto-js
(c) 2009-2012 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS = CryptoJS || function(p, h) {
    var i = {},
        l = i.lib = {},
        r = l.Base = function() {
            function a() {}
            return {
                extend: function(e) {
                    a.prototype = this;
                    var c = new a;
                    e && c.mixIn(e);
                    c.$super = this;
                    return c
                },
                create: function() {
                    var a = this.extend();
                    a.init.apply(a, arguments);
                    return a
                },
                init: function() {},
                mixIn: function(a) {
                    for (var c in a) a.hasOwnProperty(c) && (this[c] = a[c]);
                    a.hasOwnProperty("toString") && (this.toString = a.toString)
                },
                clone: function() {
                    return this.$super.extend(this)
                }
            }
        }(),
        o = l.WordArray = r.extend({
            init: function(a, e) {
                a =
                    this.words = a || [];
                this.sigBytes = e != h ? e : 4 * a.length
            },
            toString: function(a) {
                return (a || s).stringify(this)
            },
            concat: function(a) {
                var e = this.words,
                    c = a.words,
                    b = this.sigBytes,
                    a = a.sigBytes;
                this.clamp();
                if (b % 4)
                    for (var d = 0; d < a; d++) e[b + d >>> 2] |= (c[d >>> 2] >>> 24 - 8 * (d % 4) & 255) << 24 - 8 * ((b + d) % 4);
                else if (65535 < c.length)
                    for (d = 0; d < a; d += 4) e[b + d >>> 2] = c[d >>> 2];
                else e.push.apply(e, c);
                this.sigBytes += a;
                return this
            },
            clamp: function() {
                var a = this.words,
                    e = this.sigBytes;
                a[e >>> 2] &= 4294967295 << 32 - 8 * (e % 4);
                a.length = p.ceil(e / 4)
            },
            clone: function() {
                var a =
                    r.clone.call(this);
                a.words = this.words.slice(0);
                return a
            },
            random: function(a) {
                for (var e = [], c = 0; c < a; c += 4) e.push(4294967296 * p.random() | 0);
                return o.create(e, a)
            }
        }),
        m = i.enc = {},
        s = m.Hex = {
            stringify: function(a) {
                for (var e = a.words, a = a.sigBytes, c = [], b = 0; b < a; b++) {
                    var d = e[b >>> 2] >>> 24 - 8 * (b % 4) & 255;
                    c.push((d >>> 4).toString(16));
                    c.push((d & 15).toString(16))
                }
                return c.join("")
            },
            parse: function(a) {
                for (var e = a.length, c = [], b = 0; b < e; b += 2) c[b >>> 3] |= parseInt(a.substr(b, 2), 16) << 24 - 4 * (b % 8);
                return o.create(c, e / 2)
            }
        },
        n = m.Latin1 = {
            stringify: function(a) {
                for (var e =
                        a.words, a = a.sigBytes, c = [], b = 0; b < a; b++) c.push(String.fromCharCode(e[b >>> 2] >>> 24 - 8 * (b % 4) & 255));
                return c.join("")
            },
            parse: function(a) {
                for (var e = a.length, c = [], b = 0; b < e; b++) c[b >>> 2] |= (a.charCodeAt(b) & 255) << 24 - 8 * (b % 4);
                return o.create(c, e)
            }
        },
        k = m.Utf8 = {
            stringify: function(a) {
                try {
                    return decodeURIComponent(escape(n.stringify(a)))
                } catch (e) {
                    throw Error("Malformed UTF-8 data");
                }
            },
            parse: function(a) {
                return n.parse(unescape(encodeURIComponent(a)))
            }
        },
        f = l.BufferedBlockAlgorithm = r.extend({
            reset: function() {
                this._data = o.create();
                this._nDataBytes = 0
            },
            _append: function(a) {
                "string" == typeof a && (a = k.parse(a));
                this._data.concat(a);
                this._nDataBytes += a.sigBytes
            },
            _process: function(a) {
                var e = this._data,
                    c = e.words,
                    b = e.sigBytes,
                    d = this.blockSize,
                    q = b / (4 * d),
                    q = a ? p.ceil(q) : p.max((q | 0) - this._minBufferSize, 0),
                    a = q * d,
                    b = p.min(4 * a, b);
                if (a) {
                    for (var j = 0; j < a; j += d) this._doProcessBlock(c, j);
                    j = c.splice(0, a);
                    e.sigBytes -= b
                }
                return o.create(j, b)
            },
            clone: function() {
                var a = r.clone.call(this);
                a._data = this._data.clone();
                return a
            },
            _minBufferSize: 0
        });
    l.Hasher = f.extend({
        init: function() { this.reset() },
        reset: function() {
            f.reset.call(this);
            this._doReset()
        },
        update: function(a) {
            this._append(a);
            this._process();
            return this
        },
        finalize: function(a) {
            a && this._append(a);
            this._doFinalize();
            return this._hash
        },
        clone: function() {
            var a = f.clone.call(this);
            a._hash = this._hash.clone();
            return a
        },
        blockSize: 16,
        _createHelper: function(a) {
            return function(e, c) {
                return a.create(c).finalize(e)
            }
        },
        _createHmacHelper: function(a) {
            return function(e, c) {
                return g.HMAC.create(a, c).finalize(e)
            }
        }
    });
    var g = i.algo = {};
    return i
}(Math);
(function() {
    var p = CryptoJS,
        h = p.lib.WordArray;
    p.enc.Base64 = {
        stringify: function(i) {
            var l = i.words,
                h = i.sigBytes,
                o = this._map;
            i.clamp();
            for (var i = [], m = 0; m < h; m += 3)
                for (var s = (l[m >>> 2] >>> 24 - 8 * (m % 4) & 255) << 16 | (l[m + 1 >>> 2] >>> 24 - 8 * ((m + 1) % 4) & 255) << 8 | l[m + 2 >>> 2] >>> 24 - 8 * ((m + 2) % 4) & 255, n = 0; 4 > n && m + 0.75 * n < h; n++) i.push(o.charAt(s >>> 6 * (3 - n) & 63));
            if (l = o.charAt(64))
                for (; i.length % 4;) i.push(l);
            return i.join("")
        },
        parse: function(i) {
            var i = i.replace(/\s/g, ""),
                l = i.length,
                r = this._map,
                o = r.charAt(64);
            o && (o = i.indexOf(o), -1 != o && (l = o));
            for (var o = [], m = 0, s = 0; s < l; s++)
                if (s % 4) {
                    var n = r.indexOf(i.charAt(s - 1)) << 2 * (s % 4),
                        k = r.indexOf(i.charAt(s)) >>> 6 - 2 * (s % 4);
                    o[m >>> 2] |= (n | k) << 24 - 8 * (m % 4);
                    m++
                }
            return h.create(o, m)
        },
        _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
    }
})();
(function(p) {
    function h(f, g, a, e, c, b, d) {
        f = f + (g & a | ~g & e) + c + d;
        return (f << b | f >>> 32 - b) + g
    }

    function i(f, g, a, e, c, b, d) {
        f = f + (g & e | a & ~e) + c + d;
        return (f << b | f >>> 32 - b) + g
    }

    function l(f, g, a, e, c, b, d) {
        f = f + (g ^ a ^ e) + c + d;
        return (f << b | f >>> 32 - b) + g
    }

    function r(f, g, a, e, c, b, d) {
        f = f + (a ^ (g | ~e)) + c + d;
        return (f << b | f >>> 32 - b) + g
    }
    var o = CryptoJS,
        m = o.lib,
        s = m.WordArray,
        m = m.Hasher,
        n = o.algo,
        k = [];
    (function() {
        for (var f = 0; 64 > f; f++) k[f] = 4294967296 * p.abs(p.sin(f + 1)) | 0
    })();
    n = n.MD5 = m.extend({
        _doReset: function() {
            this._hash = s.create([1732584193, 4023233417,
                2562383102, 271733878
            ])
        },
        _doProcessBlock: function(f, g) {
            for (var a = 0; 16 > a; a++) {
                var e = g + a,
                    c = f[e];
                f[e] = (c << 8 | c >>> 24) & 16711935 | (c << 24 | c >>> 8) & 4278255360
            }
            for (var e = this._hash.words, c = e[0], b = e[1], d = e[2], q = e[3], a = 0; 64 > a; a += 4) 16 > a ? (c = h(c, b, d, q, f[g + a], 7, k[a]), q = h(q, c, b, d, f[g + a + 1], 12, k[a + 1]), d = h(d, q, c, b, f[g + a + 2], 17, k[a + 2]), b = h(b, d, q, c, f[g + a + 3], 22, k[a + 3])) : 32 > a ? (c = i(c, b, d, q, f[g + (a + 1) % 16], 5, k[a]), q = i(q, c, b, d, f[g + (a + 6) % 16], 9, k[a + 1]), d = i(d, q, c, b, f[g + (a + 11) % 16], 14, k[a + 2]), b = i(b, d, q, c, f[g + a % 16], 20, k[a + 3])) : 48 > a ? (c =
                l(c, b, d, q, f[g + (3 * a + 5) % 16], 4, k[a]), q = l(q, c, b, d, f[g + (3 * a + 8) % 16], 11, k[a + 1]), d = l(d, q, c, b, f[g + (3 * a + 11) % 16], 16, k[a + 2]), b = l(b, d, q, c, f[g + (3 * a + 14) % 16], 23, k[a + 3])) : (c = r(c, b, d, q, f[g + 3 * a % 16], 6, k[a]), q = r(q, c, b, d, f[g + (3 * a + 7) % 16], 10, k[a + 1]), d = r(d, q, c, b, f[g + (3 * a + 14) % 16], 15, k[a + 2]), b = r(b, d, q, c, f[g + (3 * a + 5) % 16], 21, k[a + 3]));
            e[0] = e[0] + c | 0;
            e[1] = e[1] + b | 0;
            e[2] = e[2] + d | 0;
            e[3] = e[3] + q | 0
        },
        _doFinalize: function() {
            var f = this._data,
                g = f.words,
                a = 8 * this._nDataBytes,
                e = 8 * f.sigBytes;
            g[e >>> 5] |= 128 << 24 - e % 32;
            g[(e + 64 >>> 9 << 4) + 14] = (a << 8 | a >>>
                24) & 16711935 | (a << 24 | a >>> 8) & 4278255360;
            f.sigBytes = 4 * (g.length + 1);
            this._process();
            f = this._hash.words;
            for (g = 0; 4 > g; g++) a = f[g], f[g] = (a << 8 | a >>> 24) & 16711935 | (a << 24 | a >>> 8) & 4278255360
        }
    });
    o.MD5 = m._createHelper(n);
    o.HmacMD5 = m._createHmacHelper(n)
})(Math);
(function() {
    var p = CryptoJS,
        h = p.lib,
        i = h.Base,
        l = h.WordArray,
        h = p.algo,
        r = h.EvpKDF = i.extend({
            cfg: i.extend({ keySize: 4, hasher: h.MD5, iterations: 1 }),
            init: function(i) { this.cfg = this.cfg.extend(i) },
            compute: function(i, m) {
                for (var h = this.cfg, n = h.hasher.create(), k = l.create(), f = k.words, g = h.keySize, h = h.iterations; f.length < g;) {
                    a && n.update(a);
                    var a = n.update(i).finalize(m);
                    n.reset();
                    for (var e = 1; e < h; e++) a = n.finalize(a), n.reset();
                    k.concat(a)
                }
                k.sigBytes = 4 * g;
                return k
            }
        });
    p.EvpKDF = function(i, l, h) {
        return r.create(h).compute(i,
            l)
    }
})();
CryptoJS.lib.Cipher || function(p) {
    var h = CryptoJS,
        i = h.lib,
        l = i.Base,
        r = i.WordArray,
        o = i.BufferedBlockAlgorithm,
        m = h.enc.Base64,
        s = h.algo.EvpKDF,
        n = i.Cipher = o.extend({
            cfg: l.extend(),
            createEncryptor: function(b, d) {
                return this.create(this._ENC_XFORM_MODE, b, d)
            },
            createDecryptor: function(b, d) {
                return this.create(this._DEC_XFORM_MODE, b, d)
            },
            init: function(b, d, a) {
                this.cfg = this.cfg.extend(a);
                this._xformMode = b;
                this._key = d;
                this.reset()
            },
            reset: function() {
                o.reset.call(this);
                this._doReset()
            },
            process: function(b) {
                this._append(b);
                return this._process()
            },
            finalize: function(b) {
                b && this._append(b);
                return this._doFinalize()
            },
            keySize: 4,
            ivSize: 4,
            _ENC_XFORM_MODE: 1,
            _DEC_XFORM_MODE: 2,
            _createHelper: function() {
                return function(b) {
                    return {
                        encrypt: function(a, q, j) {
                            return ("string" == typeof q ? c : e).encrypt(b, a, q, j)
                        },
                        decrypt: function(a, q, j) {
                            return ("string" == typeof q ? c : e).decrypt(b, a, q, j)
                        }
                    }
                }
            }()
        });
    i.StreamCipher = n.extend({
        _doFinalize: function() {
            return this._process(!0)
        },
        blockSize: 1
    });
    var k = h.mode = {},
        f = i.BlockCipherMode = l.extend({
            createEncryptor: function(b, a) {
                return this.Encryptor.create(b,
                    a)
            },
            createDecryptor: function(b, a) {
                return this.Decryptor.create(b, a)
            },
            init: function(b, a) {
                this._cipher = b;
                this._iv = a
            }
        }),
        k = k.CBC = function() {
            function b(b, a, d) {
                var c = this._iv;
                c ? this._iv = p : c = this._prevBlock;
                for (var e = 0; e < d; e++) b[a + e] ^= c[e]
            }
            var a = f.extend();
            a.Encryptor = a.extend({
                processBlock: function(a, d) {
                    var c = this._cipher,
                        e = c.blockSize;
                    b.call(this, a, d, e);
                    c.encryptBlock(a, d);
                    this._prevBlock = a.slice(d, d + e)
                }
            });
            a.Decryptor = a.extend({
                processBlock: function(a, d) {
                    var c = this._cipher,
                        e = c.blockSize,
                        f = a.slice(d, d +
                            e);
                    c.decryptBlock(a, d);
                    b.call(this, a, d, e);
                    this._prevBlock = f
                }
            });
            return a
        }(),
        g = (h.pad = {}).Pkcs7 = {
            pad: function(b, a) {
                for (var c = 4 * a, c = c - b.sigBytes % c, e = c << 24 | c << 16 | c << 8 | c, f = [], g = 0; g < c; g += 4) f.push(e);
                c = r.create(f, c);
                b.concat(c)
            },
            unpad: function(b) { b.sigBytes -= b.words[b.sigBytes - 1 >>> 2] & 255 }
        };
    i.BlockCipher = n.extend({
        cfg: n.cfg.extend({ mode: k, padding: g }),
        reset: function() {
            n.reset.call(this);
            var b = this.cfg,
                a = b.iv,
                b = b.mode;
            if (this._xformMode == this._ENC_XFORM_MODE) var c = b.createEncryptor;
            else c = b.createDecryptor,
                this._minBufferSize = 1;
            this._mode = c.call(b, this, a && a.words)
        },
        _doProcessBlock: function(b, a) { this._mode.processBlock(b, a) },
        _doFinalize: function() {
            var b = this.cfg.padding;
            if (this._xformMode == this._ENC_XFORM_MODE) {
                b.pad(this._data, this.blockSize);
                var a = this._process(!0)
            } else a = this._process(!0), b.unpad(a);
            return a
        },
        blockSize: 4
    });
    var a = i.CipherParams = l.extend({
            init: function(a) { this.mixIn(a) },
            toString: function(a) {
                return (a || this.formatter).stringify(this)
            }
        }),
        k = (h.format = {}).OpenSSL = {
            stringify: function(a) {
                var d =
                    a.ciphertext,
                    a = a.salt,
                    d = (a ? r.create([1398893684, 1701076831]).concat(a).concat(d) : d).toString(m);
                return d = d.replace(/(.{64})/g, "$1\n")
            },
            parse: function(b) {
                var b = m.parse(b),
                    d = b.words;
                if (1398893684 == d[0] && 1701076831 == d[1]) {
                    var c = r.create(d.slice(2, 4));
                    d.splice(0, 4);
                    b.sigBytes -= 16
                }
                return a.create({ ciphertext: b, salt: c })
            }
        },
        e = i.SerializableCipher = l.extend({
            cfg: l.extend({ format: k }),
            encrypt: function(b, d, c, e) {
                var e = this.cfg.extend(e),
                    f = b.createEncryptor(c, e),
                    d = f.finalize(d),
                    f = f.cfg;
                return a.create({
                    ciphertext: d,
                    key: c,
                    iv: f.iv,
                    algorithm: b,
                    mode: f.mode,
                    padding: f.padding,
                    blockSize: b.blockSize,
                    formatter: e.format
                })
            },
            decrypt: function(a, c, e, f) {
                f = this.cfg.extend(f);
                c = this._parse(c, f.format);
                return a.createDecryptor(e, f).finalize(c.ciphertext)
            },
            _parse: function(a, c) {
                return "string" == typeof a ? c.parse(a) : a
            }
        }),
        h = (h.kdf = {}).OpenSSL = {
            compute: function(b, c, e, f) {
                f || (f = r.random(8));
                b = s.create({ keySize: c + e }).compute(b, f);
                e = r.create(b.words.slice(c), 4 * e);
                b.sigBytes = 4 * c;
                return a.create({ key: b, iv: e, salt: f })
            }
        },
        c = i.PasswordBasedCipher =
        e.extend({
            cfg: e.cfg.extend({ kdf: h }),
            encrypt: function(a, c, f, j) {
                j = this.cfg.extend(j);
                f = j.kdf.compute(f, a.keySize, a.ivSize);
                j.iv = f.iv;
                a = e.encrypt.call(this, a, c, f.key, j);
                a.mixIn(f);
                return a
            },
            decrypt: function(a, c, f, j) {
                j = this.cfg.extend(j);
                c = this._parse(c, j.format);
                f = j.kdf.compute(f, a.keySize, a.ivSize, c.salt);
                j.iv = f.iv;
                return e.decrypt.call(this, a, c, f.key, j)
            }
        })
}();
(function() {
    var p = CryptoJS,
        h = p.lib.BlockCipher,
        i = p.algo,
        l = [],
        r = [],
        o = [],
        m = [],
        s = [],
        n = [],
        k = [],
        f = [],
        g = [],
        a = [];
    (function() {
        for (var c = [], b = 0; 256 > b; b++) c[b] = 128 > b ? b << 1 : b << 1 ^ 283;
        for (var d = 0, e = 0, b = 0; 256 > b; b++) {
            var j = e ^ e << 1 ^ e << 2 ^ e << 3 ^ e << 4,
                j = j >>> 8 ^ j & 255 ^ 99;
            l[d] = j;
            r[j] = d;
            var i = c[d],
                h = c[i],
                p = c[h],
                t = 257 * c[j] ^ 16843008 * j;
            o[d] = t << 24 | t >>> 8;
            m[d] = t << 16 | t >>> 16;
            s[d] = t << 8 | t >>> 24;
            n[d] = t;
            t = 16843009 * p ^ 65537 * h ^ 257 * i ^ 16843008 * d;
            k[j] = t << 24 | t >>> 8;
            f[j] = t << 16 | t >>> 16;
            g[j] = t << 8 | t >>> 24;
            a[j] = t;
            d ? (d = i ^ c[c[c[p ^ i]]], e ^= c[c[e]]) : d = e = 1
        }
    })();
    var e = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54],
        i = i.AES = h.extend({
            _doReset: function() {
                for (var c = this._key, b = c.words, d = c.sigBytes / 4, c = 4 * ((this._nRounds = d + 6) + 1), i = this._keySchedule = [], j = 0; j < c; j++)
                    if (j < d) i[j] = b[j];
                    else {
                        var h = i[j - 1];
                        j % d ? 6 < d && 4 == j % d && (h = l[h >>> 24] << 24 | l[h >>> 16 & 255] << 16 | l[h >>> 8 & 255] << 8 | l[h & 255]) : (h = h << 8 | h >>> 24, h = l[h >>> 24] << 24 | l[h >>> 16 & 255] << 16 | l[h >>> 8 & 255] << 8 | l[h & 255], h ^= e[j / d | 0] << 24);
                        i[j] = i[j - d] ^ h
                    }
                b = this._invKeySchedule = [];
                for (d = 0; d < c; d++) j = c - d, h = d % 4 ? i[j] : i[j - 4], b[d] = 4 > d || 4 >= j ? h : k[l[h >>> 24]] ^ f[l[h >>>
                    16 & 255]] ^ g[l[h >>> 8 & 255]] ^ a[l[h & 255]]
            },
            encryptBlock: function(a, b) { this._doCryptBlock(a, b, this._keySchedule, o, m, s, n, l) },
            decryptBlock: function(c, b) {
                var d = c[b + 1];
                c[b + 1] = c[b + 3];
                c[b + 3] = d;
                this._doCryptBlock(c, b, this._invKeySchedule, k, f, g, a, r);
                d = c[b + 1];
                c[b + 1] = c[b + 3];
                c[b + 3] = d
            },
            _doCryptBlock: function(a, b, d, e, f, h, i, g) {
                for (var l = this._nRounds, k = a[b] ^ d[0], m = a[b + 1] ^ d[1], o = a[b + 2] ^ d[2], n = a[b + 3] ^ d[3], p = 4, r = 1; r < l; r++) var s = e[k >>> 24] ^ f[m >>> 16 & 255] ^ h[o >>> 8 & 255] ^ i[n & 255] ^ d[p++],
                    u = e[m >>> 24] ^ f[o >>> 16 & 255] ^ h[n >>> 8 & 255] ^
                    i[k & 255] ^ d[p++],
                    v = e[o >>> 24] ^ f[n >>> 16 & 255] ^ h[k >>> 8 & 255] ^ i[m & 255] ^ d[p++],
                    n = e[n >>> 24] ^ f[k >>> 16 & 255] ^ h[m >>> 8 & 255] ^ i[o & 255] ^ d[p++],
                    k = s,
                    m = u,
                    o = v;
                s = (g[k >>> 24] << 24 | g[m >>> 16 & 255] << 16 | g[o >>> 8 & 255] << 8 | g[n & 255]) ^ d[p++];
                u = (g[m >>> 24] << 24 | g[o >>> 16 & 255] << 16 | g[n >>> 8 & 255] << 8 | g[k & 255]) ^ d[p++];
                v = (g[o >>> 24] << 24 | g[n >>> 16 & 255] << 16 | g[k >>> 8 & 255] << 8 | g[m & 255]) ^ d[p++];
                n = (g[n >>> 24] << 24 | g[k >>> 16 & 255] << 16 | g[m >>> 8 & 255] << 8 | g[o & 255]) ^ d[p++];
                a[b] = s;
                a[b + 1] = u;
                a[b + 2] = v;
                a[b + 3] = n
            },
            keySize: 8
        });
    p.AES = h._createHelper(i)
})();

/********************************原生JS扩展****************************************/
/*toRetain方法，不进行四舍五入保留小数点后几位*/
Number.prototype.toRetain = function(n){
    if(this == 0) return this;
    var inx = this.toString().indexOf('.');
    n = n || 0;
    if(inx > -1){
        return this.toString().substring(0,inx+n+1);
    }else{
        return this.toString()
    }
}

