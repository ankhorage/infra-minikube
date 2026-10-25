import { INFRA_ADAPTER_CATALOG, isInfraAdapterDescriptor } from '@ankhorage/contracts/infra';
import { describe, expect, it } from 'bun:test';

import { createInfraAdapter, infraAdapterDescriptor } from './index.js';
import { FakeMinikubeControlPlane } from './runtimeFixtures.test.js';

describe('Minikube runtime adapter foundation', () => {
  it('exports the exact Contracts catalog descriptor', () => {
    expect(infraAdapterDescriptor).toEqual(INFRA_ADAPTER_CATALOG.minikube);
    expect(isInfraAdapterDescriptor(infraAdapterDescriptor)).toBe(true);
  });

  it('rejects descriptor identity drift', () => {
    expect(
      isInfraAdapterDescriptor({
        ...infraAdapterDescriptor,
        package: '@ankhorage/not-minikube',
      }),
    ).toBe(false);
  });

  it('exposes the canonical implementation entrypoint', () => {
    const controlPlane = new FakeMinikubeControlPlane();
    expect(createInfraAdapter({ controlPlane }).descriptor).toBe(infraAdapterDescriptor);
  });
});
