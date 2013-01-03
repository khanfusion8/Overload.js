/**
 * Overload.js - Pseudo-overloading in JavaScript
 * 
 * @version   0.1.1
 * @author    Saneyuki Tadokoro <post@saneyuki.gfunction.com>
 * @preserve  Copyright 2012, 2013 Saneyuki Tadokoro
 * @license   MIT License
*/
/*global module*/
/*jslint indent: 2, node: true, plusplus: true*/

(function () {

  "use strict";
  
  /**
   * Checking if both objects have identity
   * @param obj1 (The first target object)
   * @param obj2 (The second target object)
   * @return {Boolean} (If both objects have identity, it returns true;
   *                   otherwise returns false)
  */
  function isMatch(obj1, obj2) {
    if (obj2 !== null && typeof obj2 === 'object' && (obj2.oType_all || obj2.oType_except || obj2.oType_match)) {
      var i, targets, result;
    
      if (obj2.oType_except && obj2.oType_except.length > 0) {
        targets = obj2.oType_except;
        
        for (i = 0; targets[i]; i++) {
          if (isMatch(obj1, targets[i])) {
            result = false;
            break;
          }
        }
      } else if (obj2.oType_match && obj2.oType_match.length > 0) {
        targets = obj2.oType_match;
        
        for (i = 0; targets[i]; i++) {
          if(isMatch(obj1, targets[i])) {
            break;
          }
        }
      }
      
      if (result !== false || obj2.oType_all === '*') {
        return true;
      }
      
      return false;
    }

    if ((typeof obj1 === 'undefined' && obj1 === obj2)
        || ((typeof obj1).match(/boolean|function|string|number/) && obj1.constructor === obj2)
        || (typeof obj2 === 'function' && obj1 instanceof obj2 && obj2 !== Object)
        || (typeof obj1 === 'object' && ((obj1 === null && obj1 === obj2)
        || (obj1 !== null && obj1.constructor === obj2)))) {
      return true;
    }
    
    // If neither of objects are matched, it returns false.
    return false;
  }
  

  var last, temp = [];

  module.exports = {
    
    /**
     * Returning a identifer that shows all parameter types.
     * @return {Object} (A identifer)
    */
    all: function () {
      return { oType_all: '*' };
    },
    
    
    /**
     * Returning a identifer that shows exceptional parameter types.
     * @param (Exceptinal parameter types)
     * @return {Object} (A identifer)
    */
    except: function () {
      return { oType_except: [].slice.call(arguments) };
    },
    
    
    /**
     * Returning a identifer that shows matching parameter types.
     * @param (Matching parameter types)
     * @return {Object} (A identifer)
    */
    match: function () {
      return { oType_match: [].slice.call(arguments) };
    },
    

    /**
     * Defining a method.
     * @param (First to second last parameters must be parameter types)
     * @param (Last parameter must be a function)
     * @return {Object} (overload object)
    */
    def: function () {
      var i, args, method, any, match, len = 0;
      
      args = [].slice.call(arguments);
      method = args.pop(); // Get last parameter
      
      // If last parameter is not a function or no types are defined, it returns
      // overload object.
      if (typeof method === 'function' || args.length > 0) {
        for (i = 0; i < args.length; i++) {
          if (args[i] instanceof Array) {
            match = args[i];
            len += match.length;
          } else {
            any = [args[i]];
            len += 1;
          }
        }
        
        temp.unshift(function () {
          if ((match && any && arguments.length < len)
              || (!match && any && arguments.length < len)
              || (match && !any && arguments.length !== len)) {
            return;
          }
          
          var ptr = 0, nptr = 0;
          
          while (ptr < arguments.length) {
            if (match && nptr < match.length) {
              while (nptr < match.length) {
                if (!isMatch(arguments[ptr++], match[nptr++])) {
                  return;
                }
              }
            } else if (any && !isMatch(arguments[ptr++], any[0])) {
              return;
            }
          }
          
          // If all parameters are matched, the descriminator returns a correct
          // method.
          return method;
        });
      }

      return this;
    },


    /**
     * Defining a last method. When there is no correct method, the last method
     * is called.
     * @param {Function} method (A last method)
     * @return {Object} (overload object)
    */
    last: function (method) {
      if (typeof method === 'function') {
        last = method;
      }

      return this;
    },


    /**
     * Finishing defining methods and returning a discriminator.
     * @return {Function}
    */
    end: function () {
      var methods = [], defaultMethod = last;
      
      while (temp.length > 0) {
        methods.push(temp.shift());
      }

      // Re-initialize temporary object.
      last = undefined;

      // This is a descriminator which chooses one of methods on the basis of
      // parameter types.
      return function () {
        var i, method;
        
        for (i = 0; methods[i]; i++) {
          method = methods[i].apply(null, arguments);
          
          if (method) {
            return method.apply(this, arguments);
          }
        }
        
        if (defaultMethod) {
          return defaultMethod.apply(this, arguments);
        }
      };
    }
  };

}());