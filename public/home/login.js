document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    const basePath = '/backendCardeneta';

    try {
        const response = await fetch(`${basePath}/backend/views/login.php`, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `email=${encodeURIComponent(email)}&senha=${encodeURIComponent(password)}`
        });

        const data = await response.json();

        if (data.success) {
            // Guarda dados do usuário no localStorage
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redireciona conforme o tipo
            if (data.user.tipo === 'administrador') {
                window.location.href = `${basePath}/public/admin/admin.php`;
            } else if (data.user.tipo === 'professor') {
                window.location.href = `${basePath}/public/professor/profDoc.html`;
            } else {
                window.location.href = `${basePath}/public/aluno/alunoUso.html`;
            }
        } else {
            alert(data.message);
        }

    } catch (error) {
        alert('Erro ao tentar fazer login. Tente novamente mais tarde.');
        console.error(error);
    }
});
