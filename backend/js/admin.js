// Carrega os usuários ao abrir a página
document.addEventListener('DOMContentLoaded', function () {
    renderUsersByRole();

    // Verifica se o usuário está logado
    if (localStorage.getItem('loggedIn') !== 'true') {0
        window.location.href = '/../login.html';
    }

    // Evento para abrir o modal de adicionar usuário
    document.getElementById('add-user-btn').addEventListener('click', function () {
        document.getElementById('form-modal-title').textContent = 'Adicionar Novo Usuário';
        document.getElementById('user-form').reset();
        document.getElementById('user-id').value = '';
        document.getElementById('user-form-modal').classList.remove('hidden');
    });

    // Evento para fechar o modal de formulário
    document.getElementById('close-form-modal').addEventListener('click', function () {
        document.getElementById('user-form-modal').classList.add('hidden');
    });

    document.getElementById('cancel-form').addEventListener('click', function () {
        document.getElementById('user-form-modal').classList.add('hidden');
    });

    // Evento para submeter o formulário
    document.getElementById('user-form').addEventListener('submit', function (e) {
        e.preventDefault();
        saveUser();
    });

    // Carrega o tema salvo no localStorage ou usa o tema claro por padrão
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
});

// Renderiza os usuários agrupados por função
function renderUsersByRole() {
    const container = document.getElementById('users-by-role');
    container.innerHTML = '';

    // Agrupa usuários por função
    const roles = [...new Set(users.map(user => user.role))];

    roles.forEach(role => {
        const roleUsers = users.filter(user => user.role === role);

        const roleSection = document.createElement('div');
        roleSection.className = 'role-section';

        const roleTitle = document.createElement('div');
        roleTitle.className = 'role-title';
        roleTitle.textContent = role === 'Administrador' ? 'Administradores' :
            role === 'Professor' ? 'Professores' :
                role === 'Aluno' ? 'Alunos' :
                    role + 's';

        const table = document.createElement('div');
        table.className = 'responsive-table';
        table.innerHTML = `
            <table class="min-w-full style="color: var(--text-color);">
                <thead style ="background-color: var(--header-bg);">
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <th class="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--text-color);">Nome</th>
                        <th class="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--text-color);">E-mail</th>
                        <th class="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider" style="color: var(--text-color);">Ações</th>
                    </tr>
                </thead>
                <tbody id="users-list-${role.replace(/\s+/g, '-')}" class="divide-y" style="background-color: var(--card-bg); border-color: var(--border-color);">
                    ${roleUsers.map(user => `
                        <tr class="user-card" style="background-color: var(--card-bg); border-color: var(--border-color);">
                            <td class="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                                <div class="text-xs sm:text-sm font-medium" style="color: var(--text-color);">${user.name}</div>
                            </td>
                            <td class="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                                <div class="text-xs sm:text-sm" style="color: var(--text-secondary);">${user.email}</div>
                            </td>
                            <td class="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                                <div class="action-buttons flex flex-wrap gap-2 justify-end">
                                    <!-- Botão Ver -->
                                    <button class="view-user flex items-center text-[var(--view-color)] hover:text-[var(--view-hover)] px-2 py-1 rounded border border-[var(--view-border)] bg-[var(--view-bg)]" data-id="${user.id}">
                                        <i class="fas fa-eye text-xs mr-1"></i>
                                        <span class="text-xs">Ver</span>
                                    </button>

                                    <!-- Botão Editar -->
                                    <button class="edit-user flex items-center text-[var(--edit-color)] hover:text-[var(--edit-hover)] px-2 py-1 rounded border border-[var(--edit-border)] bg-[var(--edit-bg)]" data-id="${user.id}">
                                        <i class="fas fa-edit text-xs mr-1"></i>
                                        <span class="text-xs">Editar</span>
                                    </button>

                                    <!-- Botão Excluir -->
                                    <button class="delete-user flex items-center text-[var(--delete-color)] hover:text-[var(--delete-hover)] px-2 py-1 rounded border border-[var(--delete-border)] bg-[var(--delete-bg)]" data-id="${user.id}">
                                        <i class="fas fa-trash text-xs mr-1"></i>
                                        <span class="text-xs">Excluir</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        roleSection.appendChild(roleTitle);
        roleSection.appendChild(table);
        container.appendChild(roleSection);
    });

    // Adiciona eventos aos botões
    addUserEventListeners();
}

// Adiciona eventos aos botões de ação
function addUserEventListeners() {
    document.querySelectorAll('.view-user').forEach(button => {
        button.addEventListener('click', function () {
            const userId = parseInt(this.dataset.id);
            showUserDetails(userId);
        });
    });

    document.querySelectorAll('.edit-user').forEach(button => {
        button.addEventListener('click', function () {
            const userId = parseInt(this.dataset.id);
            editUser(userId);
        });
    });

    document.querySelectorAll('.delete-user').forEach(button => {
        button.addEventListener('click', function () {
            const userId = parseInt(this.dataset.id);
            deleteUser(userId);
        });
    });
}

