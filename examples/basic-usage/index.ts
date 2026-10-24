import type { MinikubeControlPlane } from '@ankhorage/infra-minikube';
import { createInfraAdapter, infraAdapterDescriptor } from '@ankhorage/infra-minikube';

declare const controlPlane: MinikubeControlPlane;
const adapter = createInfraAdapter({ controlPlane });

console.log(infraAdapterDescriptor.id, adapter.descriptor.package);
