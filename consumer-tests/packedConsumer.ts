import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const repositoryRoot = new URL('..', import.meta.url).pathname;
const consumerDirectory = mkdtempSync(join(tmpdir(), 'ankhorage-infra-minikube-consumer-'));
let archivePath: string | undefined;

try {
  const packOutput = execFileSync('bun', ['pm', 'pack'], {
    cwd: repositoryRoot,
    encoding: 'utf8',
  });
  const archiveName = /(?:^|\n)([^\n]+\.tgz)(?:\n|$)/.exec(packOutput)?.[1];
  if (archiveName === undefined)
    throw new Error('Packing @ankhorage/infra-minikube produced no archive.');

  archivePath = join(repositoryRoot, archiveName);
  writeFileSync(
    join(consumerDirectory, 'package.json'),
    JSON.stringify({
      private: true,
      type: 'module',
      dependencies: { '@ankhorage/infra-minikube': `file:${archivePath}` },
    }),
  );
  writeFileSync(
    join(consumerDirectory, 'consumer.ts'),
    "import type { MinikubeAdapterOptions } from '@ankhorage/infra-minikube';\nconst options: MinikubeAdapterOptions | undefined = undefined;\nvoid options;\n",
  );

  execFileSync(
    'bun',
    ['install', '--ignore-scripts', '--cache-dir', join(tmpdir(), 'infra-minikube-bun-cache')],
    { cwd: consumerDirectory, stdio: 'inherit' },
  );
  const runtimeAssertion =
    "const adapter = await import('@ankhorage/infra-minikube'); if (typeof adapter.createInfraAdapter !== 'function' || adapter.infraAdapterDescriptor.id !== 'minikube') throw new Error('Invalid Minikube public adapter boundary');";
  execFileSync('bun', ['--eval', runtimeAssertion], { cwd: consumerDirectory, stdio: 'inherit' });
  execFileSync('node', ['--input-type=module', '--eval', runtimeAssertion], {
    cwd: consumerDirectory,
    stdio: 'inherit',
  });
  execFileSync(
    join(repositoryRoot, 'node_modules/.bin/tsc'),
    [
      '--noEmit',
      '--module',
      'NodeNext',
      '--moduleResolution',
      'NodeNext',
      '--target',
      'ES2022',
      'consumer.ts',
    ],
    { cwd: consumerDirectory, stdio: 'inherit' },
  );
} finally {
  rmSync(consumerDirectory, { recursive: true, force: true });
  if (archivePath !== undefined) rmSync(archivePath, { force: true });
}
