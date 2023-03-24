import axios from "axios";
import React, { useEffect, useState } from "react";

// önerilen başlangıç stateleri
const initialIndex = 4; //  "B" nin bulunduğu indexi
const initialSteps = -1;
const initialMessage = "";
const initialEmail = "";

export default function AppFunctional(props) {
  const [index, setIndex] = useState(initialIndex);
  const [steps, setSteps] = useState(initialSteps);
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);

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

  function getXY(grids, index) {
    // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
    // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.
    return [grids[index][0], grids[index][1]];
  }

  console.log(getXY(grids, index)[0]);
  function getXYMesaj(getXY, grids, index, steps) {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.

    const info = [];
    const [x, y] = getXY(grids, index);
    info[0] = `(${x}, ${y})`;
    info[1] = steps;
    return info;
  }

  function reset() {
    // Tüm stateleri başlangıç ​​değerlerine sıfırlamak için bu helperı kullanın.
    setIndex(initialIndex);
    setSteps(initialSteps);
    setEmail(initialEmail);
    setMessage(initialMessage);
  }

  function sonrakiIndex(direction) {
    // Bu helper bir yön ("sol", "yukarı", vb.) alır ve "B" nin bir sonraki indeksinin ne olduğunu hesaplar.
    // Gridin kenarına ulaşıldığında başka gidecek yer olmadığı için,
    // şu anki indeksi değiştirmemeli.
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

    const error = conditions[direction]["coord"].includes(index)
      ? conditions[direction]["errorMessage"]
      : null;

    if (error) {
      setMessage(error);
    } else {
      if (direction === "up") {
        setIndex(index - 3);
      } else if (direction === "down") {
        setIndex(index + 3);
      } else if (direction === "left") {
        setIndex(index - 1);
      } else if (direction === "right") {
        setIndex(index + 1);
      }
    }
  }

  useEffect(() => {
    setSteps(steps + 1);
  }, [index]);

  function ilerle(evt) {
    // Bu event handler, "B" için yeni bir dizin elde etmek üzere yukarıdaki yardımcıyı kullanabilir,
    // ve buna göre state i değiştirir.
  }

  function onChange(e) {
    console.log(e.target.value);

    setEmail(e.target.value);
  }

  function onSubmit(e) {
    if (email === "") {
      setMessage("Ouch: email is required      ");
    } else {
      // payloadu POST etmek için bir submit handlera da ihtiyacınız var.
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
        });
      reset();
    }
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">
          Koordinatlar {getXYMesaj(getXY, grids, index, steps)[0]}
        </h3>
        <h3 id="steps">
          {getXYMesaj(getXY, grids, index, steps)[1]} kere ilerlediniz
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
        <button id="left" onClick={() => sonrakiIndex("left")}>
          SOL
        </button>
        <button id="up" onClick={() => sonrakiIndex("up")}>
          YUKARI
        </button>
        <button id="right" onClick={() => sonrakiIndex("right")}>
          SAĞ
        </button>
        <button id="down" onClick={() => sonrakiIndex("down")}>
          AŞAĞI
        </button>
        <button id="reset" onClick={reset}>
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          placeholder="email girin"
          value={email}
          onChange={onChange}
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
