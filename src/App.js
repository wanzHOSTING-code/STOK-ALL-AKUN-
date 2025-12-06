import "./styles.css";
import { useState } from "react";

const sellers = {
  WANZ: "62881027154473",
  GIO: "6285715635425",
  DAEN: "6283133581399",
};

export default function App() {
  const [game, setGame] = useState("");
  const [detail, setDetail] = useState("");
  const [harga, setHarga] = useState("");
  const [seller, setSeller] = useState("DAEN");
  const [list, setList] = useState([]);

  const tambah = () => {
    if (!game || !detail || !harga) return alert("Lengkapi data!");

    setList([
      ...list,
      { game, detail, harga, seller },
    ]);

    setGame("");
    setDetail("");
    setHarga("");
  };

  const buy = (item) => {
    const msg = `Halo ${item.seller}, saya mau beli akun:\n\n🎮 Game: ${item.game}\n📌 Detail: ${item.detail}\n💰 Harga: ${item.harga}`;
    window.open(
      `https://wa.me/${sellers[item.seller]}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <>
      <header>
        <img src="/logo.png" alt="logo" />
        <h1>
          STOK AKUN<br />
          WANZ × DAEN × GIO
        </h1>
      </header>

      <div className="form">
        <input
          placeholder="Game"
          value={game}
          onChange={(e) => setGame(e.target.value)}
        />
        <input
          placeholder="Detail akun"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
        />
        <input
          placeholder="Harga"
          value={harga}
          onChange={(e) => setHarga(e.target.value)}
        />
        <select value={seller} onChange={(e) => setSeller(e.target.value)}>
          <option>DAEN</option>
          <option>GIO</option>
          <option>WANZ</option>
        </select>
        <button onClick={tambah}>+ TAMBAH</button>
      </div>

      <div className="list">
        {list.map((item, i) => (
          <div className="card" key={i}>
            <span className={`badge ${item.seller}`}>{item.seller}</span>
            <h3>{item.game}</h3>
            <p>{item.detail}</p>
            <p className="price">Rp {item.harga}</p>
            <button className="buy" onClick={() => buy(item)}>
              BELI AKUN 🔥
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
