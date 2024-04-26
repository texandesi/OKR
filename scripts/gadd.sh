#!/bin/zsh
#
#

CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`

#echo "First string is '$1'"

if [[ -z "$1"  ]]; then
	echo "usage: gadd.sh [commit-message] [commit-branch]"
	exit 2
fi

if [[ "$2" -eq "" ]]; then
	TARGET_BRANCH=$CURRENT_BRANCH
else
	TARGET_BRANCH=$2
fi

git switch $TARGET_BRANCH

git add .
git commit -S -m $1
git push 

