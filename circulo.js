// Baseado nos exemplos do livro Interactive Computer Graphics: a Top-Down approach with WebGL
"use strict";

var canvas;
var gl;
var program;
var circle; 
var lastTime = 0;

class Circle {
    constructor(gl, program) {
        this.gl = gl;
        this.program = program;
        
        // Atributos de animação
        this.x = 0.0;
        this.y = 0.0;
        
        // Velocidade inicial (direção e norma aleatórias)
        let speed = 0.5 + Math.random() * 0.5; // unidades per sec (NDC)
        let angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        
        this.theta = 0.0; // ângulo em radianos
        this.omega = 90.0; // velocidade angular graus/s
        
        this.scaleX = 1.0;
        this.scaleY = 1.0;
        this.radius = 0.25;
        
        // Montando Geometria e Cores
        this.bufferCores = [];
        this.vertices = this.aproximeCirculo(vec2(0.0, 0.0), this.radius, 4, this.bufferCores);
        this.numVertices = this.vertices.length;

        this.bufferId = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferId);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, flatten(this.vertices), this.gl.STATIC_DRAW);

        this.bufferCoresId = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferCoresId);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, flatten(this.bufferCores), this.gl.STATIC_DRAW);
        
        this.uMatrix = this.gl.getUniformLocation(this.program, "uMatrix");
        // Precisamos mockar uTheta com zero, pois faremos as operações na uMatrix
        this.uTheta = this.gl.getUniformLocation(this.program, "uTheta");
    }

    aproximeCirculo(centro, raio, iteracoes, bufferCores){
        var vertices = [
            vec2(raio, 0),
            vec2(0, raio),
            vec2(-raio, 0),
            vec2(0, -raio)
        ];

        for(var i = 0; i < iteracoes; i++){
            var novo = [];
            var numVertices = vertices.length;

            for(var j = 0; j < numVertices; j++){
                novo.push(vertices[j]);
                var k = (j + 1) % numVertices;
                var medio = mix(vertices[j], vertices[k], 0.5);
                var fator = raio / length(medio);
                medio = mult(fator, medio);
                novo.push(medio);
            }
            vertices = novo;
        }

        var buffer = [];
        var numVertices = vertices.length;
        
        // Construindo buffers com cores interpoladas radialmente
        for(var i = 0; i < numVertices; i++){
            var k = (i + 1) % numVertices;
            
            // Ponto central
            buffer.push(centro);
            bufferCores.push(vec4(1.0, 1.0, 1.0, 1.0)); 
            
            // Vértice I (Borda)
            let freq = 1.0;
            let a_i = (i / numVertices) * Math.PI * 2 * freq;
            buffer.push(vertices[i]);
            bufferCores.push(vec4(
                Math.sin(a_i) * 0.5 + 0.5,
                Math.cos(a_i) * 0.5 + 0.5,
                Math.sin(a_i + Math.PI/2) * 0.5 + 0.5,
                1.0
            ));
            
            // Vértice K (Próximo na borda)
            let a_k = ((i + 1) / numVertices) * Math.PI * 2 * freq;
            buffer.push(vertices[k]);
            bufferCores.push(vec4(
                Math.sin(a_k) * 0.5 + 0.5,
                Math.cos(a_k) * 0.5 + 0.5,
                Math.sin(a_k + Math.PI/2) * 0.5 + 0.5,
                1.0
            ));
        }
        return buffer;
    }

    update(deltaTime) {
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        
        this.theta += (this.omega * Math.PI / 180) * deltaTime;
        
        // Extremos do Bounding Box da Elipse Rotacionada
        let extremidadeX = this.radius * Math.sqrt(
            Math.pow(this.scaleX * Math.cos(this.theta), 2) + 
            Math.pow(this.scaleY * Math.sin(this.theta), 2)
        );
        let extremidadeY = this.radius * Math.sqrt(
            Math.pow(this.scaleX * Math.sin(this.theta), 2) + 
            Math.pow(this.scaleY * Math.cos(this.theta), 2)
        );

        // Verifica colisões laterais (rebatimento refletindo a velocidade)
        if (this.x + extremidadeX > 1.0) {
            this.x = 1.0 - extremidadeX;
            this.vx *= -1;
        } else if (this.x - extremidadeX < -1.0) {
            this.x = -1.0 + extremidadeX;
            this.vx *= -1;
        }

        // Verifica colisões em topo/fundo
        if (this.y + extremidadeY > 1.0) {
            this.y = 1.0 - extremidadeY;
            this.vy *= -1;
        } else if (this.y - extremidadeY < -1.0) {
            this.y = -1.0 + extremidadeY;
            this.vy *= -1;
        }
    }

    draw() {
        let mTranslate = translate(this.x, this.y, 0.0);
        let mRotate = rotateZ(this.theta * 180 / Math.PI);
        let mScale = scale(this.scaleX, this.scaleY, 1.0); 

        // Ordem: (Translate * (Rotate * Scale)) -> aplica Scale, depois Rotate, dps Translate
        let matrix = mult(mTranslate, mult(mRotate, mScale));
        
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferId);
        var aPosition = this.gl.getAttribLocation(this.program, "aPosition");
        this.gl.vertexAttribPointer(aPosition, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(aPosition);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferCoresId);
        var aColor = this.gl.getAttribLocation(this.program, "aColor");
        this.gl.vertexAttribPointer(aColor, 4, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(aColor);

        // Envias as matrizes compostas e ignora cálculo individual de rotação local uTheta
        this.gl.uniformMatrix4fv(this.uMatrix, false, flatten(matrix));
        this.gl.uniform1f(this.uTheta, 0.0);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.numVertices);
    }
}

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext("webgl2");
    if (!gl) alert("WebGL 2.0 isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    circle = new Circle(gl, program);

    document.getElementById("slider_omega").oninput = function(event) {
        circle.omega = parseFloat(event.target.value);
    };

    document.getElementById("slider_scaleX").oninput = function(event) {
        circle.scaleX = parseFloat(event.target.value);
    };

    document.getElementById("slider_scaleY").oninput = function(event) {
        circle.scaleY = parseFloat(event.target.value);
    };

    lastTime = performance.now();
    requestAnimationFrame(renderLoop);
}

function renderLoop(now) {
    let deltaTime = (now - lastTime) / 1000.0;
    lastTime = now;

    if (deltaTime > 0.1) deltaTime = 0.1; // fallback para lags

    gl.clear(gl.COLOR_BUFFER_BIT);
    
    circle.update(deltaTime);
    circle.draw();

    requestAnimationFrame(renderLoop);
}