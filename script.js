// script.js
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const restartButton = document.getElementById('restart-btn');
const resultElement = document.getElementById('result');
const acertosTextElement = document.getElementById('acertos-text');
const errosTextElement = document.getElementById('erros-text');

let shuffledQuestions, currentQuestionIndex;
let score = 0;
let errors = 0;

const questions = [
    {
        question: 'Qual dispositivo é usado para unir cabos de rede de vários computadores em um ponto central, permitindo que eles conversem entre si dentro da mesma rede local (LAN)?',
        answers: [ { text: 'Roteador', correct: false }, 
            { text: 'Modem', correct: false }, 
            { text: 'Switch', correct: true }, 
            { text: 'Placa de Rede', correct: false } ]
    },
    {
        question: 'Qual equipamento é responsável por conectar sua rede doméstica à internet, encaminhando o tráfego entre elas?',
        answers: [ { text: 'Hub', correct: false }, 
            { text: 'Roteador', correct: true }, 
            { text: 'Access Point', correct: false }, 
            { text: 'Modem', correct: false } ]
    },
    {
        question: 'Qual topologia de rede é a mais comum em casas e empresas modernas, onde todos os dispositivos se conectam a um roteador ou switch central?',
        answers: [ { text: 'Topologia em Barramento', correct: false }, 
            { text: 'Topologia em Anel', correct: false }, 
            { text: 'Topologia em Estrela', correct: true }, 
            { text: 'Topologia Híbrida', correct: false } ]
    },
    {
        question: 'O que são topologias de rede?',
        answers: [ { text: 'São os diferentes tipos de cabos de rede.', correct: false }, 
            { text: 'São as formas de organizar a conexão entre dispositivos em uma rede de computadores.', correct: true }, 
            { text: 'São os nomes dos programas de internet.', correct: false }, 
            { text: 'São as velocidades de conexão.', correct: false } ]
    },
    {
        question: 'Para que serve uma VPN (Rede Privada Virtual)?',
        answers: [ { text: 'Para aumentar a velocidade máxima da internet.', correct: false }, 
            { text: 'Para criar uma conexão segura e criptografada pela internet.', correct: true }, 
            { text: 'Para instalar programas de antivírus.', correct: false }, 
            { text: 'Para conectar um computador a uma rede Wi-Fi.', correct: false } ]
    },
    {
        question: 'O que é um endereço IP?',
        answers: [ { text: 'O endereço físico de uma placa de rede.', correct: false },  
            { text: 'O nome de um site na internet.', correct: false }, 
            { text: 'Um número que identifica unicamente um dispositivo em uma rede.', correct: true },
            { text: 'Um tipo de cabo de rede.', correct: false } ]
    },
    {
        question: 'Qual é a principal função de um Firewall em uma rede?',
        answers: [ { text: 'Acelerar a velocidade da internet.', correct: false }, 
            { text: 'Monitorar e controlar o tráfego para fins de segurança.', correct: true }, 
            { text: 'Distribuir o sinal Wi-Fi.', correct: false }, 
            { text: 'Armazenar arquivos em nuvem.', correct: false } ]
    },
    {
        question: 'Uma rede que conecta computadores em uma área geográfica limitada, como um escritório ou uma casa, é chamada de:',
        answers: [ { text: 'WAN (Rede de Longa Distância)', correct: false },  
            { text: 'VPN (Rede Privada Virtual)', correct: false }, 
            { text: 'PAN (Rede de Área Pessoal)', correct: false },
            { text: 'LAN (Rede de Área Local)', correct: true } ]
    },
    {
        question: 'Qual é o tipo de cabo de rede mais comum usado em redes locais (LANs), conhecido por ter pares de fios trançados?',
        answers: [ { text: 'Cabo Coaxial', correct: false }, 
            { text: 'Fibra Óptica', correct: false }, 
            { text: 'Cabo de Par Trançado (Ethernet)', correct: true }, 
            { text: 'Cabo USB', correct: false } ]
    },
    {
        question: 'Cada placa de rede possui um endereço físico único de fábrica. Como se chama esse endereço?',
        answers: [ { text: 'Endereço IP', correct: false }, 
            { text: 'Endereço de Gateway', correct: false }, 
            { text: 'Endereço DNS', correct: false }, 
            { text: 'Endereço MAC', correct: true } ]
    }
];

function startQuiz() {
    score = 0;
    errors = 0;
    acertosTextElement.innerText = `Acertos: 0/${questions.length}`;
    errosTextElement.innerText = `Erros: 0/${questions.length}`;
    resultElement.innerText = '';
    resultElement.classList.add('hide'); // Esconde o resultado ao iniciar
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    nextButton.classList.remove('hide');
    setNextQuestion();
}

function setNextQuestion() {
    resetState();
    showQuestion(shuffledQuestions[currentQuestionIndex]);
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    nextButton.disabled = true;
    nextButton.classList.add('disabled');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';

    if (correct) {
        score++;
        acertosTextElement.innerText = `Acertos: ${score}/${questions.length}`;
    } else {
        errors++;
        errosTextElement.innerText = `Erros: ${errors}/${questions.length}`;
    }

    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct);
        button.disabled = true;
    });

    // Verifica se é a última questão
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.disabled = false;
        nextButton.classList.remove('disabled');
    } else {
        // Se for a última questão, esconde o botão "Próxima" e mostra o resultado
        nextButton.classList.add('hide');
        showResult();
    }
}

function setStatusClass(element, correct) {
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

function showResult() {
    resultElement.classList.remove('hide'); // Mostra o elemento de resultado

    // Verifica se a pontuação é perfeita
    if (score === questions.length) {
        resultElement.innerText = 'Parabéns! Você acertou todas!';
        
        // Tenta disparar a animação de confetes de forma segura
        try {
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 150,
                    spread: 100,
                    origin: { y: 0.6 }
                });
            }
        } catch (error) {
            console.error("Erro ao tentar executar a animação de confetes:", error);
        }

    } else {
        resultElement.innerText = `Quiz finalizado! Sua pontuação: ${score}/${questions.length}`;
    }
}

nextButton.addEventListener('click', () => {
    if (!nextButton.disabled) {
        currentQuestionIndex++;
        setNextQuestion();
    }
});

restartButton.addEventListener('click', startQuiz);

startQuiz();