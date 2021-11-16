import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversation/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnlione";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
import Error from "../../components/Error/Error";
import { ErrorBoundary } from "react-error-boundary";

export default function Messenger() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const { user } = useContext(AuthContext);
  console.log(user);
  const scrollRef = useRef();
  const token = JSON.parse(localStorage.getItem("user")).token;

  useEffect(() => {
    socket.current = io("wss://sociallitesocket.herokuapp.com/", {
      transports: ["websocket", "polling", "flashsocket"],
    });
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    /////console.log(user?.followings);
    socket.current.emit("addUser", user?._id);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(
        user?.followings.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios({
          method: "GET",
          url:
            "https://socialliteserver.herokuapp.com/api/conversation/" +
            user?._id,
          headers: { Authorization: "Bearer " + token },
        });

        setConversations(res.data);
      } catch (err) {
        /////console.log(err);
      }
    };
    getConversations();
  }, [user, token]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios({
          method: "GET",
          url:
            "https://socialliteserver.herokuapp.com/api/message/" +
            currentChat?._id,
          headers: { Authorization: "Bearer " + token },
        });
        setMessages(res.data);
      } catch (err) {
        /////console.log(err);
      }
    };
    getMessages();
  }, [currentChat, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user?._id,
      text: newMessage,
      conversationId: currentChat?._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user?._id
    );

    socket.current.emit("sendMessage", {
      senderId: user?._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios({
        method: "POST",
        url: "https://socialliteserver.herokuapp.com/api/message",
        data: message,
        headers: { Authorization: "Bearer " + token },
      });
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      /////console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <ErrorBoundary FallbackComponent={Error}>
        <Topbar />
        <div className="messenger">
          <div className="chatMenu">
            <div className="chatMenuWrapper">
              <input
                placeholder="Search for friends"
                className="chatMenuInput"
              />
              {conversations.map((c) => (
                <div key={c._id} onClick={() => setCurrentChat(c)}>
                  <Conversation conversation={c} currentUser={user} />
                </div>
              ))}
            </div>
          </div>
          <div className="chatBox">
            <div className="chatBoxWrapper">
              {currentChat ? (
                <>
                  <div className="chatBoxTop">
                    {messages.map((m) => (
                      <div ref={scrollRef}>
                        <Message
                          user={user?._id}
                          message={m}
                          own={m.sender === user?._id}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="chatBoxBottom">
                    <textarea
                      className="chatMessageInput"
                      placeholder="write something..."
                      onChange={(e) => setNewMessage(e.target.value)}
                      value={newMessage}
                    ></textarea>
                    <button className="chatSubmitButton" onClick={handleSubmit}>
                      Send
                    </button>
                  </div>
                </>
              ) : (
                <span className="noConversationText">
                  Open a conversation to start a chat.
                </span>
              )}
            </div>
          </div>
          <div className="chatOnline">
            <div className="chatOnlineWrapper">
              <ChatOnline
                onlineUsers={onlineUsers}
                currentId={user?._id}
                setCurrentChat={setCurrentChat}
              />
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </>
  );
}
