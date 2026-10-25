import type { InfraRuntimeAdapter } from '@ankhorage/contracts/infra';

import { infraAdapterDescriptor } from '../../../constants/infra.js';
import type { MinikubeAdapterOptions } from '../../../types/minikubeRuntime.js';
import { createMinikubeCliControlPlane } from '../adapters/createMinikubeCliControlPlane.js';
import { destroyMinikubeRuntimeAsync } from '../application/use-cases/destroyMinikubeRuntimeAsync.js';
import { ensureMinikubeRuntimeAsync } from '../application/use-cases/ensureMinikubeRuntimeAsync.js';
import { getMinikubeStatusAsync } from '../application/use-cases/getMinikubeStatusAsync.js';
import { planMinikubeRuntimeAsync } from '../application/use-cases/planMinikubeRuntimeAsync.js';
import { suspendMinikubeRuntimeAsync } from '../application/use-cases/suspendMinikubeRuntimeAsync.js';
import { validateMinikubeRuntimeAsync } from '../application/use-cases/validateMinikubeRuntimeAsync.js';

/***
 * Create the canonical Minikube runtime adapter entrypoint.
 *
 * The caller supplies a Minikube-specific command boundary. Standard workload projection and
 * reconciliation are delegated to the published Kubernetes driver.
 *
 * @readme
 */
export function createInfraAdapter(
  options?: MinikubeAdapterOptions,
): InfraRuntimeAdapter<'minikube'> {
  const resolved = options ?? { controlPlane: createMinikubeCliControlPlane() };
  return {
    descriptor: infraAdapterDescriptor,
    validateAsync: (context, desired) => validateMinikubeRuntimeAsync(resolved, context, desired),
    planAsync: (context, desired) => planMinikubeRuntimeAsync(resolved, context, desired),
    ensureAsync: (context, desired) => ensureMinikubeRuntimeAsync(resolved, context, desired),
    statusAsync: (context, desired) => getMinikubeStatusAsync(resolved, context, desired),
    suspendAsync: (context, desired) => suspendMinikubeRuntimeAsync(resolved, context, desired),
    destroyAsync: (context, desired, request) =>
      destroyMinikubeRuntimeAsync(resolved, context, desired, request),
  };
}
