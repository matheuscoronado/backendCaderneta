<?php
class Database {
    private static $instance = null;

    public static function getConnection() {
        if (!self::$instance) {
            // Atualize aqui para os dados do seu banco remoto
            $host = 'auth-db1664.hstgr.io';  // seu host remoto
            $port = '3306';                   // padrão MySQL (3307 é local, 3306 é padrão)
            $db = 'u748262474_trilhatech';   // seu banco
            $user = 'u748262474_Trilhatech_adm'; // seu usuário
            $password = 'Admin@#$trilh4';    // sua senha

            self::$instance = new PDO("mysql:host=$host;port=$port;dbname=$db;charset=utf8", $user, $password);
            self::$instance->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }
        return self::$instance;
    }
}
?>
