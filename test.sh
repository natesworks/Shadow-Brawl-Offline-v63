#!/usr/bin/bash
# if i forgot to remove this souf sry
adb shell monkey -p com.natesworks.nbsoffline.v4 -c android.intent.category.LAUNCHER 1
frida-compile agent/index.ts -o _agent.js
adb forward tcp:27042 tcp:27042
sleep 1
frida -p $(adb shell pidof com.natesworks.nbsoffline.v4) -H 127.0.0.1:27042 -l _agent.js