// Verifica se o usuário está logado ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    // Carrega o tema salvo no localStorage ou usa o tema claro por padrão
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
});

// Sistema de Login

// Botão de logout
document.getElementById('logout-btn').addEventListener('click', function () {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('user');
    window.location.href = "/../../login.html";
});

/**
 * Define o tema da aplicação (claro/escuro)
 * @param {string} theme - 'light' ou 'dark'
 */
function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark-mode');
        document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-moon"></i>';
    }
}

/**
 * Alterna entre temas claro e escuro
 */
function toggleTheme() {
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
}

// Evento do botão de alternar tema
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

// Carrega a lista de alunos
function loadStudents(searchTerm = '') {
    const studentsList = document.getElementById('students-list');
    let filteredStudents = [...students];
    
    // Aplica filtro de busca
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredStudents = filteredStudents.filter(s => 
            s.name.toLowerCase().includes(term) || 
            s.email.toLowerCase().includes(term)
        );
    }
    
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
    
    // Adiciona eventos aos cards de aluno
    document.querySelectorAll('.student-card, .view-notes-btn').forEach(element => {
        element.addEventListener('click', function() {
            const studentId = parseInt(this.dataset.id || this.closest('.student-card').dataset.id);
            openStudentNotes(studentId);
        });
    });
}

// Conta as anotações de um aluno
function getStudentNotesCount(studentId) {
    return notes.filter(note => note.studentId === studentId).length;
}

// Abre as anotações de um aluno na sidebar
function openStudentNotes(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    document.getElementById('sidebar-student-name').textContent = `Anotações de ${student.name}`;
    
    const studentNotes = notes.filter(note => note.studentId === studentId);
    const sidebarList = document.getElementById('sidebar-notes-list');
    
    sidebarList.innerHTML = studentNotes.length > 0 
        ? studentNotes.map(note => `
            <div class="sidebar-note" data-id="${note.id}">
                <h4>${note.title || 'Sem título'}</h4>
                <p>${note.date}</p>
            </div>
        `).join('')
        : `<p class="no-notes">Nenhuma anotação encontrada</p>`;
    
    // Adiciona eventos para abrir anotação no modal
    document.querySelectorAll('.sidebar-note').forEach(note => {
        note.addEventListener('click', function() {
            const noteId = parseInt(this.dataset.id);
            openNoteModal(noteId);
        });
    });
    
    // Abre a sidebar
    document.getElementById('notes-sidebar').classList.add('active');
    document.getElementById('sidebar-overlay').classList.add('active');
}

// Abre o modal com uma anotação completa
function openNoteModal(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    const student = students.find(s => s.id === note.studentId);
    
    document.getElementById('modal-note-title').textContent = note.title || 'Anotação sem título';
    document.getElementById('modal-note-date').textContent = note.date;
    document.getElementById('modal-note-author').textContent = `Por: ${student ? student.name : 'Aluno desconhecido'}`;
    document.getElementById('modal-note-content').textContent = note.content;
    
    if (note.suggestions) {
        document.getElementById('modal-suggestions-content').innerHTML = note.suggestions;
        document.getElementById('modal-note-suggestions').classList.remove('hidden');
    } else {
        document.getElementById('modal-note-suggestions').classList.add('hidden');
    }
    
    document.getElementById('teacher-feedback').value = note.teacherFeedback || '';
    
    // Armazena o ID da nota no modal para referência
    document.getElementById('note-modal').dataset.id = noteId;
    
    // Mostra o modal
    document.getElementById('note-modal').classList.remove('hidden');
}

// Fecha o modal de anotação
document.getElementById('close-note-modal').addEventListener('click', closeNoteModal);
document.getElementById('cancel-feedback').addEventListener('click', closeNoteModal);

function closeNoteModal() {
    document.getElementById('note-modal').classList.add('hidden');
}

// Salva o feedback do professor
document.getElementById('save-feedback').addEventListener('click', function() {
    const noteId = parseInt(document.getElementById('note-modal').dataset.id);
    if (!noteId) return;
    
    const feedback = document.getElementById('teacher-feedback').value.trim();
    
    // Atualiza a anotação com o feedback
    notes = notes.map(note => {
        if (note.id === noteId) {
            return { ...note, teacherFeedback: feedback };
        }
        return note;
    });
    
    alert('Feedback salvo com sucesso!');
    closeNoteModal();
});

// Fecha a sidebar
document.getElementById('close-sidebar').addEventListener('click', closeSidebar);
document.getElementById('sidebar-overlay').addEventListener('click', closeSidebar);

function closeSidebar() {
    document.getElementById('notes-sidebar').classList.remove('active');
    document.getElementById('sidebar-overlay').classList.remove('active');
}

// Busca de alunos
document.getElementById('search-input').addEventListener('input', function() {
    loadStudents(this.value.trim());
});