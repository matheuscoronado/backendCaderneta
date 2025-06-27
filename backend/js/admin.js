document.addEventListener('DOMContentLoaded', () => {
  // Elementos do modal
  const btnAdd = document.getElementById('add-user-btn');
  const modal = document.getElementById('user-form-modal');
  const closeModal = document.getElementById('close-form-modal');
  const cancelForm = document.getElementById('cancel-form');
  const userForm = document.getElementById('user-form');

  // Botão de adicionar usuário
  if (btnAdd) {
    btnAdd.addEventListener('click', (e) => {
      e.preventDefault();
      // Limpar formulário (para garantir que é um novo usuário)
      if (userForm) userForm.reset();
      // Atualizar título do modal
      const modalTitle = document.getElementById('form-modal-title');
      if (modalTitle) modalTitle.textContent = 'Adicionar Novo Usuário';
      // Mostrar modal
      if (modal) modal.classList.remove('hidden');
    });
  }

  // Fechar modal ao clicar no botão de fechar
  if (closeModal) {
    closeModal.addEventListener('click', () => {
      if (modal) modal.classList.add('hidden');
    });
  }

  // Cancelar formulário
  if (cancelForm) {
    cancelForm.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) modal.classList.add('hidden');
    });
  }

  // Fechar modal ao clicar fora do conteúdo
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  }

  // Toggle de senha (mostrar/esconder)
  const togglePassword = document.getElementById('toggle-password');
  const passwordField = document.getElementById('senha_hash');
  
  if (togglePassword && passwordField) {
    togglePassword.addEventListener('click', () => {
      const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordField.setAttribute('type', type);
      togglePassword.innerHTML = type === 'password' ? '<i class="far fa-eye"></i>' : '<i class="far fa-eye-slash"></i>';
    });
  }

  // Toggle tema
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
      localStorage.setItem('theme', nextTheme);
      setTheme(nextTheme);
    });
  }

  // Envio do formulário
  if (userForm) {
    userForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Aqui você pode adicionar a lógica para enviar o formulário via AJAX
      console.log('Formulário enviado!');
      // Fechar o modal após o envio
      if (modal) modal.classList.add('hidden');
    });
  }
});

function setTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}
//Função para mostrar/ocultar senha
document.getElementById('toggle-password').addEventListener('click', function () { 
    const passwordInput = document.getElementById('password');
    const toggleIcon = this.querySelector('i');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
});