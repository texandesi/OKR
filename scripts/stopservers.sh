   # kill the Django server and angular server if they are running
    ps ax | grep "manage.py" | grep -v "grep" | awk {'print $1'} | xargs kill
    ps ax | grep "ng serve" | grep -v "grep" | awk {'print $1'} | xargs kill

    brew services stop mysql
