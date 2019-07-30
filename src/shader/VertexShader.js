import Shader from './Shader';

export default class VertexShader extends Shader {
  constructor({ context, source }) {
    super({
      context,
      source,
      type: context.VERTEX_SHADER,
    });
  }
}
