import { useState } from "react";

const SELLERS = {
  seller1: { name: "DAEN STORE", phone: "62881027154473" },
  seller2: { name: "GIO STORE", phone: "6285715635425" },
  seller3: { name: "WANZ STORE", phone: "6283133581399" }
};

export default function App() {
  const [items, setItems] = useState([]);
  const [game, setGame] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [seller, setSeller] = useState("seller1");

  const addItem = () => {
    setItems([...items, {
      id: Date.now(),
      game, desc, price, seller
    }]);
    setGame(""); setDesc(""); setPrice("");
  };

  return (
    <div className="wrap">
      <header className="top">
        <img src="/logo.png" />
        <h1>STOK AKUN WANZ × DAEN × GIO</h1>
      </header>

      <div className="panel">
        <input placeholder="Game" value={game} onChange={e=>setGame(e.target.value)} />
        <input placeholder="Detail" value={desc} onChange={e=>setDesc(e.target.value)} />
        <input placeholder="Harga" value={price} onChange={e=>setPrice(e.target.value)} />
        <select onChange={e=>setSeller(e.target.value)}>
          <option value="seller1">DAEN</option>
          <option value="seller2">GIO</option>
          <option value="seller3">WANZ</option>
        </select>
        <button onClick={addItem}>Tambah</button>
      </div>

      <div className="grid">
        {items.map(i=>(
          <div className="card" key={i.id}>
            <h3>{i.game}</h3>
            <p>{i.desc}</p>
            <b>{i.price}</b>
            <a target="_blank"
              href={`https://wa.me/${SELLERS[i.seller].phone}?text=Saya minat akun ${i.game}`}>
              BUY
            </a>
          </div>
        ))}
      </div>
    </div>
  );
    }
