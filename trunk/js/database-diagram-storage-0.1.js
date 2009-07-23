Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    return JSON.parse(this.getItem(key));
}

function save_position(obj)
{
	if(!window['localStorage'])
		return;
	
	var db = 'databaseName'
	var name = obj.id;
	var pos = $(obj).position();
	var storage = window['localStorage'];
	storage.setObject(db+'-'+name, pos);

	var p2 = localStorage.getObject(db+'-'+name);
	var x =1;
}

function load_position(obj)
{
	if(!window['localStorage'])
		return null;	// <-- only firefox has this, chrome and opera don't

	var db = 'databaseName'
	var name = obj.id;
	var storage = window['localStorage'];

	return storage.getObject(db+'-'+name);
}

// tables is a jQuery collection of DIVs
function load_positions(tables)
{
	$(tables).each(function(){
		var pos = load_position(this);
		if(pos!=null)
		{
			$(this).css({
				left: pos.left+"px",
				top: pos.top+"px"
				});
		}
	});
}