import elementPlusIcon from '../assets/templateIcons/element-plus.svg'
import vueIcon from '../assets/templateIcons/vue.png'
import reactIcon from '../assets/templateIcons/react.svg'
import elementIcon from '../assets/templateIcons/element.svg'
import echartsIcon from '../assets/templateIcons/echarts.png'
import g2Icon from '../assets/templateIcons/g2.png'
import angularIcon from '../assets/templateIcons/angular.png'
import vantIcon from '../assets/templateIcons/vant.png'
import leafletIcon from '../assets/templateIcons/leaflet.png'
import konvaIcon from '../assets/templateIcons/konva.png'
import es6Icon from '../assets/templateIcons/es6.webp'
import mindMapIcon from '../assets/templateIcons/mindMap.png'
import codeFluxIcon from '../assets/templateIcons/vue.png' // 暂时使用Vue图标，你可以替换为CodeFlux的图标
import packageInfo from '../../package.json'

// 默认模板
const defaltTemplate = {
  name: '默认模版',
  icon: codeFluxIcon,
  code: {
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
            <a id="repo-url" href="${packageInfo.repository.url}" target="_blank">${packageInfo.repository.url}</a>
          </div>
          <div class="link-item">
            <span class="link-label">官网:</span>
            <a id="homepage-url" href="${packageInfo.homepage}" target="_blank">${packageInfo.homepage}</a>
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
      content: `@import url("https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap");

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
  background-color: rgba(20, 20, 40, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 38px;
  max-width: 540px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 15px rgba(120, 0, 255, 0.2);
  border: 1px solid rgba(120, 0, 255, 0.2);
  transform: translateY(30px);
  opacity: 0;
  animation: fadeIn 1s ease-out forwards 0.3s;
  position: relative;
  overflow: hidden;
}

.about-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, transparent 0%, rgba(30, 30, 60, 0.4) 100%);
  opacity: 0.1;
  animation: rotate 20s linear infinite;
  pointer-events: none;
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
    transform: translateY(0);
  }
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
}`,
      resources: []
    },
    JS: {
      language: 'javascript',
      content: `console.log('Hello, CodeFlux!');`,
      resources: []
    }
  }
}

/*
const = {
    name: '',
    icon: '',
    code: {
        HTML: {
            language: 'html',
            content: ``,
            resources: []
        },
        CSS: {
            language: 'css',
            content: '',
            resources: []
        },
        JS: {
            language: 'javascript',
            content: ``,
            resources: [{
                name: '',
                url: ''
            }]
        },
        VUE: {
            language: 'vue2',
            content: ``,
            resources: []
        }
    },
}
*/

const mindMap = {
  name: '思维导图',
  icon: mindMapIcon,
  code: {
      HTML: {
          language: 'html',
          content: `<div id="mindMapContainer"></div>`,
          resources: []
      },
      CSS: {
          language: 'css',
          content: `
#mindMapContainer {
  width: 800px;
  height: 500px;
}

#mindMapContainer * {
  margin: 0;
  padding: 0;
}          
`,
          resources: [
            {
              name: 'simple-mind-map',
              url: 'https://unpkg.com/simple-mind-map@0.6.3/dist/simpleMindMap.esm.css'
            }
          ]
      },
      JS: {
          language: 'javascript',
          content: `
import MindMap from "simple-mind-map";

const mindMap = new MindMap({
  el: document.getElementById('mindMapContainer'),
  data: {
    "data": {
        "text": "根节点"
    },
    "children": []
  }
});
          `,
          resources: [{
              name: '',
              url: ''
          }],
          importMap: `
{
    "imports": {
        "simple-mind-map": "https://unpkg.com/simple-mind-map@0.6.3/dist/simpleMindMap.esm.js"
    }
}
            `
      },
      VUE: {
          language: 'vue2',
          content: ``,
          resources: []
      }
  },
}

