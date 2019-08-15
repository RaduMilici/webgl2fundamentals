(function () {
    'use strict';

    const contains = (array, element) => {
        return findIndex(array, element) !== -1;
    };
    const findIndex = (array, find) => {
        return array.findIndex((element) => element.id === find.id);
    };
    const removeFromArray = (array, find) => {
        const index = findIndex(array, find);
        return removeFromArrayAtIndex(array, index);
    };
    const removeFromArrayAtIndex = (array, index) => {
        if (index >= 0 && index < array.length) {
            array.splice(index, 1);
            return true;
        }
        return false;
    };
    //# sourceMappingURL=id.js.map

    let id = 0;
    const uniqueId = () => id++;
    //# sourceMappingURL=uniqueID.js.map

    class Clock {
        constructor() {
            this.startTime = 0;
            this.oldTime = 0;
            this.elapsedTime = 0;
            this.running = false;
            this.timeFunction = typeof performance === 'undefined' ? Date : performance;
        }
        start() {
            this.running = true;
            this.startTime = this.timeFunction.now();
            this.oldTime = this.startTime;
            this.elapsedTime = 0;
        }
        stop() {
            this.running = false;
        }
        getDelta() {
            const newTime = this.timeFunction.now();
            const difference = (newTime - this.oldTime) / 1000;
            this.oldTime = newTime;
            this.elapsedTime += difference;
            return difference;
        }
        getElapsed() {
            return this.elapsedTime;
        }
    }
    //# sourceMappingURL=Clock.js.map

    class Component {
        constructor() {
            this.id = uniqueId();
            this.updatePriority = null;
        }
        start() { }
        stop() { }
        update(tickData) { }
    }
    //# sourceMappingURL=Component.js.map

    class EntityUpdater {
        constructor(updater) {
            this.updater = updater;
            this.entities = [];
        }
        start() {
            this.entities.forEach((entity) => entity.start());
        }
        stop() {
            this.entities.forEach((entity) => entity.stop());
        }
        clear() {
            this.entities.length = 0;
        }
        add(entity) {
            entity.updater = this.updater;
            this.entities.push(entity);
            const callback = (component) => {
                component.entity = entity;
                return this.updater.addComponent(component);
            };
            return this.loopComponents(entity.components, callback);
        }
        remove({ components }) {
            const callback = component => this.updater.removeComponent(component);
            return this.loopComponents(components, callback);
        }
        toggle({ components }) {
            const callback = component => this.updater.toggleComponent(component);
            return this.loopComponents(components, callback);
        }
        loopComponents(components, callback) {
            return components.map((component) => {
                return {
                    id: component.id,
                    name: component.name,
                    success: callback(component),
                };
            });
        }
    }
    //# sourceMappingURL=EntityUpdater.js.map

    class Invoke extends Component {
        constructor(updater, component, timeout) {
            super();
            this.updater = updater;
            this.component = component;
            this.timeout = timeout;
            this.id = uniqueId();
            this.originalTimeout = timeout;
        }
        update(tickData) {
            this.timeout -= tickData.deltaTimeMS;
            if (this.timeout <= 0) {
                this.component.update(tickData);
                this.stop();
            }
        }
        stop() {
            return this.updater.remove(this);
        }
    }
    //# sourceMappingURL=Invoke.js.map

    class InvokeRepeating extends Invoke {
        constructor(updater, component, interval, times) {
            super(updater, component, interval);
            this.times = times;
            this.updated = 0;
        }
        update(tickData) {
            this.timeout -= tickData.deltaTimeMS;
            if (this.timeout <= 0) {
                if (++this.updated === this.times) {
                    this.stop();
                }
                this.component.update(tickData);
                this.timeout = this.originalTimeout;
            }
        }
    }
    //# sourceMappingURL=InvokeRepeating.js.map

    class Updater {
        constructor() {
            this.onUpdateComplete = new Component();
            this.components = [];
            this.running = false;
            this.clock = new Clock();
            this.entityUpdater = new EntityUpdater(this);
        }
        start() {
            if (!this.running) {
                this.running = true;
                this.clock.start();
                this.entityUpdater.start();
                this.components.forEach((component) => component.start());
                this.update();
                return true;
            }
            return false;
        }
        stop() {
            if (this.running) {
                this.running = false;
                cancelAnimationFrame(this.frameId);
                this.clock.stop();
                this.entityUpdater.stop();
                this.components.forEach((component) => component.stop());
                return true;
            }
            return false;
        }
        clear() {
            this.stop();
            this.entityUpdater.clear();
            this.components.length = 0;
        }
        add(behaviour) {
            if (behaviour instanceof Component) {
                return this.addComponent(behaviour);
            }
            else {
                return this.entityUpdater.add(behaviour);
            }
        }
        remove(behaviour) {
            if (behaviour instanceof Component) {
                return this.removeComponent(behaviour);
            }
            else {
                return this.entityUpdater.remove(behaviour);
            }
        }
        toggle(behaviour) {
            if (behaviour instanceof Component) {
                return this.toggleComponent(behaviour);
            }
            else {
                return this.entityUpdater.toggle(behaviour);
            }
        }
        isUpdatingComponent(component) {
            return contains(this.components, component);
        }
        addComponent(component) {
            if (!this.isUpdatingComponent(component)) {
                component.updater = this;
                this.pushToQueue(component);
                return true;
            }
            return false;
        }
        removeComponent(component) {
            return removeFromArray(this.components, component);
        }
        toggleComponent(component) {
            if (!this.addComponent(component)) {
                this.removeComponent(component);
                return false;
            }
            return true;
        }
        invoke(component, time) {
            const invoke = new Invoke(this, component, time);
            this.add(invoke);
        }
        invokeRepeating(component, time, times = Infinity) {
            const invoke = new InvokeRepeating(this, component, time, times);
            this.add(invoke);
        }
        getTickData() {
            const deltaTime = this.clock.getDelta();
            const deltaTimeMS = deltaTime * 1000;
            const elapsedTime = this.clock.getElapsed();
            return { deltaTime, deltaTimeMS, elapsedTime };
        }
        pushToQueue(component) {
            if (typeof component.updatePriority === 'number') {
                this.components.splice(component.updatePriority, 0, component);
            }
            else {
                this.components.push(component);
            }
        }
        update() {
            this.frameId = requestAnimationFrame(() => this.update());
            const tickData = this.getTickData();
            this.components.forEach((component) => {
                component.update(tickData);
            });
            this.onUpdateComplete.update(tickData);
        }
    }
    //# sourceMappingURL=Updater.js.map

    class GlSlider extends HTMLElement {
      constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        this.label = document.createElement('label');
        this.span = document.createElement('span');
        this.input = this.makeInput();

        this.label.setAttribute('id', 'label');
        this.span.setAttribute('id', 'value');

        this.label.innerHTML = this.getAttribute('label');
        this.span.textContent = this.input.value;

        this.input.addEventListener('input', event => {
          event.stopPropagation();
          const { value } = event.target;
          this.setValue(value);
        });

        this.label.appendChild(this.input);
        this.label.appendChild(this.span);
        shadow.appendChild(this.makeStyle());
        shadow.appendChild(this.label);
      }

      get value() {
        return this.input.value;
      }

      set value(value) {
        this.setValue(value);
      }

      setValue(value) {
        this.input.value = value;
        this.span.textContent = value;
        this.dispatchEvent(new CustomEvent('input', { detail: value }));
      }

      makeInput() {
        const max = parseFloat(this.getAttribute('max'));
        const min = parseFloat(this.getAttribute('min'));
        const input = document.createElement('input');
        input.setAttribute('id', 'slider');
        input.type = 'range';
        input.setAttribute('step', this.getAttribute('step'));
        input.setAttribute('min', min);
        input.setAttribute('max', max);
        input.value = (min + max) / 2;
        return input;
      }

      makeStyle() {
        const style = document.createElement('style');
        style.textContent = `
      #label {
        background-color: black;
        color: white;
        display: inline-block;
        padding: 5px;
        font-family: sans-serif;
      }

      #slider {
        margin: 0 20px;
      }
    `;
        return style;
      }
    }

    customElements.define('gl-slider', GlSlider);

    class Renderer {
      constructor({ canvasSelector, size, clearColor }) {
        this.canvas = document.querySelector(canvasSelector);

        if (!this.canvas instanceof HTMLCanvasElement) {
          throw `Can't find canvas with selector ${canvasSelector}.`;
        }

        this.context = this.canvas.getContext('webgl2');
        const { width, height } = size;
        this.setSize({ width, height });
        this.setClearColor(clearColor);
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

      render(...scenes) {
        this.clear();
        scenes.forEach(scene => scene.render(this.context));
        this.context.useProgram(null);
      }
    }

    var vertexColorsFS_Source = "#version 300 es\nprecision mediump float;out vec4 color;in vec3 fragColor;void main(){color=vec4(fragColor,1.);}";

    var sinColorsFS_Source = "#version 300 es\nprecision mediump float;out vec4 color;in vec3 fragColor;void main(){vec3 sinColor=vec3(0.,sin(gl_FragCoord.x*0.5),0.);color=vec4(sinColor,1.);}";

    var vsSource = "#version 300 es\nin vec2 a_position;in vec3 a_vertColor;uniform vec2 u_translation;uniform vec2 u_rotation;uniform vec2 u_scale;uniform float u_pointSize;out vec3 fragColor;void main(){fragColor=a_vertColor;float rotatedX=a_position.x*u_rotation.y+a_position.y*u_rotation.x;float rotatedY=a_position.y*u_rotation.y-a_position.x*u_rotation.x;vec2 rotatedPosition=vec2(rotatedX,rotatedY);gl_PointSize=u_pointSize;gl_Position=vec4(rotatedPosition*u_scale+u_translation,0.,1.);}";

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
        const success = this.context.getProgramParameter(this.gl_program, this.context.VALIDATE_STATUS);

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

        const { vertexShader, fragmentShader } = this._compileShders({
          context,
          vertexShaderSrc,
          fragmentShaderSrc,
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

        this._position = [0, 0];
        this._rotation = [0, 1];
      }

      get vertCount() {
        return this._geometry.length / 5;
      }

      get position() {
        return {
          x: this._position[0],
          y: this._position[1],
        };
      }

      set position({ x, y }) {
        this._position[0] = x;
        this._position[1] = y;
        this._setPosition();
      }

      set rotation(radians) {
        this._rotation[0] = Math.sin(radians);
        this._rotation[1] = Math.cos(radians);
        this._setRotation();
      }

      render() {
        this._useProgram();
        this._context.bindBuffer(this._context.ARRAY_BUFFER, this._geometryBuffer);
        this._context.bufferData(this._context.ARRAY_BUFFER, this._geometry, this._context.STATIC_DRAW);
        this._enableAttribs();
        this._setValues();
      }

      _setValues() {
        this._context.uniform2fv(this._uniforms.uScaleLoc, new Float32Array([1, 1]));
        this._setPosition();
        this._setRotation();
        //this._context.uniform1f(this._uniforms.uPointSizeLoc, 30);
      }

      _setRotation() {
        this._useProgram();
        this._context.uniform2fv(this._uniforms.uRotationLoc, new Float32Array(this._rotation));
      }

      _setPosition() {
        this._useProgram();
        this._context.uniform2fv(this._uniforms.uTranslationLoc, new Float32Array(this._position));
      }

      _useProgram() {
        this._context.useProgram(this._program.gl_program);
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

    class Scene {
      constructor() {
        this._objects = [];
      }

      add(...objects) {
        objects.forEach(object => {
          if (!this.contains(object)) {
            this._objects.push(object);
          }
        });
      }

      remove(...objects) {
        objects.forEach(object => {
          const index = this._getChildIndex(object);

          if (index !== -1) {
            this._objects.splice(index, 1);
          }
        });
      }

      contains(object) {
        return this._getChildIndex(object) !== -1;
      }

      render(context) {
        this._objects.forEach(child => {
          child.render();
          context.drawArrays(context.TRIANGLES, 0, child.vertCount);
        });
      }

      _getChildIndex(object) {
        return this._objects.indexOf(object);
      }
    }

    class Color {
      constructor({ r, g, b }) {
        this.r = r;
        this.g = g;
        this.b = b;
      }

      get values() {
        return [this.r, this.g, this.b];
      }
    }

    class Vector2 {
      constructor({ x, y }) {
        this.x = x;
        this.y = y;
      }

      get values() {
        return [this.x, this.y];
      }
    }

    const randomColor = () =>
      new Color({
        r: random(0, 1),
        g: random(0, 1),
        b: random(0, 1),
      });
    const random = (min, max) => Math.random() * (max - min) + min;
    const randomTri = () => {
      const a = new Vector2({ x: random(-1, 1), y: random(-1, 1) });
      const b = new Vector2({ x: random(-1, 1), y: random(-1, 1) });
      const c = new Vector2({ x: random(-1, 1), y: random(-1, 1) });

      return [
        ...a.values,
        ...randomColor().values,
        ...b.values,
        ...randomColor().values,
        ...c.values,
        ...randomColor().values,
      ];
    };

    const randomTris = num => {
      const tris = [];

      for (let i = 0; i < num; i++) {
        tris.push(...randomTri());
      }

      return tris;
    };

    class Draw extends Component {
      constructor() {
        super();

        this.renderer = new Renderer({
          canvasSelector: '#webGl',
          clearColor: { r: 0, g: 0, b: 0, a: 1 },
          size: { width: 500, height: 500 },
        });

        const vertexColors = new Mesh({
          context: this.renderer.context,
          geometry: new Float32Array(randomTris(3)),
          vertexShaderSrc: vsSource,
          fragmentShaderSrc: vertexColorsFS_Source,
        });

        const sinColors = new Mesh({
          context: this.renderer.context,
          geometry: new Float32Array(randomTris(3)),
          vertexShaderSrc: vsSource,
          fragmentShaderSrc: sinColorsFS_Source,
        });

        this.scene = new Scene();
        this.scene2 = new Scene();
        this.scene.add(vertexColors);
        this.scene2.add(sinColors);
      }

      update() {
        this.renderer.render(this.scene, this.scene2);
      }
    }

    const updater = new Updater();
    const draw = new Draw();
    updater.add(draw);
    updater.start();

}());
