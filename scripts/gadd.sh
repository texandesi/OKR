#!/bin/zsh
#
#

CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`

if [[ "$2" -eq "" ]]; then
	TARGET_BRANCH=$CURRENT_BRANCH
else
	TARGET_BRANCH=$2
fi

git add .
git commit -S -m $1
git push 

