#!/bin/bash

DEPLOY_PK="$1"

RSYNC_OPTS="--recursive --perms --times --group --owner --devices --specials --verbose --copy-links --copy-dirlinks --delete"

mkdir tmp 
ABSOLUTE_TMP=$(echo "$(cd "$(dirname "$tmp")"; pwd -P)/$(basename "tmp")")
echo "$DEPLOY_PK" > ./tmp/deploy-key
chmod 0600 ./tmp/deploy-key

git clone https://github.com/qooxdoo/qooxdoo-compiler.git --depth=1 --single-branch ./tmp/qooxdoo-compiler
cp -R tmp/qooxdoo-compiler/source/resource/qx/tool/schema ./html
npm i
npx gulp

git clone https://github.com/qooxdoo/qooxdoo.git --depth=1 --single-branch ./tmp/qooxdoo
cp -r ./tmp/qooxdoo/docs html

git config --global user.email "deployment@qooxdoo.org"
git config --global user.name "Automated Deployment for qooxdoo/website"

git clone -c core.sshCommand="/usr/bin/ssh -i $ABSOLUTE_TMP/deploy-key" git@github.com:qooxdoo/qooxdoo.github.io.git --depth=1 ./tmp/qooxdoo.github.io

rsync $RSYNC_OPTS ./tmp/qooxdoo/docs ./tmp/qooxdoo.github.io

cd html
rsync $RSYNC_OPTS \
    --exclude=docs \
    --exclude=.git \
    --exclude=.nojekyll \
    --exclude=CNAME \
    . ../tmp/qooxdoo.github.io

cd ../tmp/qooxdoo.github.io
if [[ ! -d .git ]] ; then
    echo "The checked out qooxdoo.github.io is not a .git repo!"
    exit 1
fi

git add .
git commit -m 'automatic deployment from qooxdoo/website/.github/workflows/build-website.sh'
git push

