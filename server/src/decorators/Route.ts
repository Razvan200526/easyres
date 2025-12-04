import type { HTTPMethod } from 'better-auth';

export function Route(method: HTTPMethod, path: string, description?: string) {
  return (constructor: Function) => {
    constructor.prototype.route = {
      method,
      path,
      description,
      handlerName: constructor.name,
    };
  };
}
