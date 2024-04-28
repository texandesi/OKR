#!/bin/bash
##################################-BEGIN-################################################
#																						                                            #
# Shell script to start the servers for the development to start                        #
# Paths are assumed relative to the application home from where the script will run     #
#																						                                            #
# usage: startserevers.sh django-app-path angular-app-path					                    #
#																						                                            #
#########################################################################################

#TODO - Change this shell script to use reusable functions and other scripts like stopserver.sh

APP_HOME=`pwd`
DJANGO_APP_LOCATION=${APP_HOME}/back-end
ANGULAR_APP_LOCATION=${APP_HOME}/front-end

function _stop_servers {
  # kill the Django server and angular server if they are running
  ps ax | grep "manage.py" | grep -v "grep" | awk {'print $1'} | xargs kill
  ps ax | grep "ng serve" | grep -v "grep" | awk {'print $1'} | xargs kill

  brew services stop mysql
  exit 2
}


# Set the Django app working directory
if [[ -n "$1" ]]; then
  DJANGO_APP_LOCATION=${APP_HOME}/$1
fi

#check if the directory exists
if [[ -d ${DJANGO_APP_LOCATION} ]]; then

#check of the executable exists
if [[ ! -f ${DJANGO_APP_LOCATION}/manage.py ]]; then
  echo "Django executable not found - ${DJANGO_APP_LOCATION}/manage.py"
  _stop_servers
else
  echo "Starting Django server in directory ${DJANGO_APP_LOCATION}"
fi

else
  echo "Django directory not found at ${DJANGO_APP_LOCATION}"
  _stop_servers
fi

if [[ -n "$2" ]]; then
  ANGULAR_APP_LOCATION=${APP_HOME}/$2
fi

#check if the directory exists
if [[ -d ${ANGULAR_APP_LOCATION} ]]; then

  #check if the executable exists and the app location has the signature angular files
  if  [[ ! -f `which ng` ]]; then
    echo "Angular executable ng not found. Check your installation and path"

    _stop_servers
  fi

  #check if the executable exists and the app location has the signature angular files
  if  [[ ! -f "${ANGULAR_APP_LOCATION}/package.json" ]]; then
    echo "Angular package not found in direcrory - ${ANGULAR_APP_LOCATION}"

    _stop_servers
  else
    echo "Starting Angular server in directory ${ANGULAR_APP_LOCATION}"
  fi

else
  echo "Angular directory not found at ${ANGULAR_APP_LOCATION}"
  _stop_servers
fi

#start MySQL, Django and Angular
if [[ `brew services list | grep mysql | awk '{ print $2}'` == 'none' ]]; then
	echo starting Mysql server
	brew services start mysql
else
	echo "mysql already started"
fi

if [[ `ps ax | grep "manage.py" | grep -v "grep" | awk '{ print $1}'` == '' ]]; then
  cd ${DJANGO_APP_LOCATION}
  echo starting Django
  nohup python manage.py runserver &
else
  echo "Django already running"
fi

if [[ `ps ax | grep "ng serve" | grep -v "grep" | awk '{ print $1}'` == '' ]]; then
  cd ${ANGULAR_APP_LOCATION}
  echo starting Angular
  nohup ng serve &
else
  echo "Angular already running"
fi

#get back to base directory
cd $APP_HOME
