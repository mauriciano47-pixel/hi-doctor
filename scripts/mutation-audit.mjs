/**
 * HIDOCTOR — Motor Real de Mutation Testing en Sandbox Aislado
 * Copia los módulos a scratch/mutation_sandbox, muta código fuente real
 * y ejecuta `node --test` verificando 100% Kill Rate empírico.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const SANDBOX = path.join(ROOT, 'scratch', 'mutation_sandbox');

const MUTATIONS = [
  {
    id: 'MUT-HD-01',
    name: 'Invertir umbral de fiebre (>= 38.0 -> >= 42.5)',
    file: 'src/runtimeContracts.js',
    target: 'if (cleanTemp >= 38.0) classification =',
    replacement: 'if (cleanTemp >= 42.5) classification =',
    testFile: 'tests/runtimeContracts.test.js'
  },
  {
    id: 'MUT-HD-02',
    name: 'Duplicar dosis paracetamol (15.0 -> 30.0 mg/kg)',
    file: 'src/runtimeContracts.js',
    target: 'let doseMgPerKg = 15.0;',
    replacement: 'let doseMgPerKg = 30.0;',
    testFile: 'tests/runtimeContracts.test.js'
  },
  {
    id: 'MUT-HD-03',
    name: 'Sabotear rango mínimo temperatura (tempCelsius >= 34.0 -> tempCelsius >= 20.0)',
    file: 'src/runtimeContracts.js',
    target: 'tempCelsius >= 34.0 && tempCelsius <= 43.0',
    replacement: 'tempCelsius >= 20.0 && tempCelsius <= 43.0',
    testFile: 'tests/runtimeContracts.test.js'
  },
  {
    id: 'MUT-HD-04',
    name: 'Invertir detección de Banderas Rojas (length > 0 -> length < 0)',
    file: 'src/runtimeContracts.js',
    target: 'isEmergency: detectedRedFlags.length > 0,',
    replacement: 'isEmergency: detectedRedFlags.length < 0,',
    testFile: 'tests/runtimeContracts.test.js'
  },
  {
    id: 'MUT-HD-05',
    name: 'Sabotear dosis diaria máxima (* 4 -> * 1)',
    file: 'src/runtimeContracts.js',
    target: 'Number((singleDoseMg * 4).toFixed(1))',
    replacement: 'Number((singleDoseMg * 1).toFixed(1))',
    testFile: 'tests/runtimeContracts.test.js'
  }
];

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDirSync(s, d);
    else fs.copyFileSync(s, d);
  }
}

console.log('🧬 [HIDOCTOR MUTATION SANDBOX] Ejecutando mutaciones empíricas en código fuente...');
let killed = 0;

try {
  fs.rmSync(SANDBOX, { recursive: true, force: true });
  fs.mkdirSync(SANDBOX, { recursive: true });
  fs.copyFileSync(path.join(ROOT, 'package.json'), path.join(SANDBOX, 'package.json'));
  copyDirSync(path.join(ROOT, 'src'), path.join(SANDBOX, 'src'));
  copyDirSync(path.join(ROOT, 'tests'), path.join(SANDBOX, 'tests'));

  for (const mut of MUTATIONS) {
    const targetPath = path.join(SANDBOX, mut.file);
    const original = fs.readFileSync(targetPath, 'utf8');
    if (!original.includes(mut.target)) {
      throw new Error(`Patrón objetivo no encontrado en ${mut.file}: ${mut.target}`);
    }
    fs.writeFileSync(targetPath, original.replace(mut.target, mut.replacement), 'utf8');
    const res = spawnSync(process.execPath, ['--test', mut.testFile], { cwd: SANDBOX, encoding: 'utf8' });
    fs.writeFileSync(targetPath, original, 'utf8');

    if (res.status !== 0) {
      killed++;
      console.log(` ✅ KILLED [${mut.id}]: ${mut.name}`);
    } else {
      console.error(` ❌ SURVIVED [${mut.id}]: ${mut.name}`);
    }
  }
} finally {
  fs.rmSync(SANDBOX, { recursive: true, force: true });
}

const rate = Math.round((killed / MUTATIONS.length) * 100);
console.log(`\n📊 Kill Rate Empírico HiDoctor: ${killed}/${MUTATIONS.length} (${rate}%)`);
process.exit(killed === MUTATIONS.length ? 0 : 1);
