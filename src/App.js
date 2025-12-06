import "./styles.css";
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

const sellers = {
  WANZ: { phone: "62881027154473", pass: "wanz123" },
  DAEN: { phone: "6283133581399", pass: "daen123" },
  GIO:  { phone: "6285715635425", pass: "gio123" },
};

export default function App() {
  const [loginAs, setLoginAs] = useState("BUYER");
  const [password, setPassword] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [game, setGame] = useState("");
  const [detail, setDetail] = useState("");
  const [harga, setHarga] = useState("");
  const [fotoLink, setFotoLink] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDocs(collection(db, "accounts"));
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setList(data);
      } catch (err) {
        console.error("Gagal fetch Firestore:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const login = () => {
    if (!sellers[selectedRole] || password !== sellers[selectedRole].pass) {
      alert("Login gagal");
      return;
    }
    setLoginAs(selectedRole);
    setShowLoginForm(false);
    setPassword("");
    setSelectedRole("");
    alert(`Login sebagai ${selectedRole}`);
  };

  const logout = () => {
    setLoginAs("BUYER");
    setPassword("");
    setSelectedRole("");
  };

  const tambah = async () => {
    if (!game || !detail || !harga) return alert("Lengkapi data!");
    const newItem = { game, detail, harga, seller: loginAs, sold: false, foto: fotoLink };
    try {
      const docRef = await addDoc(collection(db, "accounts"), newItem);
      setList([{ id: docRef.id, ...newItem }, ...list]);
    } catch (err) {
      console.error("Gagal menambah akun:", err);
      alert("Gagal menambah akun");
    }
    setGame(""); setDetail(""); setHarga(""); setFotoLink("");
  };

  const markSold = async (id) => {
    try {
      await updateDoc(doc(db, "accounts", id), { sold: true });
      setList(list.map(item => item.id === id ? { ...item, sold: true } : item));
    } catch (err) {
      console.error("Gagal mark sold:", err);
    }
  };

  const hapus = async (id) => {
    if (!window.confirm("Hapus stok ini?")) return;
    try {
      await deleteDoc(doc(db, "accounts", id));
      setList(list.filter(item => item.id !== id));
    } catch (err) {
      console.error("Gagal hapus akun:", err);
    }
  };

  const buy = (item) => {
    if (item.sold) return;

    let msg = `Halo ${item.seller}, saya mau beli akun:\n\n🎮 ${item.game}\n📌 ${item.detail}\n💰 Rp ${item.harga}`;
    if (item.foto) {
      msg += `\n🖼️ [LIHAT FOTO AKUN](${item.foto})`;
    }

    window.open(
      `https://wa.me/${sellers[item.seller].phone}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  if (loading) return <div style={{ padding: "20px" }}>Loading...</div>;

  const isSeller = loginAs !== "BUYER";

  return (
    <>
      <header>
        <img src="/logo.png" alt="logo" />
        <h1>
          STOK AKUN<br />WANZ × DAEN × GIO
        </h1>
        {!isSeller && (
          <button className="logout" onClick={() => setShowLoginForm(!showLoginForm)}>ADMIN</button>
        )}
        {isSeller && <button className="logout" onClick={logout}>LOGOUT</button>}
      </header>

      {/* Form login admin/seller */}
      {showLoginForm && !isSeller && (
        <div className="login adminLogin">
          <img src="/logo.png" alt="logo" style={{
            width: "80px", height: "80px", borderRadius: "50%", border: "3px solid #5fa8ff", marginBottom: "12px"
          }} />
          <select onChange={(e) => setSelectedRole(e.target.value)} value={selectedRole}>
            <option value="">Pilih Role</option>
            <option>WANZ</option>
            <option>DAEN</option>
            <option>GIO</option>
          </select>
          {selectedRole && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
          {selectedRole && <button onClick={login}>MASUK</button>}
        </div>
      )}

      {/* Form tambah akun */}
      {isSeller && (
        <div className="form">
          <input placeholder="Game" value={game} onChange={(e)=>setGame(e.target.value)} />
          <input placeholder="Detail akun" value={detail} onChange={(e)=>setDetail(e.target.value)} />
          <input placeholder="Harga" value={harga} onChange={(e)=>setHarga(e.target.value)} />
          <input 
            placeholder="Link foto akun"
            value={fotoLink}
            onChange={(e) => setFotoLink(e.target.value)}
          />
          <button onClick={tambah}>+ TAMBAH</button>
        </div>
      )}

      {/* List akun */}
      <div className="list">
        {list.map((item)=>(
          <div className={`card ${item.sold ? "sold" : ""}`} key={item.id}>
            {item.foto && <img src={item.foto} alt={item.game} className="cardImg" />}
            <span className={`badge ${item.seller}`}>{item.seller}</span>
            <h3>{item.game}</h3>
            <p>{item.detail}</p>
            <p className="price">Rp {item.harga}</p>
            {!item.sold && <button className="buy" onClick={()=>buy(item)}>BELI AKUN 🔥</button>}
            {item.sold && <div className="soldBadge">SOLD ❌</div>}
            {isSeller && loginAs === item.seller && (
              <div className="adminBtn">
                {!item.sold && <button className="soldBtn" onClick={()=>markSold(item.id)}>SOLD</button>}
                <button className="delBtn" onClick={()=>hapus(item.id)}>DELETE</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
          }
