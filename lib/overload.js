/**
 * Overload.js - Pseudo-overloading in JavaScript
 * 
 * global overload, Number
 * 
 * @version   0.0.1
 * @author    Saneyuki Tadokoro <post@saneyuki.gfunction.com>
 * @preserve  Copyright 2012 Saneyuki Tadokoro
 * @license   MIT License
*/

var overload;

(function () {
  
  "use strict";
  
  /**
   * Cloning an array
   * @param {Array} array (Target array)
   * @return {Array} (Clone)
  */
  function _clone(object) {
    var i, clone;
    
    // If a expression with typeof keyword is used, it may returns 'object'.
    // That's why we should use instanceof keyword to check if a target object
    // is array exactly.
    if (object instanceof Array) {
      clone = [];
      
      // Not deep clone but simple.
      for (i = 0; object[i]; i++) {
        clone[i] = object[i];
      }
    }
    
    return clone;
  }
  
  
  /**
   * Checking if both objects have identity
   * @param obj1 (The first target object)
   * @param obj2 (The second target object)
   * @return {Boolean} (If both objects have identity, it returns true;
   *                   otherwise returns false)
  */
  function _isMatch(obj1, obj2) {
    
    if (typeof obj1 === 'undefined' && obj1 === obj2
        || typeof obj1 === 'boolean' && obj1.constructor === obj2
        || typeof obj1 === 'function' && obj1.constructor === obj2
        || typeof obj1 === 'string' && obj1.constructor === obj2
        || typeof obj1 === 'number' && obj1.constructor === obj2
        || typeof obj2 === 'function' && obj1 instanceof obj2 && obj2 !== Object
        || typeof obj1 === 'object' && (obj1 === null && obj1 === obj2
        || obj1 !== null && obj1.constructor === obj2)) {
      return true;
    }
    
    // If neither of objects are matched, it returns false.
    return false;
  }
  
  
  overload = {
    
    /**
     * Defining a method.
     * @param (First to second last parameters must be parameter types)
     * @param (Last parameter must be a function)
     * @return {Object} (overload object)
    */
    def: function () {
      var temp,
          args = [].slice.call(arguments),
          method = args.pop(); // Get last parameter
          
      // If last parameter is not a function or no types are defined, it returns
      // overload object.
      if (typeof method !== 'function' || args.length <= 0) {
        return this;
      }
      
      temp = this._temp || (this._temp = []);
      // Add parameter types and a method temporarily.    
      temp.push({ types: args, method: method });
      
      return this;
    },
    
    
    /**
     * Defining a last method. When there is no correct method, the last method
     * is called.
     * @param {Function} method (A last method)
     * @return {Object} (overload object)
    */
    last: function (method) {
      if (typeof method !== 'function') {
        return this;
      }
      
      this._temp.push({ last: method });
      
      return this;
    },
    
    
    /**
     * Finishing defining methods and returning a discriminator.
     * @return {Function}
    */
    end: function () {
      // Clone temporary object to use in a discriminator.
      var i, last, clone = _clone(this._temp);
      
      for (i = 0; clone[i]; i++) {
        if (clone[i].last) {
          last = clone.splice(i, 1)[0].last;
        }
      }
      
      // Delete temporary object.
      delete this._temp;
      
      // This is a descriminator which chooses one of methods on the basis of
      // parameter types.
      return function () {
        var i, j, match, candidate, type, types, ptr, nptr;
        
        for (i = 0; clone[i]; i++) {
          candidate = clone[i];
          types = candidate.types;
          
          for (ptr = nptr = 0; ptr < arguments.length;) {
            type = types[nptr];
            
            if (type instanceof Array) {
              nptr++;
              
              for (j = 0; j < type.length; j++) {
                if (!_isMatch(arguments[ptr++], type[j])) {
                  match = false;
                  break;
                }
              }
            } else {
              if (!_isMatch(arguments[ptr++], type)) {
                match = false;
              }
            }
            
            // Stop comparing if no match parameter exist.
            if (match === false) {
              break;
            }
          }
          
          // If all parameters are matched, the descriminator call a correct
          // method with assigning them.
          if (match !== false) {
            return candidate.method.apply(this, arguments);
          } else {
            match = undefined;
          }
        }
        
        if (last) {
          return last.apply(this, arguments);
        }
      };
    }
  };
  
}());

module.exports = overload;