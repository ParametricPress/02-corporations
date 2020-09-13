import {promises as fsPromises, constants as fsConstants} from 'fs';
import path from 'path';
import os from 'os';
import { performance } from 'perf_hooks';

import makeDir from 'make-dir';
import execa from 'execa';
import which from 'which';
import tempy from 'tempy';

class GLTFExporter {
  constructor({
    materials = false,
    animations = false,
    compression = true,
    blenderExecutable
  } = {}) {
    this.materials = materials;
    this.animations = animations;
    this.compression = compression;
    if (blenderExecutable) {
      this.blenderExecutable = blenderExecutable;
    } else {
      switch (os.type()) {
        case 'Darwin':
          this.blenderExecutable = '/Applications/Blender.app/Contents/MacOS/Blender';
          break;
        case 'Windows_NT':
          this.blenderExecutable = 'C:/Program Files/Blender Foundation/Blender 2.83/blender.exe';
          break;
        case 'Linux':
          this.blenderExecutable = which.sync('blender')
          break;
        default:
          throw new Error('constructor: unexpected OS type.')
      }
    }
  }

  async export(input, output) {
    const isBlenderFile = path.extname(input) == '.blend';
    if (!isBlenderFile) throw new Error('export: Input file is not a Blender file.');
    // check if file exists on disk
    try {
      await fsPromises.access(input, fsConstants.F_OK);
    } catch (error) {
      throw error;
      throw new Error('export: Input file does not exist.');
    }
    await makeDir(path.dirname(output))
    const tempFile = tempy.file({extension: 'gltf'});

    const start = performance.now();

    const info = await this.exportFromBlender(input, tempFile);
    const results = await this.compress(tempFile, output);
    const stats = await fsPromises.stat(output);

    const end = performance.now();
    // add time
    return {
      ...info,
      ...results,
      size: stats.size,
      time: (end - start) / 1000.0
    }
  }

  async exportFromBlender(input, output) {
    const { stdout, stderr } = await execa(this.blenderExecutable, [
      '--background',
      input,
      '-P',
      path.join(__dirname, '../blender/export.py'),
      '--',
      output
    ])

    if (!stdout.includes('Finished glTF 2.0 export')) {
      throw new Error(`exportFromBlender: Blender export failed with output:
        ${stdout, stderr}
      `);
    }

    const buffer = await fsPromises.readFile(output, 'utf8');
    const content = JSON.parse(buffer);

    return {
      names: content.nodes.map(node => node.name)
    }
  }

  async compress(input, output) {
    const { stdout } = await execa('gltfpack', [
      '-v',
      '-i',
      input,
      '-cc',
      '-kn',
      '-o',
      output
    ])
    const { nodes, meshes, primitives, materials } = stdout.match(/output: (?<nodes>.*?) nodes, (?<meshes>.*?) meshes \((?<primitives>.*?) primitives\), (?<materials>.*?) materials/m).groups;
    const { triangles, vertices } = stdout.match(/output: (?<triangles>.*?) triangles, (?<vertices>.*?) vertices/m).groups;
    return {
      nodes: parseInt(nodes),
      meshes: parseInt(meshes),
      primitives: parseInt(primitives),
      materials: parseInt(materials),
      triangles: parseInt(triangles),
      vertices: parseInt(vertices)
    }
  }
}

export default GLTFExporter;
