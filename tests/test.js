/*global overload, console, assert, describe, it*/
/*jslint indent: 2, node: true*/

var overload = require('../lib/overload.js'),
  assert = require('assert');

(function () {

  "use strict";

  var log = console.log;

  describe('Overload.js', function () {
    describe('Type Matching', function () {

      var func = overload.

        // null nul
        def([null], function (nul) {
          log('[null]: ' + nul);
          return '[null]';
        }).

        // undefined und
        def([undefined], function (und) {
          log('[undefined]: ' + und);
          return '[undefined]';
        }).

        // Function func
        def([Function], function (func) {
          log('[Function]: ' + func);
          return '[Function]';
        }).

        // Boolean bool
        def([Boolean], function (bool) {
          log('[Boolean]: ' + bool);
          return '[Boolean]';
        }).

        // String str
        def([String], function (str) {
          log('[String]: ' + str);
          return '[String]';
        }).

        // Number num
        def([Number], function (num) {
          log('[Number]: ' + num);
          return '[Number]';
        }).

        // Object obj
        def([Object], function (obj) {
          log('[Object]: ' + obj);
          return '[Object]';
        }).

        // Array ary
        def([Array], function (ary) {
          log('[Array]: ' + ary);
          return '[Array]';
        }).

        end();

      it('should match with null', function () {
        assert(func(null), '[null]');
      });

      it('should match with undefined', function () {
        assert(func(undefined), '[undefined]');
      });

      it('should match with Function', function () {
        assert(func(function () {}), '[Function]');
      });

      it('should match with Boolean', function () {
        assert(func(true), '[Boolean]');
      });

      it('should match with String', function () {
        assert(func('This is a string'), '[String]');
      });

      it('should match with Number', function () {
        assert(func(1), '[Number]');
      });

      it('should match with Object', function () {
        assert(func({}), '[Object]');
      });

      it('should match with Array', function () {
        assert(func(['Array']), '[Array]');
      });
    });


    describe('Class Matching', function () {

      function Class() {}
      var func, instance = new Class();

      // Class ins
      func = overload.def([Class], function (ins) {
        log('[Class]: ' + ins);
        return '[Class]';
      }).end();

      it('should match with Class', function () {
        assert(func(instance), '[Class]');
      });
    });


    describe('Multiple Parameters', function () {

      // Number num, String, str, Function func
      var func = overload.def([Number, String, Function], function (num, str, func) {
        log('[Number, String, Function]: ' + [num, str, func].join(', '));
        return '[Number, String, Function';
      }).end();

      it('should match with Number, String and Function', function () {
        assert(func(1, '', function () {}), '[Number, String, Function]');
      });
    });


    describe('Specific Type of Parameters', function () {

      var func = overload.

        // String str1, String str2...
        def(String, function () {
          log('String: ' + Array.prototype.slice.call(arguments).join(', '));
          return 'String';
        }).

        // Boolean bool, Number num, String str1, String str2...
        def([Boolean, Number], String, function () {
          log('[Boolean, Number], String: ', Array.prototype.slice.call(arguments).join(', '));
          return '[Boolean, Number], String';
        }).

        end();

      it('should match with single or multiple String', function () {
        assert(func('str', 'str', 'str'), 'String');
      });

      it('should match with Boolean, Number and single or multiple String', function () {
        assert(func(true, 1, 'str', 'str'), '[Boolean, Number], String');
      });
    });


    describe('Default', function () {

      var func = overload.

        // Number num
        def([Number], function (num) {
          log('[Number]: ' + num);
          return '[Number]';
        }).

        last(function () {
          log('Any parameters are not matched: ', Array.prototype.slice.call(arguments).join(', '));
          return 'not';
        }).

        end();

      it('should match with Number', function () {
        assert(func(1), '[Number]');
      });

      it('should not match with any parameters', function () {
        assert(func('str'), 'not');
      });
    });
    
    
    describe('All Type of A Parameter', function () {
      
      var func = overload.
      
        // Boolean bool, * all
        def([Boolean, overload.all()], function (bool, all) {
          log('[Boolean, *]: ' + bool + ', ' + all);
          return '[Boolean, *]';
        }).
        
        // This function is never called
        def([Boolean, Number], function (bool, num) {
          log('[Boolean, Number]: ' + bool + ', ' + num);
          return '[Boolean, Number]';
        }).
        
        end();
        
      it('should match with all type', function () {
        assert(func(true, 'str'), '[Boolean, *]');
        assert(func(true, 9), '[Boolean, *]');
      });
    });
    
    
    describe('Matching With All Except Specific Types', function () {
      
      var func = overload.
      
        // String str, ^(Function, Number) value
        def([String, overload.except(Function, Number)], function (str, value) {
          log('[String, ^(Function, Number)]: ' + str + ', ' + value);
          return '[String, ^(Function, Number)]';
        }).
        
        end();
        
      it('should match with all except Function and Number', function () {
        assert(func('str', true), '[String, ^(Function, Number)]');
      });
    });
    
    
    describe('Matching With Some Specific Types', function () {
      
      var func = overload.
      
        // (String, Function) value
        def([overload.match(String, Function)], function (value) {
          log('[(String, Function)]: ' + value);
          return '[(String, Function)]';
        }).
        
        end();
        
      it('should match with String or Function', function () {
        assert(func('str'), '[(String, Function)]');
        assert(func(function () {}), '[(String, Function)]');
      });
    });
  });

}());