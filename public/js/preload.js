'use strict';
let a=new URL(location.href);let b=a.searchParams;b.delete('status');b.delete('lang');a.search=b;window.history.pushState(null,'',a);
let setlang=l=>{let a=new URL(location.href);let b=a.searchParams;b.set('lang',l);a.search=b;location.href=a;}
