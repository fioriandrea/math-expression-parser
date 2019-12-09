/*
BNF grammar:

addExpr -> mulExpr | mulExpr + mulExpr | mulExpr - mulExpr
mulExpr -> term | term * mulExpr | term / mulExpr
term -> num | functionName(addExpr) | term ^ term | (addExpr) | var

Lexicon:

num -> [0-9]+(\.[0-9]+)?
functionName -> [A-Za-z]+
var -> [A-Za-z]\w*
*/

function parse(str, vars) {
  vars = {
    ...vars,
    'pi': Math.PI,
    'e': Math.E,
  };
  const error = "Syntax Error";
  let phrase = str.split(/\s+/).join(''); // removes spaces
  if(/[-\+]/.test(phrase[0])) phrase = '0' + phrase; // leading + or -
  const functions = {
    "sin": x => Math.sin(x),
    "cos": x => Math.cos(x),
    "sqrt": x => Math.sqrt(x),
    "floor": x => Math.floor(x),
    "ceil": x => Math.ceil(x),
    "tan": x => Math.tan(x),
    "atan": x => Math.atan(x),
  };

  let scan = 0;
  const result = parse_add();

  if(scan < phrase.length) return error;
  else return result;

  function parse_add() {
    let mulExpr = parse_mul();
    if(mulExpr === error) return error;

    if(eat('+')) {
      let addExpr = parse_add();
      if(addExpr === error) return error;
      else mulExpr += addExpr;
    }
    else if(eat('-')) {
      let addExpr = parse_add();
      if(addExpr === error) return error;
      else mulExpr -= addExpr;
    }

    return mulExpr;
  }

  function parse_mul() {
    let term = parse_term();
    if(term === error) return error;

    if(eat('*')) {
      let mulExpr = parse_mul();
      if(mulExpr === error) return error;
      else term *= mulExpr;
    }
    else if(eat('/')) {
      let mulExpr = parse_mul();
      if(mulExpr === error) return error;
      else term /= mulExpr;
    }

    return term;
  }

  function parse_term() {
    let term;
    let value;

    if((value = checkNum())) { //number
      term = parseFloat(value);
    }
    else if((value = checkFunctionName())) { //function
      term = parse_function(value);
    }
    else if((value = checkVarName())) { //variable
      term = parse_var(value);
    }
    else if(eat('(')) { //(expression)
      term = parse_add();
      if(term === error) return error;
      if(!eat(')')) return error;
    }
    else return error; //none of the above

    if(term === error) return error;

    if(eat('^')) { //exponentiation
      let exponent = parse_term();
      if(exponent === error) return error;
      term = term**exponent;
    }

    return term;
  }

  function parse_function(functionName) {
    if(!eat('(')) return error;
    let args = parse_add();
    if(args === error) return error;
    if(!eat(')')) return error;
    return functions[functionName](args);
  }

  function parse_var(value) {
    if(!vars[value]) return error;
    return vars[value];
  }

  function checkFunctionName() {
    let index = scan;
    let fname = '';

    while(/^([a-z])$/i.test(phrase[index])) fname += phrase[index++];

    if(functions[fname]) {
      scan = index;
      return fname;
    }
    else return false;
  }

  function checkVarName() {
    let index = scan;
    let varName = '';

    while(/^(\w)$/i.test(phrase[index])) varName += phrase[index++];

    if(/^([A-Za-z]\w*)$/.test(varName) && !functions[varName]) {
      scan = index;
      return varName;
    }
    else return false;
  }

  function checkNum() {
    let index = scan;
    let num = '';

    while(/^([\.0-9])$/.test(phrase[index])) num += phrase[index++];

    if(/^([0-9]+(\.[0-9]+)?)$/.test(num)) {
      scan = index;
      return num;
    }
    else return false;
  }

  function eat(ch) {
    if(ch === phrase[scan]) {
      scan++;
      return true;
    }
    else return false;
  }
}
