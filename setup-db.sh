#!/bin/bash

docker run -d --rm \
	--name local_test \
 	--env-file .env \
 	-p 5432:5432 \
	-v "$PWD/docker/docker-entrypoint-initdb.d":/docker-entrypoint-initdb.d \
	postgres