// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', function() {
    // Aplica o tema salvo no localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // Define o título da sidebar
    document.getElementById('sidebar-student-name').textContent = 'Minhas Anotações';

    // Carrega as anotações ao iniciar
    loadNotes();

    // Botão para abrir a sidebar e exibir anotações
    document.getElementById('view-notes-btn').addEventListener('click', function() {
        loadNotes();
        document.getElementById('notes-sidebar').classList.add('active');
        document.getElementById('sidebar-overlay').classList.add('active');
    });

    // Botão de nova anotação: limpa campos e esconde sugestões
    document.getElementById('new-note-btn').addEventListener('click', () => {
        document.getElementById('note-topic').selectedIndex = 0;
        document.getElementById('note-subtitle').value = '';
        document.getElementById('note-content').value = '';
        document.getElementById('suggestions-container').classList.add('hidden');
    });

    // Fecha sidebar
    document.getElementById('close-sidebar').addEventListener('click', closeSidebar);
    document.getElementById('sidebar-overlay').addEventListener('click', closeSidebar);

    // Fecha sugestões da Florense
    document.getElementById('close-suggestions').addEventListener('click', () => {
        document.getElementById('suggestions-container').classList.add('hidden');
    });

    // Fecha o modal de edição
    document.getElementById('close-edit-modal').addEventListener('click', () => {
        document.getElementById('edit-note-modal').classList.add('hidden');
    });

    // Envia nova anotação via AJAX
    document.getElementById('note-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(this);

        fetch('index.php?action=salvar-anotacao', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            // alert("Anotação salva com sucesso!"); //Oculto para evitar pop-ups e funcionar apenas com animação
            loadNotes();

            // Limpa campos e sugestões
            document.getElementById('note-topic').selectedIndex = 0;
            document.getElementById('note-subtitle').value = '';
            document.getElementById('note-content').value = '';
            document.getElementById('suggestions-container').classList.add('hidden');
        })
        .catch(error => {
            console.error("Erro ao salvar:", error);
            alert("Erro ao salvar a anotação. Tente novamente.");
        });
    });

    // Atualiza anotação existente
    document.getElementById('update-note-btn').addEventListener('click', function () {
        const id = this.dataset.id;
        const titulo = document.getElementById('edit-note-title').value.trim();
        const subtitulo = document.getElementById('edit-note-subtitle').value.trim();
        const descricao = document.getElementById('edit-note-content').value.trim();

        if (!titulo || !subtitulo || !descricao) {
            alert('Preencha todos os campos!');
            return;
        }

        fetch('index.php?action=atualizar-anotacao', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id=${id}&titulo=${encodeURIComponent(titulo)}&subtitulo=${encodeURIComponent(subtitulo)}&descricao=${encodeURIComponent(descricao)}`
        })
        .then(res => res.json())
        .then(data => {
            if (data.sucesso) {
                alert('Anotação atualizada com sucesso!');
                document.getElementById('edit-note-modal').classList.add('hidden');
                loadNotes();
            } else {
                alert(data.erro || 'Erro ao atualizar.');
            }
        });
    });

    // Exclui anotação existente
    document.getElementById('delete-note-btn').addEventListener('click', function () {
        const id = this.dataset.id;

        if (!confirm('Tem certeza que deseja excluir esta anotação?')) return;

        fetch('index.php?action=excluir-anotacao', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id=${id}`
        })
        .then(res => res.json())
        .then(data => {
            if (data.sucesso) {
                alert('Anotação excluída!');
                document.getElementById('edit-note-modal').classList.add('hidden');
                loadNotes();
            } else {
                alert(data.erro || 'Erro ao excluir.');
            }
        });
    });

    // Mostra sugestões da Florense conforme o tópico
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
});

// Fecha a sidebar
function closeSidebar() {
    document.getElementById('notes-sidebar').classList.remove('active');
    document.getElementById('sidebar-overlay').classList.remove('active');
}

