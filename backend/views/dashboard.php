<?php
// Carrega o modelo de usuário e obtém todos os usuários do sistema
require_once 'models/User.php';
$users = User::all();
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <!-- Configurações básicas da página -->
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Configurações - MedNotes</title>
    
    <!-- Importação de frameworks e bibliotecas -->
    <script src="https://cdn.tailwindcss.com"></script> <!-- Framework CSS utilitário -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" /> <!-- Ícones Font Awesome -->

    <!-- Carrega folha de estilo específica para o tipo de usuário -->
    <?php if ($_SESSION['tipo'] == 'administrador'): ?>
        <link rel="stylesheet" href="css/admin.css" />
    <?php elseif ($_SESSION['tipo'] == 'professor'): ?>
        <link rel="stylesheet" href="css/professor.css" />
    <?php else: ?>
        <link rel="stylesheet" href="css/aluno.css" />
    <?php endif; ?>

    <link rel="shortcut icon" type="image/svg" href="/logo-aba_book-medical-solid.svg" />
</head>

<!-- Corpo da página com classe específica para o tipo de usuário -->
<body class="<?= $_SESSION['tipo'] ?>">
    <?php if ($_SESSION['tipo'] == 'administrador'): ?>
        <!-- ========== PAINEL ADMINISTRATIVO ========== -->
        <header class="shadow-sm p-4" style="background-color: var(--card-bg);">
            <div class="container mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <!-- Logo e título do sistema -->
                <div class="flex items-center">
                    <i class="fas fa-book-medical text-xl text-blue-500 mr-2"></i>
                    <h1 class="text-lg sm:text-xl font-bold text-[var(--text-color)]">MedNotes - Admin Center</h1>
                </div>

                <!-- Ações do cabeçalho -->
                <div class="flex items-center gap-2 self-end sm:self-auto">
                    <!-- Botão de alternar tema (claro/escuro) -->
                    <button id="theme-toggle" class="theme-toggle">
                        <i class="fas fa-moon"></i>
                    </button>

                    <!-- Botão para adicionar novo usuário -->
                    <button id="add-user-btn" class="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm sm:text-base">
                        <i class="fas fa-plus mr-1 sm:mr-2"></i><span class="hidden sm:inline">Adicionar</span>
                    </button>

                    <!-- Link para logout -->
                    <a href="logout.php" id="logout-btn" class="text-gray-600 hover:text-blue-600 text-sm sm:text-base flex items-center gap-1">
                        <i class="fas fa-sign-out-alt"></i> <span class="hidden sm:inline">Sair</span>
                    </a>
                </div>
            </div>
        </header>

        <!-- Área principal de conteúdo -->
        <div class="bg-[var(--bg-color)] min-h-screen">
            <main class="container mx-auto p-2 sm:p-4 pb-20">
                <!-- Seção de gerenciamento de usuários -->
                <div class="rounded-xl shadow-md p-4 sm:p-6 mb-6" style="background-color: var(--card-bg); border: 1px solid var(--border-color);">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-base sm:text-lg font-semibold" style="color: var(--text-color);">Gerenciamento de Usuários</h2>
                    </div>

                    <!-- Tabela responsiva de usuários -->
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
                                    <!-- Coluna ID -->
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" style="color: var(--text-color);"><?= htmlspecialchars($user['id']) ?></td>
                                    
                                    <!-- Coluna Nome -->
                                    <td class="px-6 py-4 whitespace-nowrap text-sm" style="color: var(--text-color);"><?= htmlspecialchars($user['nome']) ?></td>
                                    
                                    <!-- Coluna Email -->
                                    <td class="px-6 py-4 whitespace-nowrap text-sm" style="color: var(--text-color);"><?= htmlspecialchars($user['email']) ?></td>
                                    
                                    <!-- Coluna Tipo de Perfil -->
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full"
                                            style="
                                                <?= match(strtolower($user['tipo'])) {
                                                    'admin', 'administrador' => 'background-color: var(--admin-bg); color: var(--admin-text); border: 1px solid var(--admin-border);',
                                                    'aluno', 'student' => 'background-color: var(--aluno-bg); color: var(--aluno-text); border: 1px solid var(--aluno-border);',
                                                    'prof', 'professor', 'teacher' => 'background-color: var(--professor-bg); color: var(--professor-text); border: 1px solid var(--professor-border);',
                                                    default => 'background-color: var(--default-bg); color: var(--default-text); border: 1px solid var(--default-border);'
                                                } ?>">
                                            <?= match(strtolower($user['tipo'])) {
                                                'admin', 'administrador' => 'ADMIN',
                                                'prof', 'professor', 'teacher' => 'PROFESSOR',
                                                'aluno', 'student' => 'ALUNO',
                                                default => strtoupper($user['tipo'])
                                            } ?>
                                        </span>
                                    </td>
                                    
                                    <!-- Coluna Ações -->
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div class="flex justify-end space-x-2">
                                            <!-- Botão Editar -->
                                            <button
                                                class="edit-user-btn px-3 py-1 rounded-md transition-colors"
                                                style="
                                                    color: var(--edit-color);
                                                    background-color: var(--edit-bg);
                                                    border: 1px solid var(--edit-border);
                                                "
                                                data-id="<?= htmlspecialchars($user['id']) ?>"
                                                data-nome="<?= htmlspecialchars($user['nome']) ?>"
                                                data-email="<?= htmlspecialchars($user['email']) ?>"
                                                data-senha="<?= htmlspecialchars($user['senha_hash']) ?>"
                                                data-tipo="<?= htmlspecialchars($user['tipo']) ?>"
                                            >
                                                Editar
                                            </button>

                                            <!-- Botão Excluir -->
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

                <!-- ========== MODAL DE EDIÇÃO ========== -->
                <div id="edit-user-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
                    <div class="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md mx-2">
                        <div class="flex justify-between items-center mb-4">
                            <h2 id="edit-modal-title" class="text-lg font-semibold">Editar Usuário</h2>
                            <button id="close-edit-modal" class="text-gray-500 hover:text-gray-700">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <!-- Formulário de edição -->
                        <form method="post" action="index.php?action=edit&id=<?= $user['id']?>" class="space-y-4">
                            <input type="hidden" name="id" id="edit-user-id" />
                            
                            <!-- Campo Nome -->
                            <div>
                                <label for="edit-nome" class="block text-sm font-medium text-gray-700">Nome:</label>
                                <input type="text" name="nome" id="edit-nome" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            </div>

                            <!-- Campo Email -->
                            <div>
                                <label for="edit-email" class="block text-sm font-medium text-gray-700">Email:</label>
                                <input type="email" name="email" id="edit-email" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            </div>

                            <!-- Campo Senha -->
                            <div class="relative">
                                <label for="edit-senha_hash" class="block text-sm font-medium text-gray-700">Senha:</label>
                                <div class="relative mt-1">
                                    <input type="password" name="senha_hash" id="edit-senha_hash" required class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                    <button type="button" id="toggle-edit-password" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                                        <i class="far fa-eye"></i>
                                    </button>
                                </div>
                            </div>

                            <!-- Campo Tipo de Perfil -->
                            <div>
                                <label for="edit-tipo" class="block text-sm font-medium text-gray-700">Perfil:</label>
                                <select name="tipo" id="edit-tipo" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                    <option value="administrador">Administrador</option>
                                    <option value="professor">Professor</option>
                                    <option value="aluno">Aluno</option>
                                </select>
                            </div>

                            <!-- Botões do formulário -->
                            <div class="flex justify-end gap-3">
                                <button type="button" id="cancel-edit-form" class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    Cancelar
                                </button>
                                <button type="submit" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- ========== MODAL DE ADICIONAR NOVO USUÁRIO ========== -->
                <div id="user-form-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4" style="background-color: rgba(0, 0, 0, 0.7)">
                    <div class="rounded-xl p-4 sm:p-6 w-full max-w-md mx-2" style="background-color: var(--card-bg); border: 1px solid var(--border-color); box-shadow: var(--shadow-md)">
                        <div class="flex justify-between items-center mb-4">
                            <h2 id="form-modal-title" class="text-lg font-semibold" style="color: var(--text-color)">Adicionar Novo Usuário</h2>
                            <button id="close-form-modal" style="color: var(--secondary-color); hover:color: var(--text-color)">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <!-- Formulário de cadastro -->
                        <form method="post" action="index.php?action=register" class="space-y-4">
                            <!-- Campo Nome -->
                            <div>
                                <label for="nome" class="block text-sm font-medium" style="color: var(--text-color)">Nome:</label>
                                <input type="text" name="nome" id="nome" required 
                                    class="mt-1 block w-full rounded-md shadow-sm py-2 px-3 focus:outline-none"
                                    style="background-color: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-color); placeholder: var(--secondary-color);
                                            focus:ring: var(--primary-color); focus:border: var(--primary-color)">
                            </div>

                            <!-- Campo Email -->
                            <div>
                                <label for="email" class="block text-sm font-medium" style="color: var(--text-color)">Email:</label>
                                <input type="email" name="email" id="email" required 
                                    class="mt-1 block w-full rounded-md shadow-sm py-2 px-3 focus:outline-none"
                                    style="background-color: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-color); placeholder: var(--secondary-color);
                                            focus:ring: var(--primary-color); focus:border: var(--primary-color)">
                            </div>

                            <!-- Campo Senha -->
                            <div class="relative">
                                <label for="senha_hash" class="block text-sm font-medium" style="color: var(--text-color)">Senha:</label>
                                <div class="relative mt-1">
                                    <input type="password" name="senha_hash" id="senha_hash" required 
                                        class="block w-full rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none"
                                        style="background-color: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-color); placeholder: var(--secondary-color);
                                                focus:ring: var(--primary-color); focus:border: var(--primary-color)">
                                    <button type="button" id="toggle-password" 
                                            class="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            style="color: var(--secondary-color); hover:color: var(--text-color)">
                                        <i class="far fa-eye"></i>
                                    </button>
                                </div>
                            </div>

                            <!-- Campo Tipo de Perfil -->
                            <div>
                                <label for="tipo" class="block text-sm font-medium" style="color: var(--text-color)">Perfil:</label>
                                <select name="tipo" id="tipo" 
                                        class="mt-1 block w-full rounded-md shadow-sm py-2 px-3 focus:outline-none"
                                        style="background-color: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-color);
                                            focus:ring: var(--primary-color); focus:border: var(--primary-color)">
                                    <option value="administrador">Administrador</option>
                                    <option value="professor">Professor</option>
                                    <option value="aluno">Aluno</option>
                                </select>
                            </div>

                            <!-- Botões do formulário -->
                            <div class="flex justify-end gap-3">
                                <button type="button" id="cancel-form" 
                                        class="px-4 py-2 rounded-md shadow-sm text-sm font-medium transition-colors"
                                        style="border: 1px solid var(--border-color); color: var(--text-color); background-color: var(--bg-color); hover:background-color: var(--medium-gray)">
                                    Cancelar
                                </button>
                                <button type="submit" name="register" 
                                        class="px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white transition-colors"
                                        style="background-color: var(--primary-color); hover:background-color: var(--primary-dark)">
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                
                <!-- Rodapé móvel -->
                <nav class="fixed bottom-0 left-0 right-0 bg-[var(--bg-color)] border-t border-[var(--border-color)] flex justify-center py-3">
                    <div class="text-[var(--primary-color)]">
                        <i class="fas fa-cog text-xl"></i>
                    </div>
                </nav>
            </main>
        </div>

    <?php elseif ($_SESSION['tipo'] == 'professor'): ?>
        <!-- ========== PAINEL DO PROFESSOR ========== -->
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
                    <a href="logout.php" id="logout-btn" class="text-gray-600 hover:text-blue-600 text-sm sm:text-base flex items-center gap-1">
                        <i class="fas fa-sign-out-alt"></i> <span class="hidden sm:inline">Sair</span>
                    </a>
                </div>
            </div>
        </header>

        <main class="main-content">
            <!-- Barra de busca -->
            <div class="search-container">
                <input type="text" id="search-input" placeholder="Buscar aluno...">
            </div>

            <!-- Lista de alunos -->
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
            
    <?php else: ?>
        <!-- ========== PAINEL DO ALUNO ========== -->
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
                        <a href="logout.php" id="logout-btn" class="text-gray-600 hover:text-blue-600 text-sm sm:text-base flex items-center gap-1">
                            <i class="fas fa-sign-out-alt"></i> <span class="hidden sm:inline">Sair</span>
                        </a>
                    </div>
                </div>
            </header>

            <main class="main-content">
    <!-- Formulário de nova anotação -->
    <form id="note-form" action="index.php?action=salvar-anotacao" method="POST" class="bg-[var(--card-bg)] p-6 rounded-[var(--rounded-lg)] shadow-[var(--shadow-md)] border border-[var(--border-color)]">
        <h2 class="font-bold mb-4 text-center text-[var(--text-color)]">Nova Anotação</h2>

        <!-- Seleção de tópico -->
        <div class="form-group title-input mb-4">
            <select name="titulo" id="note-topic" class="topic-select w-full border border-[var(--border-color)] rounded-[var(--rounded)] py-2 px-3 bg-[var(--card-bg)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" required>
                <option value="">Selecione um tópico</option>
                <option value="Sinais Vitais - Conceitos Gerais">Sinais Vitais - Conceitos Gerais</option>
                <option value="Temperatura Corporal">Temperatura Corporal</option>
                <option value="Pulso e Frequência Cardíaca">Pulso e Frequência Cardíaca</option>
                <option value="Frequência Respiratória">Frequência Respiratória</option>
                <option value="Pressão Arterial">Pressão Arterial</option>
                <option value="Dor como Sinal Vital">Dor como Sinal Vital</option>
                <option value="Administração de Medicamentos - Vias Oral e Sublingual">Administração de Medicamentos - Vias Oral e Sublingual</option>
                <option value="Administração Parenteral - IM, ID, SC">Administração Parenteral - IM, ID, SC</option>
                <option value="Administração Endovenosa e Inalatória">Administração Endovenosa e Inalatória</option>
            </select>
        </div>

        <!-- Campo subtítulo -->
        <div class="form-group subtitle-input mb-4">
            <input
                type="text" name="subtitulo" id="note-subtitle" class="w-full border border-[var(--border-color)] rounded-[var(--rounded)] py-2 px-3 bg-[var(--card-bg)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" placeholder="Digite um subtítulo..." required
                />
        </div>

                    <!-- Área de texto principal -->
                    <textarea name="descricao" id="note-content" rows="8" placeholder="Faça sua anotação..." required></textarea>

                    <!-- Botões de ação -->
                    <div class="editor-actions">
                        <button type="submit" name="salvarAnotacao" class="save-button">
                            <i class="fas fa-save"></i> Salvar
                        </button>
                        <button id="analyze-btn" class="analyze-button">
                            <i class="fas fa-robot"></i> Analisar com Florense
                        </button>
                    </div>
                </form>

                <!-- Container de sugestões (inicialmente oculto) -->
                <div id="suggestions-container" class="suggestions-container hidden">
                    <div class="suggestions-header">
                        <h2>Sugestões da Florense</h2>
                        <button id="close-suggestions" class="close-button">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div id="suggestions-content" class="suggestions-content"></div>
                </div>
            </main>

            <!-- Sidebar de anotações -->
            <div id="notes-sidebar" class="notes-sidebar">
                <div class="sidebar-header">
                    <h2 id="sidebar-student-name">Minhas Anotações</h2>
                    <button id="close-sidebar" class="close-button">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- Barra de pesquisa -->
                <div class="search-container">
                    <i class="fas fa-search search-icon"></i>
                    <input type="text" id="notes-search" placeholder="Pesquisar anotações..." class="search-input">
                </div>

                <!-- Lista de anotações -->
                <div id="sidebar-notes-list" class="sidebar-notes-list"></div>

                <!-- Botão de exportação -->
                <button id="export-pdf-btn" class="export-button">
                    <i class="fas fa-file-pdf"></i> Exportar PDF
                </button>
            </div>

            <!-- Overlay do sidebar -->
            <div id="sidebar-overlay" class="sidebar-overlay"></div>

            <!-- Modal para edição da anotação, inicialmente oculto pela classe "hidden" -->
            <div id="edit-note-modal" class="note-modal hidden">

                <!-- Conteúdo principal do modal -->
                <div class="modal-content">
                    <div class="modal-body">

                        <!-- Cabeçalho do modal com título e botão para fechar -->
                        <div class="modal-header">
                            <div>
                                <h2>Editar Anotação</h2> <!-- Título do modal -->
                            </div>
                            <button id="close-edit-modal" class="close-button">
                                <i class="fas fa-times"></i> <!-- Ícone de "X" para fechar o modal -->
                            </button>
                        </div>

                        <!-- Seção para selecionar o título da anotação usando um select -->
                        <div class="form-group title-input">
                            <select name="titulo" id="edit-note-title" class="topic-select w-full border rounded-md py-2 px-3" required>
                                <option value="">Selecione um tópico</option> <!-- Opção padrão vazia -->
                                <option value="Sinais Vitais - Conceitos Gerais">Sinais Vitais - Conceitos Gerais</option>
                                <option value="Temperatura Corporal">Temperatura Corporal</option>
                                <option value="Pulso e Frequência Cardíaca">Pulso e Frequência Cardíaca</option>
                                <option value="Frequência Respiratória">Frequência Respiratória</option>
                                <option value="Pressão Arterial">Pressão Arterial</option>
                                <option value="Dor como Sinal Vital">Dor como Sinal Vital</option>
                                <option value="Administração de Medicamentos - Vias Oral e Sublingual">Administração de Medicamentos - Vias Oral e Sublingual</option>
                                <option value="Administração Parenteral - IM, ID, SC">Administração Parenteral - IM, ID, SC</option>
                                <option value="Administração Endovenosa e Inalatória">Administração Endovenosa e Inalatória</option>
                            </select>
                        </div>

                        <!-- Campo para inserir subtítulo da anotação -->
                        <div class="form-group subtitle-input">
                            <input type="text" id="edit-note-subtitle" placeholder="Subtítulo">
                        </div>

                        <!-- Área de texto para conteúdo da anotação -->
                        <textarea id="edit-note-content" rows="8" placeholder="Conteúdo da anotação..."></textarea>

                        <!-- Seção para exibir feedbacks do professor relacionados à anotação -->
                        <div id="edit-note-feedbacks" class="feedback-display mt-4">
                            <h3 class="text-sm font-semibold mb-2">Feedback do Professor</h3>
                            <div id="edit-feedback-content" class="space-y-2 text-sm text-gray-700 bg-gray-100 rounded-md p-3 overflow-y-auto max-h-48">
                                <!-- Feedbacks serão inseridos aqui via JavaScript -->
                            </div>
                        </div>

                        <!-- Seção para exibir sugestões adicionais (ex: da Florense) -->
                        <div id="edit-note-suggestions" class="suggestions-container">
                            <h3>Sugestões da Florense</h3>
                            <div id="edit-suggestions-content" class="suggestions-content"></div>
                        </div>

                        <!-- Botões para ações na anotação: atualizar e excluir -->
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



            <!-- Modal de loading -->
            <div id="loading-modal" class="loading-modal hidden">
                <div class="loading-content">
                    <div class="loading-spinner"></div>
                    <span>Analisando com Florense...</span>
                </div>
            </div>

            <!-- Navegação móvel -->
            <nav class="mobile-footer">
                <button id="new-note-btn" class="footer-button active">
                    <i class="fas fa-plus"></i>
                </button>
                <button id="view-notes-btn" class="footer-button">
                    <i class="fas fa-book"></i>
                </button>
            </nav>
        </div>
    <?php endif; ?>

    <!-- Carrega o JavaScript específico para cada tipo de usuário -->
    <?php if ($_SESSION['tipo'] == 'administrador'): ?>
        <script src="js/admin.js"></script>
    <?php elseif ($_SESSION['tipo'] == 'professor'): ?>
        <script src="js/professor.js"></script>
    <?php else: ?>
        <script src="js/aluno.js"></script>
    <?php endif; ?>
</body>
</html>