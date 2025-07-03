<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Editar Usuário - MedNotes</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    <link rel="stylesheet" href="css/aluno.css" />

    <link rel="shortcut icon" type="image/svg" href="/logo-aba_book-medical-solid.svg" />
</head>



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

                <a href="logout.php" id="logout-btn" class="text-gray-600 hover:text-blue-600 text-sm sm:text-base flex items-center gap-1">
                    <i class="fas fa-sign-out-alt"></i> <span class="hidden sm:inline">Sair</span>
                </a>
            </div>
        </div>
    </header>

    <div class="bg-[var(--bg-color)] min-h-screen">
        <!-- Conteúdo Principal -->
        <main class="container mx-auto p-2 sm:p-4 pb-20">
            <!-- Seção de Edição -->
            <div class="rounded-xl shadow-md p-4 sm:p-6 mb-6" style="background-color: var(--card-bg); border: 1px solid var(--border-color);">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-base sm:text-lg font-semibold" style="color: var(--text-color);">Editar Usuário</h2>
                </div>

                <form method="post" action="index.php?action=edit&id=<?= $user['id']?>" class="space-y-4">
                    <div>
                        <label for="nome" class="block text-sm font-medium" style="color: var(--text-color);">Nome:</label>
                        <input type="text" name="nome" id="nome" value="<?= $user['nome']?>" required 
                            class="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none"
                            style="border-color: var(--border-color); background-color: var(--input-bg); color: var(--text-color);">
                    </div>

                    <div>
                        <label for="email" class="block text-sm font-medium" style="color: var(--text-color);">Email:</label>
                        <input type="email" name="email" id="email" value="<?= $user['email']?>" required 
                            class="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none"
                            style="border-color: var(--border-color); background-color: var(--input-bg); color: var(--text-color);">
                    </div>

                    <div class="relative">
                        <label for="senha_hash" class="block text-sm font-medium" style="color: var(--text-color);">Senha:</label>
                        <div class="relative mt-1">
                            <input type="password" name="senha_hash" id="senha_hash" value="<?= $user['senha_hash']?>" required 
                                class="block w-full border rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none"
                                style="border-color: var(--border-color); background-color: var(--input-bg); color: var(--text-color);">
                           <button type="button" id="togglePassword" class="absolute right-3 bottom-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                                <i id="eyeIcon" class="fas fa-eye-slash"></i>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label for="tipo" class="block text-sm font-medium" style="color: var(--text-color);">Perfil:</label>
                        <select name="tipo" id="tipo" 
                            class="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none"
                            style="border-color: var(--border-color); background-color: var(--input-bg); color: var(--text-color);">
                            <option value="administrador" <?= $user['tipo'] == 'administrador' ? 'selected' : '' ?>>Administrador</option>
                            <option value="professor" <?= $user['tipo'] == 'professor' ? 'selected' : '' ?>>Professor</option>
                            <option value="aluno" <?= $user['tipo'] == 'aluno' ? 'selected' : '' ?>>Aluno</option>
                        </select>
                    </div>

                    <div class="flex justify-end gap-3 pt-4">
                        <a href="index.php?action=dashboard" class="px-4 py-2 border rounded-md shadow-sm text-sm font-medium hover:bg-gray-50"
                            style="border-color: var(--border-color); color: var(--text-color);">
                            Voltar
                        </a>
                        <button type="submit" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </main>

        <!-- Rodapé Móvel -->
        <nav class="fixed bottom-0 left-0 right-0 bg-[var(--bg-color)] border-t border-[var(--border-color)] flex justify-center py-3">
            <div class="text-[var(--primary-color)]">
                <i class="fas fa-cog text-xl"></i>
            </div>
        </nav>
    </div>


    <script>
        // Script para alternar a visibilidade da senha
        document.addEventListener('DOMContentLoaded', function() {
        const toggleBtn = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('senha_hash');
        const eyeIcon = document.getElementById('eyeIcon');

        toggleBtn.addEventListener('click', function() {
            // Alternar tipo de input
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            
            // Alternar ícone
            eyeIcon.classList.toggle('fa-eye-slash');
            eyeIcon.classList.toggle('fa-eye');
            
            // Debug no console
            console.log('Senha visível?', !isPassword);
            console.log('Classe do ícone:', eyeIcon.className);
        });
    });

    </script>

</body>



