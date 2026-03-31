import { useContext } from "react";
import { AuthContext } from "../AuthContext";

export default function Profile() {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h1>Profilom</h1>

      <div
        style={{
          padding: "20px",
          background: "#f5f5f5",
          borderRadius: "8px",
          border: "1px solid #ddd"
        }}
      >
        <p><strong>Felhasználónév:</strong> {user.username}</p>
        <p><strong>Felhasználó ID:</strong> {user.id}</p>

        {/* Ha a backend küld joined_date-et, akkor ezt is megjelenítjük, már ha küldi...*/}
        {user.joined_date && (
          <p><strong>Csatlakozott:</strong> {user.joined_date}</p>
        )}
      </div>
    </div>
  );
}