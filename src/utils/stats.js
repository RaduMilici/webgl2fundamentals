const script = document.createElement('script');
const statsContainer = document.getElementById('stats');
script.onload = function() {
  const stats1 = new Stats();
  const stats2 = new Stats();
  const stats3 = new Stats();
  // 0: fps, 1: ms, 2: mb, 3+: custom
  stats1.showPanel(0);
  stats2.showPanel(1);
  stats3.showPanel(2);
  stats2.dom.style.marginLeft = '80px';
  stats3.dom.style.marginLeft = '160px';
  statsContainer.appendChild(stats1.dom);
  statsContainer.appendChild(stats2.dom);
  statsContainer.appendChild(stats3.dom);
  requestAnimationFrame(function loop() {
    stats1.update();
    stats2.update();
    stats3.update();
    requestAnimationFrame(loop);
  });
};
script.src = '//mrdoob.github.io/stats.js/build/stats.min.js';
document.head.appendChild(script);
