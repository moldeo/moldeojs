#!/bin/sh
sudo npm install -g buffer-shims
sudo npm install -g angular-cli
sudo npm install -g alm
sudo npm install -g typings
sudo npm install -g tslint
sudo npm install -g typescript
sudo npm install -g typings
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
cd angular
npm install
npm run typings install
#npm run typings -- install debug --save
#npm run typings -- install dt~jasmine --save --global
#npm run typings -- install dt~node --save --global
#npm run typings -- install dt~core-js --save --global

