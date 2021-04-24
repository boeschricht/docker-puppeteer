#!/bin/bash

docker run --shm-size 1G --rm -p 3000:3000 -p 9229:9229 -v /volume1/src/docker-puppeteer/:/app docker-puppeteer:latest 
# docker run -it --entrypoint /bin/bash --shm-size 1G --rm -p 3000:3000 -p 9229:9229 -v /volume1/src/docker-puppeteer/:/app docker-puppeteer:latest 

