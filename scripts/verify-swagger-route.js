const app = require('../src/app');

function listRoutes(expressApp) {
  const routes = [];
  const stack = expressApp && expressApp._router && expressApp._router.stack ? expressApp._router.stack : [];
  for (const layer of stack) {
    if (layer.route && layer.route.path && layer.route.methods) {
      const methods = Object.keys(layer.route.methods).filter((m) => layer.route.methods[m]);
      for (const method of methods) {
        routes.push({ method: method.toUpperCase(), path: layer.route.path });
      }
    }
  }
  return routes;
}

console.log('Routes with exact layer.route:', listRoutes(app));

