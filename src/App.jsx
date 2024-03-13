import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [texts, setTexts] = useState([]);
  const [reqSent, setReqSent] = useState(true);

  const [inputValue, setInputValue] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    async function addText() {
      try {
          await fetch("http://192.168.2.5:3000/add/text", {
          method: "POST",
          body: inputValue,
        })
      } catch (err) {
        console.log(err);
      }
    }

    async function getText() {
      try {
        const res = await fetch("http://192.168.2.5:3000/get/text", {
          method: "GET",
          mode: "cors",
        });
        const data = await res.text();
        const dataArray = data.split(",");
        setTexts(() => dataArray);
      } catch (err) {
        console.log(err);
      }
    }

    getText();
    addText();
    getText()

    setInputValue("");
    inputRef.current.focus();
    
    const getTextInterval = setInterval(async() => {
      await getText();
    }, 3000);
    return () => clearInterval(getTextInterval);
    
  }, [reqSent]);

  return (
    <>
      <div className="main-wrapper">
        <div className="input-button-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
          <button
            onClick={() => {
              if (inputValue.trim().length > 0) {
                setReqSent(!reqSent);
              }
            }}
          >
            Add Text / Get Text
          </button>
        </div>

        <div className="text-wrapper">
          {texts.map((item, index) => {
            return <p key={index}>{index}: {item}</p>;
          })}
        </div>
      </div>
    </>
  );
}

export default App;
