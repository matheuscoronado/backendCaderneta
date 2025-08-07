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

    // --- MODAL DA FLORENCE - VERSÃO CORRIGIDA ---
    const florenceModal = document.getElementById('florence-modal');
    const closeFlorenceBtn = document.getElementById('close-florence-modal');
    const askFlorenceBtn = document.getElementById('ask-florence-btn');
    const florenceQuestion = document.getElementById('florence-question');
    const florenceAnswer = document.getElementById('florence-answer');

    // Configuração do botão de pergunta
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
            florenceAnswer.textContent = formatFlorenceAnswer(TOPIC_RESPONSES[topic].replace(/<[^>]*>/g, '')); // Remove tags HTML
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
        const originalBtnText = this.innerHTML;
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

            // Exibe a resposta formatada
            florenceAnswer.textContent = formatFlorenceAnswer(answer);
            florenceAnswer.classList.remove('hidden');
            applySuggestionBtn.classList.remove('hidden');
            
            // Restaura o botão
            this.innerHTML = originalBtnText;
            this.disabled = false;
        }, 800);
    });

    // Aplica sugestão ao campo de texto principal (CORREÇÃO PRINCIPAL)
    applySuggestionBtn.addEventListener('click', function() {
        const currentContent = document.getElementById('note-content').value;
        const suggestion = florenceAnswer.textContent;
        
        // Formata a sugestão para manter espaçamento
        const formattedSuggestion = `\n\n--- Sugestão da Florence ---\n${suggestion}\n\n`;
        
        // Insere na posição atual do cursor ou no final
        const textarea = document.getElementById('note-content');
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;
        
        textarea.value = currentContent.substring(0, startPos) + 
                         formattedSuggestion + 
                         currentContent.substring(endPos);
        
        // Posiciona o cursor após a sugestão inserida
        const newCursorPos = startPos + formattedSuggestion.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        
        // Feedback visual
        this.innerHTML = '<i class="fas fa-check mr-2"></i> Sugestão aplicada!';
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-copy mr-2"></i> Usar esta sugestão na anotação';
        }, 2000);
        
        // Dispara evento de change para quaisquer listeners
        const event = new Event('input', { bubbles: true });
        textarea.dispatchEvent(event);
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

