<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Anotações de <?= htmlspecialchars($aluno['nome']) ?></title>
    <link rel="stylesheet" href="css/estilos.css">
</head>
<body>
    <div class="container">
        <h2>Anotações de <?= htmlspecialchars($aluno['nome']) ?></h2>

        <?php if (count($cadernetas) > 0): ?>
            <ul>
                <?php foreach ($cadernetas as $item): ?>
                    <li>
                        <strong>Data:</strong> <?= date('d/m/Y H:i', strtotime($item['data_registro'])) ?><br>
                        <strong>Atividade ID:</strong> <?= $item['atividade_id'] ?><br>
                        <strong>Conteúdo:</strong><br>
                        <div style="margin-left: 20px;">
                            <?= nl2br(htmlspecialchars($item['conteudo'])) ?>
                        </div>
                        <hr>
                    </li>
                <?php endforeach; ?>
            </ul>
        <?php else: ?>
            <p>Este aluno ainda não registrou nenhuma anotação.</p>
        <?php endif; ?>

        <a href="index.php?action=dashboard" class="btn">Voltar</a>
    </div>
</body>
</html>
