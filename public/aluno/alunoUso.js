// Dados de usuário (simulando um banco de dados)
const users = [
    { email: "medico@exemplo.com", password: "senha123", name: "Dr. Silva", role: "user" },
    { email: "admin@exemplo.com", password: "admin123", name: "Administrador", role: "admin" }
];

// // Verifica se o usuário está logado ao carregar a página
// document.addEventListener('DOMContentLoaded', function () {
//     if (localStorage.getItem('loggedIn') === 'true') {
//         const user = JSON.parse(localStorage.getItem('user'));

//         // Se for admin, redireciona para config.html
//         if (user.role === "admin") {
//             window.location.href = "public/admin/configADM.html";
//         } else {
//             // Usuário normal, mostra o app
//             document.getElementById('login-screen').classList.add('hidden');
//             document.getElementById('app').classList.remove('hidden');
//             loadNotes();
//         }
//     }
// });

// // Sistema de Login
// document.getElementById('login-form').addEventListener('submit', function (e) {
//     e.preventDefault();

//     const email = document.getElementById('email').value.trim();
//     const password = document.getElementById('password').value;

//     // Verifica as credenciais
//     const user = users.find(u => u.email === email && u.password === password);

//     if (user) {
//         // Login bem-sucedido
//         localStorage.setItem('loggedIn', 'true');
//         localStorage.setItem('user', JSON.stringify(user));

//         // Verifica o tipo de usuário
//         if (user.role === "admin") {
//             window.location.href = "configADM.html";
//         } else {
//             document.getElementById('login-screen').classList.add('hidden');
//             document.getElementById('app').classList.remove('hidden');
//             loadNotes();
//         }
//     } else {
//         alert('E-mail ou senha incorretos. Use: medico@exemplo.com / senha123 ou admin@exemplo.com / admin123');
//     }
// });

// Sistema de Logout
document.getElementById('logout-btn').addEventListener('click', function () {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('user');
    window.location.href = "/../../login.html";
});

// Carrega as anotações salvas
function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    renderNotesList(notes);
    renderSidebarNotes(notes);
}

// Renderiza a lista principal de anotações
function renderNotesList(notes) {
    const notesList = document.getElementById('notes-list');

    notesList.innerHTML = notes.length > 0
        ? notes.map(note => `
            <div class="note-card" data-id="${note.id}">
                <div class="note-card-header">
                    <h3>${note.title || 'Anotação sem título'}</h3>
                    <div class="note-card-actions">
                        <span class="note-card-date">${note.date}</span>
                        <button class="delete-note">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <p class="note-card-content">${note.content}</p>
                ${note.suggestions ? `
                <details>
                    <summary>Ver sugestões da IA</summary>
                    <div class="suggestions-preview">
                        ${note.suggestions}
                    </div>
                </details>
                ` : ''}
            </div>
        `).join('')
        : `<p class="empty-notes">Nenhuma anotação encontrada</p>`;

    // Adiciona eventos aos botões de deletar
    document.querySelectorAll('.delete-note').forEach(button => {
        button.addEventListener('click', function (e) {
            e.stopPropagation();
            const noteId = parseInt(this.closest('.note-card').dataset.id);
            deleteNote(noteId);
        });
    });
}

// Renderiza a lista de anotações na sidebar
function renderSidebarNotes(notes) {
    const sidebarList = document.getElementById('sidebar-notes-list');

    sidebarList.innerHTML = notes.length > 0
        ? notes.map(note => `
            <div class="sidebar-note" data-id="${note.id}">
                <h4>${note.title || 'Sem título'}</h4>
                <p>${note.date}</p>
            </div>
        `).join('')
        : `<p class="empty-notes">Nenhuma anotação</p>`;

    // Adiciona eventos para carregar anotação ao clicar
    document.querySelectorAll('.sidebar-note').forEach(note => {
        note.addEventListener('click', function () {
            const noteId = parseInt(this.dataset.id);
            loadNoteForEditing(noteId);
            closeSidebar();
        });
    });
}

// Carrega uma anotação para edição
function loadNoteForEditing(noteId) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const note = notes.find(n => n.id === noteId);

    if (note) {
        document.getElementById('note-title').value = note.title || '';
        document.getElementById('note-content').value = note.content;
        document.getElementById('note-title').focus();
    }
}

// Deleta uma anotação
function deleteNote(noteId) {
    if (confirm('Tem certeza que deseja excluir esta anotação?')) {
        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes = notes.filter(note => note.id !== noteId);
        localStorage.setItem('notes', JSON.stringify(notes));
        loadNotes();
    }
}

