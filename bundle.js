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

    const RadToDeg = (rad) => rad * (180 / Math.PI);

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

    const randomInt = (min, max) => {
        return Math.round(randomFloat(min, max));
    };
    const randomFloat = (min, max) => {
        return Math.random() * (max - min) + min;
    };

    let id = 0;
    const uniqueId = () => id++;

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

    class Component {
        constructor() {
            this.id = uniqueId();
            this.updatePriority = null;
        }
        start() { }
        stop() { }
        update(tickData) { }
    }

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
          near: depth,
          far: -depth,
        });
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

    /*!
    @fileoverview gl-matrix - High performance matrix and vector operations
    @author Brandon Jones
    @author Colin MacKenzie IV
    @version 3.1.0

    Copyright (c) 2015-2019, Brandon Jones, Colin MacKenzie IV.

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.

    */

      /**
       * Common utilities
       * @module glMatrix
       */
      // Configuration Constants
      var EPSILON = 0.000001;
      var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
      var degree = Math.PI / 180;
      if (!Math.hypot) Math.hypot = function () {
        var y = 0,
            i = arguments.length;

        while (i--) {
          y += arguments[i] * arguments[i];
        }

        return Math.sqrt(y);
      };

      /**
       * 3x3 Matrix
       * @module mat3
       */

      /**
       * Creates a new identity mat3
       *
       * @returns {mat3} a new 3x3 matrix
       */

      function create$2() {
        var out = new ARRAY_TYPE(9);

        if (ARRAY_TYPE != Float32Array) {
          out[1] = 0;
          out[2] = 0;
          out[3] = 0;
          out[5] = 0;
          out[6] = 0;
          out[7] = 0;
        }

        out[0] = 1;
        out[4] = 1;
        out[8] = 1;
        return out;
      }

      /**
       * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
       * @module mat4
       */

      /**
       * Creates a new identity mat4
       *
       * @returns {mat4} a new 4x4 matrix
       */

      function create$3() {
        var out = new ARRAY_TYPE(16);

        if (ARRAY_TYPE != Float32Array) {
          out[1] = 0;
          out[2] = 0;
          out[3] = 0;
          out[4] = 0;
          out[6] = 0;
          out[7] = 0;
          out[8] = 0;
          out[9] = 0;
          out[11] = 0;
          out[12] = 0;
          out[13] = 0;
          out[14] = 0;
        }

        out[0] = 1;
        out[5] = 1;
        out[10] = 1;
        out[15] = 1;
        return out;
      }
      /**
       * Creates a new mat4 initialized with values from an existing matrix
       *
       * @param {mat4} a matrix to clone
       * @returns {mat4} a new 4x4 matrix
       */

      function clone$3(a) {
        var out = new ARRAY_TYPE(16);
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        out[4] = a[4];
        out[5] = a[5];
        out[6] = a[6];
        out[7] = a[7];
        out[8] = a[8];
        out[9] = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
        return out;
      }
      /**
       * Copy the values from one mat4 to another
       *
       * @param {mat4} out the receiving matrix
       * @param {mat4} a the source matrix
       * @returns {mat4} out
       */

      function copy$3(out, a) {
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        out[4] = a[4];
        out[5] = a[5];
        out[6] = a[6];
        out[7] = a[7];
        out[8] = a[8];
        out[9] = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
        return out;
      }
      /**
       * Create a new mat4 with the given values
       *
       * @param {Number} m00 Component in column 0, row 0 position (index 0)
       * @param {Number} m01 Component in column 0, row 1 position (index 1)
       * @param {Number} m02 Component in column 0, row 2 position (index 2)
       * @param {Number} m03 Component in column 0, row 3 position (index 3)
       * @param {Number} m10 Component in column 1, row 0 position (index 4)
       * @param {Number} m11 Component in column 1, row 1 position (index 5)
       * @param {Number} m12 Component in column 1, row 2 position (index 6)
       * @param {Number} m13 Component in column 1, row 3 position (index 7)
       * @param {Number} m20 Component in column 2, row 0 position (index 8)
       * @param {Number} m21 Component in column 2, row 1 position (index 9)
       * @param {Number} m22 Component in column 2, row 2 position (index 10)
       * @param {Number} m23 Component in column 2, row 3 position (index 11)
       * @param {Number} m30 Component in column 3, row 0 position (index 12)
       * @param {Number} m31 Component in column 3, row 1 position (index 13)
       * @param {Number} m32 Component in column 3, row 2 position (index 14)
       * @param {Number} m33 Component in column 3, row 3 position (index 15)
       * @returns {mat4} A new mat4
       */

      function fromValues$3(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
        var out = new ARRAY_TYPE(16);
        out[0] = m00;
        out[1] = m01;
        out[2] = m02;
        out[3] = m03;
        out[4] = m10;
        out[5] = m11;
        out[6] = m12;
        out[7] = m13;
        out[8] = m20;
        out[9] = m21;
        out[10] = m22;
        out[11] = m23;
        out[12] = m30;
        out[13] = m31;
        out[14] = m32;
        out[15] = m33;
        return out;
      }
      /**
       * Set the components of a mat4 to the given values
       *
       * @param {mat4} out the receiving matrix
       * @param {Number} m00 Component in column 0, row 0 position (index 0)
       * @param {Number} m01 Component in column 0, row 1 position (index 1)
       * @param {Number} m02 Component in column 0, row 2 position (index 2)
       * @param {Number} m03 Component in column 0, row 3 position (index 3)
       * @param {Number} m10 Component in column 1, row 0 position (index 4)
       * @param {Number} m11 Component in column 1, row 1 position (index 5)
       * @param {Number} m12 Component in column 1, row 2 position (index 6)
       * @param {Number} m13 Component in column 1, row 3 position (index 7)
       * @param {Number} m20 Component in column 2, row 0 position (index 8)
       * @param {Number} m21 Component in column 2, row 1 position (index 9)
       * @param {Number} m22 Component in column 2, row 2 position (index 10)
       * @param {Number} m23 Component in column 2, row 3 position (index 11)
       * @param {Number} m30 Component in column 3, row 0 position (index 12)
       * @param {Number} m31 Component in column 3, row 1 position (index 13)
       * @param {Number} m32 Component in column 3, row 2 position (index 14)
       * @param {Number} m33 Component in column 3, row 3 position (index 15)
       * @returns {mat4} out
       */

      function set$3(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
        out[0] = m00;
        out[1] = m01;
        out[2] = m02;
        out[3] = m03;
        out[4] = m10;
        out[5] = m11;
        out[6] = m12;
        out[7] = m13;
        out[8] = m20;
        out[9] = m21;
        out[10] = m22;
        out[11] = m23;
        out[12] = m30;
        out[13] = m31;
        out[14] = m32;
        out[15] = m33;
        return out;
      }
      /**
       * Set a mat4 to the identity matrix
       *
       * @param {mat4} out the receiving matrix
       * @returns {mat4} out
       */

      function identity$3(out) {
        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = 1;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = 1;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;
        return out;
      }
      /**
       * Transpose the values of a mat4
       *
       * @param {mat4} out the receiving matrix
       * @param {mat4} a the source matrix
       * @returns {mat4} out
       */

      function transpose$2(out, a) {
        // If we are transposing ourselves we can skip a few steps but have to cache some values
        if (out === a) {
          var a01 = a[1],
              a02 = a[2],
              a03 = a[3];
          var a12 = a[6],
              a13 = a[7];
          var a23 = a[11];
          out[1] = a[4];
          out[2] = a[8];
          out[3] = a[12];
          out[4] = a01;
          out[6] = a[9];
          out[7] = a[13];
          out[8] = a02;
          out[9] = a12;
          out[11] = a[14];
          out[12] = a03;
          out[13] = a13;
          out[14] = a23;
        } else {
          out[0] = a[0];
          out[1] = a[4];
          out[2] = a[8];
          out[3] = a[12];
          out[4] = a[1];
          out[5] = a[5];
          out[6] = a[9];
          out[7] = a[13];
          out[8] = a[2];
          out[9] = a[6];
          out[10] = a[10];
          out[11] = a[14];
          out[12] = a[3];
          out[13] = a[7];
          out[14] = a[11];
          out[15] = a[15];
        }

        return out;
      }
      /**
       * Inverts a mat4
       *
       * @param {mat4} out the receiving matrix
       * @param {mat4} a the source matrix
       * @returns {mat4} out
       */

      function invert$3(out, a) {
        var a00 = a[0],
            a01 = a[1],
            a02 = a[2],
            a03 = a[3];
        var a10 = a[4],
            a11 = a[5],
            a12 = a[6],
            a13 = a[7];
        var a20 = a[8],
            a21 = a[9],
            a22 = a[10],
            a23 = a[11];
        var a30 = a[12],
            a31 = a[13],
            a32 = a[14],
            a33 = a[15];
        var b00 = a00 * a11 - a01 * a10;
        var b01 = a00 * a12 - a02 * a10;
        var b02 = a00 * a13 - a03 * a10;
        var b03 = a01 * a12 - a02 * a11;
        var b04 = a01 * a13 - a03 * a11;
        var b05 = a02 * a13 - a03 * a12;
        var b06 = a20 * a31 - a21 * a30;
        var b07 = a20 * a32 - a22 * a30;
        var b08 = a20 * a33 - a23 * a30;
        var b09 = a21 * a32 - a22 * a31;
        var b10 = a21 * a33 - a23 * a31;
        var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

        var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) {
          return null;
        }

        det = 1.0 / det;
        out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
        return out;
      }
      /**
       * Calculates the adjugate of a mat4
       *
       * @param {mat4} out the receiving matrix
       * @param {mat4} a the source matrix
       * @returns {mat4} out
       */

      function adjoint$2(out, a) {
        var a00 = a[0],
            a01 = a[1],
            a02 = a[2],
            a03 = a[3];
        var a10 = a[4],
            a11 = a[5],
            a12 = a[6],
            a13 = a[7];
        var a20 = a[8],
            a21 = a[9],
            a22 = a[10],
            a23 = a[11];
        var a30 = a[12],
            a31 = a[13],
            a32 = a[14],
            a33 = a[15];
        out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
        out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
        out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
        out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
        out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
        out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
        out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
        out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
        out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
        out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
        out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
        out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
        out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
        out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
        out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
        out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
        return out;
      }
      /**
       * Calculates the determinant of a mat4
       *
       * @param {mat4} a the source matrix
       * @returns {Number} determinant of a
       */

      function determinant$3(a) {
        var a00 = a[0],
            a01 = a[1],
            a02 = a[2],
            a03 = a[3];
        var a10 = a[4],
            a11 = a[5],
            a12 = a[6],
            a13 = a[7];
        var a20 = a[8],
            a21 = a[9],
            a22 = a[10],
            a23 = a[11];
        var a30 = a[12],
            a31 = a[13],
            a32 = a[14],
            a33 = a[15];
        var b00 = a00 * a11 - a01 * a10;
        var b01 = a00 * a12 - a02 * a10;
        var b02 = a00 * a13 - a03 * a10;
        var b03 = a01 * a12 - a02 * a11;
        var b04 = a01 * a13 - a03 * a11;
        var b05 = a02 * a13 - a03 * a12;
        var b06 = a20 * a31 - a21 * a30;
        var b07 = a20 * a32 - a22 * a30;
        var b08 = a20 * a33 - a23 * a30;
        var b09 = a21 * a32 - a22 * a31;
        var b10 = a21 * a33 - a23 * a31;
        var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

        return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
      }
      /**
       * Multiplies two mat4s
       *
       * @param {mat4} out the receiving matrix
       * @param {mat4} a the first operand
       * @param {mat4} b the second operand
       * @returns {mat4} out
       */

      function multiply$3(out, a, b) {
        var a00 = a[0],
            a01 = a[1],
            a02 = a[2],
            a03 = a[3];
        var a10 = a[4],
            a11 = a[5],
            a12 = a[6],
            a13 = a[7];
        var a20 = a[8],
            a21 = a[9],
            a22 = a[10],
            a23 = a[11];
        var a30 = a[12],
            a31 = a[13],
            a32 = a[14],
            a33 = a[15]; // Cache only the current line of the second matrix

        var b0 = b[0],
            b1 = b[1],
            b2 = b[2],
            b3 = b[3];
        out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = b[4];
        b1 = b[5];
        b2 = b[6];
        b3 = b[7];
        out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = b[8];
        b1 = b[9];
        b2 = b[10];
        b3 = b[11];
        out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = b[12];
        b1 = b[13];
        b2 = b[14];
        b3 = b[15];
        out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        return out;
      }
      /**
       * Translate a mat4 by the given vector
       *
       * @param {mat4} out the receiving matrix
       * @param {mat4} a the matrix to translate
       * @param {vec3} v vector to translate by
       * @returns {mat4} out
       */

      function translate$2(out, a, v) {
        var x = v[0],
            y = v[1],
            z = v[2];
        var a00, a01, a02, a03;
        var a10, a11, a12, a13;
        var a20, a21, a22, a23;

        if (a === out) {
          out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
          out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
          out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
          out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
        } else {
          a00 = a[0];
          a01 = a[1];
          a02 = a[2];
          a03 = a[3];
          a10 = a[4];
          a11 = a[5];
          a12 = a[6];
          a13 = a[7];
          a20 = a[8];
          a21 = a[9];
          a22 = a[10];
          a23 = a[11];
          out[0] = a00;
          out[1] = a01;
          out[2] = a02;
          out[3] = a03;
          out[4] = a10;
          out[5] = a11;
          out[6] = a12;
          out[7] = a13;
          out[8] = a20;
          out[9] = a21;
          out[10] = a22;
          out[11] = a23;
          out[12] = a00 * x + a10 * y + a20 * z + a[12];
          out[13] = a01 * x + a11 * y + a21 * z + a[13];
          out[14] = a02 * x + a12 * y + a22 * z + a[14];
          out[15] = a03 * x + a13 * y + a23 * z + a[15];
        }

        return out;
      }
      /**
       * Scales the mat4 by the dimensions in the given vec3 not using vectorization
       *
       * @param {mat4} out the receiving matrix
       * @param {mat4} a the matrix to scale
       * @param {vec3} v the vec3 to scale the matrix by
       * @returns {mat4} out
       **/

      function scale$3(out, a, v) {
        var x = v[0],
            y = v[1],
            z = v[2];
        out[0] = a[0] * x;
        out[1] = a[1] * x;
        out[2] = a[2] * x;
        out[3] = a[3] * x;
        out[4] = a[4] * y;
        out[5] = a[5] * y;
        out[6] = a[6] * y;
        out[7] = a[7] * y;
        out[8] = a[8] * z;
        out[9] = a[9] * z;
        out[10] = a[10] * z;
        out[11] = a[11] * z;
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
        return out;
      }
      /**
       * Rotates a mat4 by the given angle around the given axis
       *
       * @param {mat4} out the receiving matrix
       * @param {mat4} a the matrix to rotate
       * @param {Number} rad the angle to rotate the matrix by
       * @param {vec3} axis the axis to rotate around
       * @returns {mat4} out
       */

      function rotate$3(out, a, rad, axis) {
        var x = axis[0],
            y = axis[1],
            z = axis[2];
        var len = Math.hypot(x, y, z);
        var s, c, t;
        var a00, a01, a02, a03;
        var a10, a11, a12, a13;
        var a20, a21, a22, a23;
        var b00, b01, b02;
        var b10, b11, b12;
        var b20, b21, b22;

        if (len < EPSILON) {
          return null;
        }

        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;
        s = Math.sin(rad);
        c = Math.cos(rad);
        t = 1 - c;
        a00 = a[0];
        a01 = a[1];
        a02 = a[2];
        a03 = a[3];
        a10 = a[4];
        a11 = a[5];
        a12 = a[6];
        a13 = a[7];
        a20 = a[8];
        a21 = a[9];
        a22 = a[10];
        a23 = a[11]; // Construct the elements of the rotation matrix

        b00 = x * x * t + c;
        b01 = y * x * t + z * s;
        b02 = z * x * t - y * s;
        b10 = x * y * t - z * s;
        b11 = y * y * t + c;
        b12 = z * y * t + x * s;
        b20 = x * z * t + y * s;
        b21 = y * z * t - x * s;
        b22 = z * z * t + c; // Perform rotation-specific matrix multiplication

        out[0] = a00 * b00 + a10 * b01 + a20 * b02;
        out[1] = a01 * b00 + a11 * b01 + a21 * b02;
        out[2] = a02 * b00 + a12 * b01 + a22 * b02;
        out[3] = a03 * b00 + a13 * b01 + a23 * b02;
        out[4] = a00 * b10 + a10 * b11 + a20 * b12;
        out[5] = a01 * b10 + a11 * b11 + a21 * b12;
        out[6] = a02 * b10 + a12 * b11 + a22 * b12;
        out[7] = a03 * b10 + a13 * b11 + a23 * b12;
        out[8] = a00 * b20 + a10 * b21 + a20 * b22;
        out[9] = a01 * b20 + a11 * b21 + a21 * b22;
        out[10] = a02 * b20 + a12 * b21 + a22 * b22;
        out[11] = a03 * b20 + a13 * b21 + a23 * b22;

        if (a !== out) {
          // If the source and destination differ, copy the unchanged last row
          out[12] = a[12];
          out[13] = a[13];
          out[14] = a[14];
          out[15] = a[15];
        }

        return out;
      }
      /**
       * Rotates a matrix by the given angle around the X axis
       *
       * @param {mat4} out the receiving matrix
       * @param {mat4} a the matrix to rotate
       * @param {Number} rad the angle to rotate the matrix by
       * @returns {mat4} out
       */

      function rotateX(out, a, rad) {
        var s = Math.sin(rad);
        var c = Math.cos(rad);
        var a10 = a[4];
        var a11 = a[5];
        var a12 = a[6];
        var a13 = a[7];
        var a20 = a[8];
        var a21 = a[9];
        var a22 = a[10];
        var a23 = a[11];

        if (a !== out) {
          // If the source and destination differ, copy the unchanged rows
          out[0] = a[0];
          out[1] = a[1];
          out[2] = a[2];
          out[3] = a[3];
          out[12] = a[12];
          out[13] = a[13];
          out[14] = a[14];
          out[15] = a[15];
        } // Perform axis-specific matrix multiplication


        out[4] = a10 * c + a20 * s;
        out[5] = a11 * c + a21 * s;
        out[6] = a12 * c + a22 * s;
        out[7] = a13 * c + a23 * s;
        out[8] = a20 * c - a10 * s;
        out[9] = a21 * c - a11 * s;
        out[10] = a22 * c - a12 * s;
        out[11] = a23 * c - a13 * s;
        return out;
      }
      /**
       * Rotates a matrix by the given angle around the Y axis
       *
       * @param {mat4} out the receiving matrix
       * @param {mat4} a the matrix to rotate
       * @param {Number} rad the angle to rotate the matrix by
       * @returns {mat4} out
       */

      function rotateY(out, a, rad) {
        var s = Math.sin(rad);
        var c = Math.cos(rad);
        var a00 = a[0];
        var a01 = a[1];
        var a02 = a[2];
        var a03 = a[3];
        var a20 = a[8];
        var a21 = a[9];
        var a22 = a[10];
        var a23 = a[11];

        if (a !== out) {
          // If the source and destination differ, copy the unchanged rows
          out[4] = a[4];
          out[5] = a[5];
          out[6] = a[6];
          out[7] = a[7];
          out[12] = a[12];
          out[13] = a[13];
          out[14] = a[14];
          out[15] = a[15];
        } // Perform axis-specific matrix multiplication


        out[0] = a00 * c - a20 * s;
        out[1] = a01 * c - a21 * s;
        out[2] = a02 * c - a22 * s;
        out[3] = a03 * c - a23 * s;
        out[8] = a00 * s + a20 * c;
        out[9] = a01 * s + a21 * c;
        out[10] = a02 * s + a22 * c;
        out[11] = a03 * s + a23 * c;
        return out;
      }
      /**
       * Rotates a matrix by the given angle around the Z axis
       *
       * @param {mat4} out the receiving matrix
       * @param {mat4} a the matrix to rotate
       * @param {Number} rad the angle to rotate the matrix by
       * @returns {mat4} out
       */

      function rotateZ(out, a, rad) {
        var s = Math.sin(rad);
        var c = Math.cos(rad);
        var a00 = a[0];
        var a01 = a[1];
        var a02 = a[2];
        var a03 = a[3];
        var a10 = a[4];
        var a11 = a[5];
        var a12 = a[6];
        var a13 = a[7];

        if (a !== out) {
          // If the source and destination differ, copy the unchanged last row
          out[8] = a[8];
          out[9] = a[9];
          out[10] = a[10];
          out[11] = a[11];
          out[12] = a[12];
          out[13] = a[13];
          out[14] = a[14];
          out[15] = a[15];
        } // Perform axis-specific matrix multiplication


        out[0] = a00 * c + a10 * s;
        out[1] = a01 * c + a11 * s;
        out[2] = a02 * c + a12 * s;
        out[3] = a03 * c + a13 * s;
        out[4] = a10 * c - a00 * s;
        out[5] = a11 * c - a01 * s;
        out[6] = a12 * c - a02 * s;
        out[7] = a13 * c - a03 * s;
        return out;
      }
      /**
       * Creates a matrix from a vector translation
       * This is equivalent to (but much faster than):
       *
       *     mat4.identity(dest);
       *     mat4.translate(dest, dest, vec);
       *
       * @param {mat4} out mat4 receiving operation result
       * @param {vec3} v Translation vector
       * @returns {mat4} out
       */

      function fromTranslation$2(out, v) {
        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = 1;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = 1;
        out[11] = 0;
        out[12] = v[0];
        out[13] = v[1];
        out[14] = v[2];
        out[15] = 1;
        return out;
      }
      /**
       * Creates a matrix from a vector scaling
       * This is equivalent to (but much faster than):
       *
       *     mat4.identity(dest);
       *     mat4.scale(dest, dest, vec);
       *
       * @param {mat4} out mat4 receiving operation result
       * @param {vec3} v Scaling vector
       * @returns {mat4} out
       */

      function fromScaling$3(out, v) {
        out[0] = v[0];
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = v[1];
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = v[2];
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;
        return out;
      }
      /**
       * Creates a matrix from a given angle around a given axis
       * This is equivalent to (but much faster than):
       *
       *     mat4.identity(dest);
       *     mat4.rotate(dest, dest, rad, axis);
       *
       * @param {mat4} out mat4 receiving operation result
       * @param {Number} rad the angle to rotate the matrix by
       * @param {vec3} axis the axis to rotate around
       * @returns {mat4} out
       */

      function fromRotation$3(out, rad, axis) {
        var x = axis[0],
            y = axis[1],
            z = axis[2];
        var len = Math.hypot(x, y, z);
        var s, c, t;

        if (len < EPSILON) {
          return null;
        }

        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;
        s = Math.sin(rad);
        c = Math.cos(rad);
        t = 1 - c; // Perform rotation-specific matrix multiplication

        out[0] = x * x * t + c;
        out[1] = y * x * t + z * s;
        out[2] = z * x * t - y * s;
        out[3] = 0;
        out[4] = x * y * t - z * s;
        out[5] = y * y * t + c;
        out[6] = z * y * t + x * s;
        out[7] = 0;
        out[8] = x * z * t + y * s;
        out[9] = y * z * t - x * s;
        out[10] = z * z * t + c;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;
        return out;
      }
      /**
       * Creates a matrix from the given angle around the X axis
       * This is equivalent to (but much faster than):
       *
       *     mat4.identity(dest);
       *     mat4.rotateX(dest, dest, rad);
       *
       * @param {mat4} out mat4 receiving operation result
       * @param {Number} rad the angle to rotate the matrix by
       * @returns {mat4} out
       */

      function fromXRotation(out, rad) {
        var s = Math.sin(rad);
        var c = Math.cos(rad); // Perform axis-specific matrix multiplication

        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = c;
        out[6] = s;
        out[7] = 0;
        out[8] = 0;
        out[9] = -s;
        out[10] = c;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;
        return out;
      }
      /**
       * Creates a matrix from the given angle around the Y axis
       * This is equivalent to (but much faster than):
       *
       *     mat4.identity(dest);
       *     mat4.rotateY(dest, dest, rad);
       *
       * @param {mat4} out mat4 receiving operation result
       * @param {Number} rad the angle to rotate the matrix by
       * @returns {mat4} out
       */

      function fromYRotation(out, rad) {
        var s = Math.sin(rad);
        var c = Math.cos(rad); // Perform axis-specific matrix multiplication

        out[0] = c;
        out[1] = 0;
        out[2] = -s;
        out[3] = 0;
        out[4] = 0;
        out[5] = 1;
        out[6] = 0;
        out[7] = 0;
        out[8] = s;
        out[9] = 0;
        out[10] = c;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;
        return out;
      }
      /**
       * Creates a matrix from the given angle around the Z axis
       * This is equivalent to (but much faster than):
       *
       *     mat4.identity(dest);
       *     mat4.rotateZ(dest, dest, rad);
       *
       * @param {mat4} out mat4 receiving operation result
       * @param {Number} rad the angle to rotate the matrix by
       * @returns {mat4} out
       */

      function fromZRotation(out, rad) {
        var s = Math.sin(rad);
        var c = Math.cos(rad); // Perform axis-specific matrix multiplication

        out[0] = c;
        out[1] = s;
        out[2] = 0;
        out[3] = 0;
        out[4] = -s;
        out[5] = c;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = 1;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;
        return out;
      }
      /**
       * Creates a matrix from a quaternion rotation and vector translation
       * This is equivalent to (but much faster than):
       *
       *     mat4.identity(dest);
       *     mat4.translate(dest, vec);
       *     let quatMat = mat4.create();
       *     quat4.toMat4(quat, quatMat);
       *     mat4.multiply(dest, quatMat);
       *
       * @param {mat4} out mat4 receiving operation result
       * @param {quat4} q Rotation quaternion
       * @param {vec3} v Translation vector
       * @returns {mat4} out
       */

      function fromRotationTranslation(out, q, v) {
        // Quaternion math
        var x = q[0],
            y = q[1],
            z = q[2],
            w = q[3];
        var x2 = x + x;
        var y2 = y + y;
        var z2 = z + z;
        var xx = x * x2;
        var xy = x * y2;
        var xz = x * z2;
        var yy = y * y2;
        var yz = y * z2;
        var zz = z * z2;
        var wx = w * x2;
        var wy = w * y2;
        var wz = w * z2;
        out[0] = 1 - (yy + zz);
        out[1] = xy + wz;
        out[2] = xz - wy;
        out[3] = 0;
        out[4] = xy - wz;
        out[5] = 1 - (xx + zz);
        out[6] = yz + wx;
        out[7] = 0;
        out[8] = xz + wy;
        out[9] = yz - wx;
        out[10] = 1 - (xx + yy);
        out[11] = 0;
        out[12] = v[0];
        out[13] = v[1];
        out[14] = v[2];
        out[15] = 1;
        return out;
      }
      /**
       * Creates a new mat4 from a dual quat.
       *
       * @param {mat4} out Matrix
       * @param {quat2} a Dual Quaternion
       * @returns {mat4} mat4 receiving operation result
       */

      function fromQuat2(out, a) {
        var translation = new ARRAY_TYPE(3);
        var bx = -a[0],
            by = -a[1],
            bz = -a[2],
            bw = a[3],
            ax = a[4],
            ay = a[5],
            az = a[6],
            aw = a[7];
        var magnitude = bx * bx + by * by + bz * bz + bw * bw; //Only scale if it makes sense

        if (magnitude > 0) {
          translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
          translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
          translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
        } else {
          translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
          translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
          translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
        }

        fromRotationTranslation(out, a, translation);
        return out;
      }
      /**
       * Returns the translation vector component of a transformation
       *  matrix. If a matrix is built with fromRotationTranslation,
       *  the returned vector will be the same as the translation vector
       *  originally supplied.
       * @param  {vec3} out Vector to receive translation component
       * @param  {mat4} mat Matrix to be decomposed (input)
       * @return {vec3} out
       */

      function getTranslation(out, mat) {
        out[0] = mat[12];
        out[1] = mat[13];
        out[2] = mat[14];
        return out;
      }
      /**
       * Returns the scaling factor component of a transformation
       *  matrix. If a matrix is built with fromRotationTranslationScale
       *  with a normalized Quaternion paramter, the returned vector will be
       *  the same as the scaling vector
       *  originally supplied.
       * @param  {vec3} out Vector to receive scaling factor component
       * @param  {mat4} mat Matrix to be decomposed (input)
       * @return {vec3} out
       */

      function getScaling(out, mat) {
        var m11 = mat[0];
        var m12 = mat[1];
        var m13 = mat[2];
        var m21 = mat[4];
        var m22 = mat[5];
        var m23 = mat[6];
        var m31 = mat[8];
        var m32 = mat[9];
        var m33 = mat[10];
        out[0] = Math.hypot(m11, m12, m13);
        out[1] = Math.hypot(m21, m22, m23);
        out[2] = Math.hypot(m31, m32, m33);
        return out;
      }
      /**
       * Returns a quaternion representing the rotational component
       *  of a transformation matrix. If a matrix is built with
       *  fromRotationTranslation, the returned quaternion will be the
       *  same as the quaternion originally supplied.
       * @param {quat} out Quaternion to receive the rotation component
       * @param {mat4} mat Matrix to be decomposed (input)
       * @return {quat} out
       */

      function getRotation(out, mat) {
        var scaling = new ARRAY_TYPE(3);
        getScaling(scaling, mat);
        var is1 = 1 / scaling[0];
        var is2 = 1 / scaling[1];
        var is3 = 1 / scaling[2];
        var sm11 = mat[0] * is1;
        var sm12 = mat[1] * is2;
        var sm13 = mat[2] * is3;
        var sm21 = mat[4] * is1;
        var sm22 = mat[5] * is2;
        var sm23 = mat[6] * is3;
        var sm31 = mat[8] * is1;
        var sm32 = mat[9] * is2;
        var sm33 = mat[10] * is3;
        var trace = sm11 + sm22 + sm33;
        var S = 0;

        if (trace > 0) {
          S = Math.sqrt(trace + 1.0) * 2;
          out[3] = 0.25 * S;
          out[0] = (sm23 - sm32) / S;
          out[1] = (sm31 - sm13) / S;
          out[2] = (sm12 - sm21) / S;
        } else if (sm11 > sm22 && sm11 > sm33) {
          S = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2;
          out[3] = (sm23 - sm32) / S;
          out[0] = 0.25 * S;
          out[1] = (sm12 + sm21) / S;
          out[2] = (sm31 + sm13) / S;
        } else if (sm22 > sm33) {
          S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2;
          out[3] = (sm31 - sm13) / S;
          out[0] = (sm12 + sm21) / S;
          out[1] = 0.25 * S;
          out[2] = (sm23 + sm32) / S;
        } else {
          S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2;
          out[3] = (sm12 - sm21) / S;
          out[0] = (sm31 + sm13) / S;
          out[1] = (sm23 + sm32) / S;
          out[2] = 0.25 * S;
        }

        return out;
      }
      /**
       * Creates a matrix from a quaternion rotation, vector translation and vector scale
       * This is equivalent to (but much faster than):
       *
       *     mat4.identity(dest);
       *     mat4.translate(dest, vec);
       *     let quatMat = mat4.create();
       *     quat4.toMat4(quat, quatMat);
       *     mat4.multiply(dest, quatMat);
       *     mat4.scale(dest, scale)
       *
       * @param {mat4} out mat4 receiving operation result
       * @param {quat4} q Rotation quaternion
       * @param {vec3} v Translation vector
       * @param {vec3} s Scaling vector
       * @returns {mat4} out
       */

      function fromRotationTranslationScale(out, q, v, s) {
        // Quaternion math
        var x = q[0],
            y = q[1],
            z = q[2],
            w = q[3];
        var x2 = x + x;
        var y2 = y + y;
        var z2 = z + z;
        var xx = x * x2;
        var xy = x * y2;
        var xz = x * z2;
        var yy = y * y2;
        var yz = y * z2;
        var zz = z * z2;
        var wx = w * x2;
        var wy = w * y2;
        var wz = w * z2;
        var sx = s[0];
        var sy = s[1];
        var sz = s[2];
        out[0] = (1 - (yy + zz)) * sx;
        out[1] = (xy + wz) * sx;
        out[2] = (xz - wy) * sx;
        out[3] = 0;
        out[4] = (xy - wz) * sy;
        out[5] = (1 - (xx + zz)) * sy;
        out[6] = (yz + wx) * sy;
        out[7] = 0;
        out[8] = (xz + wy) * sz;
        out[9] = (yz - wx) * sz;
        out[10] = (1 - (xx + yy)) * sz;
        out[11] = 0;
        out[12] = v[0];
        out[13] = v[1];
        out[14] = v[2];
        out[15] = 1;
        return out;
      }
      /**
       * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
       * This is equivalent to (but much faster than):
       *
       *     mat4.identity(dest);
       *     mat4.translate(dest, vec);
       *     mat4.translate(dest, origin);
       *     let quatMat = mat4.create();
       *     quat4.toMat4(quat, quatMat);
       *     mat4.multiply(dest, quatMat);
       *     mat4.scale(dest, scale)
       *     mat4.translate(dest, negativeOrigin);
       *
       * @param {mat4} out mat4 receiving operation result
       * @param {quat4} q Rotation quaternion
       * @param {vec3} v Translation vector
       * @param {vec3} s Scaling vector
       * @param {vec3} o The origin vector around which to scale and rotate
       * @returns {mat4} out
       */

      function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
        // Quaternion math
        var x = q[0],
            y = q[1],
            z = q[2],
            w = q[3];
        var x2 = x + x;
        var y2 = y + y;
        var z2 = z + z;
        var xx = x * x2;
        var xy = x * y2;
        var xz = x * z2;
        var yy = y * y2;
        var yz = y * z2;
        var zz = z * z2;
        var wx = w * x2;
        var wy = w * y2;
        var wz = w * z2;
        var sx = s[0];
        var sy = s[1];
        var sz = s[2];
        var ox = o[0];
        var oy = o[1];
        var oz = o[2];
        var out0 = (1 - (yy + zz)) * sx;
        var out1 = (xy + wz) * sx;
        var out2 = (xz - wy) * sx;
        var out4 = (xy - wz) * sy;
        var out5 = (1 - (xx + zz)) * sy;
        var out6 = (yz + wx) * sy;
        var out8 = (xz + wy) * sz;
        var out9 = (yz - wx) * sz;
        var out10 = (1 - (xx + yy)) * sz;
        out[0] = out0;
        out[1] = out1;
        out[2] = out2;
        out[3] = 0;
        out[4] = out4;
        out[5] = out5;
        out[6] = out6;
        out[7] = 0;
        out[8] = out8;
        out[9] = out9;
        out[10] = out10;
        out[11] = 0;
        out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
        out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
        out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
        out[15] = 1;
        return out;
      }
      /**
       * Calculates a 4x4 matrix from the given quaternion
       *
       * @param {mat4} out mat4 receiving operation result
       * @param {quat} q Quaternion to create matrix from
       *
       * @returns {mat4} out
       */

      function fromQuat$1(out, q) {
        var x = q[0],
            y = q[1],
            z = q[2],
            w = q[3];
        var x2 = x + x;
        var y2 = y + y;
        var z2 = z + z;
        var xx = x * x2;
        var yx = y * x2;
        var yy = y * y2;
        var zx = z * x2;
        var zy = z * y2;
        var zz = z * z2;
        var wx = w * x2;
        var wy = w * y2;
        var wz = w * z2;
        out[0] = 1 - yy - zz;
        out[1] = yx + wz;
        out[2] = zx - wy;
        out[3] = 0;
        out[4] = yx - wz;
        out[5] = 1 - xx - zz;
        out[6] = zy + wx;
        out[7] = 0;
        out[8] = zx + wy;
        out[9] = zy - wx;
        out[10] = 1 - xx - yy;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;
        return out;
      }
      /**
       * Generates a frustum matrix with the given bounds
       *
       * @param {mat4} out mat4 frustum matrix will be written into
       * @param {Number} left Left bound of the frustum
       * @param {Number} right Right bound of the frustum
       * @param {Number} bottom Bottom bound of the frustum
       * @param {Number} top Top bound of the frustum
       * @param {Number} near Near bound of the frustum
       * @param {Number} far Far bound of the frustum
       * @returns {mat4} out
       */

      function frustum(out, left, right, bottom, top, near, far) {
        var rl = 1 / (right - left);
        var tb = 1 / (top - bottom);
        var nf = 1 / (near - far);
        out[0] = near * 2 * rl;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = near * 2 * tb;
        out[6] = 0;
        out[7] = 0;
        out[8] = (right + left) * rl;
        out[9] = (top + bottom) * tb;
        out[10] = (far + near) * nf;
        out[11] = -1;
        out[12] = 0;
        out[13] = 0;
        out[14] = far * near * 2 * nf;
        out[15] = 0;
        return out;
      }
      /**
       * Generates a perspective projection matrix with the given bounds.
       * Passing null/undefined/no value for far will generate infinite projection matrix.
       *
       * @param {mat4} out mat4 frustum matrix will be written into
       * @param {number} fovy Vertical field of view in radians
       * @param {number} aspect Aspect ratio. typically viewport width/height
       * @param {number} near Near bound of the frustum
       * @param {number} far Far bound of the frustum, can be null or Infinity
       * @returns {mat4} out
       */

      function perspective(out, fovy, aspect, near, far) {
        var f = 1.0 / Math.tan(fovy / 2),
            nf;
        out[0] = f / aspect;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = f;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[11] = -1;
        out[12] = 0;
        out[13] = 0;
        out[15] = 0;

        if (far != null && far !== Infinity) {
          nf = 1 / (near - far);
          out[10] = (far + near) * nf;
          out[14] = 2 * far * near * nf;
        } else {
          out[10] = -1;
          out[14] = -2 * near;
        }

        return out;
      }
      /**
       * Generates a perspective projection matrix with the given field of view.
       * This is primarily useful for generating projection matrices to be used
       * with the still experiemental WebVR API.
       *
       * @param {mat4} out mat4 frustum matrix will be written into
       * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
       * @param {number} near Near bound of the frustum
       * @param {number} far Far bound of the frustum
       * @returns {mat4} out
       */

      function perspectiveFromFieldOfView(out, fov, near, far) {
        var upTan = Math.tan(fov.upDegrees * Math.PI / 180.0);
        var downTan = Math.tan(fov.downDegrees * Math.PI / 180.0);
        var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0);
        var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0);
        var xScale = 2.0 / (leftTan + rightTan);
        var yScale = 2.0 / (upTan + downTan);
        out[0] = xScale;
        out[1] = 0.0;
        out[2] = 0.0;
        out[3] = 0.0;
        out[4] = 0.0;
        out[5] = yScale;
        out[6] = 0.0;
        out[7] = 0.0;
        out[8] = -((leftTan - rightTan) * xScale * 0.5);
        out[9] = (upTan - downTan) * yScale * 0.5;
        out[10] = far / (near - far);
        out[11] = -1.0;
        out[12] = 0.0;
        out[13] = 0.0;
        out[14] = far * near / (near - far);
        out[15] = 0.0;
        return out;
      }
      /**
       * Generates a orthogonal projection matrix with the given bounds
       *
       * @param {mat4} out mat4 frustum matrix will be written into
       * @param {number} left Left bound of the frustum
       * @param {number} right Right bound of the frustum
       * @param {number} bottom Bottom bound of the frustum
       * @param {number} top Top bound of the frustum
       * @param {number} near Near bound of the frustum
       * @param {number} far Far bound of the frustum
       * @returns {mat4} out
       */

      function ortho(out, left, right, bottom, top, near, far) {
        var lr = 1 / (left - right);
        var bt = 1 / (bottom - top);
        var nf = 1 / (near - far);
        out[0] = -2 * lr;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = -2 * bt;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = 2 * nf;
        out[11] = 0;
        out[12] = (left + right) * lr;
        out[13] = (top + bottom) * bt;
        out[14] = (far + near) * nf;
        out[15] = 1;
        return out;
      }
      /**
       * Generates a look-at matrix with the given eye position, focal point, and up axis.
       * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
       *
       * @param {mat4} out mat4 frustum matrix will be written into
       * @param {vec3} eye Position of the viewer
       * @param {vec3} center Point the viewer is looking at
       * @param {vec3} up vec3 pointing up
       * @returns {mat4} out
       */

      function lookAt(out, eye, center, up) {
        var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
        var eyex = eye[0];
        var eyey = eye[1];
        var eyez = eye[2];
        var upx = up[0];
        var upy = up[1];
        var upz = up[2];
        var centerx = center[0];
        var centery = center[1];
        var centerz = center[2];

        if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
          return identity$3(out);
        }

        z0 = eyex - centerx;
        z1 = eyey - centery;
        z2 = eyez - centerz;
        len = 1 / Math.hypot(z0, z1, z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;
        x0 = upy * z2 - upz * z1;
        x1 = upz * z0 - upx * z2;
        x2 = upx * z1 - upy * z0;
        len = Math.hypot(x0, x1, x2);

        if (!len) {
          x0 = 0;
          x1 = 0;
          x2 = 0;
        } else {
          len = 1 / len;
          x0 *= len;
          x1 *= len;
          x2 *= len;
        }

        y0 = z1 * x2 - z2 * x1;
        y1 = z2 * x0 - z0 * x2;
        y2 = z0 * x1 - z1 * x0;
        len = Math.hypot(y0, y1, y2);

        if (!len) {
          y0 = 0;
          y1 = 0;
          y2 = 0;
        } else {
          len = 1 / len;
          y0 *= len;
          y1 *= len;
          y2 *= len;
        }

        out[0] = x0;
        out[1] = y0;
        out[2] = z0;
        out[3] = 0;
        out[4] = x1;
        out[5] = y1;
        out[6] = z1;
        out[7] = 0;
        out[8] = x2;
        out[9] = y2;
        out[10] = z2;
        out[11] = 0;
        out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
        out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
        out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
        out[15] = 1;
        return out;
      }
      /**
       * Generates a matrix that makes something look at something else.
       *
       * @param {mat4} out mat4 frustum matrix will be written into
       * @param {vec3} eye Position of the viewer
       * @param {vec3} center Point the viewer is looking at
       * @param {vec3} up vec3 pointing up
       * @returns {mat4} out
       */

      function targetTo(out, eye, target, up) {
        var eyex = eye[0],
            eyey = eye[1],
            eyez = eye[2],
            upx = up[0],
            upy = up[1],
            upz = up[2];
        var z0 = eyex - target[0],
            z1 = eyey - target[1],
            z2 = eyez - target[2];
        var len = z0 * z0 + z1 * z1 + z2 * z2;

        if (len > 0) {
          len = 1 / Math.sqrt(len);
          z0 *= len;
          z1 *= len;
          z2 *= len;
        }

        var x0 = upy * z2 - upz * z1,
            x1 = upz * z0 - upx * z2,
            x2 = upx * z1 - upy * z0;
        len = x0 * x0 + x1 * x1 + x2 * x2;

        if (len > 0) {
          len = 1 / Math.sqrt(len);
          x0 *= len;
          x1 *= len;
          x2 *= len;
        }

        out[0] = x0;
        out[1] = x1;
        out[2] = x2;
        out[3] = 0;
        out[4] = z1 * x2 - z2 * x1;
        out[5] = z2 * x0 - z0 * x2;
        out[6] = z0 * x1 - z1 * x0;
        out[7] = 0;
        out[8] = z0;
        out[9] = z1;
        out[10] = z2;
        out[11] = 0;
        out[12] = eyex;
        out[13] = eyey;
        out[14] = eyez;
        out[15] = 1;
        return out;
      }
      /**
       * Returns a string representation of a mat4
       *
       * @param {mat4} a matrix to represent as a string
       * @returns {String} string representation of the matrix
       */

      function str$3(a) {
        return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' + a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
      }
      /**
       * Returns Frobenius norm of a mat4
       *
       * @param {mat4} a the matrix to calculate Frobenius norm of
       * @returns {Number} Frobenius norm
       */

      function frob$3(a) {
        return Math.hypot(a[0], a[1], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
      }
      /**
       * Adds two mat4's
       *
       * @param {mat4} out the receiving matrix
       * @param {mat4} a the first operand
       * @param {mat4} b the second operand
       * @returns {mat4} out
       */

      function add$3(out, a, b) {
        out[0] = a[0] + b[0];
        out[1] = a[1] + b[1];
        out[2] = a[2] + b[2];
        out[3] = a[3] + b[3];
        out[4] = a[4] + b[4];
        out[5] = a[5] + b[5];
        out[6] = a[6] + b[6];
        out[7] = a[7] + b[7];
        out[8] = a[8] + b[8];
        out[9] = a[9] + b[9];
        out[10] = a[10] + b[10];
        out[11] = a[11] + b[11];
        out[12] = a[12] + b[12];
        out[13] = a[13] + b[13];
        out[14] = a[14] + b[14];
        out[15] = a[15] + b[15];
        return out;
      }
      /**
       * Subtracts matrix b from matrix a
       *
       * @param {mat4} out the receiving matrix
       * @param {mat4} a the first operand
       * @param {mat4} b the second operand
       * @returns {mat4} out
       */

      function subtract$3(out, a, b) {
        out[0] = a[0] - b[0];
        out[1] = a[1] - b[1];
        out[2] = a[2] - b[2];
        out[3] = a[3] - b[3];
        out[4] = a[4] - b[4];
        out[5] = a[5] - b[5];
        out[6] = a[6] - b[6];
        out[7] = a[7] - b[7];
        out[8] = a[8] - b[8];
        out[9] = a[9] - b[9];
        out[10] = a[10] - b[10];
        out[11] = a[11] - b[11];
        out[12] = a[12] - b[12];
        out[13] = a[13] - b[13];
        out[14] = a[14] - b[14];
        out[15] = a[15] - b[15];
        return out;
      }
      /**
       * Multiply each element of the matrix by a scalar.
       *
       * @param {mat4} out the receiving matrix
       * @param {mat4} a the matrix to scale
       * @param {Number} b amount to scale the matrix's elements by
       * @returns {mat4} out
       */

      function multiplyScalar$3(out, a, b) {
        out[0] = a[0] * b;
        out[1] = a[1] * b;
        out[2] = a[2] * b;
        out[3] = a[3] * b;
        out[4] = a[4] * b;
        out[5] = a[5] * b;
        out[6] = a[6] * b;
        out[7] = a[7] * b;
        out[8] = a[8] * b;
        out[9] = a[9] * b;
        out[10] = a[10] * b;
        out[11] = a[11] * b;
        out[12] = a[12] * b;
        out[13] = a[13] * b;
        out[14] = a[14] * b;
        out[15] = a[15] * b;
        return out;
      }
      /**
       * Adds two mat4's after multiplying each element of the second operand by a scalar value.
       *
       * @param {mat4} out the receiving vector
       * @param {mat4} a the first operand
       * @param {mat4} b the second operand
       * @param {Number} scale the amount to scale b's elements by before adding
       * @returns {mat4} out
       */

      function multiplyScalarAndAdd$3(out, a, b, scale) {
        out[0] = a[0] + b[0] * scale;
        out[1] = a[1] + b[1] * scale;
        out[2] = a[2] + b[2] * scale;
        out[3] = a[3] + b[3] * scale;
        out[4] = a[4] + b[4] * scale;
        out[5] = a[5] + b[5] * scale;
        out[6] = a[6] + b[6] * scale;
        out[7] = a[7] + b[7] * scale;
        out[8] = a[8] + b[8] * scale;
        out[9] = a[9] + b[9] * scale;
        out[10] = a[10] + b[10] * scale;
        out[11] = a[11] + b[11] * scale;
        out[12] = a[12] + b[12] * scale;
        out[13] = a[13] + b[13] * scale;
        out[14] = a[14] + b[14] * scale;
        out[15] = a[15] + b[15] * scale;
        return out;
      }
      /**
       * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
       *
       * @param {mat4} a The first matrix.
       * @param {mat4} b The second matrix.
       * @returns {Boolean} True if the matrices are equal, false otherwise.
       */

      function exactEquals$3(a, b) {
        return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
      }
      /**
       * Returns whether or not the matrices have approximately the same elements in the same position.
       *
       * @param {mat4} a The first matrix.
       * @param {mat4} b The second matrix.
       * @returns {Boolean} True if the matrices are equal, false otherwise.
       */

      function equals$4(a, b) {
        var a0 = a[0],
            a1 = a[1],
            a2 = a[2],
            a3 = a[3];
        var a4 = a[4],
            a5 = a[5],
            a6 = a[6],
            a7 = a[7];
        var a8 = a[8],
            a9 = a[9],
            a10 = a[10],
            a11 = a[11];
        var a12 = a[12],
            a13 = a[13],
            a14 = a[14],
            a15 = a[15];
        var b0 = b[0],
            b1 = b[1],
            b2 = b[2],
            b3 = b[3];
        var b4 = b[4],
            b5 = b[5],
            b6 = b[6],
            b7 = b[7];
        var b8 = b[8],
            b9 = b[9],
            b10 = b[10],
            b11 = b[11];
        var b12 = b[12],
            b13 = b[13],
            b14 = b[14],
            b15 = b[15];
        return Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= EPSILON * Math.max(1.0, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= EPSILON * Math.max(1.0, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= EPSILON * Math.max(1.0, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= EPSILON * Math.max(1.0, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= EPSILON * Math.max(1.0, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= EPSILON * Math.max(1.0, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= EPSILON * Math.max(1.0, Math.abs(a15), Math.abs(b15));
      }
      /**
       * Alias for {@link mat4.multiply}
       * @function
       */

      var mul$3 = multiply$3;
      /**
       * Alias for {@link mat4.subtract}
       * @function
       */

      var sub$3 = subtract$3;

      var mat4 = /*#__PURE__*/Object.freeze({
        create: create$3,
        clone: clone$3,
        copy: copy$3,
        fromValues: fromValues$3,
        set: set$3,
        identity: identity$3,
        transpose: transpose$2,
        invert: invert$3,
        adjoint: adjoint$2,
        determinant: determinant$3,
        multiply: multiply$3,
        translate: translate$2,
        scale: scale$3,
        rotate: rotate$3,
        rotateX: rotateX,
        rotateY: rotateY,
        rotateZ: rotateZ,
        fromTranslation: fromTranslation$2,
        fromScaling: fromScaling$3,
        fromRotation: fromRotation$3,
        fromXRotation: fromXRotation,
        fromYRotation: fromYRotation,
        fromZRotation: fromZRotation,
        fromRotationTranslation: fromRotationTranslation,
        fromQuat2: fromQuat2,
        getTranslation: getTranslation,
        getScaling: getScaling,
        getRotation: getRotation,
        fromRotationTranslationScale: fromRotationTranslationScale,
        fromRotationTranslationScaleOrigin: fromRotationTranslationScaleOrigin,
        fromQuat: fromQuat$1,
        frustum: frustum,
        perspective: perspective,
        perspectiveFromFieldOfView: perspectiveFromFieldOfView,
        ortho: ortho,
        lookAt: lookAt,
        targetTo: targetTo,
        str: str$3,
        frob: frob$3,
        add: add$3,
        subtract: subtract$3,
        multiplyScalar: multiplyScalar$3,
        multiplyScalarAndAdd: multiplyScalarAndAdd$3,
        exactEquals: exactEquals$3,
        equals: equals$4,
        mul: mul$3,
        sub: sub$3
      });

      /**
       * 3 Dimensional Vector
       * @module vec3
       */

      /**
       * Creates a new, empty vec3
       *
       * @returns {vec3} a new 3D vector
       */

      function create$4() {
        var out = new ARRAY_TYPE(3);

        if (ARRAY_TYPE != Float32Array) {
          out[0] = 0;
          out[1] = 0;
          out[2] = 0;
        }

        return out;
      }
      /**
       * Calculates the length of a vec3
       *
       * @param {vec3} a vector to calculate length of
       * @returns {Number} length of a
       */

      function length(a) {
        var x = a[0];
        var y = a[1];
        var z = a[2];
        return Math.hypot(x, y, z);
      }
      /**
       * Creates a new vec3 initialized with the given values
       *
       * @param {Number} x X component
       * @param {Number} y Y component
       * @param {Number} z Z component
       * @returns {vec3} a new 3D vector
       */

      function fromValues$4(x, y, z) {
        var out = new ARRAY_TYPE(3);
        out[0] = x;
        out[1] = y;
        out[2] = z;
        return out;
      }
      /**
       * Normalize a vec3
       *
       * @param {vec3} out the receiving vector
       * @param {vec3} a vector to normalize
       * @returns {vec3} out
       */

      function normalize(out, a) {
        var x = a[0];
        var y = a[1];
        var z = a[2];
        var len = x * x + y * y + z * z;

        if (len > 0) {
          //TODO: evaluate use of glm_invsqrt here?
          len = 1 / Math.sqrt(len);
        }

        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
        return out;
      }
      /**
       * Calculates the dot product of two vec3's
       *
       * @param {vec3} a the first operand
       * @param {vec3} b the second operand
       * @returns {Number} dot product of a and b
       */

      function dot(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
      }
      /**
       * Computes the cross product of two vec3's
       *
       * @param {vec3} out the receiving vector
       * @param {vec3} a the first operand
       * @param {vec3} b the second operand
       * @returns {vec3} out
       */

      function cross(out, a, b) {
        var ax = a[0],
            ay = a[1],
            az = a[2];
        var bx = b[0],
            by = b[1],
            bz = b[2];
        out[0] = ay * bz - az * by;
        out[1] = az * bx - ax * bz;
        out[2] = ax * by - ay * bx;
        return out;
      }
      /**
       * Alias for {@link vec3.length}
       * @function
       */

      var len = length;
      /**
       * Perform some operation over an array of vec3s.
       *
       * @param {Array} a the array of vectors to iterate over
       * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
       * @param {Number} offset Number of elements to skip at the beginning of the array
       * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
       * @param {Function} fn Function to call for each vector in the array
       * @param {Object} [arg] additional argument to pass to fn
       * @returns {Array} a
       * @function
       */

      var forEach = function () {
        var vec = create$4();
        return function (a, stride, offset, count, fn, arg) {
          var i, l;

          if (!stride) {
            stride = 3;
          }

          if (!offset) {
            offset = 0;
          }

          if (count) {
            l = Math.min(count * stride + offset, a.length);
          } else {
            l = a.length;
          }

          for (i = offset; i < l; i += stride) {
            vec[0] = a[i];
            vec[1] = a[i + 1];
            vec[2] = a[i + 2];
            fn(vec, vec, arg);
            a[i] = vec[0];
            a[i + 1] = vec[1];
            a[i + 2] = vec[2];
          }

          return a;
        };
      }();

      /**
       * 4 Dimensional Vector
       * @module vec4
       */

      /**
       * Creates a new, empty vec4
       *
       * @returns {vec4} a new 4D vector
       */

      function create$5() {
        var out = new ARRAY_TYPE(4);

        if (ARRAY_TYPE != Float32Array) {
          out[0] = 0;
          out[1] = 0;
          out[2] = 0;
          out[3] = 0;
        }

        return out;
      }
      /**
       * Normalize a vec4
       *
       * @param {vec4} out the receiving vector
       * @param {vec4} a vector to normalize
       * @returns {vec4} out
       */

      function normalize$1(out, a) {
        var x = a[0];
        var y = a[1];
        var z = a[2];
        var w = a[3];
        var len = x * x + y * y + z * z + w * w;

        if (len > 0) {
          len = 1 / Math.sqrt(len);
        }

        out[0] = x * len;
        out[1] = y * len;
        out[2] = z * len;
        out[3] = w * len;
        return out;
      }
      /**
       * Perform some operation over an array of vec4s.
       *
       * @param {Array} a the array of vectors to iterate over
       * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
       * @param {Number} offset Number of elements to skip at the beginning of the array
       * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
       * @param {Function} fn Function to call for each vector in the array
       * @param {Object} [arg] additional argument to pass to fn
       * @returns {Array} a
       * @function
       */

      var forEach$1 = function () {
        var vec = create$5();
        return function (a, stride, offset, count, fn, arg) {
          var i, l;

          if (!stride) {
            stride = 4;
          }

          if (!offset) {
            offset = 0;
          }

          if (count) {
            l = Math.min(count * stride + offset, a.length);
          } else {
            l = a.length;
          }

          for (i = offset; i < l; i += stride) {
            vec[0] = a[i];
            vec[1] = a[i + 1];
            vec[2] = a[i + 2];
            vec[3] = a[i + 3];
            fn(vec, vec, arg);
            a[i] = vec[0];
            a[i + 1] = vec[1];
            a[i + 2] = vec[2];
            a[i + 3] = vec[3];
          }

          return a;
        };
      }();

      /**
       * Quaternion
       * @module quat
       */

      /**
       * Creates a new identity quat
       *
       * @returns {quat} a new quaternion
       */

      function create$6() {
        var out = new ARRAY_TYPE(4);

        if (ARRAY_TYPE != Float32Array) {
          out[0] = 0;
          out[1] = 0;
          out[2] = 0;
        }

        out[3] = 1;
        return out;
      }
      /**
       * Sets a quat from the given angle and rotation axis,
       * then returns it.
       *
       * @param {quat} out the receiving quaternion
       * @param {vec3} axis the axis around which to rotate
       * @param {Number} rad the angle in radians
       * @returns {quat} out
       **/

      function setAxisAngle(out, axis, rad) {
        rad = rad * 0.5;
        var s = Math.sin(rad);
        out[0] = s * axis[0];
        out[1] = s * axis[1];
        out[2] = s * axis[2];
        out[3] = Math.cos(rad);
        return out;
      }
      /**
       * Performs a spherical linear interpolation between two quat
       *
       * @param {quat} out the receiving quaternion
       * @param {quat} a the first operand
       * @param {quat} b the second operand
       * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
       * @returns {quat} out
       */

      function slerp(out, a, b, t) {
        // benchmarks:
        //    http://jsperf.com/quaternion-slerp-implementations
        var ax = a[0],
            ay = a[1],
            az = a[2],
            aw = a[3];
        var bx = b[0],
            by = b[1],
            bz = b[2],
            bw = b[3];
        var omega, cosom, sinom, scale0, scale1; // calc cosine

        cosom = ax * bx + ay * by + az * bz + aw * bw; // adjust signs (if necessary)

        if (cosom < 0.0) {
          cosom = -cosom;
          bx = -bx;
          by = -by;
          bz = -bz;
          bw = -bw;
        } // calculate coefficients


        if (1.0 - cosom > EPSILON) {
          // standard case (slerp)
          omega = Math.acos(cosom);
          sinom = Math.sin(omega);
          scale0 = Math.sin((1.0 - t) * omega) / sinom;
          scale1 = Math.sin(t * omega) / sinom;
        } else {
          // "from" and "to" quaternions are very close
          //  ... so we can do a linear interpolation
          scale0 = 1.0 - t;
          scale1 = t;
        } // calculate final values


        out[0] = scale0 * ax + scale1 * bx;
        out[1] = scale0 * ay + scale1 * by;
        out[2] = scale0 * az + scale1 * bz;
        out[3] = scale0 * aw + scale1 * bw;
        return out;
      }
      /**
       * Creates a quaternion from the given 3x3 rotation matrix.
       *
       * NOTE: The resultant quaternion is not normalized, so you should be sure
       * to renormalize the quaternion yourself where necessary.
       *
       * @param {quat} out the receiving quaternion
       * @param {mat3} m rotation matrix
       * @returns {quat} out
       * @function
       */

      function fromMat3(out, m) {
        // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
        // article "Quaternion Calculus and Fast Animation".
        var fTrace = m[0] + m[4] + m[8];
        var fRoot;

        if (fTrace > 0.0) {
          // |w| > 1/2, may as well choose w > 1/2
          fRoot = Math.sqrt(fTrace + 1.0); // 2w

          out[3] = 0.5 * fRoot;
          fRoot = 0.5 / fRoot; // 1/(4w)

          out[0] = (m[5] - m[7]) * fRoot;
          out[1] = (m[6] - m[2]) * fRoot;
          out[2] = (m[1] - m[3]) * fRoot;
        } else {
          // |w| <= 1/2
          var i = 0;
          if (m[4] > m[0]) i = 1;
          if (m[8] > m[i * 3 + i]) i = 2;
          var j = (i + 1) % 3;
          var k = (i + 2) % 3;
          fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
          out[i] = 0.5 * fRoot;
          fRoot = 0.5 / fRoot;
          out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
          out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
          out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
        }

        return out;
      }
      /**
       * Normalize a quat
       *
       * @param {quat} out the receiving quaternion
       * @param {quat} a quaternion to normalize
       * @returns {quat} out
       * @function
       */

      var normalize$2 = normalize$1;
      /**
       * Sets a quaternion to represent the shortest rotation from one
       * vector to another.
       *
       * Both vectors are assumed to be unit length.
       *
       * @param {quat} out the receiving quaternion.
       * @param {vec3} a the initial vector
       * @param {vec3} b the destination vector
       * @returns {quat} out
       */

      var rotationTo = function () {
        var tmpvec3 = create$4();
        var xUnitVec3 = fromValues$4(1, 0, 0);
        var yUnitVec3 = fromValues$4(0, 1, 0);
        return function (out, a, b) {
          var dot$1 = dot(a, b);

          if (dot$1 < -0.999999) {
            cross(tmpvec3, xUnitVec3, a);
            if (len(tmpvec3) < 0.000001) cross(tmpvec3, yUnitVec3, a);
            normalize(tmpvec3, tmpvec3);
            setAxisAngle(out, tmpvec3, Math.PI);
            return out;
          } else if (dot$1 > 0.999999) {
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
          } else {
            cross(tmpvec3, a, b);
            out[0] = tmpvec3[0];
            out[1] = tmpvec3[1];
            out[2] = tmpvec3[2];
            out[3] = 1 + dot$1;
            return normalize$2(out, out);
          }
        };
      }();
      /**
       * Performs a spherical linear interpolation with two control points
       *
       * @param {quat} out the receiving quaternion
       * @param {quat} a the first operand
       * @param {quat} b the second operand
       * @param {quat} c the third operand
       * @param {quat} d the fourth operand
       * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
       * @returns {quat} out
       */

      var sqlerp = function () {
        var temp1 = create$6();
        var temp2 = create$6();
        return function (out, a, b, c, d, t) {
          slerp(temp1, a, d, t);
          slerp(temp2, b, c, t);
          slerp(out, temp1, temp2, 2 * t * (1 - t));
          return out;
        };
      }();
      /**
       * Sets the specified quaternion with values corresponding to the given
       * axes. Each axis is a vec3 and is expected to be unit length and
       * perpendicular to all other specified axes.
       *
       * @param {vec3} view  the vector representing the viewing direction
       * @param {vec3} right the vector representing the local "right" direction
       * @param {vec3} up    the vector representing the local "up" direction
       * @returns {quat} out
       */

      var setAxes = function () {
        var matr = create$2();
        return function (out, view, right, up) {
          matr[0] = right[0];
          matr[3] = right[1];
          matr[6] = right[2];
          matr[1] = up[0];
          matr[4] = up[1];
          matr[7] = up[2];
          matr[2] = -view[0];
          matr[5] = -view[1];
          matr[8] = -view[2];
          return normalize$2(out, fromMat3(out, matr));
        };
      }();

      /**
       * 2 Dimensional Vector
       * @module vec2
       */

      /**
       * Creates a new, empty vec2
       *
       * @returns {vec2} a new 2D vector
       */

      function create$8() {
        var out = new ARRAY_TYPE(2);

        if (ARRAY_TYPE != Float32Array) {
          out[0] = 0;
          out[1] = 0;
        }

        return out;
      }
      /**
       * Perform some operation over an array of vec2s.
       *
       * @param {Array} a the array of vectors to iterate over
       * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
       * @param {Number} offset Number of elements to skip at the beginning of the array
       * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
       * @param {Function} fn Function to call for each vector in the array
       * @param {Object} [arg] additional argument to pass to fn
       * @returns {Array} a
       * @function
       */

      var forEach$2 = function () {
        var vec = create$8();
        return function (a, stride, offset, count, fn, arg) {
          var i, l;

          if (!stride) {
            stride = 2;
          }

          if (!offset) {
            offset = 0;
          }

          if (count) {
            l = Math.min(count * stride + offset, a.length);
          } else {
            l = a.length;
          }

          for (i = offset; i < l; i += stride) {
            vec[0] = a[i];
            vec[1] = a[i + 1];
            fn(vec, vec, arg);
            a[i] = vec[0];
            a[i + 1] = vec[1];
          }

          return a;
        };
      }();

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
        let matrix1 = projectionMatrix.multiply(this._matrices.position);
        //console.log(matrix1);
        let matrix2 = matrix1.multiply(this._matrices.rotation.x);
        //console.log(matrix2);
        let matrix3 = matrix2.multiply(this._matrices.rotation.y);
        //console.log(matrix2, this._matrices.rotation.y, matrix2.multiply(this._matrices.rotation.y));
        let matrix4 = matrix3.multiply(this._matrices.rotation.z);
        //console.log(matrix4);
        let matrix5 = matrix4.multiply(this._matrices.scale);
        //console.log(matrix5);
        const out = [];
        mat4.multiply(out, matrix1.elements, this._matrices.rotation.x.elements);
        console.log(out);
        console.log(matrix5.elements);
          
        this._context.uniformMatrix4fv(this._material._uniforms.uMatrixLoc, false, matrix5.elements);
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
        //this.rotation = { x: 0, y: elapsedTime * 0.5, z: 0 };
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
        this.mesh2.position = new Vector3({ x: 1, y: 0, z: 0 });
        //this.mesh2.rotation = new Vector3({ x: 0, y: DegToRad(45), z: 0 });

        this.scene = new Scene();
        this.scene.add(/*this.mesh1,*/ this.mesh2);
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
      updater.stop();
    } catch (e) {
      console.error(e);
      updater.stop();
    }

}());
