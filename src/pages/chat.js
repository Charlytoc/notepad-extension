const socket = io('https://chat.4geeks.com');

const getMessageData = (message) => {
    const data = {
        message: {
            type: "user",
            text: message,
            purpose: 29,
            imageB64: "",
        },
        data: {
            conversationID: 533,
            purpose: 29,
            token: "d336157beef84051d8e91e0af7d5adab88b779c5",
        },
    };
    return data;
};

socket.on('connect', () => {
    console.log('Connected to chat.4geeks.com');
});

socket.on('disconnect', () => {
    console.log('Disconnected from chat.4geeks.com');
});
socket.on("response", (message) => {
    const messageElement = searchLastMessage();
    messageElement.innerHTML += message.chunk;

    // let newMessages = [...messages];
    // if (!newMessages[newMessages.length - 1].sources) {
    //   newMessages[newMessages.length - 1].sources = message.sources;
    // }
    // newMessages[newMessages.length - 1].text += message.chunk;
    // setMessages(newMessages);
});

const searchLastMessage = () => {
    const messages = document.querySelectorAll('.message');
    return messages[messages.length - 1];
}

const createMessageComponent = (text, type) => {
    return `<div class="message ${type}"><p>${text}</p></div>`
}

const html = () => {

    actions.emitMessage = () => {

        const input = document.getElementById('chat-input');
        socket.emit('message', getMessageData(input.value));
        const messagesContainer = document.getElementById('messages-container');
        messagesContainer.innerHTML += createMessageComponent(input.value, "user");
        messagesContainer.innerHTML += createMessageComponent("", "bot");

        input.value = "";
    }

    return `
    <main class="chat principal">
        ${navigation("chat.html")}
        <section id="messages-container">
        </section>
        <section class="chat-footer">
            <textarea id="chat-input" placeholder="Type your message here"></textarea>
            <button id="send-message" class="simple-button">Send</button>    
        </section>
    </main>
    `
}



document.addEventListener("render", () => {
    document.getElementById('send-message').addEventListener('click', actions.emitMessage);
})