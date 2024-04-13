# MESSAGE MIDDLEWARES

> [!NOTE]
> Bearer token(JWT) is used to allow/disallow a user to perform certain requests

1. messageSendMiddleware - checks if the request(user) is authorized to send a message
2. messageDeleteMiddleware - checks if the request(user) is authorized to delete a messsage
3. messageUpdateMiddleware - checks if the request(user) is authorized to update a messsage
