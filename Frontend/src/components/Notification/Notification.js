import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const Notification = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Mock real-time notifications
    const mockEvents = [
      'Someone liked your post!',
      'New comment on your post!',
      'You have a new follow request.',
      'You were invited to a group.'
    ];
    const interval = setInterval(() => {
      const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
      setNotifications((prev) => [...prev, randomEvent]);
      toast.info(randomEvent, { position: 'top-right' });
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, [userId]);

  return null; // Rendered via toast
};

export default Notification;