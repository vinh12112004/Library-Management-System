import * as signalR from "@microsoft/signalr";

let connection = null;

const ensureConnected = async () => {
    if (!connection) throw new Error("SignalR not initialized");
    if (connection.state === signalR.HubConnectionState.Connected) return;

    await new Promise((resolve, reject) => {
        const check = setInterval(() => {
            if (connection.state === signalR.HubConnectionState.Connected) {
                clearInterval(check);
                resolve();
            }
        }, 50);
        setTimeout(() => reject("SignalR connect timeout"), 10000);
    });
};

export const startConnection = async (token) => {
    connection = new signalR.HubConnectionBuilder()
        .withUrl("https://pablo11.duckdns.org/chatHub", {
            accessTokenFactory: () => token,
        })
        .withAutomaticReconnect()
        .build();

    connection.onclose((err) => console.log("SignalR disconnected:", err));

    await connection.start();
    console.log("SignalR connection started");
};

export const joinConversation = async (conversationId) => {
    await ensureConnected();
    await connection.invoke("JoinConversation", conversationId);
};

export const leaveConversation = async (conversationId) => {
    if (!connection) return;
    await ensureConnected();
    await connection.invoke("LeaveConversation", conversationId);
};

export const onReceiveMessage = (callback) => {
    if (!connection) return;
    connection.on("ReceiveMessage", callback);
};

export const sendMessage = async (message) => {
    await ensureConnected();
    await connection.invoke("SendMessage", message);
};