const es6Module = {
  name: '使用ES6模块语法',
  icon: es6Icon,
  code: {
    HTML: {
      language: 'html',
      content: `<div id="app">
{{ message }}
</div>`,
      resources: []
    },
    CSS: {
      language: 'css',
      content: '',
      resources: []
    },
    JS: {
      language: 'javascript',
      content: `import Vue from 'vue'
import moment from 'moment'
var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello ' + moment().format('YYYY')
    }
})`,
      resources: [],
      importMap: `
{
    "imports": {
        "vue": "https://unpkg.com/vue@2.7.14/dist/vue.esm.browser.min.js"
    }
}
            `
    },
    VUE: {
      language: 'vue2',
      content: ``,
      resources: []
    }
  }
}

const vue3SFC = {
  name: 'Vue 3单文件',
  isVueSFC: true,
  icon: vueIcon,
  code: {
    HTML: {
      language: 'html',
      content: ``,
      resources: []
    },
    CSS: {
      language: 'css',
      content: '',
      resources: []
    },
    JS: {
      language: 'javascript',
      content: ``,
      resources: [],
      importMap: `
{
    "imports": {
        "vue": "https://unpkg.com/vue@3.3.4/dist/vue.esm-browser.js"
    }
}
            `
    },
    VUE: {
      language: 'vue3',
      content: `<template>
    <h1>{{ msg }}</h1>
    <input v-model="msg">
</template>

<script setup>
import { ref, createApp } from 'vue'
import moment from 'moment'
// 导出createApp是必须的
const msg = ref('Hello World!' + moment().format('YYYY'))
</script>

<style lang="less">
h1 {
    color: red;
}
</style>  
            `,
      resources: []
    }
  }
}

const vue2SFC_ESM = {
  name: 'Vue 2单文件 ESM版',
  isVueSFC: true,
  icon: vueIcon,
  code: {
    HTML: {
      language: 'html',
      content: ``,
      resources: []
    },
    CSS: {
      language: 'css',
      content: '',
      resources: []
    },
    JS: {
      language: 'javascript',
      content: ``,
      resources: [],
      importMap: `
{
    "imports": {
        "vue": "https://unpkg.com/vue@2.7.14/dist/vue.esm.browser.js"
    }
}
            `
    },
    VUE: {
      language: 'vue2',
      content: `
<template>
    <div>
        <div class="example">{{ msg }}</div>
        <input v-model="msg">
    </div>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'

export default {
    data () {
        return {
            msg: 'Hello world!' + moment().format('YYYY')
        }
    }
}
</script>

<style>
.example {
    color: red;
}
</style>  
            `,
      resources: []
    }
  }
}

const vue2SFC = {
  name: 'Vue 2单文件',
  isVueSFC: true,
  icon: vueIcon,
  code: {
    HTML: {
      language: 'html',
      content: ``,
      resources: []
    },
    CSS: {
      language: 'css',
      content: '',
      resources: []
    },
    JS: {
      language: 'javascript',
      content: ``,
      resources: [
        {
          name: 'Vue 2',
          url: 'https://unpkg.com/vue@2.6.14/dist/vue.js'
        }
      ]
    },
    VUE: {
      language: 'vue2',
      content: `
<template>
    <div>
        <div class="example">{{ msg }}</div>
        <input v-model="msg">
    </div>
</template>

<script>
export default {
    data () {
        return {
            msg: 'Hello world!'
        }
    }
}
</script>

<style>
.example {
    color: red;
}
</style>  
            `,
      resources: []
    }
  }
}

