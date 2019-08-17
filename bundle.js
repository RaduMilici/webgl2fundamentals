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

    const isNumeric = (n) => {
        return !isNaN(parseFloat(n.toString())) && isFinite(n);
    };
    //# sourceMappingURL=number.js.map

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

    const randomFloat = (min, max) => {
        return Math.random() * (max - min) + min;
    };
    //# sourceMappingURL=random.js.map

    let id = 0;
    const uniqueId = () => id++;
    //# sourceMappingURL=uniqueID.js.map

    class DisjoinedSet {
        constructor(point) {
            this.id = uniqueId();
            this.points = [point];
        }
        equals({ id }) {
            return this.id === id;
        }
        merge({ points }) {
            points.forEach((point) => {
                point.set = this;
                this.points.push(point);
            });
            return this;
        }
    }
    //# sourceMappingURL=DisjoinedSet.js.map

    class Matrix2 {
        constructor(a, b, c, d) {
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
        }
        determine() {
            return this.a * this.d - this.b * this.c;
        }
    }
    class Matrix3 extends Matrix2 {
        constructor(a, b, c, d, e, f, g, h, i) {
            super(a, b, c, d);
            this.e = e;
            this.f = f;
            this.g = g;
            this.h = h;
            this.i = i;
        }
        determine() {
            return (this.a * new Matrix2(this.e, this.f, this.h, this.i).determine() -
                this.b * new Matrix2(this.d, this.f, this.g, this.i).determine() +
                this.c * new Matrix2(this.d, this.e, this.g, this.h).determine());
        }
    }
    class Matrix4 extends Matrix3 {
        constructor(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
            super(a, b, c, d, e, f, g, h, i);
            this.j = j;
            this.k = k;
            this.l = l;
            this.m = m;
            this.n = n;
            this.o = o;
            this.p = p;
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
    }
    //# sourceMappingURL=Matrix.js.map

    // https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
    class LineIntersection {
        constructor(line1, line2) {
            this.line1 = line1;
            this.line2 = line2;
            // points
            this.x1 = this.line1.a.x;
            this.y1 = this.line1.a.y;
            this.x2 = this.line1.b.x;
            this.y2 = this.line1.b.y;
            this.x3 = this.line2.a.x;
            this.y3 = this.line2.a.y;
            this.x4 = this.line2.b.x;
            this.y4 = this.line2.b.y;
            // shared matrices
            const e = new Matrix2(this.x1, 1, this.x2, 1);
            const f = new Matrix2(this.y1, 1, this.y2, 1);
            const g = new Matrix2(this.x3, 1, this.x4, 1);
            const h = new Matrix2(this.y3, 1, this.y4, 1);
            const efgh = new Matrix2(e.determine(), f.determine(), g.determine(), h.determine());
            this.efghDeterminant = efgh.determine();
        }
        get intersects() {
            const areValidCoords = isNumeric(this.point.x) && isNumeric(this.point.y);
            return areValidCoords && this.isOnSegments();
        }
        get point() {
            const x = this.getX();
            const y = this.getY();
            return new Vector({ x, y });
        }
        getX() {
            const a = new Matrix2(this.x1, this.y1, this.x2, this.y2);
            const b = new Matrix2(this.x1, 1, this.x2, 1);
            const c = new Matrix2(this.x3, this.y3, this.x4, this.y4);
            const d = new Matrix2(this.x3, 1, this.x4, 1);
            const abcd = new Matrix2(a.determine(), b.determine(), c.determine(), d.determine());
            return abcd.determine() / this.efghDeterminant;
        }
        getY() {
            const a = new Matrix2(this.x1, this.y1, this.x2, this.y2);
            const b = new Matrix2(this.y1, 1, this.y2, 1);
            const c = new Matrix2(this.x3, this.y3, this.x4, this.y4);
            const d = new Matrix2(this.y3, 1, this.y4, 1);
            const abcd = new Matrix2(a.determine(), b.determine(), c.determine(), d.determine());
            return abcd.determine() / this.efghDeterminant;
        }
        isOnSegments() {
            const a = new Matrix2(this.x1 - this.x3, this.x3 - this.x4, this.y1 - this.y3, this.y3 - this.y4);
            const b = new Matrix2(this.x1 - this.x2, this.x3 - this.x4, this.y1 - this.y2, this.y3 - this.y4);
            const c = new Matrix2(this.x1 - this.x2, this.x1 - this.x3, this.y1 - this.y2, this.y1 - this.y3);
            const d = new Matrix2(this.x1 - this.x2, this.x3 - this.x4, this.y1 - this.y2, this.y3 - this.y4);
            const divisionAB = a.determine() / b.determine();
            const divisionCD = -(c.determine() / d.determine());
            const isOnSegmentA = divisionAB >= 0 && divisionAB <= 1;
            const isOnSegmentB = divisionCD >= 0 && divisionCD <= 1;
            return isOnSegmentA && isOnSegmentB;
        }
    }
    //# sourceMappingURL=LineIntersection.js.map

    class Line {
        constructor(a, b) {
            this.a = a;
            this.b = b;
            this.id = uniqueId();
        }
        get length() {
            return this.a.sub(this.b).magnitude();
        }
        get midpoint() {
            return this.a.midpoint(this.b);
        }
        clone() {
            return new Line(this.a, this.b);
        }
        equals(line) {
            const equalsNormal = this.a.equals(line.a) && this.b.equals(line.b);
            const equalsReverse = this.a.equals(line.b) && this.b.equals(line.a);
            return equalsNormal || equalsReverse;
        }
        intersects(line) {
            return new LineIntersection(this, line).intersects;
        }
        intersectionPoint(line) {
            return new LineIntersection(this, line).point;
        }
        makeDisjoinedSets() {
            this.a.set = new DisjoinedSet(this.a);
            this.b.set = new DisjoinedSet(this.b);
        }
        static PointsFromArray(lines) {
            return lines.reduce((accumulator, line) => {
                accumulator.push(...[line.a, line.b]);
                return accumulator;
            }, []);
        }
        static IsUnique(line, lines) {
            return (lines.find((currentLine) => {
                return line.id === currentLine.id ? false : line.equals(currentLine);
            }) === undefined);
        }
        static RemoveDuplicates(lines) {
            let clone = [...lines];
            clone.sort((a, b) => a.length - b.length);
            for (let i = clone.length - 1; i >= 1; i--) {
                const a = clone[i];
                const b = clone[i - 1];
                if (a.equals(b)) {
                    clone.splice(i, 1);
                }
            }
            return clone;
        }
    }
    //# sourceMappingURL=Line.js.map

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

    class Triangle {
        constructor(a, b, c) {
            this.a = a;
            this.b = b;
            this.c = c;
            this.id = uniqueId();
            const ab = new Line(a, b);
            const bc = new Line(b, c);
            const ca = new Line(c, a);
            this.lines = { ab, bc, ca };
        }
        get centroid() {
            return Vector.FindPolyCentroid(this.points);
        }
        get points() {
            return [this.a, this.b, this.c];
        }
        get linesArray() {
            return [this.lines.ab, this.lines.bc, this.lines.ca];
        }
        equals(triangle) {
            const { ab, bc, ca } = this.lines;
            const sameAB = ab.equals(triangle.lines.ab) ||
                ab.equals(triangle.lines.bc) ||
                ab.equals(triangle.lines.ca);
            const sameBC = bc.equals(triangle.lines.ab) ||
                bc.equals(triangle.lines.bc) ||
                bc.equals(triangle.lines.ca);
            const sameCA = ca.equals(triangle.lines.ab) ||
                ca.equals(triangle.lines.bc) ||
                ca.equals(triangle.lines.ca);
            return sameAB && sameBC && sameCA;
        }
        isPointInCircumcircle(point) {
            const ax = this.a.x;
            const ay = this.a.y;
            const bx = this.b.x;
            const by = this.b.y;
            const cx = this.c.x;
            const cy = this.c.y;
            const a = ax;
            const b = ay;
            const c = ax * ax + ay * ay;
            const d = 1;
            const e = bx;
            const f = by;
            const g = bx * bx + by * by;
            const h = 1;
            const i = cx;
            const j = cy;
            const k = cx * cx + cy * cy;
            const l = 1;
            const m = point.x;
            const n = point.y;
            const o = point.x * point.x + point.y * point.y;
            const p = 1;
            const matrix = new Matrix4(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
            return matrix.determine() < 0;
        }
        hasPoint(point) {
            return this.a.equals(point) || this.b.equals(point) || this.c.equals(point);
        }
        hasAnyPoint(points) {
            return (points.filter((point) => {
                return this.hasPoint(point);
            }).length !== 0);
        }
        static LinesFromArray(triangles) {
            return triangles.reduce((accumulator, triangle) => {
                accumulator.push(...triangle.linesArray);
                return accumulator;
            }, []);
        }
        static GetUniqueLines(triangles) {
            const lines = Triangle.LinesFromArray(triangles);
            return lines.filter((line) => Line.IsUnique(line, lines));
        }
    }
    //# sourceMappingURL=Triangle.js.map

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
        scenes.forEach(scene => scene._renderChildren());
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
        const coords = this.vertices.reduce((acc, { x, y }) => {
          acc.push(x, y);
          return acc;
        }, []);

        return new Float32Array(coords);
      }
    }

    var fsSource = "#version 300 es\nprecision mediump float;out vec4 color;in vec3 fragColor;void main(){vec2 xy=sin(gl_FragCoord.xy*0.05);float g=fract(xy.x*xy.y);color=vec4(0.,g,0.,1.);}";

    var vsSource = "#version 300 es\nin vec2 a_position;in vec3 a_vertColor;uniform vec2 u_translation;uniform vec2 u_rotation;uniform vec2 u_scale;uniform float u_pointSize;out vec3 fragColor;void main(){fragColor=a_vertColor;float rotatedX=a_position.x*u_rotation.y+a_position.y*u_rotation.x;float rotatedY=a_position.y*u_rotation.y-a_position.x*u_rotation.x;vec2 rotatedPosition=vec2(rotatedX,rotatedY);gl_PointSize=u_pointSize;gl_Position=vec4(rotatedPosition*u_scale+u_translation,0.,1.);}";

    class Mesh {
      constructor({ context, geometry, material }) {
        this.id = uniqueId();
        this._context = context;
        this._geometry = geometry;
        this._material = material;
        this._geometryBuffer = this._context.createBuffer();
        this._position = new Float32Array([0, 0]);
        this._rotation = new Float32Array([0, 1]);
        this._scale = new Float32Array([1, 1]);
        this._updateQ = [];
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
        };
      }

      set position({ x, y }) {
        this._position = new Float32Array([x, y]);
        this._addUpdate(() => this._setPositionUniform());
      }

      set rotation(radians) {
        this._rotation = new Float32Array([Math.sin(radians), Math.cos(radians)]);
        this._addUpdate(() => this._setRotationUniform());
      }

      set scale({ x, y }) {
        this._scale = new Float32Array([x, y]);
        this._addUpdate(() => this._setScaleUniform());
      }

      _init() {
        this._context.useProgram(this._material._program.gl_program);
        this._context.bindBuffer(this._context.ARRAY_BUFFER, this._geometryBuffer);
        this._setScaleUniform();
        this._setPositionUniform();
        this._setRotationUniform();
      }

      _renderImmediate() {
        this._context.useProgram(this._material._program.gl_program);
        this._context.bindBuffer(this._context.ARRAY_BUFFER, this._geometryBuffer);
        this._context.bufferData(
          this._context.ARRAY_BUFFER,
          this._geometry._vertexCoords,
          this._context.STATIC_DRAW
        );
        this._material._enableAttribs();
        this._update();
        this._context.drawArrays(this._context.TRIANGLES, 0, this._geometry.vertices.length);
        this._context.useProgram(null);
      }

      _setRotationUniform() {
        this._context.uniform2fv(this._material._uniforms.uRotationLoc, this._rotation);
      }

      _setPositionUniform() {
        this._context.uniform2fv(this._material._uniforms.uTranslationLoc, this._position);
      }

      _setScaleUniform() {
        this._context.uniform2fv(this._material._uniforms.uScaleLoc, this._scale);
      }

      _addUpdate(callback) {
        this._updateQ.push(callback);
      }

      _update() {
        this._updateQ.forEach(update => update());
        this._updateQ.length = 0;
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
          2,
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
        const uTranslationLoc = this._getUniformLocation('u_translation');
        const uScaleLoc = this._getUniformLocation('u_scale');
        const uRotationLoc = this._getUniformLocation('u_rotation');

        return { uTranslationLoc, uScaleLoc, uRotationLoc };
      }

      _getAttribLocation(name) {
        return this._context.getAttribLocation(this._program.gl_program, name);
      }

      _getUniformLocation(name) {
        return this._context.getUniformLocation(this._program.gl_program, name);
      }
    }

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
        super({ context, vertexShaderSrc: vsSource, fragmentShaderSrc });
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
      _renderChildren() {
        this._objects.forEach(child => child._renderImmediate());
      }

      _getChildIndex(object) {
        return this._objects.indexOf(object);
      }
    }

    const randomTris = num => {
      const tris = [];

      for (let i = 0; i < num; i++) {
        const a = new Vector({ x: randomFloat(-1, 1), y: randomFloat(-1, 1) });
        const b = new Vector({ x: randomFloat(-1, 1), y: randomFloat(-1, 1) });
        const c = new Vector({ x: randomFloat(-1, 1), y: randomFloat(-1, 1) });
        const triangle = new Triangle(a, b, c);
        tris.push(triangle);
      }

      return tris;
    };

    class RotatingMesh extends Mesh {
      update({ elapsedTime }) {
        const posX = Math.sin(elapsedTime);
        this.position = new Vector({ x: posX, y: posX });
        this.rotation = elapsedTime * 0.5;
      }
    }

    class Draw extends Component {
      constructor() {
        super();

        this.renderer = new Renderer({
          canvasSelector: '#webGl',
          clearColor: { r: 0, g: 0, b: 0, a: 1 },
          size: { width: 500, height: 500 },
        });

        const material = new Material({
          context: this.renderer.context,
          vertexShaderSrc: vsSource,
          fragmentShaderSrc: fsSource,
        });

        const basicMaterial = new BasicMaterial({
          context: this.renderer.context,
        });
        basicMaterial.color = new Color({ r: 0, g: 1, b: 0 });

        this.mesh = new RotatingMesh({
          context: this.renderer.context,
          geometry: new Geometry(randomTris(3)),
          material,
        });

        this.basicMesh = new RotatingMesh({
          context: this.renderer.context,
          geometry: new Geometry(randomTris(3)),
          material: basicMaterial,
        });

        this.scene = new Scene();
        this.scene.add(this.mesh, this.basicMesh);
      }

      update(timeData) {
        this.mesh.update(timeData);
        this.basicMesh.update(timeData);
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
