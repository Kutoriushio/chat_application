"use client";

import { FullMessageType } from "@/app/types";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import axios from "axios";
import useConversation from "@/app/hooks/useConverstaion";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface BodyProps {
  initialMessages: FullMessageType[];
}
const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();
  // First useEffect: Send a POST request to mark the conversation as seen when conversationId changes.
  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  // Second useEffect: Handle various actions related to the conversation.
  // user send message => axios.post("/api/messages) => trigger "new-message" event
  // => setMessages with user sent message => show messages in real time
  // && => axios.post(`/api/conversations/${conversationId}/seen`) => trigger "update-message" event
  // => update message's last seen list
  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView({ behavior: "smooth" });

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }
        return [...current, message];
      });
    };
    const updateMessageHandler = (message: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === message.id) {
            return message;
          }
          return currentMessage;
        })
      );
    };
    pusherClient.bind("new-message", messageHandler);
    pusherClient.bind("update-message", updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("new-message", messageHandler);
      pusherClient.unbind("update-message", messageHandler);
    };
  }, [conversationId]);

  useLayoutEffect(() => {
    bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, index) => (
        <MessageBox
          key={message.id}
          isLast={index === messages.length - 1}
          data={message}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default Body;
