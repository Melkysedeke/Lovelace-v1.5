import { useState } from 'react';
import styles from './Dictionary.module.css'; // Importa o CSS

const Dictionary = () => {
  const [word, setWord] = useState(''); // Estado para armazenar a palavra
  const [definition, setDefinition] = useState(null); // Estado para armazenar a definição
  const [error, setError] = useState(''); // Estado para armazenar mensagens de erro

  // Função para buscar a definição da palavra
  const fetchDefinition = async () => {
    if (!word) {
      setError('Por favor, insira uma palavra.'); // Mensagem de erro se a palavra não for inserida
      return;
    }

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response.ok) {
        throw new Error('Palavra não encontrada.'); // Lança um erro se a palavra não for encontrada
      }
      const data = await response.json();
      setDefinition(data[0]); // Assume que a resposta é um array e pega o primeiro item
      setError(''); // Limpa a mensagem de erro
    } catch (err) {
      setError(err.message); // Armazena a mensagem de erro
      setDefinition(null); // Limpa a definição
    }
  };

  return (
    <div className={styles.container}>
      <h1>Dicionário</h1>
      <input
        type="text"
        value={word}
        onChange={(e) => setWord(e.target.value)} // Atualiza o estado da palavra
        placeholder="Digite uma palavra"
      />
      <button onClick={fetchDefinition}>Buscar Definição</button>

      {error && <p className={styles.error}>{error}</p>} {/* Exibe mensagem de erro se houver */}

      {definition && (
        <div className={styles.definition}>
          <h2>Definição de {definition.word}</h2>
          <p><strong>Fonética:</strong> {definition.phonetic}</p>
          <p><strong>Origem:</strong> {definition.origin}</p>
          {definition.meanings.map((meaning, index) => (
            <div key={index} className={styles.meaning}>
              <h3>{meaning.partOfSpeech}</h3>
              {meaning.definitions.map((def, idx) => (
                <div key={idx}>
                  <p><strong>Definição:</strong> {def.definition}</p>
                  {def.example && <p><strong>Exemplo:</strong> {def.example}</p>}
                </div>
              ))}
            </div>
          ))}
          {definition.phonetics.map((phonetic, index) => (
            phonetic.audio && (
              <audio key={index} controls className={styles.audio}>
                <source src={phonetic.audio} type="audio/mpeg" />
                Seu navegador não suporta o elemento de áudio.
              </audio>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default Dictionary;