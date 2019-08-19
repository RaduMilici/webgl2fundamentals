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

    const RadToDeg = (rad) => rad * (180 / Math.PI);
    //# sourceMappingURL=radDeg.js.map

    class Vector {
        constructor({ x, y } = { x: 0, y: 0 }) {
            this.x = x;
            this.y = y;
        }
        clone() {
            return new Vector({ x: this.x, y: this.y });
        }
        magnitude() {
            const x = this.x * this.x;
            const y = this.y * this.y;
            const magnitude = Math.sqrt(x + y);
            return magnitude;
        }
        dotProduct({ x, y }) {
            return this.x * x + this.y * y;
        }
        add(vector) {
            const x = this.x + vector.x;
            const y = this.y + vector.y;
            return new Vector({ x, y });
        }
        sub(vector) {
            const x = this.x + -vector.x;
            const y = this.y + -vector.y;
            return new Vector({ x, y });
        }
        multiplyScalar(scalar) {
            const x = this.x * scalar;
            const y = this.y * scalar;
            return new Vector({ x, y });
        }
        normalize() {
            const magnitude = this.magnitude();
            const x = this.x / magnitude;
            const y = this.y / magnitude;
            return new Vector({ x, y });
        }
        lerp(vector, alpha) {
            const x = this.x + (vector.x - this.x) * alpha;
            const y = this.y + (vector.y - this.y) * alpha;
            return new Vector({ x, y });
        }
        negative() {
            const x = -this.x;
            const y = -this.y;
            return new Vector({ x, y });
        }
        perpendicular() {
            const right = new Vector({ x: -this.y, y: this.x });
            const left = new Vector({ x: this.y, y: -this.x });
            return { left, right };
        }
        scale(length) {
            const normalized = this.normalize();
            const x = normalized.x * length;
            const y = normalized.y * length;
            return new Vector({ x, y });
        }
        angleDeg(vector) {
            const angle = this.angle(vector);
            return RadToDeg(angle);
        }
        angleRad(vector) {
            return this.angle(vector);
        }
        bisector(vector) {
            const normalized = this.normalize();
            const normalizedVector = vector.normalize();
            const sum = normalized.add(normalizedVector);
            const magnitude = (this.magnitude() + vector.magnitude()) / 2;
            return sum.scale(magnitude);
        }
        equals(vector) {
            return this.x === vector.x && this.y === vector.y;
        }
        distanceTo(vector) {
            return this.sub(vector).magnitude();
        }
        midpoint(vector) {
            const x = (this.x + vector.x) / 2;
            const y = (this.y + vector.y) / 2;
            return new Vector({ x, y });
        }
        static FindPolyCentroid(points) {
            let x = 0;
            let y = 0;
            points.forEach((point) => {
                x += point.x;
                y += point.y;
            });
            x /= points.length;
            y /= points.length;
            return new Vector({ x, y });
        }
        static ArrangePointsCCW(points) {
            const centroid = Vector.FindPolyCentroid(points);
            let clone = [...points];
            clone.sort((a, b) => {
                const angleA = Math.atan2(a.y - centroid.y, a.x - centroid.x);
                const angleB = Math.atan2(b.y - centroid.y, b.x - centroid.x);
                return angleA - angleB;
            });
            return clone;
        }
        static UniqueFromArray(points) {
            const isUnique = (vector, index, array) => {
                return (array.findIndex((vectorIndex) => {
                    return vector.equals(vectorIndex);
                }) === index);
            };
            return points.filter(isUnique);
        }
        angle(vector) {
            const product = this.dotProduct(vector);
            const cosAngle = product / (this.magnitude() * vector.magnitude());
            return Math.acos(cosAngle);
        }
    }
    //# sourceMappingURL=Vector.js.map

    const randomInt = (min, max) => {
        return Math.round(randomFloat(min, max));
    };
    const randomFloat = (min, max) => {
        return Math.random() * (max - min) + min;
    };
    //# sourceMappingURL=random.js.map

    let id = 0;
    const uniqueId = () => id++;
    //# sourceMappingURL=uniqueID.js.map

    class Matrix {
        constructor() {
            this.rows = [];
            this.columns = [];
        }
        static AddElements(elementsA, elementsB) {
            return elementsA.map((elementA, index) => {
                return elementA + elementsB[index];
            });
        }
        static MultiplyElementsScalar(elements, scalar) {
            let sum = new Array(elements.length).fill(0);
            for (let i = 0; i < scalar; i++) {
                sum = Matrix.AddElements(sum, elements);
            }
            return sum;
        }
        static Multiply(rows, columns) {
            const elements = [];
            rows.forEach((row) => {
                columns.forEach((column) => {
                    const element = Matrix.CrossProduct(row, column);
                    elements.push(element);
                });
            });
            return elements;
        }
        static CrossProduct(row, column) {
            return row.reduce((acc, number, index) => {
                acc += number * column[index];
                return acc;
            }, 0);
        }
    }
    class Matrix2 extends Matrix {
        constructor(a = 0, b = 0, c = 0, d = 0) {
            super();
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.rows = [[a, b], [c, d]];
            this.columns = [[a, c], [b, d]];
        }
        get elements() {
            return [this.a, this.b, this.c, this.d];
        }
        determine() {
            return this.a * this.d - this.b * this.c;
        }
        add({ elements }) {
            const sum = Matrix.AddElements(this.elements, elements);
            return new Matrix2(...sum);
        }
        multiply(m2) {
            const product = Matrix.Multiply(this.rows, m2.columns);
            return new Matrix2(...product);
        }
        multiplyScalar(scalar) {
            const product = Matrix.MultiplyElementsScalar(this.elements, scalar);
            return new Matrix2(...product);
        }
    }
    class Matrix3 extends Matrix2 {
        constructor(a = 0, b = 0, c = 0, d = 0, e = 0, f = 0, g = 0, h = 0, i = 0) {
            super(a, b, c, d);
            this.e = e;
            this.f = f;
            this.g = g;
            this.h = h;
            this.i = i;
            this.rows = [[a, b, c], [d, e, f], [g, h, i]];
            this.columns = [[a, d, g], [b, e, h], [c, f, i]];
        }
        get elements() {
            return [...super.elements, this.e, this.f, this.g, this.h, this.i];
        }
        determine() {
            return (this.a * new Matrix2(this.e, this.f, this.h, this.i).determine() -
                this.b * new Matrix2(this.d, this.f, this.g, this.i).determine() +
                this.c * new Matrix2(this.d, this.e, this.g, this.h).determine());
        }
        add({ elements }) {
            const sum = Matrix.AddElements(this.elements, elements);
            return new Matrix3(...sum);
        }
        multiply({ columns }) {
            const product = Matrix.Multiply(this.rows, columns);
            return new Matrix3(...product);
        }
        multiplyScalar(scalar) {
            const product = Matrix.MultiplyElementsScalar(this.elements, scalar);
            return new Matrix3(...product);
        }
    }
    class Matrix4 extends Matrix3 {
        constructor(a = 0, b = 0, c = 0, d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0) {
            super(a, b, c, d, e, f, g, h, i);
            this.j = j;
            this.k = k;
            this.l = l;
            this.m = m;
            this.n = n;
            this.o = o;
            this.p = p;
            this.rows = [[a, b, c, d], [e, f, g, h], [i, j, k, l], [m, n, o, p]];
            this.columns = [[a, e, i, m], [b, f, j, n], [c, g, k, o], [d, h, l, p]];
        }
        get elements() {
            return [
                ...super.elements,
                this.j,
                this.k,
                this.l,
                this.m,
                this.n,
                this.o,
                this.p,
            ];
        }
        determine() {
            return (this.a *
                new Matrix3(this.f, this.g, this.h, this.j, this.k, this.l, this.n, this.o, this.p).determine() -
                this.b *
                    new Matrix3(this.e, this.g, this.h, this.i, this.k, this.l, this.m, this.o, this.p).determine() +
                this.c *
                    new Matrix3(this.e, this.f, this.h, this.i, this.j, this.l, this.m, this.n, this.p).determine() -
                this.d *
                    new Matrix3(this.e, this.f, this.g, this.i, this.j, this.k, this.m, this.n, this.o).determine());
        }
        add({ elements }) {
            const sum = Matrix.AddElements(this.elements, elements);
            return new Matrix4(...sum);
        }
        multiplyScalar(scalar) {
            const product = Matrix.MultiplyElementsScalar(this.elements, scalar);
            return new Matrix4(...product);
        }
        multiply({ columns }) {
            const product = Matrix.Multiply(this.rows, columns);
            return new Matrix4(...product);
        }
    }
    //# sourceMappingURL=Matrix.js.map

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

    // prettier-ignore
    class PositionMatrix extends Matrix4 {
      constructor({ x, y, z }) {
        super(
          1, 0, 0, 0, 
          0, 1, 0, 0, 
          0, 0, 1, 0, 
          x, y, z, 1
        );
      }
    }

    class OrthographicProjectionMatrix extends Matrix4 {
      constructor({ left, right, bottom, top, near, far }) {
        super(
          2 / (right - left),
          0,
          0,
          0,
          0,
          2 / (top - bottom),
          0,
          0,
          0,
          0,
          2 / (near - far),
          0,
          (left + right) / (left - right),
          (bottom + top) / (bottom - top),
          (near + far) / (near - far),
          1
        );
      }
    }

    // prettier-ignore
    class ScaleMatrix extends Matrix4 {
      constructor({ x, y, z }) {
        super(
          x, 0, 0, 0, 
          0, y, 0, 0, 
          0, 0, z, 0, 
          0, 0, 0, 1);
      }
    }

    const getRotationValues = radians => {
      const sin = Math.sin(radians);
      const cos = Math.cos(radians);
      return { sin, cos };
    };

    // prettier-ignore
    class XRotationMatrix extends Matrix4 {
      constructor(radians) {
        const { sin, cos } = getRotationValues(radians);
        super(
          1,   0,    0, 0, 
          0, cos,  sin, 0,
          0, -sin, cos, 0,
          0,    0,   0, 1
        );
      }
    }

    // prettier-ignore
    class YRotationMatrix extends Matrix4 {
      constructor(radians) {
        const { sin, cos } = getRotationValues(radians);
        super(
          cos, 0, -sin,   0,
            0, 1,    0,   0, 
          sin, 0,  cos,   0,    
          0,   0,    0,   1
        );
      }
    }

    // prettier-ignore
    class ZRotationMatrix extends Matrix4 {
      constructor(radians) {
        const { sin, cos } = getRotationValues(radians);
        super(
           cos, sin, 0, 0, 
          -sin, cos, 0, 0, 
             0,   0, 1, 0, 
             0,   0, 0, 1);
      }
    }

    class Renderer {
      constructor({ canvasSelector, size, clearColor }) {
        this.canvas = document.querySelector(canvasSelector);

        if (!this.canvas instanceof HTMLCanvasElement) {
          throw `Can't find canvas with selector ${canvasSelector}.`;
        }

        this.context = this.canvas.getContext('webgl2');
        const { width, height, depth } = size;
        this.setSize({ width, height });
        this.setClearColor(clearColor);
        //this._projectionMatrix = new ProjectionMatrix({ width, height, depth });
        this._projectionMatrix = new OrthographicProjectionMatrix({
          left: 0,
          right: width,
          bottom: height,
          top: 0,
          near: 400,
          far: -400,
        });
        console.log(this._projectionMatrix);
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
        scenes.forEach(scene =>
          scene._renderChildren({
            projectionMatrix: this._projectionMatrix,
          })
        );
      }
    }

    class Geometry {
      constructor(triangles) {
        this._triangles = triangles;
        this.vertices = this._getVertices();
        this._vertexCoords = this._getVertexCoords();
      }

      _getVertices() {
        return this._triangles.reduce((acc, triangle) => {
          acc.push(...triangle.points);
          return acc;
        }, []);
      }

      _getVertexCoords() {
        const coords = this.vertices.reduce((acc, { x, y, z }) => {
          acc.push(x, y, z);
          return acc;
        }, []);

        return new Float32Array(coords);
      }
    }

    class Mesh {
      constructor({ context, geometry, material }) {
        this.id = uniqueId();
        this._context = context;
        this._geometry = geometry;
        this._material = material;
        this._geometryBuffer = this._context.createBuffer();
        this._position = null;
        this._rotation = null;
        this._scale = null;
        this._matrices = {
          position: null,
          rotation: {
            x: null,
            y: null,
            z: null,
          },
          scale: null,
        };
        this._init();
      }

      get position() {
        return {
          x: this._position[0],
          y: this._position[1],
        };
      }

      get scale() {
        return {
          x: this._scale[0],
          y: this._scale[1],
          z: this._scale[2],
        };
      }

      set position({ x, y, z }) {
        this._position = [x, y, z];
        this._matrices.position = new PositionMatrix({ x, y, z });
      }

      set rotation({ x, y, z }) {
        this._rotation = [x, y, z];
        this.rotationX = x;
        this.rotationY = y;
        this.rotationZ = z;
      }

      set rotationX(radians) {
        this._matrices.rotation.x = new XRotationMatrix(radians);
      }

      set rotationY(radians) {
        this._matrices.rotation.y = new YRotationMatrix(radians);
      }

      set rotationZ(radians) {
        this._matrices.rotation.z = new ZRotationMatrix(radians);
      }

      set scale({ x, y, z }) {
        this._scale = [x, y, z];
        this._matrices.scale = new ScaleMatrix({ x, y, z });
      }

      _init() {
        this.position = { x: 0, y: 0, z: 0 };
        this.rotation = { x: 0, y: 0, z: 0 };
        this.scale = { x: 1, y: 1, z: 1 };
      }

      _renderImmediate({ projectionMatrix }) {
        this._context.useProgram(this._material._program.gl_program);
        this._context.bindBuffer(this._context.ARRAY_BUFFER, this._geometryBuffer);
        this._context.bufferData(
          this._context.ARRAY_BUFFER,
          this._geometry._vertexCoords,
          this._context.STATIC_DRAW
        );
        this._material._enableAttribs();
        this._updateTranslation(projectionMatrix);
        this._context.drawArrays(this._context.TRIANGLES, 0, this._geometry.vertices.length);
        this._context.useProgram(null);
      }

      _updateTranslation(projectionMatrix) {
        const { elements } = projectionMatrix
          .multiply(this._matrices.position)
          .multiply(this._matrices.rotation.x)
          .multiply(this._matrices.rotation.y)
          .multiply(this._matrices.rotation.z)
          .multiply(this._matrices.scale);
        this._context.uniformMatrix4fv(this._material._uniforms.uMatrixLoc, false, elements);
      }
    }

    class Shader {
      constructor({ context, type, source }) {
        this.id = uniqueId();
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

    class Material {
      constructor({ context, vertexShaderSrc, fragmentShaderSrc }) {
        this.id = uniqueId();
        this._context = context;

        const { vertexShader, fragmentShader } = this._compileShders({
          context: this._context,
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
      }

      _compileShders({ context, vertexShaderSrc, fragmentShaderSrc }) {
        const vertexShader = new VertexShader({ context, source: vertexShaderSrc });
        const fragmentShader = new FragmentShader({ context, source: fragmentShaderSrc });
        return { vertexShader, fragmentShader };
      }

      _enableAttribs() {
        this._context.enableVertexAttribArray(this._attributes.aPositionLoc);

        this._context.vertexAttribPointer(
          this._attributes.aPositionLoc,
          3,
          this._context.FLOAT,
          this._context.FALSE,
          0,
          0
        );
      }

      _getAttributes() {
        const aPositionLoc = this._getAttribLocation('a_position');
        return { aPositionLoc };
      }

      _getUniforms() {
        const uMatrixLoc = this._getUniformLocation('u_matrix');
        return { uMatrixLoc };
      }

      _getAttribLocation(name) {
        return this._context.getAttribLocation(this._program.gl_program, name);
      }

      _getUniformLocation(name) {
        return this._context.getUniformLocation(this._program.gl_program, name);
      }
    }

    var vertexShaderSrc = "#version 300 es\nin vec4 a_position;uniform mat4 u_matrix;void main(){gl_Position=u_matrix*a_position;}";

    var fragmentShaderSrc = "#version 300 es\nprecision mediump float;uniform vec3 u_color;out vec4 frag_color;void main(){frag_color=vec4(u_color,1.);}";

    class Color {
      constructor({ r, g, b }) {
        this.r = r;
        this.g = g;
        this.b = b;
      }

      get values() {
        return new Float32Array([this.r, this.g, this.b]);
      }
    }

    const randomColor = () => {
      const r = randomFloat(0, 1);
      const g = randomFloat(0, 1);
      const b = randomFloat(0, 1);

      return new Color({ r, g, b });
    };

    class BasicMaterial extends Material {
      constructor({ context }) {
        super({ context, vertexShaderSrc, fragmentShaderSrc });
        this._color = randomColor().values;
        this._setColor();
      }

      get color() {
        const r = this._color[0];
        const g = this._color[1];
        const b = this._color[2];
        return new Color({ r, g, b });
      }

      set color({ values }) {
        this._color = values;
        this._setColor();
      }

      _setColor() {
        this._context.useProgram(this._program.gl_program);
        this._context.uniform3fv(this._uniforms.uColorLoc, this._color);
        this._context.useProgram(null);
      }

      _getUniforms() {
        return {
          ...super._getUniforms(),
          uColorLoc: this._getUniformLocation('u_color'),
        };
      }
    }

    class Scene {
      constructor() {
        this.id = uniqueId();
        this._objects = [];
      }

      add(...objects) {
        objects.forEach(object => {
          if (!contains(this._objects, object)) {
            this._objects.push(object);
          }
        });
      }

      remove(...objects) {
        objects.forEach(object => removeFromArray(this._objects, object));
      }

      clear() {
        this._objects.length = 0;
      }
      _renderChildren({ projectionMatrix }) {
        this._objects.forEach(child => child._renderImmediate({ projectionMatrix }));
      }

      _getChildIndex(object) {
        return this._objects.indexOf(object);
      }
    }

    class Triangle3D {
      constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
      }

      get points() {
        return [this.a, this.b, this.c];
      }
    }

    class Vector3 extends Vector {
      constructor({ x = 0, y = 0, z = 0 }) {
        super({ x, y });
        this.z = z;
      }
    }

    const randomTris3D = (num, { width, height }) => {
      const tris = [];

      for (let i = 0; i < num; i++) {
        const a = new Vector3({ x: randomInt(0, width), y: randomInt(0, height), z: 10 });
        const b = new Vector3({ x: randomInt(0, width), y: randomInt(0, height), z: 10 });
        const c = new Vector3({ x: randomInt(0, width), y: randomInt(0, height), z: 10 });
        const triangle = new Triangle3D(a, b, c);
        tris.push(triangle);
      }

      return tris;
    };

    const coords = [
      // left column
      0,
      0,
      0,
      30,
      0,
      0,
      0,
      150,
      0,
      0,
      150,
      0,
      30,
      0,
      0,
      30,
      150,
      0,

      // top rung
      30,
      0,
      0,
      100,
      0,
      0,
      30,
      30,
      0,
      30,
      30,
      0,
      100,
      0,
      0,
      100,
      30,
      0,

      // middle rung
      30,
      60,
      0,
      67,
      60,
      0,
      30,
      90,
      0,
      30,
      90,
      0,
      67,
      60,
      0,
      67,
      90,
      0,
    ];

    const triangles = [];

    for (let i = 0; i < coords.length; i += 9) {
      const a = new Vector3({ x: coords[i], y: coords[i + 1], z: coords[i + 2] });
      const b = new Vector3({ x: coords[i + 3], y: coords[i + 4], z: coords[i + 5] });
      const c = new Vector3({ x: coords[i + 6], y: coords[i + 7], z: coords[i + 8] });
      triangles.push(new Triangle3D(a, b, c));
    }

    var fGeometry = new Geometry(triangles);

    class RotatingMesh extends Mesh {
      update({ elapsedTime }) {
        this.rotation = { x: 0, y: elapsedTime * 0.5, z: 0 };
      }
    }

    class Draw extends Component {
      constructor() {
        super();

        this.renderer = new Renderer({
          canvasSelector: '#webGl',
          clearColor: { r: 0, g: 0, b: 0, a: 1 },
          size: { width: 500, height: 500, depth: 100 },
        });

        const basicMaterial1 = new BasicMaterial({
          context: this.renderer.context,
        });
        basicMaterial1.color = new Color({ r: 0, g: 0, b: 1 });

        const basicMaterial2 = new BasicMaterial({
          context: this.renderer.context,
        });
        basicMaterial2.color = new Color({ r: 0, g: 1, b: 0 });

        this.mesh1 = new RotatingMesh({
          context: this.renderer.context,
          geometry: new Geometry(randomTris3D(3, { width: 500, height: 500, depth: 100 })),
          material: basicMaterial1,
        });

        this.mesh2 = new RotatingMesh({
          context: this.renderer.context,
          geometry: fGeometry,
          material: basicMaterial2,
        });
        this.mesh2.position = { x: 1, y: -1, z: 0 };

        this.scene = new Scene();
        this.scene.add(this.mesh1, this.mesh2);
      }

      update(timeData) {
        this.mesh1.update(timeData);
        this.mesh2.update(timeData);
        this.renderer.render(this.scene);
      }
    }

    const updater = new Updater();
    const draw = new Draw();

    updater.add(draw);

    try {
      updater.start();
    } catch (e) {
      console.error(e);
      updater.stop();
    }

}());
