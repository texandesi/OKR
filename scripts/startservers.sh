#!/bin/bash
##################################-BEGIN-################################################
#																						                                            #
# Shell script to start the servers for the development to start                        #
# Paths are assumed relative to the application home from where the script will run     #
#																						                                            #
# usage: startserevers.sh django-app-path angular-app-path					                    #
#																						                                            #
#########################################################################################

APP_HOME=`pwd`
DJANGO_APP_LOCATION=${APP_HOME}/$1
ANGULAR_APP_LOCATION=${APP_HOME}/$2

#echo starting Mysql server

if [[ `brew services list | grep mysql | awk '{ print $2}'` == 'none' ]]; then
	echo starting Mysql server
	brew services start mysql
else
	echo "mysql already started"
fi

if [[ -n "$1" ]]; then
	echo starting Django server located at "${DJANGO_APP_LOCATION}"

	cd ${DJANGO_APP_LOCATION}
	nohup python manage.py runserver &

  if [[ -n "$2" ]]; then
    echo starting Angular server located at "${ANGULAR_APP_LOCATION}"

    cd ${ANGULAR_APP_LOCATION}
    nohup ng serve &
  else
    echo "variable ANGULAR_APP_LOCATION needs to be set to the path of the Angular application"

    # kill the Django server
    ps ax | grep "manage.py" | grep -v "grep" | awk {'print $1'} | xargs kill

    exit 2
  fi

else
	echo "usage: startserevers.sh django-app-path angular-app-path"
  exit 2
fi


