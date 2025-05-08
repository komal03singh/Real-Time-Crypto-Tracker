export class CryptoWebSocket {
    constructor(url, message) {
        this.url = url;
        this.onMessage = message;
        this.queue = [];  
        this.connect();
    }

    connect() {
        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
            console.log("WebSocket connected");
            while (this.queue.length > 0) {
                this.socket.send(this.queue.shift());
            }
        };

        this.socket.onmessage = (e) => 
            this.onMessage(JSON.parse(e.data));

        this.socket.onclose = () => {
            console.warn("WebSocket closed, reconnecting...");
            setTimeout(() => this.connect(), 1000);
        };
    }

    sendWhenReady(message) {
        if (this.socket.readyState === 1) {
            this.socket.send(message);
        } else {
            console.log("Socket not ready, queuing message");
            this.queue.push(message);
        }
    }

    subscribe(symbol) {
        const message = JSON.stringify({
            method: 'SUBSCRIBE',
            params: [`${symbol.toLowerCase()}@ticker`],
            id: 1,
        });
        this.sendWhenReady(message);
    }

    unsubscribe(symbol) {
        const message = JSON.stringify({
            method: 'UNSUBSCRIBE',
            params: [`${symbol.toLowerCase()}@ticker`],
            id: 1,
        });
        this.sendWhenReady(message);
    }
}
