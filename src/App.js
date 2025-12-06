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
  const [loginAs, setLoginAs] = useState("BUYER"); // default buyer
  const [selectedRole, setSelectedRole] = useState(""); // role di form login
  const [password, setPassword] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(false); // toggle form admin
  const [game, setGame] = useState("");
  const [detail, setDetail] = useState("");
  const [harga, setHarga] = useState("");
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

  // Login seller
  const login = () => {
    if (!sellers[selectedRole] || password !== sellers[selectedRole].pass) {
      alert("Login gagal");
      return;
    }
    setLoginAs(selectedRole);
    setShowLoginForm(false);
    setSelectedRole("");
    setPassword("");
    alert(`Login sebagai ${selectedRole}`);
  };

  // Logout seller
  const logout = () => {
    setLoginAs("BUYER");
    setPassword("");
  };

  // Tambah akun
  const tambah = async () => {
    if (!game || !detail || !harga) return alert("Lengkapi data!");
    const newItem = { game, detail, harga, seller: loginAs, sold: false };

    try {
      const docRef = await addDoc(collection(db, "accounts"), newItem);
      setList([{ id: docRef.id, ...newItem }, ...list]);
    } catch (err) {
      console.error("Gagal menambah akun:", err);
      alert("Gagal menambah akun");
    }

    setGame(""); setDetail(""); setHarga("");
  };

  // Tandai sold
  const markSold = async (id) => {
    try {
      await updateDoc(doc(db, "accounts", id), { sold: true });
      setList(list.map(item => item.id === id ? { ...item, sold: true } : item));
    } catch (err) {
      console.error("Gagal mark sold:", err);
    }
  };

  // Hapus akun
  const hapus = async (id) => {
    if (!window.confirm("Hapus stok ini?")) return;
    try {
      await deleteDoc(doc(db, "accounts", id));
      setList(list.filter(item => item.id !== id));
    } catch (err) {
      console.error("Gagal hapus akun:", err);
    }
  };

  // Buy akun (WhatsApp)
  const buy = (item) => {
    if (item.sold) return;
    const msg = `Halo ${item.seller}, saya mau beli akun:\n\n🎮 ${item.game}\n📌 ${item.detail}\n💰 Rp ${item.harga}`;
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

        {/* Tombol ADMIN / LOGOUT */}
        {!isSeller && (
          <button className="logout" onClick={() => setShowLoginForm(!showLoginForm)}>
            ADMIN
          </button>
        )}
        {isSeller && (
          <button className="logout" onClick={logout}>LOGOUT</button>
        )}
      </header>

      {/* Form login admin/seller muncul di bawah header */}
      {showLoginForm && !isSeller && (
        <div className="login adminLogin">
          <img src="/logo.png" alt="logo" className="loginLogo" />

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

          {selectedRole && (
            <button onClick={login}>MASUK</button>
          )}
        </div>
      )}

      {/* Form tambah akun hanya untuk seller */}
      {isSeller && (
        <div className="form">
          <input placeholder="Game" value={game} onChange={(e)=>setGame(e.target.value)} />
          <input placeholder="Detail akun" value={detail} onChange={(e)=>setDetail(e.target.value)} />
          <input placeholder="Harga" value={harga} onChange={(e)=>setHarga(e.target.value)} />
          <button onClick={tambah}>+ TAMBAH</button>
        </div>
      )}

      {/* List akun tampil untuk semua */}
      <div className="list">
        {list.map((item)=>(
          <div className={`card ${item.sold ? "sold" : ""}`} key={item.id}>
            <span className={`badge ${item.seller}`}>{item.seller}</span>
            <h3>{item.game}</h3>
            <p>{item.detail}</p>
            <p className="price">Rp {item.harga}</p>

            {!item.sold && <button className="buy" onClick={()=>buy(item)}>BELI AKUN 🔥</button>}
            {item.sold && <div className="soldBadge">SOLD ❌</div>}

            {/* Admin buttons */}
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
