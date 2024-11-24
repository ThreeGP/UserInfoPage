import { useEffect, useRef } from "react";

const ParticleBackground = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animationFrameId;

    // Dostosuj canvas do wielkości okna
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Inicjalizacja cząsteczek
    const initParticles = () => {
      particles = [];
      const numberOfParticles = 200;

      for (let i = 0; i < numberOfParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2.5 + 0.5,
          speedX: Math.random() * 2 - 1,
          speedY: Math.random() * 2 - 1,
          color: `rgba(${200 + Math.random() * 55}, ${Math.random() * 30}, ${
            Math.random() * 30
          }, ${0.3 + Math.random() * 0.4})`,
        });
      }
      particlesRef.current = particles;
    };

    // Aktualizacja pozycji cząsteczek
    const updateParticles = () => {
      particlesRef.current.forEach((particle) => {
        // Przyciąganie do kursora
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 250) {
          const force = (250 - distance) / 250;
          particle.speedX += (dx / distance) * force * 0.6;
          particle.speedY += (dy / distance) * force * 0.6;
        }

        // Ograniczenie prędkości
        particle.speedX *= 0.97;
        particle.speedY *= 0.97;

        // Aktualizacja pozycji
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Odbicie od krawędzi
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      });
    };

    // Rysowanie cząsteczek
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Rysowanie linii między bliskimi cząsteczkami
        particlesRef.current.forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 30, 30, ${
              0.12 * (1 - distance / 120)
            })`;
            ctx.lineWidth = 0.3;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });
    };

    // Główna pętla animacji
    const animate = () => {
      updateParticles();
      drawParticles();
      frameRef.current = requestAnimationFrame(animate);
    };

    // Event listenery
    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    // Dodanie obsługi dotknięć dla urządzeń mobilnych
    const handleTouchMove = (e) => {
      e.preventDefault();
      mouseRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    // Inicjalizacja
    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("resize", resizeCanvas);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ background: "transparent" }}
    />
  );
};

export default ParticleBackground;
