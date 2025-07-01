<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastrar-se</title>
    <link rel="stylesheet" href="css/register.css">
</head>

<body class="register-body">
    <div class="register-container">
        <h2>Cadastro de Usuário</h2>
        <form method="post" action="index.php?action=register" class="register-form">
            <label for="nome">Nome:</label>
            <input type="text" name="nome" id="nome" required>

            <label for="email">Email:</label>
            <input type="email" name="email" id="email" required>

            <label for="senha_hash">Senha:</label>
            <input type="password" name="senha_hash" id="senha_hash" required>

            <label for="tipo">Perfil:</label>
            <select name="tipo" id="tipo">
                <option value="administrador">Administrador</option>
                <option value="professor">Professor</option>
                <option value="aluno">Aluno</option>
            </select>

            <button type="submit" class="btn">Cadastrar</button>
        </form>
        <a href="index.php?action=login" class="back-link">Voltar ao Login</a>
    </div>
</body>

</html>