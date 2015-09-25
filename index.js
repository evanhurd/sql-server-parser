var StackAssert = require('stack-assert');
var lexer = require('sql-parser/lib/lexer');

var SELECT = require('./syntax/Select.js');

var SA = new StackAssert();

var sql = "Select top 10000 test.test as 'columnName', test.test2 as 'anotherColumn', test.thirdColumn, forthColumn, * from tableName where 1= 2 and 3 =3 and 1*2 =1";
tokens = lexer.tokenize(sql);

console.log(tokens);

var stack = SA.newStack(tokens, function (stack, index){
  return stack[index][0];
});

SA.maybe('SELECT').then(SELECT).run(stack);






