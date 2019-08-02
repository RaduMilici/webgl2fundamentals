var script = document.createElement('script');
script.onload = function () {
  var stats1 = new Stats();
  var stats2 = new Stats();
  var stats3 = new Stats();
   // 0: fps, 1: ms, 2: mb, 3+: custom
  stats1.showPanel(0);
  stats2.showPanel(1);
  stats3.showPanel(2);
  stats2.dom.style.marginLeft = '80px';  
  stats3.dom.style.marginLeft = '160px';  
  document.body.appendChild(stats1.dom);
  document.body.appendChild(stats2.dom);
  document.body.appendChild(stats3.dom);
  requestAnimationFrame(function loop() {
    stats1.update();
    stats2.update();
    stats3.update();
    requestAnimationFrame(loop)
  });
};
script.src = '//mrdoob.github.io/stats.js/build/stats.min.js';
document.head.appendChild(script);