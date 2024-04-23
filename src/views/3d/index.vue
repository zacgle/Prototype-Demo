<template>
  <div>
    <h3>1123</h3>
    <div id="three-container" />
  </div>
</template>

<script>
import * as Three from 'three'

export default {
  name: 'ThreeDimensional',
  mounted() {
    const scene = new Three.Scene()
    const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new Three.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.getElementById('three-container').appendChild(renderer.domElement)

    const geometry = new Three.BoxGeometry()
    const material = new Three.MeshBasicMaterial({ color: 'rgb(255,255,122)' })
    const cube = new Three.Mesh(geometry, material)
    scene.add(cube)
    const edges = new Three.EdgesGeometry(geometry)
    const lineMaterial = new Three.LineBasicMaterial({ color: 'blue', linecap: 'round', linejoin: 'round' })
    const lineSegments = new Three.LineSegments(edges, lineMaterial)
    scene.add(lineSegments)

    lineSegments.position.copy(cube.position)
    lineSegments.rotation.copy(cube.rotation)
    lineSegments.scale.copy(cube.scale)
    camera.position.z = 5

    function animate() {
      requestAnimationFrame(animate)
      const rand = Math.random() * 0.01
      cube.rotation.x += rand
      cube.rotation.y += rand
      cube.rotation.z += rand
      lineSegments.rotation.copy(cube.rotation)

      renderer.render(scene, camera)
    }

    animate()
  },

  beforeDestroy() {
    // 这里清理资源
  }
}

</script>
<style>
#three-container {
  width: 100%;
  height: 100vh;
}
</style>
