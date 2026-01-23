---
title: "Interesting Notes About HTTP"
date: 2026-01-12
category: "curiosities"
dateLabel: "January 12, 2026"
lead: "Little-known facts about the HTTP protocol"
image: "/images/blog/http-tricks.png"
---
Let's talk about HTTP again :)

There are thousands of articles, videos, and courses on what HTTP is, how it works, and so on.
I do not want to re-explain what HTTP is or how GET differs from POST, so I will cover some less obvious things for typical testers. Over my career I have interviewed more than 200 testers of various levels and specialties (manual, automation, leads, etc.) and put together a short list of interesting HTTP points that often caught many people off guard.

## You do not need anything to send a request

HTTP/1 is a text protocol, which means you can send requests and receive responses without any special programs, using for example telnet and writing directly to a socket. Description with examples: https://stackoverflow.com/questions/15772355/how-to-send-an-http-request-using-telnet
Unfortunately, this does not work with newer protocol versions.

## A GET request has no body

It is commonly believed that a GET request has no body, but that is not entirely true. In the HTTP standard this is treated as a convention, but at the network level GET and POST do not differ at all; it is just a line in the request. For example, with curl you can send the following request:
```bash
curl -X GET \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}' \
  http://example.com
```

If you look with a sniffer, you will see the following request:
```
GET / HTTP/1.1
Host: example.com
User-Agent: curl/8.7.1
Accept: */*
Content-Type: application/json
Content-Length: 16

{"key": "value"}
```

You can see that the body (at the end) is also present in the request. This will not work everywhere; for example, various WAFs (Web Application Firewalls) will either block such requests or strip the body. Moreover, instead of GET/POST/PUT... you can specify any method (even one you made up) :)

## You can only fetch data with POST

Again, this is just a common convention that is often violated. For example, there is a very popular JSON-RPC protocol https://www.jsonrpc.org/specification, in which all requests to retrieve data, create, and send are done only with POST requests. This protocol is very popular in cryptocurrencies, for example ethereum, solana.

```bash
curl https://docs-demo.quiknode.pro/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"method":"eth_blockNumber","params":[],"id":1,"jsonrpc":"2.0"}'
```

## Status codes can be anything.

I think any tester in an interview has been asked which status codes they know by category (1xx, 2xx, etc.).
But just like methods, you can return absolutely any code on the server side and handle it on the client.
You can read more in [an article with examples](https://swizec.com/blog/you-are-allowed-to-invent-http-status-codes/#:~:text=Custom%20HTTP%20status%20code,-The%20idea%20is&text=In%20the%204xx%20space%2C%20status,use%20for%20your%20nefarious%20means.&text=Because%20your%20status%20code%20is,they%20do%20know%20it%20failed).

## Method idempotency is not mandatory

GET, HEAD, and PUT should be idempotent (repeating does not change state), but HTTP does not enforce this, so you can write a server that changes state when it receives such requests. In fact, this is often used, for example in trackers that record when someone last visited the site (it used to be popular on forums)
