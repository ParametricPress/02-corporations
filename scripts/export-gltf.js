import path from 'path';
import util from 'util';
import process from 'process';

import minimist from 'minimist';
import ora from 'ora';
import chalk from 'chalk';
import prettyBytes from 'pretty-bytes';

import GLTFExporter from './lib/GLTFExporter';

const argv = minimist(process.argv.slice(2));

if (argv._.length !== 2) {
  console.log('Usage: npm run export-gltf -- input.blend output.glb')
  process.exit(1);
}

const input = path.join(process.cwd(), argv._[0]);
const output = path.join(process.cwd(), argv._[1]);

const exporter = new GLTFExporter();

(async () => {
	const exportPromise = exporter.export(input, output);
  ora.promise(exportPromise, 'Exporting compressed GLTF file from Blender file')
  const results = await exportPromise
  ora().succeed(`Exported ${chalk.yellow(results.names.length)} nodes named ${util.inspect(results.names, {colors: true})}`)
  ora().succeed(`Exported ${chalk.yellow(results.triangles)} triangles and ${chalk.yellow(results.vertices)} vertices`)
  ora().succeed(`Output file is ${chalk.yellow(prettyBytes(results.size))}`)
  ora().succeed(`Operation completed in ${chalk.yellow(results.time)} seconds`)
})();
