const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let interactionMode = 'dots'; 

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// --- TRANSIÇÃO E INTERFACE ---

document.getElementById('enter-btn').addEventListener('click', () => {
    document.getElementById('intro').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('intro').classList.add('hidden');
        document.getElementById('panel').classList.remove('hidden');
    }, 600);
});

document.getElementById('toggle-bg').addEventListener('click', () => {
    interactionMode = interactionMode === 'dots' ? 'gradient' : 'dots';
});

// --- LÓGICA DE BANIMENTO E COMANDOS ---

// Função para enviar dados para o seu server.js
async function enviarComando(rota, dados) {
    try {
        const response = await fetch(rota, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            alert("Comando executado com sucesso!");
        } else {
            alert("Erro ao enviar comando para o servidor.");
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("O servidor está offline ou a URL está incorreta.");
    }
}

// Evento do botão BANIR
document.querySelector('.primary-btn').addEventListener('click', () => {
    const userId = document.querySelector('input[placeholder="ID do Usuário"]').value;
    const reason = document.querySelector('input[placeholder="Motivo"]').value;

    if (!userId || !reason) {
        return alert("Por favor, preencha o ID e o Motivo!");
    }

    enviarComando('/banir', { userId, reason });
});

// Evento do botão ANUNCIAR
document.querySelector('.secondary-btn').addEventListener('click', () => {
    const message = document.querySelector('textarea').value;

    if (!message) {
        return alert("Escreva uma mensagem para anunciar!");
    }

    enviarComando('/anunciar', { message });
});

// --- ANIMAÇÃO DE FUNDO (SEU CÓDIGO) ---

let particles = [];
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
}

for(let i=0; i<80; i++) particles.push(new Particle());

function draw() {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    
    if (interactionMode === 'dots') {
        particles.forEach(p => {
            p.update();
            ctx.fillStyle = "rgba(250, 204, 21, 0.5)";
            ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI*2); ctx.fill();
        });
        connect();
    } else {
        let time = Date.now() * 0.001;
        let g = ctx.createRadialGradient(
            canvas.width/2 + Math.sin(time)*200, canvas.height/2, 
            50, 
            canvas.width/2, canvas.height/2, 
            canvas.width
        );
        g.addColorStop(0, '#1e1e2e');
        g.addColorStop(1, '#000000');
        ctx.fillStyle = g;
        ctx.fillRect(0,0, canvas.width, canvas.height);
    }
    requestAnimationFrame(draw);
}

function connect() {
    for(let a=0; a<particles.length; a++) {
        for(let b=a; b<particles.length; b++) {
            let dist = Math.hypot(particles[a].x - particles[b].x, particles[a].y - particles[b].y);
            if (dist < 120) {
                ctx.strokeStyle = `rgba(250, 204, 21, ${1 - dist/120})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath(); ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y); ctx.stroke();
            }
        }
    }
}

draw();
