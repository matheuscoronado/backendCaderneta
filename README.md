# MedNotes

O **MedNotes** é uma caderneta digital desenvolvida em parceria com o **SENAC**, voltada especialmente aos estudantes do curso de Enfermagem. Seu principal objetivo é oferecer uma plataforma intuitiva para que os alunos registrem anotações durante as aulas e possam acessá-las durante os estágios, com o apoio de Inteligência Artificial (IA) para enriquecer o conteúdo e facilitar o aprendizado. Os professores, por sua vez, têm acesso às anotações dos alunos, incluindo aquelas enriquecidas com informações da IA. Isso permite um acompanhamento eficiente e uma análise criteriosa da qualidade do conteúdo, contribuindo para a formação de profissionais de saúde mais bem preparados.

---

## Objetivo

A principal proposta foi criar uma solução digital que centralize o processo de anotações acadêmicas, transformando práticas tradicionais de registros em papel ou arquivos desorganizados em uma aplicação funcional, fácil de usar e que integre recursos de inteligência artificial. O projeto visa facilitar o registro e a organização de anotações pelos alunos, integrar recursos de IA para fornecer sugestões e informações adicionais relevantes, permitir que os professores acompanhem as anotações dos alunos garantindo a qualidade e veracidade das informações, e oferecer uma interface amigável e responsiva, acessível em diversos dispositivos.

---

## Tecnologias Utilizadas

- **HTML5**: Estruturação semântica das páginas e formulários da aplicação
- **CSS3**: Estilização avançada com suporte a modo claro/escuro, responsividade e animações
- **JavaScript ES6+**: Lógica de frontend, manipulação do DOM, gerenciamento de estado e integração com APIs
- **PHP 8.0+**: Backend para processamento de dados, autenticação e comunicação com banco de dados
- **MySQL 8.0+**: Sistema de gerenciamento de banco de dados relacional para armazenamento persistente
- **OpenAI API**: Integração com GPT-3.5/GPT-4 para análise e enriquecimento de conteúdo
- **LocalStorage**: Armazenamento local no navegador para preferências do usuário e cache temporário
- **GitHub**: Controle de versão e colaboração em equipe
- **VS Code**: Ambiente de desenvolvimento integrado

---

## Estrutura das Pastas

---

## Funcionalidades Principais

### Sistema de Autenticação e Autorização

O sistema implementa um robusto mecanismo de login com três níveis de acesso distintos. A autenticação é realizada através de e-mail e senha, com validação tanto no frontend quanto no backend. As credenciais são verificadas contra o banco de dados MySQL, onde as senhas são armazenadas com hash seguro. O sistema mantém sessões ativas através de tokens seguros e oferece funcionalidade de logout que limpa todas as informações de sessão.

VÍDEO PARA DEMONSTRAÇÃO

**Credenciais de Acesso:**
- **Aluno**: aluno@exemplo.com / senha123
- **Professor**: professor@exemplo.com / senha123
- **Administrador**: admin@exemplo.com / admin123

### Caderneta Digital Inteligente

A funcionalidade principal permite aos alunos criar, editar e organizar anotações de forma intuitiva. Cada anotação possui título, conteúdo detalhado, data de criação e modificação, além de categorias personalizáveis. O sistema oferece busca avançada por palavras-chave e organização cronológica automática. As anotações são sincronizadas em tempo real com o banco de dados, garantindo que não haja perda de informações.

VÍDEO PARA DEMONSTRAÇÃO

### Integração Avançada com Inteligência Artificial

O MedNotes integra-se com a API da OpenAI para oferecer análise automática e enriquecimento de conteúdo. Quando um aluno cria uma anotação, a IA analisa o contexto médico e de enfermagem, fornecendo sugestões complementares, esclarecimentos técnicos, referências bibliográficas relevantes e insights didáticos. O sistema também identifica possíveis inconsistências ou informações que necessitam de verificação adicional, alertando tanto alunos quanto professores.

VÍDEO PARA DEMONSTRAÇÃO

### Painel do Professor

Professores têm acesso a um dashboard completo onde podem visualizar todas as anotações de seus alunos, incluindo as sugestões geradas pela IA. O sistema oferece ferramentas de análise que permite fornecer feedback personalizado. Os professores podem também criar anotações compartilhadas e material de referência que ficam disponíveis para todos os alunos da turma.

VIDEO PARA DEMONSTRAÇÃO

### Sistema Administrativo

