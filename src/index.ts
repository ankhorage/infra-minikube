/** Public Minikube runtime adapter package boundary. */
export { infraAdapterDescriptor } from './constants/infra.js';
export { createMinikubeCliControlPlane } from './features/cluster-runtime/adapters/createMinikubeCliControlPlane.js';
export { createInfraAdapter } from './features/cluster-runtime/composition/createInfraAdapter.js';
export type {
  MinikubeAdapterOptions,
  MinikubeCliControlPlaneOptions,
  MinikubeClusterIdentity,
  MinikubeClusterObservation,
  MinikubeClusterSpec,
  MinikubeCommandRequest,
  MinikubeCommandResult,
  MinikubeCommandRunner,
  MinikubeControlPlane,
  MinikubeDesiredState,
  MinikubeEndpointOutput,
} from './types/minikubeRuntime.js';
