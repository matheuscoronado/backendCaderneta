// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', function() {
    // Obtém referências aos elementos do DOM:
    // - Botão de alternar visibilidade da senha
    const toggleBtn = document.getElementById('togglePassword');
    // - Campo de entrada da senha
    const passwordInput = document.getElementById('senha_hash');
    // - Ícone do olho (Font Awesome)
    const eyeIcon = document.getElementById('eyeIcon');

    // Adiciona um listener de clique no botão de alternar
    toggleBtn.addEventListener('click', function() {
        // Verifica se o campo de senha está atualmente no modo password (oculto)
        const isPassword = passwordInput.type === 'password';
        
        // Alterna o tipo do input entre 'password' (oculto) e 'text' (visível)
        passwordInput.type = isPassword ? 'text' : 'password';
        
        // Alterna as classes do ícone entre:
        // - fa-eye-slash (olho fechado/riscado - senha oculta)
        // - fa-eye (olho aberto - senha visível)
        eyeIcon.classList.toggle('fa-eye-slash');
        eyeIcon.classList.toggle('fa-eye');
        
        // Debug no console (pode ser removido em produção)
        console.log('Senha visível?', !isPassword); // Mostra o estado atual da visibilidade
        console.log('Classe do ícone:', eyeIcon.className); // Mostra as classes atuais do ícone
    });
});