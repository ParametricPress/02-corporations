import MeshoptDecoder from '../vendor/meshopt/meshopt_decoder'
import { EXT_meshopt_compression } from '../vendor/meshopt/THREE.EXT_meshopt_compression'

export function meshopt() {
  return (loader) => {
    loader.register(function (parser) {
      const res = new EXT_meshopt_compression(parser, MeshoptDecoder);
      res.name = "MESHOPT_compression";
      return res;
    });
  }
}
