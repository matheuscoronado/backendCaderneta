<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Anotações de <?= htmlspecialchars($aluno['nome']) ?></title>
</head>
<body>
<div class="container">
    <h2>Anotações de <?= htmlspecialchars($aluno['nome']) ?></h2>

    <?php if (count($atividade) > 0): ?>
        <ul>
            <?php foreach ($atividade as $item): ?>
                <li>
                    <strong>Data:</strong> <?= date('d/m/Y H:i', strtotime($item['data_registro'])) ?><br>
                    <strong>Atividade ID:</strong> <?= $item['id'] ?><br>
                    <strong>Título:</strong> <?= htmlspecialchars($item['titulo']) ?><br>
                    <strong>Subtítulo:</strong> <?= htmlspecialchars($item['subtitulo']) ?><br>
                    <strong>Conteúdo:</strong><br>
                    <div style="margin-left: 20px;">
                        <?= nl2br(htmlspecialchars($item['descricao'])) ?>
                    </div>

                    <div class="feedback-section">
                        <h4>Feedbacks</h4>

                     <!-- Exibe os feedbacks existentes -->
                        <div id="feedback-list-<?= $item['id'] ?>">
                            <?php 
                            $feedbacks = User::listarFeedbacksPorAtividade($item['id']);
                            if (!empty($feedbacks)): ?>
                                <?php foreach ($feedbacks as $fb): ?>
                                    <div class="feedback-item">
                                        <div class="feedback-header">
                                            <span class="professor-name">Prof. <?= htmlspecialchars($fb['professor_nome']) ?></span>
                                            <span class="feedback-date"><?= date('d/m/Y H:i', strtotime($fb['data_feedback'])) ?></span>
                                        </div>
                                        <p><?= nl2br(htmlspecialchars($fb['comentario'])) ?></p>
                                    </div>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <p>Nenhum feedback registrado ainda.</p>
                            <?php endif; ?>
                        </div>

                        <!-- Botão para adicionar feedback -->
                        <button class="btn" onclick="mostrarFeedback(<?= $item['id'] ?>)">Adicionar Feedback</button>
                        <div class="feedback-box" id="feedback-box-<?= $item['id'] ?>">
                        <textarea id="feedback-text-<?= $item['id'] ?>" placeholder="Digite seu feedback..." rows="4" cols="50"></textarea>
                        <br>
                        <button class="btn" onclick="salvarFeedback(<?= $item['id'] ?>)">Salvar</button>
                        <button class="btn btn-cancel" onclick="cancelarFeedback(<?= $item['id'] ?>)">Cancelar</button>
                        <p id="feedback-msg-<?= $item['id'] ?>" class="feedback-saved"></p>
                        </div>

                    <hr>
                </li>
            <?php endforeach; ?>
        </ul>
    <?php else: ?>
        <p>Este aluno ainda não registrou nenhuma anotação.</p>
    <?php endif; ?>

    <a href="index.php?action=dashboard" class="btn">Voltar</a>
</div>

<script>
    function mostrarFeedback(id) {
        document.getElementById('feedback-box-' + id).style.display = 'block';
    }

    function cancelarFeedback(id) {
        document.getElementById('feedback-box-' + id).style.display = 'none';
        document.getElementById('feedback-text-' + id).value = '';
        document.getElementById('feedback-msg-' + id).textContent = '';
    }

    function salvarFeedback(id) {
        const comentario = document.getElementById('feedback-text-' + id).value.trim();

        if (comentario === "") {
            alert("Por favor, escreva algo no feedback.");
            return;
        }

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
                const msg = document.getElementById('feedback-msg-' + id);
                msg.textContent = "Feedback salvo com sucesso!";
                msg.style.color = 'green';
                setTimeout(() => {
                    cancelarFeedback(id);
                    // Recarregar página para mostrar o feedback novo
                    location.reload();
                }, 1500);
            } else {
                alert(data.erro || "Erro ao salvar o feedback.");
            }
        })
        .catch(() => alert("Erro ao conectar com o servidor."));
    }
</script>

</body>
</html>
