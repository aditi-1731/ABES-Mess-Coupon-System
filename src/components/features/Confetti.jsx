import confetti from 'canvas-confetti';

export function fireConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF7A1A', '#FFE9D6', '#0F1B33', '#16A34A', '#F59E0B']
    });
  } catch (err) {
    console.warn('Confetti error:', err);
  }
}

export function fireCelebration() {
  try {
    const end = Date.now() + 1000;
    const colors = ['#FF7A1A', '#16A34A', '#1F3A5F'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch (err) {
    console.warn('Celebration error:', err);
  }
}

export default function ConfettiEffect({ trigger }) {
  return null;
}
