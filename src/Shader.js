
class Shader {
    ID
  
    constructor(vertexPath, fragmentPath, gl) {
      (async () => {
        let vertexCode, fragmentCode;
  
        let temp = await fetch(vertexPath).then(async res => {
          vertexCode = await res.text();
        });
  
        temp = await fetch(fragmentPath).then(async res => {
          fragmentCode = await res.text();
        });
        
        await console.table(vertexCode,)
  
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
    
      })()
    }
  
    use(gl) {
      gl.useProgram(this.ID);
    }
  }
  
export default Shader;