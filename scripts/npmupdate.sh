#!/bin/zsh

npm install -g --save-dev npm@latest
npm upgrade -g

if [[ -a ./package.json ]] then
	echo "Entered the if condition for local npm update"
	npm install --save-dev npm@latest
	npm upgrade
fi
