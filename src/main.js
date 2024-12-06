import Shader from './Shader.js';

let WIDTH = window.innerWidth - 40, HEIGHT = window.innerHeight - 40

const positions = [
    0.0, -1.0,
    1.0, -1.0,
    0.0, 1.0,
    1.0, 1.0
];

const texCoords = [
    0.0, 1.0,
    1.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,
];

const canvas = document.querySelector("#canvas");

// Initialize the GL context
/** @type {WebGL2RenderingContext} */
const gl = canvas.getContext("webgl2");
let texture = null;

// Only continue if WebGL is available and working
if (gl === null) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
}

canvas.style.width = `${WIDTH}px`;
canvas.style.height = `${HEIGHT}px`;
canvas.width = WIDTH;
canvas.height = HEIGHT;

let texCoordBuffer = null;

async function main() {
    canvas.width = `${WIDTH}px`;
    canvas.height = `${HEIGHT}px`;

    let shader = new Shader("shader.vs", "shader.fs", gl);

    try {
        await shader.initialize();
    } catch (error) {
        console.error("Failed to initialize shader:", error);
        return;
    }


    let posLocation = gl.getAttribLocation(shader.program, "a_pos");
    // console.log(posLocation);

    let texCoordLocation = gl.getAttribLocation(shader.program, "a_texCoord");
    // console.log(texCoordLocation);

    let VAO, positionBuffer;
    VAO = gl.createVertexArray();
    gl.bindVertexArray(VAO);

    positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posLocation);


    // image:

    console.log(shader.program);

    // provide texture coordinates for the rectangle.
    texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

    // Position attribute (first 3 components of the vertex)
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLocation);

    // Create a texture.
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    const uImageLocation = gl.getUniformLocation(shader.program, "u_image");
    let yOffsetLocation = gl.getUniformLocation(shader.program, "yOffset");

    let image = new Image();
    image.src = "./img/Smile_icon.png";
    image.onload = async function () {
        // Upload the image into the texture.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    }

    const draw = async () => {
        WIDTH = window.innerWidth - 40;
        HEIGHT = window.innerHeight - 40;
        // console.log(WIDTH, HEIGHT);
        canvas.style.width = `${WIDTH}px`;
        canvas.style.height = `${HEIGHT}px`;
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        
        shader.use(gl);
        
        gl.clearColor(0.39, 0.58, 0.93, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(posLocation);
        
        // console.log("yOffset:", gl.getUniform(shader.program, yOffsetLocation));
        // gl.uniform1f(yOffsetLocation, Math.sin(Date.now() * 0.001));

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(uImageLocation, 0);
                
        gl.bindVertexArray(VAO);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.bindVertexArray(VAO);
        
        requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);
}

main();
