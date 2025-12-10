import React, { useEffect, useRef } from 'react';

const BackgroundWaves = () => {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width, height;
        let animationFrameId;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', resize);
        resize();

        const handleMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);

        class Wave {
            constructor(index, total, color) {
                this.index = index;
                this.total = total;
                this.color = color;
                this.points = [];
                this.init();
            }

            init() {
                this.points = [];
                const gap = width / 12; // More points for smoother "follow" feeling
                for (let x = 0; x <= width + gap; x += gap) {
                    this.points.push({
                        x: x,
                        y: height / 2,
                        originY: height / 2 + (this.index - this.total / 2) * 50,
                        angle: x * 0.01 + this.index
                    });
                }
            }

            update() {
                const time = Date.now() * 0.001;

                this.points.forEach(point => {
                    // Calculate distance to mouse
                    const dx = mouseRef.current.x - point.x;
                    const dy = mouseRef.current.y - point.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // Interaction radius
                    const maxDist = 400;

                    // Base wave movement (gentle sine)
                    const waveY = Math.sin(point.angle + time) * 20;

                    // Mouse Attraction Effect
                    let mouseEffect = 0;
                    if (dist < maxDist) {
                        const force = (maxDist - dist) / maxDist; // 0 to 1

                        // Pull point.y towards mouse.y based on X proximity
                        // The closer the X, the more it pulls vertically
                        const xProximity = Math.max(0, 1 - Math.abs(dx) / 100);

                        // Create a "magnetic" pull towards mouse height
                        mouseEffect = (mouseRef.current.y - point.originY) * force * 0.3;
                    }

                    // Target Y position
                    const targetY = point.originY + waveY + mouseEffect;

                    // Simple easing
                    point.y += (targetY - point.y) * 0.1;
                });
            }

            draw(ctx) {
                ctx.beginPath();
                ctx.moveTo(this.points[0].x, this.points[0].y);

                for (let i = 0; i < this.points.length - 1; i++) {
                    const p0 = this.points[i];
                    const p1 = this.points[i + 1];
                    const cx = (p0.x + p1.x) / 2;
                    const cy = (p0.y + p1.y) / 2;
                    ctx.quadraticCurveTo(p0.x, p0.y, cx, cy);
                }

                ctx.strokeStyle = this.color;
                ctx.lineWidth = 2.5;
                ctx.stroke();
            }
        }

        const waves = [];
        // Brighter colors for better visibility
        const colors = [
            'rgba(59, 130, 246, 0.4)', // Blue
            'rgba(139, 92, 246, 0.4)', // Purple
            'rgba(34, 211, 238, 0.4)', // Cyan
        ];

        for (let i = 0; i < 3; i++) {
            waves.push(new Wave(i, 3, colors[i]));
        }

        const animate = () => {
            // Clear with semi-transparent black for trail effect
            // Increased opacity to 0.4 to clear trails faster (cleaner look) or less (longer trails)
            ctx.fillStyle = 'rgba(10, 15, 30, 0.3)';
            ctx.fillRect(0, 0, width, height);

            waves.forEach(wave => {
                wave.update();
                wave.draw(ctx);
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />;
};

export default BackgroundWaves;
