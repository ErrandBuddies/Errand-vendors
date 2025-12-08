*** MESSAGES ***

Get conversations
endpoint: GET /chat/conversation
sample response:
{
    "success": true,
    "data": [
        {
            "latestMessage": "hello boss",
            "status": "sent",
            "lastUpdated": "2025-12-08T21:24:32.808Z",
            "unread": false,
            "_id": "6931bdfe322dd837303ecf33_6931f363db849908ac2c1a08",
            "counterpartDetails": {
                "_id": "6931bdfe322dd837303ecf33",
                "firstname": "Adebayo",
                "lastname": "Azeez"
            }
        }
    ],
    "contracts": []
}

Get conversation messages
endpoint: GET /chat/messages/:recipientId
params: limit, cursor
note: recipientId is the id of the user you are messaging which is counterpartDetails._id from the conversation list, cursor is the cursor from the previous response
sample response:
{
    "success": true,
    "conversationId": "6931bdfe322dd837303ecf33_6931f363db849908ac2c1a08",
    "data": [
        {
            "_id": "69374210f50437cd142acc3d",
            "sender": "6931f363db849908ac2c1a08",
            "recipient": "6931bdfe322dd837303ecf33",
            "message": "hello boss",
            "attachment": null,
            "status": "sent",
            "createdAt": "2025-12-08T21:24:32.808Z"
        }
    ],
    "recipient": [
        {
            "_id": "6931bdfe322dd837303ecf33",
            "firstname": "Adebayo",
            "lastname": "Azeez"
        }
    ],
    "pagination": {
        "hasMore": false,
        "nextCursor": null,
        "limit": 50
    }
}


*** MESSAGES SOCKET ***
authentication: socket.handshake.auth = { token: 'your-jwt-token' , type "vendor"} // as this is a vendor app

events: {
    "connection": connet to the socket on login to receive real time messages,
    "disconnect": disconnect from the socket on logout,
    "message": listen to a message event to receive a message,
    "sendMessage": emit a sendMessage event to send a message,
    "messageSent": listen to a messageSent event to receive a message sent confirmation,
    "messageDelivered": emit a messageDelivered event to mark a message as delivered,
    "messageDelivered": listen to a messageDelivered event to receive a message delivery confirmation,
    "messagesRead": emit a messagesRead event to mark a message as read,
    "messagesRead": listen to a messagesRead event to receive a message read confirmation and mark all messages as read,
}

payloads and responses: {
    "connection": {
        "token": "your-jwt-token",
        "type": "vendor"
    }, // in the socket.handshake.auth
    "disconnect": {
        "token": "your-jwt-token",
        "type": "vendor"
    }, // in the socket.handshake.auth
    "sendMessage": {
        "recipientID": "6931bdfe322dd837303ecf33",
        "message": "Good day", // optional for the case of an attachment
        "messageID": "89m4ni2wo", // random id to identify the message in the messageSent event
        "attachment": {
            "file": "path/to/file.jpg", // base64 string
            "type": "image" // required
            "name": "file.jpg", // required
            "size": 1024, // required
        } // optional
    },
    "messageSent": {
        "success": true,
        "message": {
            "_id": "693746a1f50437cd142accad",
            "sender": "6931f363db849908ac2c1a08",
            "recipient": "6931bdfe322dd837303ecf33",
            "message": "Good day",
            "attachment": null,
            "status": "sent",
            "timestamp": "2025-12-08T21:44:01.613Z",
            "conversationId": "6931bdfe322dd837303ecf33_6931f363db849908ac2c1a08"
        },
        "messageID": "89m4ni2wo"
    },
    "message": {
        "conversationId": "6931bdfe322dd837303ecf33_6931f363db849908ac2c1a08",
        "success": true,
        "message": {
            "_id": "69374e72f50437cd142acd6b",
            "sender": "6931bdfe322dd837303ecf33",
            "recipient": "6931f363db849908ac2c1a08",
            "message": "Good day bro",
            "attachment": {
                "url": "https://res.cloudinary.com/dlxu4ej5u/image/upload/v1764527148/product-images/rmqq6nr9germ0zocsnai.jpg",
                "type": "image",
                "name": "file.jpg",
                "size": 1024
            },
            "status": "sent",
            "timestamp": "2025-12-08T22:17:22.296Z",
            "conversationId": "6931bdfe322dd837303ecf33_6931f363db849908ac2c1a08"
        }
    },
    "messageDelivered": { "messageID": "69374e72f50437cd142acd6b" }, //payload
    "messageDelivered": { "success": true, "messageID": "69374e72f50437cd142acd6b" }, //response
    "messagesRead": { recipientID: "69221eef79ff7797647206f5" }, //payload
    "messagesRead": { success: true, recipientID: "69221eef79ff7797647206f5" }, //response
}