import "./styles.css";
import { useEffect, useState } from "react";
import { db, storage } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// === SELLER WHATSAPP ===
const sellersWA = {
  WANZ: "62881027154473",
  DAEN: "6283133581399",
  GIO: "6285715635425"
};

// === LOGIN DATA ===
const ADMIN = { username: "admin", password: "admin123" };

const SELLERS_LOGIN = {
  wanz: { password: "123", name: "WANZ" },
  daen: { password: "123", name: "DAEN" },
  gio: { password: "123", name: "GIO" }
};

export default function App() {
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [sellerLogin, setSellerLogin] = useState(localStorage.getItem("seller") || "");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [game, setGame] = useState("");
  const [detail, setDetail] = useState("");
  const [harga, setHarga] = useState("");
  const [seller, setSeller] = useState("WANZ");
  const [image, setImage] = useState(null);

  const [list, setList] = useState([]);

  const fetchData = async () => {
    const snap = await getDocs(collection(db, "accounts"));
    setList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // === LOGIN ===
  const login = () => {
    if (username === ADMIN.username && password === ADMIN.password) {
      setRole("admin");
      localStorage.setItem("role", "admin");
      return;
    }

    const s = SELLERS_LOGIN[username];
    if (s && s.password === password) {
      setRole("seller");
      setSellerLogin(s.name);
      localStorage.setItem("role", "seller");
      localStorage.setItem("seller", s.name);
      return;
    }

    alert("Login gagal");
  };

  const logout = () => {
    localStorage.clear();
    setRole("");
    setSellerLogin("");
  };

  // === TAMBAH AKUN ===
  const tambah = async () => {
    if (!game || !detail || !harga) return alert("Lengkapi data");

    let imageUrl = "";
    if (image) {
      const imgRef = ref(storage, `akun/${Date.now()}-${image.name}`);
      await uploadBytes(imgRef, image);
      imageUrl = await getDownloadURL(imgRef);
    }

    await addDoc(collection(db, "accounts"), {
      game,
      detail,
      harga,
      seller: role === "admin" ? seller : sellerLogin,
      image: imageUrl,
      sold: false
    });

    setGame("");
    setDetail("");
    setHarga("");
    setImage(null);
    fetchData();
  };

  // === ACTION ===
  const tandaiSold = async (id) => {
    await updateDoc(doc(db, "accounts", id), { sold: true });
    fetchData();
  };

  const hapus = async (id) => {
    if (window.confirm("Hapus akun?")) {
      await deleteDoc(doc(db, "accounts", id));
      fetchData();
    }
  };

  const buy = (item) => {
    if (item.sold) return;
    const msg = `Halo ${item.seller}, saya mau beli akun:\n\n🎮 ${item.game}\n📌 ${item.detail}\n💰 Rp ${item.harga}`;
    window.open(
      `https://wa.me/${sellersWA[item.seller]}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  // === LOGIN PAGE ===
  if (!role) {
    return (
      <div className="login">
        <h2>LOGIN</h2>
        <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button onClick={login}>LOGIN</button>
      </div>
    );
  }

  return (
    <>
      <header>
        <img src="/logo.png" alt="logo" />
        <h1>STOK AKUN<br />WANZ × DAEN × GIO</h1>
        <button className="logout" onClick={logout}>LOGOUT</button>
      </header>

      {(role === "admin" || role === "seller") && (
        <div className="form">
          <input placeholder="Game" value={game} onChange={e => setGame(e.target.value)} />
          <input placeholder="Detail" value={detail} onChange={e => setDetail(e.target.value)} />
          <input placeholder="Harga" value={harga} onChange={e => setHarga(e.target.value)} />
          <input type="file" onChange={e => setImage(e.target.files[0])} />

          {role === "admin" && (
            <select value={seller} onChange={e => setSeller(e.target.value)}>
              <option>WANZ</option>
              <option>DAEN</option>
              <option>GIO</option>
            </select>
          )}

          <button onClick={tambah}>+ TAMBAH AKUN</button>
        </div>
      )}

      <div className="list">
        {list.map(item => (
          <div className="card" key={item.id}>
            {item.image && <img src={item.image} alt="" />}
            {item.sold && <div className="sold">SOLD</div>}
            <span className="badge">{item.seller}</span>
            <h3>{item.game}</h3>
            <p>{item.detail}</p>
            <p className="price">Rp {item.harga}</p>

            {!item.sold && (
              <button onClick={() => buy(item)}>BELI</button>
            )}

            {role === "admin" && (
              <div className="admin-btn">
                <button onClick={() => tandaiSold(item.id)}>SOLD</button>
                <button onClick={() => hapus(item.id)}>DELETE</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