const vue3 = {
  name: 'Vue 3',
  icon: vueIcon,
  code: {
    HTML: {
      language: 'html',
      content: `<div id="hello-vue" class="demo">
{{ message }}
</div>`,
      resources: []
    },
    CSS: {
      language: 'css',
      content: `.demo {
font-family: sans-serif;
border: 1px solid #eee;
border-radius: 2px;
padding: 20px 30px;
margin-top: 1em;
margin-bottom: 40px;
user-select: none;
overflow-x: auto;
}`,
      resources: []
    },
    JS: {
      language: 'javascript',
      content: `const HelloVueApp = {
data() {
    return {
    message: 'Hello Vue!!'
    }
}
}

Vue.createApp(HelloVueApp).mount('#hello-vue')`,
      resources: [
        {
          name: 'Vue 3',
          url: 'https://unpkg.com/vue@3.3.4/dist/vue.global.js'
        }
      ]
    },
    VUE: {
      language: 'vue2',
      content: ``,
      resources: []
    }
  }
}

const vue2 = {
  name: 'Vue 2',
  icon: vueIcon,
  code: {
    HTML: {
      language: 'html',
      content: `<div id="app">
{{ message }}
</div>`,
      resources: []
    },
    CSS: {
      language: 'css',
      content: '',
      resources: []
    },
    JS: {
      language: 'javascript',
      content: `var app = new Vue({
el: '#app',
data: {
    message: 'Hello Vue!'
}
})`,
      resources: [
        {
          name: 'Vue 2',
          url: 'https://unpkg.com/vue@2.7.14/dist/vue.js'
        }
      ]
    },
    VUE: {
      language: 'vue2',
      content: ``,
      resources: []
    }
  }
}

const react = {
  name: 'React',
  icon: reactIcon,
  code: {
    HTML: {
      language: 'html',
      content: `<div id="root"></div>`,
      resources: []
    },
    CSS: {
      language: 'css',
      content: '',
      resources: []
    },
    JS: {
      language: 'babel',
      content: `ReactDOM.render(
<h1>Hello, world!</h1>,
document.getElementById('root')
);`,
      resources: [
        {
          name: 'React',
          url: 'https://unpkg.com/react@18.2.0/umd/react.development.js'
        },
        {
          name: 'react-dom',
          url: 'https://unpkg.com/react-dom@18.2.0/umd/react-dom.development.js'
        }
      ]
    },
    VUE: {
      language: 'vue2',
      content: ``,
      resources: []
    }
  }
}

const elementPlus = {
  name: 'element-plus',
  icon: elementPlusIcon,
  code: {
    HTML: {
      language: 'html',
      content: `<div id="app">
<el-button>{{ message }}</el-button>
</div>`,
      resources: []
    },
    CSS: {
      language: 'css',
      content: '',
      resources: [
        {
          name: 'element-plus',
          url: 'https://unpkg.com/element-plus@2.3.7/dist/index.css'
        }
      ]
    },
    JS: {
      language: 'javascript',
      content: `const App = {
data() {
    return {
    message: "Hello Element Plus",
    };
},
};
const app = Vue.createApp(App);
app.use(ElementPlus);
app.mount("#app");`,
      resources: [
        {
          name: 'Vue 3',
          url: 'https://unpkg.com/vue@3.3.4/dist/vue.global.js'
        },
        {
          name: 'element-plus',
          url: 'https://unpkg.com/element-plus@2.3.7/dist/index.full.js'
        }
      ]
    },
    VUE: {
      language: 'vue2',
      content: ``,
      resources: []
    }
  }
}

const elementUi = {
  name: 'element-ui',
  icon: elementIcon,
  code: {
    HTML: {
      language: 'html',
      content: `<div id="app">
<el-button @click="visible = true">按钮</el-button>
<el-dialog :visible.sync="visible" title="Hello world">
    <p>欢迎使用 Element</p>
</el-dialog>
</div>`,
      resources: []
    },
    CSS: {
      language: 'css',
      content: '',
      resources: [
        {
          name: 'element-ui',
          url: 'https://unpkg.com/element-ui@2.15.13/lib/theme-chalk/index.css'
        }
      ]
    },
    JS: {
      language: 'javascript',
      content: `new Vue({
el: '#app',
data: function() {
    return { visible: false }
}
})`,
      resources: [
        {
          name: 'Vue 2',
          url: 'https://unpkg.com/vue@2.7.14/dist/vue.js'
        },
        {
          name: 'element-ui',
          url: 'https://unpkg.com/element-ui@2.15.13/lib/index.js'
        }
      ]
    },
    VUE: {
      language: 'vue2',
      content: ``,
      resources: []
    }
  }
}

