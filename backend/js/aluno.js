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
        document.getElementById('florence-modal').classList.add('hidden');
    });

    // Fecha sidebar
    document.getElementById('close-sidebar').addEventListener('click', closeSidebar);
    document.getElementById('sidebar-overlay').addEventListener('click', closeSidebar);

    // Fecha sugestões da Florence
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
            loadNotes();
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

    // --- MODAL DA FLORENCE - VERSÃO COMPLETA E CORRIGIDA ---
    const florenceModal = document.getElementById('florence-modal');
const closeFlorenceBtn = document.getElementById('close-florence-modal');
const askFlorenceBtn = document.getElementById('ask-florence-btn');
const florenceQuestion = document.getElementById('florence-question');
const florenceAnswer = document.getElementById('florence-answer');

// Adicionando efeito hover ao botão "Perguntar à Florence"
if (askFlorenceBtn) {
    askFlorenceBtn.style.transition = 'background-color 0.3s ease';
    
    askFlorenceBtn.addEventListener('mouseenter', () => {
        askFlorenceBtn.style.backgroundColor = 'var(--primary-dark)';
    });
    
    askFlorenceBtn.addEventListener('mouseleave', () => {
        askFlorenceBtn.style.backgroundColor = 'var(--primary-color)';
    });
}
    
    // Cria botão para aplicar sugestão
    const applySuggestionBtn = document.createElement('button');
    applySuggestionBtn.id = 'apply-suggestion-btn';
    applySuggestionBtn.className = 'w-full py-2 px-4 rounded font-medium mt-3';
    applySuggestionBtn.style.backgroundColor = 'var(--primary-color)';
    applySuggestionBtn.style.color = 'white';
    applySuggestionBtn.innerHTML = '<i class="fas fa-copy mr-2"></i> Usar esta sugestão na anotação';

    // Adiciona transição e efeitos hover
    applySuggestionBtn.style.transition = 'background-color 0.3s ease';
    applySuggestionBtn.addEventListener('mouseenter', () => {
        applySuggestionBtn.style.backgroundColor = 'var(--primary-dark)';
    });
    applySuggestionBtn.addEventListener('mouseleave', () => {
        applySuggestionBtn.style.backgroundColor = 'var(--primary-color)';
    });

    // Adiciona o botão ao DOM e oculta inicialmente
    florenceAnswer.parentNode.appendChild(applySuggestionBtn);
    applySuggestionBtn.classList.add('hidden');

    // Fecha modal com botão X
    closeFlorenceBtn.addEventListener('click', () => {
        florenceModal.classList.add('hidden');
    });

    // Fecha modal ao clicar no backdrop (área escura)
    florenceModal.addEventListener('click', (e) => {
        if (e.target === florenceModal) {
            florenceModal.classList.add('hidden');
        }
    });

    // Impede que cliques no conteúdo fechem o modal
    document.querySelector('#florence-modal > div').addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Mostra sugestões da Florence conforme o tópico
    document.getElementById('analyze-btn').addEventListener('click', function() {
        const topic = document.getElementById('note-topic').value;
        const topicText = document.getElementById('note-topic').options[document.getElementById('note-topic').selectedIndex].text;

        if (!topic || topic === 'outro') {
            alert('Por favor, selecione um tópico pré-definido para ver as orientações');
            return;
        }

        // Mostra o modal da Florence
        florenceModal.classList.remove('hidden');
        florenceQuestion.focus();
        
        // Se existir resposta pré-definida para o tópico, mostra automaticamente
        if (TOPIC_RESPONSES[topic]) {
            florenceQuestion.value = `Sobre ${topicText}`;
            florenceAnswer.innerHTML = TOPIC_RESPONSES[topic];
            florenceAnswer.classList.remove('hidden');
            applySuggestionBtn.classList.remove('hidden');
        } else {
            florenceAnswer.classList.add('hidden');
            applySuggestionBtn.classList.add('hidden');
        }
    });

    // Processar perguntas customizadas
    askFlorenceBtn.addEventListener('click', function() {
        const question = florenceQuestion.value.trim();
        
        if (!question) {
            alert('Por favor, digite sua pergunta');
            return;
        }

        // Mostra loading
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        this.disabled = true;

        setTimeout(() => {
            // Verifica se temos resposta pré-definida
            let answer = "Desculpe, não encontrei informações sobre este tópico. Por favor, reformule sua pergunta.";
            
            // Procura por correspondência aproximada
            for (const [key, value] of Object.entries(FLORENCE_ANSWERS)) {
                if (question.toLowerCase().includes(key.toLowerCase())) {
                    answer = value;
                    break;
                }
            }

            // Exibe a resposta
            florenceAnswer.innerHTML = answer.replace(/\n/g, '<br>');
            florenceAnswer.classList.remove('hidden');
            applySuggestionBtn.classList.remove('hidden');
            
            // Restaura o botão
            this.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar';
            this.disabled = false;
        }, 800);
    });

    // Aplica sugestão ao campo de texto principal
    applySuggestionBtn.addEventListener('click', function() {
        const currentContent = document.getElementById('note-content').value;
        const suggestion = florenceAnswer.textContent;
        
        document.getElementById('note-content').value = currentContent 
            ? `${currentContent}\n\n- Sugestão da Florence -\n${suggestion}`
            : suggestion;
        
        // Feedback visual
        this.innerHTML = '<i class="fas fa-check mr-2"></i> Sugestão aplicada!';
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-copy mr-2"></i> Usar esta sugestão na anotação';
        }, 2000);
    });

    // Botão de alternância de tema
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Botão de exportar PDF
    document.getElementById('export-pdf-btn').addEventListener('click', exportNotesToPDF);

    // Animação do botão salvar
    document.querySelector('.save-button').addEventListener('click', function() {
        const button = this;
        const form = document.getElementById('note-form');
        if (form && !form.checkValidity()) {
            form.reportValidity();
            return;
        }
        button.classList.add('success');
        setTimeout(() => {
            button.classList.remove('success');
        }, 1500);
    });
});

