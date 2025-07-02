document.addEventListener('DOMContentLoaded', function() {
    const loggedIn = localStorage.getItem('loggedIn');
    const user = JSON.parse(localStorage.getItem('user'));
    
    
    // Define o título padrão do sidebar
    document.getElementById('sidebar-student-name').textContent = 'Minhas Anotações';
    
    // Carrega o tema salvo no localStorage ou usa o tema claro por padrão
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Carrega as anotações do usuário
    loadNotes();

    // Configura o evento para mostrar campo de tópico personalizado
    document.getElementById('note-topic').addEventListener('change', function() {
        const customTopic = document.getElementById('custom-topic');
        if (this.value === 'outro') {
            customTopic.classList.remove('hidden');
            customTopic.focus();
        } else {
            customTopic.classList.add('hidden');
            customTopic.value = '';
        }
    });

    // Evento do botão "Visualizar Anotações"
    document.getElementById('view-notes-btn').addEventListener('click', function() {
        loadNotes();
        document.getElementById('notes-sidebar').classList.add('active');
        document.getElementById('sidebar-overlay').classList.add('active');
    });
});

// Respostas pré-programadas para cada tópico
const TOPIC_RESPONSES = {
    "procedimento-paciente": `
        <h3>Orientações para Procedimentos com Pacientes</h3>
        <ol>
            <li>Verifique a identificação do paciente</li>
            <li>Explique o procedimento e obtenha consentimento</li>
            <li>Prepare o ambiente e materiais necessários</li>
            <li>Siga protocolos de assepsia</li>
            <li>Registre todas as etapas e observações</li>
        </ol>
    `,
    "diagnostico-diferencial": `
        <h3>Fluxo para Diagnóstico Diferencial</h3>
        <ol>
            <li>Liste todas as hipóteses diagnósticas possíveis</li>
            <li>Priorize por probabilidade e gravidade</li>
            <li>Identifique exames complementares necessários</li>
            <li>Estabeleça critérios de inclusão/exclusão</li>
            <li>Documente o raciocínio clínico</li>
        </ol>
    `,
    "farmacologia": `
        <h3>Checklist Farmacológico</h3>
        <ul>
            <li>Verifique alergias do paciente</li>
            <li>Confira interações medicamentosas</li>
            <li>Ajuste dose para função renal/hepática</li>
            <li>Verifique via de administração correta</li>
            <li>Oriente sobre efeitos adversos e posologia</li>
        </ul>
    `,
    "exame-fisico": `
        <h3>Protocolo de Exame Físico</h3>
        <p><strong>Sequência básica:</strong> Inspeção → Palpação → Percussão → Ausculta</p>
        <p><strong>A documentar:</strong></p>
        <ul>
            <li>Achados normais e anormais</li>
            <li>Técnicas utilizadas</li>
            <li>Reação do paciente</li>
            <li>Terminologia técnica adequada</li>
        </ul>
    `,
    "emergencia": `
        <h3>Protocolo de Emergência</h3>
        <ol>
            <li>Realize avaliação primária (ABCDE)</li>
            <li>Estabilize o paciente</li>
            <li>Acione ajuda se necessário</li>
            <li>Documente hora e sequência de intervenções</li>
            <li>Registre evolução do quadro</li>
        </ol>
    `
};

/**
 * Carrega as anotações do usuário no sidebar
 */
function loadNotes() {
    try {
        const notes = JSON.parse(localStorage.getItem('studentNotes')) || [];
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!user) {
            console.error('Usuário não encontrado no localStorage');
            return;
        }
        
        // Filtra apenas as anotações do usuário atual
        const studentNotes = notes.filter(note => note.studentId === user.id);
        const sidebarList = document.getElementById('sidebar-notes-list');

        // Preenche a lista de anotações no sidebar
        sidebarList.innerHTML = studentNotes.length > 0
            ? studentNotes.map(note => `
                <div class="sidebar-note" data-id="${note.id}">
                    <span class="note-topic">${note.topic ? note.topic.toUpperCase() : 'GERAL'}</span>
                    <h4>${note.title || 'Sem título'}</h4>
                    <p>${note.date} • ${note.content.substring(0, 30)}${note.content.length > 30 ? '...' : ''}</p>
                </div>
            `).join('')
            : '<div class="no-notes"><i class="fas fa-book-open"></i><p>Nenhuma anotação encontrada</p></div>';

        // Adiciona eventos de clique para abrir anotações no modal de edição
        document.querySelectorAll('.sidebar-note').forEach(note => {
            note.addEventListener('click', function() {
                const noteId = parseInt(this.getAttribute('data-id'));
                if (!isNaN(noteId)) {
                    openEditModal(noteId);
                }
            });
        });
    } catch (error) {
        console.error('Erro ao carregar anotações:', error);
        document.getElementById('sidebar-notes-list').innerHTML = 
            '<div class="error-message">Erro ao carregar anotações. Recarregue a página.</div>';
    }
}

/**
 * Salva uma anotação no localStorage
 * @param {string} title - Título da anotação
 * @param {string} content - Conteúdo da anotação
 * @param {string|null} topic - Tópico selecionado
 * @returns {object} A nota salva
 */
