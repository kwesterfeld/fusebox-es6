const {
  FuseBox,
  HTMLPlugin,
  CSSPlugin,
  JSONPlugin,
  SVGPlugin,
  RawPlugin,
  UglifyESPlugin,
} = require("fuse-box");

const fuse = FuseBox.init({
  debug: true,
  useTypescriptCompiler: true,
  homeDir: "smc",
  output: "dist/$name.js",
  plugins : [
    HTMLPlugin(),
    CSSPlugin(),
    JSONPlugin(),
    SVGPlugin(),
    RawPlugin([
      '.base64',
      '.txt',
      '.xml',
      'app/themes/**/*.css',
      'app/views/monitor/alerting/alerting-event-sample-*.html',
      'app/views/monitor/alerting/alerting-event-sample-*.json'
    ]),
  ],
  alias: {
    "app": "~/app",
    "jolokia": "~/app/vendor/jolokia",
  },
  cache: true
});
const args = process.argv || [];
if (args.includes('dev')) {

  const vendor = fuse.bundle("vendor")
    .target("browser")
    .sourceMaps({ inline: false })
    .instructions(`~ app/main.js`);

  const app = fuse.bundle("smc")
    .target("browser")
    .sourceMaps({ inline: false })
    .instructions(`!> [app/main.js]`)
    .hmr()
    .watch();

  fuse.dev({
    root: '.',
    port : 8183,
    open : args.includes('open'),
    proxy: {
      '/smc': {
        target: 'http://localhost:8182/smc',
        changeOrigin: true,
      }
    }
  });
} else {

  fuse.bundle("smc")
    .target("browser")
    /* .plugin(UglifyESPlugin({
      mangle: {
        toplevel: true,
        screw_ie8: true
      }
    })) */
    .instructions(`> app/main.js`);

}

fuse.run();
