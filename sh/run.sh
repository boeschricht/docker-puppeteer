#!/bin/bash

docker run --shm-size 1G -v /volume1/src/docker-puppeteer/hent-nasdaq-kurser:/app docker-puppeteer:latest 