Administradores possuem controle total sobre o sistema, incluindo gerenciamento completo de usuários com capacidade de criar, editar e excluir contas, estatísticas de uso e engajamento, configuração de parâmetros da IA e suas integrações, backup e recuperação de dados, e monitoramento de performance do sistema.

VIDEO PARA DEMONSTRAÇÃO

### Interface Adaptável com Modo Claro/Escuro

O sistema implementa alternância completa entre modo claro e escuro, mantendo consistência visual e usabilidade em ambos os temas. A preferência do usuário é salva automaticamente no localStorage, garantindo que a escolha seja lembrada em sessões futuras. O modo escuro foi especialmente otimizado para reduzir fadiga ocular durante uso prolongado, melhorando a acessibilidade para usuários com sensibilidade à luz ou necessidades específicas de visualização.

VIDEO PARA DEMONSTRAÇÃO

### Sistema de Notificações e Lembretes

Implementação de notificações inteligentes que alertam alunos sobre atualizações importantes, sugestões da IA que requerem atenção, feedbacks de professores e lembretes para revisão de conteúdo.

### Backup e Sincronização

Sistema automatizado de backup que garante que todas as anotações sejam preservadas e possam ser recuperadas em caso de problemas técnicos. Sincronização em tempo real entre diferentes dispositivos, permitindo que alunos acessem suas anotações de qualquer lugar. Exportação de anotações em diversos formatos (PDF, Word, texto simples) para uso offline ou impressão.

---

## Casos de Uso Detalhados

### Para Estudantes de Enfermagem

Durante as aulas teóricas, os alunos podem registrar rapidamente conceitos importantes, procedimentos clínicos e observações do professor. A IA automaticamente enriquece essas anotações com informações complementares sobre anatomia, farmacologia ou protocolos de cuidado. Durante estágios práticos, os alunos acessam suas anotações organizadas por tema, com sugestões da IA sobre melhores práticas e cuidados específicos para cada situação clínica encontrada.

### Para Professores e Orientadores

Professores podem acompanhar o progresso de aprendizagem de cada aluno através das anotações registradas, identificando lacunas de conhecimento ou conceitos mal compreendidos. O sistema permite fornecer feedback direcionado e personalizado, além de criar material de apoio baseado nas dúvidas mais comuns identificadas nas anotações dos alunos.

### Para Administradores Acadêmicos

Gestores educacionais podem analisar dados agregados sobre efetividade do ensino, identificar disciplinas ou tópicos que apresentam maior dificuldade para os alunos, e otimizar curriculos baseados em dados reais de aprendizagem. O sistema também oferece métricas sobre engajamento dos alunos e efetividade dos recursos de IA implementados.

---

## Segurança e Privacidade

APRESENTAR FUNCIONALIDADES IMPORTANTES

---

## Arquitetura do Sistema

### Frontend
Interface responsiva desenvolvida com HTML5 semântico, CSS3 moderno com variáveis customizáveis para temas, e JavaScript modular com padrões de desenvolvimento limpo.

### Backend
API RESTful desenvolvida em PHP com arquitetura MVC, implementando padrões de segurança como validação de entrada, sanitização de dados e prevenção contra ataques comuns (SQL Injection, XSS, CSRF). Sistema de roteamento limpo e middleware para autenticação e autorização.

### Banco de Dados
Esquema relacional otimizado com tabelas para usuários, anotações, sessões e configurações. Implementação de índices apropriados para performance em consultas complexas e backup automatizado com retenção configurável.

### Integração Externa
Comunicação segura com API da OpenAI através de endpoints protegidos. Sistema de fallback para casos de indisponibilidade da API externa.

---

## 📱 Responsividade e Acessibilidade

O MedNotes foi desenvolvido seguindo princípios de design responsivo, garantindo experiência otimizada em dispositivos móveis, tablets e desktops. A interface adapta-se automaticamente a diferentes tamanhos de tela, mantendo usabilidade e funcionalidade completas.

---

## Processo de Desenvolvimento e Versionamento

Utilização do Git para controle de versão com estratégia de branching organizada, incluindo branches principais para produção e desenvolvimento, feature branches para novas funcionalidades, e processo de code review antes de merges. Implementação de testes automatizados para garantir qualidade e estabilidade do código. Deploy automatizado com ambientes separados para desenvolvimento, teste e produção.

---

## Roadmap e Futuras Implementações

### Fase 1 - Melhorias Visuais e UX
Redesign completo da interface com foco em experiência do usuário, implementação de animações e micro-interações, otimização para dispositivos móveis, e personalização avançada de temas e layouts.

