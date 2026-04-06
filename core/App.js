class App {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.gl = this.canvas.getContext("webgl2");
        
        if(!this.gl) {
            alert("Não consegui abrir o contexto WebGL2");
            return;
        }

        this.renderer = new Renderer(this.gl);

        this.bola = new BolaMaluca(
            this.gl, 
            this.renderer.positionLoc, 
            this.renderer.colorLoc
        );

        this.mapearControles();

        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    mapearControles() {
        document.getElementById("sliderRotacao").oninput = (event) => {
            this.bola.velocidadeAngular = parseFloat(event.target.value);
        };
        document.getElementById("sliderScaleX").oninput = (event) => {
            this.bola.escalaX = parseFloat(event.target.value);
        };
        document.getElementById("sliderScaleY").oninput = (event) => {
            this.bola.escalaY = parseFloat(event.target.value);
        };
    }

    loop() {
        this.renderer.prepareScene(this.canvas.width, this.canvas.height);

        this.bola.atualizar();
        this.bola.draw(this.renderer.matrixLoc);

        requestAnimationFrame(this.loop);
    }
}

window.onload = () => {
    new App("canvas");
};