// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', function() {
    // Aplica o tema salvo no localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);


  // Elementos do modal de adição de usuário
  const btnAdd = document.getElementById('add-user-btn');
  const modal = document.getElementById('user-form-modal');
  const closeModal = document.getElementById('close-form-modal');
  const cancelForm = document.getElementById('cancel-form');
  const userForm = document.getElementById('user-form');

  // Configuração do botão para adicionar novo usuário
  if (btnAdd) {
    btnAdd.addEventListener('click', (e) => {
      e.preventDefault();
      // Limpa o formulário para garantir que será um novo cadastro
      if (userForm) userForm.reset();
      // Atualiza o título do modal
      const modalTitle = document.getElementById('form-modal-title');
      if (modalTitle) modalTitle.textContent = 'Adicionar Novo Usuário';
      // Exibe o modal
      if (modal) modal.classList.remove('hidden');
    });
  }

  // Configura o botão para fechar o modal
  if (closeModal) {
    closeModal.addEventListener('click', () => {
      if (modal) modal.classList.add('hidden');
    });
  }

  // Configura o botão para cancelar o formulário
  if (cancelForm) {
    cancelForm.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) modal.classList.add('hidden');
    });
  }

  // Fecha o modal quando clica fora da área de conteúdo
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  }

  // Configura o toggle para mostrar/esconder a senha
  const togglePassword = document.getElementById('toggle-password');
  const passwordField = document.getElementById('senha_hash');
  
  if (togglePassword && passwordField) {
    togglePassword.addEventListener('click', () => {
      // Alterna entre os tipos 'password' e 'text'
      const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordField.setAttribute('type', type);
      // Altera o ícone do olho conforme o estado
      togglePassword.innerHTML = type === 'password' ? '<i class="far fa-eye"></i>' : '<i class="far fa-eye-slash"></i>';
    });
  }

  // Configura o envio do formulário
  if (userForm) {
    userForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Aqui seria implementado o envio AJAX do formulário
      console.log('Formulário enviado!');
      // Fecha o modal após o envio
      if (modal) modal.classList.add('hidden');
    });
  }
});

// Função para alternar a visibilidade da senha (versão alternativa)
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

// Configuração do modal de edição de usuário
document.addEventListener('DOMContentLoaded', function() {
    const editModal = document.getElementById('edit-user-modal');
    const closeEditBtn = document.getElementById('close-edit-modal');
    const cancelEditBtn = document.getElementById('cancel-edit-form');
    const editForm = document.getElementById('edit-user-form');

    // Elementos do formulário de edição
    const inputId = document.getElementById('edit-user-id');
    const inputNome = document.getElementById('edit-nome');
    const inputEmail = document.getElementById('edit-email');
    const inputSenha = document.getElementById('edit-senha_hash');
    const inputTipo = document.getElementById('edit-tipo');

    // Elementos do toggle de senha no modal de edição
    const toggleEditPasswordBtn = document.getElementById('toggle-edit-password');
    const eyeIconEdit = toggleEditPasswordBtn.querySelector('i');

    // Configura os botões de edição para abrir o modal com os dados do usuário
    document.querySelectorAll('.edit-user-btn').forEach(button => {
        button.addEventListener('click', () => {
            // Preenche o formulário com os dados do usuário
            inputId.value = button.dataset.id;
            inputNome.value = button.dataset.nome;
            inputEmail.value = button.dataset.email;
            inputSenha.value = button.dataset.senha;
            inputTipo.value = button.dataset.tipo;

            // Exibe o modal de edição
            editModal.classList.remove('hidden');
        });
    });

    // Função para fechar o modal de edição
    function closeModal() {
        editModal.classList.add('hidden');
        editForm.reset(); // Reseta o formulário
    }

    // Configura os botões para fechar o modal
    closeEditBtn.addEventListener('click', closeModal);
    cancelEditBtn.addEventListener('click', closeModal);

    // Configura o toggle para mostrar/esconder senha no modal de edição
    toggleEditPasswordBtn.addEventListener('click', () => {
        const isPassword = inputSenha.type === 'password';
        inputSenha.type = isPassword ? 'text' : 'password';
        eyeIconEdit.classList.toggle('fa-eye-slash');
        eyeIconEdit.classList.toggle('fa-eye');
    });
});

// Aplica tema claro ou escuro
function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark-mode');
        document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// Alterna entre os temas
function toggleTheme() {
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
}

// Botão de alternância de tema
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
