<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Gerador de Hash de Senha</title>
</head>
<body>
    <h2>Gerar Hash da Senha</h2>
    <form method="post">
        <label for="senha">Digite a senha:</label>
        <input type="text" name="senha" id="senha" required>
        <button type="submit">Gerar Hash</button>
    </form>

    <?php
    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $senha = $_POST["senha"];
        $hash = password_hash($senha, PASSWORD_DEFAULT);
        echo "<p><strong>Hash gerado:</strong><br><code>$hash</code></p>";
    }
    ?>
</body>
</html>
