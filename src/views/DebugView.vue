<template>
    <div id="threejs-main"></div>
    <div id="tag3D" @click="$router.push('/main')">
        <TagImgDesc :img-path="picUrl('png/forward.png')" desc="前往Main 3D" class="tag-blink tag-2d-clickable" />
    </div>
    <div id="tag" @click="$router.push('/center')">
        <TagImgDesc :img-path="picUrl('png/right.png')" desc="前往Center 2D" class="tag-blink tag-2d-clickable" />
    </div>
    <div id="tag-sprite">
        <TagImgDesc desc="Sprite Tag Debug" class="tag-blink tag-2d-clickable" />
    </div>
</template>

<script setup lang="ts">
import { onActivated, onMounted, onUnmounted } from 'vue'
import { Vr } from '@/lib/Vr'
import { generateTag, generateSpriteWith2DTag, TagDebug } from '@/lib/Tag'
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

// 镜头拉远一点
vr.camera.position.z = 10
// 设置背景色为蓝色
vr.renderer.setClearColor('blue')
// 加载vr图片
vr.initVr(picUrl('picvr/3.JPG'), { radius: 20, widthSegments: 32, heightSegments: 32 })
// 添加标签到合适的位置
const tagInit = () => {
    // 增加一个2D标签
    const tag = generateTag('tag', { x: 10, y: -2, z: -10 }, { x: 0.05, y: 0.05, z: 1 }, false)
    if (tag) {
        vr.scene.add(tag)
    }
    // 增加一个3D标签
    const tag3d = generateTag('tag3D', { x: 7, y: -2, z: -10 }, { x: 0.05, y: 0.05, z: 1 }, true)
    if (tag3d) {
        // 调整文字方向
        // tag3d.rotation.x = -Math.PI / 4;
        vr.scene.add(tag3d)
    }

    let tag2dParams = {
        htmlId: 'tag-sprite',
        offset: { x: 0, y: 0, z: 0 }
    }
    let spriteParams = {
        position: { x: 0, y: 0, z: -10 },
        scale: { x: 1, y: 1, z: 1 },
        materialPicPath: picUrl('png/forward.png'),
        rotation: 45 * Math.PI / 180
    }
    const sprite = generateSpriteWith2DTag(tag2dParams, spriteParams);
    vr.scene.add(sprite)

    // 添加调试
    const tagDebug = new TagDebug('DebugView')
    tagDebug.addPosition(sprite.position)
    tagDebug.addRotation(sprite.material)
    tagDebug.addScale(sprite.scale)
}

// 控制器
const controls = vr.initControls({
    enableDamping: true,
    enableZoom: true,
    enablePan: true,
})
// 可以设置controls的其他参数
// 设置可以拉远的距离，避免拖动过远，摄像头都跑到球体外面了
// controls.maxDistance = 15
// controls.minDistance = 1
// 或者直接禁止缩放，就不会跳到球体外部了
// controls.enableZoom = false

onMounted(() => {
    // 将threejs元素添加到dom中
    const mainDiv = document.getElementById('threejs-main')
    mainDiv?.appendChild(vr.renderer.domElement)
    mainDiv?.appendChild(vr.css3DRenderer.domElement)
    mainDiv?.appendChild(vr.css2DRenderer.domElement)

    // 初始化标签
    tagInit()

    // 切换位置及视角
    cameraReset()

    // 循环渲染
    vr.animate(() => {
        // 自动旋转
        if (vr.controls && vr.sphere) {
            // vr.controls.autoRotate = true;
            // 控制旋转速度
            // vr.controls.autoRotateSpeed = 0.5;
            // 检查摄像机位置是否在球体内
            // var cameraPosition = vr.camera.position;
            // var distance = cameraPosition.distanceTo(vr.sphere.position);
            // if (distance < 2) {
            //     // 如果摄像机在球体内，则将其位置调整到球体的边界
            //     cameraPosition.setLength(2);
            //     vr.camera.position.copy(cameraPosition);
            // }
        }

    })
})

// 页面卸载
onUnmounted(() => {
    // 释放资源
    vr.destroy()
})

// vue页面被激活时
onActivated(() => {
    // 切换位置及视角，此处将摄像头重置了
    // cameraReset()
})



// 调整窗口大小
window.addEventListener('resize', function () {
    vr.resize(window.innerWidth, window.innerHeight)
});

</script>