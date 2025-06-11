/**
 * Verifica se o usuário está logado ao carregar a página
 * Se não estiver logado, redireciona para a página de login
 */
document.addEventListener('DOMContentLoaded', function() {

    // Define o título padrão do sidebar
    document.getElementById('sidebar-student-name').textContent = 'Minhas Anotações';
    
    // Carrega o tema salvo no localStorage ou usa o tema claro por padrão
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Carrega as anotações do usuário
    loadNotes();
});

/**
 * Função para enviar pergunta para a API de IA
 * @param {string} textoAnotacao - Texto da anotação a ser analisado
 * @returns {Promise<string>} Resposta da IA
 */
async function enviarPergunta(textoAnotacao) {
    try {
        const response = await fetch("http://localhost:3000/api/pergunta", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ pergunta: textoAnotacao })
        });

        const data = await response.json();
        return data.resposta || "Sem resposta da IA.";
    } catch (error) {
        console.error("Erro ao buscar resposta da IA:", error);
        return "Erro ao buscar resposta da IA.";
    }
}

/**
 * Evento do botão "Analisar com IA"
 * Envia o conteúdo da anotação para análise e exibe as sugestões
 */
document.getElementById('analyze-btn').addEventListener('click', async function() {
    const title = document.getElementById('note-title').value.trim();
    const content = document.getElementById('note-content').value.trim();

    if (!content) {
        alert('Por favor, escreva algo para analisar');
        return;
    }

    // Mostra o modal de carregamento
    document.getElementById('loading-modal').classList.remove('hidden');

    // Envia para análise e obtém resposta da IA
    const respostaIA = await enviarPergunta(content);

    // Salva a anotação com as sugestões da IA
    saveStudentNote(title, content, respostaIA);
    
    // Recarrega a lista de anotações
    loadNotes();
    
    // Esconde o modal de carregamento
    document.getElementById('loading-modal').classList.add('hidden');

    // Exibe as sugestões na tela
    document.getElementById('suggestions-content').innerHTML = respostaIA;
    document.getElementById('suggestions-container').classList.remove('hidden');
});

/**
 * Evento do botão "Salvar"
 * Salva a anotação sem análise de IA
 */
document.getElementById('save-btn').addEventListener('click', function() {
    const title = document.getElementById('note-title').value.trim();
    const content = document.getElementById('note-content').value.trim();

    if (!content) {
        alert('Por favor, escreva algo para salvar');
        return;
    }

    // Salva a anotação
    saveStudentNote(title, content);
    
    // Recarrega a lista de anotações
    loadNotes();

    // Feedback visual de sucesso
    const saveBtn = document.getElementById('save-btn');
    saveBtn.innerHTML = '<i class="fas fa-check"></i> Salvo!';
    saveBtn.classList.add('success');

    // Limpa os campos
    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';

    // Restaura o botão após 2 segundos
    setTimeout(() => {
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Salvar';
        saveBtn.classList.remove('success');
    }, 2000);
});

/**
 * Salva uma anotação no localStorage
 * @param {string} title - Título da anotação
 * @param {string} content - Conteúdo da anotação
 * @param {string|null} suggestions - Sugestões da IA (opcional)
 * @returns {object} A nota salva
 */
function saveStudentNote(title, content, suggestions = null) {
    const notes = JSON.parse(localStorage.getItem('studentNotes')) || [];
    const user = JSON.parse(localStorage.getItem('user'));

    // Verifica se já existe uma nota com o mesmo título e conteúdo
    const existingNoteIndex = notes.findIndex(note => 
        note.title === title && 
        note.content === content && 
        note.studentId === user.id
    );

    // Cria o objeto da nova nota
    const newNote = {
        id: existingNoteIndex !== -1 ? notes[existingNoteIndex].id : Date.now(),
        studentId: user.id,
        title,
        content,
        date: new Date().toLocaleDateString('pt-BR'),
        suggestions,
        lastEdited: new Date().toISOString()
    };

    // Atualiza ou adiciona a nota
    if (existingNoteIndex !== -1) {
        notes[existingNoteIndex] = newNote;
    } else {
        notes.unshift(newNote);
    }

    // Salva no localStorage
    localStorage.setItem('studentNotes', JSON.stringify(notes));
    return newNote;
}

