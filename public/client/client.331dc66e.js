function t(){}function e(t,e){for(const n in e)t[n]=e[n];return t}function n(t){return t()}function r(){return Object.create(null)}function s(t){t.forEach(n)}function o(t){return"function"==typeof t}function c(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function a(e,...n){if(null==e)return t;const r=e.subscribe(...n);return r.unsubscribe?()=>r.unsubscribe():r}function l(t,e,n){t.$$.on_destroy.push(a(e,n))}function i(t,e,n,r){if(t){const s=u(t,e,n,r);return t[0](s)}}function u(t,n,r,s){return t[1]&&s?e(r.ctx.slice(),t[1](s(n))):r.ctx}function f(t,e,n,r){if(t[2]&&r){const s=t[2](r(n));if("object"==typeof e.dirty){const t=[],n=Math.max(e.dirty.length,s.length);for(let r=0;r<n;r+=1)t[r]=e.dirty[r]|s[r];return t}return e.dirty|s}return e.dirty}function p(t,e){t.appendChild(e)}function h(t,e,n){t.insertBefore(e,n||null)}function m(t){t.parentNode.removeChild(t)}function d(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function g(t){return document.createElement(t)}function $(t){return document.createTextNode(t)}function v(){return $(" ")}function y(){return $("")}function _(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function b(t){return Array.from(t.childNodes)}function E(t,e,n,r){for(let r=0;r<t.length;r+=1){const s=t[r];if(s.nodeName===e){let e=0;for(;e<s.attributes.length;){const t=s.attributes[e];n[t.name]?e++:s.removeAttribute(t.name)}return t.splice(r,1)[0]}}return r?function(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}(e):g(e)}function S(t,e){for(let n=0;n<t.length;n+=1){const r=t[n];if(3===r.nodeType)return r.data=""+e,t.splice(n,1)[0]}return $(e)}function x(t){return S(t," ")}function w(t,e){e=""+e,t.data!==e&&(t.data=e)}function P(t,e=document.body){return Array.from(e.querySelectorAll(t))}let A;function R(t){A=t}function L(t,e){(function(){if(!A)throw new Error("Function called outside component initialization");return A})().$$.context.set(t,e)}const C=[],j=[],k=[],q=[],D=Promise.resolve();let N=!1;function O(t){k.push(t)}const I=new Set;function U(){do{for(;C.length;){const t=C.shift();R(t),V(t.$$)}for(;j.length;)j.pop()();for(let t=0;t<k.length;t+=1){const e=k[t];I.has(e)||(I.add(e),e())}k.length=0}while(C.length);for(;q.length;)q.pop()();N=!1,I.clear()}function V(t){if(null!==t.fragment){t.update(),s(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(O)}}const H=new Set;let B;function T(){B={r:0,c:[],p:B}}function J(){B.r||s(B.c),B=B.p}function M(t,e){t&&t.i&&(H.delete(t),t.i(e))}function K(t,e,n,r){if(t&&t.o){if(H.has(t))return;H.add(t),B.c.push(()=>{H.delete(t),r&&(n&&t.d(1),r())}),t.o(e)}}function z(t,e){const n={},r={},s={$$scope:1};let o=t.length;for(;o--;){const c=t[o],a=e[o];if(a){for(const t in c)t in a||(r[t]=1);for(const t in a)s[t]||(n[t]=a[t],s[t]=1);t[o]=a}else for(const t in c)s[t]=1}for(const t in r)t in n||(n[t]=void 0);return n}function F(t){return"object"==typeof t&&null!==t?t:{}}function G(t){t&&t.c()}function W(t,e){t&&t.l(e)}function X(t,e,r){const{fragment:c,on_mount:a,on_destroy:l,after_update:i}=t.$$;c&&c.m(e,r),O(()=>{const e=a.map(n).filter(o);l?l.push(...e):s(e),t.$$.on_mount=[]}),i.forEach(O)}function Y(t,e){const n=t.$$;null!==n.fragment&&(s(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Q(t,e){-1===t.$$.dirty[0]&&(C.push(t),N||(N=!0,D.then(U)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function Z(e,n,o,c,a,l,i=[-1]){const u=A;R(e);const f=n.props||{},p=e.$$={fragment:null,ctx:null,props:l,update:t,not_equal:a,bound:r(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:[]),callbacks:r(),dirty:i};let h=!1;p.ctx=o?o(e,f,(t,n,...r)=>{const s=r.length?r[0]:n;return p.ctx&&a(p.ctx[t],p.ctx[t]=s)&&(p.bound[t]&&p.bound[t](s),h&&Q(e,t)),n}):[],p.update(),h=!0,s(p.before_update),p.fragment=!!c&&c(p.ctx),n.target&&(n.hydrate?p.fragment&&p.fragment.l(b(n.target)):p.fragment&&p.fragment.c(),n.intro&&M(e.$$.fragment),X(e,n.target,n.anchor),U()),R(u)}class tt{$destroy(){Y(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(){}}const et=[];function nt(t,e){return{subscribe:rt(t,e).subscribe}}function rt(e,n=t){let r;const s=[];function o(t){if(c(e,t)&&(e=t,r)){const t=!et.length;for(let t=0;t<s.length;t+=1){const n=s[t];n[1](),et.push(n,e)}if(t){for(let t=0;t<et.length;t+=2)et[t][0](et[t+1]);et.length=0}}}return{set:o,update:function(t){o(t(e))},subscribe:function(c,a=t){const l=[c,a];return s.push(l),1===s.length&&(r=n(o)||t),c(e),()=>{const t=s.indexOf(l);-1!==t&&s.splice(t,1),0===s.length&&(r(),r=null)}}}}function st(e,n,r){const c=!Array.isArray(e),l=c?[e]:e,i=n.length<2;return nt(r,e=>{let r=!1;const u=[];let f=0,p=t;const h=()=>{if(f)return;p();const r=n(c?u[0]:u,e);i?e(r):p=o(r)?r:t},m=l.map((t,e)=>a(t,t=>{u[e]=t,f&=~(1<<e),r&&h()},()=>{f|=1<<e}));return r=!0,h(),function(){s(m),p()}})}const ot={},ct=()=>({}),at=nt([{name:"Accueil",link:"."},{name:"Equipes",link:"equipes"},{name:"Competition",link:"competition"},{name:"Contact",link:"contact"}]);function lt(t,e,n){const r=t.slice();return r[4]=e[n],r}function it(t){let e,n,r,s,o,c,a,l=t[4].name+"";return{c(){e=g("li"),n=g("a"),r=g("p"),s=$(l),a=v(),this.h()},l(t){e=E(t,"LI",{});var o=b(e);n=E(o,"A",{href:!0});var c=b(n);r=E(c,"P",{class:!0});var i=b(r);s=S(i,l),i.forEach(m),c.forEach(m),a=x(o),o.forEach(m),this.h()},h(){_(r,"class",o="choice "+(t[0]==t[4].link||null==t[0]&&"."==t[4].link?"selected":"")),_(n,"href",c=t[4].link)},m(t,o){h(t,e,o),p(e,n),p(n,r),p(r,s),p(e,a)},p(t,e){4&e&&l!==(l=t[4].name+"")&&w(s,l),5&e&&o!==(o="choice "+(t[0]==t[4].link||null==t[0]&&"."==t[4].link?"selected":""))&&_(r,"class",o),4&e&&c!==(c=t[4].link)&&_(n,"href",c)},d(t){t&&m(e)}}}function ut(e){let n,r,s,o,c,a,l,i,u,f,$,y,S,w,P=e[2],A=[];for(let t=0;t<P.length;t+=1)A[t]=it(lt(e,P,t));return{c(){n=g("nav"),r=g("div"),s=g("div"),c=v(),a=g("div"),i=v(),u=g("div"),$=v(),y=g("ul");for(let t=0;t<A.length;t+=1)A[t].c();this.h()},l(t){n=E(t,"NAV",{role:!0});var e=b(n);r=E(e,"DIV",{class:!0});var o=b(r);s=E(o,"DIV",{class:!0}),b(s).forEach(m),c=x(o),a=E(o,"DIV",{class:!0}),b(a).forEach(m),i=x(o),u=E(o,"DIV",{class:!0}),b(u).forEach(m),$=x(o),y=E(o,"UL",{class:!0});var l=b(y);for(let t=0;t<A.length;t+=1)A[t].l(l);l.forEach(m),o.forEach(m),e.forEach(m),this.h()},h(){_(s,"class",o="bar first "+(e[1]?"change":"")+" svelte-1s6rx3r"),_(a,"class",l="bar second "+(e[1]?"change":"")+" svelte-1s6rx3r"),_(u,"class",f="bar third "+(e[1]?"change":"")+" svelte-1s6rx3r"),_(y,"class",S="rows menu "+(e[1]?"change":"")+" svelte-1s6rx3r"),_(r,"class","container svelte-1s6rx3r"),_(n,"role","navigation")},m(t,o){h(t,n,o),p(n,r),p(r,s),p(r,c),p(r,a),p(r,i),p(r,u),p(r,$),p(r,y);for(let t=0;t<A.length;t+=1)A[t].m(y,null);var l,f,m,d;l=r,f="click",m=e[3],l.addEventListener(f,m,d),w=()=>l.removeEventListener(f,m,d)},p(t,[e]){if(2&e&&o!==(o="bar first "+(t[1]?"change":"")+" svelte-1s6rx3r")&&_(s,"class",o),2&e&&l!==(l="bar second "+(t[1]?"change":"")+" svelte-1s6rx3r")&&_(a,"class",l),2&e&&f!==(f="bar third "+(t[1]?"change":"")+" svelte-1s6rx3r")&&_(u,"class",f),5&e){let n;for(P=t[2],n=0;n<P.length;n+=1){const r=lt(t,P,n);A[n]?A[n].p(r,e):(A[n]=it(r),A[n].c(),A[n].m(y,null))}for(;n<A.length;n+=1)A[n].d(1);A.length=P.length}2&e&&S!==(S="rows menu "+(t[1]?"change":"")+" svelte-1s6rx3r")&&_(y,"class",S)},i:t,o:t,d(t){t&&m(n),d(A,t),w()}}}function ft(t,e,n){let r;l(t,at,t=>n(2,r=t));let s=!1,{segment:o}=e;return t.$set=t=>{"segment"in t&&n(0,o=t.segment)},[o,s,r,()=>n(1,s=!s)]}class pt extends tt{constructor(t){super(),Z(this,t,ft,ut,c,{segment:0})}}function ht(t){let e,n,r,s,o,c,a,l,i,u;const f=new pt({props:{segment:t[0]}});return{c(){e=g("div"),n=v(),r=g("div"),s=g("div"),o=v(),c=g("div"),G(f.$$.fragment),a=v(),l=g("img"),this.h()},l(t){e=E(t,"DIV",{class:!0}),b(e).forEach(m),n=x(t),r=E(t,"DIV",{class:!0});var i=b(r);s=E(i,"DIV",{class:!0}),b(s).forEach(m),o=x(i),c=E(i,"DIV",{class:!0});var u=b(c);W(f.$$.fragment,u),u.forEach(m),a=x(i),l=E(i,"IMG",{class:!0,src:!0,alt:!0}),i.forEach(m),this.h()},h(){_(e,"class","header-line svelte-o7118l"),_(s,"class","back svelte-o7118l"),_(c,"class","menu svelte-o7118l"),_(l,"class","logo svelte-o7118l"),l.src!==(i="logo.png")&&_(l,"src","logo.png"),_(l,"alt","logo"),_(r,"class","header svelte-o7118l")},m(t,i){h(t,e,i),h(t,n,i),h(t,r,i),p(r,s),p(r,o),p(r,c),X(f,c,null),p(r,a),p(r,l),u=!0},p(t,[e]){const n={};1&e&&(n.segment=t[0]),f.$set(n)},i(t){u||(M(f.$$.fragment,t),u=!0)},o(t){K(f.$$.fragment,t),u=!1},d(t){t&&m(e),t&&m(n),t&&m(r),Y(f)}}}function mt(t,e,n){let{segment:r}=e;return t.$set=t=>{"segment"in t&&n(0,r=t.segment)},[r]}class dt extends tt{constructor(t){super(),Z(this,t,mt,ht,c,{segment:0})}}function gt(t){let e,n,r;const s=new dt({props:{segment:t[0]}}),o=t[2].default,c=i(o,t,t[1],null);return{c(){G(s.$$.fragment),e=v(),n=g("main"),c&&c.c()},l(t){W(s.$$.fragment,t),e=x(t),n=E(t,"MAIN",{});var r=b(n);c&&c.l(r),r.forEach(m)},m(t,o){X(s,t,o),h(t,e,o),h(t,n,o),c&&c.m(n,null),r=!0},p(t,[e]){const n={};1&e&&(n.segment=t[0]),s.$set(n),c&&c.p&&2&e&&c.p(u(o,t,t[1],null),f(o,t[1],e,null))},i(t){r||(M(s.$$.fragment,t),M(c,t),r=!0)},o(t){K(s.$$.fragment,t),K(c,t),r=!1},d(t){Y(s,t),t&&m(e),t&&m(n),c&&c.d(t)}}}function $t(t,e,n){let{segment:r}=e,{$$slots:s={},$$scope:o}=e;return t.$set=t=>{"segment"in t&&n(0,r=t.segment),"$$scope"in t&&n(1,o=t.$$scope)},[r,o,s]}class vt extends tt{constructor(t){super(),Z(this,t,$t,gt,c,{segment:0})}}function yt(t){let e,n,r=t[1].stack+"";return{c(){e=g("pre"),n=$(r)},l(t){e=E(t,"PRE",{});var s=b(e);n=S(s,r),s.forEach(m)},m(t,r){h(t,e,r),p(e,n)},p(t,e){2&e&&r!==(r=t[1].stack+"")&&w(n,r)},d(t){t&&m(e)}}}function _t(e){let n,r,s,o,c,a,l,i,u,f=e[1].message+"";document.title=n=e[0];let d=e[2]&&e[1].stack&&yt(e);return{c(){r=v(),s=g("h1"),o=$(e[0]),c=v(),a=g("p"),l=$(f),i=v(),d&&d.c(),u=y(),this.h()},l(t){P('[data-svelte="svelte-1o9r2ue"]',document.head).forEach(m),r=x(t),s=E(t,"H1",{class:!0});var n=b(s);o=S(n,e[0]),n.forEach(m),c=x(t),a=E(t,"P",{class:!0});var p=b(a);l=S(p,f),p.forEach(m),i=x(t),d&&d.l(t),u=y(),this.h()},h(){_(s,"class","svelte-8od9u6"),_(a,"class","svelte-8od9u6")},m(t,e){h(t,r,e),h(t,s,e),p(s,o),h(t,c,e),h(t,a,e),p(a,l),h(t,i,e),d&&d.m(t,e),h(t,u,e)},p(t,[e]){1&e&&n!==(n=t[0])&&(document.title=n),1&e&&w(o,t[0]),2&e&&f!==(f=t[1].message+"")&&w(l,f),t[2]&&t[1].stack?d?d.p(t,e):(d=yt(t),d.c(),d.m(u.parentNode,u)):d&&(d.d(1),d=null)},i:t,o:t,d(t){t&&m(r),t&&m(s),t&&m(c),t&&m(a),t&&m(i),d&&d.d(t),t&&m(u)}}}function bt(t,e,n){let{status:r}=e,{error:s}=e;return t.$set=t=>{"status"in t&&n(0,r=t.status),"error"in t&&n(1,s=t.error)},[r,s,!1]}class Et extends tt{constructor(t){super(),Z(this,t,bt,_t,c,{status:0,error:1})}}function St(t){let n,r;const s=[{segment:t[2][1]},t[4].props];var o=t[4].component;function c(t){let n={$$slots:{default:[Pt]},$$scope:{ctx:t}};for(let t=0;t<s.length;t+=1)n=e(n,s[t]);return{props:n}}if(o)var a=new o(c(t));return{c(){a&&G(a.$$.fragment),n=y()},l(t){a&&W(a.$$.fragment,t),n=y()},m(t,e){a&&X(a,t,e),h(t,n,e),r=!0},p(t,e){const r=20&e?z(s,[4&e&&{segment:t[2][1]},16&e&&F(t[4].props)]):{};if(160&e&&(r.$$scope={dirty:e,ctx:t}),o!==(o=t[4].component)){if(a){T();const t=a;K(t.$$.fragment,1,0,()=>{Y(t,1)}),J()}o?(G((a=new o(c(t))).$$.fragment),M(a.$$.fragment,1),X(a,n.parentNode,n)):a=null}else o&&a.$set(r)},i(t){r||(a&&M(a.$$.fragment,t),r=!0)},o(t){a&&K(a.$$.fragment,t),r=!1},d(t){t&&m(n),a&&Y(a,t)}}}function xt(t){let e;const n=new Et({props:{error:t[0],status:t[1]}});return{c(){G(n.$$.fragment)},l(t){W(n.$$.fragment,t)},m(t,r){X(n,t,r),e=!0},p(t,e){const r={};1&e&&(r.error=t[0]),2&e&&(r.status=t[1]),n.$set(r)},i(t){e||(M(n.$$.fragment,t),e=!0)},o(t){K(n.$$.fragment,t),e=!1},d(t){Y(n,t)}}}function wt(t){let n,r;const s=[t[5].props];var o=t[5].component;function c(t){let n={};for(let t=0;t<s.length;t+=1)n=e(n,s[t]);return{props:n}}if(o)var a=new o(c());return{c(){a&&G(a.$$.fragment),n=y()},l(t){a&&W(a.$$.fragment,t),n=y()},m(t,e){a&&X(a,t,e),h(t,n,e),r=!0},p(t,e){const r=32&e?z(s,[F(t[5].props)]):{};if(o!==(o=t[5].component)){if(a){T();const t=a;K(t.$$.fragment,1,0,()=>{Y(t,1)}),J()}o?(G((a=new o(c())).$$.fragment),M(a.$$.fragment,1),X(a,n.parentNode,n)):a=null}else o&&a.$set(r)},i(t){r||(a&&M(a.$$.fragment,t),r=!0)},o(t){a&&K(a.$$.fragment,t),r=!1},d(t){t&&m(n),a&&Y(a,t)}}}function Pt(t){let e,n,r=t[5]&&wt(t);return{c(){r&&r.c(),e=y()},l(t){r&&r.l(t),e=y()},m(t,s){r&&r.m(t,s),h(t,e,s),n=!0},p(t,n){t[5]?r?(r.p(t,n),M(r,1)):(r=wt(t),r.c(),M(r,1),r.m(e.parentNode,e)):r&&(T(),K(r,1,1,()=>{r=null}),J())},i(t){n||(M(r),n=!0)},o(t){K(r),n=!1},d(t){r&&r.d(t),t&&m(e)}}}function At(t){let e,n,r,s;const o=[xt,St],c=[];function a(t,e){return t[0]?0:1}return e=a(t),n=c[e]=o[e](t),{c(){n.c(),r=y()},l(t){n.l(t),r=y()},m(t,n){c[e].m(t,n),h(t,r,n),s=!0},p(t,s){let l=e;e=a(t),e===l?c[e].p(t,s):(T(),K(c[l],1,1,()=>{c[l]=null}),J(),n=c[e],n||(n=c[e]=o[e](t),n.c()),M(n,1),n.m(r.parentNode,r))},i(t){s||(M(n),s=!0)},o(t){K(n),s=!1},d(t){c[e].d(t),t&&m(r)}}}function Rt(t){let n;const r=[{segment:t[2][0]},t[3].props];let s={$$slots:{default:[At]},$$scope:{ctx:t}};for(let t=0;t<r.length;t+=1)s=e(s,r[t]);const o=new vt({props:s});return{c(){G(o.$$.fragment)},l(t){W(o.$$.fragment,t)},m(t,e){X(o,t,e),n=!0},p(t,[e]){const n=12&e?z(r,[4&e&&{segment:t[2][0]},8&e&&F(t[3].props)]):{};183&e&&(n.$$scope={dirty:e,ctx:t}),o.$set(n)},i(t){n||(M(o.$$.fragment,t),n=!0)},o(t){K(o.$$.fragment,t),n=!1},d(t){Y(o,t)}}}function Lt(t,e,n){let{stores:r}=e,{error:s}=e,{status:o}=e,{segments:c}=e,{level0:a}=e,{level1:l=null}=e,{level2:i=null}=e;return L(ot,r),t.$set=t=>{"stores"in t&&n(6,r=t.stores),"error"in t&&n(0,s=t.error),"status"in t&&n(1,o=t.status),"segments"in t&&n(2,c=t.segments),"level0"in t&&n(3,a=t.level0),"level1"in t&&n(4,l=t.level1),"level2"in t&&n(5,i=t.level2)},[s,o,c,a,l,i,r]}class Ct extends tt{constructor(t){super(),Z(this,t,Lt,Rt,c,{stores:6,error:0,status:1,segments:2,level0:3,level1:4,level2:5})}}const jt=[],kt=[{js:()=>import("./index.620730b8.js"),css:["index.620730b8.css","client.331dc66e.css","seasons.82958716.css","teams.0d9db508.css"]},{js:()=>import("./_layout.a899de14.js"),css:["_layout.a899de14.css","client.331dc66e.css","seasons.82958716.css","Season.c2407261.css"]},{js:()=>import("./index.0dca8912.js"),css:["client.331dc66e.css"]},{js:()=>import("./2016-2017.5a0d5de2.js"),css:["2016-2017.5a0d5de2.css","client.331dc66e.css","seasons.82958716.css","Season.c2407261.css"]},{js:()=>import("./2017-2018.e89035f3.js"),css:["2017-2018.e89035f3.css","client.331dc66e.css","seasons.82958716.css","Season.c2407261.css"]},{js:()=>import("./2018-2019.1627086b.js"),css:["2018-2019.1627086b.css","client.331dc66e.css","seasons.82958716.css","Season.c2407261.css"]},{js:()=>import("./contact.b1f023e2.js"),css:["contact.b1f023e2.css","client.331dc66e.css"]},{js:()=>import("./equipes.70d1204f.js"),css:["equipes.70d1204f.css","client.331dc66e.css","teams.0d9db508.css"]}],qt=[{pattern:/^\/$/,parts:[{i:0}]},{pattern:/^\/competition\/?$/,parts:[{i:1},{i:2}]},{pattern:/^\/competition\/2016-2017\/?$/,parts:[{i:1},{i:3}]},{pattern:/^\/competition\/2017-2018\/?$/,parts:[{i:1},{i:4}]},{pattern:/^\/competition\/2018-2019\/?$/,parts:[{i:1},{i:5}]},{pattern:/^\/contact\/?$/,parts:[{i:6}]},{pattern:/^\/equipes\/?$/,parts:[{i:7}]}];const Dt="undefined"!=typeof __SAPPER__&&__SAPPER__;let Nt,Ot,It,Ut=!1,Vt=[],Ht="{}";const Bt={page:rt({}),preloading:rt(null),session:rt(Dt&&Dt.session)};let Tt,Jt;Bt.session.subscribe(async t=>{if(Tt=t,!Ut)return;Jt=!0;const e=Yt(new URL(location.href)),n=Ot={},{redirect:r,props:s,branch:o}=await ee(e);n===Ot&&await te(r,o,s,e.page)});let Mt,Kt=null;let zt,Ft=1;const Gt="undefined"!=typeof history?history:{pushState:(t,e,n)=>{},replaceState:(t,e,n)=>{},scrollRestoration:""},Wt={};function Xt(t){const e=Object.create(null);return t.length>0&&t.slice(1).split("&").forEach(t=>{let[,n,r=""]=/([^=]*)(?:=(.*))?/.exec(decodeURIComponent(t.replace(/\+/g," ")));"string"==typeof e[n]&&(e[n]=[e[n]]),"object"==typeof e[n]?e[n].push(r):e[n]=r}),e}function Yt(t){if(t.origin!==location.origin)return null;if(!t.pathname.startsWith(Dt.baseUrl))return null;let e=t.pathname.slice(Dt.baseUrl.length);if(""===e&&(e="/"),!jt.some(t=>t.test(e)))for(let n=0;n<qt.length;n+=1){const r=qt[n],s=r.pattern.exec(e);if(s){const n=Xt(t.search),o=r.parts[r.parts.length-1],c=o.params?o.params(s):{},a={host:location.host,path:e,query:n,params:c};return{href:t.href,route:r,match:s,page:a}}}}function Qt(){return{x:pageXOffset,y:pageYOffset}}async function Zt(t,e,n,r){if(e)zt=e;else{const t=Qt();Wt[zt]=t,e=zt=++Ft,Wt[zt]=n?t:{x:0,y:0}}zt=e,Nt&&Bt.preloading.set(!0);const s=Kt&&Kt.href===t.href?Kt.promise:ee(t);Kt=null;const o=Ot={},{redirect:c,props:a,branch:l}=await s;if(o===Ot&&(await te(c,l,a,t.page),document.activeElement&&document.activeElement.blur(),!n)){let t=Wt[e];if(r){const e=document.getElementById(r.slice(1));e&&(t={x:0,y:e.getBoundingClientRect().top})}Wt[zt]=t,t&&scrollTo(t.x,t.y)}}async function te(t,e,n,r){if(t)return function(t,e={replaceState:!1}){const n=Yt(new URL(t,document.baseURI));return n?(Gt[e.replaceState?"replaceState":"pushState"]({id:zt},"",t),Zt(n,null).then(()=>{})):(location.href=t,new Promise(t=>{}))}(t.location,{replaceState:!0});if(Bt.page.set(r),Bt.preloading.set(!1),Nt)Nt.$set(n);else{n.stores={page:{subscribe:Bt.page.subscribe},preloading:{subscribe:Bt.preloading.subscribe},session:Bt.session},n.level0={props:await It};const t=document.querySelector("#sapper-head-start"),e=document.querySelector("#sapper-head-end");if(t&&e){for(;t.nextSibling!==e;)re(t.nextSibling);re(t),re(e)}Nt=new Ct({target:Mt,props:n,hydrate:!0})}Vt=e,Ht=JSON.stringify(r.query),Ut=!0,Jt=!1}async function ee(t){const{route:e,page:n}=t,r=n.path.split("/").filter(Boolean);let s=null;const o={error:null,status:200,segments:[r[0]]},c={fetch:(t,e)=>fetch(t,e),redirect:(t,e)=>{if(s&&(s.statusCode!==t||s.location!==e))throw new Error("Conflicting redirects");s={statusCode:t,location:e}},error:(t,e)=>{o.error="string"==typeof e?new Error(e):e,o.status=t}};let a;It||(It=Dt.preloaded[0]||ct.call(c,{host:n.host,path:n.path,query:n.query,params:{}},Tt));let l=1;try{const s=JSON.stringify(n.query),i=e.pattern.exec(n.path);let u=!1;a=await Promise.all(e.parts.map(async(e,a)=>{const f=r[a];if(function(t,e,n,r){if(r!==Ht)return!0;const s=Vt[t];return!!s&&(e!==s.segment||(!(!s.match||JSON.stringify(s.match.slice(1,t+2))===JSON.stringify(n.slice(1,t+2)))||void 0))}(a,f,i,s)&&(u=!0),o.segments[l]=r[a+1],!e)return{segment:f};const p=l++;if(!Jt&&!u&&Vt[a]&&Vt[a].part===e.i)return Vt[a];u=!1;const{default:h,preload:m}=await function(t){const e="string"==typeof t.css?[]:t.css.map(ne);return e.unshift(t.js()),Promise.all(e).then(t=>t[0])}(kt[e.i]);let d;return d=Ut||!Dt.preloaded[a+1]?m?await m.call(c,{host:n.host,path:n.path,query:n.query,params:e.params?e.params(t.match):{}},Tt):{}:Dt.preloaded[a+1],o[`level${p}`]={component:h,props:d,segment:f,match:i,part:e.i}}))}catch(t){o.error=t,o.status=500,a=[]}return{redirect:s,props:o,branch:a}}function ne(t){const e=`client/${t}`;if(!document.querySelector(`link[href="${e}"]`))return new Promise((t,n)=>{const r=document.createElement("link");r.rel="stylesheet",r.href=e,r.onload=()=>t(),r.onerror=n,document.head.appendChild(r)})}function re(t){t.parentNode.removeChild(t)}function se(t){const e=Yt(new URL(t,document.baseURI));if(e)return Kt&&t===Kt.href||function(t,e){Kt={href:t,promise:e}}(t,ee(e)),Kt.promise}let oe;function ce(t){clearTimeout(oe),oe=setTimeout(()=>{ae(t)},20)}function ae(t){const e=ie(t.target);e&&"prefetch"===e.rel&&se(e.href)}function le(t){if(1!==function(t){return null===t.which?t.button:t.which}(t))return;if(t.metaKey||t.ctrlKey||t.shiftKey)return;if(t.defaultPrevented)return;const e=ie(t.target);if(!e)return;if(!e.href)return;const n="object"==typeof e.href&&"SVGAnimatedString"===e.href.constructor.name,r=String(n?e.href.baseVal:e.href);if(r===location.href)return void(location.hash||t.preventDefault());if(e.hasAttribute("download")||"external"===e.getAttribute("rel"))return;if(n?e.target.baseVal:e.target)return;const s=new URL(r);if(s.pathname===location.pathname&&s.search===location.search)return;const o=Yt(s);if(o){Zt(o,null,e.hasAttribute("sapper-noscroll"),s.hash),t.preventDefault(),Gt.pushState({id:zt},"",s.href)}}function ie(t){for(;t&&"A"!==t.nodeName.toUpperCase();)t=t.parentNode;return t}function ue(t){if(Wt[zt]=Qt(),t.state){const e=Yt(new URL(location.href));e?Zt(e,t.state.id):location.href=location.href}else Ft=Ft+1,function(t){zt=t}(Ft),Gt.replaceState({id:zt},"",location.href)}var fe;fe={target:document.querySelector("#sapper")},"scrollRestoration"in Gt&&(Gt.scrollRestoration="manual"),function(t){Mt=t}(fe.target),addEventListener("click",le),addEventListener("popstate",ue),addEventListener("touchstart",ae),addEventListener("mousemove",ce),Promise.resolve().then(()=>{const{hash:t,href:e}=location;Gt.replaceState({id:Ft},"",e);const n=new URL(location.href);if(Dt.error)return function(t){const{host:e,pathname:n,search:r}=location,{session:s,preloaded:o,status:c,error:a}=Dt;It||(It=o&&o[0]),te(null,[],{error:a,status:c,session:s,level0:{props:It},level1:{props:{status:c,error:a},component:Et},segments:o},{host:e,path:n,query:Xt(r),params:{}})}();const r=Yt(n);return r?Zt(r,Ft,!0,t):void 0});export{nt as A,P as B,l as C,i as D,u as E,f as F,tt as S,v as a,b,E as c,S as d,g as e,m as f,x as g,_ as h,Z as i,h as j,p as k,w as l,G as m,t as n,W as o,X as p,M as q,K as r,c as s,$ as t,Y as u,T as v,J as w,d as x,st as y,rt as z};
