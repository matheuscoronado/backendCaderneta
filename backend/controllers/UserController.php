<?php
require_once 'models/user.php';

class UserController {
    public function getAll() {
        try {
            $users = User::all();
            $this->sendResponse(200, ['success' => true, 'users' => $users]);
        } catch (Exception $e) {
            $this->sendResponse(500, ['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function create() {
        try {
            $data = [
                'nome' => $_POST['nome'],
                'email' => $_POST['email'],
                'senha_hash' => password_hash($_POST['senha_hash'], PASSWORD_DEFAULT),
                'tipo' => $_POST['tipo']
            ];

            $result = User::create($data);
            $this->sendResponse(201, ['success' => true, 'message' => 'Usuário criado com sucesso']);
        } catch (Exception $e) {
            $this->sendResponse(500, ['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function update() {
        try {
            $data = [
                'id' => $_POST['id'],
                'nome' => $_POST['nome'],
                'email' => $_POST['email'],
                'tipo' => $_POST['tipo']
            ];

            // Atualiza senha apenas se for fornecida
            if (!empty($_POST['senha_hash'])) {
                $data['senha_hash'] = password_hash($_POST['senha_hash'], PASSWORD_DEFAULT);
            }

            User::update($data['id'], $data);
            $this->sendResponse(200, ['success' => true, 'message' => 'Usuário atualizado com sucesso']);
        } catch (Exception $e) {
            $this->sendResponse(500, ['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function delete() {
        try {
            $id = $_GET['id'];
            // Verifique se o usuário tem permissão para excluir
            User::delete($id);
            $this->sendResponse(200, ['success' => true, 'message' => 'Usuário excluído com sucesso']);
        } catch (Exception $e) {
            $this->sendResponse(500, ['success' => false, 'message' => $e->getMessage()]);
        }
    }

    private function sendResponse($statusCode, $data) {
        header('Content-Type: application/json');
        http_response_code($statusCode);
        echo json_encode($data);
        exit;
    }
}

