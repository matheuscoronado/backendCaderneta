<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <!-- Configurações básicas do documento -->
    <meta charset="UTF-8">
    <!-- Título dinâmico com o nome do aluno (protegido contra XSS) -->
    <title>Anotações de <?= htmlspecialchars($aluno['nome']) ?></title>
</head>
<body>
<!-- Container principal -->
<div class="container">
    <!-- Título da página com nome do aluno -->
    <h2>Anotações de <?= htmlspecialchars($aluno['nome']) ?></h2>

    <!-- Verifica se existem atividades para exibir -->
    <?php if (count($atividade) > 0): ?>
        <ul>
            <!-- Loop através de cada atividade -->
            <?php foreach ($atividade as $item): ?>
                <li>
                    <!-- Exibe informações básicas da atividade -->
                    <strong>Data:</strong> <?= date('d/m/Y H:i', strtotime($item['data_registro'])) ?><br>
                    <strong>Atividade ID:</strong> <?= $item['id'] ?><br>
                    <strong>Título:</strong> <?= htmlspecialchars($item['titulo']) ?><br>
                    <strong>Subtítulo:</strong> <?= htmlspecialchars($item['subtitulo']) ?><br>
                    
                    <!-- Conteúdo principal da atividade -->
                    <strong>Conteúdo:</strong><br>
                    <div style="margin-left: 20px;">
                        <?= nl2br(htmlspecialchars($item['descricao'])) ?>
                    </div>

                    <!-- Seção de Feedbacks -->
                    <div class="feedback-section">
                        <h4>Feedbacks</h4>

                        <!-- Lista de feedbacks existentes -->
                        <div id="feedback-list-<?= $item['id'] ?>">
                            <?php 
                            // Busca feedbacks no banco de dados
                            $feedbacks = User::listarFeedbacksPorAtividade($item['id']);
                            if (!empty($feedbacks)): ?>
                                <!-- Loop através de cada feedback -->
                                <?php foreach ($feedbacks as $fb): ?>
                                    <div class="feedback-item">
                                        <div class="feedback-header">
                                            <!-- Nome do professor e data do feedback -->
                                            <span class="professor-name">Prof. <?= htmlspecialchars($fb['professor_nome']) ?></span>
                                            <span class="feedback-date"><?= date('d/m/Y H:i', strtotime($fb['data_feedback'])) ?></span>
                                        </div>
                                        <!-- Texto do feedback -->
                                        <p><?= nl2br(htmlspecialchars($fb['comentario'])) ?></p>
                                    </div>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <!-- Mensagem caso não existam feedbacks -->
                                <p>Nenhum feedback registrado ainda.</p>
                            <?php endif; ?>
                        </div>

                        <!-- Área para adicionar novo feedback -->
                        <button class="btn" onclick="mostrarFeedback(<?= $item['id'] ?>)">Adicionar Feedback</button>
                        <div class="feedback-box" id="feedback-box-<?= $item['id'] ?>">
                            <textarea id="feedback-text-<?= $item['id'] ?>" placeholder="Digite seu feedback..." rows="4" cols="50"></textarea>
                            <br>
                            <!-- Botões para salvar ou cancelar o feedback -->
                            <button class="btn" onclick="salvarFeedback(<?= $item['id'] ?>)">Salvar</button>
                            <button class="btn btn-cancel" onclick="cancelarFeedback(<?= $item['id'] ?>)">Cancelar</button>
                            <!-- Área para mensagens de status -->
                            <p id="feedback-msg-<?= $item['id'] ?>" class="feedback-saved"></p>
                        </div>

                    <hr>
                </li>
            <?php endforeach; ?>
        </ul>
    <?php else: ?>
        <!-- Mensagem caso não existam atividades -->
        <p>Este aluno ainda não registrou nenhuma anotação.</p>
    <?php endif; ?>

    <!-- Link para voltar ao dashboard -->
    <a href="index.php?action=dashboard" class="btn">Voltar</a>
</div>

<!-- Inclusão do arquivo JavaScript com as funções de feedback -->
<script src="js/views_prof.js"></script>

</body>
</html>