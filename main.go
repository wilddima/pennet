package main

import (
	"log"
	"net"
)

func main() {
	netstat := NewNetstat()
	store := NewStatsStore()
	ping := make(chan struct{})

	go fetchStats(store, netstat, ping)

	listener, err := net.Listen("tcp", ":12345")

	if err != nil {
		log.Fatal(err)
	}

	for {
		connection, err := listener.Accept()
		if err != nil {
			log.Fatal(err)
		}
		go handleConnection(connection, store, ping)
	}
}

func fetchStats(store *StatsStore, ns *Netstat, ping chan struct{}) chan struct{} {
	for {
		ch := make(chan Stat, 5)
		go ns.Fetch(ch)
		stat, ok := <-ch
		if !ok {
			continue
		}
		store.Set(stat)

		go func(ping chan struct{}) {
			ping <- struct{}{}
		}(ping)
	}
}

func handleConnection(connection net.Conn, store *StatsStore, ping chan struct{}) {
	for {
		<-ping
		connection.Write(store.Serialize())
	}
}
