import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

export default function Home() {
  const [isActive, setIsActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [, setError] = useState("");
  const navigate = useNavigate();
  const loginRef = useRef(null)
  const firstSec = useRef(null)
  const ColabRef = useRef(null)

  const scrollToLogin = () => loginRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const scrollToSM = () => firstSec.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const scrollToColab = () => ColabRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });

  useEffect(() => {
    const storedUser  = JSON.parse(sessionStorage.getItem('user'));
    console.log(storedUser);
    
    if (storedUser ) {
        navigate("/ua"); // Navega para /ua se um usuário estiver armazenado
    }
}, [navigate]);

  // Função para alternar visibilidade da senha
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Função para limpar campos
  function clearFields() {
    setEmail("");
    setPassword("");
    setName("");
  }

  // Alternar entre login e cadastro
  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  // Configurações do Toast para mensagens de sucesso e erro
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    heightAuto: false,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
    customClass: {
      popup: "toast-custom",
    },
  });

  const showToastSuccess = (message) => {
    Toast.fire({
      icon: "success",
      title: message,
    });
  };

  // const showToastError = (message) => {
  //   Toast.fire({
  //     icon: "error",
  //     title: message,
  //   });
  // };

  // Função para recuperação de senha
  function handleForgotPassword() {
    Swal.fire({
      title: "Esqueceu sua senha?",
      text: "Digite seu e-mail para redefinir a senha:",
      input: "email",
      inputPlaceholder: "lovelace@gmail.com",
      showCancelButton: true,
      confirmButtonText: "Enviar",
      confirmButtonColor: "#F21B3F",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "swal-button-confirm",
        cancelButton: "swal-button-cancel",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const email = result.value;
        showToastSuccess(
          "Um e-mail de redefinição de senha foi enviado para " + email
        );
      }
    });
  }

  // Função para cadastro
  function handleSignUp(e) {
    e.preventDefault();
    showToastSuccess("Cadastro realizado com sucesso!");
    clearFields();
    setIsActive(false);

  // Verificar se o email já está cadastrado
  fetch('http://localhost:4000/users')
      .then(resp => resp.json())
      .then(data => {
          const userExists = data.some(user => user.email === email);
          
          if (userExists) {
              setError("Este email já está sendo utilizado. Por favor, escolha outro.");
          } else {
              // Se o email não está cadastrado, realizar o cadastro
              const newUser = {
                  name: name, 
                  email: email, 
                  password: password, 
                  profileImage: "/defaultProfile.png" // Adicionando a imagem padrão
              };
              fetch('http://localhost:4000/users', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(newUser)
              })
              .then(resp => resp.json())
              .then(data => {
                  // Salvando o usuário recém cadastrado no sessionStorage
                  console.log(data);
                  console.log(newUser);
                  sessionStorage.setItem('user', JSON.stringify(data));
                  sessionStorage.
                  // Exibir mensagem de sucesso
                  console.log(data);
                  setTimeout(() => {
                    navigate("/ua");
                  }, 5000);
              })
              .catch(err => console.error("Erro ao cadastrar:", err));
          }
      })
      .catch(err => console.error("Erro ao verificar o email:", err));
  }

  // Função para login
  function handleSignIn(e) {
    e.preventDefault();
    showToastSuccess("Login realizado com sucesso!");
    fetch('http://localhost:4000/users')
      .then(resp => resp.json())
      .then(data => {
      const user = data.find(user => user.email === email);
      if (user) {
          if (user.password === password) {
              if (user.id) { // Verifica se o user.id está presente
                  sessionStorage.setItem('user', JSON.stringify(user));
                  navigate("/ua");       
              } else {
                  setError("Erro ao salvar ID do usuário. Tente novamente.");
              }
          } else {
              setError("Senha incorreta. Por favor, tente novamente.");
          }
      } else {
          setError("Usuário não encontrado. Por favor, verifique seu email.");
      }
      })
      .catch(err => console.log(err));
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Lovelace</h1>
        <nav>
          <ul>
            <li><button onClick={scrollToColab} id={styles.sobreNos}>Sobre nós</button></li>
            <li><button onClick={scrollToLogin}>Fazer Login</button></li>
            <li><button onClick={scrollToLogin}>Criar Conta</button></li>
          </ul>
        </nav>
      </header>
      <section className={styles.mainContent}>
        <img src="../../src/img/image 1.svg" alt="AdaLovelace" />
        <div>
          <h1>Lovelace</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eget
            tortor ac turpis viverra luctus. In ornare tempus lacinia. Maecenas
            interdum felis quis arcu congue vulputate. Donec vitae posuere
            ligula, quis tristique dui. Mauris a sapien vitae dolor tincidunt
            rhoncus. Integer massa elit, lacinia non luctus at, condimentum at
            erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
            fringilla pretium commodo. Duis viverra, mauris non malesuada
            malesuada, turpis turpis consectetur ante, id lacinia lorem lacus
            eget diam. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Praesent in est eu felis ornare luctus auctor ut elit. Nam placerat
            urna eu nisi blandit ornare.
          </p>
          <button onClick={scrollToSM}>Achou legal? Saiba mais!</button>
        </div>
      </section>
      <section ref={firstSec} className={styles.secVideo}>
        <strong>Para você estudante!</strong>
        <div>
          <p>
            Você poderá escolher entre duas formas de praticar seu conhecimento
            em inglês.
            <br />
            <br />
            Podendo ser uma prática simples com um texto de leitura, onde basta
            você retirar as palavras chaves do texto! Isso tudo com direito a um
            resultado no final e para você poder medir o quão fluente você é,
            também poderá saber se corresponde a um dos três níveis de
            conhecimentos:
            <br />
            <br />
            <span>Beginner</span>, <span>Intermediary</span> e <span>Advanced</span>.
          </p>
          <video src=""></video>
        </div>
      </section>
      <div>
        <h1>
          <strong>Para professores</strong>
        </h1>
      </div>
      <section className={styles.secVideo}>
        <strong>Você poderá usar a nossa ferramenta de questionário!</strong>
        <div>
          <p>
            Basta adicionar sua questão, seu texto e explicar para seus alunos
            qual é o propósito daquela atividade! Ah! Lembre-se, essa ferramenta
            foi projetada para ser utilizada em sala de aula!
            <br />
            <br />
            Você terá acesso em tempo real das respostas dos alunos, um código
            de acesso para a atividade, edição pós-criação caso queira alterar o
            questionário.
          </p>
          <video src=""></video>
        </div>
      </section>
      <section ref={ColabRef} className={styles.collaborators}>
        <span>Esse é um projeto de iniciação científica!</span>
        <div className={styles.midlle}>
          <p>
            Idealizado e desenvolvido por três alunos do IFBA Campus Camaçari
            <br />
            <br />
            Nos dividimos em uma pequena equipe de estudantes do curso de
            ciência da computação.
            <br />
            <br />
            Esse projeto só foi possível graças a orientação da orientadora.
          </p>
          <h1>Lovelace</h1>
        </div>
        <div className={styles.cards}>
          <div>
            <img src="" alt="" />
            <p>Marcos Emanuel</p>
            <p>Ux/UI Designer</p>
          </div>
          <div>
            <img src="" alt="" />
            <p>Melkysedeke Costa</p>
            <p>Desenvolvedor Fullstack</p>
          </div>
          <div>
            <img src="" alt="" />
            <p>Daniel de Santana Alves</p>
            <p>Desenvolvedor Fullstack</p>
          </div>
          <div>
            <img src="" alt="" />
            <p>Lenade Barreto Santos Gil</p>
            <p>Orientadora</p>
          </div>
        </div>
      </section>
      <section ref={loginRef} className={`${styles.login} ${isActive ? styles.active : ""}`}>
        <div className={`${styles.form_container} ${styles.sign_up}`}> 
          <form onSubmit={handleSignUp}>
            <h1>Criar Conta</h1>
            <div className={styles.social_icons}>
              <a href="#" className={styles.icon}>
                {" "}
                <FontAwesomeIcon icon={faGoogle} style={{ color: "#DB4437" }} />
              </a>
              {/* <a href="#" className={styles.icon}><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" className={styles.icon}><i className="fa-brands fa-github"></i></a>
              <a href="#" className={styles.icon}><i className="fa-brands fa-linkedin-in"></i></a> */}
            </div>
            <span>ou use seu e-mail para registro</span>
            <input
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className={styles.showpassword}>
              <input
                type={showPassword ? "text" : "password"} // Muda o tipo do input com base no estado
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {showPassword ? (
                  <FontAwesomeIcon icon={faEye} />
                ) : (
                  <FontAwesomeIcon icon={faEyeSlash} />
                )}
              </button>
            </div>
            <button type="submit">Cadastrar</button>
          </form>
        </div>

        <div className={`${styles.form_container} ${styles.sign_in}`}>
          <form onSubmit={handleSignIn}>
            <h1>Entrar</h1>
            <div className={styles.social_icons}>
              <a href="#" className={styles.icon}>
                {" "}
                <FontAwesomeIcon icon={faGoogle} style={{ color: "#DB4437" }} />
              </a>
              {/* <a href="#" className={styles.icon}><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" className={styles.icon}><i className="fa-brands fa-github"></i></a>
              <a href="#" className={styles.icon}><i className="fa-brands fa-linkedin-in"></i></a> */}
            </div>
            <span>ou use sua senha de e-mail</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className={styles.showpassword}>
              <input
                type={showPassword ? "text" : "password"} // Muda o tipo do input com base no estado
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {showPassword ? (
                  <FontAwesomeIcon icon={faEye} />
                ) : (
                  <FontAwesomeIcon icon={faEyeSlash} />
                )}
              </button>
            </div>
            <a href="#" onClick={handleForgotPassword} className={styles.link}>
              Esqueceu sua senha?
            </a>
            <button type="submit">Entrar</button>
          </form>
        </div>

        <div className={styles.toggle_container}>
          <div className={styles.toggle}>
            <div className={`${styles.toggle_panel} ${styles.toggle_left}`}>
              <h1>Bem-vindo de Volta!</h1>
              <p>
                Digite seus dados pessoais para usar todos os recursos do site
              </p>
              <button className={styles.hidden} onClick={handleLoginClick}>
                Entrar
              </button>
            </div>
            <div className={`${styles.toggle_panel} ${styles.toggle_right}`}>
              <h1>Olá, Amigo!</h1>
              <p>
                Registre-se com seus dados pessoais para usar todos os recursos
                do site
              </p>
              <button className={styles.hidden} onClick={handleRegisterClick}>
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}