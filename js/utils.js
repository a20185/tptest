var _b64c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
var _fcc = String.fromCharCode;
var _ca = 'charAt';
var _cca = 'charCodeAt';

function _b64e(s) {
    var l = s.length;
    var i = 0, o = '';
    var c1, c2, c3;
    while (i < l) {
        c1 = (s[_cca])(i++)&0xff;
        if (i === l) {
            o += (_b64c[_ca])(c1>>2);
            o += (_b64c[_ca])((c1&0x3) << 4);
            o += "==";
            break;
        }
        c2 = (s[_cca])(i++);
        if (i === l) {
            o += (_b64c[_ca])(c1>>2);
            o += (_b64c[_ca])(((c1&0x3) << 4)|((c2&0xF0)>>4));
            o += (_b64c[_ca])((c2&0xF) << 2);
            o += "=";
            break;
        }
        c3 = (s[_cca])(i++);
        o += (_b64c[_ca])(c1>>2);
        o += (_b64c[_ca])(((c1&0x3) << 4)|((c2&0xF0)>>4));
        o += (_b64c[_ca])(((c2&0xF) << 2)|((c3&0xC0)>>6));
        o += (_b64c[_ca])(c3&0x3F);
    }
    return o;
};

function _s64(_bs) {
    _bs = _bs.replace(/\+/g, "-");
    _bs = _bs.replace(/\//g, "_");
    return _bs;
};

function _u168(s) {
    var c, o = '', l = s.length;
    for (var i = 0; i < l; i++) {
        c = (s[_cca])(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            o += (s[_ca])(i);
        } else if (c>0x07FF) {
            o += _fcc(0xE0|((c>>12)&0x0F));
            o += _fcc(0x80|((c>>6)&0x3F));
            o += _fcc(0x80|((c>>0)&0x3F));
        } else {
            o += _fcc(0xC0|((c>>6)&0x1F));
            o += _fcc(0x80|((c>>0)&0x3F));
        }
    }
    return o;
}

function _gentk(_ak, _sk, policy) {
    var pplcy = JSON.stringify(policy);
    var eccPolicy = _b64e(_u168(pplcy));
    var hash = CryptoJS.HmacSHA1(eccPolicy, _sk);
    var encodedSigned = hash.toString(CryptoJS.enc.Base64);
    var tk = _ak + ":" + _s64(encodedSigned) + ":" + eccPolicy;
    return tk;
}

function _gutk(c) {
    var policy = {
      scope: c.bkt,
      deadline: 3600 + Math.floor(Date.now() / 1000),
      deleteAfterDays: 365,
      returnBody:
        '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)","w":$(imageInfo.width),"h":$(imageInfo.height)}'
    };
    let tk = _gentk(c.ak, c.sk, policy);
    return {
        tk: tk,
        dm: c.dm
    };
}