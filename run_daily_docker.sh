#!/bin/bash

# Set up environment variables
export PATH=$PATH:/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin

ps -aux | grep "chromium-1140\|npm" | grep -v "grep\|sh" | awk '{print $2}' | xargs kill -9 2>/dev/null

/usr/bin/systemctl restart v2raya.service

MINWAIT=$((1*60))  # 1 minutes
MAXWAIT=$((5*60))  # 5 minutes

SLEEPTIME=$((MINWAIT + RANDOM % (MAXWAIT - MINWAIT)))

sleep $SLEEPTIME

/usr/bin/docker restart netsky
