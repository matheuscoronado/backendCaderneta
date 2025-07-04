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