import * as THREE from "three";
import {
  CSS3DObject,
  CSS3DRenderer,
} from "three/addons/renderers/CSS3DRenderer.js";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
// 从threejs扩展库引入gui.js
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

interface TagPosition {
  x: number;
  y: number;
  z: number;
}
interface TagScale {
  x: number;
  y: number;
  z: number;
}

/*
 * 生成Sprite标签
 *
 * @param position 标签位置
 * @param scale 标签尺寸宽高
 * @param materialPicPath 标签材质图片路径
 * @param rotation 标签旋转角度，单位是弧度值
 */
export function generateSpriteTag(
  position: TagPosition,
  scale: TagScale,
  materialPicPath: string,
  rotation: number
) {
  const texture = new THREE.TextureLoader().load(materialPicPath);
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture, //设置精灵纹理贴图
    rotation: rotation, //弧度值
  });
  const tagObject = new THREE.Sprite(spriteMaterial);
  tagObject.scale.set(scale.x, scale.y, scale.z); //缩放标签尺寸
  tagObject.position.set(position.x, position.y, position.z);

  return tagObject;
}
/*
 * 生成3D标签
 *
 * @param htmlId 3D标签的html元素id
 * @param position 标签位置
 * @param scale 标签尺寸缩放
 */
export function generate3DTag(
  htmlId: string,
  position: TagPosition,
  scale: TagScale
) {
  const tag = document.getElementById(htmlId);
  if (tag) {
    let tagObject = new CSS3DObject(tag);
    tagObject.scale.set(scale.x, scale.y, scale.z); //缩放标签尺寸
    tagObject.position.set(position.x, position.y, position.z);
    if (position.z > 0) {
      // 标签默认是朝向相机，如果标签在相机后面，3D标注要旋转180度
      tagObject.rotation.y = Math.PI;
    }
    return tagObject;
  } else {
    return undefined;
  }
}
/*
 * 生成2D标签
 *
 * @param htmlId 2D标签的html元素id
 * @param position 标签位置
 * @param scale 无用，2d标签没有缩放，大小由css定义
 */
export function generate2DTag(
  htmlId: string,
  position: TagPosition,
  scale: TagScale
) {
  const tag = document.getElementById(htmlId);
  if (tag) {
    let tagObject = new CSS2DObject(tag);
    tagObject.position.set(position.x, position.y, position.z);
    return tagObject;
  } else {
    return undefined;
  }
}

/*
 * 生成带2D标签的Sprite

 * @param htmlId 2D标签的html元素id
 * @param offset 2D标签相对于sprite的位置（相对位置，理解为偏移量）
 * @param position 标签位置
 * @param scale 标签宽高
 * @param materialPicPath 标签材质图片路径
 * @param rotation 标签旋转角度，单位是弧度值
 */
export function generateSpriteWith2DTag(
  tag2DParams: {
    htmlId: string;
    offset: TagPosition;
  },
  tagSpriteParams: {
    position: TagPosition;
    scale: TagScale;
    materialPicPath: string;
    rotation: number;
  },
) {
  let tag2D = generate2DTag(tag2DParams.htmlId, tag2DParams.offset, tagSpriteParams.scale);
  tag2D?.position.set(
    tag2DParams.offset.x,
    tag2DParams.offset.y,
    tag2DParams.offset.z
  );
  let sprite = generateSpriteTag(tagSpriteParams.position, tagSpriteParams.scale, tagSpriteParams.materialPicPath, tagSpriteParams.rotation);
  if (tag2D) {
    sprite.add(tag2D);
  }

  return sprite;
}

/*
 * 生成3D/2D标签
 *
 * @param htmlId 标签的html元素id
 * @param position 标签位置
 * @param scale 标签尺寸
 * @param threeD 标签是否是3D标签
 */
export function generateTag(
  htmlId: string,
  position: TagPosition,
  scale: TagScale,
  threeD: boolean = false
) {
  if (threeD) {
    return generate3DTag(htmlId, position, scale);
  } else {
    return generate2DTag(htmlId, position, scale);
  }
}

export class TagDebug {
  public name: string = "TagDebug";
  public static gui: GUI; //创建GUI对象
  constructor(name: string) {
    this.name = name;
    if (!TagDebug.gui) {
      TagDebug.gui = new GUI();
    }
  }

  public addPosition(obj: TagPosition) {
    const matFolder = TagDebug.gui.addFolder(this.name + " Debug: Tag Position");
    matFolder.close();
    matFolder.add(obj, "x");
    matFolder.add(obj, "y");
    matFolder.add(obj, "z");
  }

  public addScale(obj: TagScale) {
    const matFolder = TagDebug.gui.addFolder(this.name + " Debug: Tag Scale");
    matFolder.close();
    matFolder.add(obj, "x");
    matFolder.add(obj, "y");
    matFolder.add(obj, "z");
  }

  public addRotation(rotationObj: { rotation: number }) {
    const matFolder = TagDebug.gui.addFolder(this.name + " Debug: Tag Rotation");
    matFolder.close();
    matFolder.add(rotationObj, "rotation").onChange((value) => {
      if (rotationObj instanceof THREE.Sprite) {
        rotationObj.material.rotation = value;
      }
    });
  }
}
