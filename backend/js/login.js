document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.getElementById('togglePassword');
    const password = document.getElementById('senha_hash');
    const icon = togglePassword.querySelector('i');
    
    togglePassword.addEventListener('click', function() {
        // Alternar tipo do input
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        
        // Alternar ícone
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });
});