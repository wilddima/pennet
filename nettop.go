package main

import (
	"encoding/csv"
	"github.com/kr/pty"
	"io"
	"log"
	"os/exec"
)

type Netstat struct {
	output io.ReadWriter
}

var headers = [...]string{"bytes_in", "bytes_out", "", "time"}

func NewNetstat() *Netstat {
	cmd := exec.Command("nettop", "-J bytes_in,bytes_out", "-L 0", "-s 1", "-P")
	f, err := pty.Start(cmd)
	if err != nil {
		log.Fatal(err)
	}
	return &Netstat{f}
}

func (ns *Netstat) Fetch(ch chan Stat) {
	csvReader := csv.NewReader(ns.output)
	readedStats, err := csvReader.Read()
	if err != nil {
		log.Fatal(err)
	}
	for _, val := range headers {
		if len(readedStats) < 4 ||
			readedStats[0] == val ||
			readedStats[1] == val ||
			readedStats[2] == val ||
			readedStats[3] == val {
			close(ch)
			return
		}
	}
	if err != nil {
		log.Fatal(err)
	}

	ch <- Stat{readedStats[1], readedStats[2], readedStats[3]}
}
