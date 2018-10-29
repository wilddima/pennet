package main

import (
	"fmt"
	"sync"
)

type Stat struct {
	Name     string
	BytesIn  string
	BytesOut string
}

type StatsStore struct {
	mutex sync.RWMutex
	stats map[string]Stat
}

func NewStatsStore() *StatsStore {
	return &StatsStore{stats: make(map[string]Stat)}
}

func (s *StatsStore) Set(val Stat) {
	s.mutex.Lock()
	defer s.mutex.Unlock()
	s.stats[val.Name] = val
}

func (s *StatsStore) Get(key string) Stat {
	s.mutex.RLock()
	defer s.mutex.RUnlock()
	return s.stats[key]
}

func (stats Stat) Format() []byte {
	return []byte(fmt.Sprintf("%s %s %s\n", stats.Name, stats.BytesIn, stats.BytesOut))
}
