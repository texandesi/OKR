#!/usr/local/bin/bash


unset foo
[[ -v foo ]] && echo "foo is set"
foo=
[[ -v foo ]] && echo "foo is set"





foo=""
[[ -v foo ]]; echo $?
# 1

foo=bar
[[ -v foo ]]; echo $?
# 0

foo=""
[[ -v foo ]]; echo $?
# 0
#
#

#Declaring two variables
var1=""
var2="X"

#Checking if variables are set
#For var1
if [ -z $var1 ];  then
echo "The variable is set with an empty string."
fi

#For var2
if [ -z $var2 ];  then
echo "The variable is set with a non-empty value."
fi
