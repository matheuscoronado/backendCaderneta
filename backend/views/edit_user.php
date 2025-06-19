<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Usuário</title>
    <link rel="stylesheet" href="css/edit.css">
</head>

<body class="edit-body">
    <div class="edit-container">
        <h2>Editar Usuário</h2>
        <form method="post" action="index.php?action=edit&id=<?= $user['id']?>" class="edit-form">
            <label for="nome">Nome:</label>
            <input type="text" name="nome" id="nome" value="<?= $user['nome']?>" required>

            <label for="email">Email:</label>
            <input type="email" name="email" id="email" value="<?= $user['email']?>" required>

            <label for="password">Senha:</label>
            <input type="password" name="senha_hash" id="senha_hash" value="<?= $user['senha_hash']?>" required>

            <label for="tipo">Perfil:</label>
            <select name="tipo" id="tipo">
                <option value="administrador" <?= $user['tipo'] == 'administrador' ? 'selected' : '' ?>>Administrador</option>
                <option value="professor" <?= $user['tipo'] == 'professor' ? 'selected' : '' ?>>Professor</option>
                <option value="aluno" <?= $user['tipo'] == 'aluno' ? 'selected' : '' ?>>Aluno</option>
            </select>

            <button type="submit" class="btn">Salvar</button>
        </form>
        <a href="index.php?action=list" class="back-link">Voltar para Lista de Usuários</a>
    </div>
</body>

</html>
