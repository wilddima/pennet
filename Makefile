all: clean build run

run:
	npm start

clean:
	rm -f ./pennet

build:
	go build
