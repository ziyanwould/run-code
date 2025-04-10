const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [16, 48, 128];
const iconDir = path.join(__dirname, '../extension/icons');

// 确保图标目录存在
if (!fs.existsSync(iconDir)) {
    fs.mkdirSync(iconDir, { recursive: true });
}

// 读取 SVG 文件
const svgBuffer = fs.readFileSync(path.join(__dirname, '../extension/icons/icon.svg'));

// 生成不同尺寸的 PNG
sizes.forEach(size => {
    sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(path.join(iconDir, `icon${size}.png`))
        .then(() => console.log(`Generated ${size}x${size} icon`))
        .catch(err => console.error(`Error generating ${size}x${size} icon:`, err));
});