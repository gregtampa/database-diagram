function dbd(sql)
{
	var db = sqlparser.parse(sql);
	
	/**
	
	We are attemping to build something like this, but programatically:
	
		$("body").createPrepend(
			'div',
			{'class':'blk ui-widget-content', 'id':'clients'},
			[
				'h1', {'class':'ui-widget-header'}, 'Clients',
				'ul', {}, [
					'li', {'class':'key'}, 'id',
					'li', {}, 'name',
					'li', {}, 'contact_details',
					]
			]);
	
	**/
	
	
	for(var t in db.tables)
	{
		// set the DIV id to be the table name, so other tables can link to it
		// ui-widget-content is for jQuery UI
		var div_attributes = {'class':'blk ui-widget-content', 'id':db.tables[t].name};
		
		var list_items = new Array();
		for(var i in db.tables[t].columns)
		{
			var column = db.tables[t].columns[i];
			list_items.push('li');
			
			if(column.foreign_key)
				list_items.push({'rel': column.foreign_key});
			else
				list_items.push({});
			
			list_items.push(column.name);
		}
		
		$("body").createPrepend(
			'div', div_attributes,
			[
				// ui-widget-header is for jQuery UI
				'h1', {'class':'ui-widget-header'}, db.tables[t].name,
				'ul', {}, list_items
			]);
	}
	
	load_positions($(".blk"));
	updateCanvas($("#canvas"), $(".blk"));
	
	// jQuery make all the tables draggable
	$(".blk").draggable({
		handle: 'h1',
		stop: function() {
			updateCanvas($("#canvas"), $(".blk"));
			save_position(this);
			}
		});
			
}
