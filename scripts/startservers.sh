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

if [[ -n "$1" ]]; then
  DJANGO_APP_LOCATION=${APP_HOME}/$1

  #check if the directory exists
  if [[ -d ${DJANGO_APP_LOCATION} ]]; then

    #check of the executable exists
    if ! [[ -f DJANGO_APP_LOCATION/manage.py ]]
      echo "Django executable not found in directory ${DJANGO_APP_LOCATION}"
      exit 2
    else
      echo "Starting Django server in directory ${DJANGO_APP_LOCATION}"
    fi

	  cd ${DJANGO_APP_LOCATION}
  else
     echo "Django directory not found at ${DJANGO_APP_LOCATION}"
     exit 2
  fi

else
	echo "usage: startserevers.sh django-app-path angular-app-path"
  echo "stopping mysql and existing instances of Django and Angular"

  # kill the Django server and angular server if they are running
  ps ax | grep "manage.py" | grep -v "grep" | awk {'print $1'} | xargs kill
  ps ax | grep "ng serve" | grep -v "grep" | awk {'print $1'} | xargs kill

  brew services stop mysql
  exit 2
fi

if [[ -n "21" ]]; then
  ANGULAR_APP_LOCATION=${APP_HOME}/$2

  #check if the directory exists
  if [[ -d ${ANGULAR_APP_LOCATION} ]]; then

    #check of the executable exists
    if ! [[ -f ANGULAR_APP_LOCATION/ng ]]
      echo "Angular executable not found in directory ${ANGULAR_APP_LOCATION}"
      exit 2
    else
      echo "Starting Angular server in directory ${ANGULAR_APP_LOCATION}"
    fi

	  cd ${ANGULAR_APP_LOCATION}
  else
     echo "Angular directory not found at ${ANGULAR_APP_LOCATION}"
     exit 2
  fi

else
	echo "usage: startserevers.sh [django-app-path] [angular-app-path]"
  echo "stopping mysql and existing instances of Django and Angular"

  # kill the Django server and angular server if they are running
  ps ax | grep "manage.py" | grep -v "grep" | awk {'print $1'} | xargs kill
  ps ax | grep "ng serve" | grep -v "grep" | awk {'print $1'} | xargs kill

  brew services stop mysql
  exit 2
fi

#start Django and Angular
if [[ `brew services list | grep mysql | awk '{ print $2}'` == 'none' ]]; then
	echo starting Mysql server
	brew services start mysql
else
	echo "mysql already started"
fi

nohup python manage.py runserver &
nohup ng serve &



#get back to base directory
cd $APP_HOME
