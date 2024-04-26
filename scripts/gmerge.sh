#!/bin/zsh

if [[ ("$#" -ne 1) && ("$#" -ne 2) ]]; then
	echo "Usage : 
	gmerge.sh <target_branch> <to_merge_branch>"
	# Find a way to differentiate between all defaults and printing usage
	# echo "default : gmerge.sh master current_branch"
	exit
fi

CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`

if [[ "$2" -eq "" ]]; then
	MERGE_BRANCH=$CURRENT_BRANCH
else
	MERGE_BRANCH=$2
fi

if [[ "$1" -eq "" ]]; then
	TARGET_BRANCH="master"
else
	TARGET_BRANCH=$1
fi

git checkout $TARGET_BRANCH
git fetch
git merge $MERGE_BRANCH
git push origin $TARGET_BRANCH
git checkout $CURRENT_BRANCH

