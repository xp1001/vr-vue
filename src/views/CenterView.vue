<template>
    <div id="threejs-center"></div>
    <div id="tag2main" @click="$router.push('/main')">
        <TagImgDesc desc="前往Main" class="tag-blink tag-2d-clickable" />
    </div>
    <div id="tag2debug" @click="$router.push('/debug')">
        <TagImgDesc desc="前往Debug" class="tag-blink tag-2d-clickable" />
    </div>
</template>

<script setup lang="ts">
import { onActivated, onMounted, onUnmounted, ref } from 'vue'
import { Vr } from '@/lib/Vr'
import { generateSpriteWith2DTag, TagDebug } from '@/lib/Tag'
import TagImgDesc from '@/components/TagImgDesc.vue'

import { picUrl } from '@/lib/BaseFile'
const cameraLookAt = { x: 0, y: 0, z: 0 }
const cameraOrigin = { x: 0, y: 0, z: 0.1 }

const vr = new Vr({
    cameraParam: {
        fov: 75,
        aspect: window.innerWidth / window.innerHeight
    },
    renderParam: {
        width: window.innerWidth,
        height: window.innerHeight
    }
})

const cameraReset = () => {
    vr.camera.position.set(cameraOrigin.x, cameraOrigin.y, cameraOrigin.z)
    vr.camera.lookAt(cameraLookAt.x, cameraLookAt.y, cameraLookAt.z)
}

// 加载vr图片
vr.initVr(picUrl('picvr/2.JPG'), { radius: 20, widthSegments: 32, heightSegments: 32 })
// 添加标签到合适的位置
const tagInit = () => {
    // 前往Main的标签
    let tag2dParams = { htmlId: 'tag2main', offset: { x: 0, y: 0, z: 0 } }
    let spriteParams = {
        position: { x: 10, y: -5, z: 1 },
        scale: { x: 1, y: 1, z: 1 },
        materialPicPath: picUrl('png/forward.png'),
        rotation: 0
    }
    const sprite = generateSpriteWith2DTag(tag2dParams, spriteParams);
    vr.scene.add(sprite)
    
    // 前往中心的标签
    let tag2dParams1 = { htmlId: 'tag2debug', offset: { x: 0, y: 0, z: 0 } }
    let spriteParams1 = {
        position: { x: -10, y: -5, z: -10 },
        scale: { x: 1, y: 1, z: 1 },
        materialPicPath: picUrl('png/forward.png'),
        rotation: 50 * Math.PI / 180
    }
    const sprite1 = generateSpriteWith2DTag(tag2dParams1, spriteParams1);
    vr.scene.add(sprite1)
}

// 控制器
const controls = vr.initControls({
    enableDamping: true,
    enableZoom: false,
    enablePan: false,
})
controls.autoRotate = true
controls.autoRotateSpeed = 0.5

onMounted(() => {
    // 将threejs元素添加到dom中
    const mainDiv = document.getElementById('threejs-center')
    mainDiv?.appendChild(vr.renderer.domElement)
    mainDiv?.appendChild(vr.css3DRenderer.domElement)
    mainDiv?.appendChild(vr.css2DRenderer.domElement)
    // 初始化标签
    tagInit()
    // 初始化摄像机位置
    cameraReset()
    // 循环渲染
    vr.animate()
})

onUnmounted(() => {
    vr.destroy()
})

// vue页面被激活时
onActivated(() => {
    // 切换位置及视角，此处将摄像头重置了
    cameraReset()
})

// 调整窗口大小
window.addEventListener('resize', function () {
    vr.resize(window.innerWidth, window.innerHeight)
});

</script>
