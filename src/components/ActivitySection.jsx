import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ActivitySection.module.css'; // Crie um arquivo CSS para estilos

const ActivitySection = () => {
    const [accessCode, setAccessCode] = useState('');
    const navigate = useNavigate();

    const handleAccessActivity = (e) => {
        e.preventDefault();
        fetch(`http://localhost:4000/activities?accessCode=${accessCode}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.length > 0) {
                    const activity = data[0];
                    navigate(`/aA/${activity.id}`);
                } else {
                    alert('Activity not found');
                }
            })
            .catch((err) => console.log(err));
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
                        <p>Aprimore suas habilidades gramaticais com esta atividade envolvente, projetada para melhorar a estrutura e a clareza das frases.</p>
                        <li><a href="/activity/2">Atividade 2</a></li>
                        <p>Pratique a construção de vocabulário com foco em expressões e frases comuns do dia a dia.</p>
                        <li><a href="/activity/3">Atividade 3</a></li>
                        <p>Melhore sua compreensão auditiva com perguntas baseadas em áudio sobre diversos temas da vida real.</p>
                    </ul>
                </div>

                {/* Criar Atividade Personalizada */}
                <div className={styles.customActivity}>
                    <h2 style={{ color: '#f21b3f' }}>Criar Atividade Personalizada</h2>
                    <p>Crie suas próprias atividades personalizadas, adaptadas aos seus objetivos e interesses. Personalize os desafios para tornar o aprendizado mais eficaz e envolvente.</p>
                    <button style={{ backgroundColor: '#f21b3f', color: '#fff' }}>
                        <a href="/ce">Criar</a>
                    </button>
                </div>

                {/* Acessar Atividade por Código */}
                <div className={styles.accessActivity}>
                    <h2 style={{ color: '#f21b3f' }}>Acessar Atividade por Código</h2>
                    <p>Tem um código de acesso? Insira-o aqui para desbloquear uma atividade exclusiva, criada especialmente para você. Explore novos desafios e conteúdos personalizados.</p>
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