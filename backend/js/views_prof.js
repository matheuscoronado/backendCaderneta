function mostrarFormFeedback(atividadeId) {
        document.getElementById(`btn-add-feedback-${atividadeId}`).classList.add('hidden');
        document.getElementById(`form-feedback-${atividadeId}`).classList.remove('hidden');
        document.getElementById(`feedback-text-${atividadeId}`).focus();
    }

    function cancelarFeedback(atividadeId) {
        document.getElementById(`form-feedback-${atividadeId}`).classList.add('hidden');
        document.getElementById(`btn-add-feedback-${atividadeId}`).classList.remove('hidden');
        document.getElementById(`feedback-text-${atividadeId}`).value = '';
        document.getElementById(`feedback-msg-${atividadeId}`).innerText = '';
    }

    function enviarFeedback(atividadeId) {
        const form = document.getElementById(`form-feedback-data-${atividadeId}`);
        const formData = new FormData(form);
        const msgElement = document.getElementById(`feedback-msg-${atividadeId}`);
        
        msgElement.innerText = 'Enviando...';
        msgElement.style.color = 'black';

        fetch('index.php?controller=User&action=salvarFeedback', {
    method: 'POST',
    body: formData
})
        .then(response => response.json())
        .then(data => {
            if (data.sucesso) {
                msgElement.innerText = 'Feedback salvo com sucesso!';
                msgElement.style.color = 'green';
                
                // Atualiza a lista de feedbacks sem refresh
                setTimeout(() => {
                    location.reload(); // Recarrega a página para mostrar o novo feedback
                }, 1000);
            } else {
                msgElement.innerText = data.erro || 'Erro ao salvar feedback';
                msgElement.style.color = 'red';
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            msgElement.innerText = 'Erro na comunicação com o servidor';
            msgElement.style.color = 'red';
        });
    }