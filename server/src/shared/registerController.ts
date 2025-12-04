import type { Context, Hono } from 'hono';

export function registerController(app: Hono, ControllerClass: any) {
  const instance = new ControllerClass();
  const routeMeta = ControllerClass.prototype.route;
  if (!routeMeta) {
    throw new Error(
      `Controller ${ControllerClass.name} missing route metadata`,
    );
  }

  const method = routeMeta.method.toLowerCase();
  (app as any)[method](routeMeta.path, (c: Context) => instance.handler(c));
}
