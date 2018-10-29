all: clean build run

run:
	node ./index.js

clean:
	rm ./pennet

build:
	go build