### Fase 2 - Integrações Avançadas
Integração com sistemas acadêmicos existentes, API para aplicativos móveis nativos, conectividade com dispositivos wearables para coleta de dados em tempo real durante estágios, e integração com bibliotecas médicas digitais.

### Fase 3 - Inteligência Artificial Avançada
Implementação de modelos de IA especializados em conteúdo médico, sistema de recomendação personalizado baseado em padrões de aprendizagem, análise preditiva para identificação precoce de dificuldades de aprendizagem, e geração automática de questionários e exercícios baseados nas anotações.

### Fase 4 - Recursos Colaborativos Expandidos
Salas virtuais para estudo em grupo, sistema de mentoria peer-to-peer, gamificação com conquistas e progressão, e marketplace de conteúdo onde professores podem compartilhar material premium.

---

##  Considerações Importantes

Este projeto representa atualmente um **protótipo de baixa fidelidade** em sua fase inicial. O foco principal está em demonstrar a proposta funcional da aplicação, priorizando estrutura sólida e fluxo de navegação intuitivo. Todos os dados utilizados são estritamente fictícios e simulados, não se baseando em informações reais ou sensíveis. Não há conteúdo restrito, confidencial ou ofensivo que possa comprometer privacidade, integridade ou reputação de indivíduos ou organizações.

O sistema atual utiliza armazenamento local (localStorage) para algumas funcionalidades, o que significa que certos dados podem ser perdidos ao limpar o cache do navegador. Em versões futuras, toda persistência será migrada para o banco de dados MySQL para garantir durabilidade e sincronização completa entre dispositivos.

---

## Como Executar o Projeto

### Pré-requisitos
- Servidor web com suporte a PHP 8.0 ou superior (Apache/Nginx)
- MySQL 8.0 ou superior
- Navegador web moderno com suporte a JavaScript ES6+
- Conta ativa na OpenAI com API key válida
- Git para controle de versão

### Configuração do Ambiente
1. Clone o repositório do projeto em seu servidor local ou de produção
2. Configure o banco de dados MySQL criando um novo schema e importando o arquivo de estrutura fornecido
3. Configure as credenciais de banco de dados no arquivo de configuração PHP
4. Obtenha uma API key da OpenAI e configure-a no sistema
5. Configure as permissões adequadas para as pastas de upload e cache
6. Acesse a aplicação através do navegador e realize o primeiro login com as credenciais padrão

### Configuração de Produção
Para ambiente de produção, certifique-se de alterar todas as credenciais padrão, configurar HTTPS com certificado SSL válido, implementar backup automatizado do banco de dados, configurar monitoramento de logs e performance, e estabelecer rotinas de manutenção e atualizações de segurança.

---

## Contribuições e Suporte

APRESENTAR DADOS

---

## Licença e Autoria

Este projeto foi desenvolvido em parceria com o **SENAC** como parte de um programa de inovação educacional na área de saúde. O desenvolvimento técnico foi realizado seguindo melhores práticas de engenharia de software e design centrado no usuário. O projeto está licenciado sob licença MIT, permitindo uso, modificação e distribuição livre, desde que mantidas as atribuições originais de autoria.

A parceria com o SENAC garante que o projeto atenda às necessidades reais dos estudantes de enfermagem e esteja alinhado com as melhores práticas pedagógicas da área de saúde. O feedback contínuo de professores e alunos é fundamental para o aprimoramento constante da plataforma.

---

## Impacto Educacional Esperado

O MedNotes representa uma evolução significativa na forma como estudantes de enfermagem organizam e acessam informações durante sua formação. A integração de inteligência artificial não substitui o conhecimento e experiência dos professores, mas sim complementa o processo de aprendizagem, oferecendo recursos adicionais que enriquecem a experiência educacional.

A plataforma promove maior engajamento dos alunos com o conteúdo, facilita a identificação precoce de dificuldades de aprendizagem, melhora a qualidade das anotações através de sugestões inteligentes, e cria um ambiente colaborativo que fortalece a comunidade acadêmica. Professores se beneficiam de insights valiosos sobre o progresso de seus alunos, permitindo intervenções pedagógicas mais precisas e efetivas.

Este projeto pioneiro na integração de IA na educação em enfermagem estabelece precedentes para futuras inovações educacionais, demonstrando como a tecnologia pode ser aplicada de forma ética e eficaz para melhorar resultados de aprendizagem na área de saúde.
