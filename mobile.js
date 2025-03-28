let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
  touchEndX = 0;
  touchEndY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    paper.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!this.rotating) {
        this.touchMoveX = e.touches[0].clientX;
        this.touchMoveY = e.touches[0].clientY;

        // Slow down dragging by reducing velocity
        this.velX = (this.touchMoveX - this.prevTouchX) * 0.5; // Slow down X
        this.velY = (this.touchMoveY - this.prevTouchY) * 0.5; // Slow down Y
      }

      const dirX = e.touches[0].clientX - this.touchStartX;
      const dirY = e.touches[0].clientY - this.touchStartY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevTouchX = this.touchMoveX;
        this.prevTouchY = this.touchMoveY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    });

    paper.addEventListener('touchstart', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.prevTouchX = this.touchStartX;
      this.prevTouchY = this.touchStartY;
    });

    paper.addEventListener('touchend', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // For two-finger rotation on touch screens
    paper.addEventListener('gesturestart', (e) => {
      e.preventDefault();
      this.rotating = true;
    });
    paper.addEventListener('gestureend', () => {
      this.rotating = false;
    });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});

document.querySelectorAll('.paper').forEach(paper => {
  let isDragging = false;
  let startX, startY, initialX, initialY;

  // Mouse events
  paper.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialX = paper.offsetLeft;
    initialY = paper.offsetTop;
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const dx = (e.clientX - startX) * 0.5; // Slow down X
      const dy = (e.clientY - startY) * 0.5; // Slow down Y
      paper.style.left = `${initialX + dx}px`;
      paper.style.top = `${initialY + dy}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch events
  paper.addEventListener('touchstart', (e) => {
    isDragging = true;
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    initialX = paper.offsetLeft;
    initialY = paper.offsetTop;
    e.preventDefault();
  });

  document.addEventListener('touchmove', (e) => {
    if (isDragging) {
      const touch = e.touches[0];
      const dx = (touch.clientX - startX) * 0.5; // Slow down X
      const dy = (touch.clientY - startY) * 0.5; // Slow down Y
      paper.style.left = `${initialX + dx}px`;
      paper.style.top = `${initialY + dy}px`;
    }
  });

  document.addEventListener('touchend', () => {
    isDragging = false;
  });
});

// Zoom out effect for mobile
if (/Mobi|Android/i.test(navigator.userAgent)) {
  document.body.style.transform = 'scale(0.9)';
  document.body.style.transformOrigin = 'center';
}