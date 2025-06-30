import { useEffect, useRef, useState } from "react";
import { FullMessage } from "../types";
import ChatBubble from "./ChatBubble";

interface ChatBubblesProps {
  handleSwitchLanguage: () => void;
  messages: FullMessage;
  language: string;
}

const ChatBubbles = ({handleSwitchLanguage, messages} : ChatBubblesProps) => {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [text3, setText3] = useState("");
  const [showSecond, setShowSecond] = useState(false);
  const [showThird, setShowThird] = useState(false);

  const textRef = useRef(""); // Store the current text state

  const changeLanguage = () => {
    handleSwitchLanguage();
    setShowSecond(false);
    setShowThird(false);
    handleSwitchLanguage();
  }

  useEffect(() => {
    setText1("");
    textRef.current = "";
    let i = 0;
    const typingInterval1 = setInterval(() => {
      if (messages && i < messages?.message1?.length) {
        textRef.current += messages.message1[i];
        setText1(textRef.current);
        i++;
      } else {
        clearInterval(typingInterval1);
        setTimeout(() => setShowSecond(true), 500);
      }
    }, 50);

    return () => clearInterval(typingInterval1);
  }, [messages]);

  useEffect(() => {
    if (showSecond) {
      setText2("");
      textRef.current = "";
      let i = 0;
      const typingInterval2 = setInterval(() => {
        if (i < messages?.message2?.length) {
          textRef.current += messages.message2[i];
          setText2(textRef.current);
          i++;
        } else {
          clearInterval(typingInterval2);
          setTimeout(() => setShowThird(true), 500);
        }
      }, 50);

      return () => clearInterval(typingInterval2);
    }
  }, [showSecond, messages.message2]);

  useEffect(() => {
    if (showThird) {
      setText3("");
      textRef.current = "";
      let i = 0;
      const typingInterval3 = setInterval(() => {
        if (i < messages?.message3?.length) {
          textRef.current += messages.message3[i];
          setText3(textRef.current);
          i++;
        } else {
          clearInterval(typingInterval3);
          setTimeout(() => changeLanguage(), 7000);
        }
      }, 50);
      return () => clearInterval(typingInterval3);
    }
  }, [showThird, messages.message3]);

  // useEffect(() => {
  //   if (showForth) {
  //     // wait for 2 seconds then call changeLanguage()
  //     setTimeout(() => {
  //       changeLanguage();
  //     }, 2000);
  //   }
  // }, [showForth]);

  return (
    <div
      className="space-y-4"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "20px",
      }}
    >
    <ChatBubble message={text1} userType="farm-assist" />

      {showSecond && (
        <ChatBubble message={text2} userType="user" />
      )}

      {showThird && (
        <ChatBubble
          message={text3} 
          userType="farm-assist" 
        />
      )}
    </div>
  );
};

export default ChatBubbles;
