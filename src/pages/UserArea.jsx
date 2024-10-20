import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ActivityGallery from "../components/ActivityGallery"
import styles from "./UserArea.module.css"
import ActivitySection from "../components/Activitysection";

export default function UserArea() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false); // Estado para controlar o menu

  useEffect(() => {
    try {
        const storedUser  = JSON.parse(sessionStorage.getItem('user'));
        if (storedUser ) {
            setUser (storedUser);
            console.log(storedUser)
        } else {
            navigate("/");
        }
    } catch (error) {
        console.error("Erro ao analisar o usuário do sessionStorage:", error);
        navigate("/");
    }
    }, [navigate]);

    const toggleMenu = () => {
      setMenuVisible(!menuVisible);
    };
  
    const handleLogout = () => {
      sessionStorage.removeItem('user');
      navigate("/");
    };

  // Função para alternar visibilidade da senha
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1><a href="/ua">Lovelace</a></h1>
        <div className={styles.userInfo}>
          {user ? (
            <>
              <p onClick={toggleMenu}>{user.name}</p>
              <div>
                <img 
                  onClick={toggleMenu} 
                  src={user.profileImage || '/defaultProfile.png'} 
                  alt="Avatar do usuário" 
                  className={styles.userImage} 
                />
                {menuVisible && (
                  <div className={styles.dropdownMenu}>
                    <ul>
                      <li onClick={() => navigate("/profile")}>Perfil</li>
                      <li onClick={handleLogout}>Logout</li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          ) : (
            <p>loading...</p>
          )}
        </div>
      </header>
      <ActivitySection/>
      <ActivityGallery/>
    </div>
  );
}