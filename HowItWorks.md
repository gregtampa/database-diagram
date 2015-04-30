# How it works: #

  * Step 1. Parse the SQL, the parser isn't really a parser, it does the minimal amount necessary. This step outputs some JSON that can be interpreted by jquery.flydom-3.1.1.js
  * Step 2. Take the JSON and makes the HTML elements that show the tables.
  * Step 3. Iterates over the DIVs in the page and uses the rel attribute to draw an arrow from a foreign key (LI) to a table (DIV)

# Why: #

Jumbling all 3 steps into one would be slightly more efficient for the PC. Who cares about the PC? lolz

The 3 steps are 3 processes, it would be simple to remove the last process and drop it into a mindmap application, or a flowchart app.

# How does it find a foreign key? #

## MySQL: InnoDB ##

Reads the **`CONSTRAINT <name> FOREIGN KEY (<column name>) REFERENCES <table> (<column name>)`** and figures it out.

## MySQL: MyISAM ##

[DB syntax naming](http://www.ss64.com/ora/syntax-naming.html)

MyISAM does not support foreign keys (foreign key constraints are enforced through code) but we can figure out the FKs through naming conventions.

I name my foreign keys **fk\_table\_name** this links to a table whose primary key I always call id. Any column names that start or end it assumes are foreign keys:

  * Starts with **`fk_`**, e.g. **`fk_table_name`**
  * Ends with **`_fk`**, e.g. **`table_name_fk`**
  * Has **`dbd:fk-to:table_name`** in the column COMMENT. 'dbd' is short for database-diagram.

Example: A table called blog\_posts with columns `id, fk_author, post`. In the diagram `fk_author` will join to the authors table.

I name a table of clients 'clients', but a table that has a foreign key to the clients table is **fk\_client** (we are linking to a single client), note the missing **s**. There is a little hack in the code to take this pluralization into account.

Another problem that I have in my tables it that I have a foreign key with a name that has no relation to the table name. For example I have a projects table that has a manager (**fk\_manager**), a sales manager (**fk\_sales\_manager**) and a project owner (**fk\_staff**). These are all members of staff, so they all link to the staff table. You can mark these columns to link to the staff table by adding this text to the columns COMMENT attribute:

  * dbd:fk-to:table\_name

This is easy to do:

  * in SQLyog - right click on the table, alter table, then add the text into the COMMENT section.
  * in phpMyAdmin - select table, structure, change, add the text into the COMMENT section.