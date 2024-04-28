#!/bin/bash
##################################-BEGIN-################################################
#																						                                            #
# Shell script to stop the servers used for development                                 #
# It kills the Django and Angular processes and stops mysql service                     #
#																						                                            #
# usage: stopserevers.sh				                                                        #
#																						                                            #
#########################################################################################

function _stop_servers {
  # kill the Django server and angular server if they are running
  ps ax | grep "manage.py" | grep -v "grep" | awk {'print $1'} | xargs kill
  ps ax | grep "ng serve" | grep -v "grep" | awk {'print $1'} | xargs kill

  brew services stop mysql
  exit 2
}

_stop_servers
