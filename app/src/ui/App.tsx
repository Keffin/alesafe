import { useEffect, useState } from "react";
import "./App.css";
import { AlesafeFullElectron } from "../../types";

function App() {
  const [alesafeSec, setAlesafeSec] = useState<AlesafeFullElectron>();

  useEffect(() => {
    // @ts-expect-error ignore
    window.electron.getContent((r) => setAlesafeSec(r));
  }, []);

  if (!alesafeSec) {
    console.log("in here");
    return <div>Loading...</div>;
  }

  const c1 = alesafeSec.credentials[0];
  return (
    <>
      <div>{c1.username}</div>
    </>
  );
}

export default App;
