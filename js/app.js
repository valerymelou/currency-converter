!function i(c,u,a){function s(t,e){if(!u[t]){if(!c[t]){var n="function"==typeof require&&require;if(!e&&n)return n(t,!0);if(l)return l(t,!0);var r=new Error("Cannot find module '"+t+"'");throw r.code="MODULE_NOT_FOUND",r}var o=u[t]={exports:{}};c[t][0].call(o.exports,function(e){return s(c[t][1][e]||e)},o,o.exports,i,c,u,a)}return u[t].exports}for(var l="function"==typeof require&&require,e=0;e<a.length;e++)s(a[e]);return s}({1:[function(e,v,t){"use strict";!function(){function c(n){return new Promise(function(e,t){n.onsuccess=function(){e(n.result)},n.onerror=function(){t(n.error)}})}function i(n,r,o){var i,e=new Promise(function(e,t){c(i=n[r].apply(n,o)).then(e,t)});return e.request=i,e}function e(e,n,t){t.forEach(function(t){Object.defineProperty(e.prototype,t,{get:function(){return this[n][t]},set:function(e){this[n][t]=e}})})}function t(t,n,r,e){e.forEach(function(e){e in r.prototype&&(t.prototype[e]=function(){return i(this[n],e,arguments)})})}function n(t,n,r,e){e.forEach(function(e){e in r.prototype&&(t.prototype[e]=function(){return this[n][e].apply(this[n],arguments)})})}function r(e,r,t,n){n.forEach(function(n){n in t.prototype&&(e.prototype[n]=function(){return e=this[r],(t=i(e,n,arguments)).then(function(e){if(e)return new u(e,t.request)});var e,t})})}function o(e){this._index=e}function u(e,t){this._cursor=e,this._request=t}function a(e){this._store=e}function s(n){this._tx=n,this.complete=new Promise(function(e,t){n.oncomplete=function(){e()},n.onerror=function(){t(n.error)},n.onabort=function(){t(n.error)}})}function l(e,t,n){this._db=e,this.oldVersion=t,this.transaction=new s(n)}function f(e){this._db=e}e(o,"_index",["name","keyPath","multiEntry","unique"]),t(o,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),r(o,"_index",IDBIndex,["openCursor","openKeyCursor"]),e(u,"_cursor",["direction","key","primaryKey","value"]),t(u,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach(function(n){n in IDBCursor.prototype&&(u.prototype[n]=function(){var t=this,e=arguments;return Promise.resolve().then(function(){return t._cursor[n].apply(t._cursor,e),c(t._request).then(function(e){if(e)return new u(e,t._request)})})})}),a.prototype.createIndex=function(){return new o(this._store.createIndex.apply(this._store,arguments))},a.prototype.index=function(){return new o(this._store.index.apply(this._store,arguments))},e(a,"_store",["name","keyPath","indexNames","autoIncrement"]),t(a,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getKey","getAllKeys","count"]),r(a,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),n(a,"_store",IDBObjectStore,["deleteIndex"]),s.prototype.objectStore=function(){return new a(this._tx.objectStore.apply(this._tx,arguments))},e(s,"_tx",["objectStoreNames","mode"]),n(s,"_tx",IDBTransaction,["abort"]),l.prototype.createObjectStore=function(){return new a(this._db.createObjectStore.apply(this._db,arguments))},e(l,"_db",["name","version","objectStoreNames"]),n(l,"_db",IDBDatabase,["deleteObjectStore","close"]),f.prototype.transaction=function(){return new s(this._db.transaction.apply(this._db,arguments))},e(f,"_db",["name","version","objectStoreNames"]),n(f,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach(function(i){[a,o].forEach(function(e){i in e.prototype&&(e.prototype[i.replace("open","iterate")]=function(){var e,t=(e=arguments,Array.prototype.slice.call(e)),n=t[t.length-1],r=this._store||this._index,o=r[i].apply(r,t.slice(0,-1));o.onsuccess=function(){n(o.result)}})})}),[o,a].forEach(function(e){e.prototype.getAll||(e.prototype.getAll=function(e,n){var r=this,o=[];return new Promise(function(t){r.iterateCursor(e,function(e){e?(o.push(e.value),void 0===n||o.length!=n?e.continue():t(o)):t(o)})})})});var d={open:function(e,t,n){var r=i(indexedDB,"open",[e,t]),o=r.request;return o&&(o.onupgradeneeded=function(e){n&&n(new l(o.result,e.oldVersion,o.transaction))}),r.then(function(e){return new f(e)})},delete:function(e){return i(indexedDB,"deleteDatabase",[e])}};void 0!==v?(v.exports=d,v.exports.default=v.exports):self.idb=d}()},{}],2:[function(e,t,n){"use strict";var a=new(e("./currencyService").CurrencyService)("https://free.currencyconverterapi.com/api/v5");function r(e){return document.querySelector(e)||document.createElement("_")}function s(a){var s;document.querySelectorAll(".form-Select").forEach(function(e,t){var n=!0,r=!1,o=void 0;try{for(var i,c=a[Symbol.iterator]();!(n=(i=c.next()).done);n=!0){var u=i.value;s=1===t&&"XAF"===u.id||0===t&&"USD"===u.id,e.options[e.options.length]=new Option("".concat(u.id," - ").concat(u.currencyName),u.id,!1,s)}}catch(e){r=!0,o=e}finally{try{n||null==c.return||c.return()}finally{if(r)throw o}}})}function l(t,n,r){return a.getExchangeRate(t,n).then(function(e){return a.saveExchangeRate(e),r*e.val}).catch(function(e){return console.log(e.message),a.getExchangeRateFromDb("".concat(t,"_").concat(n)).then(function(e){if(void 0!==e)return r*e.val})})}function f(e){var t=r(".tst-ToastWrapper");t.classList.remove("tst-ToastWrapper-hidden"),t.querySelector(".tst-Toast_Button-refresh").addEventListener("click",function(){e.postMessage({action:"skipWaiting"})}),t.querySelector(".tst-Toast_Button-dismiss").addEventListener("click",function(){t.classList.add("tst-ToastWrapper-hidden")})}function d(e){e.addEventListener("statechange",function(){"installed"===e.state&&f(e)})}!function(e){if("function"==typeof e)"interactive"===document.readyState||"complete"===document.readyState?e():document.addEventListener("DOMContentLoaded",e,!1)}(function(){var e;navigator.serviceWorker&&(navigator.serviceWorker.register("sw.js").then(function(e){navigator.serviceWorker.controller&&(e.waiting?f(e.waiting):e.installing?d(e.installing):e.addEventListener("updatefound",function(){d(e.installing)}))}),navigator.serviceWorker.addEventListener("controllerchange",function(){e||(window.location.reload(),e=!0)}));var o=r(".form-Select-from"),i=r(".form-Select-to"),c=r(".form-Control-from"),u=r(".form-Control-to"),t=document.querySelectorAll(".btn-SwapButton");o.addEventListener("change",function(){l(o.value,i.value,c.value).then(function(e){u.value=e})}),i.addEventListener("change",function(){l(o.value,i.value,c.value).then(function(e){u.value=e})}),c.addEventListener("input",function(){l(o.value,i.value,c.value).then(function(e){u.value=e})}),u.addEventListener("input",function(){l(i.value,o.value,u.value).then(function(e){c.value=e})}),t.forEach(function(r){r.addEventListener("click",function(e){var t=i.value,n=o.value;r.blur(),o.value=t,i.value=n,l(o.value,i.value,c.value).then(function(e){u.value=e})})}),a.getCurrencies().then(function(e){var t=Object.values(e.results).sort(function(e,t){return e.id<t.id?-1:e.id>t.id?1:0});a.saveCurrencies(t),s(t),l(o.value,i.value,c.value).then(function(e){u.value=e})}).catch(function(e){console.log(e.message),a.getCurrenciesFromDb().then(function(e){void 0!==e&&(s(e),l(o.value,i.value,c.value).then(function(e){u.value=e}))})})})},{"./currencyService":3}],3:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.CurrencyService=void 0;var r,o=(r=e("idb"))&&r.__esModule?r:{default:r};function i(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var c=function(){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),this._apiUrl=e,this._exchangeRates=new Map,this._dbPromise=navigator.serviceWorker?o.default.open("currency-converter-db",1,function(e){switch(e.oldVersion){case 0:e.createObjectStore("currencies"),e.createObjectStore("exchange-rates")}}):Promise.resolve()}var e,n,r;return e=t,(n=[{key:"getCurrencies",value:function(){return fetch("".concat(this._apiUrl,"/currencies")).then(function(e){return e.json()})}},{key:"getExchangeRate",value:function(e,t){var n=this,r="".concat(e,"_").concat(t);return this._exchangeRates.has(r)?Promise.resolve(this._exchangeRates.get(r)):fetch("".concat(this._apiUrl,"/convert?q=").concat(r)).then(function(e){return e.json()}).then(function(e){return n._exchangeRates.set(r,e.results[r]),e.results[r]})}},{key:"saveCurrencies",value:function(t){return this._dbPromise.then(function(e){e.transaction("currencies","readwrite").objectStore("currencies").put(t,"currencies")})}},{key:"saveExchangeRate",value:function(t){return this._dbPromise.then(function(e){e.transaction("exchange-rates","readwrite").objectStore("exchange-rates").put(t,t.id)})}},{key:"getCurrenciesFromDb",value:function(){return this._dbPromise.then(function(e){return e.transaction("currencies").objectStore("currencies").get("currencies")})}},{key:"getExchangeRateFromDb",value:function(t){return this._dbPromise.then(function(e){return e.transaction("exchange-rates").objectStore("exchange-rates").get(t)})}}])&&i(e.prototype,n),r&&i(e,r),t}();n.CurrencyService=c},{idb:1}]},{},[2]);
//# sourceMappingURL=app.js.map
