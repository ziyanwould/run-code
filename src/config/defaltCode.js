import packageInfo from '../../package.json'

const defaltCode = {
  HTML: {
    language: 'html',
    content: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CodeFlux</title>
</head>
<body>
<main>
  <section>
    <div class="about-container">
      <h2>CodeFlux</h2>
      <p id="description">${packageInfo.description}</p>

      <div class="links">
        <div class="link-item">
          <span class="link-label">GitHub:</span>
          <a id="repo-url" href="${packageInfo.repository.url}" target="_blank">${packageInfo.repository.url.replace(/^https?:\/\//, '')}</a>
        </div>
        <div class="link-item">
          <span class="link-label">&nbsp;&nbsp;&nbsp;&nbsp;官网:</span>
          <a id="homepage-url" href="${packageInfo.homepage}" target="_blank">${packageInfo.homepage.replace(/^https?:\/\//, '')}</a>
        </div>
      </div>

      <div class="version-info">
        <p>
          当前版本: <a id="version-link" href="${packageInfo.repository.url}">${packageInfo.version}</a>
        </p>
      </div>
    </div>
  </section>
</main>
</body>
</html>`,
    resources: []
  },
  CSS: {
    language: 'css',
    content: `* {
margin: 0;
padding: 0;
box-sizing: border-box;
}

*::before,
*::after {
box-sizing: border-box;
}

html,
body {
overscroll-behavior-x: none;
overscroll-behavior-y: none;
scroll-behavior: smooth;
-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

body {
font-family: "Geist", sans-serif;
position: relative;
width: 100%;
max-width: 100vw;
min-height: 100vh;
overflow-x: hidden;
background: #0f0c29;
background: -webkit-linear-gradient(to right, #24243e, #302b63, #0f0c29);
background: linear-gradient(to right, #24243e, #302b63, #0f0c29);
color: #e0e0e0;
position: relative;
}

body::before {
content: '';
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: radial-gradient(circle at 50% 50%, rgba(76, 0, 255, 0.1) 0%, transparent 50%);
pointer-events: none;
z-index: 1;
}

main {
position: relative;
z-index: 2;
}

section {
position: relative;
width: 100%;
height: auto;
min-height: 100vh;
display: grid;
place-items: center;
}

h1, h2 {
text-transform: uppercase;
margin-bottom: 20px;
color: #fff;
text-shadow: 0 0 10px rgba(120, 0, 255, 0.5);
animation: glow 3s ease-in-out infinite alternate;
}

@keyframes glow {
from {
  text-shadow: 0 0 5px rgba(120, 0, 255, 0.5);
}
to {
  text-shadow: 0 0 20px rgba(120, 0, 255, 0.8), 0 0 30px rgba(120, 0, 255, 0.6);
}
}

.about-container {
  background-color: rgba(20, 20, 40, 0.2);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 38px;
  max-width: 540px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 15px rgba(120, 0, 255, 0.2),
    inset 0 0 1px rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transform: translateY(30px) perspective(1000px);
  opacity: 0;
  animation: fadeIn 1s ease-out forwards 0.3s;
  position: relative;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.about-container:hover {
  transform: translateY(0) perspective(1000px) rotateX(2deg) rotateY(2deg);
  box-shadow: 
    0 15px 45px rgba(0, 0, 0, 0.4),
    0 0 25px rgba(120, 0, 255, 0.3),
    inset 0 0 2px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.about-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 50%
  );
  opacity: 0;
  animation: rotate 20s linear infinite;
  pointer-events: none;
  transition: opacity 0.5s ease;
}

.about-container:hover::before {
  opacity: 0.2;
}

/* 添加光效移动动画 */
.about-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: 0.5s;
  pointer-events: none;
}

.about-container:hover::after {
  left: 100%;
  transition: 0.8s ease-in-out;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0) perspective(1000px);
  }
}

/* 优化内部文字动效 */
.about-container h2,
.about-container p,
.about-container .links,
.about-container .version-info {
  transition: transform 0.3s ease;
}

.about-container:hover h2 {
  transform: translateY(-2px);
  text-shadow: 0 0 15px rgba(120, 0, 255, 0.8);
}

.about-container:hover p,
.about-container:hover .links,
.about-container:hover .version-info {
  transform: translateY(2px);
}

.about-container p {
color: #d0d0d0;
line-height: 1.6;
margin-bottom: 15px;
animation: fadeInText 1s ease-out forwards 0.6s;
opacity: 0;
}

@keyframes fadeInText {
to {
  opacity: 1;
}
}

.links {
margin: 30px 0;
opacity: 0;
animation: fadeInText 1s ease-out forwards 0.9s;
}

.link-item {
margin-bottom: 15px;
display: flex;
align-items: center;
justify-content: flex-start;
transition: transform 0.3s ease;
}

.link-item:hover {
transform: translateY(-3px);
}

.link-label {
font-weight: bold;
margin-right: 10px;
color: #a0a0ff;
}

a {
color: #a0a0ff;
text-decoration: none;
transition: all 0.3s ease;
position: relative;
}

a:hover {
text-decoration: none;
color: #c0c0ff;
}

a::after {
content: '';
position: absolute;
width: 100%;
height: 1px;
bottom: -2px;
left: 0;
background-color: #c0c0ff;
transform: scaleX(0);
transform-origin: bottom right;
transition: transform 0.3s ease;
}

a:hover::after {
transform: scaleX(1);
transform-origin: bottom left;
}

.version-info {
margin-top: 40px;
font-size: 14px;
color: rgba(200, 200, 255, 0.7);
opacity: 0;
animation: fadeInText 1s ease-out forwards 1.2s;
}

/* 背景粒子效果 */
.particle {
    position: absolute;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    pointer-events: none;
    z-index: -1;
}`,
    resources: []
  },
  JS: {
    language: 'javascript',
    content: `console.log('Hello, CodeFlux!');

// 粒子效果函数
function createParticles() {
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // 随机大小
        const size = Math.random() * 3 + 1;
        particle.style.width = \`\${size}px\`;
        particle.style.height = \`\${size}px\`;
        
        // 随机位置
        particle.style.left = \`\${Math.random() * 100}vw\`;
        particle.style.top = \`\${Math.random() * 100}vh\`;
        
        // 随机透明度
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        
        document.body.appendChild(particle);
        
        // 动画
        animateParticle(particle);
    }
}

function animateParticle(particle) {
    let posX = parseFloat(particle.style.left);
    let posY = parseFloat(particle.style.top);
    const speedX = (Math.random() - 0.5) * 0.2;
    const speedY = (Math.random() - 0.5) * 0.2;
    
    function move() {
        posX += speedX;
        posY += speedY;
        
        // 边界检查
        if (posX < 0 || posX > 100 || posY < 0 || posY > 100) {
            posX = Math.random() * 100;
            posY = Math.random() * 100;
        }
        
        particle.style.left = \`\${posX}vw\`;
        particle.style.top = \`\${posY}vh\`;
        
        requestAnimationFrame(move);
    }
    
    move();
}

createParticles();`,
    resources: []
  }
}

export default  defaltCode
