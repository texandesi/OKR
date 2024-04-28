#!/bin/bash
##################################-BEGIN-################################################
#																						#
# Shell script to quickly add files to a specified branch with the specified message	#
# 																						#
# usage: gadd.sh commit-message [commit-branch]											#
#																						#
#########################################################################################

#identify current branch
CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`

# check if at least the message have been
if [[ -z "$1"  ]]; then
	echo "usage: gadd.sh commit-message [commit-branch]"
	exit 2
fi

#switch to the provided branch
if [[ "$2" -eq "" ]]; then
	TARGET_BRANCH=$CURRENT_BRANCH
else
	TARGET_BRANCH=$2
fi

#do a signed commit to the provided branch
git switch $TARGET_BRANCH

git add .
git commit -S -m "$1"

# restore original branch
git push origin $TARGET_BRANCH
git checkout $CURRENT_BRANCH

###########################-END-#########################################################
