var vertSource = 
    `precision mediump float;
     attribute vec2 vertPos;
     attribute vec3 vertColor;
     varying vec3  fragColor;
     void main() {
     gl_Position = vec4(vertPos, 0.0, 1.0);
     fragColor = vertColor;
     }`

var fragSource =
    `precision mediump float;
     varying vec3  fragColor;
     void main() {
     gl_FragColor = vec4(fragColor, 1.0);
     }`

var demo = function() {
    var canvas = document.getElementById('myCanvas'); 
    var gl = canvas.getContext('webgl');
    
    if (!gl) {
        alert("Your browser does not support WebGL");
    }

    gl.clearColor(0.1, 0.1, 0.2, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertSource);
    gl.compileShader(vertShader);

    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
        console.error("VERTEX SHADER COMPILATION ERROR", gl.getShaderInfoLog(vertShader));
        return;
    }

    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragSource);
    gl.compileShader(fragShader);

    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
        console.error("FRAGMENT SHADER COMPILATION ERROR", gl.getShaderInfoLog(fragShader));
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("PROGRAM LINKING ERROR", gl.getProgramInfoLog(program));
        return;
    }

    var verts = [
         0.5,  0.5,     1.0, 0.0, 0.0,
        -0.5,  0.5,     0.0, 1.0, 0.0,      
        -0.5, -0.5,     0.0, 0.0, 1.0,
         0.5, -0.5,     1.0, 1.0, 1.0
    ];

    var elems = [
        0, 1, 2,
        2, 3, 0
    ];

    var VBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    var loc = gl.getAttribLocation(program, 'vertPos');
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, gl.FALSE, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(loc);

    var loc = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(loc, 3, gl.FLOAT, gl.FALSE, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT );
    gl.enableVertexAttribArray(loc);

    var EBO = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(elems), gl.STATIC_DRAW);

    gl.useProgram(program);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
}

window.onload = demo;
