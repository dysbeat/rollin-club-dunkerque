import{S as s,i as a,s as n,e,t as r,a as l,c as i,b as t,d as o,f as g,g as c,h as k,j as m,n as f,m as h,p as v}from"./chunk.2f6834fd.js";import{R as u}from"./chunk.b7099e96.js";function d(s,a,n){const e=Object.create(s);return e.ranking=a[n],e}function p(s){var a,n,f,h,v,u,d,p,$,w,E,N,I,L,b,D,y,j,x,R,q,A,C,P,S,U,V,O,z,B,F,G,H,J,K,M,Q=s.ranking.rank,T=s.ranking.teams,W=s.ranking.points,X=s.ranking.played,Y=s.ranking.wins,Z=s.ranking.draws,_=s.ranking.loses,ss=s.ranking.forfaited,as=s.ranking.goals,ns=s.ranking.goalsAllowed,es=s.ranking.goalsDiff;return{c(){a=e("li"),n=e("ul"),f=e("li"),h=r(Q),v=l(),u=e("li"),d=r(T),p=l(),$=e("li"),w=r(W),E=l(),N=e("li"),I=r(X),L=l(),b=e("li"),D=r(Y),y=l(),j=e("li"),x=r(Z),R=l(),q=e("li"),A=r(_),C=l(),P=e("li"),S=r(ss),U=l(),V=e("li"),O=r(as),z=l(),B=e("li"),F=r(ns),G=l(),H=e("li"),J=r(es),M=l(),this.h()},l(s){a=i(s,"LI",{class:!0},!1);var e=t(a);n=i(e,"UL",{class:!0},!1);var r=t(n);f=i(r,"LI",{class:!0},!1);var l=t(f);h=o(l,Q),l.forEach(g),v=o(r,"\n        "),u=i(r,"LI",{class:!0},!1);var c=t(u);d=o(c,T),c.forEach(g),p=o(r,"\n        "),$=i(r,"LI",{class:!0},!1);var k=t($);w=o(k,W),k.forEach(g),E=o(r,"\n        "),N=i(r,"LI",{class:!0},!1);var m=t(N);I=o(m,X),m.forEach(g),L=o(r,"\n        "),b=i(r,"LI",{class:!0},!1);var K=t(b);D=o(K,Y),K.forEach(g),y=o(r,"\n        "),j=i(r,"LI",{class:!0},!1);var rs=t(j);x=o(rs,Z),rs.forEach(g),R=o(r,"\n        "),q=i(r,"LI",{class:!0},!1);var ls=t(q);A=o(ls,_),ls.forEach(g),C=o(r,"\n        "),P=i(r,"LI",{class:!0},!1);var is=t(P);S=o(is,ss),is.forEach(g),U=o(r,"\n        "),V=i(r,"LI",{class:!0},!1);var ts=t(V);O=o(ts,as),ts.forEach(g),z=o(r,"\n        "),B=i(r,"LI",{class:!0},!1);var os=t(B);F=o(os,ns),os.forEach(g),G=o(r,"\n        "),H=i(r,"LI",{class:!0},!1);var gs=t(H);J=o(gs,es),gs.forEach(g),r.forEach(g),M=o(e,"\n    "),e.forEach(g),this.h()},h(){f.className="item svelte-3eoed1",u.className="item team svelte-3eoed1",$.className="item svelte-3eoed1",N.className="item show svelte-3eoed1",b.className="item show svelte-3eoed1",j.className="item show svelte-3eoed1",q.className="item show svelte-3eoed1",P.className="item show svelte-3eoed1",V.className="item show svelte-3eoed1",B.className="item show svelte-3eoed1",H.className="item show svelte-3eoed1",n.className=K="rows list "+("Dunkerque"==s.ranking.teams?"blue":"")+" svelte-3eoed1",a.className="gray rank svelte-3eoed1"},m(s,e){c(s,a,e),k(a,n),k(n,f),k(f,h),k(n,v),k(n,u),k(u,d),k(n,p),k(n,$),k($,w),k(n,E),k(n,N),k(N,I),k(n,L),k(n,b),k(b,D),k(n,y),k(n,j),k(j,x),k(n,R),k(n,q),k(q,A),k(n,C),k(n,P),k(P,S),k(n,U),k(n,V),k(V,O),k(n,z),k(n,B),k(B,F),k(n,G),k(n,H),k(H,J),k(a,M)},p(s,a){s.rankings&&Q!==(Q=a.ranking.rank)&&m(h,Q),s.rankings&&T!==(T=a.ranking.teams)&&m(d,T),s.rankings&&W!==(W=a.ranking.points)&&m(w,W),s.rankings&&X!==(X=a.ranking.played)&&m(I,X),s.rankings&&Y!==(Y=a.ranking.wins)&&m(D,Y),s.rankings&&Z!==(Z=a.ranking.draws)&&m(x,Z),s.rankings&&_!==(_=a.ranking.loses)&&m(A,_),s.rankings&&ss!==(ss=a.ranking.forfaited)&&m(S,ss),s.rankings&&as!==(as=a.ranking.goals)&&m(O,as),s.rankings&&ns!==(ns=a.ranking.goalsAllowed)&&m(F,ns),s.rankings&&es!==(es=a.ranking.goalsDiff)&&m(J,es),s.rankings&&K!==(K="rows list "+("Dunkerque"==a.ranking.teams?"blue":"")+" svelte-3eoed1")&&(n.className=K)},d(s){s&&g(a)}}}function $(s){for(var a,n=s.rankings,r=[],l=0;l<n.length;l+=1)r[l]=p(d(s,n,l));return{c(){a=e("ul");for(var s=0;s<r.length;s+=1)r[s].c()},l(s){a=i(s,"UL",{},!1);for(var n=t(a),e=0;e<r.length;e+=1)r[e].l(n);n.forEach(g)},m(s,n){c(s,a,n);for(var e=0;e<r.length;e+=1)r[e].m(a,null)},p(s,e){if(s.rankings){n=e.rankings;for(var l=0;l<n.length;l+=1){const i=d(e,n,l);r[l]?r[l].p(s,i):(r[l]=p(i),r[l].c(),r[l].m(a,null))}for(;l<r.length;l+=1)r[l].d(1);r.length=n.length}},i:f,o:f,d(s){s&&g(a),h(r,s)}}}function w(s,a,n){let{rankings:e}=a;return s.$set=(s=>{"rankings"in s&&n("rankings",e=s.rankings)}),{rankings:e}}class E extends s{constructor(s){super(),a(this,s,w,$,n,["rankings"])}}function N(s){var a,n,m,f,h,d,p,$,w,N,I=new E({props:{rankings:s.season.rankings}}),L=new u({props:{results:s.season.results}});return{c(){a=e("div"),n=e("p"),m=r("Classement"),f=l(),I.$$.fragment.c(),h=l(),d=e("div"),p=e("p"),$=r("Resultats"),w=l(),L.$$.fragment.c(),this.h()},l(s){a=i(s,"DIV",{class:!0},!1);var e=t(a);n=i(e,"P",{class:!0},!1);var r=t(n);m=o(r,"Classement"),r.forEach(g),f=o(e,"\n  "),I.$$.fragment.l(e),e.forEach(g),h=o(s,"\n"),d=i(s,"DIV",{},!1);var l=t(d);p=i(l,"P",{class:!0},!1);var c=t(p);$=o(c,"Resultats"),c.forEach(g),w=o(l,"\n  "),L.$$.fragment.l(l),l.forEach(g),this.h()},h(){n.className="large blue title pad",a.className="ranking svelte-1pgna39",p.className="large blue title pad"},m(s,e){c(s,a,e),k(a,n),k(n,m),k(a,f),v(I,a,null),c(s,h,e),c(s,d,e),k(d,p),k(p,$),k(d,w),v(L,d,null),N=!0},p(s,a){var n={};s.season&&(n.rankings=a.season.rankings),I.$set(n);var e={};s.season&&(e.results=a.season.results),L.$set(e)},i(s){N||(I.$$.fragment.i(s),L.$$.fragment.i(s),N=!0)},o(s){I.$$.fragment.o(s),L.$$.fragment.o(s),N=!1},d(s){s&&g(a),I.$destroy(),s&&(g(h),g(d)),L.$destroy()}}}function I(s,a,n){let{season:e}=a;return s.$set=(s=>{"season"in s&&n("season",e=s.season)}),{season:e}}class L extends s{constructor(s){super(),a(this,s,I,N,n,["season"])}}export{L as S};
//# sourceMappingURL=chunk.fa0e2b79.js.map
