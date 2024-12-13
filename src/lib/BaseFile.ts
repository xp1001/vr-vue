export function getBaseUrl() {
  return import.meta.env.BASE_URL
}

// 拼接图片路径，防止打包后 base url 丢失
export function picUrl(path: string) {
  return getBaseUrl() + path
}