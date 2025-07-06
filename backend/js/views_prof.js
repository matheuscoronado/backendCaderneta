/**
 * Função para exibir a caixa de feedback de uma atividade específica
 * @param {number} id - ID da atividade para a qual o feedback será adicionado
 */
function mostrarFeedback(id) {
    // Mostra o elemento da caixa de feedback correspondente ao ID da atividade
    document.getElementById('feedback-box-' + id).style.display = 'block';
}

/**
 * Função para cancelar e esconder a caixa de feedback
 * @param {number} id - ID da atividade relacionada ao feedback
 */
function cancelarFeedback(id) {
    // Esconde a caixa de feedback
    document.getElementById('feedback-box-' + id).style.display = 'none';
    // Limpa o conteúdo do textarea
    document.getElementById('feedback-text-' + id).value = '';
    // Limpa qualquer mensagem de status
    document.getElementById('feedback-msg-' + id).textContent = '';
}

/**
 * Função para enviar o feedback para o servidor
 * @param {number} id - ID da atividade que receberá o feedback
 */
function salvarFeedback(id) {
    // Obtém e limpa o texto do feedback (remove espaços extras no início/fim)
    const comentario = document.getElementById('feedback-text-' + id).value.trim();

    // Validação básica - verifica se o feedback não está vazio
    if (comentario === "") {
        alert("Por favor, escreva algo no feedback.");
        return; // Interrompe a execução se estiver vazio
    }

    // Envia o feedback para o servidor usando Fetch API
    fetch('index.php?action=salvar-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            atividade_id: id,
            comentario: comentario
        })
    })
    .then(response => {
        // Converte a resposta para JSON
        return response.json();
    })
    .then(data => {
        // Verifica se a operação foi bem sucedida
        if (data.sucesso) {
            // Mostra mensagem de sucesso
            const msg = document.getElementById('feedback-msg-' + id);
            msg.textContent = "Feedback salvo com sucesso!";
            msg.style.color = 'green';
            
            // Esconde o formulário e recarrega a página após 1.5 segundos
            setTimeout(() => {
                cancelarFeedback(id);
                location.reload(); // Recarrega para mostrar o novo feedback na lista
            }, 1500);
        } else {
            // Mostra mensagem de erro retornada pelo servidor ou uma mensagem padrão
            alert(data.erro || "Erro ao salvar o feedback.");
        }
    })
    .catch(error => {
        // Trata erros de conexão com o servidor
        console.error("Erro ao enviar feedback:", error);
        alert("Erro ao conectar com o servidor.");
    });
}

/** Estilos */

    /**
     * Mostra o formulário de feedback
     * @param {number} id - ID da atividade
     */
    function mostrarFeedback(id) {
        document.getElementById(`feedback-box-${id}`).style.display = 'block';
        document.getElementById(`feedback-text-${id}`).focus();
    }

    /**
     * Cancela a adição de feedback
     * @param {number} id - ID da atividade
     */
    function cancelarFeedback(id) {
        document.getElementById(`feedback-box-${id}`).style.display = 'none';
        document.getElementById(`feedback-text-${id}`).value = '';
        document.getElementById(`feedback-msg-${id}`).textContent = '';
    }

    /**
     * Envia o feedback para o servidor
     * @param {number} id - ID da atividade
     */
    function salvarFeedback(id) {
        const comentario = document.getElementById(`feedback-text-${id}`).value.trim();
        const msgElement = document.getElementById(`feedback-msg-${id}`);
        
        // Validação
        if (!comentario) {
            msgElement.textContent = "Por favor, escreva seu feedback antes de enviar.";
            msgElement.className = "feedback-saved error";
            return;
        }

        // Simulação de envio (substitua pelo AJAX real)
        fetch('index.php?action=salvar-feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                atividade_id: id,
                comentario: comentario
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.sucesso) {
                msgElement.textContent = "Feedback enviado com sucesso!";
                msgElement.className = "feedback-saved success";
                
                setTimeout(() => {
                    location.reload(); // Recarrega para mostrar o novo feedback
                }, 1500);
            } else {
                msgElement.textContent = data.erro || "Erro ao enviar feedback.";
                msgElement.className = "feedback-saved error";
            }
        })
        .catch(error => {
            console.error("Erro:", error);
            msgElement.textContent = "Erro ao conectar com o servidor.";
            msgElement.className = "feedback-saved error";
        });
    }

    // Alternador de tema
    document.getElementById('theme-toggle').addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        // Salva a preferência do tema no armazenamento local
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('dark-mode', isDarkMode);
    });

    // Restaura a preferência do tema ao carregar a página
    window.addEventListener('load', function() {
        const isDarkMode = localStorage.getItem('dark-mode') === 'true';
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        }
    });