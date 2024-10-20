import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ActivityResponses.module.css';

function ActivityResponses() {
    const { id } = useParams();  // ID da atividade
    const [activity, setActivity] = useState(null);
    const [responses, setResponses] = useState([]);
    const [user, setUser ] = useState(null);
    const [expandedIndex, setExpandedIndex] = useState(null); // Estado para controlar qual card está expandido
    const navigate = useNavigate();

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
     
    useEffect(() => {
        // Carregar a atividade e suas respostas
        fetch(`http://localhost:4000/activities/${id}`)
            .then(response => response.json())
            .then(data => setActivity(data))
            .catch(err => console.log(err));

        // Carregar as respostas submetidas
        fetch(`http://localhost:4000/responses?activityId=${id}`)
            .then(response => response.json())
            .then(data => setResponses(data))
            .catch(err => console.log(err));
    }, [id]);

    if (!activity) {
        return <div>Carregando atividade...</div>;
    }

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

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
                        <p></p>
                    )}
                </div>
            </header>
            <h1>Respostas para: {activity.name}</h1>
            <p>{activity.description}</p>
            <div className={styles.responsesSection}>
                {responses.length > 0 ? (
                    responses.map((response, index) => (
                        <div key={response.id} className={styles.responseCard} onClick={() => toggleExpand(index)} style={{ cursor: 'pointer' }} >
                            <h3>
                                Resposta {index + 1} por {response.user}:
                            </h3>
                            <p className={styles.date}>Data: {new Date(response.date).toLocaleDateString()}</p>
                            {expandedIndex === index && ( // Verifica se o card está expandido
                                <div className={styles.answers}>
                                    {activity.questions.map((question, i) => (
                                        <div key={question.id} className={styles.questionBlock}>
                                            <p className={styles.question}><strong>{i + 1}. {question.text}</strong></p>
                                            <p className={styles.answer}>{response.answers[i]?.text || 'Sem resposta'}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>Nenhuma resposta foi enviada ainda.</p>
                )}
            </div>
        </div>
    );
}

export default ActivityResponses;