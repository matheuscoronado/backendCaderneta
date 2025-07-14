// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', function() {
    // Aplica o tema salvo no localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // --- MODAL DE ADICIONAR USUÁRIO ---
    const btnAdd = document.getElementById('add-user-btn');
    const modalAdd = document.getElementById('user-form-modal');
    const closeAddModal = document.getElementById('close-form-modal');
    const cancelAddForm = document.getElementById('cancel-form');
    const addUserForm = document.getElementById('add-user-form');

    if (btnAdd) {
        btnAdd.addEventListener('click', (e) => {
            e.preventDefault();
            if (addUserForm) addUserForm.reset(); // limpa o form
            const modalTitle = document.getElementById('form-modal-title');
            if (modalTitle) modalTitle.textContent = 'Adicionar Novo Usuário';
            if (modalAdd) modalAdd.classList.remove('hidden');
        });
    }

    if (closeAddModal) {
        closeAddModal.addEventListener('click', () => {
            if (modalAdd) modalAdd.classList.add('hidden');
        });
    }

    if (cancelAddForm) {
        cancelAddForm.addEventListener('click', (e) => {
            e.preventDefault();
            if (modalAdd) modalAdd.classList.add('hidden');
        });
    }

    if (modalAdd) {
        modalAdd.addEventListener('click', (e) => {
            if (e.target === modalAdd) {
                modalAdd.classList.add('hidden');
            }
        });
    }

    // Toggle mostrar/esconder senha no modal de adicionar usuário
    const togglePassword = document.getElementById('toggle-password');
    const passwordField = document.getElementById('senha_hash');
    if (togglePassword && passwordField) {
        togglePassword.addEventListener('click', () => {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            togglePassword.innerHTML = type === 'password' ? '<i class="far fa-eye"></i>' : '<i class="far fa-eye-slash"></i>';
        });
    }

    // --- MODAL DE EDITAR USUÁRIO ---
    const editModal = document.getElementById('edit-user-modal');
    const closeEditBtn = document.getElementById('close-edit-modal');
    const cancelEditBtn = document.getElementById('cancel-edit-form');
    const editForm = document.querySelector('#edit-user-modal form'); // pega o form dentro do modal de editar

    // Inputs do form editar
    const inputId = document.getElementById('edit-user-id');
    const inputNome = document.getElementById('edit-nome');
    const inputEmail = document.getElementById('edit-email');
    const inputSenha = document.getElementById('edit-senha_hash');
    const inputTipo = document.getElementById('edit-tipo');

    // Botão toggle senha edição
    const toggleEditPasswordBtn = document.getElementById('toggle-edit-password');
    const eyeIconEdit = toggleEditPasswordBtn ? toggleEditPasswordBtn.querySelector('i') : null;

    // Botões de editar (deve ter a classe .edit-user-btn e data attributes com info)
    document.querySelectorAll('.edit-user-btn').forEach(button => {
        button.addEventListener('click', () => {
            inputId.value = button.dataset.id || '';
            inputNome.value = button.dataset.nome || '';
            inputEmail.value = button.dataset.email || '';
            inputSenha.value = ''; // senha sempre vazia para edição
            inputTipo.value = button.dataset.tipo || 'aluno';

            if (editModal) editModal.classList.remove('hidden');
        });
    });

    // Função para fechar modal edição
    function closeEditModalFunc() {
        if (editModal) editModal.classList.add('hidden');
        if (editForm) editForm.reset();
    }

    if (closeEditBtn) closeEditBtn.addEventListener('click', closeEditModalFunc);
    if (cancelEditBtn) cancelEditBtn.addEventListener('click', closeEditModalFunc);

    if (editModal) {
        editModal.addEventListener('click', (e) => {
            if (e.target === editModal) {
                closeEditModalFunc();
            }
        });
    }

    if (toggleEditPasswordBtn && inputSenha && eyeIconEdit) {
        toggleEditPasswordBtn.addEventListener('click', () => {
            const isPassword = inputSenha.type === 'password';
            inputSenha.type = isPassword ? 'text' : 'password';
            eyeIconEdit.classList.toggle('fa-eye-slash');
            eyeIconEdit.classList.toggle('fa-eye');
        });
    }

    // --- TEMA CLARO/ESCURO ---
    function setTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.body.classList.remove('dark-mode');
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }

    function toggleTheme() {
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }

    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
});
