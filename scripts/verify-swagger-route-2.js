const app = require('../src/app');

function findRoutes() {
  const router = app._router;
  console.log('app._router:', router ? 'exists' : 'missing');
  if (!router) return [];
  const stack = router.stack || [];
  console.log('router.stack length:', stack.length);
  const out = [];
  for (const layer of stack) {
    if (layer.route && layer.route.path) {
      out.push({ method: Object.keys(layer.route.methods).join(','), path: layer.route.path });
    }
  }
  return out;
}

console.log('Loaded app OK');
console.log(findRoutes());

