var StackAssert = require('stack-assert');
var SA = new StackAssert();

module.exports = function(items, stack){
	var query = {
		top: "",
		columns : [],
		from : "",
		joins : []
	};

	SA.expect([
		  SA.maybe("TOP+!NUMBER").then(SelectTop.bind(null,query))
	
		, SA.expect([
			  SA.maybe('LITERAL+DOT+LITERAL+AS+!STRING').then(AddColumn.bind(null,query))
			, SA.maybe('LITERAL+DOT+LITERAL').then(AddColumn.bind(null,query))
			, SA.maybe('LITERAL+DOT+!STAR').then(AddColumn.bind(null,query))
			, SA.maybe('LITERAL').then(AddColumn.bind(null,query))
			, SA.maybe('STAR').then(AddColumn.bind(null,query))
		  ])
		, SA.maybe('SEPARATOR').goto(1)
		, SA.expect('FROM').then(FROM.bind(null,query))
		, SA.while([
			  SA.maybe('LEFT+OUTER+!JOIN').then(test)
			, SA.maybe('OUTER+CROSS+!APPLY').then(test)
			, SA.maybe('OUTER+!JOIN').then(test)
			, SA.maybe('INNER+!JOIN').then(test)
			, SA.maybe('CROSS+!APPLY').then(test)
			, SA.maybe('APPLY').then(test)
		  ])
		, SA.maybe('GROUP+!BY').then(test)
		, SA.maybe('ORDER+!BY').then(test)
		, SA.maybe('HAVING').then(test)
	]).run(stack);
	console.log(query);
	return query;
}

function test(){}

function FROM(query, items, stack){
	SA.expect([
		SA.maybe('LITERAL').then(function(query, items, stack){
			query.from = items[0][1];
		}.bind(null, query))

	]).run(stack);
}

function SelectTop(query, items, stack){
	query.top = items[1][1];
}

function AddColumn(query, items, stack){
	if(items.length == 5 ){
		query.columns.push({
			table : items[0][1],
			column : items[2][1],
			ident : items[4][1]
		});
	}

	if(items.length == 3 ){
		query.columns.push({
			table : items[0][1],
			column : items[2][1]
		});
	}

	if(items.length == 1){
		query.columns.push({
			table : null,
			column : items[0][1]
		});
	}
}

/*

{
	type:"statement",
	statement: []
}

{
	type:"expression",
	expression:{}
}

{
	type:"conditional",
	left:{},
	right:{},
	conditional:""
}

{
	type:"select",
	start: 0,
	length:0,
	columns : [],
	tables : [],
	joins : [],
	condition: {},
	order : [],
	group : []
}

{
	type:"SelectColumnIdentifier",
	expression:{},
	label:''
}

{
	type:"SelectTableIdentifier",
	expression:{},
	label:''
}

{
	type:"SelectJoinIdentifier",
	expression:{},
	label:''
}

{
	type:"entity",
	name:"",
	value:""
}

*/