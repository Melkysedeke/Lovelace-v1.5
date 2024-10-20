import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import styles from './ActivityGallery.module.css';

function ActivityGallery() {
    const [activities, setActivities] = useState([]);
    const [, setUser] = useState(null); 

    useEffect(() => {
        // Pegando os dados do usuário armazenados no sessionStorage
        const storedUser = JSON.parse(sessionStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser); 
        }
        // Pegando o ID do usuário logado
        const userId = storedUser ? storedUser.id : null;
        if (userId) {
            fetch(`http://localhost:4000/activities?userId=${userId}`)
                .then(resp => resp.json())
                .then(data => setActivities(data))
                .catch(err => console.log(err));
        }
    }, []);

    // Função para excluir uma atividade
    const deleteActivity = (activityId) => {
        if (window.confirm("Tem certeza que deseja excluir esta atividade?")) {
            fetch(`http://localhost:4000/activities/${activityId}`, {
                method: 'DELETE',
            })
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error("Erro ao excluir a atividade.");
                }
                // Remover a atividade excluída da lista
                setActivities(activities.filter(activity => activity.id !== activityId));
                alert("Atividade excluída com sucesso!");
            })
            .catch((err) => console.error('Erro ao excluir atividade:', err));
        }
    };

    return (
        <section className={styles.gallery}>
            <div className={styles.galleryContainer}>
                {activities.length > 0 ? (
                    activities.map(activity => (
                        <div key={activity.id} className={styles.activityCard}>
                            <h2>{activity.name}</h2>                           
                            <div className={styles.links}>
                                <p>{new Date(activity.date).toLocaleDateString('pt-BR')}</p>
                                <div>
                                    <Link to={`/eA/${activity.id}`} className={styles.linkButton}>Acompanhar</Link>
                                    <Link to={`/rA/${activity.id}`} className={styles.linkButton}>Respostas</Link>
                                    <button
                                        className={styles.deleteButton}
                                        onClick={() => deleteActivity(activity.id)}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Você ainda não criou nenhuma atividade.</p>
                )}
            </div>
        </section>
    );
}

export default ActivityGallery;
