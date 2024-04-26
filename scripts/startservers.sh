#!/bin/bash

#echo starting Mysql server

if [[ `brew services list | grep mysql | awk '{ print $2}'` == 'none' ]]; then
	echo starting Mysql server
	brew services start mysql
else
	echo "mysql already started"
fi

if [[ -n "${DJANGO_APP_LOCATION}" ]]; then
	echo starting Django server located at "${DJANGO_APP_LOCATION}"

	cd ${DJANGO_APP_LOCATION}
	python manage.py runserver
else
	echo "variable DJANGO_APP_LOCATION needs to be set to the application path"
fi

if [[ -n "${ANGULAR_APP_LOCATION}" ]]; then
	echo starting Angular server located at "${ANGULAR_APP_LOCATION}"

	#cd ${ANGULAR_APP_LOCATION}
	#python manage.py runserver
else
	echo "variable ANGULAR_APP_LOCATION needs to be set to the application path"
fi

