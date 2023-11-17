
class Shader {
    /** @type {WebGLProgram} */
    program
  
    constructor(vertexPath, fragmentPath, gl) {
      (async () => {
        let vertexCode, fragmentCode;
  
        let temp = await fetch(vertexPath).then(async res => {
          vertexCode = await res.text();
        });
  
        temp = await fetch(fragmentPath).then(async res => {
          fragmentCode = await res.text();
        });
        
        console.log(vertexCode)
        console.log(fragmentCode)
        
        let vertex, fragment;
        
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
        
        this.program = gl.createProgram();
        gl.attachShader(this.program, vertex);
        gl.attachShader(this.program, fragment);
        gl.linkProgram(this.program);
        
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
          let info = gl.getProgramInfoLog(this.program);
          throw `Could not link WebGL program. \n\n${info}`;
        }
    
        gl.deleteShader(vertex);
        gl.deleteShader(fragment);
    
      })()
    }
  
    use(gl) {
      gl.useProgram(this.program);
    }
  }
  
export default Shader;