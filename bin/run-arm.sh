#!/bin/sh
SCRIPTPATH=$(cd "$(dirname "$0")"; pwd)

# set link

path="$SCRIPTPATH/src/github.com/admpub"
if [ ! -d "$path" ]; then
	mkdir -p "$path"
fi
rm -rf $SCRIPTPATH/src/github.com/admpub/leanote # 先删除
ln -s ../../../../ $SCRIPTPATH/src/github.com/admpub/leanote

# set GOPATH
export GOPATH=$SCRIPTPATH

script="$SCRIPTPATH/leanote-linux-arm"
chmod 777 $script
$script -importPath github.com/admpub/leanote