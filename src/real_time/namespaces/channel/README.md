> [!IMPORTANT]  
> registerEvents doesn't have listeners yet

# CLASS METHODS

1. initializeNamespace() - initializes namespace and invokes joinRooms(), registerEvents(), and serverSentEvents()
2. joinRooms() - joins the socket(user) to all its channels subscribed
3. joinRoom() - joins the socket(user) to a single room
4. serverSentEvents() - triggers when a changeStreamEvent(from _channels_ collection) is detected [insert, delete, update] then emits the data
5. getNamespace() - returns the namespace instance (channel namespace)

### To be implemented

- **To be decided**
  - [ ] create an event listener for update
  - [ ] create an event listener for delete
  - [ ] create an event listener for create
