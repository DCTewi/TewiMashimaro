'use strict';let a=new URL(document.location.href);let b=new URLSearchParams(a.search);b.delete('status');b.delete('lang');a.search=b;window.history.pushState(null,'',a.toString());
