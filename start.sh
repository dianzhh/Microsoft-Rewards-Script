#!/bin/sh

# Set up environment variables
export PATH=$PATH:/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin

# 检查是否有运行的 chromium、npm、run_daily 进程

ps -aux | grep "chromium\|npm\|run_daily" | grep -v "grep\|sh" | awk '{print $2}' | xargs kill -9 2>/dev/null
echo "\033[0;33mchromium cleared\033[0m"

# 更新配置文件
node src/updateConfig.js

# 设置时区
echo "$TZ" > /etc/timezone
dpkg-reconfigure -f noninteractive tzdata

# 根据环境变量决定是否启动 npm
if [ "$RUN_ON_START" = "true" ]; then 
    npm start
    if [ $? -eq 1 ]
    then
	echo "\033[0;31mrunning failed, restarting...\033[0m"
        exit 1
    fi
fi

echo "\033[0;32mrunning success! exiting...\033[0m"
exit 0

# tail -f /var/log/cron.log

# 配置并启动 cron
# envsubst < /etc/cron.d/microsoft-rewards-cron.template > /etc/cron.d/microsoft-rewards-cron
# crontab /etc/cron.d/microsoft-rewards-cron
# cron && tail -f /var/log/cron.log
