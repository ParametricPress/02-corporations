import argparse
import sys
import bpy

class ArgumentParserForBlender(argparse.ArgumentParser):
    """
    This class is identical to its superclass, except for the parse_args
    method (see docstring). It resolves the ambiguity generated when calling
    Blender from the CLI with a python script, and both Blender and the script
    have arguments. E.g., the following call will make Blender crash because
    it will try to process the script's -a and -b flags:
    >>> blender --python my_script.py -a 1 -b 2

    To bypass this issue this class uses the fact that Blender will ignore all
    arguments given after a double-dash ('--'). The approach is that all
    arguments before '--' go to Blender, arguments after go to the script.
    The following calls work fine:
    >>> blender --python my_script.py -- -a 1 -b 2
    >>> blender --python my_script.py --
    """

    def _get_argv_after_doubledash(self):
        """
        Given the sys.argv as a list of strings, this method returns the
        sublist right after the '--' element (if present, otherwise returns
        an empty list).
        """
        try:
            idx = sys.argv.index("--")
            return sys.argv[idx+1:] # the list after '--'
        except ValueError as e: # '--' not in the list:
            return []

    # overrides superclass
    def parse_args(self):
        """
        This method is expected to behave identically as in the superclass,
        except that the sys.argv list will be pre-processed using
        _get_argv_after_doubledash before. See the docstring of the class for
        usage examples and details.
        """
        return super().parse_args(args=self._get_argv_after_doubledash())

parser = ArgumentParserForBlender()

parser.add_argument('output', metavar='OUTPUT',
                    help="The output filename")

args = parser.parse_args()
shouldExportMaterials = True
shouldExportAnimations = True
outputFilename = args.output

bpy.ops.export_scene.gltf(
	export_format='GLTF_EMBEDDED',
    export_draco_mesh_compression_enable=False,
	export_materials=shouldExportMaterials,
	export_colors=shouldExportMaterials,
	export_animations=shouldExportAnimations,
	export_frame_range=shouldExportAnimations,
	export_frame_step=1,
	export_force_sampling=shouldExportAnimations,
	export_nla_strips=shouldExportAnimations,
	export_skins=shouldExportAnimations,
	export_morph=shouldExportAnimations,
	export_morph_normal=shouldExportAnimations,
    export_apply=True,
	filepath=outputFilename
)
