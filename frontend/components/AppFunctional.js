import React, { useEffect, useState } from "react";
import axios from "axios";

const initialIndex = 4;
const initialSteps = 0;
const initialMessage = "";
const initialEmail = "";

export default function AppFunctional(props) {
  // useState hooks
  const [index, setIndex] = useState(initialIndex);
  const [steps, setSteps] = useState(initialSteps);
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);

  // Variables
  const grids = [
    [1, 1],
    [2, 1],
    [3, 1],
    [1, 2],
    [2, 2],
    [3, 2],
    [1, 3],
    [2, 3],
    [3, 3],
  ];

  const conditions = {
    up: {
      coord: [0, 1, 2],
      errorMessage: "Yukarıya gidemezsiniz",
    },
    down: {
      coord: [6, 7, 8],
      errorMessage: "Aşağıya gidemezsiniz",
    },
    left: {
      coord: [0, 3, 6],
      errorMessage: "Sola gidemezsiniz",
    },
    right: {
      coord: [2, 5, 8],
      errorMessage: "Sağa gidemezsiniz",
    },
  };

  // Functions
  function getXY(grids, index) {
    return [grids[index][0], grids[index][1]];
  }

  function getXYMessage(getXY, grids, index, steps) {
    const info = [];
    const [x, y] = getXY(grids, index);
    info[0] = `(${x}, ${y})`;
    info[1] = steps;
    return info;
  }

  function reset() {
    setIndex(initialIndex);
    setSteps(initialSteps);
    setEmail(initialEmail);
    setMessage(initialMessage);
  }

  function move(direction) {
    const error = conditions[direction]["coord"].includes(index)
      ? conditions[direction]["errorMessage"]
      : null;

    if (error) {
      setMessage(error);
    } else {
      if (direction === "up") {
        setIndex(index - 3);
        setSteps(steps + 1);
      } else if (direction === "down") {
        setIndex(index + 3);
        setSteps(steps + 1);
      } else if (direction === "left") {
        setIndex(index - 1);
        setSteps(steps + 1);
      } else if (direction === "right") {
        setIndex(index + 1);
        setSteps(steps + 1);
      }
    }
  }

  function onChange(e) {
    setEmail(e.target.value);
  }

  function onSubmit(e) {
    e.preventDefault();
    const [x, y] = getXY(grids, index);
    axios
      .post("http://localhost:9000/api/result", {
        x,
        y,
        steps,
        email,
      })
      .then((res) => {
        setMessage(res.data.message);
      })
      .catch((err) => {
        setMessage(err.response.data.message);
      });
    setEmail(initialEmail);
  }

  // useEffect hooks
  useEffect(() => {
    setMessage(initialMessage);
  }, [index]);

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">
          Koordinatlar {getXYMessage(getXY, grids, index, steps)[0]}
        </h3>
        <h3 id="steps">
          {getXYMessage(getXY, grids, index, steps)[1]} kere ilerlediniz
        </h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className={`square${idx === index ? " active" : ""}`}>
            {idx === index ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={() => move("left")}>
          SOL
        </button>
        <button id="up" onClick={() => move("up")}>
          YUKARI
        </button>
        <button id="right" onClick={() => move("right")}>
          SAĞ
        </button>
        <button id="down" onClick={() => move("down")}>
          AŞAĞI
        </button>
        <button id="reset" onClick={reset}>
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="text"
          placeholder="email girin"
          value={email}
          onChange={onChange}
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
