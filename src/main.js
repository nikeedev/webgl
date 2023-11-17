import Shader from './Shader.js';

let WIDTH = window.innerWidth - 40, HEIGHT = window.innerHeight - 40

let vertices = [
  -0.5, -0.5, 0.0,
  0.5, -0.5, 0.0,
  0.0, 0.5, 0.0
];

// Initialize the GL context
/** @type {WebGL2RenderingContext} */
const gl = canvas.getContext("webgl2");

// Only continue if WebGL is available and working
if (gl === null) {
  alert("Unable to initialize WebGL. Your browser or machine may not support it.");
}

/**
 * 
 * @param {HTMLImageElement} image 
 * @param {WebGLProgram} shader 
 */
function render(image, program) {
  // look up where the texture coordinates need to go.
  let texCoordLocation = gl.getAttribLocation(program, "a_texCoord");

  // provide texture coordinates for the rectangle.
  let texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0.0, 0.0,
    1.0, 0.0,
    0.0, 1.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordLocation);
  gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

  // Create a texture.
  let texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the parameters so we can render any size image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  // Upload the image into the texture.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
}

function main() {
  const canvas = document.querySelector("#canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  let shader = new Shader("shader.vs", "shader.fs", gl);

  let VAO, VBO;
  VAO = gl.createVertexArray();
  gl.bindVertexArray(VAO);

  VBO = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
  gl.enableVertexAttribArray(0);


  // image:

  let image = new Image();
  image.src = "./img/Smile_icon.png";
  image.onload = function () {
    render(image, shader.program);
  }

  const draw = () => {
    canvas.width = window.innerWidth - 40;
    canvas.height = window.innerWidth - 40;

    gl.viewport(0, 0, canvas.width - 40, canvas.height - 40);
    // Set clear color to black, fully opaque
    gl.clearColor(0.3, 0.45, 0.73, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);

    shader.use(gl);

    gl.bindVertexArray(VAO);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    requestAnimationFrame(draw);
  };

  requestAnimationFrame(draw);
}

main();
