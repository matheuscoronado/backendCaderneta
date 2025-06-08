<?php
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    if (isset($_SESSION["tipo"])):
?>

<!DOCTYPE html>
    <html lang="pt-br">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lista de Usuários</title>
        <link rel="stylesheet" type='text/css' media='screen' href="css/list.css"> 
    </head>

    <body class="<?php $_SESSION['tipo'] ?>">
        <div class="container">
            <h2>Lista de Usuários</h2>
            <table class="styled-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Perfil</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>

                    <?php foreach ($users as $user): ?>
                        <tr>
                            <td><?= $user['id'] ?></td>
                            <td><?= $user['nome'] ?></td>
                            <td><?= $user['email'] ?></td>
                            <td><?= $user['tipo'] ?></td>
                            <td>
                                <!-- Permitir que administrador edite -->
                                <?php if ($_SESSION['tipo'] == 'administrador'): ?>
                                    <a href="index.php?action=edit&id=<?= $user['id'] ?>" class="btn">Editar</a>
                                <?php endif; ?>

                                <!-- Permitir que administrador exclua -->
                                <?php if ($_SESSION['tipo'] == 'administrador'): ?>
                                    <a href="index.php?action=delete&id=<?= $user['id'] ?>" class="btn btn-delete" onclick="return confirm('Tem certeza que deseja excluir?')">Excluir</a>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>

                </tbody>
            </table>

            <a href="index.php?action=dashboard" class="btn">Voltar ao Dashboard</a>
        </div>
    </body>

    </html>
<?php else: ?>
    echo "Acesso negado. Você não tem permissão para acessar esta página.";
<?php endif; ?>