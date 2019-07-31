class GlSlider extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    this.label = document.createElement('label');
    this.label.setAttribute('id', 'label');
    this.span = document.createElement('span');
    this.span.setAttribute('id', 'value');
    this.input = this.makeInput();
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
