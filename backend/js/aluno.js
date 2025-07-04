// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', function() {
    // Obtém o tema salvo no localStorage ou usa 'light' como padrão
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme); // Aplica o tema

    // Define o título da sidebar
    document.getElementById('sidebar-student-name').textContent = 'Minhas Anotações';

    // Carrega as anotações do servidor
    loadNotes();

    // Configura o botão para visualizar anotações
    document.getElementById('view-notes-btn').addEventListener('click', function() {
        loadNotes(); // Recarrega as anotações
        // Abre a sidebar
        document.getElementById('notes-sidebar').classList.add('active');
        document.getElementById('sidebar-overlay').classList.add('active');
    });

    // Configura o botão de nova anotação
    document.getElementById('new-note-btn').addEventListener('click', () => {
        // Limpa os campos do formulário
        document.getElementById('note-topic').selectedIndex = 0;
        document.getElementById('note-subtitle').value = '';
        document.getElementById('note-content').value = '';
        // Esconde o container de sugestões
        document.getElementById('suggestions-container').classList.add('hidden');
    });

    // Configura botões para fechar a sidebar
    document.getElementById('close-sidebar').addEventListener('click', closeSidebar);
    document.getElementById('sidebar-overlay').addEventListener('click', closeSidebar);

    // Configura botão para fechar sugestões
    document.getElementById('close-suggestions').addEventListener('click', () => {
        document.getElementById('suggestions-container').classList.add('hidden');
    });

    // Configura botão para fechar o modal de edição
    document.getElementById('close-edit-modal').addEventListener('click', () => {
        document.getElementById('edit-note-modal').classList.add('hidden');
    });

    // Configura o envio do formulário de nova anotação via AJAX
    document.getElementById('note-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Previne o envio tradicional do formulário

        const formData = new FormData(this); // Cria FormData com os dados do formulário

        // Envia os dados via fetch
        fetch('index.php?action=salvar-anotacao', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            alert("Anotação salva com sucesso!");
            loadNotes(); // Recarrega a lista de anotações

            // Limpa os campos após o sucesso
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

    // Configura o botão de atualizar anotação no modal de edição
    document.getElementById('update-note-btn').addEventListener('click', function () {
        const id = this.dataset.id; // Obtém o ID da anotação
        const titulo = document.getElementById('edit-note-title').value.trim();
        const subtitulo = document.getElementById('edit-note-subtitle').value.trim();
        const descricao = document.getElementById('edit-note-content').value.trim();

        // Validação dos campos
        if (!titulo || !subtitulo || !descricao) {
            alert('Preencha todos os campos!');
            return;
        }

        // Envia os dados atualizados via fetch
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
                loadNotes(); // Recarrega a lista
            } else {
                alert(data.erro || 'Erro ao atualizar.');
            }
        });
    });

    // Configura o botão de excluir anotação no modal de edição
    document.getElementById('delete-note-btn').addEventListener('click', function () {
        const id = this.dataset.id; // Obtém o ID da anotação

        // Confirmação antes de excluir
        if (!confirm('Tem certeza que deseja excluir esta anotação?')) return;

        // Envia a requisição de exclusão
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
                loadNotes(); // Recarrega a lista
            } else {
                alert(data.erro || 'Erro ao excluir.');
            }
        });
    });

    // Configura o botão para analisar com Florense (mostrar sugestões)
    document.getElementById('analyze-btn').addEventListener('click', function() {
        const topic = document.getElementById('note-topic').value;

        // Verifica se um tópico válido foi selecionado
        if (!topic || topic === 'outro') {
            alert('Por favor, selecione um tópico pré-definido para ver as orientações');
            return;
        }

        // Verifica se há sugestões para o tópico selecionado
        if (TOPIC_RESPONSES[topic]) {
            document.getElementById('suggestions-content').innerHTML = TOPIC_RESPONSES[topic];
            document.getElementById('suggestions-container').classList.remove('hidden');
        } else {
            alert('Nenhuma orientação disponível para este tópico');
        }
    });
});

// Função para fechar a sidebar
function closeSidebar() {
    document.getElementById('notes-sidebar').classList.remove('active');
    document.getElementById('sidebar-overlay').classList.remove('active');
}

// Função para aplicar o tema (dark/light mode)
function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark-mode');
        document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// Função para alternar entre temas
function toggleTheme() {
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Salva a preferência
}

// Configura o botão de alternar tema
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

// Função para carregar anotações do servidor
function loadNotes() {
    fetch('index.php?action=listar-anotacoes-aluno')
        .then(response => response.json())
        .then(anotacoes => {
            const sidebarList = document.getElementById('sidebar-notes-list');
            
            // Se não houver anotações, mostra mensagem
            if (anotacoes.length === 0) {
                sidebarList.innerHTML = '<div class="no-notes"><i class="fas fa-book-open"></i><p>Nenhuma anotação encontrada</p></div>';
                return;
            }

            // Limpa a lista antes de adicionar novos itens
            sidebarList.innerHTML = '';

            // Cria elementos para cada anotação
            anotacoes.forEach(note => {
                const noteItem = document.createElement('div');
                noteItem.className = 'sidebar-note';
                noteItem.dataset.id = note.id;
                noteItem.innerHTML = `
                    <span class="note-topic">${note.titulo}</span>
                    <h4>${note.subtitulo}</h4>
                    <p>${new Date(note.data_registro).toLocaleDateString('pt-BR')} • ${note.descricao.substring(0, 30)}${note.descricao.length > 30 ? '...' : ''}</p>
                `;

                // Adiciona evento para abrir o modal de edição ao clicar
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

// Função para abrir o modal de edição com os dados de uma anotação
function openEditModal(note) {
    // Preenche os campos do modal com os dados da anotação
    document.getElementById('edit-note-title').value = note.titulo;
    document.getElementById('edit-note-subtitle').value = note.subtitulo;
    document.getElementById('edit-note-content').value = note.descricao;
    
    // Armazena o ID da anotação nos botões de atualizar/excluir
    document.getElementById('update-note-btn').dataset.id = note.id;
    document.getElementById('delete-note-btn').dataset.id = note.id;
    
    // Mostra o modal
    document.getElementById('edit-note-modal').classList.remove('hidden');
}