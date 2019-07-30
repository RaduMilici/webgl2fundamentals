class GlSlider extends HTMLElement {
  constructor() {
    super();    
    const shadow = this.attachShadow({ mode: 'open' });
    this.label = document.createElement('label');
    this.label.setAttribute('class', 'label');
    this.span = document.createElement('span');
    this.input = this.makeInput();
    this.label.innerHTML = this.getAttribute('label');
    this.span.textContent = this.input.value;

    this.input.addEventListener('input', event => {
      event.stopPropagation();
      const { value } = event.target; 
      this.span.textContent = value;
      this.dispatchEvent(new CustomEvent('input', { detail: value }));
    });

    this.label.appendChild(this.input);
    this.label.appendChild(this.span);
    shadow.appendChild(this.makeStyle());
    shadow.appendChild(this.label);
  }

  makeInput() {    
    const max = this.getAttribute('max');
    const input = document.createElement('input');
    input.type = 'range';
    input.value = max / 2;
    input.setAttribute('min', this.getAttribute('min'));
    input.setAttribute('max', max);
    return input;
  }

  makeStyle() {
    const style = document.createElement('style');
    style.textContent = `
      .label {
        background-color: black;
        color: white;
      }
    `;
    return style;
  }
}

customElements.define('gl-slider', GlSlider);
