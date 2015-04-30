# Introduction #

I wanted a simple tool that I could dump my database structure into and it would show me a diagram.

When I change the database, I could have a visual history of the changes.

# Demo site #

  * [Example database](http://teethgrinder.co.uk/database-diagram/test-MySQL-MyISAM.html)
  * Paste your [SQL structure](http://teethgrinder.co.uk/database-diagram/) into this page.

# Next #

  * [How to use it](HowToUseIt.md).
  * [How it works](HowItWorks.md).
  * Download and [install](Install.md) database-diagram.
  * [Hack the code](HackTheCode.md), more details on implementation.

  * [links](Links.md) that I found useful.

## Forum ##

Get help, post ideas, bugs, patches or mashups here:

[database-diagram forum](http://n2.nabble.com/database-diagram-f3333903.html)

## Warning: MySQL 5.0+ only ##

Currently database-diagram only works with MySQL 5 dumps - structure only. MyISAM and InnoDB.

This is only because I don't have access to any other flavour of SQL. Feel free to post your SQL into the bug tracker :)

## Warning: Browser with canvas only ##

Works in Firefox 3.5, Opera 9.64 and Chrome 2

## Warning: Save diagram is Firefox 3.5 only ##

Database-diagram uses the localStorage which is Firefox 3.5 only. This saves the x, y locations of the tables.