// Formata as respostas da Florence para manter quebras de linha e listas
function formatFlorenceAnswer(answer) {
    return answer
        .replace(/^- /gm, '• ') // Converte hífens em bullets
        .replace(/\n•/g, '\n•') // Garante espaçamento consistente
        .replace(/\n{3,}/g, '\n\n'); // Limita quebras múltiplas
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
                            <span><strong>Instrutor</strong> ${fb.professor_nome}</span>
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
            doc.text('TrilhaTec', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
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
        doc.text(`Gerado pelo TrilhaTec • ${new Date().toLocaleDateString('pt-BR')}`, 
                doc.internal.pageSize.getWidth() / 2, 
                doc.internal.pageSize.getHeight() - 10, 
                { align: 'center' });

        doc.save(`Anotacoes_TrilhaTec.pdf`);

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
Sinais Vitais Básicos

Os sinais vitais incluem:
• Temperatura corporal
• Pulso/frequência cardíaca
• Frequência respiratória
• Pressão arterial
• Dor (considerado o 5º sinal vital)
• Saturação de oxigênio (em alguns protocolos)

Valores normais de referência podem variar conforme idade e condições específicas.`,
    "Temperatura Corporal": `
Temperatura Corporal Normal

Valores de referência:
• Axilar: 35,5°C - 36,5°C
• Oral: 36°C - 37,2°C
• Retal: 36°C - 37,5°C
• Timpânica: 35,8°C - 37°C

Febre: acima de 37,8°C (axilar) ou 38°C (retal)`,
    "Pulso e Frequência Cardíaca": `
Pulso e Frequência Cardíaca

Valores normais por faixa etária:
• Recém-nascido: 120-160 bpm
• Lactente: 80-140 bpm
• Criança: 70-120 bpm
• Adolescente: 60-100 bpm
• Adulto: 60-100 bpm
• Idoso: 60-100 bpm (pode ser mais baixo em atletas)

Locais de aferição: radial, carotídeo, braquial, femoral, poplíteo, pedioso dorsal.`,
    "Frequência Respiratória": `
Frequência Respiratória

Valores normais por faixa etária:
• Recém-nascido: 30-60 rpm
• Lactente: 20-40 rpm
• Criança: 20-30 rpm
• Adolescente: 12-20 rpm
• Adulto: 12-20 rpm
• Idoso: 12-20 rpm

Avaliar também ritmo, profundidade e esforço respiratório.`,
    "Pressão Arterial": `
Pressão Arterial

Classificação para adultos (mmHg):
• Normal: <120/80
• Pré-hipertensão: 120-139/80-89
• Hipertensão Estágio 1: 140-159/90-99
• Hipertensão Estágio 2: ≥160/≥100

Em crianças, utilize tabelas específicas por idade, sexo e percentil de altura.`,
    "Dor como Sinal Vital": `
Avaliação da Dor

Escalas mais utilizadas:
• Escala Numérica (0-10): 0 = sem dor, 10 = pior dor imaginável
• Escala Visual Analógica (EVA)
• Escala de Faces Wong-Baker (para crianças)
• FLACC (para bebês e não verbais)

Avaliar localização, características, intensidade, duração e fatores agravantes/aliviadores.`,
    "Administração de Medicamentos - Vias Oral e Sublingual": `
Vias Oral e Sublingual

Via Oral:
• Medicamentos sólidos (comprimidos, cápsulas) ou líquidos
• Orientar paciente a ingerir com água
• Verificar necessidade de jejum

Via Sublingual:
• Colocar medicamento sob a língua
• Não engolir até completa absorção
• Exemplo: Nitroglicerina`,
    "Administração Parenteral - IM, ID, SC": `
Vias Parenterais

Intramuscular (IM):
• Locais: Deltóide, vasto lateral, glúteo (músculo ventroglúteo ou dorsoglúteo)
• Agulha: 20-25G, 1-1,5" (varia conforme local e paciente)
• Ângulo: 90 graus

Subcutânea (SC):
• Locais: Abdômen, coxa, braço
• Agulha: 25-30G, 3/8" a 5/8"
• Ângulo: 45 ou 90 graus (depende da agulha e tecido)

Intradérmica (ID):
• Local: Face anterior do antebraço
• Agulha: 26-27G, 3/8" a 1/2"
• Ângulo: 10-15 graus
• Volume máximo: 0,1 mL`,
    "Administração Endovenosa e Inalatória": `
Vias Endovenosa e Inalatória

Endovenosa (EV):
• Verificar compatibilidade de medicamentos
• Controlar velocidade de infusão
• Monitorar sinais de flebite ou extravasamento
• Manutenção de acesso: lavagem com SF 0,9%

Inalatória:
• Uso de nebulizadores ou inaladores dosimetrados
• Orientar técnica adequada de inalação
• Enxaguar boca após corticosteroides inalatórios`
};

// Respostas para perguntas customizadas
const FLORENCE_ANSWERS = {
    "Quais são os cuidados necessários ao administrar medicamentos por via oral?": `1. Verificar a prescrição médica
2. Garantir que o paciente esteja consciente
3. Confirmar capacidade de deglutição
4. Evitar alimentos que interfiram na absorção
5. Observar horários específicos (jejum/com alimentos)`,
    "Quais os cuidados ao administrar medicamentos via sublingual?": `• Orientar a não engolir o comprimido
• Manter sob a língua até dissolver
• Evitar água/alimentos durante absorção
• Garantir boca limpa
• Exemplos: Nitroglicerina, Buprenorfina`,
    "Quais são os principais locais de aplicação e angulação para as vias IM, ID e SC?": `IM (Intramuscular):
- Locais: Nádegas (glúteo), deltoide, vasto lateral
- Angulação: 90°

SC (Subcutânea):
- Locais: Abdômen, coxa, braço
- Angulação: 45°

ID (Intradérmica):
- Locais: Antebraço
- Angulação: 10-15°`,
    "Quais são os riscos de se administrar um medicamento em local incorreto?": `• Dor intensa
• Lesão tecidual/nervosa
• Abscesso ou necrose
• Ineficácia do tratamento
• Reações adversas`,
    "Quais cuidados são necessários durante a administração por via EV para evitar flebite?": `• Técnica asséptica rigorosa
• Escolha adequada da veia
• Fixação correta do acesso
• Velocidade de infusão adequada
• Observação constante do local
• Rodízio de punções`,
    "Quais são os tipos de administração endovenosa e em que situações são indicadas?": `Bolus (rápida):
- Emergências
- Ação imediata necessária

Infusão intermitente:
- Antibióticos
- Medicamentos incompatíveis

Infusão contínua:
- Soro terapia
- Medicamentos de meia-vida curta`,
    "Descreva o passo a passo da técnica correta para a via intramuscular.": `1. Higienizar as mãos
2. Preparar material
3. Identificar paciente
4. Selecionar local
5. Limpar pele
6. Inserir agulha 90°
7. Aspirar levemente
8. Injetar lentamente
9. Retirar agulha
10. Comprimir local
11. Descartar material`,
    "Por que alguns medicamentos devem ser tomados em jejum ou com alimentos?": `Jejum:
- Melhor absorção (ex: levotiroxina, alendronato)
- Evitar interações

Com alimentos:
- Reduzir irritação gástrica (ex: AINEs)
- Melhorar absorção lipossolúvel
- Evitar náuseas
- Atraso absorção desejado`,
    "Quais medicamentos são comumente utilizados na via inalatória?": `Broncodilatadores:
- Salbutamol
- Ipratrópio

Corticosteroides:
- Budesonida
- Fluticasona

Combinações:
- Salmeterol + Fluticasona

Antibióticos:
- Tobramicina (fibrose cística)`,
    "Quais os dispositivos utilizados na administração de medicamentos inalatórios?": `Inaladores dosimetrados (bombinhas)
Inaladores de pó seco
Nebulizadores
Espaçadores

Vantagens:
- Entrega direta pulmonar
- Efeitos sistêmicos reduzidos
- Rápido início de ação`
};