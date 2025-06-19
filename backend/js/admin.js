document.addEventListener('DOMContentLoaded', function() {
    // Variável global para armazenar os usuários
    let users = [];

    // Elementos do DOM
    const modal = document.getElementById('user-form-modal');
    const form = document.getElementById('user-form');
    const userTable = document.querySelector('.styled-table tbody');
    const addUserBtn = document.getElementById('add-user-btn');
    const closeModalBtn = document.getElementById('close-form-modal');
    const cancelFormBtn = document.getElementById('cancel-form');
    const logoutBtn = document.getElementById('logout-btn');
    const themeToggle = document.getElementById('theme-toggle');

    // Inicialização
    loadUsers();
    setupEventListeners();
    loadTheme();

    // Função para carregar usuários
    async function loadUsers() {
    try {
        const response = await fetch('controllers/UserController.php?action=getAll');
        
        // Verifique primeiro se a resposta é válida
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const text = await response.text();
        
        // Debug: mostre a resposta bruta no console
        console.log("Resposta bruta:", text);
        
        try {
            const data = JSON.parse(text);
            
            if (!data.success) {
                throw new Error(data.message || "Erro no servidor");
            }
            
            users = data.users;
            renderUsers();
        } catch (e) {
            console.error("Falha ao parsear JSON:", e);
            throw new Error("Resposta inválida do servidor");
        }
    } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        alert("Erro ao carregar usuários. Verifique o console para detalhes.");
    }
}

    // Função para renderizar usuários na tabela
    function renderUsers() {
        userTable.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.nome}</td>
                <td>${user.email}</td>
                <td>${user.tipo}</td>
                <td>
                    <button class="edit-user-btn" 
                        data-id="${user.id}" 
                        data-nome="${user.nome}" 
                        data-email="${user.email}" 
                        data-tipo="${user.tipo}">
                        Editar
                    </button>
                    <button class="delete-user-btn" data-id="${user.id}">
                        Excluir
                    </button>
                </td>
            `;
            userTable.appendChild(row);
        });

        // Adiciona eventos aos botões recém-criados
        addEditButtonsEventListeners();
        addDeleteButtonsEventListeners();
    }

    // Função para configurar eventos
    function setupEventListeners() {
        // Botão para adicionar novo usuário
        addUserBtn.addEventListener('click', () => {
            document.getElementById('form-modal-title').textContent = 'Adicionar Novo Usuário';
            form.reset();
            document.getElementById('user-id').value = '';
            document.getElementById('senha_hash').required = true;
            modal.classList.remove('hidden');
        });

        // Fechar modal
        closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
        cancelFormBtn.addEventListener('click', () => modal.classList.add('hidden'));

        // Submit do formulário
        form.addEventListener('submit', handleFormSubmit);

        // Toggle de senha
        document.getElementById('toggle-password').addEventListener('click', togglePasswordVisibility);

        // Logout
        logoutBtn.addEventListener('click', handleLogout);

        // Toggle de tema
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Função para adicionar eventos aos botões de edição
    function addEditButtonsEventListeners() {
        document.querySelectorAll('.edit-user-btn').forEach(button => {
            button.addEventListener('click', function() {
                document.getElementById('form-modal-title').textContent = 'Editar Usuário';
                document.getElementById('user-id').value = this.dataset.id;
                document.getElementById('nome').value = this.dataset.nome;
                document.getElementById('email').value = this.dataset.email;
                document.getElementById('tipo').value = this.dataset.tipo;
                document.getElementById('senha_hash').required = false;
                modal.classList.remove('hidden');
            });
        });
    }

    // Função para adicionar eventos aos botões de exclusão
    function addDeleteButtonsEventListeners() {
        document.querySelectorAll('.delete-user-btn').forEach(button => {
            button.addEventListener('click', function() {
                const userId = this.dataset.id;
                deleteUser(userId);
            });
        });
    }

    // Função para lidar com o submit do formulário
    async function handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const userId = document.getElementById('user-id').value;
        const action = userId ? 'update' : 'create';

        try {
            const response = await fetch(`controllers/UserController.php?action=${action}`, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert(data.message || 'Operação realizada com sucesso!');
                modal.classList.add('hidden');
                await loadUsers();
            } else {
                throw new Error(data.message || 'Erro ao realizar operação');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert(error.message);
        }
    }

    // Função para excluir usuário
    async function deleteUser(userId) {
        if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

        try {
            const response = await fetch(`controllers/UserController.php?action=delete&id=${userId}`);
            const data = await response.json();
            
            if (data.success) {
                alert(data.message || 'Usuário excluído com sucesso!');
                await loadUsers();
            } else {
                throw new Error(data.message || 'Erro ao excluir usuário');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert(error.message);
        }
    }

    // Função para alternar visibilidade da senha
    function togglePasswordVisibility() {
        const passwordInput = document.getElementById('senha_hash');
        const icon = this.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    }

    // Função para lidar com logout
    function handleLogout() {
        fetch('controllers/AuthController.php?action=logout')
            .then(() => {
                window.location.href = 'index.html';
            })
            .catch(error => {
                console.error('Erro ao fazer logout:', error);
            });
    }

    // Funções para gerenciamento de tema
    function loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
    }

    function setTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        }
    }

    function toggleTheme() {
        const currentTheme = localStorage.getItem('theme') || 'light';
        setTheme(currentTheme === 'light' ? 'dark' : 'light');
    }
});