function saveStudentNote(title, content, topic = null) {
    const notes = JSON.parse(localStorage.getItem('studentNotes')) || [];
    const user = JSON.parse(localStorage.getItem('user'));

    // Garante um ID único
    const newId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : Date.now();

    const newNote = {
        id: newId,
        studentId: user.id,
        title,
        content,
        topic,
        date: new Date().toLocaleDateString('pt-BR'),
        suggestions: topic && topic !== 'outro' ? TOPIC_RESPONSES[topic] : null,
        lastEdited: new Date().toISOString()
    };

    notes.unshift(newNote);
    localStorage.setItem('studentNotes', JSON.stringify(notes));
    return newNote;
}

/**
 * Abre o modal de edição para uma anotação específica
 * @param {number} noteId - ID da anotação a ser editada
 */
function openEditModal(noteId) {
    try {
        const notes = JSON.parse(localStorage.getItem('studentNotes')) || [];
        const note = notes.find(n => n.id === noteId);
        
        if (!note) {
            alert('Anotação não encontrada!');
            return;
        }
        
        // Preenche os campos do modal
        document.getElementById('edit-note-title').value = note.title || '';
        document.getElementById('edit-note-content').value = note.content || '';
        
        // Exibe sugestões se existirem
        const suggestionsContainer = document.getElementById('edit-note-suggestions');
        const suggestionsContent = document.getElementById('edit-suggestions-content');
        
        if (note.suggestions) {
            suggestionsContent.innerHTML = note.suggestions;
            suggestionsContainer.classList.remove('hidden');
        } else {
            suggestionsContainer.classList.add('hidden');
        }
        
        // Armazena o ID da nota
        document.getElementById('update-note-btn').dataset.id = noteId;
        document.getElementById('delete-note-btn').dataset.id = noteId;
        
        // Mostra o modal
        document.getElementById('edit-note-modal').classList.remove('hidden');
    } catch (error) {
        console.error('Erro ao abrir modal de edição:', error);
        alert('Erro ao carregar anotação para edição');
    }
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
 * Evento do botão "Analisar"
 * Mostra as respostas programadas conforme o tópico selecionado
 */
document.getElementById('analyze-btn').addEventListener('click', function() {
    const topic = document.getElementById('note-topic').value;
    
    if (!topic || topic === 'outro') {
        alert('Por favor, selecione um tópico pré-definido para ver as orientações');
        return;
    }

    if (TOPIC_RESPONSES[topic]) {
        document.getElementById('suggestions-content').innerHTML = TOPIC_RESPONSES[topic];
        document.getElementById('suggestions-container').classList.remove('hidden');
    } else {
        alert('Nenhuma orientação disponível para este tópico');
    }
});

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

    try {
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
        
        // // Salva no localStorage
        // localStorage.setItem('studentNotes', JSON.stringify(updatedNotes));
        
        alert('Anotação atualizada com sucesso!');
        closeEditModal();
        loadNotes();
    } catch (error) {
        console.error('Erro ao atualizar anotação:', error);
        alert('Erro ao atualizar anotação');
    }
});

/**
 * Evento do botão "Excluir" no modal de edição
 * Remove a anotação após confirmação
 */
document.getElementById('delete-note-btn').addEventListener('click', function() {
    if (!confirm('Tem certeza que deseja excluir esta anotação?')) return;
    
    const noteId = parseInt(this.dataset.id);
    
    try {
        const notes = JSON.parse(localStorage.getItem('studentNotes')) || [];
        
        // Filtra removendo a nota com o ID especificado
        const updatedNotes = notes.filter(note => note.id !== noteId);
        
        // Salva no localStorage
        localStorage.setItem('studentNotes', JSON.stringify(updatedNotes));
        
        alert('Anotação excluída com sucesso!');
        closeEditModal();
        loadNotes();
    } catch (error) {
        console.error('Erro ao excluir anotação:', error);
        alert('Erro ao excluir anotação');
    }
});

/**
 * Exporta todas as anotações para um arquivo PDF
 */
function exportToPDF() {
    try {
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
            
            // Tópico e data
            doc.setFontSize(12);
            doc.setTextColor(107, 114, 128);
            doc.text(`Tópico: ${note.topic || 'Geral'} • ${note.date}`, 105, yPosition, { align: 'center' });
            yPosition += 15;
            
            // Conteúdo da anotação
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            const contentLines = doc.splitTextToSize(note.content, 180);
            doc.text(contentLines, 15, yPosition);
            yPosition += contentLines.length * 7 + 10;
            
            // Sugestões (se existirem)
            if (note.suggestions) {
                doc.setFontSize(14);
                doc.setTextColor(59, 130, 246);
                doc.text('Orientações:', 15, yPosition);
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
        
        // Salva o PDF
        doc.save(`Anotações MedNotes - ${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`);
    } catch (error) {
        console.error('Erro ao exportar PDF:', error);
        alert('Erro ao gerar PDF');
    }
}

// Evento do botão de exportar PDF
document.getElementById('export-pdf-btn').addEventListener('click', exportToPDF);

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
    document.getElementById('note-content').value = '';
    document.getElementById('suggestions-container').classList.add('hidden');
});

// Função para fechar o sidebar
function closeSidebar() {
    document.getElementById('notes-sidebar').classList.remove('active');
    document.getElementById('sidebar-overlay').classList.remove('active');
}

// Eventos para fechar o sidebar
document.getElementById('close-sidebar').addEventListener('click', closeSidebar);
document.getElementById('sidebar-overlay').addEventListener('click', closeSidebar);

// Evento para fechar as sugestões da IA
document.getElementById('close-suggestions').addEventListener('click', () => {
    document.getElementById('suggestions-container').classList.add('hidden');
});