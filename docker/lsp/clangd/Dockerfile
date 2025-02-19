FROM alpine:latest as builder

RUN apk add --no-cache git npm

WORKDIR /app

RUN git clone https://github.com/wylieconlon/jsonrpc-ws-proxy.git

WORKDIR /app/jsonrpc-ws-proxy

COPY servers.yml .

RUN npm install && npm run prepare

FROM alpine:latest

RUN apk add --no-cache build-base clang-extra-tools nodejs

WORKDIR /app/jsonrpc-ws-proxy

COPY --from=builder /app/jsonrpc-ws-proxy .

EXPOSE 3000

CMD ["node", "dist/server.js", "--port", "3000", "--languageServers", "servers.yml"]
