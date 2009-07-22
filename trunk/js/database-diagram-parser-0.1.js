var sqlparser = {

	parse: function(sql){

		var db = new database();
		db.parse(sql);
		return db;
	},
};

function database() {
	this.name = '';
	this.tables = [];
	
	this.parse = function(sql){
		
		this.name = this.get_db_name(sql);
		
		// split the SQL into the table definitions:
		// NOTE: the g asks for all matches
		var pattern = /CREATE TABLE([^;]*?);/g
		var match;
		while (match = pattern.exec(sql)) {
		
			var t = new table();
			t.parse(match[1]);
			this.tables[t.name] = t;
		}
		
		//
		// MySQL: MyISAM foreign keys use pattern matching
		//
		var t_names = this.get_table_names();
		for(var t in this.tables)
			this.tables[t].find_foreign_key(this.tables);
		
		//
		// MySQL: INNODB FKs look up the FK definition
		//
		for(var t in this.tables)
			this.tables[t].find_fks();
		
	}
	
	this.get_table_names = function(){
	
		var table_names = new Array();
		for(var name in this.tables)
			table_names.push(name);
		
		return table_names;
	}
	
	this.get_db_name = function(sql){
	
		var myregexp = /CREATE TABLE `([^`]*)`/;
		var match = myregexp.exec(sql);
		if (match != null && match.length > 1)
			return match[1];
		else
			return '';
	}
};

function table() {

	this.name = '';
	this.width = 0;
	this.height = 60;
	this.columns = Array();
	this.internals = [];
	
	this.parse = function(sql) {
		this.name = this.get_name(sql);
		this.internals = this.get_internals(sql);
		this.columns = this.parse_columns(this.internals);
	}
	
	this.find_foreign_key = function(tables) {
		for(var i in this.columns)
			this.columns[i].find_foreign_key(tables);
	}
	
	this.get_name = function(sql){
		// look for `table_name`
		var matches = sql.match(/[^`]*`([^`]*)`/);
		return matches[1];
	}
	
	this.get_internals = function(sql){
	
		// get everything between the brackets
		//   `table_name` ( **columns + other stuff** ) ENGINE=...
		//
		// fucking dot does NOT match newlines, so this regex
		// hacks around that: (?:.|[\n\r])  get . or \n or \r
		//
		var matches = sql.match(/` \(((?:.|[\n\r])*)\) ENGINE/);
		var inner_sql = matches[1];
		
		// now split on the new line this seperates the table
		// definitions. COMMENTs may have commas in, but not newlines
		return inner_sql.split("\n");
	}
	
	this.parse_columns = function(parts){
	
		var columns = Array();
		
		//
		// Which SQL definitions contain column info,
		// match: space, space, backtick, column name, backtick. E.g:
		//   `column_name`
		// but skips the PRIMARY KEY etc.
		//
		var pattern = /  `[^`]*` /;
		for(var i=0; i<parts.length; i++){
			var matches = parts[i].match(pattern);
			if(matches)
			{
				var c = new column();
				c.parse(parts[i]);
				columns[c.name] = c;
			}
		}
		return columns;
	}
	
	this.find_fks = function(){

		//
		// MySQL InnoDB FK. Look for this:
		//   CONSTRAINT `FK_clients` FOREIGN KEY (`manager_id`) REFERENCES `staff` (`id`)
		// we want the text manager_id and staff
		//
		var pattern = /FOREIGN KEY \(`([^`]*)`\) REFERENCES `([^`]*)`/;
		for(var i=0; i<this.internals.length; i++){
			var matches = this.internals[i].match(pattern);
			if(matches)
			{
				var from_column = matches[1];
				var to_table = matches[2];
				var col = this.columns[from_column];
				col.links_to(to_table);
			}
		}
	}
};

function column() {
	this.name = '';
	this.sql = '';
	this.foreign_key = false;
	
	this.parse = function (sql){
		//
		// match some whitespace then a `
		// matches:
		//   `column_name`
		//
		var pattern = /[\s]`([^`]*)/;
		var matches = sql.match(pattern);
		if(matches)
			this.name = matches[1];
			
		this.sql = sql;
	}
	
	this.links_to = function(table_name) {
		this.foreign_key = table_name;
	}
	
	this.find_foreign_key = function(tables) {
	
		var tmp = this.find_foreign_key_in_comment();
		if(tmp!=null)
		{
			this.foreign_key = tmp;
			return;
		}
		
		// MySQL MyISAM (no proper FK) just use pattern matching
		// on the column names
		var attributes = {};
		var regexps = new Array(
			// LOOK FOR fk_table_name
			/fk_([a-zA-Z0-9_]*)/,
			// LOOK FOR table_name_fk
			/([a-zA-Z0-9_]*)_fk/
			);
	
		for(var i in regexps)
		{
			var myregexp = regexps[i];
			var match = myregexp.exec(this.name);
			// is this column is a foreign key
			if(match != null && match.length > 1)
			{
				
				var tmp = this.find_table(tables, match[1]);
				if(tmp.found)
					this.foreign_key = tmp.name;
			
				// fk_project links to table projects
				var tmp = this.find_table(tables, match[1]+'s');
				if(tmp.found)
					this.foreign_key = tmp.name;
				
			}
		}
	}
	
	this.find_foreign_key_in_comment = function()
	{
		//
		// we look in the column comments to see if this
		// column is really a FK pointing somewhere
		//
		// This regex grabs everything in the comments:
		//   `fk_project_manager` int(11) default NULL COMMENT 'john o''pegg '' woo''oo dbd:fk-to:staff',
		//
		var myregexp = /COMMENT '([^']*(?:''[^']*)*)'/;
		var match = myregexp.exec(this.sql);
		if (match != null && match.length > 1) {
			
			// now look for dbd:fk-to:<table name>
			var myregexp = /dbd:fk-to:([^' ]*)/;
			var match = myregexp.exec(match[1]);
			if (match != null && match.length > 1) {
				// return the table this column points at
				return match[1];
			}
		}
		
		return null;
	}
	
	this.find_table = function(tables, name)
	{
		for(var i in tables)
		{
			if(tables[i].name == name)
				return {found: true, name: tables[i].name};
		}
		
		return {found: false};
	}
};