/**
 * Carrega as anotações do usuário no sidebar
 */
function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('studentNotes')) || [];
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Filtra apenas as anotações do usuário atual
    const studentNotes = notes.filter(note => note.studentId === user.id);
    const sidebarList = document.getElementById('sidebar-notes-list');

    // Preenche a lista de anotações no sidebar
    sidebarList.innerHTML = studentNotes.length > 0
        ? studentNotes.map(n => `
            <div class="sidebar-note" data-id="${n.id}">
                <h4>${n.title || 'Sem título'}</h4>
                <p>${n.date} • ${n.content.substring(0, 20)}${n.content.length > 20 ? '...' : ''}</p>
            </div>
        `).join('')
        : '<p>Nenhuma anotação ainda.</p>';

    // Adiciona eventos de clique para abrir anotações no modal de edição
    document.querySelectorAll('.sidebar-note').forEach(note => {
        note.addEventListener('click', function() {
            const noteId = parseInt(this.dataset.id);
            openEditModal(noteId);
        });
    });
}

/**
 * Abre o modal de edição para uma anotação específica
 * @param {number} noteId - ID da anotação a ser editada
 */
function openEditModal(noteId) {
    const notes = JSON.parse(localStorage.getItem('studentNotes')) || [];
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    // Preenche os campos do modal com os dados da anotação
    document.getElementById('edit-note-title').value = note.title || '';
    document.getElementById('edit-note-content').value = note.content || '';
    
    // Exibe sugestões da IA se existirem
    if (note.suggestions) {
        document.getElementById('edit-suggestions-content').innerHTML = note.suggestions;
        document.getElementById('edit-note-suggestions').classList.remove('hidden');
    } else {
        document.getElementById('edit-note-suggestions').classList.add('hidden');
    }
    
    // Armazena o ID da nota nos botões de ação
    document.getElementById('update-note-btn').dataset.id = noteId;
    document.getElementById('delete-note-btn').dataset.id = noteId;
    
    // Mostra o modal
    document.getElementById('edit-note-modal').classList.remove('hidden');
}

/**
 * Fecha o modal de edição
 */
function closeEditModal() {
    document.getElementById('edit-note-modal').classList.add('hidden');
}

// Evento para fechar o modal de edição
document.getElementById('close-edit-modal').addEventListener('click', closeEditModal);

/**
 * Evento do botão "Atualizar" no modal de edição
 * Salva as alterações na anotação
 */
document.getElementById('update-note-btn').addEventListener('click', function() {
    const noteId = parseInt(this.dataset.id);
    const title = document.getElementById('edit-note-title').value.trim();
    const content = document.getElementById('edit-note-content').value.trim();

    if (!content) {
        alert('Por favor, escreva algo para salvar');
        return;
    }

    const notes = JSON.parse(localStorage.getItem('studentNotes')) || [];
    
    // Atualiza a nota no array
    const updatedNotes = notes.map(note => {
        if (note.id === noteId) {
            return {
                ...note,
                title,
                content,
                lastEdited: new Date().toISOString()
            };
        }
        return note;
    });
    
    // Salva no localStorage
    localStorage.setItem('studentNotes', JSON.stringify(updatedNotes));
    
    alert('Anotação atualizada com sucesso!');
    closeEditModal();
    loadNotes();
});

/**
 * Evento do botão "Excluir" no modal de edição
 * Remove a anotação após confirmação
 */
