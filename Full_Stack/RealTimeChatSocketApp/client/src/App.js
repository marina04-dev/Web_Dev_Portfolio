import "./App.css";
import io from "socket.io-client";
import { useState, useEffect } from "react";
import Chat from "./Chat";

// Adjust the backend URL if your backend is running on a different port
const socket = io.connect("http://localhost:3001");

function App() {
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    const [showChat, setShowChat] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server!');
            setSocketConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server!');
            setSocketConnected(false);
        });

        socket.on('connect_error', (error) => {
            console.error('Connection Error:', error);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('connect_error');
        };

    }, []);

    const joinRoom = () => {
        if (username.trim() !== "" && room.trim() !== "") {
            socket.emit("join_room", room);
            setShowChat(true);
        } else {
            alert("Username and Room ID are required!");
        }
    };

    return (
        <div className="App">
            {socketConnected ? (
                !showChat ? (
                    <div className="joinChatContainer">
                        <h3>Join A Chat</h3>
                        <input
                            type="text"
                            placeholder="John..."
                            onChange={(event) => {
                                setUsername(event.target.value);
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Room ID..."
                            onChange={(event) => {
                                setRoom(event.target.value);
                            }}
                        />
                        <button onClick={joinRoom}>Join A Room</button>
                    </div>
                ) : (
                    <Chat socket={socket} username={username} room={room} />
                )
            ) : (
                <div>Connecting to server...</div>
            )}
        </div>
    );
}

export default App;