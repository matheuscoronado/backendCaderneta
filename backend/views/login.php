<!DOCTYPE html>
<html lang="pt-br">

<head>
    <!-- Configurações básicas do documento -->
    <meta charset="UTF-8" />
    <!-- Responsividade: adapta-se a dispositivos móveis -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <!-- Título da página (aparece na aba do navegador) -->
    <title>Login | MedNotes - Caderneta Digital</title>
    
    <!-- Importações de bibliotecas externas -->
    <script src="https://cdn.tailwindcss.com"></script> <!-- Tailwind CSS (framework de estilização) -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/> <!-- Font Awesome (ícones) -->
    <link rel="shortcut icon" type="image/svg" href="/logo-aba_book-medical-solid.svg"/> <!-- Ícone da aba do navegador -->
    <!-- Importação do CSS personalizado -->
    <link rel="stylesheet" href="./css/login.css" />
</head>

<!-- Corpo da página com estilos Tailwind -->
<body class="bg-gray-50 min-h-screen">

  <?php
    // Inicia sessão e recupera possíveis mensagens de erro
    session_start();
    $error = isset($_SESSION['login_error']) ? $_SESSION['login_error'] : null;
    $old_email = isset($_SESSION['old_email']) ? $_SESSION['old_email'] : '';
    
    // Limpa os dados da sessão após uso
    unset($_SESSION['login_error']);
    unset($_SESSION['old_email']);
    ?>
    <!-- Tela de login (sobreposta, centralizada) -->
    <div id="login-screen" class="fixed inset-0 bg-blue-500 flex items-center justify-center p-4 z-50" style="background-color: var(--bg-color)">
        
    <!-- Botão modo notruno -->
        <!-- <div class="fixed bottom-6 right-6 z-50"> -->
            <!-- <button id="theme-toggle" class="flex items-center justify-center p- rounded-full shadow-md transition-all duration-300 bg-blue-100 dark:bg-gray-700 hover:bg-blue-200 dark:hover:bg-gray-600 text-blue-600 dark:text-gray-200"> -->
                <!-- Ícone da lua (light mode) -->
                <!-- <i class="fas fa-moon text-lg dark:hidden"></i> -->
                <!-- Ícone do sol (dark mode) -->
                <!-- <i class="fas fa-sun text-lg hidden dark:block"></i> -->
            <!-- </button> -->
         <!-- </div> -->
    <!-- FIM Botão modo notruno -->

        <!-- Card de login (container branco) -->
        <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <!-- Cabeçalho do card (logo e título) -->
            <div class="text-center mb-6">
                <i class="fas fa-book-medical text-4xl text-blue-500 mb-3"></i> <!-- Ícone -->
                <h1 class="text-2xl font-bold text-gray-800">MedNotes</h1> <!-- Título -->
                <p class="text-gray-600">Sua caderneta médica digital</p> <!-- Subtítulo -->
            </div>

              <!-- Exibe mensagem de erro se existir -->
            <?php if ($error): ?>
            <div class="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg flex items-start">
                <i class="fas fa-exclamation-circle mr-2 mt-0.5"></i>
                <p><?php echo htmlspecialchars($error); ?></p>
            </div>
            <?php endif; ?>

            <!-- Formulário de login (envia dados para o backend) -->
            <form method='post' id="login-form" class="space-y-4" action="index.php?action=login">
                <!-- Campo de e-mail -->
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                    <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        required 
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <!-- Campo de senha com botão para mostrar/ocultar -->
                <div class="relative">
                    <label for="senha_hash" class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                    <input 
                        type="password" 
                        name="senha_hash" 
                        id="senha_hash" 
                        required 
                        class="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                    <!-- Botão para alternar visibilidade da senha -->
                    <button 
                        type="button" 
                        id="togglePassword" 
                        class="absolute right-3 bottom-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <i id="eyeIcon" class="fas fa-eye-slash"></i> <!-- Ícone de olho fechado (inicialmente) -->
                    </button>
                </div>

                <!-- Botão de submit -->
                <button 
                    type="submit" 
                    class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                    <i class="fas fa-sign-in-alt mr-2"></i> Entrar
                </button>
            </form>
        </div>
    </div>

    <!-- Script JavaScript para funcionalidades de login -->
    <script src="./js/login.js"></script>
</body>

</html>