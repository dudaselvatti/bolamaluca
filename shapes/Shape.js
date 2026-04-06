class Shape {
    constructor(gl, positionLoc, colorLoc, vertices, cores) {
        this.gl = gl;
        this.numVertices = vertices.length;

        this.x = 0.0;
        this.y = 0.0;
        this.angulo = 0.0;
        this.escalaX = 1.0;
        this.escalaY = 1.0;

        this.vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(this.vao);

        var positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, flatten(vertices), this.gl.STATIC_DRAW);
        this.gl.enableVertexAttribArray(positionLoc);
        this.gl.vertexAttribPointer(positionLoc, 2, this.gl.FLOAT, false, 0, 0);

        var colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, flatten(cores), this.gl.STATIC_DRAW);
        this.gl.enableVertexAttribArray(colorLoc);
        this.gl.vertexAttribPointer(colorLoc, 4, this.gl.FLOAT, false, 0, 0);

        this.gl.bindVertexArray(null);
    }

    draw(matrixLoc) {
        
        var mTrans = translate(this.x, this.y, 0.0);
        var mRot = rotateZ(this.angulo);
        var mScale = mat4(
            vec4(this.escalaX, 0, 0, 0),
            vec4(0, this.escalaY, 0, 0),
            vec4(0, 0, 1, 0),
            vec4(0, 0, 0, 1)
        );

        var modelView = mult(mTrans, mult(mScale, mRot));

        this.gl.uniformMatrix4fv(matrixLoc, false, flatten(modelView));

        this.gl.bindVertexArray(this.vao);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.numVertices);
    }
}