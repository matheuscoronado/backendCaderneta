// Verifica se o usuário está logado ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
    if (localStorage.getItem('loggedIn') === 'true') {
        const user = JSON.parse(localStorage.getItem('user'));

        // Redireciona conforme o tipo de usuário
        if (user.tipo === "administrador") {
            window.location.href = "/public/admin/configADM.html";
        } else if (user.tipo === "professor") {
            window.location.href = "/public/professor/profDoc.html";
        } else if (user.tipo === "aluno") {
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('app').classList.remove('hidden');
            loadNotes();
        }
    }
});

// Sistema de Login com backend PHP
document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('password').value;

    const formData = new FormData();
    formData.append('email', email);
    formData.append('senha', senha);

    try {
        const response = await fetch('../../login.php', { 
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data.success) {
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redireciona conforme o tipo de usuário
            if (data.user.tipo === "administrador") {
                window.location.href = "/public/admin/configADM.html";
            } else if (data.user.tipo === "professor") {
                window.location.href = "/public/professor/profDoc.html";
            } else if (data.user.tipo === "aluno") {
                document.getElementById('login-screen').classList.add('hidden');
                document.getElementById('app').classList.remove('hidden');
                loadNotes();
            }
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Erro ao conectar ao servidor.');
    }
});

// Sistema de Logout
document.getElementById('logout-btn').addEventListener('click', function () {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('user');
    document.getElementById('app').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('login-form').reset();
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
            <div class="note-card bg-white p-4 rounded-lg shadow" data-id="${note.id}">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-medium text-gray-800">${note.title || 'Anotação sem título'}</h3>
                    <div class="flex items-center">
                        <span class="text-xs text-gray-500 mr-2">${note.date}</span>
                        <button class="delete-note text-red-500 hover:text-red-700">
                            <i class="fas fa-trash text-sm"></i>
                        </button>
                    </div>
                </div>
                <p class="text-gray-600 text-sm mb-3 whitespace-pre-line">${note.content}</p>
                ${note.suggestions ? `
                <details class="mt-2">
                    <summary class="text-blue-600 text-sm cursor-pointer">Ver sugestões da IA</summary>
                    <div class="prose prose-sm max-w-none mt-2 p-2 bg-blue-50 rounded">
                        ${note.suggestions}
                    </div>
                </details>
                ` : ''}
            </div>
        `).join('')
        : `<p class="text-gray-500 text-center py-4">Nenhuma anotação encontrada</p>`;

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
            <div class="sidebar-note p-2 rounded hover:bg-gray-100 cursor-pointer" data-id="${note.id}">
                <h4 class="font-medium text-gray-800 truncate">${note.title || 'Sem título'}</h4>
                <p class="text-xs text-gray-500">${note.date}</p>
            </div>
        `).join('')
        : `<p class="text-gray-500 text-center py-4 text-sm">Nenhuma anotação</p>`;

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

// Salva uma nova anotação
function saveNote(title, content, suggestions = null) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const newNote = {
        id: Date.now(),
        title,
        content,
        date: new Date().toLocaleDateString('pt-BR'),
        suggestions
    };
    notes.unshift(newNote);
    localStorage.setItem('notes', JSON.stringify(notes));
    return newNote;
}

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
            <h3 class="font-semibold text-gray-800">Sugestões para melhoria:</h3>
            <ul class="list-disc pl-5 mt-2">
                <li class="mb-1">Considere incluir mais detalhes sobre a condição pré-existente do paciente</li>
                <li class="mb-1">Documente os sinais vitais completos (PA, FC, FR, SatO2, temperatura)</li>
                <li class="mb-1">Especifique o protocolo médico seguido, se aplicável</li>
                <li>Inclua o plano de acompanhamento e próxima revisão</li>
            </ul>
            <p class="mt-3 text-sm text-gray-600">Estas sugestões são baseadas nas melhores práticas clínicas.</p>
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