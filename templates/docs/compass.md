# using Compass and Sass

## Manual setup of a new project

    compass create /path/to/project
    cd /path/to/project
    compass watch


Now you can edit the *.scss files in the sass directory with the text editor of your choice. the compass watch process will automatically compile your them into css in the stylesheets directory whenever they change. The files in the sass directory are yours and you can change them, delete them, add new ones, etc.


## Starting a project from scratch with blueprint

Execute this:

    compass create /path/to/project --using blueprint

which results the following output:

    $ compass create restapi --using blueprint
    directory restapi/ 
    directory restapi/images/ 
    directory restapi/sass/ 
    directory restapi/sass/partials/ 
    directory restapi/stylesheets/ 
       create restapi/config.rb 
       create restapi/sass/screen.scss 
       create restapi/sass/partials/_base.scss 
       create restapi/sass/print.scss 
       create restapi/sass/ie.scss 
       create restapi/images/grid.png 
       create restapi/stylesheets/screen.css 
       create restapi/stylesheets/print.css 
       create restapi/stylesheets/ie.css 

    *********************************************************************
    Congratulations! Your compass project has been created.

    You may now add and edit sass stylesheets in the sass subdirectory of your project.

    Sass files beginning with an underscore are called partials and won't be
    compiled to CSS, but they can be imported into other sass stylesheets.

    You can configure your project by editing the config.rb configuration file.

    You must compile your sass stylesheets into CSS when they change.
    This can be done in one of the following ways:
      1. To compile on demand:
         compass compile [path/to/project]
      2. To monitor your project for changes and automatically recompile:
         compass watch [path/to/project]

    More Resources:
      * Website: http://compass-style.org/
      * Sass: http://sass-lang.com
      * Community: http://groups.google.com/group/compass-users/


    Please see the blueprint website for documentation on how blueprint works:

        http://blueprintcss.org/

    Docs on the compass port of blueprint can be found on the wiki:

        http://wiki.github.com/chriseppstein/compass/blueprint-documentation

    To get started, edit the screen.sass file and read the comments and code there.

    To import your new stylesheets add the following lines of HTML (or equivalent) to your webpage:
    <head>
      <link href="/stylesheets/screen.css" media="screen, projection" rel="stylesheet" type="text/css" />
      <link href="/stylesheets/print.css" media="print" rel="stylesheet" type="text/css" />
      <!--[if lt IE 8]>
          <link href="/stylesheets/ie.css" media="screen, projection" rel="stylesheet" type="text/css" />
      <![endif]-->
    </head>