import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import styles from './Profile.module.css';

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser ] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newImage, setNewImage] = useState('');
  const [imageType, setImageType] = useState('url');
  const [showTooltip, setShowTooltip] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    try {
      const storedUser  = JSON.parse(sessionStorage.getItem('user'));
      if (storedUser ) {
        setUser (storedUser );
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Erro ao analisar o usuário do sessionStorage:", error);
      navigate("/");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser ({ ...user, [name]: value });
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const saveChanges = () => {
    if (newPassword && newPassword !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }
    // Salva as alterações no sessionStorage
    sessionStorage.setItem('user', JSON.stringify(user));
    setSuccessMessage('Dados atualizados com sucesso!');
    setErrorMessage('');
    setTimeout(() => {
      navigate("/ua");
    }, 2000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewImage(event.target.result);
        setImageType('file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e) => {
    setNewImage(e.target.value);
    setImageType('url');
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const saveImage = () => {
    setUser ({ ...user, profileImage: newImage });
    sessionStorage.setItem('user', JSON.stringify({ ...user, profileImage: newImage }));
    toggleModal();
  };

  const deleteUserAccount = () => {
    // Aqui você pode adicionar a lógica para excluir a conta do usuário
    console.log('Conta excluída');
    sessionStorage.removeItem('user');
    navigate("/");
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate("/");
  };

  if (!user) {
    return <p>Carregando...</p>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1><a href="/ua">Lovelace</a></h1>
        <div className={styles.userInfo}>
          {user ? (
            <>
              <p>{user.name}</p>
              <div>
                <img 
                  src={user.profileImage || '/defaultProfile.png'} 
                  alt="Avatar do usuário" 
                  className={styles.userImage} 
                />
              </div>
            </>
          ) : (
            <p>loading...</p>
          )}
        </div>
      </header>
      <div className={styles.userProfile}>
        <div className={styles.profileHeader}>
          <div 
            className={styles.profileImgContainer}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={toggleModal}
          >
            <img 
              src={user .profileImage}
              alt="User profile"
              className={styles.profileImg}
            />
            {showTooltip && <div className={styles.tooltip}>Clique para alterar a foto</div>}
          </div>
          <h2>{user.name}</h2>
        </div>
        <div className={styles.profileDetails}>
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleInputChange}
          />

          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
          />

          <label htmlFor="bio">Biografia</label>
          <textarea
            name="bio"
            value={user.bio}
            onChange={handleInputChange}
            placeholder='Biografia'
          />
          <label htmlFor="password">Alterar senha</label>
          <input
            type="password"
            name="password"
            value={newPassword}
            onChange={handlePasswordChange}
            placeholder='Sua nova senha'
          />

          <label htmlFor="confirmPassword">Confirmação a senha</label>
          <input
            type="password"
            name="confirmPassword"
            value={newPassword}
            onChange={handleConfirmPasswordChange}
            placeholder='Confirme sua nova senha'
          />  

          {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}
          {successMessage && <p style={{ color: 'green', textAlign: 'center' }}>{successMessage}</p>}

          <button onClick={saveChanges}>Salvar Alterações</button>
          <button onClick={handleLogout}>Desconectar</button>
          <button onClick={deleteUserAccount}>Excluir Conta</button>
        </div>

        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>Alterar Foto de Perfil</h3>

              <label>
                Alterar por URL:
                <input
                  type="text"
                  value={imageType === 'url' ? newImage : ''}
                  onChange={handleUrlChange}
                />
              </label>

              <label>
                Alterar por Arquivo:
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>

              <div>
                <button className={styles.closeModalButton} onClick={saveImage}>Salvar Alterações</button>
                <button className={styles.closeModalButton} onClick={toggleModal}>Fechar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;