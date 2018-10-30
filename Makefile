all: clean build run

run:
	npm start

clean:
	rm ./pennet

build:
	go build
