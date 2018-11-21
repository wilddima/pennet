# Pennet

Simple desktop MacOs application for monitoring internet traffic written with using Electron and Go

![Record](https://d2ddoduugvun08.cloudfront.net/items/40102I0t2F3s1L36080g/Screen%20Recording%202018-11-07%20at%2006.49%20PM.gif)

## Requirements

* go 1.10
* electron 3.0.6
* node 10.5
* yarn 1.7
* nettop

## Overview

Project is just a proof of concept of using electron with backend on another language. Go looked like good candidate because of simple compilation into binaries. The communication between `electron` and `go` is producing by TCP sockets.

## Installation and usage

Clone that repo:

```
git clone https://github.com/wilddima/pennet
```

Install `node` dependencies

```
yarn install
```

Run make

```
make
```

This'll start all processes, and you'll see this icon ![alt text](assets/icon.png "Title") in the status bar.
Click on this icon will show you window with current amount of input/output traffic.

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/wilddima/pennet. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.
