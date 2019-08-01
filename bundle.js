(function() {
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

  var fsSource =
    '#version 300 es\nprecision mediump float;out vec4 color;in vec3 fragColor;void main(){color=vec4(fragColor,1.);}';

  var vsSource =
    '#version 300 es\nin vec2 a_position;in vec3 a_vertColor;uniform vec2 u_translation;uniform vec2 u_rotation;uniform vec2 u_scale;uniform float u_pointSize;out vec3 fragColor;void main(){fragColor=a_vertColor;gl_PointSize=u_pointSize;float rotatedX=a_position.x*u_rotation.y+a_position.y*u_rotation.x;float rotatedY=a_position.y*u_rotation.y-a_position.x*u_rotation.x;vec2 rotatedPosition=vec2(rotatedX,rotatedY);gl_Position=vec4(rotatedPosition*u_scale+u_translation,0.,1.);}';

  // prettier-ignore

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
        type: context.VERTEX_SHADER,
      });
    }
  }

  class FragmentShader extends Shader {
    constructor({ context, source }) {
      super({
        context,
        source,
        type: context.FRAGMENT_SHADER,
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
      const success = this.context.getProgramParameter(
        this.gl_program,
        this.context.VALIDATE_STATUS
      );

      if (!success) {
        const infoLog = this.context.getProgramInfoLog(this.gl_program);
        this.context.deleteProgram(this.gl_program);
        throw infoLog;
      }
    }
  }

  class Mesh {
    constructor({ context, geometry, vertexShaderSrc, fragmentShaderSrc }) {
      this._context = context;
      this._geometry = geometry;
      this._geometryBuffer = this._context.createBuffer();
      this._vertexShaderSrc = vertexShaderSrc;
      this._fragmentShaderSrc = fragmentShaderSrc;

      const { vertexShader, fragmentShader } = this._compileShders({
        context: this._context,
        vertexShaderSrc: this._vertexShaderSrc,
        fragmentShaderSrc: this._fragmentShaderSrc,
      });

      this._vertexShader = vertexShader;
      this._fragmentShader = fragmentShader;
      this._program = new Program({
        context: this._context,
        vertexShader: this._vertexShader,
        fragmentShader: this._fragmentShader,
        debug: true,
      });

      this._attributes = this._getAttributes();
      this._uniforms = this._getUniforms();
    }

    render() {
      this._context.useProgram(this._program.gl_program);
      this._context.bindBuffer(this._context.ARRAY_BUFFER, this._geometryBuffer);
      this._context.bufferData(
        this._context.ARRAY_BUFFER,
        this._geometry,
        this._context.STATIC_DRAW
      );
      this._enableAttribs();
      this._setValues();
      this._context.useProgram(this._program.gl_program);
    }

    _setValues() {
      this._context.uniform2fv(this._uniforms.uTranslationLoc, new Float32Array([0, 0]));
      this._context.uniform2fv(this._uniforms.uScaleLoc, new Float32Array([1, 1]));
      this._context.uniform2fv(this._uniforms.uRotationLoc, new Float32Array([0, 1]));
      this._context.uniform1f(this._uniforms.uPointSizeLoc, 10);
    }

    _enableAttribs() {
      this._context.enableVertexAttribArray(this._attributes.aPositionLoc);
      this._context.enableVertexAttribArray(this._attributes.aVertColorLoc);

      this._context.vertexAttribPointer(
        this._attributes.aPositionLoc,
        2,
        this._context.FLOAT,
        this._context.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0
      );
      this._context.vertexAttribPointer(
        this._attributes.aVertColorLoc,
        3,
        this._context.FLOAT,
        this._context.FALSE,
        0,
        2 * Float32Array.BYTES_PER_ELEMENT
      );
    }

    _compileShders({ context, vertexShaderSrc, fragmentShaderSrc }) {
      const vertexShader = new VertexShader({ context, source: vertexShaderSrc });
      const fragmentShader = new FragmentShader({ context, source: fragmentShaderSrc });
      return { vertexShader, fragmentShader };
    }

    _getAttributes() {
      const aPositionLoc = this._getAttribLocation('a_position');
      const aVertColorLoc = this._getAttribLocation('a_vertColor');

      return { aPositionLoc, aVertColorLoc };
    }

    _getUniforms() {
      const uPointSizeLoc = this._getUniformLocation('u_pointSize');
      const uTranslationLoc = this._getUniformLocation('u_translation');
      const uScaleLoc = this._getUniformLocation('u_scale');
      const uRotationLoc = this._getUniformLocation('u_rotation');

      return { uPointSizeLoc, uTranslationLoc, uScaleLoc, uRotationLoc };
    }

    _getAttribLocation(name) {
      return this._context.getAttribLocation(this._program.gl_program, name);
    }

    _getUniformLocation(name) {
      return this._context.getUniformLocation(this._program.gl_program, name);
    }
  }

  const gl = new Gl({ canvasSelector: '#webGl' });
  const { context } = gl;
  const [width, height] = [500, 500];

  gl.setSize({ width, height });
  gl.setClearColor({ r: 0, g: 0, b: 0, a: 1 });
  gl.clear();

  const random = (min, max) => Math.random() * (max - min) + min;

  const randomTri = () => {
    const triangle = [];

    for (let i = 0; i < 3; i++) {
      triangle.push(random(-1, 1), random(-1, 1), Math.random(), Math.random(), Math.random());
    }

    return new Float32Array(triangle);
  };

  const meshes = [];

  for (let i = 0; i < 100; i++) {
    const mesh = new Mesh({
      context,
      geometry: randomTri(),
      vertexShaderSrc: vsSource,
      fragmentShaderSrc: fsSource,
    });
    meshes.push(mesh);
  }

  meshes.forEach(mesh => {
    mesh.render();
    context.drawArrays(context.TRIANGLES, 0, 3);
    context.drawArrays(context.POINTS, 0, 3);
  });

  /*import './ui/index';
  import Gl from './gl';
  import fsSource from './shaders/fragmentShader.glsl';
  import vsSource from './shaders/vertexShader.glsl';
  import { VertexShader, FragmentShader } from './shader/index';
  import Program from './Program';
  import trianglePoints from './const/trianglePoints';
  import Mesh from './Mesh';

  const gl = new Gl({ canvasSelector: '#webGl' });
  const { context } = gl;
  const [width, height] = [500, 500];

  gl.setSize({ width, height });
  gl.setClearColor({ r: 0, g: 0, b: 0, a: 1 });
  gl.clear();

  const vertexShader = new VertexShader({ context, source: vsSource });
  const fragmentShader = new FragmentShader({ context, source: fsSource });
  const program = new Program({ context, vertexShader, fragmentShader, debug: true });

  const aPositionLoc = context.getAttribLocation(program.gl_program, 'a_position');
  const aVertColorLoc = context.getAttribLocation(program.gl_program, 'a_vertColor');
  const uPointSizeLoc = context.getUniformLocation(program.gl_program, 'u_pointSize');
  const uTranslationLoc = context.getUniformLocation(program.gl_program, 'u_translation');
  const uScaleLoc = context.getUniformLocation(program.gl_program, 'u_scale');
  const uRotationLoc = context.getUniformLocation(program.gl_program, 'u_rotation');
  const vertsBuffer = context.createBuffer();

  context.bindBuffer(context.ARRAY_BUFFER, vertsBuffer);
  context.bufferData(context.ARRAY_BUFFER, trianglePoints, context.STATIC_DRAW);
  context.useProgram(program.gl_program);
  context.uniform1f(uPointSizeLoc, 30);

  //const vao = context.createVertexArray();
  //context.bindVertexArray(vao);

  const size = 2; // x, y
  const colorSize = 3; // r, g, b
  const type = context.FLOAT; // the data is 32bit floats
  const normalize = context.FALSE; // don't normalize the data
  const stride = 5 * Float32Array.BYTES_PER_ELEMENT; // 0 means iterate size * sizeof(type) to get next index
  const offset = 0; // start at the beginning of the buffer
  const colorOffset = 2 * Float32Array.BYTES_PER_ELEMENT; // skip positions
  context.enableVertexAttribArray(aVertColorLoc);
  context.enableVertexAttribArray(aPositionLoc);
  context.vertexAttribPointer(aPositionLoc, size, type, normalize, stride, offset);
  context.vertexAttribPointer(aVertColorLoc, colorSize, type, normalize, stride, colorOffset);

  //context.bindBuffer(context.ARRAY_BUFFER, null);

  const translation = new Float32Array([0, 0]);
  const rotation = new Float32Array([0, 1]);
  const scale = new Float32Array([1, 1]);

  const mesh = new Mesh({
    context,
    geometry: trianglePoints,
    vertexShaderSrc: vsSource,
    fragmentShaderSrc: fsSource,
  });

  const drawScene = () => {
    gl.clear();
    //mesh.render();
    context.uniform2fv(uTranslationLoc, translation);
    context.uniform2fv(uScaleLoc, scale);
    context.uniform2fv(uRotationLoc, rotation);
    context.useProgram(program.gl_program);
    context.drawArrays(context.TRIANGLES, 0, 3);
    context.drawArrays(context.POINTS, 0, 3);
  };
  console.log(mesh);

  // UI
  const deg2rad = degrees => degrees * (Math.PI / 180);
  const xSlider = document.getElementById('x-slider');
  const ySlider = document.getElementById('y-slider');
  const rotSlider = document.getElementById('rot-slider');
  const scaleXslider = document.getElementById('scale-x-slider');
  const scaleYslider = document.getElementById('scale-y-slider');

  xSlider.addEventListener('input', ({ detail }) => {
    translation[0] = detail;
    drawScene();
  });

  ySlider.addEventListener('input', ({ detail }) => {
    translation[1] = detail;
    drawScene();
  });

  const rotate = ({ detail }) => {
    const radians = deg2rad(360 - detail);
    rotation[0] = Math.sin(radians);
    rotation[1] = Math.cos(radians);
    drawScene();
  };

  rotSlider.addEventListener('input', rotate);

  scaleXslider.addEventListener('input', ({ detail }) => {
    scale[0] = detail;
    drawScene();
  });

  scaleYslider.addEventListener('input', ({ detail }) => {
    scale[1] = detail;
    drawScene();
  });

  translation[0] = xSlider.value;
  translation[1] = ySlider.value;
  scaleXslider.value = 1;
  scaleYslider.value = 1;
  //rotSlider.value = 0;
  //rotate({ detail: rotSlider.value });
  console.log(translation, scale, rotation);

  drawScene();*/
})();
