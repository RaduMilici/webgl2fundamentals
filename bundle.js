'use strict';
(function() {
  let l = (a, b) => a.findIndex(c => c.id === b.id),
    q = (a, b) => (0 <= b && b < a.length ? (a.splice(b, 1), !0) : !1);
  class e {
    constructor({ x: a, y: b } = { x: 0, y: 0 }) {
      this.x = a;
      this.y = b;
    }
    clone() {
      return new e({ x: this.x, y: this.y });
    }
    N() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    Ia({ x: a, y: b }) {
      return this.x * a + this.y * b;
    }
    add(a) {
      return new e({ x: this.x + a.x, y: this.y + a.y });
    }
    sub(a) {
      return new e({ x: this.x + -a.x, y: this.y + -a.y });
    }
    normalize() {
      let a = this.N();
      return new e({ x: this.x / a, y: this.y / a });
    }
    scale(a) {
      let b = this.normalize();
      return new e({ x: b.x * a, y: b.y * a });
    }
    b(a) {
      return this.x === a.x && this.y === a.y;
    }
    static oa(a) {
      let b = 0,
        c = 0;
      a.forEach(d => {
        b += d.x;
        c += d.y;
      });
      b /= a.length;
      c /= a.length;
      return new e({ x: b, y: c });
    }
    static Za(a) {
      let b = e.oa(a);
      a = [...a];
      a.sort((c, d) => Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(d.y - b.y, d.x - b.x));
      return a;
    }
    static eb(a) {
      return a.filter((b, c, d) => d.findIndex(f => b.b(f)) === c);
    }
    angle(a) {
      return Math.acos(this.Ia(a) / (this.N() * a.N()));
    }
  }
  let g = 0;
  class h {
    constructor(a, b) {
      this.g = a;
      this.c = b;
      this.id = g++;
    }
    get length() {
      return this.g.sub(this.c).N();
    }
    clone() {
      return new h(this.g, this.c);
    }
    b(a) {
      let b = this.g.b(a.c) && this.c.b(a.g);
      return (this.g.b(a.g) && this.c.b(a.c)) || b;
    }
    static bb(a) {
      return a.reduce((b, c) => {
        b.push(...[c.g, c.c]);
        return b;
      }, []);
    }
    static pa(a, b) {
      return void 0 === b.find(c => (a.id === c.id ? !1 : a.b(c)));
    }
    static cb(a) {
      a = [...a];
      a.sort((b, c) => b.length - c.length);
      for (let b = a.length - 1; 1 <= b; b--) {
        a[b].b(a[b - 1]) && a.splice(b, 1);
      }
      return a;
    }
  }
  class y {
    constructor() {
      this.elapsedTime = this.V = this.startTime = 0;
      this.l = !1;
      this.ka = 'undefined' === typeof performance ? Date : performance;
    }
    start() {
      this.l = !0;
      this.V = this.startTime = this.ka.now();
      this.elapsedTime = 0;
    }
    stop() {
      this.l = !1;
    }
    Ka() {
      let a = this.ka.now(),
        b = (a - this.V) / 1000;
      this.V = a;
      this.elapsedTime += b;
      return b;
    }
  }
  class r {
    constructor(a, b, c) {
      this.g = a;
      this.c = b;
      this.Ga = c;
      this.id = g++;
      let d = new h(a, b);
      b = new h(b, c);
      a = new h(c, a);
      this.lines = { A: d, B: b, C: a };
    }
    get Pa() {
      return [this.g, this.c, this.Ga];
    }
    get Na() {
      return [this.lines.A, this.lines.B, this.lines.C];
    }
    b(a) {
      let { A: b, B: c, C: d } = this.lines,
        f = c.b(a.lines.A) || c.b(a.lines.B) || c.b(a.lines.C),
        m = d.b(a.lines.A) || d.b(a.lines.B) || d.b(a.lines.C);
      return (b.b(a.lines.A) || b.b(a.lines.B) || b.b(a.lines.C)) && f && m;
    }
    static qa(a) {
      return a.reduce((b, c) => {
        b.push(...c.Na);
        return b;
      }, []);
    }
    static ab(a) {
      let b = r.qa(a);
      return b.filter(c => h.pa(c, b));
    }
  }
  class k {
    constructor() {
      this.id = g++;
      this.ma = null;
    }
    start() {}
    stop() {}
    update() {}
  }
  class z {
    constructor(a) {
      this.s = a;
      this.entities = [];
    }
    start() {
      this.entities.forEach(a => a.start());
    }
    stop() {
      this.entities.forEach(a => a.stop());
    }
    clear() {
      this.entities.length = 0;
    }
    add(a) {
      a.s = this.s;
      this.entities.push(a);
      return this.U(a.h, b => {
        b.hb = a;
        return this.s.T(b);
      });
    }
    remove({ h: a }) {
      return this.U(a, b => this.s.W(b));
    }
    toggle({ h: a }) {
      return this.U(a, b => this.s.la(b));
    }
    U(a, b) {
      return a.map(c => ({ id: c.id, name: c.name, ib: b(c) }));
    }
  }
  class A {
    constructor() {
      this.Oa = new k();
      this.h = [];
      this.l = !1;
      this.L = new y();
      this.o = new z(this);
    }
    start() {
      return this.l
        ? !1
        : ((this.l = !0),
          this.L.start(),
          this.o.start(),
          this.h.forEach(a => a.start()),
          this.update(),
          !0);
    }
    stop() {
      return this.l
        ? ((this.l = !1),
          cancelAnimationFrame(this.Ja),
          this.L.stop(),
          this.o.stop(),
          this.h.forEach(a => a.stop()),
          !0)
        : !1;
    }
    clear() {
      this.stop();
      this.o.clear();
      this.h.length = 0;
    }
    add(a) {
      return a instanceof k ? this.T(a) : this.o.add(a);
    }
    remove(a) {
      return a instanceof k ? this.W(a) : this.o.remove(a);
    }
    toggle(a) {
      return a instanceof k ? this.la(a) : this.o.toggle(a);
    }
    Ma(a) {
      return -1 !== l(this.h, a);
    }
    T(a) {
      return this.Ma(a) ? !1 : ((a.s = this), this.Qa(a), !0);
    }
    W(a) {
      var b = this.h;
      a = l(b, a);
      return (b = q(b, a));
    }
    la(a) {
      return this.T(a) ? !0 : (this.W(a), !1);
    }
    La() {
      let a = this.L.Ka();
      return { fb: a, gb: 1000 * a, elapsedTime: this.L.elapsedTime };
    }
    Qa(a) {
      'number' === typeof a.ma ? this.h.splice(a.ma, 0, a) : this.h.push(a);
    }
    update() {
      this.Ja = requestAnimationFrame(() => this.update());
      let a = this.La();
      this.h.forEach(b => {
        b.update(a);
      });
      this.Oa.update(a);
    }
  }
  class B {
    constructor({ Ha: a, size: b, clearColor: c }) {
      this.canvas = document.querySelector(a);
      if (!this.canvas instanceof HTMLCanvasElement) {
        throw `Can't find canvas with selector ${a}.`;
      }
      this.context = this.canvas.getContext('webgl2');
      let { width: d, height: f } = b;
      this.Ta({ width: d, height: f });
      this.Sa(c);
    }
    Ta({ width: a, height: b }) {
      this.context.canvas.style.width = `${a}px`;
      this.context.canvas.style.height = `${b}px`;
      this.context.canvas.width = a;
      this.context.canvas.height = b;
      this.context.viewport(0, 0, a, b);
    }
    Sa({ r: a, j: b, c, g: d }) {
      this.context.clearColor(a, b, c, d);
    }
    clear() {
      this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
    }
    Ra(...a) {
      this.clear();
      a.forEach(b => b.za());
    }
  }
  class t {
    constructor(a) {
      this.Ba = a;
      this.na = this.xa();
      this.Da = this.wa();
    }
    xa() {
      return this.Ba.reduce((a, b) => {
        a.push(...b.Pa);
        return a;
      }, []);
    }
    wa() {
      let a = this.na.reduce((b, { x: c, y: d }) => {
        b.push(c, d);
        return b;
      }, []);
      return new Float32Array(a);
    }
  }
  class C {
    constructor({ context: a, ga: b, ha: c }) {
      this.id = g++;
      this.a = a;
      this.Y = b;
      this.m = c;
      this.Z = this.a.createBuffer();
      this.I = new Float32Array([0, 0]);
      this.$ = new Float32Array([0, 1]);
      this.J = new Float32Array([1, 1]);
      this.S = [];
      this.ya();
    }
    get position() {
      return { x: this.I[0], y: this.I[1] };
    }
    get scale() {
      return { x: this.J[0], y: this.J[1] };
    }
    set position({ x: a, y: b }) {
      this.I = new Float32Array([a, b]);
      this.P(() => this.ba());
    }
    set rotation(a) {
      this.$ = new Float32Array([Math.sin(a), Math.cos(a)]);
      this.P(() => this.ca());
    }
    set scale({ x: a, y: b }) {
      this.J = new Float32Array([a, b]);
      this.P(() => this.da());
    }
    ya() {
      this.a.useProgram(this.m.w.f);
      this.a.bindBuffer(this.a.ARRAY_BUFFER, this.Z);
      this.da();
      this.ba();
      this.ca();
    }
    Aa() {
      this.a.useProgram(this.m.w.f);
      this.a.bindBuffer(this.a.ARRAY_BUFFER, this.Z);
      this.a.bufferData(this.a.ARRAY_BUFFER, this.Y.Da, this.a.STATIC_DRAW);
      this.m.sa();
      this.Ca();
      this.a.drawArrays(this.a.TRIANGLES, 0, this.Y.na.length);
      this.a.useProgram(null);
    }
    ca() {
      this.a.uniform2fv(this.m.K.Va, this.$);
    }
    ba() {
      this.a.uniform2fv(this.m.K.Xa, this.I);
    }
    da() {
      this.a.uniform2fv(this.m.K.Wa, this.J);
    }
    P(a) {
      this.S.push(a);
    }
    Ca() {
      this.S.forEach(a => a());
      this.S.length = 0;
    }
  }
  class u {
    constructor({ context: a, type: b, source: c }) {
      this.id = g++;
      this.context = a;
      this.source = c;
      this.i = a.createShader(b);
      this.context.shaderSource(this.i, c);
      this.context.compileShader(this.i);
      this.verify();
    }
    delete(a) {
      this.context.detachShader(a, this.i);
      this.context.deleteShader(this.i);
    }
    verify() {
      if (!this.context.getShaderParameter(this.i, this.context.COMPILE_STATUS)) {
        let a = this.context.getShaderInfoLog(this.i);
        this.context.deleteShader(this.i);
        throw a;
      }
    }
  }
  class D extends u {
    constructor({ context: a, source: b }) {
      super({ context: a, source: b, type: a.VERTEX_SHADER });
    }
  }
  class E extends u {
    constructor({ context: a, source: b }) {
      super({ context: a, source: b, type: a.FRAGMENT_SHADER });
    }
  }
  class F {
    constructor({ context: a, G: b, D: c, debug: d = !1 }) {
      this.context = a;
      this.f = a.createProgram();
      this.debug = d;
      this.Fa({ G: b, D: c });
      a.linkProgram(this.f);
      this.verify();
      this.debug && this.Ya();
      b.delete(this.f);
      c.delete(this.f);
    }
    Fa({ G: a, D: b }) {
      this.context.attachShader(this.f, a.i);
      this.context.attachShader(this.f, b.i);
    }
    verify() {
      if (!this.context.getProgramParameter(this.f, this.context.LINK_STATUS)) {
        let a = this.context.getProgramInfoLog(this.f);
        this.context.deleteProgram(this.f);
        throw a;
      }
    }
    Ya() {
      this.context.validateProgram(this.f);
      if (!this.context.getProgramParameter(this.f, this.context.VALIDATE_STATUS)) {
        let a = this.context.getProgramInfoLog(this.f);
        this.context.deleteProgram(this.f);
        throw a;
      }
    }
  }
  class v {
    constructor({ context: a, O: b, M: c }) {
      this.id = g++;
      this.a = a;
      let { G: d, D: f } = this.ra({ context: this.a, O: b, M: c });
      this.Ea = d;
      this.ta = f;
      this.w = new F({ context: this.a, G: this.Ea, D: this.ta, debug: !0 });
      this.X = this.va();
      this.K = this.R();
    }
    ra({ context: a, O: b, M: c }) {
      b = new D({ context: a, source: b });
      a = new E({ context: a, source: c });
      return { G: b, D: a };
    }
    sa() {
      this.a.enableVertexAttribArray(this.X.ea);
      this.a.vertexAttribPointer(this.X.ea, 2, this.a.FLOAT, this.a.$a, 0, 0);
    }
    va() {
      return { ea: this.ua() };
    }
    R() {
      return { Xa: this.H('u_translation'), Wa: this.H('u_scale'), Va: this.H('u_rotation') };
    }
    ua() {
      return this.a.getAttribLocation(this.w.f, 'a_position');
    }
    H(a) {
      return this.a.getUniformLocation(this.w.f, a);
    }
  }
  class n {
    constructor({ r: a, j: b, c }) {
      this.r = a;
      this.j = b;
      this.c = c;
    }
    get values() {
      return new Float32Array([this.r, this.j, this.c]);
    }
  }
  class G extends v {
    constructor({ context: a }) {
      super({
        context: a,
        O:
          '#version 300 es\nin vec2 a_position;in vec3 a_vertColor;uniform vec2 u_translation;uniform vec2 u_rotation;uniform vec2 u_scale;uniform float u_pointSize;out vec3 fragColor;void main(){fragColor=a_vertColor;float rotatedX=a_position.x*u_rotation.y+a_position.y*u_rotation.x;float rotatedY=a_position.y*u_rotation.y-a_position.x*u_rotation.x;vec2 rotatedPosition=vec2(rotatedX,rotatedY);gl_PointSize=u_pointSize;gl_Position=vec4(rotatedPosition*u_scale+u_translation,0.,1.);}',
        M:
          '#version 300 es\nprecision mediump float;uniform vec3 u_color;out vec4 frag_color;void main(){frag_color=vec4(u_color,1.);}',
      });
      this.u = new n({ r: 1 * Math.random(), j: 1 * Math.random(), c: 1 * Math.random() }).values;
      this.aa();
    }
    get color() {
      return new n({ r: this.u[0], j: this.u[1], c: this.u[2] });
    }
    set color({ values: a }) {
      this.u = a;
      this.aa();
    }
    aa() {
      this.a.useProgram(this.w.f);
      this.a.uniform3fv(this.K.Ua, this.u);
      this.a.useProgram(null);
    }
    R() {
      return { ...super.R(), Ua: this.H('u_color') };
    }
  }
  class H {
    constructor() {
      this.id = g++;
      this.v = [];
    }
    add(...a) {
      a.forEach(b => {
        -1 !== l(this.v, b) || this.v.push(b);
      });
    }
    remove(...a) {
      a.forEach(b => {
        var c = this.v;
        b = l(c, b);
        return (c = q(c, b));
      });
    }
    clear() {
      this.v.length = 0;
    }
    za() {
      this.v.forEach(a => a.Aa());
    }
  }
  let w = a => {
    const b = [];
    for (let d = 0; d < a; d++) {
      var c = new e({ x: 2 * Math.random() + -1, y: 2 * Math.random() + -1 });
      const f = new e({ x: 2 * Math.random() + -1, y: 2 * Math.random() + -1 }),
        m = new e({ x: 2 * Math.random() + -1, y: 2 * Math.random() + -1 });
      c = new r(c, f, m);
      b.push(c);
    }
    return b;
  };
  class x extends C {
    update({ elapsedTime: a }) {
      let b = Math.sin(a);
      this.position = new e({ x: b, y: b });
      this.rotation = 0.5 * a;
    }
  }
  class I extends k {
    constructor() {
      super();
      this.F = new B({
        Ha: '#webGl',
        clearColor: { r: 0, j: 0, c: 0, g: 1 },
        size: { width: 500, height: 500 },
      });
      let a = new v({
          context: this.F.context,
          O:
            '#version 300 es\nin vec2 a_position;in vec3 a_vertColor;uniform vec2 u_translation;uniform vec2 u_rotation;uniform vec2 u_scale;uniform float u_pointSize;out vec3 fragColor;void main(){fragColor=a_vertColor;float rotatedX=a_position.x*u_rotation.y+a_position.y*u_rotation.x;float rotatedY=a_position.y*u_rotation.y-a_position.x*u_rotation.x;vec2 rotatedPosition=vec2(rotatedX,rotatedY);gl_PointSize=u_pointSize;gl_Position=vec4(rotatedPosition*u_scale+u_translation,0.,1.);}',
          M:
            '#version 300 es\nprecision mediump float;out vec4 color;in vec3 fragColor;void main(){vec2 xy=sin(gl_FragCoord.xy*0.05);float g=fract(xy.x*xy.y);color=vec4(0.,g,0.,1.);}',
        }),
        b = new G({ context: this.F.context });
      b.color = new n({ r: 0, j: 1, c: 0 });
      this.ia = new x({ context: this.F.context, ga: new t(w(3)), ha: a });
      this.fa = new x({ context: this.F.context, ga: new t(w(3)), ha: b });
      this.ja = new H();
      this.ja.add(this.ia, this.fa);
    }
    update(a) {
      this.ia.update(a);
      this.fa.update(a);
      this.F.Ra(this.ja);
    }
  }
  let p = new A(),
    J = new I();
  p.add(J);
  try {
    p.start();
  } catch (a) {
    console.error(a), p.stop();
  }
})();
