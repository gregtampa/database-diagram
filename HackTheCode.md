# Hacking the code: How to bend it to your will. #

The SQL is parsed using regex and pattern matching. It is all very simple. To add more foreign key matching patterns take a look at **column->find\_foreign\_key()**

The x, y locations of the tables are stored in your localStorage (HTML5) in your browser. They are saved as **databaseName-tableName** so the app will remember the locations of your tables for any number of different SQL dump scripts. I used localStorage because:

  * It is cool, quick and useful.
  * We need to save these locations somewhere.
  * It is local to your machine. As much as I love you dearly, I don't want my server filled with your meaningless x, y table locations.
  * It is local to your machine. As much as you love me dearly, you don't trust me with your super secret database name, table names and x, y locations. Good God man! May I suggest that you save a copy of the app locally on your machine, then pull the ethernet cable out of the back of the machine just to make sure. You sexy paranoid fox!