import React, { useEffect, useRef } from 'react';

const BackgroundParticles = () => {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: null, y: null });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Reset mouse tracking on resize to avoid stuck behavior
            mouseRef.current.x = null;
            mouseRef.current.y = null;
        };

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                // Random small size for "stars" or dust
                this.size = Math.random() * 1.5 + 0.5;
                // Very slow default movement
                this.baseSpeedX = Math.random() * 0.4 - 0.2;
                this.baseSpeedY = Math.random() * 0.4 - 0.2;
                this.speedX = this.baseSpeedX;
                this.speedY = this.baseSpeedY;

                // Random opacity for twinkling effect
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update(mouse) {
                // Determine interaction with mouse
                let forceDirectionX = 0;
                let forceDirectionY = 0;
                let forceMultiplier = 0;

                if (mouse.x != null && mouse.y != null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const maxDistance = 150; // Interaction radius

                    if (distance < maxDistance) {
                        // "Connect" or pull slightly towards mouse - "Gravity" effect
                        // To allow "flow", we can accelerate towards it, or push away for "Antigravity".
                        // User asked for "Antigravity" context but "move with cursor".
                        // Let's do a gentle attraction (gravity well) that makes them swirl/move with it.
                        // Or simple repulsion? "Antigravity" usually implies repulsion.
                        // However, standard cool particle fx often have connecting lines or attraction.
                        // Let's try Repulsion (Antigravity).

                        const force = (maxDistance - distance) / maxDistance;
                        forceDirectionX = (dx / distance) * force * 1.5; // Push away: use -dx. Attract: dx.
                        forceDirectionY = (dy / distance) * force * 1.5;

                        // For "move with", let's attract them broadly but maybe swirl?
                        // Let's stick to a subtle repulsion (antigravity) as it feels interactive.
                        // Actually, "move with" sounds like they follow. Let's do **attraction**.
                        // It feels more "interactive" if they follow you like a swarm.
                        forceMultiplier = 1;
                    }
                }

                if (forceMultiplier > 0) {
                    // Easing towards the mouse force
                    this.speedX += forceDirectionX * 0.05;
                    this.speedY += forceDirectionY * 0.05;
                } else {
                    // Return to base speed over time (friction)
                    if (this.speedX > this.baseSpeedX) this.speedX -= 0.01;
                    if (this.speedX < this.baseSpeedX) this.speedX += 0.01;
                    if (this.speedY > this.baseSpeedY) this.speedY -= 0.01;
                    if (this.speedY < this.baseSpeedY) this.speedY += 0.01;
                }

                // Cap max speed
                const maxSpeed = 3;
                if (this.speedX > maxSpeed) this.speedX = maxSpeed;
                if (this.speedX < -maxSpeed) this.speedX = -maxSpeed;
                if (this.speedY > maxSpeed) this.speedY = maxSpeed;
                if (this.speedY < -maxSpeed) this.speedY = -maxSpeed;

                this.x += this.speedX;
                this.y += this.speedY;

                // Wrap around screen
                if (this.x > canvas.width) this.x = 0;
                else if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                else if (this.y < 0) this.y = canvas.height;
            }

            draw(mouse) {
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();

                // Draw connecting lines if close to mouse
                if (mouse.x != null && mouse.y != null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 120})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(this.x, this.y);
                        ctx.lineTo(mouse.x, mouse.y); // Connect to mouse
                        ctx.stroke();
                    }
                }
            }
        }

        const initParticles = () => {
            particles = [];
            const particleCount = Math.min(window.innerWidth * window.innerHeight / 15000, 150); // Density based on screen size, max 150
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => {
                particle.update(mouseRef.current);
                particle.draw(mouseRef.current);
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };

        const handleMouseLeave = () => {
            mouseRef.current.x = null;
            mouseRef.current.y = null;
        }

        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseLeave);

        resizeCanvas();
        initParticles();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
            style={{ background: 'transparent' }}
        />
    );
};

export default BackgroundParticles;
