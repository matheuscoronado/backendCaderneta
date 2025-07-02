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
        <?php if ($_SESSION['tipo'] == 'administrador'): ?>
            <!-- Cabeçalho -->
            <header class="shadow-sm p-4" style="background-color: var(--card-bg);">
                <div class="container mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div class="flex items-center">
                        <i class="fas fa-book-medical text-xl text-blue-500 mr-2"></i>
                        <h1 class="text-lg sm:text-xl font-bold text-[var(--text-color)]">MedNotes - Admin Center</h1>
                    </div>

                    <div class="flex items-center gap-2 self-end sm:self-auto">
                        <button id="theme-toggle" class="theme-toggle">
                            <i class="fas fa-moon"></i>
                        </button>

                        <button id="add-user-btn" class="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm sm:text-base">
                            <i class="fas fa-plus mr-1 sm:mr-2"></i><span class="hidden sm:inline">Adicionar</span>
                        </button>

                        <a href="logout.php" id="logout-btn" class="text-gray-600 hover:text-blue-600 text-sm sm:text-base flex items-center gap-1">
                            <i class="fas fa-sign-out-alt"></i> <span class="hidden sm:inline">Sair</span>
                        </a>
                    </div>
                </div>
            </header>

            <div class="bg-[var(--bg-color)] min-h-screen">

            <!-- Conteúdo Principal -->
            <main class="container mx-auto p-2 sm:p-4 pb-20">
                <!-- Seção de Usuários -->
                <div class="rounded-xl shadow-md p-4 sm:p-6 mb-6" style="background-color: var(--card-bg); border: 1px solid var(--border-color);">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-base sm:text-lg font-semibold" style="color: var(--text-color);">Gerenciamento de Usuários</h2>
                    </div>

                    <!-- Tabela de Usuários -->
                    <div class="overflow-x-auto">
                        <table class="min-w-full" style="border-color: var(--border-color);">
                            <thead>
                                <tr style="background-color: var(--light-gray);">
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--text-color);">ID</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--text-color);">Nome</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--text-color);">Email</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--text-color);">Perfil</th>
                                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style="color: var(--text-color);">Ações</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y" style="border-color: var(--border-color);">
                                <?php foreach ($users as $user): ?>
                                <tr class="hover:bg-[var(--hover-color)] transition-colors duration-150">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" style="color: var(--text-color);"><?= htmlspecialchars($user['id']) ?></td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm" style="color: var(--text-color);"><?= htmlspecialchars($user['nome']) ?></td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm" style="color: var(--text-color);"><?= htmlspecialchars($user['email']) ?></td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full" 
                                            style="
                                                <?= match(strtolower($user['tipo'])) {
                                                    'admin', 'administrador' => 'background-color: var(--view-bg); color: var(--view-color); border: 1px solid var(--view-border);',
                                                    'aluno', 'student' => 'background-color: var(--edit-bg); color: var(--edit-color); border: 1px solid var(--edit-border);',
                                                    'prof', 'professor', 'teacher' => 'background-color: var(--delete-bg); color: var(--delete-color); border: 1px solid var(--delete-border);',
                                                    default => 'background-color: var(--light-gray); color: var(--secondary-color); border: 1px solid var(--border-color);'
                                                } ?>">
                                            <?= match(strtolower($user['tipo'])) {
                                                'admin', 'administrador' => 'ADMIN',
                                                'prof', 'professor', 'teacher' => 'PROFESSOR',
                                                'aluno', 'student' => 'ALUNO',
                                                default => strtoupper($user['tipo'])
                                            } ?>
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div class="flex justify-end space-x-2">
                                            <a href="index.php?action=edit&id=<?= $user['id'] ?>" 
                                            class="px-3 py-1 rounded-md transition-colors"
                                            style="
                                                color: var(--edit-color);
                                                background-color: var(--edit-bg);
                                                border: 1px solid var(--edit-border);
                                            ">
                                            Editar
                                            </a>
                                            <a href="index.php?action=delete&id=<?= $user['id'] ?>" 
                                            class="px-3 py-1 rounded-md transition-colors"
                                            style="
                                                color: var(--delete-color);
                                                background-color: var(--delete-bg);
                                                border: 1px solid var(--delete-border);
                                            "
                                            onclick="return confirm('Tem certeza que deseja excluir?')">
                                            Excluir
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>



                <!-- Modal de Adicionar -->
                <div id="user-form-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
                    <div class="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md mx-2">
                        <div class="flex justify-between items-center mb-4">
                            <h2 id="form-modal-title" class="text-lg font-semibold">Adicionar Novo Usuário</h2>
                            <button id="close-form-modal" class="text-gray-500 hover:text-gray-700">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <form method="post" action="index.php?action=register" class="space-y-4">
                            <div>
                            <label for="nome" class="block text-sm font-medium text-gray-700">Nome:</label>
                            <input type="text" name="nome" id="nome" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            </div>
            
                            <div>
                            <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
                            <input type="email" name="email" id="email" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            </div>
            
                            <div class="relative">
                            <label for="senha_hash" class="block text-sm font-medium text-gray-700">Senha:</label>
                            <div class="relative mt-1">
                            <input type="password" name="senha_hash" id="senha_hash" required class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            <button type="button" id="toggle-password" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                                <i class="far fa-eye"></i>
                            </button>
                            </div>
                            </div>
            
                            <div>
                            <label for="tipo" class="block text-sm font-medium text-gray-700">Perfil:</label>
                            <select name="tipo" id="tipo" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                             <option value="administrador">Administrador</option>
                             <option value="professor">Professor</option>
                             <option value="aluno">Aluno</option>
                            </select>
                            </div>
            
                            <div class="flex justify-end gap-3">
                            <button type="button" id="cancel-form" class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                                Cancelar
                            </button>
                            <button type="submit" name="register" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                                Salvar
                            </button>
                            </div>
                        </form>
                    </div>
                </div>
                
                <!-- Rodapé Móvel -->
                <nav class="fixed bottom-0 left-0 right-0 bg-[var(--bg-color)] border-t border-[var(--border-color)] flex justify-around py-2 sm:py-3">
                        <i class="fas fa-cog text-lg sm:text-xl"></i>
                    </a>
                </nav>

            </main>

    </div>

        <?php elseif ($_SESSION['tipo'] == 'professor'): ?>
            <!-- Conteúdo do Professor -->
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
                        <a href="logout.php" id="logout-btn"
                            class="text-gray-600 hover:text-blue-600 text-sm sm:text-base flex items-center gap-1">
                            <i class="fas fa-sign-out-alt"></i> <span class="hidden sm:inline">Sair</span>
                        </a>
                    </div>
                </div>
            </header>

            <main class="main-content">
                <div class="search-container">
                    <input type="text" id="search-input" placeholder="Buscar aluno...">
                </div>

        <div class="students-section">
            <h2>Turma de Teste</h2>
            <div id="students-list" class="students-grid">
                    <?php foreach ($users as $user): ?>
                    <?php if ($user['tipo'] === 'aluno'): ?>
                <tr>
                    <td><?= $user['nome'] ?></td>
                    <td><?= $user['email'] ?></td>
                    <td>
                        <a href="index.php?action=ver-anotacoes&aluno_id=<?= $user['id'] ?>" class="btn">Ver Anotações</a>
                    </td>
                </tr>
                <?php endif; ?>
                <?php endforeach; ?>

            </div>
        </div>
            </main>

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

        <?php else: ?>
            <!-- Conteúdo do Aluno -->
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
                        <a href="logout.php" id="logout-btn"
                            class="text-gray-600 hover:text-blue-600 text-sm sm:text-base flex items-center gap-1">
                            <i class="fas fa-sign-out-alt"></i> <span class="hidden sm:inline">Sair</span>
                        </a>
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
                    <textarea id="note-content" rows="8" placeholder="Faça sua anotação..."></textarea>
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

    <?php if ($_SESSION['tipo'] == 'administrador'): ?>
        <script src="js/admin.js"></script>
    <?php elseif ($_SESSION['tipo'] == 'professor'): ?>
        <script src="js/professor.js"></script>
    <?php else: ?>
        <script src="js/aluno.js"></script>
    <?php endif; ?>
</body>
</html>