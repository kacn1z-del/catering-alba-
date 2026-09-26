// =====================================================================
// CLOUDINARY — subida de fotos y videos desde el panel de administración
// =====================================================================
// Se usa Cloudinary (en vez de Firebase Storage) porque Firebase Storage
// requiere activar el plan de pago "Blaze" del proyecto, y Cloudinary
// tiene un plan gratuito que funciona directo desde el navegador con un
// "upload preset" sin firmar (unsigned).
//
// PASOS ÚNICA VEZ (desde tu iPhone, en cloudinary.com):
//  1. Entrá a tu cuenta de Cloudinary (la misma que usás para Los
//     Pirchas, cloud name "kyhdlu4q") — si no la tenés a mano, creá una
//     cuenta gratuita nueva en cloudinary.com y poné ese "Cloud name"
//     abajo en vez de "kyhdlu4q".
//  2. Configuración (ícono de engrane) → Upload → "Upload presets" →
//     "Add upload preset".
//  3. Poné el nombre exactamente: cateringalbafotos
//  4. "Signing Mode" → cambiarlo a "Unsigned".
//  5. Guardar.
//
// Con eso, el panel de administración ya puede subir fotos y videos
// directo a Cloudinary sin necesidad de contraseñas ni backend.
// =====================================================================

export const CLOUDINARY_CLOUD_NAME = 'kyhdlu4q'
export const CLOUDINARY_UPLOAD_PRESET = 'cateringalbafotos'

/**
 * Sube un archivo (imagen o video) a Cloudinary y devuelve la URL
 * segura (https) del archivo ya subido.
 * @param {File} file
 * @param {(pct:number)=>void} [onProgress] opcional, 0-100
 * @returns {Promise<string>} URL del archivo
 */
export function subirACloudinary(file, onProgress) {
  return new Promise((resolve, reject) => {
    const esVideo = file.type.startsWith('video/')
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${esVideo ? 'video' : 'image'}/upload`

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', url)

    xhr.upload.onprogress = (e) => {
      if (onProgress && e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText)
        if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) {
          resolve(data.secure_url)
        } else {
          reject(new Error(data?.error?.message || 'No se pudo subir el archivo a Cloudinary.'))
        }
      } catch (err) {
        reject(err)
      }
    }

    xhr.onerror = () => reject(new Error('Error de red subiendo el archivo a Cloudinary.'))
    xhr.send(formData)
  })
}

/**
 * A partir de la URL de un video subido a Cloudinary, genera la URL de
 * una imagen (miniatura/poster) del primer fotograma, sin necesidad de
 * subir un archivo aparte para el póster.
 * @param {string} videoUrl
 * @returns {string}
 */
export function posterDeVideoCloudinary(videoUrl) {
  if (!videoUrl) return ''
  // Ej: .../video/upload/xxxxx/nombre.mp4  ->  .../video/upload/so_0/xxxxx/nombre.jpg
  const partes = videoUrl.split('/upload/')
  if (partes.length !== 2) return videoUrl
  const conFormato = partes[1].replace(/\.[a-zA-Z0-9]+$/, '.jpg')
  return `${partes[0]}/upload/so_0/${conFormato}`
}
