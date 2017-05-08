function pug_attr(t,e,n,f){return e!==!1&&null!=e&&(e||"class"!==t&&"style"!==t)?e===!0?" "+(f?t:t+'="'+t+'"'):("function"==typeof e.toJSON&&(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||e.indexOf('"')===-1)?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"):""}
function pug_classes(s,r){return Array.isArray(s)?pug_classes_array(s,r):s&&"object"==typeof s?pug_classes_object(s):s||""}
function pug_classes_array(r,a){for(var s,e="",u="",c=Array.isArray(a),g=0;g<r.length;g++)s=pug_classes(r[g]),s&&(c&&a[g]&&(s=pug_escape(s)),e=e+u+s,u=" ");return e}
function pug_classes_object(r){var a="",n="";for(var o in r)o&&r[o]&&pug_has_own_property.call(r,o)&&(a=a+n+o,n=" ");return a}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_has_own_property=Object.prototype.hasOwnProperty;
var pug_match_html=/["&<>]/;
function pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\n"+i+"\n\n"+n.message,n}function chatTmpl(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {"components\u002Fchat\u002Fchat.tmpl.pug":"div.chat\r\n\tdiv.chat__container\r\n\t\tdiv.header\r\n\t\t\th2='Добро пожаловать ' + user\r\n\t\tdiv.chat__box\r\n\r\n\t\t\tif !messages.length\r\n\t\t\t\th3 Пока нет сообщений\r\n\r\n\t\t\teach message in messages\r\n\t\t\t\tdiv.message-box(class=message.isMine ? 'left-img' : 'right-img')\r\n\t\t\t\t\tdiv.picture\r\n\t\t\t\t\t\timg(src=message.avatar title='name of user')\r\n\t\t\t\t\t\tspan.time=message.date.toTimeString().split(' ')[0]\r\n\t\t\t\t\tdiv.message\r\n\t\t\t\t\t\tspan=message.name\r\n\t\t\t\t\t\tp=message.text\r\n"};
;var locals_for_with = (locals || {});(function (messages, user) {;pug_debug_line = 1;pug_debug_filename = "components\u002Fchat\u002Fchat.tmpl.pug";
pug_html = pug_html + "\u003Cdiv class=\"chat\"\u003E";
;pug_debug_line = 2;pug_debug_filename = "components\u002Fchat\u002Fchat.tmpl.pug";
pug_html = pug_html + "\u003Cdiv class=\"chat__container\"\u003E";
;pug_debug_line = 3;pug_debug_filename = "components\u002Fchat\u002Fchat.tmpl.pug";
pug_html = pug_html + "\u003Cdiv class=\"header\"\u003E";
;pug_debug_line = 4;pug_debug_filename = "components\u002Fchat\u002Fchat.tmpl.pug";
pug_html = pug_html + "\u003Ch2\u003E";
;pug_debug_line = 4;pug_debug_filename = "components\u002Fchat\u002Fchat.tmpl.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = 'Добро пожаловать ' + user) ? "" : pug_interp)) + "\u003C\u002Fh2\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 5;pug_debug_filename = "components\u002Fchat\u002Fchat.tmpl.pug";
pug_html = pug_html + "\u003Cdiv class=\"chat__box\"\u003E";
;pug_debug_line = 7;pug_debug_filename = "components\u002Fchat\u002Fchat.tmpl.pug";
if (!messages.length) {
;pug_debug_line = 8;pug_debug_filename = "components\u002Fchat\u002Fchat.tmpl.pug";
pug_html = pug_html + "\u003Ch3\u003E";
;pug_debug_line = 8;pug_debug_filename = "components\u002Fchat\u002Fchat.tmpl.pug";
pug_html = pug_html + "Пока нет сообщений\u003C\u002Fh3\u003E";
}
;pug_debug_line = 10;pug_debug_filename = "components\u002Fchat\u002Fchat.tmpl.pug";
// iterate messages
;(function(){
  var $$obj = messages;
  if ('number' == typeof $$obj.length) {
      for (var pug_index0 = 0, $$l = $$obj.length; pug_index0 < $$l; pug_index0++) {
        var message = $$obj[pug_index0];
;pug_debug_line = 11;pug_debug_filename = "components\u002Fchat\u002Fchat.tmpl.pug";
pug_html = pug_html + "\u003Cdiv" + (pug_attr("class", pug_classes(["message-box",message.isMine ? 'left-img' : 'right-img'], [false,true]), false, false)) + "\u003E";
;pug_debug_line = 12;pug_debug_filename = "components\u002Fchat\u002Fchat.tmpl.pug";
pug_html = pug_html + "\u003Cdiv class=\"picture\"\u003E";
;pug_debug_line = 13;pug_debug_filename = "components\u002Fchat\u002Fchat.tmpl.pug";
pug_html = pug_html + "\u003Cimg" + (pug_attr("src", message.avatar, true, false)+" title=\"name of user\"") + "\u002F\u003E";
;pug_debug_line = 14;pug_debug_filename = "components\u002Fchat\u002Fchat.tmpl.pug";
pug_html = pug_html + "\u003Cspan class=\"time\"\u003E";
;pug_debug_line = 14;pug_debug_filename = "components\u002Fchat\u002Fchat.tmpl.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = message.date.toTimeString().split(' ')[0]) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 15;pug_debug_filename = "components\u002Fchat\u002Fchat.tmpl.pug";
pug_html = pug_html + "\u003Cdiv class=\"message\"\u003E";
;pug_debug_line = 16;pug_debug_filename = "components\u002Fchat\u002Fchat.tmpl.pug";
pug_html = pug_html + "\u003Cspan\u003E";
;pug_debug_line = 16;pug_debug_filename = "components\u002Fchat\u002Fchat.tmpl.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = message.name) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 17;pug_debug_filename = "components\u002Fchat\u002Fchat.tmpl.pug";
pug_html = pug_html + "\u003Cp\u003E";
;pug_debug_line = 17;pug_debug_filename = "components\u002Fchat\u002Fchat.tmpl.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = message.text) ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index0 in $$obj) {
      $$l++;
      var message = $$obj[pug_index0];
;pug_debug_line = 11;pug_debug_filename = "components\u002Fchat\u002Fchat.tmpl.pug";
pug_html = pug_html + "\u003Cdiv" + (pug_attr("class", pug_classes(["message-box",message.isMine ? 'left-img' : 'right-img'], [false,true]), false, false)) + "\u003E";
;pug_debug_line = 12;pug_debug_filename = "components\u002Fchat\u002Fchat.tmpl.pug";
pug_html = pug_html + "\u003Cdiv class=\"picture\"\u003E";
;pug_debug_line = 13;pug_debug_filename = "components\u002Fchat\u002Fchat.tmpl.pug";
pug_html = pug_html + "\u003Cimg" + (pug_attr("src", message.avatar, true, false)+" title=\"name of user\"") + "\u002F\u003E";
;pug_debug_line = 14;pug_debug_filename = "components\u002Fchat\u002Fchat.tmpl.pug";
pug_html = pug_html + "\u003Cspan class=\"time\"\u003E";
;pug_debug_line = 14;pug_debug_filename = "components\u002Fchat\u002Fchat.tmpl.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = message.date.toTimeString().split(' ')[0]) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 15;pug_debug_filename = "components\u002Fchat\u002Fchat.tmpl.pug";
pug_html = pug_html + "\u003Cdiv class=\"message\"\u003E";
;pug_debug_line = 16;pug_debug_filename = "components\u002Fchat\u002Fchat.tmpl.pug";
pug_html = pug_html + "\u003Cspan\u003E";
;pug_debug_line = 16;pug_debug_filename = "components\u002Fchat\u002Fchat.tmpl.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = message.name) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E";
;pug_debug_line = 17;pug_debug_filename = "components\u002Fchat\u002Fchat.tmpl.pug";
pug_html = pug_html + "\u003Cp\u003E";
;pug_debug_line = 17;pug_debug_filename = "components\u002Fchat\u002Fchat.tmpl.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = message.text) ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";}.call(this,"messages" in locals_for_with?locals_for_with.messages:typeof messages!=="undefined"?messages:undefined,"user" in locals_for_with?locals_for_with.user:typeof user!=="undefined"?user:undefined));} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);};return pug_html;}