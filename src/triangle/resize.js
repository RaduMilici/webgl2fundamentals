const resize = canvas => {
  const { clientWidth, clientHeight } = canvas;
  canvas.width = clientWidth;
  canvas.height = clientHeight;
};

export default resize;
