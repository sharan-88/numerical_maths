/**
 * Draggable panel dividers. Drag a bar to resize the sidebar / input panel;
 * double-click a bar to restore the default width.
 */
const MIN = 180;

export function initResizers() {
  const root = document.documentElement;
  document.querySelectorAll('.resizer').forEach(bar => {
    const isLeft = bar.dataset.side === 'left';
    const prop = isLeft ? '--sw' : '--pw';

    bar.addEventListener('pointerdown', e => {
      e.preventDefault();
      bar.setPointerCapture(e.pointerId);
      bar.classList.add('dragging');
      document.body.classList.add('resizing');
      const move = ev => {
        const width = isLeft ? ev.clientX : window.innerWidth - ev.clientX;
        const max = window.innerWidth * 0.5;
        root.style.setProperty(prop, Math.min(Math.max(width, MIN), max) + 'px');
      };
      const stop = () => {
        bar.classList.remove('dragging');
        document.body.classList.remove('resizing');
        bar.removeEventListener('pointermove', move);
        bar.removeEventListener('pointerup', stop);
      };
      bar.addEventListener('pointermove', move);
      bar.addEventListener('pointerup', stop);
    });

    bar.addEventListener('dblclick', () => root.style.removeProperty(prop));
  });
}
