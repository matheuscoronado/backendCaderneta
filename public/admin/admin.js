document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('user-form');
    const modal = document.getElementById('user-form-modal');
    const closeBtn = document.getElementById('close-form-modal');
    const cancelBtn = document.getElementById('cancel-form');
    const addUserBtn = document.getElementById('add-user-btn');
    const usersByRole = document.getElementById('users-by-role');

    // Abrir o modal
    addUserBtn.addEventListener('click', () => {
        userForm.reset();
        modal.classList.remove('hidden');
    });

    // Fechar modal
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    cancelBtn.addEventListener('click', () => modal.classList.add('hidden'));

    // Carregar usuários ao iniciar
    carregarUsuarios();

    // Enviar formulário via AJAX
    userForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(userForm);

        fetch('salvar_usuario.php', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Usuário salvo com sucesso!');
                    modal.classList.add('hidden');
                    carregarUsuarios();
                } else {
                    alert('Erro: ' + data.message);
                }
            })
            .catch(err => {
                alert('Erro na requisição: ' + err);
            });
    });

    function carregarUsuarios() {
        fetch('listar_usuarios.php')
            .then(res => res.json())
            .then(data => {
                usersByRole.innerHTML = '';

                const grupos = {};

                data.forEach(usuario => {
                    if (!grupos[usuario.funcao]) {
                        grupos[usuario.funcao] = [];
                    }
                    grupos[usuario.funcao].push(usuario);
                });

                for (const funcao in grupos) {
                    const grupo = document.createElement('div');
                    grupo.className = 'mb-4';
                    grupo.innerHTML = `<h3 class="font-semibold text-gray-700 mb-2 capitalize">${funcao}</h3>`;

                    grupos[funcao].forEach(usuario => {
                        const div = document.createElement('div');
                        div.className = 'bg-gray-100 p-2 rounded mb-1 text-sm';
                        div.textContent = `${usuario.nome} (${usuario.email})`;
                        grupo.appendChild(div);
                    });

                    usersByRole.appendChild(grupo);
                }
            })
            .catch(err => {
                usersByRole.innerHTML = '<p class="text-red-500">Erro ao carregar usuários.</p>';
                console.error(err);
            });
    }
});
