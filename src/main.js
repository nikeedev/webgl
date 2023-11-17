/* eslint-disable no-unused-vars */
const WIDTH = window.innerWidth - 40, HEIGHT = window.innerHeight - 40

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
  const gl = canvas.getContext("webgl");

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return
  }

  let shader = new Shader("shader.vs", "shader.fs");

  let VAO, VBO;
  gl.genVertexArrays(1, VAO);

  glBindVertexArray(VAO);

  glGenBuffers(1, & VBO);
  glBindBuffer(GL_ARRAY_BUFFER, VBO);
  glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);


  // Set clear color to black, fully opaque
  gl.clearColor(0.3, 0.45, 0.73, 1.0);
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT);


}


class Shader {
  ID

  constructor(vertexPath, fragmentPath, gl) {
    let vertexCode, fragmentCode;

    (async () => {
      fetch(vertexPath).then(res => {
        vertexCode = res.text();
      });

      fetch(fragmentPath).then(res => {
        fragmentCode = res.text();
      });
    })()

    let vertex, fragment;
    let success;

    // vertex Shader
    vertex = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertex, vertexCode);
    gl.compileShader(vertex);

    if (!gl.getShaderParameter(vertex, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(vertex);
      throw `Could not compile WebGL program. \n\n${info}`;
    }

    // fragment Shader

    fragment = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragment, fragmentCode);
    gl.compileShader(fragment);

    if (!gl.getShaderParameter(fragment, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(fragment);
      throw `Could not compile WebGL program. \n\n${info}`;
    }
    // shader Program

    this.ID = gl.createProgram();
    gl.attachShader(this.ID, vertex);
    gl.attachShader(this.ID, fragment);
    gl.linkProgram(this.ID);

    if (!gl.getProgramParameter(this.ID, gl.LINK_STATUS)) {
      let info = gl.getProgramInfoLog(this.ID);
      throw `Could not link WebGL program. \n\n${info}`;
    }

    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0);
    gl.enableVertexAttribArray(0);

    gl.bindVertexArray(0);
  }

  use(gl) {
    gl.useProgram(this.ID);
  }
}

