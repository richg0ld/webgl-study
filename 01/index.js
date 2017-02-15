"use strict";

var canvas = document.getElementById("c");
var gl = canvas.getContext("webgl");

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

function main() {
    // Get A WebGL context
    var canvas = document.getElementById("c");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    // GLSL언어로 되어있는 쉐이더 코드 텍스트들을 가져온다.
    var vertexShaderSource = document.getElementById("2d-vertex-shader").text;
    var fragmentShaderSource = document.getElementById("2d-fragment-shader").text;

    // GLSL 세이더를 만들고, GLSL 소스를 올리고, 세이더를 컴파일 한다.
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // 프로그램에 버텍스와 프래그먼트 쉐이더를 링크 시킨다.
    var program = createProgram(gl, vertexShader, fragmentShader);

    // look up where the vertex data needs to go.
    // 버텍스 데이터를 필요로 하는 위치를 찾는다.
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    // Create a buffer and put three 2d clip space points in it
    // 버퍼를 만들고 거기에 3개의 2d 클립스페이스포인트(점?)를 찍는다.
    var positionBuffer = gl.createBuffer();

    // ARRAY_BUFFER에 바인딩 시킨다. (ARRAY_BUFFER = positionBuffer 라고 생각하면됨)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    var positions = [
        0, 0,
        0, 0.5,
        0.7, 0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // code above this line is initialization code.
    // code below this line is rendering code.
    // 위에 코드는 초기화코드, 밑에 코드는 랜더링 코드

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    //웹지엘에 어떻게 클립스페이스를 픽셀로 변환할지 알려줍니다.
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // 캔버스(보여질 판)를 비운다.
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    // 프로그램을 사용한다.
    gl.useProgram(program);

    // 속성을 켠다.
    gl.enableVertexAttribArray(positionAttributeLocation);

    // 포지션 버퍼를 바인딩한다.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset);

    // draw
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 3;
    gl.drawArrays(primitiveType, offset, count);
}

main();