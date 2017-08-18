
import angular from 'angular';

// Mock this.
const reloadState = {modules: {}}

// Register our modules.
export function registerModules(modules) {
  modules.forEach(module => registerModule(module));
}
export function registerModule(module) {
  if (!module) {
    throw new Error('Cannot register a null module');
  }
  if (typeof module.name === 'undefined') {
    throw new Error('Cannot register an unnamed module');
  }
  if (!reloadState.modules[module.name]) {
    reloadState.modules[module.name] = module.name;
  } else {
    console.log('Ignoring duplicate module registration', module.name);
  }
  return module;
}
