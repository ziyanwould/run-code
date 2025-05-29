import packageInfo from '../../package.json'

const defaltCode = {
  HTML: {
    language: 'html',
    content: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>RunCode</title>
</head>
<body>
<!-- 渐变背景容器 -->
<div class="gradient-bg">
  <svg xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="goo">
        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
        <feBlend in="SourceGraphic" in2="goo" />
      </filter>
    </defs>
  </svg>
  <div class="gradients-container">
    <div class="g1"></div>
    <div class="g2"></div>
    <div class="g3"></div>
    <div class="g4"></div>
    <div class="g5"></div>
    <div class="interactive"></div>
  </div>
</div>

<main>
  <section>
    <div class="about-container">
      <h2>RunCode</h2>
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
    content: `:root {
  --color-bg1: rgb(108, 0, 162);
  --color-bg2: rgb(0, 17, 82);
  --color1: 18, 113, 255;
  --color2: 221, 74, 255;
  --color3: 100, 220, 255;
  --color4: 200, 50, 50;
  --color5: 180, 180, 50;
  --color-interactive: 140, 100, 255;
  --circle-size: 80%;
  --blending: hard-light;
}

* {
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
  margin: 0;
  padding: 0;
}

body {
  font-family: "Geist", sans-serif;
  position: relative;
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
  color: #e0e0e0;
}

@keyframes moveInCircle {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes moveVertical {
  0% {
    transform: translateY(-50%);
  }
  50% {
    transform: translateY(50%);
  }
  100% {
    transform: translateY(-50%);
  }
}

@keyframes moveHorizontal {
  0% {
    transform: translateX(-50%) translateY(-10%);
  }
  50% {
    transform: translateX(50%) translateY(10%);
  }
  100% {
    transform: translateX(-50%) translateY(-10%);
  }
}

.gradient-bg {
  width: 100vw;
  height: 100vh;
  position: fixed;
  overflow: hidden;
  background: linear-gradient(40deg, var(--color-bg1), var(--color-bg2));
  top: 0;
  left: 0;
  z-index: -1;
}

.gradient-bg svg {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
}

.gradient-bg .gradients-container {
  filter: url(#goo) blur(40px);
  width: 100%;
  height: 100%;
}

.gradient-bg .g1 {
  position: absolute;
  background: radial-gradient(circle at center, rgba(var(--color1), 0.8) 0, rgba(var(--color1), 0) 50%) no-repeat;
  mix-blend-mode: var(--blending);
  width: var(--circle-size);
  height: var(--circle-size);
  top: calc(50% - var(--circle-size) / 2);
  left: calc(50% - var(--circle-size) / 2);
  transform-origin: center center;
  animation: moveVertical 30s ease infinite;
  opacity: 1;
}

.gradient-bg .g2 {
  position: absolute;
  background: radial-gradient(circle at center, rgba(var(--color2), 0.8) 0, rgba(var(--color2), 0) 50%) no-repeat;
  mix-blend-mode: var(--blending);
  width: var(--circle-size);
  height: var(--circle-size);
  top: calc(50% - var(--circle-size) / 2);
  left: calc(50% - var(--circle-size) / 2);
  transform-origin: calc(50% - 400px);
  animation: moveInCircle 20s reverse infinite;
  opacity: 1;
}

.gradient-bg .g3 {
  position: absolute;
  background: radial-gradient(circle at center, rgba(var(--color3), 0.8) 0, rgba(var(--color3), 0) 50%) no-repeat;
  mix-blend-mode: var(--blending);
  width: var(--circle-size);
  height: var(--circle-size);
  top: calc(50% - var(--circle-size) / 2 + 200px);
  left: calc(50% - var(--circle-size) / 2 - 500px);
  transform-origin: calc(50% + 400px);
  animation: moveInCircle 40s linear infinite;
  opacity: 1;
}

.gradient-bg .g4 {
  position: absolute;
  background: radial-gradient(circle at center, rgba(var(--color4), 0.8) 0, rgba(var(--color4), 0) 50%) no-repeat;
  mix-blend-mode: var(--blending);
  width: var(--circle-size);
  height: var(--circle-size);
  top: calc(50% - var(--circle-size) / 2);
  left: calc(50% - var(--circle-size) / 2);
  transform-origin: calc(50% - 200px);
  animation: moveHorizontal 40s ease infinite;
  opacity: 0.7;
}

.gradient-bg .g5 {
  position: absolute;
  background: radial-gradient(circle at center, rgba(var(--color5), 0.8) 0, rgba(var(--color5), 0) 50%) no-repeat;
  mix-blend-mode: var(--blending);
  width: calc(var(--circle-size) * 2);
  height: calc(var(--circle-size) * 2);
  top: calc(50% - var(--circle-size));
  left: calc(50% - var(--circle-size));
  transform-origin: calc(50% - 800px) calc(50% + 200px);
  animation: moveInCircle 20s ease infinite;
  opacity: 1;
}

.gradient-bg .interactive {
  position: absolute;
  background: radial-gradient(circle at center, rgba(var(--color-interactive), 0.8) 0, rgba(var(--color-interactive), 0) 50%) no-repeat;
  mix-blend-mode: var(--blending);
  width: 100%;
  height: 100%;
  top: -50%;
  left: -50%;
  opacity: 0.7;
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
  background-color: rgba(20, 20, 40, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 38px;
  max-width: 540px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 15px rgba(120, 0, 255, 0.2),
    inset 0 0 1px rgba(255, 255, 255, 0.1);
  border: 0px solid rgba(255, 255, 255, 0.1);
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

.links {
  margin: 20px 0;
}

.link-item {
  margin: 10px 0;
  display: flex;
  align-items: center;
}

.link-label {
  color: #a0a0a0;
  margin-right: 10px;
}

a {
  color: #fff;
  text-decoration: none;
  position: relative;
  transition: color 0.3s ease;
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
  opacity: 1;
  animation: fadeInText 1s ease-out forwards 1.2s;
}`,
    resources: []
  },
  JS: {
    language: 'javascript',
    content: `console.log('Hello, RunCode!');`,
    resources: []
  }
}

export default defaltCode
