# Overload.js

**Pseudo-overloading in JavaScript**

JavaScript does not support method overloading. But using Overload.js, pseudo-overloading is available in JavaScript.

## Install

`npm install overload.js`

## Usage

`def` method defines a method that's called when appropriate parameters are assigned. `end` method returns a discriminator.

```js
var discriminator = overload.

  def([Number], function (num) {
    console.log('[Number]: ' + num);
  }).
  
end();
```

In the following example, the discriminator calls an appropriate method according to the arguments.

```js
discriminator(3);   // [Number]: 3
discriminator('3'); // Do not match with number
```

You can define multiple methods using method chaining.

```js
var discriminator = overload.

  def([String], function (str) {
    console.log('[String]: ' + str);  
  }).
  
  def([Boolean, Object], function (bool, obj) {
    console.log('[Boolean, Object]: ' + bool + ', ' + obj);
  }).
  
end();

discriminator('This is a string.');   // [String]: This is a string.
discriminator(true, { obj: 'obj' });  // [Boolean, Object]: true, [object Object]
```

If you'd like to get specific type of parameters, assign an appropriate constructor, but not an array, to `def` method.

```js
var discriminator = overload.

  def(String, function () {
    console.log('String: ', Array.prototype.slice.call(arguments).join(', '));
  }).
  
  def([Number, Number], String, function (){
    console.log('[Number, Number], String: ', Array.prototype.slice.call(arguments).join(', '));
  }).
  
end();

discriminator('string', 'string', 'string');  // String: string, string, string
discriminator(NaN, Infinity, 'str', 'str');  // [Number, Number], String: NaN, Infinity, str, str
```

Overload.js can detect specific class.

```js
function Class() {};
var instance = new Class();

var discriminator = overload.

  def([Class], function (ins) {
    console.log('[Class]: ' + ins);
  }).
  
end();

discriminator(instance);  // [Class]: [object Object]
```

`last` method defines a method that's called when any parameters are not matched.

```js
var discriminator = overload.

  def([Number], function () { /*...*/ }).
  
  last(function () {
    console.log('Any parameters are not matched.');
  }).
  
end();

discriminator('string');  // Any parameters are not matched.
```

## License

Applying MIT License.