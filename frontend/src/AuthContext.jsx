import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Betöltéskor megnézzük, vóna-e tóóken
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8000/api/me/", {
      headers: {
        Authorization: `Token ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Invalid token");
        return res.json();
      })
      .then(data => setUser(data))
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      });
  }, []);

  // Bejelentkezéskor elmentjük a token-t és lekérjük a user adatokat, de módositjuk annyival, hogy adunk egy visszajelzést a login kérésre az if elágazással, hogy sikeres volt-e vagy sem..
  async function login(token) {
    localStorage.setItem("token", token);

    try {
      const res = await fetch("http://localhost:8000/api/me/", {
        headers: { Authorization: `Token ${token}` }
      });

      if (!res.ok) throw new Error("Invalid token");

      const data = await res.json();
      setUser(data);

    } catch {
      localStorage.removeItem("token");
      setUser(null);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }


  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}