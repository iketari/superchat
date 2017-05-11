function pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\n"+i+"\n\n"+n.message,n}function formTmpl(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {"components\u002Fform\u002Fform.tmpl.pug":"form\n    textarea(name=\"message\")\n    br\n    input(type=\"text\", name=\"username\", placeholder=\"username\")\n    input(type=\"submit\", value=\"Отправить\")"};
;pug_debug_line = 1;pug_debug_filename = "components\u002Fform\u002Fform.tmpl.pug";
pug_html = pug_html + "\u003Cform\u003E";
;pug_debug_line = 2;pug_debug_filename = "components\u002Fform\u002Fform.tmpl.pug";
pug_html = pug_html + "\u003Ctextarea name=\"message\"\u003E\u003C\u002Ftextarea\u003E";
;pug_debug_line = 3;pug_debug_filename = "components\u002Fform\u002Fform.tmpl.pug";
pug_html = pug_html + "\u003Cbr\u002F\u003E";
;pug_debug_line = 4;pug_debug_filename = "components\u002Fform\u002Fform.tmpl.pug";
pug_html = pug_html + "\u003Cinput type=\"text\" name=\"username\" placeholder=\"username\"\u002F\u003E";
;pug_debug_line = 5;pug_debug_filename = "components\u002Fform\u002Fform.tmpl.pug";
pug_html = pug_html + "\u003Cinput type=\"submit\" value=\"Отправить\"\u002F\u003E\u003C\u002Fform\u003E";} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);};return pug_html;}