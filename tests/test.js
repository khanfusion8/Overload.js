/*global overload, console, require*/

var overload = require('overload.js');

(function () {
  
  "use strict";
  
  function Class() {}
  
  var func, cls = new Class(), log = console.log;
  
  
  func = overload.
  
    // null nul
    def([null], function (nul) {
      log('[null]: ' + nul);
    }).
    
    // undefined und
    def([undefined], function (und) {
      log('[undefined]: ' + und);
    }).
    
    // Function func
    def([Function], function (func) {
      log('[Function]: ' + func);
    }).
    
    // Boolean bool
    def([Boolean], function (bool) {
      log('[Boolean]: ' + bool);
    }).
    
    // String str
    def([String], function (str) {
      log('[String]: ' + str);
    }).
    
    // Number num
    def([Number], function (num) {
      log('[Number]: ' + num);
    }).
    
    // Object obj
    def([Object], function (obj) {
      log('[Object]: ' + obj);
    }).
    
    def([Array], function (ary) {
      log('[Array]: ' + ary);
    }).
    
    // Class cls
    def([Class], function (cls) {
      log('[Class]: ' + cls);
    }).
    
    // Number num, String str, Function func
    def([Number, String, Function], function (num, str, func) {
      log('[Number, String, Function]: ' + [num, str, func].join(', '));
    }).
    
    // String str1, String str2...
    def(String, function () {
      log('String: ' + Array.prototype.slice.call(arguments).join(', '));
    }).
    
    // Boolean bool, Number num, String str1, String str2...
    def([Boolean, Number], String, function () {
      log('[Boolean, Number], String: ', Array.prototype.slice.call(arguments).join(', '));
    }).
    
    last(function () {
      console.log('Any parameters are not matched: '
      + Array.prototype.slice.call(arguments).join(', '));
    }).
    
  end();
  
  
  func(null);
  func(undefined);
  func(NaN);
  func(Infinity);
  func(function () {});
  func(true);
  func('STR');
  func(1);
  func({});
  func(['elem']);
  func(cls);
  func(1, '', function () {});
  func('STR', 'STR', 'STR', 'STR');
  func(true, 1, 'STR', 'STR', 'STR');
  func(1, 1, 1);
  
}());