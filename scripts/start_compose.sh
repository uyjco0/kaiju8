#!/bin/sh

# Start the containers using the the file 'docker-compose.yml'
docker-compose -f ./docker-compose.yml up --build -d
