<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Anotações de <?= htmlspecialchars($aluno['nome']) ?></title>
    <link rel="stylesheet" href="">
</head>
<body>
    <div class="container">
        <h2>Anotações de <?= htmlspecialchars($aluno['nome']) ?></h2>

        <?php if (count($atividade) > 0): ?>
            <ul>
                <?php foreach ($atividade as $item): ?>
                    <li>
                        <strong>Data:</strong> <?= date('d/m/Y H:i', strtotime($item['data_registro'])) ?><br>
                        <strong>Atividade ID:</strong> <?= $item['id'] ?><br>
                        <strong>titulo:</strong> <?= $item['titulo'] ?><br>
                        <strong>subtitulo:</strong> <?= $item['subtitulo'] ?><br>
                        <strong>Conteúdo:</strong><br>
                        <div style="margin-left: 20px;">
                            <?= nl2br(htmlspecialchars($item['descricao'])) ?>
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