const eCharts = {
  name: 'ECharts',
  icon: echartsIcon,
  code: {
    HTML: {
      language: 'html',
      content: `<!-- 为ECharts准备一个具备大小（宽高）的Dom -->
<div id="main" style="width: 600px;height:400px;"></div>`,
      resources: []
    },
    CSS: {
      language: 'css',
      content: '',
      resources: []
    },
    JS: {
      language: 'javascript',
      content: `// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('main'));

// 指定图表的配置项和数据
var option = {
title: {
    text: 'ECharts 入门示例'
},
tooltip: {},
legend: {
    data:['销量']
},
xAxis: {
    data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
},
yAxis: {},
series: [{
    name: '销量',
    type: 'bar',
    data: [5, 20, 36, 10, 10, 20]
}]
};

// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);`,
      resources: [
        {
          name: 'ECharts',
          url: 'https://unpkg.com/echarts@5.4.2/dist/echarts.js'
        }
      ]
    },
    VUE: {
      language: 'vue2',
      content: ``,
      resources: []
    }
  }
}

const g2 = {
  name: 'G2',
  icon: g2Icon,
  code: {
    HTML: {
      language: 'html',
      content: `<div id="container"></div>`,
      resources: []
    },
    CSS: {
      language: 'css',
      content: '',
      resources: []
    },
    JS: {
      language: 'javascript',
      content: `const data = [
    { type: '未知', value: 654, percent: 0.02 },
    { type: '17 岁以下', value: 654, percent: 0.02 },
    { type: '18-24 岁', value: 4400, percent: 0.2 },
    { type: '25-29 岁', value: 5300, percent: 0.24 },
    { type: '30-39 岁', value: 6200, percent: 0.28 },
    { type: '40-49 岁', value: 3300, percent: 0.14 },
    { type: '50 岁以上', value: 1500, percent: 0.06 },
];

const chart = new G2.Chart({
    container: 'container',
    autoFit: true,
    height: 500,
    padding: [50, 20, 50, 20],
    });
    chart.data(data);
    chart.scale('value', {
    alias: '销售额(万)',
});

chart.axis('type', {
    tickLine: {
        alignTick: false,
    },
});
chart.axis('value', false);

chart.tooltip({
    showMarkers: false, 
});
chart.interval().position('type*value');
chart.interaction('element-active');

// 添加文本标注
data.forEach((item) => {
    chart
        .annotation()
        .text({
        position: [item.type, item.value],
        content: item.value,
        style: {
            textAlign: 'center',
        },
        offsetY: -30,
        })
        .text({
        position: [item.type, item.value],
        content: (item.percent * 100).toFixed(0) + '%',
        style: {
            textAlign: 'center',
        },
        offsetY: -12,
        });
});
chart.render();`,
      resources: [
        {
          name: 'g2',
          url: 'https://unpkg.com/@antv/g2@4.2.10/dist/g2.min.js'
        }
      ]
    },
    VUE: {
      language: 'vue2',
      content: ``,
      resources: []
    }
  }
}

const angular = {
  name: 'Angular 1.x',
  icon: angularIcon,
  code: {
    HTML: {
      language: 'html',
      content: `<div ng-app="">
    <p>名字 : <input type="text" ng-model="name"></p>
    <h1>Hello {{name}}</h1>
    <p ng-bind="name"></p>
</div>`,
      resources: []
    },
    CSS: {
      language: 'css',
      content: '',
      resources: []
    },
    JS: {
      language: 'javascript',
      content: ``,
      resources: [
        {
          name: 'angular',
          url: 'https://unpkg.com/angular@1.8.3/angular.min.js'
        }
      ]
    },
    VUE: {
      language: 'vue2',
      content: ``,
      resources: []
    }
  }
}

