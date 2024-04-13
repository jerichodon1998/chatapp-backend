# MIDDLEWARE

1. messageMiddlewares - checks if the request is authorized to send, update, or delete a message. For more information, check message_middleware README.md

# MESSAGE EVENTS

1. MESSAGE SEND events
   - _on.("message:send")_ listens to sent messages from client to server
   - _to(channelId).emit("message:send")_ send messages to corresponding room from server to client
2. MESSAGE DELETE events
   - _on.("message:delete")_ listens to delete messages from client to server
   - _to(channelId).emit("message:delete")_ send delete updates to corresponding room from server to client
3. MESSAGE UPDATE events
   - _on.("message:update")_ listens to update messages from client to server
   - _to(channelId).emit("message:update")_ send update messages to corresponding room from server to client

# CLASS METHODS

1. initializeNamespace() - initializes namespace and invokes joinRooms(), registerEvents(), and serverSentEvents()
2. joinRooms() - joins the socket(user) to all its channels subscribed
3. serverSentEvents() - triggers when a changeStreamEvent(from _messages_ collection) is detected [insert, delete, update] then emits the data
4. getNamespace() - returns the namespace instance (message namespace)
