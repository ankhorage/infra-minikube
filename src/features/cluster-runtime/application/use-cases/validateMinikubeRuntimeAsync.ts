import type { InfraExecutionContext, InfraResult } from '@ankhorage/contracts/infra';

import type {
  MinikubeAdapterOptions,
  MinikubeDesiredState,
} from '../../../../types/minikubeRuntime.js';
import { getMinikubeClusterSpec } from '../../utils/getMinikubeClusterSpec.js';

/*** Validate Minikube selection, portable compute target and local control-plane prerequisites. */
export async function validateMinikubeRuntimeAsync(
  options: MinikubeAdapterOptions,
  context: InfraExecutionContext,
  desired: MinikubeDesiredState,
): Promise<InfraResult<null>> {
  const spec = getMinikubeClusterSpec(context, desired);
  if (!spec.ok) return spec;
  return options.controlPlane.validateAsync(spec.value, context.signal);
}