const leaflet = {
  name: 'Leaflet',
  icon: leafletIcon,
  code: {
    HTML: {
      language: 'html',
      content: `<div id="mapid"></div>`,
      resources: []
    },
    CSS: {
      language: 'css',
      content: '#mapid { height: 180px; }',
      resources: [
        {
          name: 'leaflet',
          url: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        }
      ]
    },
    JS: {
      language: 'javascript',
      content: `const accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
var mymap = L.map('mapid').setView([51.505, -0.09], 13);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: accessToken
}).addTo(mymap);`,
      resources: [
        {
          name: 'leaflet',
          url: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        }
      ]
    },
    VUE: {
      language: 'vue2',
      content: ``,
      resources: []
    }
  }
}

const vant = {
  name: 'Vant',
  icon: vantIcon,
  code: {
    HTML: {
      language: 'html',
      content: `
<div id="app"></div>            
            `,
      resources: []
    },
    CSS: {
      language: 'css',
      content: '',
      resources: [
        {
          name: 'vant',
          url: 'https://unpkg.com/vant@2.12.54/lib/index.css'
        }
      ]
    },
    JS: {
      language: 'javascript',
      content: `// 在 #app 标签下渲染一个按钮组件
new Vue({
    el: '#app',
    template: '<van-button>按钮</van-button>',
});

// 调用函数组件，弹出一个 Toast
vant.Toast('提示');

// 通过 CDN 引入时不会自动注册 Lazyload 组件
// 可以通过下面的方式手动注册
Vue.use(vant.Lazyload);`,
      resources: [
        {
          name: 'Vue 2',
          url: 'https://unpkg.com/vue@2.7.14/dist/vue.js'
        },
        {
          name: 'vant',
          url: 'https://unpkg.com/vant@2.12.54/lib/vant.min.js'
        }
      ]
    },
    VUE: {
      language: 'vue2',
      content: ``,
      resources: []
    }
  }
}

const konva = {
  name: 'Konva',
  icon: konvaIcon,
  code: {
    HTML: {
      language: 'html',
      content: `<div id="container"></div>`,
      resources: []
    },
    CSS: {
      language: 'css',
      content: `.container {
    width: 500px;
    height: 500px;
}`,
      resources: []
    },
    JS: {
      language: 'javascript',
      content: `// first we need to create a stage
var stage = new Konva.Stage({
    container: 'container',   // id of container <div>
    width: 500,
    height: 500
});

// then create layer
var layer = new Konva.Layer();

// create our shape
var circle = new Konva.Circle({
    x: stage.width() / 2,
    y: stage.height() / 2,
    radius: 70,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 4
});

// add the shape to the layer
layer.add(circle);

// add the layer to the stage
stage.add(layer);

// draw the image
layer.draw();`,
      resources: [
        {
          name: 'konva',
          url: 'https://unpkg.com/konva@9.2.0/konva.min.js'
        }
      ]
    },
    VUE: {
      language: 'vue2',
      content: ``,
      resources: []
    }
  }
}

/**
 * javascript comment
 * @Author: 王林25
 * @Date: 2021-05-14 10:47:23
 * @Desc: 模板列表
 */
const templateList = [
  defaltTemplate,
  mindMap,
  es6Module,
  vue3SFC,
  vue2SFC_ESM,
  vue2SFC,
  vue3,
  vue2,
  react,
  elementPlus,
  elementUi,
  eCharts,
  g2,
  angular,
  vant,
  leaflet,
  konva
]
const templateMap = {
  defaltTemplate,
  mindMap,
  es6Module,
  vue3SFC,
  vue2SFC_ESM,
  vue2SFC,
  vue3,
  vue2,
  react,
  elementPlus,
  elementUi,
  eCharts,
  g2,
  angular,
  vant,
  leaflet,
  konva
}

export const getTemplate = name => {
  return templateMap[name]
}

export default templateList