// Aplica tema claro ou escuro
function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark-mode');
        document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// Alterna entre os temas
function toggleTheme() {
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
}

// Botão de alternância de tema
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

// Carrega todas as anotações do aluno
function loadNotes() {
    fetch('index.php?action=listar-anotacoes-aluno')
        .then(response => response.json())
        .then(anotacoes => {
            const sidebarList = document.getElementById('sidebar-notes-list');

            if (anotacoes.length === 0) {
                sidebarList.innerHTML = '<div class="no-notes"><i class="fas fa-book-open"></i><p>Nenhuma anotação encontrada</p></div>';
                return;
            }

            sidebarList.innerHTML = '';

            anotacoes.forEach(note => {
                const noteItem = document.createElement('div');
                noteItem.className = 'sidebar-note';
                noteItem.dataset.id = note.id;
                noteItem.innerHTML = `
                    <span class="note-topic">${note.titulo}</span>
                    <h4>${note.subtitulo}</h4>
                    <p>${new Date(note.data_registro).toLocaleDateString('pt-BR')} • ${note.descricao.substring(0, 30)}${note.descricao.length > 30 ? '...' : ''}</p>
                `;

                // Ao clicar na anotação, abre o modal de edição
                noteItem.addEventListener('click', () => openEditModal(note));

                sidebarList.appendChild(noteItem);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar anotações:', error);
            document.getElementById('sidebar-notes-list').innerHTML =
                '<div class="error-message">Erro ao carregar anotações. Recarregue a página.</div>';
        });
}

// Abre o modal de edição e carrega os dados da anotação + feedbacks
function openEditModal(note) {
    // Preenche os campos da anotação
    document.getElementById('edit-note-title').value = note.titulo;
    document.getElementById('edit-note-subtitle').value = note.subtitulo;
    document.getElementById('edit-note-content').value = note.descricao;

    // Armazena o ID da anotação
    document.getElementById('update-note-btn').dataset.id = note.id;
    document.getElementById('delete-note-btn').dataset.id = note.id;

    // Carrega os feedbacks do professor para esta anotação
    carregarFeedbacks(note.id);

    // Exibe o modal
    document.getElementById('edit-note-modal').classList.remove('hidden');
}

// Busca os feedbacks da anotação específica no servidor
function carregarFeedbacks(atividadeId) {
    fetch(`index.php?action=listarFeedbacksPorAtividade&atividade_id=${atividadeId}`)
        .then(res => res.json())
        .then(data => {
            const feedbackContainer = document.getElementById('edit-feedback-content');
            feedbackContainer.innerHTML = '';

            if (data.length === 0) {
                feedbackContainer.innerHTML = '<p class="text-gray-500">Nenhum feedback registrado ainda.</p>';
            } else {
                data.forEach(fb => {
                    const item = document.createElement('div');
                    item.className = 'feedback-item border-b border-gray-200 pb-2 mb-2';
                    item.innerHTML = `
                        <div class="feedback-header flex justify-between text-xs text-gray-600 mb-1" style="color: var(--text-color);">
                            <span><strong>Prof.</strong> ${fb.professor_nome}</span>
                            <span>${new Date(fb.data_feedback).toLocaleString('pt-BR')}</span>
                        </div>
                        <p class="text-sm text-gray-700" style="color: var(--text-color);">${fb.comentario.replace(/\n/g, '<br>')}</p>
                    `;
                    feedbackContainer.appendChild(item);
                });
            }
        })
        .catch(error => {
            console.error("Erro ao carregar feedbacks:", error);
        });
}


//Estilização de animação para o botão de salvar

document.querySelector('.save-button').addEventListener('click', function() {
    const button = this;
    
    // Validação simples do formulário
    const form = document.getElementById('note-form');
    if (form && !form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Confirmação visual
    button.classList.add('success');
    
    // Volta ao normal após 1,5 segundos
    setTimeout(() => {
        button.classList.remove('success');
    }, 1500);
});