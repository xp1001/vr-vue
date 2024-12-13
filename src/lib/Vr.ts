import * as THREE from "three";
import {
  CSS3DObject,
  CSS3DRenderer,
} from "three/addons/renderers/CSS3DRenderer.js";
import {
  CSS2DObject,
  CSS2DRenderer,
} from "three/addons/renderers/CSS2DRenderer.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// 定义一个接口来描述cameraParam的类型
interface CameraParams {
  // 镜头角度
  fov?: number;
  // 镜头长宽比
  aspect?: number;
  // 近平面
  near?: number;
  // 远平面
  far?: number;
}

interface RenderParams {
  width?: number;
  height?: number;
}

interface ControlsParams {
  // 阻尼惯性
  enableDamping: boolean;
  // 鼠标滚轮缩放
  enableZoom: boolean;
  // 鼠标拖拽旋转
  enablePan: boolean;
}

interface SphereGeometryParams {
  radius: number;
  widthSegments: number;
  heightSegments: number;
}

export class Vr {
  // 添加一个属性来保存场景和相机
  public scene: THREE.Scene;
  public sphere: THREE.Mesh | undefined;
  public camera: THREE.PerspectiveCamera;
  // 模型渲染器
  public renderer = new THREE.WebGLRenderer();
  // css3d渲染器（用来渲染标签）
  public css3DRenderer = new CSS3DRenderer();
  // css2d渲染器（用来渲染标签）
  public css2DRenderer = new CSS2DRenderer();
  // 控制
  public controls: OrbitControls | undefined;

  constructor({
    cameraParam,
    renderParam,
  }: {
    cameraParam: CameraParams;
    renderParam: RenderParams;
  }) {
    this.scene = new THREE.Scene();
    let { fov, aspect, near, far } = cameraParam;
    fov = fov || 75;
    aspect = aspect || window.innerWidth / window.innerHeight;
    near = near || 0.1;
    far = far || 1000;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    let { width, height } = renderParam;
    width = width || window.innerWidth;
    height = height || window.innerHeight;
    this.camera.position.set(0, 0, 0.1);
    this.scene.add(this.camera);
    this.iniRenderer(width, height);
    this.initCss3DRenderer(width, height);
    this.initCss2DRenderer(width, height);
  }

  /*
   * 初始化vr
   *
   * @param vrFilePath vr照片路径
   * @param params 球体参数
   */
  public initVr(vrFilePath: string, params: SphereGeometryParams) {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(vrFilePath);
    // 创建一个球体
    const geometry = new THREE.SphereGeometry(
      params.radius,
      params.widthSegments,
      params.heightSegments
    );
    // 翻转纹理
    geometry.scale(-1, 1, 1);
    // 创建一个材质
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    // 创建一个球体网格
    this.sphere = new THREE.Mesh(geometry, material);
    // 将球体添加到场景中
    this.scene.add(this.sphere);

    return this.sphere;
  }

  // 初始化渲染器
  iniRenderer(width: number, height: number) {
    this.renderer.setSize(width, height);
    this.renderer.domElement.style.position = "absolute";
    this.renderer.domElement.style.top = "0";
    this.renderer.domElement.style.left = "0";
  }

  // 初始化css3d渲染器
  initCss3DRenderer(width: number, height: number) {
    this.css3DRenderer.setSize(width, height);
    this.css3DRenderer.domElement.style.position = "absolute";
    this.css3DRenderer.domElement.style.top = "0";
    this.css3DRenderer.domElement.style.left = "0";
    this.css3DRenderer.domElement.style.pointerEvents = "none";
  }

  // 初始化css2d渲染器
  initCss2DRenderer(width: number, height: number) {
    this.css2DRenderer.setSize(width, height);
    this.css2DRenderer.domElement.style.position = "absolute";
    this.css2DRenderer.domElement.style.top = "0";
    this.css2DRenderer.domElement.style.left = "0";
    this.css2DRenderer.domElement.style.pointerEvents = "none";
  }

  initControls(param: ControlsParams) {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = param.enableDamping;
    this.controls.enableZoom = param.enableZoom;
    this.controls.enablePan = param.enablePan;
    this.controls.touches = {
      ONE: THREE.TOUCH.ROTATE, // 单指旋转
      TWO: THREE.TOUCH.DOLLY_PAN // 双指缩放和平移
    };
    this.controls.update();

    return this.controls;
  }

  animate = (fn?: () => void) => {
    const loop = () => {
      requestAnimationFrame(loop);

      this.renderer.render(this.scene, this.camera);
      this.css3DRenderer.render(this.scene, this.camera);
      this.css2DRenderer.render(this.scene, this.camera);
      this.controls?.update();

      if (fn) fn();
    };
    loop();
  };

  // 窗口大小改变
  resize(width: number, height: number) {
    this.renderer.setSize(width, height);
    this.css3DRenderer.setSize(width, height);
    this.css2DRenderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  // 销毁函数
  public destroy() {
    // 遍历场景中的每个对象，并释放相关资源
    this.scene.traverse((object) => {
      // 确保对象是一个 Mesh
      if (object instanceof THREE.Mesh) {
        // 处理几何体
        if (object.geometry) {
          object.geometry.dispose();
        }

        // 处理材质
        if (object.material) {
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          } else if (Array.isArray(object.material)) {
            // 数组材质，比如用于多面材质
            for (let i = 0; i < object.material.length; i++) {
              object.material[i].dispose();
            }
          }
        }

        // 处理纹理
        if (object.material && object.material.map) {
          object.material.map.dispose();
        }
        if (object.material && object.material.lightMap) {
          object.material.lightMap.dispose();
        }
        if (object.material && object.material.bumpMap) {
          object.material.bumpMap.dispose();
        }
        if (object.material && object.material.normalMap) {
          object.material.normalMap.dispose();
        }
        if (object.material && object.material.specularMap) {
          object.material.specularMap.dispose();
        }
      }
    });

    // 清理渲染器
    this.renderer?.dispose();
    this.controls?.dispose();
  }
}
