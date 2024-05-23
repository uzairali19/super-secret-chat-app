import { Welcome } from "./welcome";
import { Chat } from "./chat";
import { BodyProps } from "../types";



const Body: React.FC<BodyProps> = ({
    loggedIn,
    setLoggedIn,
    setUsername,
    socket,
    username,
    userId,
    setUserId,
    messages,
    setMessages})=> {

    return (
        <>
            {loggedIn
            ?
            <Chat
                socket={socket}
                username={username}
                userId={userId}
                messages={messages}
            /> :
            <Welcome
                setLoggedIn={setLoggedIn}
                setUsername={setUsername}
                socket={socket}
                setUserId={setUserId}
                setMessages={setMessages}
            />}
        </>
    )
}

export default Body;
