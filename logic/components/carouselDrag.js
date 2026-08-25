// ==========================================
// CineFlow Fluid Carousel Drag-to-Scroll Utility
// ==========================================

export class CarouselDrag {
  static attach(track) {
    if (!track || track._hasDragAttached) return;
    track._hasDragAttached = true;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let didDrag = false;          // true only when mouse moved past threshold
    const DRAG_THRESHOLD = 6;

    track.classList.add('c-carousel__track--draggable');

    // ── Mouse Down ────────────────────────────────────────────────
    track.addEventListener('mousedown', (e) => {
      if (e.target.closest('button')) return;
      isDown = true;
      didDrag = false;            // reset on every fresh press
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
      track.style.scrollSnapType = 'none'; // disable snap during drag
      e.preventDefault();         // stops text-selection while dragging
    });

    // ── Mouse Move ────────────────────────────────────────────────
    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const walk = (e.pageX - track.offsetLeft - startX) * 1.6;
      if (Math.abs(walk) > DRAG_THRESHOLD) {
        didDrag = true;
        track.classList.add('is-dragging');
      }
      track.scrollLeft = scrollLeft - walk;
    });

    // ── Mouse Up / Leave ──────────────────────────────────────────
    const stopDrag = () => {
      isDown = false;
      track.style.scrollSnapType = ''; // restore snap
      // Remove class immediately so next mousedown starts clean
      track.classList.remove('is-dragging');
      // Keep didDrag true until after the click event fires (same tick),
      // then reset so the NEXT click is never blocked.
      requestAnimationFrame(() => { didDrag = false; });
    };
    track.addEventListener('mouseup',    stopDrag);
    track.addEventListener('mouseleave', stopDrag);

    // ── Click guard (capture phase) ───────────────────────────────
    // Runs before any card click listener — blocks navigation only if
    // the user actually dragged (moved more than DRAG_THRESHOLD px).
    track.addEventListener('click', (e) => {
      if (didDrag) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);


  }

  static initAll(container) {
    container.querySelectorAll('.c-carousel__track').forEach(t => this.attach(t));
  }
}
