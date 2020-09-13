@echo off
call npm run export-gltf -- blender/bicyclist.blend static/gltf/bicyclist.glb
call npm run export-gltf -- blender/gas-station.blend static/gltf/gas-station.glb
