import Shader from './Shader';

export default class FragmentShader extends Shader {
  constructor({ context, source }) {
    super({ 
      context, 
      source,
      type: context.FRAGMENT_SHADER
    });
  }
}