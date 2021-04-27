FROM node:12-slim

# Configure app options

RUN apt-get update && \
apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget && \
wget https://github.com/Yelp/dumb-init/releases/download/v1.2.1/dumb-init_1.2.1_amd64.deb && \
dpkg -i dumb-init_*.deb && rm -f dumb-init_*.deb && \
apt-get clean && apt-get autoremove -y && rm -rf /var/lib/apt/lists/*

RUN yarn global add puppeteer@1.20.0 && yarn cache clean
RUN yarn global add log && yarn cache clean
RUN yarn global add log-node && yarn cache clean

ENV NODE_PATH="/usr/local/share/.config/yarn/global/node_modules:${NODE_PATH}"
# ENV PATH="/app:/tools:${PATH}"

# Group number should match group id and permission settings on host to allow for writing output to host file system.
# bo@vm5nas01:/volume1/src/docker-puppeteer$ ll -nd data/ test-dataset.json
# drwxrwxr-x 1 1026 65539    0 Apr 23 14:36 data/
# -rw-rw-r-- 1 1026 65539 3148 Apr 23 12:00 test-dataset.json
RUN groupadd -r pptruser -g 65539 && useradd -r -g pptruser -G audio,video pptruser

# COPY --chown=pptruser:pptruser ./tools /tools
COPY package*.json ./


RUN npm install
RUN npm install -g nodemon
RUN npm install random-useragent
RUN npm install mysql
RUN npm list

WORKDIR /app
# Set language to UTF8
ENV LANG="C.UTF-8"

# Add user so we don't need --no-sandbox.
RUN mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app \
    && chown -R pptruser:pptruser /usr/local/share/.config/yarn/global/node_modules 
# RUN mkdir /screenshots \
# 	&& mkdir -p /home/pptruser/Downloads \
#     && chown -R pptruser:pptruser /home/pptruser \
#     && chown -R pptruser:pptruser /usr/local/share/.config/yarn/global/node_modules \
#     && chown -R pptruser:pptruser /screenshots \
#     && chown -R pptruser:pptruser /tools

# Run everything after as non-privileged user.
USER pptruser

# --cap-add=SYS_ADMIN
# https://docs.docker.com/engine/reference/run/#additional-groups
EXPOSE 3000 3307

ENTRYPOINT ["dumb-init", "--"]

# CMD ["/usr/local/share/.config/yarn/global/node_modules/puppeteer/.local-chromium/linux-526987/chrome-linux/chrome"]

#  ENV DEBUG="puppeteer:*" 
 ENV DEBUG_COLORS=true 
 CMD ["npm", "start"]
