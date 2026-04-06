class BolaMaluca extends Shape {
    constructor(gl, positionLoc, colorLoc) {

        var dados = BolaMaluca.gerarDadosCilindro(0.15, 5);
        
        super(gl, positionLoc, colorLoc, dados.vertices, dados.cores);

        this.raioBase = 0.15;
        this.velocidadeAngular = 2.0;

        let anguloInicial = Math.random() * 2 * Math.PI;
        let velocidadeNorma = 0.01 + Math.random() * 0.015; 
        this.vx = velocidadeNorma * Math.cos(anguloInicial);
        this.vy = velocidadeNorma * Math.sin(anguloInicial);
    }

    atualizar() {

        this.angulo += this.velocidadeAngular;

        this.x += this.vx;
        this.y += this.vy;

        let raioX = this.raioBase * this.escalaX;
        let raioY = this.raioBase * this.escalaY;

        if (this.x + raioX > 1.0) {
            this.x = 1.0 - raioX;
            this.vx *= -1;
        } else if (this.x - raioX < -1.0) {
            this.x = -1.0 + raioX;
            this.vx *= -1;
        }

        if (this.y + raioY > 1.0) {
            this.y = 1.0 - raioY;
            this.vy *= -1;
        } else if (this.y - raioY < -1.0) {
            this.y = -1.0 + raioY;
            this.vy *= -1;
        }
    }

    static gerarDadosCilindro(raio, iteracoes) {
        let baseVertices = [
            vec2(raio, 0),
            vec2(0, raio),
            vec2(-raio, 0),
            vec2(0, -raio)
        ];

        for (let i = 0; i < iteracoes; i++) {
            let novo = [];
            let numV = baseVertices.length;
            for (let j = 0; j < numV; j++) {
                novo.push(baseVertices[j]);
                let k = (j + 1) % numV;
                let medio = mix(baseVertices[j], baseVertices[k], 0.5);
                let fator = raio / length(medio);
                medio = mult(fator, medio);
                novo.push(medio);
            }
            baseVertices = novo;
        }

        let vertices = [];
        let cores = [];
        let centro = vec2(0.0, 0.0);
        let numFinal = baseVertices.length;

        for (let i = 0; i < numFinal; i++) {
            let k = (i + 1) % numFinal;
            
            vertices.push(centro);
            vertices.push(baseVertices[i]);
            vertices.push(baseVertices[k]);

            cores.push(vec4(1.0, 1.0, 1.0, 1.0));

            cores.push(vec4(Math.abs(Math.cos(i)), Math.abs(Math.sin(i)), 0.5, 1.0));
            cores.push(vec4(Math.abs(Math.cos(k)), Math.abs(Math.sin(k)), 0.5, 1.0));
        }

        return { vertices: vertices, cores: cores };
    }
}