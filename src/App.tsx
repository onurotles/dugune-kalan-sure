import React, { useEffect, useRef } from "react";
import Countdown from "./Countdown";
import { subscribeUser } from "./push";

const App: React.FC = () => {
  const hasSubscribed = useRef(false);

  useEffect(() => {
    if (hasSubscribed.current) return; // 🔒 Tek sefer çalıştır
    hasSubscribed.current = true;

    subscribeUser();
  }, []);

  return (
    <div>
      <Countdown />
    </div>
  );
};

export default App;
