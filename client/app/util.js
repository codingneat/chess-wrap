function parsePgn(pgn) {
	pgn = pgn.replace(/(\r\n|\n|\r)/gm," ");
	pgn = pgn.replace(/ +(?= )/g,'');
	var array = pgn.split(']');
	var black = '';

	
	for(var i = 0;i<array.length;i++){
		array[i] = array[i].trim();
		if(array[i].substr(0,1)==='['){
			array[i] = array[i].substr(1,array[i].length-1);
		}
	}

	array[array.length-1] = array[array.length-1].replace(/{.+?}/g,function(c) {return c.replace(' ','||'); } );

	
	return {data:array,pgn:array[array.length-1]};

}

function parseData(data) {
	var first = data.indexOf('"');
	var last = data.lastIndexOf('"');

	return data.substring(first+1,last);

}

function layout(obj) {

	var array = obj.data;
	var pgn = obj.pgn.split(' ');
	var ob = {};


	for(var i = 0;i<array.length;i++){
		if(array[i].substr(0,6)==='White '){
			ob.white = parseData(array[i]);
		}
		if(array[i].substr(0,6)==='Black '){
			ob.black = parseData(array[i]);
		}
		if(array[i].substr(0,6)==='WhiteE'){
			ob.whiteElo = '('+parseData(array[i])+')';
		}
		if(array[i].substr(0,6)==='BlackE'){
			ob.blackElo = '('+parseData(array[i])+')';
		}
		if(array[i].substr(0,4)==='Site'){
			ob.site = parseData(array[i]);
		}
		if(array[i].substr(0,6)==='Event '){
			ob.event = parseData(array[i]);
		}
		if(array[i].substr(0,5)==='Round'){
			ob.round = 'ronda:'+parseData(array[i]);
		}
		if(array[i].substr(0,4)==='Date'){
			ob.date = parseData(array[i]);
		}
	}


	return ob;

}

