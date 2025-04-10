const path = require('path')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const { GenerateSW } = require('workbox-webpack-plugin')

module.exports = {
    publicPath: './',
    outputDir: './docs/',
    lintOnSave: false,
    productionSourceMap: false,
    transpileDependencies: [/monaco-editor-textmate/],
    configureWebpack: {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src/')
            }
        },
        plugins: [
            new MonacoWebpackPlugin({
                languages: ['css', 'html', 'javascript', 'less', 'pug', 'scss', 'typescript', 'coffee']
            }),
            new GenerateSW({
                clientsClaim: true,
                skipWaiting: true,
                maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
                runtimeCaching: [{
                    urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'images',
                        expiration: {
                            maxEntries: 60,
                            maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
                        }
                    }
                }, {
                    urlPattern: /\.(?:js|css)$/,
                    handler: 'StaleWhileRevalidate',
                    options: {
                        cacheName: 'static-resources',
                        expiration: {
                            maxEntries: 60,
                            maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
                        }
                    }
                }, {
                    urlPattern: /^https:\/\/unpkg\.com/,
                    handler: 'StaleWhileRevalidate',
                    options: {
                        cacheName: 'cdn-resources',
                        expiration: {
                            maxEntries: 60,
                            maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
                        }
                    }
                }]
            })
        ],
        optimization: {
            minimize: true
        }
    }
}
