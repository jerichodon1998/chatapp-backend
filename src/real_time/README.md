# REAL TIME

Handles all of the real time updates for this application. JWT token is used to distinguish the sockets(users).

### Namespaces

1. message_namespace - handles message events. For more information, check message_namespace README.md
2. channel_namespace - handles channel server sent events (event listeners not yet(might not be) implemented)

### To-do

- [x] Implement Conditional Types in CustomNamespace, also read more about generic types in Typescript
- [ ] Read more and implement emitWithAck to all 'Server to client events'
