# vue-vr

这个是一个使用 vue3 + vite + typescript + threejs 的 vr 测试项目，通过 vr 全景照片的展示，实现多场景浏览。

本项目只是一个测试项目，为实际开发vr展示3d效果并进行互动提供思路。

## 思路

任意一个场景对应一个 vr 全景照片，通过鼠标控制 camara 旋转、缩放，实现全景浏览。

1. 通过 threejs 的 loader 加载 vr 全景照片
2. 将照片渲染成球体材质
3. 通过鼠标控制 camara 旋转、缩放
4. 增加标签到场景中
5. 渲染整体

在主页面下方，有不同场景的切换按钮，点击切换场景。

本思路：

> 每一个场景对应一个页面，也就是说不同 vr 对应不同路由页面

另一个未使用的思路是：

1. 每一个场景对应一个球体
2. 每一个球体按位置挨着构建到场景中
3. 通过动画切换场景

## 封装说明

将常用的初始化，封装到`src\lib\Vr.ts`中。

将标签使用方法，封装到`src\lib\Tag.ts`中。

### vr 封装

在 `src/lib/Vr.ts` 中，封装了常规 vr 需要的场景、相机、渲染器并封装了初始化。

```ts
class Vr {
  // 添加一个属性来保存场景和相机
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  // 模型渲染器
  public renderer = new THREE.WebGLRenderer();
  // css3d渲染器（用来渲染标签）
  public css3DRenderer = new CSS3DRenderer();
  // css2d渲染器（用来渲染标签）
  public css2DRenderer = new CSS2DRenderer();
  ...
}
```

### tag 封装

在 `src/lib/Tag.ts` 中，封装了标签的生成。

通过传入 tag 的 htmlId、位置、缩放比例、是否是 3D 标签等参数，生成对应的标签对象。

一般建议使用

1. 在`template`中添加标签 html 元素`，比如：

```html
<div id="tag" @click="$router.push('/center')">
  <TagImgDesc
    :img-path="picUrl('png/right.png')"
    desc="前往Center"
    class="tag-blink tag-2d-clickable"
  />
</div>
<div id="tag1" @click="$router.push('/center')">
  <TagImgDesc desc="前往Center" class="tag-blink tag-2d-clickable" />
</div>
```

2. `generateTag`或`generateSpriteWith2DTag`方法，生成对应的标签。

```ts
// 生成2D标签
const tagObj = generateTag("tag", position, scale, false);
// 生成带有2D标签的Sprite
const tagObj1 = generateSpriteWith2DTag(
  tag2dParams, spriteParams
);
```

3. 将生成的标签添加到场景中。

```ts
vr.scene.add(tagObj);
vr.scene.add(tagObj1);
```

## 调试标签

1. 创建一个标签

```ts
let tag2dParams = {
  htmlId: "tag-sprite",
  offset: { x: 0, y: 0, z: 0 },
};
let spriteParams = {
  position: { x: 0, y: 0, z: -10 },
  scale: { x: 1, y: 1, z: 1 },
  materialPicPath: picUrl("png/forward.png"),
  rotation: (45 * Math.PI) / 180,
};
const sprite = generateSpriteWith2DTag(tag2dParams, spriteParams);
vr.scene.add(sprite);
```

2. 添加 debug

```ts
// 添加调试
const tagDebug = new TagDebug("DebugView");
tagDebug.addPosition(sprite.position);
tagDebug.addRotation(sprite.material);
tagDebug.addScale(sprite.scale);
```
将增加一个 `DebugView` 标签，右上角有控制位置和缩放的按钮，方便通过调试，确定要在哪个位置添加标签。

## 标签说明

已经可以使用 2D、3D、`Spirate`标签、`Sprite + 2D`标签。

使用`Spirate`来添加标签，效果最好（可以方便的控制箭头图片转动方向）。

1. 使用 3D 标签的话，位置确定好以后，显示需要旋转，不太好控制。
2. 使用 2D 标签，总是面向镜头，可以更好的控制位置。
3. 使用 Spirate 再添加 2D 标签，Spirate 默认总是面向镜头，有跟 2D 标签一样的效果。但是因为添加的是模型，比较 2D 标签，体验会更好。

### sprite+2d 标签
2d标签的位置是相对 Sprite 的，所以，如果 Sprite 的位置是动态的，那么，2d标签的位置也是动态的。
封装了`TagImgDesc`组件，这个组件下方有div占位，所以2d标签相对sprite的位置可以设置为{x:0,y:0,z:0}，正好显示在sprite之上。

后续如果sprite大小变化，可能需要调整2d标签的位置。

## 开发指南

1. `src\views`中新增页面
2. `src\router\index.ts`中增加 router 配置
3. `src\APP.vue`中增加新的页面

## 项目运行

1. 安装依赖包：npm install
2. 运行项目：npm run dev
   > 使用 `--host 局域网地址` 可以在开发运行中暴露局域网 ip，方便在局域网内访问
3. 打包项目：npm run build
