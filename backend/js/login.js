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