// --- FUNÇÕES GLOBAIS ---

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
    document.getElementById('edit-note-title').value = note.titulo;
    document.getElementById('edit-note-subtitle').value = note.subtitulo;
    document.getElementById('edit-note-content').value = note.descricao;

    document.getElementById('update-note-btn').dataset.id = note.id;
    document.getElementById('delete-note-btn').dataset.id = note.id;

    carregarFeedbacks(note.id);
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

// Filtra anotações na sidebar
function filtrarAnotacoes() {
    const filtro = document.getElementById('notes-search').value.toLowerCase();
    const cards = document.querySelectorAll('#sidebar-notes-list .sidebar-note');

    cards.forEach(card => {
        const titulo = card.querySelector('.note-topic')?.textContent.toLowerCase() || '';
        const subtitulo = card.querySelector('h4')?.textContent.toLowerCase() || '';
        const descricao = card.querySelector('p')?.textContent.toLowerCase() || '';
        
        const textoCompleto = `${titulo} ${subtitulo} ${descricao}`;
        card.style.display = textoCompleto.includes(filtro) ? 'block' : 'none';
    });
}

// Exporta anotações para PDF
async function exportNotesToPDF() {
    const loadingModal = document.getElementById('loading-modal');
    try {
        loadingModal.classList.remove('hidden');
        loadingModal.querySelector('span').textContent = 'Gerando PDF...';

        if (!window.jspdf) {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
        }
        const { jsPDF } = window.jspdf;
        
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Configurações de estilo e margens
        const styles = {
            primaryColor: '#3b82f6',
            textColor: '#000000',
            lightText: '#555555',
            header: { fontSize: 18, fontStyle: 'bold', textColor: '#ffffff' },
            title: { fontSize: 16, fontStyle: 'bold' },
            noteTitle: { fontSize: 14, fontStyle: 'bold' },
            subtitle: { fontSize: 12, fontStyle: 'italic' },
            date: { fontSize: 10 },
            body: { fontSize: 11 },
            footer: { fontSize: 10 }
        };

        const margin = 20;
        const maxWidth = doc.internal.pageSize.getWidth() - (margin * 2);
        let yPos = margin;
        const lineHeight = 6;
        const pageHeight = doc.internal.pageSize.getHeight() - margin;

        // Função para aplicar estilo
        const applyStyle = (style) => {
            doc.setFontSize(style.fontSize);
            doc.setFont('helvetica', style.fontStyle || 'normal');
            doc.setTextColor(style.textColor || styles.textColor);
        };

        // Adiciona cabeçalho
        const addHeader = () => {
            doc.setFillColor(styles.primaryColor);
            doc.rect(0, 0, doc.internal.pageSize.getWidth(), 20, 'F');
            applyStyle(styles.header);
            doc.text('MedNotes', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
            yPos = 30;
            applyStyle(styles.body);
        };

        // Adiciona texto com quebra de página
        const addText = (text, style) => {
            applyStyle(style);
            const lines = doc.splitTextToSize(text, maxWidth);
            
            for (let i = 0; i < lines.length; i++) {
                if (yPos > pageHeight) {
                    doc.addPage();
                    addHeader();
                    applyStyle(style);
                }
                doc.text(lines[i], margin, yPos);
                yPos += lineHeight;
            }
            yPos += lineHeight / 2;
        };

        // Busca anotações
        const response = await fetch('index.php?action=listar-anotacoes-aluno');
        const anotacoes = await response.json();

        if (!anotacoes || anotacoes.length === 0) {
            alert('Nenhuma anotação encontrada para exportar.');
            return;
        }

        addHeader();
        addText('MINHAS ANOTAÇÕES', { ...styles.title, textColor: styles.primaryColor });
        yPos += 10;

        // Adiciona cada anotação
        anotacoes.forEach((note, index) => {
            if (index > 0) {
                if (yPos + 5 > pageHeight) {
                    doc.addPage();
                    addHeader();
                }
                doc.setDrawColor(styles.primaryColor);
                doc.setLineWidth(0.5);
                doc.line(margin, yPos, margin + maxWidth, yPos);
                yPos += 10;
            }
            
            addText(note.titulo, { ...styles.noteTitle, textColor: styles.primaryColor });
            addText(note.subtitulo, styles.subtitle);
            
            const dataFormatada = new Date(note.data_registro).toLocaleDateString('pt-BR') || '';
            if (dataFormatada) {
                addText(dataFormatada, { ...styles.date, textColor: styles.lightText });
            }
            
            addText(note.descricao || 'Sem conteúdo', styles.body);
        });

        // Adiciona rodapé
        applyStyle({ ...styles.footer, textColor: styles.lightText });
        doc.text(`Gerado pelo MedNotes • ${new Date().toLocaleDateString('pt-BR')}`, 
                doc.internal.pageSize.getWidth() / 2, 
                doc.internal.pageSize.getHeight() - 10, 
                { align: 'center' });

        doc.save(`Anotacoes_MedNotes.pdf`);

    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        alert('Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.');
    } finally {
        loadingModal.classList.add('hidden');
    }
}

// Carrega scripts externos
function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// --- DICIONÁRIOS DE RESPOSTAS ---

// Respostas pré-definidas por tópico
const TOPIC_RESPONSES = {
    "Sinais Vitais - Conceitos Gerais": `
        <h3 class="font-bold mb-2">Sinais Vitais Básicos</h3>
        <p>Os sinais vitais incluem:</p>
        <ul class="list-disc pl-5 mt-2">
            <li>Temperatura corporal</li>
            <li>Pulso/frequência cardíaca</li>
            <li>Frequência respiratória</li>
            <li>Pressão arterial</li>
            <li>Dor (considerado o 5º sinal vital)</li>
            <li>Saturação de oxigênio (em alguns protocolos)</li>
        </ul>
        <p class="mt-2">Valores normais de referência podem variar conforme idade e condições específicas.</p>
    `,
    "Temperatura Corporal": `
        <h3 class="font-bold mb-2">Temperatura Corporal Normal</h3>
        <p>Valores de referência:</p>
        <ul class="list-disc pl-5 mt-2">
            <li><strong>Axilar:</strong> 35,5°C - 36,5°C</li>
            <li><strong>Oral:</strong> 36°C - 37,2°C</li>
            <li><strong>Retal:</strong> 36°C - 37,5°C</li>
            <li><strong>Timpânica:</strong> 35,8°C - 37°C</li>
        </ul>
        <p class="mt-2">Febre: acima de 37,8°C (axilar) ou 38°C (retal)</p>
    `,
    // Adicione mais respostas conforme necessário
};

// Respostas para perguntas customizadas
const FLORENCE_ANSWERS = {
    "o que é uma laranja": "A laranja é uma fruta cítrica rica em vitamina C, de cor alaranjada e sabor variando entre doce e levemente ácido. É excelente para fortalecer o sistema imunológico.",
    "o que é pressão arterial": "Pressão arterial é a força que o sangue exerce contra as paredes das artérias. Valores normais são em torno de 120/80 mmHg. A hipertensão ocorre quando esses valores estão consistentemente elevados.",
    "como medir temperatura": "Para medir temperatura corporal corretamente:\n1. Use um termômetro limpo\n2. Coloque sob a língua, na axila ou reto\n3. Aguarde o tempo recomendado pelo fabricante\n4. Leia o valor - normal é entre 36°C e 37,2°C",
    "como medir pressão": "Para medir a pressão arterial corretamente:\n1. Sente-se e descanse por 5 minutos\n2. Use um esfigmomanômetro validado\n3. Coloque a braçadeira no braço na altura do coração\n4. Não fale durante a medição\nValores normais: 120/80 mmHg",
    "o que é dor": "Dor é uma experiência sensorial e emocional desagradável associada a dano tecidual real ou potencial. É classificada em:\n- Aguda: curta duração\n- Crônica: persiste por mais de 3 meses\n- Nociceptiva: por dano tecidual\n- Neuropática: por lesão nervosa"
};