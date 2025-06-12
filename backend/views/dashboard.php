<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Configurações - MedNotes</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    <link rel="stylesheet" href="public/admin/configADM.css" />
    <link rel="shortcut icon" type="image/svg" href="/logo-aba_book-medical-solid.svg" />
    <style>
        /* Estilos para o modal */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            justify-content: center;
            align-items: center;
        }
        
        .modal-content {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .close-btn {
            cursor: pointer;
            font-size: 24px;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        
        .form-group input, .form-group select {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        .btn {
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 10px;
        }
        
        .btn-primary {
            background-color: #3b82f6;
            color: white;
            border: none;
        }
        
        .btn-secondary {
            background-color: #6b7280;
            color: white;
            border: none;
        }
        
        .btn-delete {
            background-color: #ef4444;
            color: white;
            border: none;
        }
    </style>
</head>

<body class="<?= isset($_SESSION['tipo']) ? $_SESSION['tipo'] : '' ?>">
    <div class="container">
        <?php 
        if (isset($_SESSION['tipo']) && $_SESSION['tipo'] == 'administrador'): 
            $users = $users ?? [];
        ?>
        
        <!-- Cabeçalho -->
        <header class="bg-white shadow-sm p-4">
            <div class="container mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div class="flex items-center">
                    <a href="index.html" class="mr-4 text-gray-600 hover:text-blue-600">
                        <i class="fas fa-arrow-left"></i>
                    </a>
                    <i class="fas fa-book-medical text-xl text-blue-500 mr-2"></i>
                    <h1 class="text-lg sm:text-xl font-bold text-gray-800">MedNotes - Admin Center</h1>
                </div>
                <div class="flex items-center gap-2 self-end sm:self-auto">
                    <button id="add-user-btn" class="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm sm:text-base">
                        <a href="index.php?action=register">Adicionar +</a>
                    </button>
                    <button id="logout-btn" class="text-gray-600 hover:text-blue-600 text-sm sm:text-base">
                        <i class="fas fa-sign-out-alt"></i>
                        <span class="hidden sm:inline"><a href="logout.php">Sair</a></span>
                    </button>
                </div>
            </div>
        </header>

        <!-- Conteúdo Principal -->
        <main class="container mx-auto p-2 sm:p-4 pb-20">
            <!-- Seção de Usuários -->
            <div class="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
                <div class="container">
                    <h2>Lista de Usuários</h2>
                    <table class="styled-table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Perfil</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (!empty($users)): ?>
                                <?php foreach ($users as $user): ?>
                                    <tr>
                                        <td><?= htmlspecialchars($user['nome'] ?? '') ?></td>
                                        <td><?= htmlspecialchars($user['email'] ?? '') ?></td>
                                        <td><?= htmlspecialchars($user['tipo'] ?? '') ?></td>
                                        <td>
                                            <button onclick='openEditModal(<?= json_encode($user) ?>)' class="btn btn-primary">Editar</button>

                                            <a href="index.php?action=delete&id=<?= $user['id'] ?>" class="btn btn-delete" onclick="return confirm('Tem certeza que deseja excluir?')">Excluir</a>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <tr>
                                    <td colspan="5">Nenhum usuário encontrado.</td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>

        <!-- Modal de Edição -->
        <div id="editModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Editar Usuário</h2>
                    <span class="close-btn" onclick="closeEditModal()">&times;</span>
                </div>
                <form id="editForm" method="post" action="index.php?action=edit">
                    <input type="hidden" name="id" id="edit-id">

                    <div class="form-group">
                        <label for="edit-nome">Nome:</label>
                        <input type="text" name="nome" id="edit-nome" required>

                        <label for="edit-email">Email:</label>
                        <input type="email" name="email" id="edit-email" required>

                        <label for="edit-senha">Senha:</label>
                        <input type="password" name="password" id="edit-senha" placeholder="Nova senha (opcional)">

                                                <label for="edit-funcao">Perfil:</label>
                        <select name="tipo" id="edit-funcao" required>
                            <option value="administrador">Administrador</option>
                            <option value="professor">Professor</option>
                            <option value="aluno">Aluno</option>
                        </select>

                    </div>

                    <div class="flex justify-end mt-4">
                        <button type="button" class="btn btn-secondary" onclick="closeEditModal()">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Salvar</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Rodapé Móvel -->
        <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 sm:py-3">
            <a href="indexADM.html" class="text-gray-600 p-2">
                <i class="fas fa-home text-lg sm:text-xl"></i>
            </a>
            <a href="configADM.html" class="text-blue-600 p-2">
                <i class="fas fa-cog text-lg sm:text-xl"></i>
            </a>
        </nav>

        <script src="public/admin/configADM.js"></script>

        <?php elseif (isset($_SESSION['tipo']) && $_SESSION['tipo'] == 'professor'): ?>
            <a href="index.php?action=list" class="btn">Gerenciar Usuários (Professor)</a>
            <p>Área exclusiva do Professor.</p>

        <?php else: ?>
            <p>Área exclusiva do Aluno.</p>
        <?php endif; ?>
    </div>
    
    <script>
    function openEditModal(user) {
        document.getElementById('edit-id').value = user.id;
        document.getElementById('edit-nome').value = user.nome;
        document.getElementById('edit-email').value = user.email;
        document.getElementById('edit-funcao').value = user.tipo;
        document.getElementById('edit-senha').value = ''; // não preenche senha

        document.getElementById('editModal').style.display = 'flex';
    }

    function closeEditModal() {
        document.getElementById('editModal').style.display = 'none';
    }

    // Fechar modal ao clicar fora do conteúdo
    window.onclick = function(event) {
        const modal = document.getElementById('editModal');
        if (event.target === modal) {
            closeEditModal();
        }
    }
</script>

</body>
</html>