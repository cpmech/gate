export const fitCanvasToParent = (canvas: HTMLCanvasElement) => {
  // make the canvas visually fill the positioned parent
  canvas.style.width = '100%';
  canvas.style.height = '100%';

  // then set the internal size to match
  const ratio = Math.max(window.devicePixelRatio || 1, 1);
  canvas.width = canvas.offsetWidth * ratio;
  canvas.height = canvas.offsetHeight * ratio;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.scale(ratio, ratio);
  }
};
