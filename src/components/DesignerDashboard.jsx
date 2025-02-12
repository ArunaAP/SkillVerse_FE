import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const apiUrl = import.meta.env.VITE_API_URL;
const socket = io(`${apiUrl}`);

const DesignerDashboard = ({ designerId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.emit("joinNotificationRoom", designerId);

    socket.on("newNotification", (notification) => {
      setNotifications((prev) => [...prev, notification]);
    });

    return () => {
      socket.off("newNotification");
    };
  }, [designerId]);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((note, index) => (
          <li key={index}>{note.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default DesignerDashboard;
