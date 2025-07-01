<?php
require_once 'models/User.php';
$users = User::all();
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Configurações - MedNotes</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

    <?php if ($_SESSION['tipo'] == 'administrador'): ?>
        <link rel="stylesheet" href="css/admin.css" />
    <?php elseif ($_SESSION['tipo'] == 'professor'): ?>
        <link rel="stylesheet" href="css/professor.css" />
    <?php else: ?>
        <link rel="stylesheet" href="css/aluno.css" />
    <?php endif; ?>


    <link rel="shortcut icon" type="image/svg" href="/logo-aba_book-medical-solid.svg" />

</head>

<body class="<?= $_SESSION['tipo'] ?>">
        <?php
        if ($_SESSION['tipo'] == 'administrador'):
            $user = $users ?? [];
            ?>
            <!-- Cabeçalho -->
            <header class="shadow-sm p-4" style="background-color: var(--header-bg);">
                <div class="container mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div class="flex items-center">
                        <!-- Botão de voltar para a págia anterior(quando tiver) -->
                        <!-- <a href="index.html" class="mr-4 text-gray-600 hover:text-blue-600">
                    <i class="fas fa-arrow-left"></i>
                </a> -->
                        <i class="fas fa-book-medical text-xl text-blue-500 mr-2"></i>
                        <h1 class="text-lg sm:text-xl font-bold text-[var(--text-color)]">MedNotes - Admin Center</h1>
                    </div>

                    <div class="flex items-center gap-2 self-end sm:self-auto">
                        <!-- Botão para alternar entre tema claro/escuro -->
                        <button id="theme-toggle" class="theme-toggle">
                            <i class="fas fa-moon"></i>
                        </button>

                        <button id="add-user-btn"
                            class="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm sm:text-base">
                            <!-- Botão adicionar funciona para o admin -->
                            <i class="fas fa-plus mr-1 sm:mr-2"></i><span class="hidden sm:inline">Adicionar</span>
                        </button>

                        <a href="logout.php" id="logout-btn"
                            class="text-gray-600 hover:text-blue-600 text-sm sm:text-base flex items-center gap-1">
                            <i class="fas fa-sign-out-alt"></i> <span class="hidden sm:inline">Sair</span>
                        </a>

                    </div>
                </div>
            </header>

            <!-- Conteúdo Principal -->
            <main class="container mx-auto p-2 sm:p-4 pb-20">
                <!-- Seção de Usuários -->
                <div class="rounded-xl shadow-md p-4 sm:p-6 mb-6"
                    style="background-color: var(--card-bg); border: 1px solid var(--border-color);">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-base sm:text-lg font-semibold text-[var(--text-color)]">Gerenciamento de Usuários
                        </h2>
                    </div>

                    <!-- Grupos de Usuários -->
                    <div id="users-by-role">
                        <!-- Os usuários serão organizados por função aqui -->

                        <div class="container">
                            <table class="styled-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nome</th>
                                        <th>Email</th>
                                        <th>Perfil</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    <?php foreach ($users as $user): ?>
                                        <tr>
                                            <td><?= $user['id'] ?></td>
                                            <td><?= $user['nome'] ?></td>
                                            <td><?= $user['email'] ?></td>
                                            <td><?= $user['tipo'] ?></td>
                                            <td>

                                                <!-- Botão para editar usuário -->
                                                <button class="edit-user-btn" data-id="<?= $user['id'] ?>"
                                                    data-nome="<?= $user['nome'] ?>" data-email="<?= $user['email'] ?>"
                                                    data-tipo="<?= $user['tipo'] ?>">
                                                    Editar</button>


                                                <!-- Permitir que administrador exclua -->
                                                <?php if ($_SESSION['tipo'] == 'administrador'): ?>
                                                    <a href="index.php?action=delete&id=<?= $user['id'] ?>" class="btn btn-delete"
                                                        onclick="return confirm('Tem certeza que deseja excluir?')">Excluir</a>
                                                <?php endif; ?>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>

                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
        </div>



        <!-- Modal de Adicionar/Editar Usuário -->
        <div id="user-form-modal"
            class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
            <div class="rounded-xl p-4 sm:p-6 w-full max-w-md mx-2"
                style="background-color: var(--card-bg); border: 1px solid var(--border-color);">
                <div class="flex justify-between items-center mb-4">
                    <h2 id="form-modal-title" class="text-lg font-semibold" style="color: var(--text-color);">
                        Adicionar Novo Usuário</h2>
                    <button id="close-form-modal" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form id="user-form" class="space-y-3 sm:space-y-4">
                    <input type="hidden" id="user-id">
                    <div>
                        <label for="nome" class="block text-sm font-medium" style="color: var(--text-color);">Nome</label>
                        <input type="text" id="nome" name="nome" required
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 sm:py-2 px-2 sm:px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            style="background-color: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color);">
                    </div>
                    <div>
                        <label for="email" class="block text-sm font-medium"
                            style="color: var(--text-color);">E-mail</label>
                        <input type="email" id="email" name="email" required
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 sm:py-2 px-2 sm:px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            style="background-color: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color);">
                    </div>
                    <div class="relative">
                        <label for="senha_hash" class="block text-sm font-medium"
                            style="color: var(--text-color);">Senha</label>
                        <div class="relative mt-1">
                            <input type="password" id="senha_hash" name="senha_hash"
                                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                style="background-color: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color);">
                            <button type="button" id="toggle-password"
                                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                                <i class="far fa-eye"></i>
                            </button>
                        </div>
                    </div>
                    <div>
                        <label for="tipo" class="block text-sm font-medium" style="color: var(--text-color);">Função</label>
                        <select id="tipo" name="tipo" required
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 sm:py-2 px-2 sm:px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            style="background-color: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color);">
                            <option value="">Selecione uma função</option>
                            <option value="administrador">Administrador</option>
                            <option value="professor">Professor</option>
                            <option value="aluno">Aluno</option>
                        </select>
                    </div>
                    <div class="flex justify-end gap-2 sm:space-x-2">
                        <button type="button" id="cancel-form"
                            class="px-3 py-1 sm:px-4 sm:py-2 border rounded-lg hover:bg-gray-50 text-sm sm:text-base"
                            style="border: 1px solid var(--border-color); color: var(--text-color); background-color: var(--light-gray);">
                            Cancelar
                        </button>
                        <button type="submit"
                            class="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm sm:text-base"
                            style="background-color: var(--primary-color);">
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Modal de Detalhes do Usuário -->
        <div id="user-details-modal"
            class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
            <div class="rounded-xl p-4 sm:p-6 w-full max-w-md mx-2 max-h-[90vh] overflow-y-auto"
                style="background-color: var(--card-bg); border: 1px solid var(--border-color);">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-lg font-semibold" style="color: var(--text-color);">Detalhes do Usuário</h2>
                    <button id="close-user-modal" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div id="user-details-content" class="space-y-2 sm:space-y-3">
                    <!-- Detalhes do usuário serão inseridos aqui -->
                </div>
                <div class="mt-4 flex flex-col sm:flex-row justify-end gap-2 sm:space-x-2">
                    <button
                        class="px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
                        style="border: 1px solid var(--border-color); color: var(--text-color); background-color: var(--light-gray);">
                        Editar
                    </button>
                    <button
                        class="px-3 py-1 sm:px-4 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm sm:text-base">
                        Excluir
                    </button>
                </div>
            </div>
        </div>
        <!-- BLOCO PARA INSERÇÃO DE JS DO ADMIN -->

        </main>

        <!-- Rodapé Móvel -->
        <nav
            class="fixed bottom-0 left-0 right-0 bg-[var(--bg-color)] border-t border-[var(--border-color)] flex justify-around py-2 sm:py-3">
            <!-- Botão ocupado para o futuro -->
            <!-- <a href="indexADM.html" class="text-gray-600 p-2">
            <i class="fas fa-home text-lg sm:text-xl"></i>
        </a> -->
            <a href="dashboard.php" class="text-blue-600 p-2">
                <i class="fas fa-cog text-lg sm:text-xl"></i>
            </a>
        </nav>



    <?php elseif ($_SESSION['tipo'] == 'professor'): ?>

        <!-- Aplicação Principal (inicialmente oculta) -->
        <!-- Cabeçalho -->
        <header class="app-header">
            <div class="header-content">
                <div class="logo-container">
                    <i class="fas fa-book-medical"></i>
                    <h1>MedNotes - Professor</h1>
                </div>
                <div class="header-actions">
                    <button id="theme-toggle" class="theme-toggle">
                        <i class="fas fa-moon"></i>
                    </button>
                    <button id="logout-btn" class="logout-button">
                        <i class="fas fa-sign-out-alt"></i> Sair
                    </button>
                </div>
            </div>
        </header>

        <!-- Conteúdo Principal -->
        <main class="main-content">
            <!-- Busca -->
            <div class="search-container">
                <input type="text" id="search-input" placeholder="Buscar aluno...">
            </div>

            <!-- Lista de Alunos -->
            <div class="students-section">
                <h2>Turma de Teste</h2>
                <div id="students-list" class="students-grid">
                    <!-- Alunos serão carregados aqui -->
                </div>
            </div>
        </main>

        <!-- Sidebar de Anotações do Aluno -->
        <div id="notes-sidebar" class="notes-sidebar">
            <div class="sidebar-header">
                <h2 id="sidebar-student-name">Anotações</h2>
                <button id="close-sidebar" class="close-button">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div id="sidebar-notes-list" class="sidebar-notes-list">
                <!-- Anotações do aluno serão carregadas aqui -->
            </div>
        </div>
        <div id="sidebar-overlay" class="sidebar-overlay"></div>

        <!-- Modal de Visualização de Anotação -->
        <div id="note-modal" class="note-modal hidden">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="modal-header">
                        <div>
                            <h2 id="modal-note-title"></h2>
                            <p id="modal-note-date"></p>
                            <p id="modal-note-author"></p>
                        </div>
                        <button id="close-note-modal" class="close-button">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div id="modal-note-content" class="note-content"></div>

                    <div id="modal-note-suggestions" class="suggestions-container hidden">
                        <h3>Sugestões da IA</h3>
                        <div id="modal-suggestions-content" class="suggestions-content"></div>
                    </div>

                    <div class="feedback-section">
                        <h3>Feedback do Professor</h3>
                        <textarea id="teacher-feedback" placeholder="Digite seu feedback para o aluno..."></textarea>
                        <div class="feedback-actions">
                            <button id="cancel-feedback" class="secondary-button">
                                Cancelar
                            </button>
                            <button id="save-feedback" class="primary-button">
                                <i class="fas fa-save"></i> Salvar Feedback
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>

    <?php else: ?>


        <div id="app" class="app-container">
            <header class="app-header">
                <div class="header-content">
                    <div class="logo-container">
                        <i class="fas fa-book-medical"></i>
                        <h1>MedNotes</h1>
                    </div>
                    <div class="header-actions">
                        <button id="theme-toggle" class="theme-toggle">
                            <i class="fas fa-moon"></i>
                        </button>
                        <button id="logout-btn" class="logout-button">
                            <i class="fas fa-sign-out-alt"></i> Sair
                        </button>
                    </div>
                </div>
            </header>

            <main class="main-content">
                <div class="note-editor">
                    <h2>Nova Anotação</h2>
                    <div class="form-group title-input">
                        <select id="note-topic" class="topic-select w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                            style="background-color: var(--card-bg); color: var(--text-color); border-color: var(--border-color);">
                            <option value="">Selecione um tópico</option>
                            <option value="procedimento-paciente">Procedimento com Paciente</option>
                            <option value="diagnostico-diferencial">Diagnóstico Diferencial</option>
                            <option value="farmacologia">Farmacologia Aplicada</option>
                            <option value="exame-fisico">Exame Físico</option>
                            <option value="outro">Outro (especifique)</option>
                        </select>
                        <input type="text" id="custom-topic" class="hidden" placeholder="Digite o tópico">
                    </div>
                    <textarea id="note-content" rows="8" placeholder="Descreva o procedimento realizado..."></textarea>
                    <div class="editor-actions">
                        <button id="save-btn" class="save-button">
                            <i class="fas fa-save"></i> Salvar
                        </button>
                        <button id="analyze-btn" class="analyze-button">
                            <i class="fas fa-robot"></i> Analisar com IA
                        </button>
                    </div>
                </div>

                <div id="suggestions-container" class="suggestions-container hidden">
                    <div class="suggestions-header">
                        <h2>Sugestões da IA</h2>
                        <button id="close-suggestions" class="close-button">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div id="suggestions-content" class="suggestions-content"></div>
                </div>
            </main>

            <div id="notes-sidebar" class="notes-sidebar">
                <div class="sidebar-header">
                    <h2 id="sidebar-student-name">Minhas Anotações</h2>
                    <button id="close-sidebar" class="close-button">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- Barra de pesquisa adicionada aqui -->
                <div class="search-container">
                    <i class="fas fa-search search-icon"></i>
                    <input type="text" id="notes-search" placeholder="Pesquisar anotações..." class="search-input">
                </div>

                <div id="sidebar-notes-list" class="sidebar-notes-list"></div>

                <button id="export-pdf-btn" class="export-button">
                    <i class="fas fa-file-pdf"></i> Exportar PDF
                </button>
            </div>

            <div id="sidebar-overlay" class="sidebar-overlay"></div>

            <nav class="mobile-footer">
                <button id="new-note-btn" class="footer-button active">
                    <i class="fas fa-plus"></i>
                </button>
                <button id="view-notes-btn" class="footer-button">
                    <i class="fas fa-book"></i>
                </button>
            </nav>
        </div>

        <div id="edit-note-modal" class="note-modal hidden">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="modal-header">
                        <div>
                            <h2>Editar Anotação</h2>
                        </div>
                        <button id="close-edit-modal" class="close-button">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="form-group title-input">
                        <input type="text" id="edit-note-title" placeholder="Título">
                    </div>
                    <textarea id="edit-note-content" rows="8" placeholder="Conteúdo da anotação..."></textarea>
                    <div id="edit-note-suggestions" class="suggestions-container">
                        <h3>Sugestões da IA</h3>
                        <div id="edit-suggestions-content" class="suggestions-content"></div>
                    </div>
                    <div class="edit-actions">
                        <button id="update-note-btn" class="primary-button">
                            <i class="fas fa-save"></i> Atualizar
                        </button>
                        <button id="delete-note-btn" class="secondary-button">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div id="loading-modal" class="loading-modal hidden">
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <span>Analisando com IA...</span>
            </div>
        </div>

    <?php endif; ?>
    </div>

    <?php if ($_SESSION['tipo'] == 'administrador'): ?>
        <script src="js/admin.js"></script>
    <?php elseif ($_SESSION['tipo'] == 'professor'): ?>
        <script src="js/professor.js"></script>
    <?php else: ?>
        <script src="js/aluno.js"></script>
    <?php endif; ?>

</body>

</html>