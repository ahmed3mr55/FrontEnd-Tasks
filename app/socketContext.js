// socketContext.js
import React, { createContext, useContext, useEffect, useRef } from "react";
import io from "socket.io-client";

// إنشاء Context
const SocketContext = createContext(null);

// هوك للوصول للـ socket من أي مكون
export const useSocket = () => useContext(SocketContext);

// مكون الـ Provider الذي ينشئ الاتصال مرة واحدة
export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);

  // إنشاء الاتصال مرة واحدة إذا لم يُنشأ بالفعل
  if (!socketRef.current) {
    socketRef.current = io.connect(process.env.NEXT_PUBLIC_DOMAIN);
  }

  useEffect(() => {
    // هنا ممكن تضيف أحداث مشتركة أو تسجيل المستخدم مرة واحدة
    // على سبيل المثال:
    // socketRef.current.emit("register-user", Cookies.get("userId"));

    // التنظيف عند فك التركيب
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};