// Mostra os detalhes do usuário
function showUserDetails(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const modalContent = document.getElementById('user-details-content');
    modalContent.innerHTML = `
        <div>
            <span class="text-xs sm:text-sm font-medium text-gray-500">Nome:</span>
            <p class="mt-1 text-xs sm:text-sm">${user.name}</p>
        </div>
        <div>
            <span class="text-xs sm:text-sm font-medium text-gray-500">E-mail:</span>
            <p class="mt-1 text-xs sm:text-sm">${user.email}</p>
        </div>
        <div>
            <span class="text-xs sm:text-sm font-medium text-gray-500">Função:</span>
            <p class="mt-1 text-xs sm:text-sm">${user.role}</p>
        </div>
        <div>
            <span class="text-xs sm:text-sm font-medium text-gray-500">Último acesso:</span>
            <p class="mt-1 text-xs sm:text-sm">${user.lastLogin}</p>
        </div>
    `;

    document.getElementById('user-details-modal').classList.remove('hidden');


   // Configura os eventos para os botões existentes no modal
    const editBtn = document.querySelector('#user-details-modal .mt-4 button:first-child');
    const deleteBtn = document.querySelector('#user-details-modal .mt-4 button:last-child');

    // Remove event listeners antigos para evitar duplicação
    editBtn.replaceWith(editBtn.cloneNode(true));
    deleteBtn.replaceWith(deleteBtn.cloneNode(true));

    // Seleciona os novos botões clonados
    const newEditBtn = document.querySelector('#user-details-modal .mt-4 button:first-child');
    const newDeleteBtn = document.querySelector('#user-details-modal .mt-4 button:last-child');

    // Adiciona os eventos
    newEditBtn.addEventListener('click', function() {
        document.getElementById('user-details-modal').classList.add('hidden');
        editUser(userId);
    });

    newDeleteBtn.addEventListener('click', function() {
        document.getElementById('user-details-modal').classList.add('hidden');
        deleteUser(userId);
    });
}

// Fecha o modal de detalhes
document.getElementById('close-user-modal').addEventListener('click', function () {
    document.getElementById('user-details-modal').classList.add('hidden');
});

// Editar usuário
function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    document.getElementById('form-modal-title').textContent = 'Editar Usuário';
    document.getElementById('user-id').value = user.id;
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('password').value = user.password;
    document.getElementById('role').value = user.role;

    document.getElementById('user-form-modal').classList.remove('hidden');
    setupPasswordToggle(); // Configura o toggle de senha
}

// Salvar usuário (adicionar ou editar)
function saveUser() {
    const userId = document.getElementById('user-id').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    if (userId) {
        // Editar usuário existente
        const index = users.findIndex(u => u.id == userId);
        if (index !== -1) {
            users[index] = {
                ...users[index],
                name,
                email,
                password,
                role
            };
        }
    } else {
        // Adicionar novo usuário
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        users.push({
            id: newId,
            name,
            email,
            password,
            role,
            lastLogin: new Date().toISOString().split('T')[0]
        });
    }

    document.getElementById('user-form-modal').classList.add('hidden');
    renderUsersByRole();
}

// Excluir usuário
function deleteUser(userId) {
    if (confirm(`Tem certeza que deseja excluir este usuário?`)) {
        users = users.filter(u => u.id !== userId);
        renderUsersByRole();
    }
}

// Evento para fechar o modal de formulário ao clicar fora dele
document.getElementById('user-form-modal').addEventListener('click', function (e) {
    if (e.target === this) {
        this.classList.add('hidden');
    }
});

// Modifique a função editUser para incluir a configuração do toggle
function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    document.getElementById('form-modal-title').textContent = 'Editar Usuário';
    document.getElementById('user-id').value = user.id;
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('password').value = user.password;
    document.getElementById('role').value = user.role;

    // Resetar o campo de senha para o estado padrão
    document.getElementById('password').type = 'password';
    const icon = document.querySelector('#toggle-password i');
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
    
    setupPasswordToggle();
    document.getElementById('user-form-modal').classList.remove('hidden');
}

// Adicione também no evento de abrir o modal para adicionar novo usuário
document.getElementById('add-user-btn').addEventListener('click', function() {
    document.getElementById('form-modal-title').textContent = 'Adicionar Novo Usuário';
    document.getElementById('user-form').reset();
    document.getElementById('user-id').value = '';
    

    // Resetar o campo de senha
    document.getElementById('password').type = 'password';
    const icon = document.querySelector('#toggle-password i');
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
    
    setupPasswordToggle();
    document.getElementById('user-form-modal').classList.remove('hidden');
});

// Configuração do toggle de senha
function setupPasswordToggle() {
    const passwordInput = document.getElementById('password');
    const toggleButton = document.getElementById('toggle-password');
    const icon = toggleButton.querySelector('i');

    // Remove qualquer listener anterior para evitar duplicação
    toggleButton.replaceWith(toggleButton.cloneNode(true));
    const newToggleButton = document.getElementById('toggle-password');
    const newIcon = newToggleButton.querySelector('i');

    newToggleButton.addEventListener('click', function() {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        
        // Alterna os ícones corretamente
        newIcon.classList.toggle('fa-eye-slash');
        newIcon.classList.toggle('fa-eye');
    });
}

/**
 * Define o tema da aplicação (claro/escuro)
 * @param {string} theme - 'light' ou 'dark'
 */
function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark-mode');
        document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-moon"></i>';
    }
}

/**
 * Alterna entre temas claro e escuro
 */
function toggleTheme() {
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
}

// Evento do botão de alternar tema
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

// Sistema de Logout
document.getElementById('logout-btn').addEventListener('click', function () {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('user');
    window.location.href = "/public/admin/configADM.html";
});