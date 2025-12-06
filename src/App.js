import "./styles.css";
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

const sellers = {
  WANZ: { phone: "62881027154473", pass: "wanz123" },
  DAEN: { phone: "6283133581399", pass: "daen123" },
  GIO:  { phone: "6285715635425", pass: "gio123" },
};

export default function App() {
  const [loginAs, setLoginAs] = useState(null);
  const [password, setPassword] = useState("");
  const [game, setGame] = useState("");
  const [detail, setDetail] = useState("");
  const [harga, setHarga] = useState("");
  const [list, setList] = useState([]);

  /* load data */
  useEffect(() => {
    const data = localStorage.getItem("stok");
    if (data) setList(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("stok", JSON.stringify(list));
  }, [list]);

  /* LOGIN */
  const login = () => {
    if (!loginAs || password !== sellers[loginAs].pass) {
      alert("Login gagal");
      return;
    }
    alert(`Login sebagai ${loginAs}`);
  };

  const logout = () => {
    setLoginAs(null);
    setPassword("");
  };

  /* ADD STOK */
  const tambah = () => {
    if (!game || !detail || !harga) return alert("Lengkapi data!");
    setList([{ game, detail, harga, seller: loginAs }, ...list]);
    setGame(""); setDetail(""); setHarga("");
  };

  /* BUY */
  const buy = (item) => {
    const msg = `Halo ${item.seller}, saya mau beli akun:\n\n🎮 ${item.game}\n📌 ${item.detail}\n💰 Rp ${item.harga}`;
    window.open(
      `https://wa.me/${sellers[item.seller].phone}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  /* LOGIN PAGE */
  if (!loginAs) {
    return (
      <div className="login">
        <h2>SELLER LOGIN</h2>
        <select onChange={(e) => setLoginAs(e.target.value)}>
          <option value="">Pilih Seller</option>
          <option>WANZ</option>
          <option>DAEN</option>
          <option>GIO</option>
        </select>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={login}>LOGIN</button>

        <p className="viewer">
          <button onClick={() => setLoginAs("VIEWER")}>
            Masuk Sebagai Buyer
          </button>
        </p>
      </div>
    );
  }

  return (
    <>
      <header>
        <img src="/logo.png" alt="logo" />
        <h1>STOK AKUN<br />WANZ × DAEN × GIO</h1>
        {loginAs !== "VIEWER" && (
          <button className="logout" onClick={logout}>LOGOUT</button>
        )}
      </header>

      {loginAs !== "VIEWER" && (
        <div className="form">
          <input placeholder="Game" value={game} onChange={(e)=>setGame(e.target.value)} />
          <input placeholder="Detail akun" value={detail} onChange={(e)=>setDetail(e.target.value)} />
          <input placeholder="Harga" value={harga} onChange={(e)=>setHarga(e.target.value)} />
          <button onClick={tambah}>+ TAMBAH</button>
        </div>
      )}

      <div className="list">
        {list.map((item, i)=>(
          <div className="card" key={i}>
            <span className={`badge ${item.seller}`}>{item.seller}</span>
            <h3>{item.game}</h3>
            <p>{item.detail}</p>
            <p className="price">Rp {item.harga}</p>
            <button className="buy" onClick={()=>buy(item)}>BELI AKUN 🔥</button>
          </div>
        ))}
      </div>
    </>
  );
        }
