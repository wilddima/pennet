package main

import (
	"encoding/csv"
	"fmt"
	"github.com/kr/pty"
	"io"
	"log"
	"os/exec"
	"regexp"
)

type Netstat struct {
	output io.ReadWriter
}

var headers = [...]string{"bytes_in", "bytes_out", "", "time"}
var localhostRegexp = regexp.MustCompile("localhost|127.0.0.1|udp4|tcp6|tcp4|udp6")
var protocolRegexp = regexp.MustCompile("udp4|tcp6|tcp4|udp6")

func NewNetstat() *Netstat {
	cmd := exec.Command("nettop", "-J bytes_in,bytes_out", "-L 0", "-s 1")
	f, err := pty.Start(cmd)
	if err != nil {
		log.Fatal(err)
	}
	return &Netstat{f}
}

func (ns *Netstat) FetchRow() []string {
	csvReader := csv.NewReader(ns.output)
	readedStats, err := csvReader.Read()

	if err != nil {
		log.Fatal(err)
	}

	return readedStats
}

func (ns *Netstat) Fetch(ch chan Stat) {
	readedStats := ns.FetchRow()

	for _, val := range headers {
		if len(readedStats) < 4 ||
			readedStats[0] == val ||
			readedStats[1] == val ||
			readedStats[2] == val ||
			readedStats[3] == val ||
			localhostRegexp.MatchString(readedStats[1]) {
			close(ch)
			return
		}
	}

	ch <- Stat{readedStats[1], readedStats[2], readedStats[3]}
}

func (ns *Netstat) fetchProcess(stat []string) {
	fmt.Println(stat)
}
