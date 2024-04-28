#!/bin/bash
##################################-BEGIN-################################################
#																						#
# Shell script to quickly add files to a specified branch with the specified message	#
# 																						#
# Usage : gmerge.sh target_branch <to_merge_branch>										#
#																						#
#########################################################################################



#if [[ ("$#" -ne 1) && ("$#" -ne 2) ]]; then
echo "Usage : gmerge.sh [target_branch] [source_branch]"

echo "defaults : gmerge.sh 'stable' branch_of_current_directory"
#	exit
#fi

TARGET_BRANCH="stable"
CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`

if [[ -z "$2" ]]; then
	SOURCE_BRANCH=$CURRENT_BRANCH
else
	SOURCE_BRANCH=$2
fi

if [[ -n "$1" ]]; then
	TARGET_BRANCH=$1
fi

git checkout $TARGET_BRANCH
git fetch
git merge $MERGE_BRANCH
git push origin $TARGET_BRANCH
git checkout $CURRENT_BRANCH

###########################-END-#########################################################
