import { apiV1BaseRoute, getStoreItem, serviceLocator, setStoreItem } from '@cromwell/core';

class CWebSocketClient {
    constructor(private baseUrl: string) { }

    connectToManager = (onMessage: (message: string) => void) => {
        const url = `${this.baseUrl}/manager/log`;

        const socket = new WebSocket(url);
        socket.addEventListener('open', function (event) {
        });
        socket.addEventListener('message', function (event) {
            onMessage(event.data)
        });
    }
}

export const getWebSocketClient = (): CWebSocketClient | undefined => {
    let client = getStoreItem('webSocketClient');
    if (client) return client;

    const baseUrl = `${serviceLocator.getApiWsUrl()}/${apiV1BaseRoute}`;

    client = new CWebSocketClient(baseUrl);

    setStoreItem('webSocketClient', client);
    return client;
}