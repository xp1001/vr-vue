<template>
    <div id="threejs-main"></div>
    <div id="tag-home" class="tag-blink" @click="$router.push('/')">前往主页</div>
    <div id="tag-center" @click="$router.push('/center')">
        <TagImgDesc desc="前往Center" class="tag-blink tag-2d-clickable"/>
    </div>
</template>

<script setup lang="ts">
import { onActivated, onMounted, onUnmounted } from 'vue'
import * as THREE from "three"
import { Vr } from '@/lib/Vr'
import { generateTag, generateSpriteWith2DTag, TagDebug } from '@/lib/Tag'
import { picUrl } from '@/lib/BaseFile'
import TagImgDesc from '@/components/TagImgDesc.vue'

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

// 设置背景色为蓝色
// vr.renderer.setClearColor('blue')
// 加载vr图片
const sphere = vr.initVr(picUrl('picvr/1.JPG'), { radius: 20, widthSegments: 32, heightSegments: 32 })
// 添加标签到合适的位置
const tagInit = () => {
    // 增加一个2D标签
    const tag = generateTag('tag-home', { x: 10, y: -5, z: 3 }, { x: 0.05, y: 0.05, z: 1 }, false)
    if (tag) {
        sphere.add(tag)        
    }

    // 前往中心的标签
    let tag2dParams = { htmlId: 'tag-center', offset: { x: 0, y: 0, z: 0 } }
    let spriteParams = {
        position: { x: -10, y: -5, z: 1 },
        scale: { x: 1, y: 1, z: 1 },
        materialPicPath: picUrl('png/forward.png'),
        rotation: 0
    }
    const sprite = generateSpriteWith2DTag(tag2dParams, spriteParams);
    vr.scene.add(sprite)
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
    const mainDiv = document.getElementById('threejs-main')
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

// 页面卸载
onUnmounted(() => {
    // 释放资源
    vr.destroy()
})

// vue页面被激活时
onActivated(()=>{
    // 切换位置及视角，此处将摄像头重置了
    cameraReset()
})



// 调整窗口大小
window.addEventListener('resize', function() {
    vr.resize(window.innerWidth, window.innerHeight)
});

</script>