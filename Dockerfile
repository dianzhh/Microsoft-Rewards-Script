# Use an official Node.js runtime as a base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/microsoft-rewards-script

RUN sed -i 's@deb.debian.org@repo.huaweicloud.com@g' /etc/apt/sources.list.d/debian.sources

# Install jq, cron, gettext-base, Playwright dependencies
RUN apt-get update && apt-get install -y \
    jq \
    vim \
    cron \
    dos2unix \
    gettext-base \
    xvfb \
    libgbm-dev \
    libnss3 \
    libasound2 \
    libxss1 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    tzdata \
    && rm -rf /var/lib/apt/lists/*

# Copy all files to the working directory
COPY . .

# Install application dependencies
RUN npm install && \
    # Ensure correct permissions for node_modules
    chmod -R 755 /usr/src/microsoft-rewards-script/node_modules && \
    # Install Playwright Chromium directly from local node_modules
    ./node_modules/.bin/playwright install chromium && \
    # Ensure correct permissions for the working directory
    chmod -R 755 /usr/src/microsoft-rewards-script && \
    chmod +x /usr/src/microsoft-rewards-script/start.sh

# Build the script
RUN npm run build

# Copy cron file to cron directory
COPY src/crontab.template /etc/cron.d/microsoft-rewards-cron.template
RUN dos2unix /etc/cron.d/microsoft-rewards-cron.template
# Create the log file to be able to run tail
RUN touch /var/log/cron.log

# Define the command to run your application with cron optionally
CMD ["sh", "/usr/src/microsoft-rewards-script/start.sh"]
