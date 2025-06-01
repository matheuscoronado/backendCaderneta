// Dados de usuário (simulando um banco de dados)
const users = [
    { email: "professor@exemplo.com", password: "senha123", name: "Prof. Oliveira", role: "teacher" }
];

// Dados simulados de alunos e anotações
const students = [
    { id: 1, name: "Ana Silva", email: "ana@exemplo.com", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    { id: 2, name: "Bruno Costa", email: "bruno@exemplo.com", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: 3, name: "Carlos Mendes", email: "carlos@exemplo.com", avatar: "https://randomuser.me/api/portraits/men/67.jpg" },
    { id: 4, name: "Daniela Lima", email: "daniela@exemplo.com", avatar: "https://randomuser.me/api/portraits/women/63.jpg" }
];

// Anotações simuladas (em um sistema real, isso viria de um banco de dados)
let notes = [
    {
        id: 1,
        studentId: 1,
        title: "Procedimento com Paciente X",
        content: "Realizado atendimento inicial com paciente que apresentava dores abdominais. Paciente relatou histórico de gastrite. Foram verificados os sinais vitais e prescrito medicamento para alívio dos sintomas.",
        date: "15/05/2023",
        suggestions: "<h3 class='suggestion-title'>Sugestões para melhoria:</h3><ul class='suggestion-list'><li>Documentar os sinais vitais completos (PA, FC, FR, SatO2, temperatura)</li><li>Incluir detalhes sobre o exame físico abdominal</li><li>Especificar o medicamento prescrito e posologia</li></ul>",
        teacherFeedback: "Bom relato inicial, mas poderia incluir mais detalhes sobre o exame físico. 7/10"
    },
    // ... (outras anotações permanecem iguais)
];

// Verifica se o usuário está logado ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
    if (localStorage.getItem('loggedIn') === 'true') {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        loadStudents();
    }
});

// Sistema de Logout
document.getElementById('logout-btn').addEventListener('click', function () {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('user');
    window.location.href = "/../../login.html";
});

// ... (restante do JavaScript permanece igual)