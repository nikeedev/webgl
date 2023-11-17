import Shader from './Shader.js';

let WIDTH = window.innerWidth - 40, HEIGHT = window.innerHeight - 40


let vertices = [
  -0.5, -0.5, 0.0,
  0.5, -0.5, 0.0,
  0.0, 0.5, 0.0
];

function main() {
  const canvas = document.querySelector("#canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  // Initialize the GL context
  const gl = canvas.getContext("webgl2");

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return
  }

  let shader = new Shader("shader.vs", "shader.fs", gl);

  let VAO, VBO;
  VAO = gl.createVertexArray();
  gl.bindVertexArray(VAO);

  VBO = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
  gl.enableVertexAttribArray(0);

  const draw = () => {
    canvas.width = window.innerWidth - 40;
    canvas.height = window.innerWidth - 40;

    gl.viewport(0, 0, canvas.width-40, canvas.height-40);
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
