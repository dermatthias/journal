# Journal: A simple personal journal  #

### Introduction
This is a simple Flask webapp to keep a daily journal, or whatever interval you like. 

This is inspired by the book ['59 seconds'](http://richardwiseman.wordpress.com/books/59-seconds-think-a-little-change-a-lot/) by Richard Wiseman and the blog 
post ['Keeping a journal'](http://zachholman.com/posts/keeping-a-journal/) by Zach Holman (@holman). 
They both emphasize the importance to keep a journal, both for remembering things, reliving memories 
and to keep you happy (read Richards book on happiness, really).


### Features
I wanted to make this really simple to write entries and to save the important metadata parts of an
journal entry (location, date and, on the TODO list, photos). 

So all you do is write your entry (markdown support here!), place a marker on the map and you are done.


### Setup
This is a [Flask](http://flask.pocoo.org/) app. SO basically all you need is to setup flask, install the dependencies (see below) and run 

 python journal.py
 
 
### Dependencies
Flask
Flask-SQLAlchemy
markdown2


### License
(The MIT License)

Copyright © 2014 Matthias Schneider

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the ‘Software’), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED ‘AS IS’, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



  
  