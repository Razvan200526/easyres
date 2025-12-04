import type { RESOURCE_STATES } from './constants';

export type ResourceReadyState = (typeof RESOURCE_STATES)[number];
