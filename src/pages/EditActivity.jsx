import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormActivity from './FormActivity'; // Reutilizando o componente de formulário

function EditActivity() {
    const { id } = useParams(); // Pegando o ID da URL
    const [activity, setActivity] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Buscar a atividade pelo ID
        fetch(`http://localhost:4000/activities/${id}`)
            .then((resp) => resp.json())
            .then((data) => setActivity(data))
            .catch((err) => console.error('Erro ao carregar a atividade:', err));
    }, [id]);

    const handleSubmit = (updatedActivity) => {
        // Atualizar a atividade no banco de dados
        return fetch(`http://localhost:4000/activities/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedActivity),
        })
        .then((resp) => resp.json())
        .then(() => {
            navigate(`/a/${id}`);
        });
    };

    return (
        <>
            {activity ? (
                <FormActivity handleSubmit={handleSubmit} activity={activity} />
            ) : (
                <p>Carregando atividade...</p>
            )}
        </>
    );
}

export default EditActivity;
