Introduction
I wanted a simple tool that I could dump my database structure into and it would show me a diagram.

When I change the database, I could have a visual history of the changes.


How to use it:
Find your database and export as SQL dump. Structure only.
Paste this SQL into the box
Click go! (this may take a while)
More control:
Find your database and export as SQL dump. Structure only.
Trim the SQL to only show tables you are interested in.
Paste this SQL into the box
Click go! (this may take a while)
Prototypes:
Remember the good old days when databases were called Databases and required Big Iron machines to run on? No? Nor me.

Treat databases like interesting files, just make a new one called 'test_dbd' add some tables that may relate to your application (e.g. [staff, customers, orders, items] or [blog_posts, comments, authors, tags]) add primary and foreign keys. Now throw this into database-diagram and take a look.

Version history
Every time you change your database, keep a copy of the structure dump somewhere. Now you can view each step in the evolution of your DB.


How it works:
Step 1. Parse the SQL, the parser isn't really a parser, it does the minimal amount necessary. This step outputs some JSON that can be interpreted by jquery.flydom-3.1.1.js
Step 2. Take the JSON and makes the HTML elements that show the tables.
Step 3. Iterates over the DIVs in the page and uses the rel attribute to draw an arrow from a foreign key (LI) to a table (DIV)
Why:
Jumbling all 3 steps into one would be slightly more efficient for the PC. Who cares about the PC? lolz

The 3 steps are 3 processes, it would be simple to remove the last process and drop it into a mindmap application, or a flowchart app.

How does it find a foreign key?
MySQL: InnoDB
Reads the CONSTRAINT <name> FOREIGN KEY (<column name>) REFERENCES <table> (<column name>) and figures it out.

MySQL: MyISAM
DB syntax naming

MyISAM does not support foreign keys (foreign key constraints are enforced through code) but we can figure out the FKs through naming conventions.

I name my foreign keys fk_table_name this links to a table whose primary key I always call id. Any column names that start or end it assumes are foreign keys:

Starts with fk_, e.g. fk_table_name
Ends with _fk, e.g. table_name_fk
Has dbd:fk-to:table_name in the column COMMENT. 'dbd' is short for database-diagram.
Example: A table called blog_posts with columns id, fk_author, post. In the diagram fk_author will join to the authors table.

I name a table of clients 'clients', but a table that has a foreign key to the clients table is fk_client (we are linking to a single client), note the missing s. There is a little hack in the code to take this pluralization into account.

Another problem that I have in my tables it that I have a foreign key with a name that has no relation to the table name. For example I have a projects table that has a manager (fk_manager), a sales manager (fk_sales_manager) and a project owner (fk_staff). These are all members of staff, so they all link to the staff table. You can mark these columns to link to the staff table by adding this text to the columns COMMENT attribute:

dbd:fk-to:table_name
This is easy to do:

in SQLyog - right click on the table, alter table, then add the text into the COMMENT section.
in phpMyAdmin - select table, structure, change, add the text into the COMMENT section.
Download and install database-diagram.
Install database-diagram
To install database-diagram you will also need:

jQuery 1.3.2
flydom 3.1.1
jQuery UI 1.7.2 (lightness)
Once you have downloaded database-diagram, your final directory structure will look like this:

index.html

js/
  jquery.flydom-3.1.1.js
  jquery-1.3.2.min.js
  jquery-ui-1.7.2.custom.min.js

css/
  database-diagram-0.1.css

css/ui-lightness/
  jquery-ui-1.7.2.custom.css

css/ui-lightness/images
  (lots of images)

Hacking the code: How to bend it to your will.
The SQL is parsed using regex and pattern matching. It is all very simple. To add more foreign key matching patterns take a look at column->find_foreign_key()

The x, y locations of the tables are stored in your localStorage (HTML5) in your browser. They are saved as databaseName-tableName so the app will remember the locations of your tables for any number of different SQL dump scripts. I used localStorage because:

It is cool, quick and useful.
We need to save these locations somewhere.
It is local to your machine. As much as I love you dearly, I don't want my server filled with your meaningless x, y table locations.
It is local to your machine. As much as you love me dearly, you don't trust me with your super secret database name, table names and x, y locations. Good God man! May I suggest that you save a copy of the app locally on your machine, then pull the ethernet cable out of the back of the machine just to make sure. You sexy paranoid fox!

links that I found useful.
These are various sites that helped
flydom for jQuery http://dohpaz.com/flydom/
jquery and canvas, use canvas to draw arrows between div tags. http://stackoverflow.com/questions/1104295/jquery-use-canvas-to-draw-lines-between-divs
How to draw nice arrows. http://www.things.org.uk/examples/arrowtest.html
JS Visualization looks cool, but I never used it. http://thejit.org/
localstorage api. http://hacks.mozilla.org/2009/06/localstorage/
MySQL innodb and myisam shoot out. http://www.mysqlperformanceblog.com/2007/01/08/innodb-vs-myisam-vs-falcon-benchmarks-part-1/
Test sql I found. https://svn.apache.org/repos/asf/incubator/olio/webapp/java/trunk/etc/schema.sql

Warning: MySQL 5.0+ only
Currently database-diagram only works with MySQL 5 dumps - structure only. MyISAM and InnoDB.

This is only because I don't have access to any other flavour of SQL. Feel free to post your SQL into the bug tracker :)

Warning: Browser with canvas only
Works in Firefox 3.5, Opera 9.64 and Chrome 2

Warning: Save diagram is Firefox 3.5 only
Database-diagram uses the localStorage which is Firefox 3.5 only. This saves the x, y locations of the tables.
