# THREE Occlusion Querying

This library for THREE.js adds Occlusion Querying to the rendering pipeline.

# Usage

Simply replace WebGLRenderer with WebGLOcclusionRenderer,
and you're all set!

```js

const renderer = new WebGLOcclusionRenderer(myRendererOptions, myScene, myCamera);

renderer.render();

```

# NOTE!!!!

This library doesn't use WebGL2's API for occlusion culling. It calculates occluded objects by itself.

# Roadmap

TODO: Transparency

# Where can I find builds?

They can be found on CDNs like [JSDelivr](https://www.jsdelivr.com/package/npm/threejs-occlusion-query?tab=files&path=src).
