import { getStoreItem, serviceLocator, setStoreItem } from '@cromwell/core';

/** @internal */
class CWebSocketClient {
    constructor(private baseUrl: string) { }

    private socketManager?: WebSocket;

    public connectToManager = (onMessage: (message: string) => void): WebSocket => {
        if (this.socketManager && !this.socketManager.CLOSED) {
            // return this.socketManager;
        } else {
            const url = `${this.baseUrl}/manager/log`;
            this.socketManager = new WebSocket(url);
        }

        // this.socketManager.addEventListener('open', function (event) { });
        this.socketManager.addEventListener('message', (event) => onMessage(event.data));

        return this.socketManager;
    }

    public disconnectManager = () => {
        this.socketManager?.close();
    }
}

/** @internal */
export const getWebSocketClient = (): CWebSocketClient | undefined => {
    let client = getStoreItem('webSocketClient');
    if (client) return client;

    const baseUrl = `${serviceLocator.getApiWsUrl()}/api`;

    client = new CWebSocketClient(baseUrl);

    setStoreItem('webSocketClient', client);
    return client;
}