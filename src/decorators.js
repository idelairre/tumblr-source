const decoratedFuncs = ['fetch', 'load', 'save'];

function decorateFn(name, fn) {
  return function (target) {
    target.prototype[name] = function() {
      return fn.apply(target.prototype, arguments);
    }
    return target;
  }
}

export function Options(options) {
  return function (target) {
    Object.assign(target.prototype, {
      options
    });
    return target;
  }
}

export function Silent(val = true) {
  return function (target) {
    Object.assign(target.prototype, {
      silent: val
    });
    return target;
  }
}

export function Verbose(val = true) {
  return function (target) {
    Object.assign(target.prototype, {
      silent: !val
    });
    return target;
  }
}

export function Load(func) {
  if (typeof func === 'function') {
    return function (target) {
      target.prototype._load = func();
      return target;
    }
  } else if (typeof func === 'object') {
    const prop = func;
    return function (target) {
      target.prototype._load = prop;
      return target;
    }
  }
}


export function DecorateFn(klass, name, fn) {
  name = decoratedFuncs.includes(name) ? `_${name}` : name;
  klass.prototype[name] = function() {
    return fn.apply(klass.prototype, arguments);
  }
}

export const Condition = decorateFn.bind(this, 'condition');

export const Fetch = decorateFn.bind(this, '_fetch');

export const Step = decorateFn.bind(this, 'step');

export const Save = decorateFn.bind(this, '_save');

export const Parse = decorateFn.bind(this, 'parse');
