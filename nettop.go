package main

import (
	"encoding/csv"
	"github.com/kr/pty"
	"io"
	"log"
	"os/exec"
	"regexp"
)

type Netstat struct {
	output    io.ReadWriter
	csvReader *csv.Reader
}

var headers = [...]string{"bytes_in", "bytes_out", "", "time"}
var systemRegexp = regexp.MustCompile("mDNSResponder|biometrickitd")

func NewNetstat() *Netstat {
	cmd := exec.Command("nettop", "-t", "external", "-J bytes_in,bytes_out", "-L 0", "-s 5", "-P", "-x")
	f, err := pty.Start(cmd)
	if err != nil {
		log.Fatal(err)
	}
	return &Netstat{f, csv.NewReader(f)}
}

func (ns *Netstat) FetchRow() []string {
	readedStats, err := ns.csvReader.Read()

	if err != nil {
		log.Fatal(err)
	}

	return readedStats
}

func (ns *Netstat) Fetch(ch chan Stat) {
	readedStats := ns.FetchRow()
	if len(readedStats) < 4 || len(readedStats[1]) == 0 || systemRegexp.MatchString(readedStats[1]) {
		close(ch)
		return
	}

	ch <- Stat{readedStats[1], readedStats[2], readedStats[3]}
}
