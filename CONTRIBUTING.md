# Contributor's Guide

Hi! Thank you for your interest in contributing to my project, Media Center. This guide will explain how to setup a working development instance and give you a decent understanding of how (and what) to contribute to Media Center.  

## What to contribute
Firstly, it's preferable you look over the task list in [mediacenter.org](mediacenter.org) (please view this file preferably in org-mode or a normal text editor) and find something you're interested in contributing to. The details are usually vague, so if you want to have the details explained to you, [I can be reached on IRC](http://dailyprog.org/chat/).  

You should ask yourself if you are more competent in "frontend" tasks (layout, styles; anything in JavaScript or HTML+CSS) or "backend" tasks (feature implementations, unit tests, APIs; anything in Python). Then you should determine something that you would like to improve or implement on either and run it by me if it isn't already a task.  
Obviously you can begin on anything you want straight away in a fork of this repository, but I'd be happy to hear what you have in mind first.  

## How to contribute
### Setting up a working local instance
To start, you will need to install [Python 3](https://www.python.org/), [virtualenv](https://virtualenv.pypa.io/en/stable/), [Postgres](https://www.postgresql.org/), and [npm](https://www.npmjs.com/). Instructions for installing these is outside of the scope of this tutorial. Media Center is only tested to function on Linux. All of these packages can be safely installed from your package manager, except perhaps npm, because you will need at least version 5.x. Postgres must also be at least version 5.4.  

Once you have all of that installed, here's how to setup Media Center:
```bash
> git clone git@github.com:kennymalac/mediacenter.git
> cd mediacenter
# setup virtualenv
> virtualenv env -p <PYTHON3>
# load virtualenv
> source env/bin/activate
# install requirements
> pip install -r requirements.txt
# now drop into psql to create a user and database
> su <PSQL_USER>
<enter password>
> psql
CREATE USER <DB_USER> WITH ENCRYPTED PASSWORD '<DB_PASSWORD>';
CREATE DATABASE <DB_NAME>;
GRANT ALL PRIVILEGES ON DATABASE <DB_NAME> TO <DB_USER>;
\q
> exit
# create the database
python manage.py migrate --settings=media.settings.local
# create an admin
python manage.py createsuperuser --settings=media.settings.local
# Now we have to build the frontend
> cd app/media/ui/static/program
# install required packages
> npm install
# build the javascript
> npm run build
```
NOTE that **\<PYTHON3\>** should be substituted for your python executable, for example "python3.6". Most distributions default to python2 being the default "python** excutable.  
**\<PSQL_USER\>** is the user on your system that is authorized to call postgres. This is usually "postgres".  
**\<DB_USER\>**, **\<DB_PASSWORD\>**, etc. are the values that should be configured in the Media Center's configured [local settings](app/media/media/settings/local.py). Modify this file with the values you have decided to use or simply use the values defined in that file.  
  
After cloning the repo, setting up the virtual environment, creating a database, creating the admin, and building the frontend, you are finally ready to start the API server. Go back to the base directory for the repo and run the following command to start the server. This will be available at http://localhost:8000
```bash
> python manage.py runserver --settings=media.settings.local
```

### I want to contribute to the backend codebase
TODO  


### I want to contribute to the UI/UX or frontend codebase
The frontend code uses a framework called [Vue.js](https://vuejs.org/), and uses a [custom state management system](app/media/ui/static/program/src/store.js) "Store" I wrote myself. An understanding of either is not required if you are simply interested in making CSS changes, but if you are interesting in adding new components or revising existing components, it may help to familiarize yourself with some principles of SPA (Single-Page-Application) development, and MVVM (Model-View-View-Model).  

You likely require an editor that correctly highlights the **.vue** extension, which may require a plugin. I also recommend installing the Vue developer tools, which is available as a webextension.  
All the frontend code lives in [app/media/ui/static/program/src](app/media/ui/static/program/src). Study it carefully if you need to.  
  
Here's how to run the frontend development server
```bash
> cd app/media/ui/static/program
# Run the development server
> npm run dev
```

This will get a test server running on http://localhost:8080 with a webpack dev server with "hot reload". Basically this means whenever you make a change, the changes should show up immediately. Make sure to keep your code in the "proper" format or the linter will complain at you. (4 spaces, no semicolons, ...)  
Once you have made your changes and you are ready to commit, you can run "npm run build" to get it to show up on http://localhost:8000
