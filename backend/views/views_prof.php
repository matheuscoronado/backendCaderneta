<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Anotações de <?= htmlspecialchars($aluno['nome']) ?> - TrilhaTec</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="css/views_prof.css" />
    <script src="https://cdn.tailwindcss.com"></script>


</head>
<body class="bg-[var(--bg-color)]">
    <div id="app" class="app-container">
        <!-- Cabeçalho -->
        <header class="app-header">
            <div class="header-content">
                <div class="logo-container">
                    <i class="fas fa-book-medical"></i>
                    <h1>TrilhaTec</h1>
                </div>
                <div class="header-actions">
                    <button id="theme-toggle" class="theme-toggle">
                        <i class="fas fa-moon"></i>
                    </button>
                    <!-- <button class="logout-button">
                        <i class="fas fa-sign-out-alt"></i>
                        <span class="hidden sm:inline">Sair</span>
                    </button> -->
                </div>
            </div>
        </header>

        <!-- Conteúdo Principal -->
        <main class="main-content">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold">
                    <i class="fas fa-book-open mr-2 text-[var(--primary-color)]"></i>
                    Anotações de <?= htmlspecialchars($aluno['nome']) ?>
                </h1>
                <a href="index.php?action=dashboard" class="btn btn-secondary">
                    <i class="fas fa-arrow-left mr-2"></i>
                    Voltar
                </a>
            </div>

            <!-- Lista de Anotações -->
            <?php if (count($atividade) > 0): ?>
                <div class="space-y-6">
                    <?php foreach ($atividade as $item): ?>
                        <div class="activity-card">
                            <!-- Cabeçalho da Atividade -->
                            <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-4">
                                <div>
                                    <h3 class="text-xl font-semibold">
                                        <?= htmlspecialchars($item['titulo']) ?>
                                    </h3>
                                    <?php if (!empty($item['subtitulo'])): ?>
                                        <p class="text-sm text-[var(--secondary-color)]">
                                            <?= htmlspecialchars($item['subtitulo']) ?>
                                        </p>
                                    <?php endif; ?>
                                </div>
                                <div class="flex flex-wrap gap-2">
                                    <span class="px-3 py-1 rounded-full text-xs font-semibold" 
                                        style="background-color: var(--light-gray); color: var(--secondary-color);">
                                        <i class="far fa-calendar-alt mr-1"></i>
                                        <?= date('d/m/Y H:i', strtotime($item['data_registro'])) ?>
                                    </span>
                                </div>
                            </div>

                            <!-- Conteúdo da Atividade -->
                            <div class="content-box">
                                <?= nl2br(htmlspecialchars($item['descricao'])) ?>
                            </div>

                            <!-- Seção de Feedbacks -->
                            <div class="mt-6">
                                <h4 class="text-lg font-medium mb-3 flex items-center">
                                    <i class="fas fa-comments mr-2 text-[var(--primary-color)]"></i>
                                    Feedbacks
                                </h4>

                                <!-- Lista de Feedbacks -->
                                <div id="feedback-list-<?= $item['id'] ?>" class="space-y-4 mb-4">
                                    <?php 
                                    $feedbacks = User::listarFeedbacksPorAtividade($item['id']);
                                    if (!empty($feedbacks)): ?>
                                        <?php foreach ($feedbacks as $fb): ?>
                                            <div class="feedback-item">
                                                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                                                    <span class="font-medium">
                                                        <i class="fas fa-user-graduate mr-1"></i>
                                                        Prof. <?= htmlspecialchars($fb['professor_nome']) ?>
                                                    </span>
                                                    <span class="text-xs text-[var(--secondary-color)]">
                                                        <i class="far fa-clock mr-1"></i>
                                                        <?= date('d/m/Y H:i', strtotime($fb['data_feedback'])) ?>
                                                    </span>
                                                </div>
                                                <p class="pl-2">
                                                    <?= nl2br(htmlspecialchars($fb['comentario'])) ?>
                                                </p>
                                            </div>
                                        <?php endforeach; ?>
                                    <?php else: ?>
                                        <div class="text-center py-4 text-[var(--secondary-color)]">
                                            <i class="far fa-comment-dots text-2xl mb-2"></i>
                                            <p>Nenhum feedback registrado ainda.</p>
                                        </div>
                                    <?php endif; ?>
                                </div>

                                <!-- Formulário de Feedback -->
                                <div id="feedback-box-<?= $item['id'] ?>" class="feedback-box">
                                    <textarea 
                                        id="feedback-text-<?= $item['id'] ?>" 
                                        placeholder="Digite seu feedback aqui..."
                                        class="w-full mb-3"></textarea>
                                    
                                    <div class="flex justify-end gap-3">
                                        <button 
                                            onclick="cancelarFeedback(<?= $item['id'] ?>)" 
                                            class="btn btn-cancel">
                                            Cancelar
                                        </button>
                                        <button 
                                            onclick="salvarFeedback(<?= $item['id'] ?>)" 
                                            class="btn btn-primary">
                                            Enviar Feedback
                                        </button>
                                    </div>
                                    
                                    <div id="feedback-msg-<?= $item['id'] ?>" class="feedback-saved"></div>
                                </div>

                                <!-- Botão para Adicionar Feedback -->
                                <button 
                                    onclick="mostrarFeedback(<?= $item['id'] ?>)" 
                                    class="btn btn-primary w-full">
                                    <i class="fas fa-plus mr-2"></i>
                                    Adicionar Feedback
                                </button>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php else: ?>
                <div class="text-center py-12">
                    <div class="mx-auto w-24 h-24 bg-[var(--light-gray)] rounded-full flex items-center justify-center mb-4">
                        <i class="fas fa-book text-3xl text-[var(--primary-color)]"></i>
                    </div>
                    <h3 class="text-xl font-medium mb-2">Nenhuma anotação encontrada</h3>
                    <p class="text-[var(--secondary-color)] max-w-md mx-auto">
                        O aluno <?= htmlspecialchars($aluno['nome']) ?> ainda não registrou nenhuma anotação.
                    </p>
                </div>
            <?php endif; ?>
        </main>

        <!-- Rodapé Móvel -->
        <!-- <nav class="mobile-footer">
            <button class="footer-button active">
                <i class="fas fa-home"></i>
            </button>
            <button class="footer-button">
                <i class="fas fa-user"></i>
            </button>
        </nav> -->
    </div>

<script src="js/views_prof.js"></script>

</body>
</html>