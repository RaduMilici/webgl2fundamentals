(function () {
  'use strict';

  class Gl {
    constructor({ canvasSelector }) {
      this.canvas = document.querySelector(canvasSelector);

      if (!this.canvas instanceof HTMLCanvasElement) {
        throw `Can't find canvas with selector ${canvasSelector}.`;
      }

      this.context = this.canvas.getContext('webgl2');
      this.setClearColor({ r: 1, g: 1, b: 1, a: 1 });
    }

    setSize({ width, height }) {
      this.context.canvas.style.width = `${width}px`;
      this.context.canvas.style.height = `${height}px`;
      this.context.canvas.width = width;
      this.context.canvas.height = height;
      this.context.viewport(0, 0, width, height);
    }

    setClearColor({ r, g, b, a }) {
      this.context.clearColor(r, g, b, a);
    }

    clear() {
      this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
    }
  }

  var fsSource = "#version 300 es\nprecision mediump float;out vec4 color;in vec3 fragColor;void main(){color=vec4(fragColor,1.);}";

  var vsSource = "#version 300 es\nin vec2 a_position;in vec3 a_vertColor;uniform float uPointSize;out vec3 fragColor;void main(){fragColor=a_vertColor;gl_PointSize=uPointSize;gl_Position=vec4(a_position,0.,1.);}";

  class Shader {
    constructor({ context, type, source }) {
      this.context = context;
      this.source = source;
      this.gl_shader = context.createShader(type);
      this.context.shaderSource(this.gl_shader, source);
      this.context.compileShader(this.gl_shader);
      this.verify();  
    }

    delete(program) {
      this.context.detachShader(program, this.gl_shader);
      this.context.deleteShader(this.gl_shader);
    }

    verify() {
      const success = this.context.getShaderParameter(this.gl_shader, this.context.COMPILE_STATUS);
    
      if (!success) {
        const infoLog = this.context.getShaderInfoLog(this.gl_shader);
        this.context.deleteShader(this.gl_shader);
        throw infoLog;
      }
    }
  }

  class VertexShader extends Shader {
    constructor({ context, source }) {
      super({ 
        context, 
        source,
        type: context.VERTEX_SHADER
      });
    }
  }

  class FragmentShader extends Shader {
    constructor({ context, source }) {
      super({ 
        context, 
        source,
        type: context.FRAGMENT_SHADER
      });
    }
  }

  class Program {
    constructor({ context, vertexShader, fragmentShader, debug = false }) {
      this.context = context;
      this.gl_program = context.createProgram();
      this.debug = debug;
      this.attachShaders({ vertexShader, fragmentShader });
      context.linkProgram(this.gl_program);
      this.verify();
      if (this.debug) {
        this.validate();
      }
      vertexShader.delete(this.gl_program);
      fragmentShader.delete(this.gl_program);
    }

    attachShaders({ vertexShader, fragmentShader }) {
      this.context.attachShader(this.gl_program, vertexShader.gl_shader);
      this.context.attachShader(this.gl_program, fragmentShader.gl_shader);
    }

    verify() {
      const success = this.context.getProgramParameter(this.gl_program, this.context.LINK_STATUS);

      if (!success) {
        const infoLog = this.context.getProgramInfoLog(this.gl_program);
        this.context.deleteProgram(this.gl_program);
        throw infoLog;
      }
    }

    validate() {
      this.context.validateProgram(this.gl_program);
      const success = this.context.getProgramParameter(this.gl_program, this.context.VALIDATE_STATUS);

      if (!success) {
        const infoLog = this.context.getProgramInfoLog(this.gl_program);
        this.context.deleteProgram(this.gl_program);
        throw infoLog;
      }
    }
  }

  // prettier-ignore
  var trianglePoints = new Float32Array([
    // X, Y      R, G, B
    -1, -1,      1, 0, 0,
     0,  1,      0, 1, 0,
     1, -1,      0, 0, 1
  ]);

  const gl = new Gl({ canvasSelector: '#webGl' });
  const { context } = gl;
  gl.setSize({ width: 500, height: 500 });
  gl.setClearColor({ r: 0, g: 0, b: 0, a: 1 });
  gl.clear();

  const vertexShader = new VertexShader({ context, source: vsSource });
  const fragmentShader = new FragmentShader({ context, source: fsSource });
  const program = new Program({ context, vertexShader, fragmentShader, debug: true });

  const aPositionLoc = context.getAttribLocation(program.gl_program, 'a_position');
  const aVertColorLoc = context.getAttribLocation(program.gl_program, 'a_vertColor');
  const uPointSizeLoc = context.getUniformLocation(program.gl_program, 'uPointSize');
  const vertsBuffer = context.createBuffer();

  context.bindBuffer(context.ARRAY_BUFFER, vertsBuffer);
  context.bufferData(context.ARRAY_BUFFER, trianglePoints, context.STATIC_DRAW);
  context.useProgram(program.gl_program);
  context.uniform1f(uPointSizeLoc, 30);

  const size = 2; // components per iteration
  const colorSize = 3;
  const type = context.FLOAT; // the data is 32bit floats
  const normalize = context.FALSE; // don't normalize the data
  const stride = 5 * Float32Array.BYTES_PER_ELEMENT; // 0 means iterate size * sizeof(type) to get next index
  const offset = 0; // start at the beginning of the buffer
  const colorOffset = 2 * Float32Array.BYTES_PER_ELEMENT;
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
  context.vertexAttribPointer(aPositionLoc, size, type, normalize, stride, offset);
  context.vertexAttribPointer(aVertColorLoc, colorSize, type, normalize, stride, colorOffset);
  context.enableVertexAttribArray(aVertColorLoc);
  context.enableVertexAttribArray(aPositionLoc);

  context.drawArrays(context.TRIANGLES, 0, 3);
  context.drawArrays(context.POINTS, 0, 3);
  context.bindBuffer(context.ARRAY_BUFFER, null);

}());
