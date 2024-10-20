import { useState } from 'react';
import styles from './ConfirmationModal.module.css'; // Certifique-se de criar um arquivo CSS para estilos

const ConfirmationModal = ({ isVisible, onConfirm, onCancel }) => {
    if (!isVisible) return null; // Se não estiver visível, não renderiza nada

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Tem certeza que?</h2>
                <p>Você está prestes a realizar uma ação.</p>
                <div className={styles.buttonContainer}>
                    <button onClick={onConfirm} className={styles.confirmButton}>Sim</button>
                    <button onClick={onCancel} className={styles.cancelButton}>Não</button>
                </div>
            </div>
        </div>
    );
};

const App = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [actionToConfirm, setActionToConfirm] = useState(null); // Armazena a ação a ser confirmada

    const handleAction = () => {
        // Aqui você pode definir a ação que deseja realizar
        console.log('Ação realizada!');
    };

    const requestAction = () => {
        setActionToConfirm(handleAction); // Armazena a ação que será confirmada
        setModalVisible(true); // Mostra o modal de confirmação
    };

    const handleConfirm = () => {
        if (actionToConfirm) {
            actionToConfirm(); // Executa a ação confirmada
        }
        setModalVisible(false); // Fecha o modal
        setActionToConfirm(null); // Limpa a ação a ser confirmada
    };

    const handleCancel = () => {
        console.log('Ação cancelada!');
        setModalVisible(false); // Fecha o modal
        setActionToConfirm(null); // Limpa a ação a ser confirmada
    };

    return (
        <div>
            <button onClick={requestAction}>Realizar Ação</button>
            <ConfirmationModal 
                isVisible={isModalVisible} 
                onConfirm={handleConfirm} 
                onCancel={handleCancel} 
            />
        </div>
    );
};

export default App;