import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './AccessActivity.module.css';
import TextArea from '../components/TextArea';

function AccessActivity() {
    const { id } = useParams(); // ID da atividade
const [activity, setActivity] = useState(null);
const [responses, setResponses] = useState([]);
const [name, setName] = useState(""); // Inicializar com string vazia
const [user, setUser] = useState(null);
const [error, setError] = useState(null); // Para capturar erros
const navigate = useNavigate();

// useEffect para carregar o usuário do sessionStorage
useEffect(() => {
    try {
        const storedUser = JSON.parse(sessionStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            setName(storedUser.name || ""); // Atualiza o nome após carregar o usuário
        } else {
            navigate("/");
        }
    } catch (error) {
        console.error("Erro ao analisar o usuário do sessionStorage:", error);
        navigate("/");
    }
}, [navigate]);

// useEffect para buscar detalhes da atividade
useEffect(() => {
    fetch(`http://localhost:4000/activities/${id}`)
        .then(response => response.json())
        .then(data => {
            setActivity(data);
            setResponses(data.questions.map(question => ({
                id: question.id,
                text: ''
            })));
        })
        .catch((err) => {
            console.error('Erro ao carregar atividade:', err);
            setError('Erro ao carregar a atividade. Tente novamente mais tarde.');
        });
}, [id]);

// Função para lidar com mudanças nas respostas
const handleResponseChange = (questionId, value) => {
    const updatedResponses = responses.map(response => {
        if (response.id === questionId) {
            return { ...response, text: value };
        }
        return response;
    });
    setResponses(updatedResponses);
};

// Função para enviar as respostas
const submitResponses = (e) => {
    e.preventDefault();

    // Validar se o nome foi preenchido
    if (!name.trim()) {
        setError("Por favor, insira seu nome antes de enviar as respostas.");
        return;
    }

    // Criar objeto para submissão das respostas
    const submission = {
        activityId: id,
        answers: responses,
        user: name || "Anônimo", // Usar o nome fornecido ou 'Anônimo' como padrão
        date: new Date().toISOString(), // Timestamp da resposta
    };

    // Enviar respostas para o servidor
    fetch('http://localhost:4000/responses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
    })
    .then(resp => {
        if (!resp.ok) {
            throw new Error('Erro ao enviar respostas.');
        }
        return resp.json();
    })
    .then(data => {
        console.log('Respostas enviadas:', data);
        alert('Respostas submetidas com sucesso!');
        setTimeout(() => {
            navigate("/");
        }, 2000);  // Tempo de espera de 2 segundos
    })
    .catch((err) => {
        console.error('Erro ao enviar respostas:', err);
        setError('Erro ao enviar suas respostas. Tente novamente.');
    });
};

if (error) {
    return <div>{error}</div>;
}

if (!activity) {
    return <div>Carregando...</div>;
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
                    <p></p>
                )}
                </div>
            </header>
            <div className={styles.headerTop}>
                <h1>{activity.name}</h1>
                <p>{activity.description}</p>
            </div>
            <form className={styles.form} onSubmit={submitResponses}>
                <div className={styles.input_name}>
                    <label htmlFor="name">Seu nome:</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Insira seu nome"
                        value={user.name || ""}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={!!user.name}
                    />
                </div>
                {activity.questions.map((question) => (
                    <div key={question.id} className={styles.question}>
                        <pre className={styles.question_text}>{question.text}</pre>
                        <TextArea
                            className={styles.question_answer}
                            name="answer"
                            placeholder="Sua resposta"
                            value={responses.find(response => response.id === question.id)?.text || ''}
                            handleOnChange={(e) => handleResponseChange(question.id, e.target.value)}
                        />
                    </div>
                ))}
                <button type="submit">Enviar respostas</button>
            </form>
        </div>
    );
}

export default AccessActivity;