// Salva uma nova anotação (modificada para preservar sugestões existentes)
function saveNote(title, content, suggestions = null) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];

    // Verifica se já existe uma anotação com este conteúdo (para atualização)
    const existingNoteIndex = notes.findIndex(note =>
        note.title === title && note.content === content);

    if (existingNoteIndex !== -1) {
        // Atualiza a anotação existente
        const updatedNote = {
            ...notes[existingNoteIndex],
            title,
            content,
            date: new Date().toLocaleDateString('pt-BR')
        };
        notes[existingNoteIndex] = updatedNote;
    } else {
        // Cria nova anotação
        const newNote = {
            id: Date.now(),
            title,
            content,
            date: new Date().toLocaleDateString('pt-BR'),
            suggestions: suggestions || null
        };
        notes.unshift(newNote);
    }

    localStorage.setItem('notes', JSON.stringify(notes));
    return notes[0];
}

// Botão para salvar anotação sem análise
document.getElementById('save-btn').addEventListener('click', function () {
    const title = document.getElementById('note-title').value.trim();
    const content = document.getElementById('note-content').value.trim();

    if (!content) {
        alert('Por favor, escreva algo para salvar');
        return;
    }

    // Salva a anotação sem sugestões de IA
    saveNote(title, content);

    // Mostra feedback visual
    const saveBtn = document.getElementById('save-btn');
    saveBtn.innerHTML = '<i class="fas fa-check"></i> Salvo!';
    saveBtn.classList.remove('save-button');
    saveBtn.classList.add('save-success');

    // Limpa os campos e atualiza a lista
    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';
    loadNotes();

    // Volta o botão ao estado original após 2 segundos
    setTimeout(() => {
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Salvar';
        saveBtn.classList.remove('save-success');
        saveBtn.classList.add('save-button');
    }, 2000);
});

// Botão para analisar com IA (simulado)
document.getElementById('analyze-btn').addEventListener('click', async function () {
    const title = document.getElementById('note-title').value.trim();
    const content = document.getElementById('note-content').value.trim();

    if (!content) {
        alert('Por favor, escreva algo para analisar');
        return;
    }

    // Mostra o loading
    document.getElementById('loading-modal').classList.remove('hidden');

    // Simula uma chamada à API da OpenAI (substitua pelo código real)
    setTimeout(() => {
        // Esta é uma resposta simulada - na prática, você faria uma chamada à API da OpenAI
        const suggestions = `
            <h3>Sugestões para melhoria:</h3>
            <ul>
                <li>Considere incluir mais detalhes sobre a condição pré-existente do paciente</li>
                <li>Documente os sinais vitais completos (PA, FC, FR, SatO2, temperatura)</li>
                <li>Especifique o protocolo médico seguido, se aplicável</li>
                <li>Inclua o plano de acompanhamento e próxima revisão</li>
            </ul>
            <p>Estas sugestões são baseadas nas melhores práticas clínicas.</p>
        `;

        // Salva a anotação
        saveNote(title, content, suggestions);

        // Mostra as sugestões
        document.getElementById('suggestions-content').innerHTML = suggestions;
        document.getElementById('suggestions-container').classList.remove('hidden');

        // Limpa os campos e atualiza a lista
        document.getElementById('note-title').value = '';
        document.getElementById('note-content').value = '';
        loadNotes();

        // Esconde o loading
        document.getElementById('loading-modal').classList.add('hidden');
    }, 1500);
});

// Fecha as sugestões
document.getElementById('close-suggestions').addEventListener('click', function () {
    document.getElementById('suggestions-container').classList.add('hidden');
});

// Botão para nova anotação
document.getElementById('new-note-btn').addEventListener('click', function () {
    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';
    document.getElementById('note-title').focus();
});

// Botão para abrir sidebar de anotações
document.getElementById('view-notes-btn').addEventListener('click', function () {
    document.getElementById('notes-sidebar').classList.add('active');
    document.getElementById('sidebar-overlay').classList.add('active');
});

// Fecha a sidebar
document.getElementById('close-sidebar').addEventListener('click', closeSidebar);
document.getElementById('sidebar-overlay').addEventListener('click', closeSidebar);

function closeSidebar() {
    document.getElementById('notes-sidebar').classList.remove('active');
    document.getElementById('sidebar-overlay').classList.remove('active');
}

// Configurações
document.getElementById('settings-btn').addEventListener('click', function () {
    document.getElementById('settings-modal').classList.remove('hidden');
});

document.getElementById('close-settings').addEventListener('click', function () {
    document.getElementById('settings-modal').classList.add('hidden');
});

// Fecha o teclado virtual quando clica fora dos campos em dispositivos móveis
document.addEventListener('click', function (e) {
    if (!e.target.matches('input, textarea')) {
        document.activeElement.blur();
    }
});