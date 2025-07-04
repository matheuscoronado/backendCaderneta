/**
 * EVENT LISTENER - DOMContentLoaded
 * Executa quando o DOM está totalmente carregado
 */
document.addEventListener('DOMContentLoaded', function() {
    // Carrega o tema salvo no localStorage ou usa o tema claro por padrão
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Carrega a lista de alunos inicial
    loadStudents();
});

/**
 * Define o tema visual da aplicação
 * @param {string} theme - 'light' para tema claro ou 'dark' para tema escuro
 */
function setTheme(theme) {
    if (theme === 'dark') {
        // Aplica o tema escuro
        document.body.classList.add('dark-mode');
        // Altera o ícone para sol (indicando que pode voltar para claro)
        document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        // Aplica o tema claro
        document.body.classList.remove('dark-mode');
        // Altera o ícone para lua (indicando que pode ir para escuro)
        document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-moon"></i>';
    }
}

/**
 * Alterna entre os temas claro e escuro
 */
function toggleTheme() {
    // Verifica qual é o tema atual
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    // Define o novo tema oposto ao atual
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Aplica o novo tema
    setTheme(newTheme);
    // Salva a preferência no localStorage
    localStorage.setItem('theme', newTheme);
}

// Adiciona evento de clique ao botão de alternar tema
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

/**
 * Carrega e exibe a lista de alunos
 * @param {string} searchTerm - Termo para filtrar alunos (opcional)
 */
function loadStudents(searchTerm = '') {
    const studentsList = document.getElementById('students-list');
    let filteredStudents = [...students]; // Cria cópia do array original
    
    // Filtra alunos se houver termo de busca
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredStudents = filteredStudents.filter(s => 
            s.name.toLowerCase().includes(term) || 
            s.email.toLowerCase().includes(term)
        );
    }
    
    // Atualiza o HTML da lista de alunos
    studentsList.innerHTML = filteredStudents.length > 0 
        ? filteredStudents.map(student => `
            <div class="student-card" data-id="${student.id}">
                <div class="student-info">
                    <img src="${student.avatar}" alt="${student.name}">
                    <div>
                        <h3>${student.name}</h3>
                        <p class="student-email">${student.email}</p>
                    </div>
                </div>
                <div class="student-footer">
                    <span class="notes-count">${getStudentNotesCount(student.id)} anotações</span>
                    <button class="view-notes-btn" data-id="${student.id}">
                        Ver anotações <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        `).join('')
        : `<p class="no-students">Nenhum aluno encontrado</p>`;
    
    // Adiciona eventos de clique aos cards de aluno
    document.querySelectorAll('.student-card, .view-notes-btn').forEach(element => {
        element.addEventListener('click', function() {
            // Obtém o ID do aluno clicado
            const studentId = parseInt(this.dataset.id || this.closest('.student-card').dataset.id);
            openStudentNotes(studentId);
        });
    });
}

/**
 * Retorna a quantidade de anotações de um aluno
 * @param {number} studentId - ID do aluno
 * @return {number} Número de anotações
 */
function getStudentNotesCount(studentId) {
    return notes.filter(note => note.studentId === studentId).length;
}

/**
 * Abre a sidebar com as anotações de um aluno específico
 * @param {number} studentId - ID do aluno
 */
function openStudentNotes(studentId) {
    // Encontra o aluno pelo ID
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    // Atualiza o título da sidebar
    document.getElementById('sidebar-student-name').textContent = `Anotações de ${student.name}`;
    
    // Filtra as anotações do aluno
    const studentNotes = notes.filter(note => note.studentId === studentId);
    const sidebarList = document.getElementById('sidebar-notes-list');
    
    // Preenche a lista de anotações na sidebar
    sidebarList.innerHTML = studentNotes.length > 0 
        ? studentNotes.map(note => `
            <div class="sidebar-note" data-id="${note.id}">
                <h4>${note.title || 'Sem título'}</h4>
                <p>${note.date}</p>
            </div>
        `).join('')
        : `<p class="no-notes">Nenhuma anotação encontrada</p>`;
    
    // Adiciona eventos de clique às anotações na sidebar
    document.querySelectorAll('.sidebar-note').forEach(note => {
        note.addEventListener('click', function() {
            const noteId = parseInt(this.dataset.id);
            openNoteModal(noteId);
        });
    });
    
    // Exibe a sidebar e o overlay
    document.getElementById('notes-sidebar').classList.add('active');
    document.getElementById('sidebar-overlay').classList.add('active');
}

/**
 * Abre o modal com os detalhes de uma anotação
 * @param {number} noteId - ID da anotação
 */
function openNoteModal(noteId) {
    // Encontra a anotação e o aluno correspondente
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    const student = students.find(s => s.id === note.studentId);
    
    // Preenche os dados no modal
    document.getElementById('modal-note-title').textContent = note.title || 'Anotação sem título';
    document.getElementById('modal-note-date').textContent = note.date;
    document.getElementById('modal-note-author').textContent = `Por: ${student ? student.name : 'Aluno desconhecido'}`;
    document.getElementById('modal-note-content').textContent = note.content;
    
    // Mostra sugestões se existirem
    if (note.suggestions) {
        document.getElementById('modal-suggestions-content').innerHTML = note.suggestions;
        document.getElementById('modal-note-suggestions').classList.remove('hidden');
    } else {
        document.getElementById('modal-note-suggestions').classList.add('hidden');
    }
    
    // Preenche o feedback do professor se existir
    document.getElementById('teacher-feedback').value = note.teacherFeedback || '';
    
    // Armazena o ID da nota no modal para referência
    document.getElementById('note-modal').dataset.id = noteId;
    
    // Exibe o modal
    document.getElementById('note-modal').classList.remove('hidden');
}

/**
 * Fecha o modal de anotação
 */
function closeNoteModal() {
    document.getElementById('note-modal').classList.add('hidden');
}

// Eventos para fechar o modal
document.getElementById('close-note-modal').addEventListener('click', closeNoteModal);
document.getElementById('cancel-feedback').addEventListener('click', closeNoteModal);

/**
 * Salva o feedback do professor na anotação
 */
document.getElementById('save-feedback').addEventListener('click', function() {
    // Obtém o ID da anotação
    const noteId = parseInt(document.getElementById('note-modal').dataset.id);
    if (!noteId) return;
    
    // Obtém o texto do feedback
    const feedback = document.getElementById('teacher-feedback').value.trim();
    
    // Atualiza a anotação com o novo feedback
    notes = notes.map(note => {
        if (note.id === noteId) {
            return { ...note, teacherFeedback: feedback };
        }
        return note;
    });
    
    // Feedback visual para o usuário
    alert('Feedback salvo com sucesso!');
    closeNoteModal();
});

/**
 * Fecha a sidebar de anotações
 */
function closeSidebar() {
    document.getElementById('notes-sidebar').classList.remove('active');
    document.getElementById('sidebar-overlay').classList.remove('active');
}

// Eventos para fechar a sidebar
document.getElementById('close-sidebar').addEventListener('click', closeSidebar);
document.getElementById('sidebar-overlay').addEventListener('click', closeSidebar);

/**
 * Evento de busca de alunos
 */
document.getElementById('search-input').addEventListener('input', function() {
    loadStudents(this.value.trim());
});