document.getElementById('delete-note-btn').addEventListener('click', function() {
    if (!confirm('Tem certeza que deseja excluir esta anotação?')) return;
    
    const noteId = parseInt(this.dataset.id);
    const notes = JSON.parse(localStorage.getItem('studentNotes')) || [];
    
    // Filtra removendo a nota com o ID especificado
    const updatedNotes = notes.filter(note => note.id !== noteId);
    
    // Salva no localStorage
    localStorage.setItem('studentNotes', JSON.stringify(updatedNotes));
    
    alert('Anotação excluída com sucesso!');
    closeEditModal();
    loadNotes();
});

/**
 * Exporta todas as anotações para um arquivo PDF
 */
document.getElementById('export-pdf-btn').addEventListener('click', exportToPDF);

function exportToPDF() {
    const notes = JSON.parse(localStorage.getItem('studentNotes')) || [];
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Filtra apenas as anotações do usuário atual
    const studentNotes = notes.filter(note => note.studentId === user.id);
    
    if (studentNotes.length === 0) {
        alert('Não há anotações para exportar');
        return;
    }

    // Cria um novo documento PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    let yPosition = 20; // Posição vertical inicial
    
    // Adiciona cada anotação ao PDF
    studentNotes.forEach((note, index) => {
        // Título da anotação
        doc.setFontSize(18);
        doc.setTextColor(59, 130, 246);
        doc.text(note.title || 'Anotação sem título', 105, yPosition, { align: 'center' });
        yPosition += 10;
        
        // Data da anotação
        doc.setFontSize(12);
        doc.setTextColor(107, 114, 128);
        doc.text(`Criado em: ${note.date}`, 105, yPosition, { align: 'center' });
        yPosition += 15;
        
        // Conteúdo da anotação
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        const contentLines = doc.splitTextToSize(note.content, 180);
        doc.text(contentLines, 15, yPosition);
        yPosition += contentLines.length * 7 + 10;
        
        // Sugestões da IA (se existirem)
        if (note.suggestions) {
            doc.setFontSize(14);
            doc.setTextColor(59, 130, 246);
            doc.text('Sugestões da IA:', 15, yPosition);
            yPosition += 10;
            
            // Remove tags HTML das sugestões
            const suggestionsText = note.suggestions.replace(/<[^>]*>/g, '');
            const suggestionLines = doc.splitTextToSize(suggestionsText, 180);
            doc.text(suggestionLines, 15, yPosition);
            yPosition += suggestionLines.length * 7 + 10;
        }
        
        // Adiciona nova página se não for a última anotação
        if (index < studentNotes.length - 1) {
            doc.addPage();
            yPosition = 20;
        }
    });
    
    // Rodapé do PDF
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text('Exportado do MedNotes - Caderneta Digital', 105, 285, { align: 'center' });
    
    // Salva o PDF com nome baseado na data atual
    doc.save(`Anotações MedNotes - ${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`);
}

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

// Evento do botão de logout
document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('user');
    window.location.href = "/../../login.html";
});

// Evento do botão "Nova Anotação" no menu mobile
document.getElementById('new-note-btn').addEventListener('click', () => {
    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';
    document.getElementById('suggestions-container').classList.add('hidden');
});

// Evento do botão "Visualizar Anotações" no menu mobile
document.getElementById('view-notes-btn').addEventListener('click', () => {
    document.getElementById('notes-sidebar').classList.add('active');
    document.getElementById('sidebar-overlay').classList.add('active');
});

// Eventos para fechar o sidebar
document.getElementById('close-sidebar').addEventListener('click', closeSidebar);
document.getElementById('sidebar-overlay').addEventListener('click', closeSidebar);

/**
 * Fecha o sidebar de anotações
 */
function closeSidebar() {
    document.getElementById('notes-sidebar').classList.remove('active');
    document.getElementById('sidebar-overlay').classList.remove('active');
}

// Evento para fechar as sugestões da IA
document.getElementById('close-suggestions').addEventListener('click', () => {
    document.getElementById('suggestions-container').classList.add('hidden');
});