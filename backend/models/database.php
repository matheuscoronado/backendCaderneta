<?php
    class Database{
        private static $instance = null;

        public static function getConnection(){
            if (!self::$instance) {
                $host = 'localhost';
                $db = 'cadernetadigital';
                $user = 'root';
                $password = '';
                $port = 3307;

                self::$instance = new PDO("mysql:host=$host;dbname=$db;port=$port", $user, $password);

                self::$instance->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            }
            return self::$instance;
        }
    }
?>