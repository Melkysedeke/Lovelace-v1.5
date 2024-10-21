import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ActivitySection.module.css'; // Crie um arquivo CSS para estilos

const ActivitySection = () => {
    const [accessCode, setAccessCode] = useState(''); // Armazena o código de acesso
    const [inputVisible, setInputVisible] = useState(false); // Controla a visibilidade do input
    const [error, setError] = useState(null); // Armazena mensagens de erro
    const navigate = useNavigate(); // Hook para navegação
    const [timer, setTimer] = useState(null); // Armazena o ID do timer

    useEffect(() => {
        // Limpa o timer ao desmontar ou ao mudar a visibilidade do input
        return () => clearTimeout(timer);
    }, [timer]);

    const handleAccessActivity = (e) => {
        e.preventDefault();

        // Se o input não estiver visível, mostre o input
        if (!inputVisible) {
            setInputVisible(true);
            setError(null); // Limpa o erro ao abrir o input
            // Inicia um timer de 7 segundos
            const newTimer = setTimeout(() => {
                setInputVisible(false);
                setAccessCode(''); // Limpa o código de acesso se o input for fechado
            }, 7000);
            setTimer(newTimer);
        } else if (accessCode.trim()) {
            // Se o input já está visível e preenchido, verifique a atividade
            fetch(`http://localhost:4000/activities?accessCode=${accessCode}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.length > 0) {
                        const activity = data[0];
                        navigate(`/aA/${activity.id}`); // Navega para a atividade com base no id
                    } else {
                        setError('Atividade não encontrada'); // Mostra mensagem se não encontrar
                    }
                })
                .catch((err) => {
                    console.error(err);
                    setError('Erro ao acessar a atividade.'); // Captura erros de requisição
                });
        } else {
            // Se o input está visível mas o código está vazio
            setError('Por favor, insira um código de acesso.');
        }
    };

    const handleInputChange = (e) => {
        setAccessCode(e.target.value);
        if (timer) {
            clearTimeout(timer); // Limpa o timer se o usuário estiver digitando
            setTimer(null); // Reseta o timer
        }
    };

    useEffect(() => {
        if (inputVisible && accessCode.trim() === '') {
            // Reinicia o timer se o input estiver visível e o código de acesso estiver vazio
            const newTimer = setTimeout(() => {
                setInputVisible(false);
                setAccessCode(''); // Limpa o código de acesso se o input for fechado
            }, 7000);
            setTimer(newTimer);

            // Limpa o timer ao desmontar ou ao mudar a visibilidade do input
            return () => clearTimeout(newTimer);
        }
    }, [inputVisible, accessCode]);

    return (
        <section className={styles.activitySection}>
                {/* Atividades Predeterminadas */}
                <section className={styles.predefinedActivities}>
                    <h2>Prática</h2>
                    <p>Experimente atividades pré-estabelecidas, desenvolvidas para aprimorar suas habilidades e reforçar conceitos essenciais, oferecendo uma prática estruturada e enriquecedora para seu aprendizado.</p>
                    <button><a href="/#">Go ahead</a></button>
                </section>

                {/* Criar Atividade Personalizada */}
                <section className={styles.customActivity}>
                    <h2>Atividade Personalizada</h2>
                    <p>Crie suas próprias atividades personalizadas, adaptadas aos seus objetivos e interesses. Personalize os desafios para tornar o aprendizado mais eficaz e envolvente.</p>
                    <button>
                        <a href="/ce">Criar</a>
                    </button>
                </section>

                {/* Acessar Atividade por Código */}
                <section className={styles.accessActivity}>
                    <h2>Acessar Atividade</h2>
                    <p>Tem um código de acesso? Insira-o aqui para desbloquear uma atividade exclusiva, criada especialmente para você. Explore novos desafios e conteúdos personalizados.</p>
                    
                    <form onSubmit={handleAccessActivity}>
                        {inputVisible && (
                            <input
                                type="text"
                                placeholder="Código de Acesso"
                                value={accessCode}
                                onChange={handleInputChange}
                                required
                            />
                        )}
                        <button type="submit">
                            {inputVisible ? 'Acessar' : 'Código'}
                        </button>
                    </form>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </section>
                {/* <section>
                    <h2>Galeria</h2>
                    <p>Já tem atividades criadas? Acesse a galeria para visualizá-las, acompanhar o progresso e gerenciar suas atividades personalizadas de forma prática.</p>
                    <button><a href="/#">Go ahead</a></button>
                </section> */}
        </section>
    );
};

export default ActivitySection;