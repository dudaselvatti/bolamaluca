Projeto Bola Maluca em WebGL2

Integrantes:
- Gabriel de Souza Costa
- Maria Eduarda Alves Selvatti

Este projeto implementa a animação "Bola Maluca" utilizando WebGL2 e Programação Orientada a Objetos (POO). A aplicação exibe um círculo colorido que se move, gira e quica nas bordas do canvas.

Como executar:
Basta descompactar a pasta e abrir o arquivo index.html em qualquer navegador. Não é necessário rodar um servidor local.

Estrutura e Arquitetura:

- index.html: Interface do projeto. Contém a tela (canvas) e os controles deslizantes (sliders) para alterar a velocidade do giro e o tamanho da bola.

- Common/: Pasta com as bibliotecas matemáticas do livro (initShaders.js e MVnew.js), usadas para calcular os movimentos.

- core/Renderer.js: Gerencia o WebGL. Fica responsável por compilar os shaders (os mini-programas da placa de vídeo) e limpar a tela a cada quadro da animação.

- core/App.js: É o motor do programa. Ele inicia tudo, liga os controles do HTML à bola e roda o loop infinito da animação.

- shapes/Shape.js: Classe mãe. Esconde a parte difícil do WebGL, criando os buffers de posição e cor, além de aplicar a matemática de translação, escala e rotação para desenhar a forma na tela.

- shapes/BolaMaluca.js: Classe que herda de Shape. Cria a geometria redonda do círculo, aplica as cores de cada vértice e calcula a lógica para a bola bater e voltar quando encosta nas bordas da tela.