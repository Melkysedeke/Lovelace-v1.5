import { useState } from 'react';
import styles from './ActivitySection.module.css'; // Crie um arquivo CSS para estilos

const ActivitySection = () => {
    const [activityName, setActivityName] = useState('');
    const [accessCode, setAccessCode] = useState('');

    const handleCreateActivity = (e) => {
        e.preventDefault();
        // Lógica para criar a atividade personalizada
        console.log('Atividade criada:', activityName);
        setActivityName('');
    };

    const handleAccessActivity = (e) => {
        e.preventDefault();
        // Lógica para acessar a atividade usando o código
        console.log('Acessando atividade com código:', accessCode);
        setAccessCode('');
    };

    return (
        <section className={styles.activitySection}>
            <h1 style={{ color: '#f21b3f' }}>Atividades</h1>
            <div className={styles.container}>
                {/* Atividades Predeterminadas */}
                <div className={styles.predefinedActivities}>
                    <h2 style={{ color: '#f21b3f' }}>Atividades Predeterminadas</h2>
                    <ul>
                        <li><a href="/activity/1">Atividade 1</a></li>
                        <li><a href="/activity/2">Atividade 2</a></li>
                        <li><a href="/activity/3">Atividade 3</a></li>
                    </ul>
                </div>

                {/* Criar Atividade Personalizada */}
                <div className={styles.customActivity}>
                    <h2 style={{ color: '#f21b3f' }}>Criar Atividade Personalizada</h2>
                    <form onSubmit={handleCreateActivity}>
                        <input 
                            type="text" 
                            placeholder="Nome da Atividade" 
                            value={activityName}
                            onChange={(e) => setActivityName(e.target.value)}
                            required
                        />
                        <button type="submit" style={{ backgroundColor: '#f21b3f', color: '#fff' }}>
                            Criar
                        </button>
                    </form>
                </div>

                {/* Acessar Atividade por Código */}
                <div className={styles.accessActivity}>
                    <h2 style={{ color: '#f21b3f' }}>Acessar Atividade por Código</h2>
                    <form onSubmit={handleAccessActivity}>
                        <input 
                            type="text" 
                            placeholder="Código de Acesso" 
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                            required
                        />
                        <button type="submit" style={{ backgroundColor: '#f21b3f', color: '#fff' }}>
                            Acessar
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ActivitySection;