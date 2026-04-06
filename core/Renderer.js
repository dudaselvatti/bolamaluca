class Renderer {
    constructor(gl) {
        this.gl = gl;

        var vertexShaderSrc = `#version 300 es
        in vec2 aPosition;
        in vec4 aColor;
        
        uniform mat4 uMatrix;
        
        out vec4 vColor;

        void main() {
            gl_Position = uMatrix * vec4(aPosition, 0.0, 1.0);
            vColor = aColor; // Passa para o fragment shader
        }`;

        var fragmentShaderSrc = `#version 300 es
        precision highp float;
        
        in vec4 vColor;
        out vec4 fColor;

        void main() {
            fColor = vColor;
        }`;

        this.program = this.makeProgram(vertexShaderSrc, fragmentShaderSrc);
        
        if (this.program) console.log("Criação de shaders ok!!");

        this.positionLoc = this.gl.getAttribLocation(this.program, "aPosition");
        this.colorLoc = this.gl.getAttribLocation(this.program, "aColor");
        this.matrixLoc = this.gl.getUniformLocation(this.program, "uMatrix");
    }

    compile(type, source) {
        var shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        var deuCerto = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
        
        if(deuCerto) return shader;
        
        console.log(this.gl.getShaderInfoLog(shader));
        this.gl.deleteShader(shader);
        return null;
    }

    makeProgram(vsSource, fsSource) {
        var vertexShader = this.compile(this.gl.VERTEX_SHADER, vsSource);
        var fragmentShader = this.compile(this.gl.FRAGMENT_SHADER, fsSource);

        if(!vertexShader || !fragmentShader) {
            alert("ERRO na compilação");
            return null;
        }

        var program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);

        var deuCerto = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
        if(deuCerto) return program;

        console.log(this.gl.getProgramInfoLog(program));
        this.gl.deleteProgram(program);
        alert("ERRO na link-edição");
        return null;
    }

    prepareScene(width, height) {
        this.gl.viewport(0, 0, width, height);
        this.gl.clearColor(0.95, 0.95, 0.95, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.useProgram(this.program);
    }
}