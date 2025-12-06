import "./styles.css";
import { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

// === SELLER WHATSAPP ===
const sellers = {
  WANZ: "62881027154473",
  GIO: "6285715635425",
  DAEN: "6283133581399",
};

// === ADMIN LOGIN ===
const ADMIN = {
  username: "admin",
  password: "admin123",
};

// === SELLER LOGIN ===
const SELLER_LOGIN = {
  WANZ: "wanz123",
  DAEN: "daen123",
  GIO: "gio123",
};

export default function App() {
  // === ADMIN STATE ===
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("admin") === "true"
  );
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");

  // === SELLER STATE ===
  const [sellerLogin, setSellerLogin] = useState(
    localStorage.getItem("seller") || ""
  );
  const [sellerPass, setSellerPass] = useState("");

  // === DATA STATE ===
  const [game, setGame] = useState("");
  const [detail, setDetail] = useState("");
  const [harga, setHarga] = useState("");
  const [seller, setSeller] = useState("DAEN");
  const [list, setList] = useState([]);

  // === FETCH DATA ===
  const fetchData = async () => {
    const snap = await getDocs(collection(db, "accounts"));
    const data = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    setList(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // === ADMIN LOGIN ===
  const loginAdmin = () => {
    if (adminUser === ADMIN.username && adminPass === ADMIN.password) {
      setIsAdmin(true);
      localStorage.setItem("admin", "true");
      alert("Admin login berhasil");
    } else {
      alert("Login admin gagal");
    }
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem("admin");
  };

  // === SELLER LOGIN ===
  const loginSeller = () => {
    if (SELLER_LOGIN[sellerLogin] === sellerPass) {
      localStorage.setItem("seller", sellerLogin);
      alert("Seller login berhasil");
    } else {
      alert("Login seller gagal");
    }
  };

  const logoutSeller = () => {
    localStorage.removeItem("seller");
    setSellerLogin("");
  };

  // === TAMBAH DATA (ADMIN / SELLER) ===
  const tambah = async () => {
    if (!game || !detail || !harga) return alert("Lengkapi data!");

    await addDoc(collection(db, "accounts"), {
      game,
      detail,
      harga,
      seller: isAdmin ? seller : sellerLogin,
      sold: false,
    });

    setGame("");
    setDetail("");
    setHarga("");
    fetchData();
  };

  // === SOLD ===
  const markSold = async (id) => {
    await updateDoc(doc(db, "accounts", id), { sold: true });
    fetchData();
  };

  // === DELETE ===
  const deleteItem = async (id) => {
    if (!window.confirm("Hapus akun ini?")) return;
    await deleteDoc(doc(db, "accounts", id));
    fetchData();
  };

  // === BUY ===
  const buy = (item) => {
    const msg = `Halo ${item.seller}, saya mau beli akun:\n\n🎮 ${item.game}\n📌 ${item.detail}\n💰 Rp ${item.harga}`;
    window.open(
      `https://wa.me/${sellers[item.seller]}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  // === FILTER LIST ===
  const filteredList = isAdmin
    ? list
    : sellerLogin
    ? list.filter((i) => i.seller === sellerLogin)
    : list;

  return (
    <>
      <header>
        <h1>STOK AKUN</h1>
        <p>WANZ × DAEN × GIO</p>
      </header>

      {/* === ADMIN LOGIN === */}
      {!isAdmin && !sellerLogin && (
        <div className="admin-login">
          <h3>ADMIN LOGIN</h3>
          <input placeholder="Username" onChange={(e) => setAdminUser(e.target.value)} />
          <input type="password" placeholder="Password" onChange={(e) => setAdminPass(e.target.value)} />
          <button onClick={loginAdmin}>LOGIN ADMIN</button>

          <hr />

          <h3>SELLER LOGIN</h3>
          <select onChange={(e) => setSellerLogin(e.target.value)}>
            <option value="">Pilih Seller</option>
            <option>WANZ</option>
            <option>DAEN</option>
            <option>GIO</option>
          </select>
          <input type="password" placeholder="Password" onChange={(e) => setSellerPass(e.target.value)} />
          <button onClick={loginSeller}>LOGIN SELLER</button>
        </div>
      )}

      {/* === FORM TAMBAH === */}
      {(isAdmin || sellerLogin) && (
        <div className="form">
          <input placeholder="Game" value={game} onChange={(e) => setGame(e.target.value)} />
          <input placeholder="Detail" value={detail} onChange={(e) => setDetail(e.target.value)} />
          <input placeholder="Harga" value={harga} onChange={(e) => setHarga(e.target.value)} />

          {isAdmin && (
            <select value={seller} onChange={(e) => setSeller(e.target.value)}>
              <option>DAEN</option>
              <option>GIO</option>
              <option>WANZ</option>
            </select>
          )}

          <button onClick={tambah}>+ TAMBAH</button>

          {isAdmin ? (
            <button onClick={logoutAdmin}>LOGOUT ADMIN</button>
          ) : (
            <button onClick={logoutSeller}>LOGOUT SELLER</button>
          )}
        </div>
      )}

      {/* === LIST === */}
      <div className="list">
        {filteredList.map((item) => (
          <div className="card" key={item.id}>
            <span className="badge">{item.seller}</span>
            {item.sold && <span className="sold">SOLD</span>}

            <h3>{item.game}</h3>
            <p>{item.detail}</p>
            <p className="price">Rp {item.harga}</p>

            {!item.sold && !isAdmin && !sellerLogin && (
              <button onClick={() => buy(item)}>BELI 🔥</button>
            )}

            {(isAdmin || sellerLogin === item.seller) && (
              <div className="admin-action">
                {!item.sold && (
                  <button onClick={() => markSold(item.id)}>✅ SOLD</button>
                )}
                <button onClick={() => deleteItem(item.id)}>🗑 DELETE</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
  }
