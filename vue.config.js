const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  runtimeCompiler: true,
  lintOnSave: false,
  css: {
    loaderOptions: {
      // sass: {
      //   prependData: '@import "@/assets/css/variables.scss";',
      // }
    },
  },
  devServer: {
    host: "127.0.0.1",
    port: 8081, // 端口
    // proxy: {
    //   "/api": {
    //     target: "http://192.168.51.210:3300",
    //     ws: false,
    //     changeOrigin: true,
    //   },
    // },
  },
  productionSourceMap: false,
  configureWebpack: (config) => {
    // 别名
    config.resolve = {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      extensions: [".js", ".vue", ".json"],
    };
    if (true) {
      // 开启分离js
      config.optimization = {
        runtimeChunk: "single",
        splitChunks: {
          chunks: "all",
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          minSize: 20000,
          maxSize: 1000000,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                // get the name. E.g. node_modules/packageName/not/this/part.js
                // or node_modules/packageName
                const packageName = module.context.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                )[1];
                // npm package names are URL-safe, but some servers don't like @ symbols
                return `npm.${packageName.replace("@", "")}`;
              },
            },
          },
        },
        // css压缩
        // minimizer: [
        //   // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
        //   // `...`,
        //   new CssMinimizerPlugin()
        // ],
        // minimize: true
      };
      // uglifyjs
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_debugger: true,
              drop_console: true, // 生产环境自动删除console
              dead_code: true, // 移除没被引用的代码
              loops: true, // 当do、while 、 for循环的判断条件可以确定是，对其进行优化
            },
            warnings: false,
          },
          sourceMap: false,
          parallel: true, // 使用多进程并行运行来提高构建速度。默认并发运行数：os.cpus().length - 1。
        })
      );
      // 打包分析工具
      // config.plugins.push(new BundleAnalyzerPlugin());
    } else {
      config.devtool = "source-map";
    }
  },
};
