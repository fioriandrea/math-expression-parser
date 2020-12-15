# Math Expressions Parser

This is a simple recursive descent parser made in JavaScript.
It can parse simple math expressions like:

```
2^(5 + sin(20 + exp(2*(1 + 5))))
```

It also supports the use of variables.

## Usage examples

```js
const vars = {};
const expr = parse("x^2 + y^2", vars); //returns a function;

for(let i = 0; i < 20; i++) {
  vars.x = i;
  vars.y = i + 1;
  console.log(expr());
}

```
