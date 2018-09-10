#!/bin/bash

for pid in $(pidof -x onboot.sh); do
    if [ $pid != $$ ]; then
        echo "abc.sh : Process is already runnning with PID $pid"
        exit 1
    fi
done

sleep 60

echo "onboot.sh running" > /home/pi/onboot.txt

exec 2> /home/pi/seeburgboot.log.txt      # send stderr from rc.local to a log file
exec 1>&2 

sudo /bin/date -s "March 7, 2017 18:34"
sudo /usr/sbin/ntpdate -u time.nist.gov

cd /home/pi/seeburgjukebox
sudo -u pi /usr/bin/git pull


sudo -u pi forever start --minUpTime 100 --spinSleepTime 2000 -m 200 -o /home/pi/arduinolistener.log.txt -e /home/pi/arduinolistener.err.txt /home/pi/seeburgjukebox/arduinolistener.rpi.node.js > /home/pi/arduinolistener.forever.txt &
sudo -u pi forever start --minUpTime 100 --spinSleepTime 2000 -m 200 -o /home/pi/chatlistenter.log.txt  -c python /home/pi/libraryh3lpListener/current-activity.py > ~/libraryh3lp.log.txt &
