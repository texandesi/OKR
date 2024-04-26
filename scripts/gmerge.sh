#!/bin/bash
##################################-BEGIN-################################################
#																						#
# Shell script to quickly add files to a specified branch with the specified message	#
# 																						#
# Usage : gmerge.sh target_branch <to_merge_branch>										#
#																						#
#########################################################################################

if [[ ("$#" -ne 1) && ("$#" -ne 2) ]]; then
	echo "Usage : gmerge.sh target_branch <to_merge_branch>"
	# Find a way to differentiate between all defaults and printing usage
	# echo "default : gmerge.sh master current_branch"
	exit
fi

CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`

if [[ -z "$2" ]]; then
	MERGE_BRANCH=$CURRENT_BRANCH
else
	MERGE_BRANCH=$2
fi

TARGET_BRANCH=$1


git checkout $TARGET_BRANCH
git fetch
git merge $MERGE_BRANCH
git push origin $TARGET_BRANCH
git checkout $CURRENT_BRANCH

###########################-END-#########################################################
