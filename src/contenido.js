// =====================================================================
// CONTENIDO — capa de datos compartida entre el sitio público (App.jsx)
// y el panel de administración (AdminPanel.jsx)
// =====================================================================
// Guarda acá:
//  - Los datos "de fábrica" (los que ya tenía el sitio antes del panel).
//    Sirven como respaldo mientras Firestore está vacío o no responde,
//    y como contenido inicial para "sembrar" Firestore la primera vez.
//  - Los nombres de las colecciones de Firestore.
//  - Los "hooks" de React que leen esos datos en tiempo real.
//  - Las funciones para sembrar / editar / borrar contenido, usadas por
//    el panel de administración.
// =====================================================================

import { useEffect, useState } from 'react'
import { db } from './firebase'
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'

/* =================================================================
   NOMBRES DE COLECCIONES (todas con el prefijo "alba_")
   ================================================================= */

export const COL_MENU = 'alba_menu'
export const COL_GALERIA = 'alba_galeria'
export const COL_SOLICITUDES = 'alba_solicitudes'
export const COL_CONTENIDO = 'alba_contenido'
export const DOC_CONTENIDO = 'config'

/* =================================================================
   DATOS DE FÁBRICA (respaldo + contenido inicial para sembrar)
   ================================================================= */

export const MENU_DEFAULT = [
  { nombre: 'Brindis de bienvenida', categoria: 'Brindis', desc: 'Vino espumoso sin alcohol.', orden: 0 },

  { nombre: 'Dip de atún', categoria: 'Dip de bienvenida', desc: 'Dip de atún con mayonesa, acompañado de tortillas tipo chips.', orden: 1 },
  { nombre: 'Dip de frijoles molidos', categoria: 'Dip de bienvenida', desc: 'Acompañado de tortillas tipo chips.', orden: 2 },
  { nombre: 'Dulce de frutas con queso crema', categoria: 'Dip de bienvenida', desc: 'Acompañado de galletas saladas.', orden: 3 },
  { nombre: 'Sensación de piña', categoria: 'Dip de bienvenida', desc: 'Acompañada de galletas saladas.', orden: 4 },

  { nombre: 'Entrada capresse', categoria: 'Entradas', desc: 'Pan tostado con tomate, queso y albahaca fresca.', imagen: '/menu/entrada-capresse.jpg', orden: 5 },
  { nombre: 'Bocadillos para el café', categoria: 'Entradas', desc: 'Repostería dulce y repostería salada.', orden: 6 },
  { nombre: 'Sopa azteca', categoria: 'Entradas', desc: 'Con aguacate, queso y tortillas tostadas.', orden: 7 },
  { nombre: 'Sopa de garbanzos con pollo o cerdo', categoria: 'Entradas', desc: 'A elegir con pollo o cerdo.', orden: 8 },
  { nombre: 'Sopa de frijoles blancos con pollo o cerdo', categoria: 'Entradas', desc: 'A elegir con pollo o cerdo.', orden: 9 },
  { nombre: 'Crema de ayote, brócoli o papa', categoria: 'Entradas', desc: 'Cremas suaves a elegir como entrada.', orden: 10 },

  { nombre: 'Carne en salsa', categoria: 'Carnes', desc: '', orden: 11 },
  { nombre: 'Mano de piedra en salsa de hongos', categoria: 'Carnes', desc: '', extra: true, orden: 12 },
  { nombre: 'Pollo a la reina', categoria: 'Carnes', desc: '', orden: 13 },
  { nombre: 'Pollo a la plancha en salsa blanca', categoria: 'Carnes', desc: '', orden: 14 },
  { nombre: 'Pollo a la plancha en salsa pomodoro', categoria: 'Carnes', desc: '', orden: 15 },
  { nombre: 'Cordon bleu', categoria: 'Carnes', desc: '', extra: true, orden: 16 },
  { nombre: 'Lomo de cerdo en salsa BBQ o agridulce', categoria: 'Carnes', desc: '', imagen: '/menu/lomo-cerdo-bbq.jpg', orden: 17 },
  { nombre: 'Lomo de cerdo relleno', categoria: 'Carnes', desc: '', extra: true, orden: 18 },
  { nombre: 'Lomo de res relleno', categoria: 'Carnes', desc: '', extra: true, orden: 19 },

  { nombre: 'Arroz blanco', categoria: 'Guarniciones', desc: '', orden: 20 },
  { nombre: 'Arroz con maíz dulce', categoria: 'Guarniciones', desc: '', orden: 21 },
  { nombre: 'Arroz con culantro', categoria: 'Guarniciones', desc: '', orden: 22 },
  { nombre: 'Arroz jardinero', categoria: 'Guarniciones', desc: '', orden: 23 },
  { nombre: 'Arroz con almendras', categoria: 'Guarniciones', desc: '', orden: 24 },
  { nombre: 'Puré de papa', categoria: 'Guarniciones', desc: '', orden: 25 },
  { nombre: 'Arracache', categoria: 'Guarniciones', desc: '', orden: 26 },
  { nombre: 'Verduras salteadas en mantequilla', categoria: 'Guarniciones', desc: '', imagen: '/menu/verduras-salteadas.jpg', orden: 27 },
  { nombre: 'Papas pequeñas a la mantequilla', categoria: 'Guarniciones', desc: '', orden: 28 },
  { nombre: 'Escabeche en salsa de tomate', categoria: 'Guarniciones', desc: '', orden: 29 },

  { nombre: 'Ensalada verde', categoria: 'Ensaladas', desc: '', orden: 30 },
  { nombre: 'Ensalada mixta', categoria: 'Ensaladas', desc: '', orden: 31 },
  { nombre: 'Ensalada verde con frutas', categoria: 'Ensaladas', desc: '', extra: true, orden: 32 },
  { nombre: 'Ensalada rusa', categoria: 'Ensaladas', desc: '', orden: 33 },
  { nombre: 'Ensalada fría de caracolitos', categoria: 'Ensaladas', desc: '', orden: 34 },

  { nombre: 'Cheesecake frío de fresa', categoria: 'Postres', desc: 'Postre frío con base de galleta y fresa fresca.', orden: 35 },
  { nombre: 'Tentación de mora', categoria: 'Postres', desc: 'Postre cremoso con mora de temporada.', orden: 36 },
  { nombre: 'Postre de frutas', categoria: 'Postres', desc: 'Selección de frutas frescas de temporada.', orden: 37 },
  { nombre: 'Mousse de fruta de temporada', categoria: 'Postres', desc: 'Textura ligera y aireada, según la fruta disponible.', imagen: '/menu/mousse-temporada.jpg', orden: 38 },
  { nombre: 'Postre de malvaviscos', categoria: 'Postres', desc: 'Postre tradicional a base de malvaviscos.', orden: 39 },
  { nombre: 'Mosaico de gelatinas', categoria: 'Postres', desc: 'Coloridas capas de gelatina en textura mosaico.', orden: 40 },
  { nombre: 'Cheesecake de Oreo', categoria: 'Postres', desc: 'Cheesecake con base y trozos de galleta Oreo.', orden: 41 },
  { nombre: 'Delicia de piña', categoria: 'Postres', desc: 'Postre fresco a base de piña.', orden: 42 },
]

export const GALERIA_DEFAULT = [
  { tipo: 'foto', src: '/galeria/evento-03.jpeg', thumb: '/galeria/evento-03-thumb.jpeg', orden: 0 },
  { tipo: 'video', src: '/galeria/evento-video.mp4', thumb: '/galeria/evento-video-poster.jpeg', orden: 1 },
  { tipo: 'video', src: '/galeria/evento-video-2.mp4', thumb: '/galeria/evento-video-2-poster.jpeg', orden: 2 },
  { tipo: 'video', src: '/galeria/evento-video-3.mp4', thumb: '/galeria/evento-video-3-poster.jpeg', orden: 3 },
  { tipo: 'video', src: '/galeria/evento-video-4.mp4', thumb: '/galeria/evento-video-4-poster.jpeg', orden: 4 },
  { tipo: 'video', src: '/galeria/evento-video-5.mp4', thumb: '/galeria/evento-video-5-poster.jpeg', orden: 5 },
  { tipo: 'video', src: '/galeria/evento-video-6.mp4', thumb: '/galeria/evento-video-6-poster.jpeg', orden: 6 },
  { tipo: 'video', src: '/galeria/evento-video-7.mp4', thumb: '/galeria/evento-video-7-poster.jpeg', orden: 7 },
  { tipo: 'video', src: '/galeria/evento-video-8.mp4', thumb: '/galeria/evento-video-8-poster.jpeg', orden: 8 },
  { tipo: 'video', src: '/galeria/evento-video-9.mp4', thumb: '/galeria/evento-video-9-poster.jpeg', orden: 9 },
  { tipo: 'foto', src: '/galeria/evento-16.jpeg', thumb: '/galeria/evento-16-thumb.jpeg', orden: 10 },
  { tipo: 'foto', src: '/galeria/evento-04.jpeg', thumb: '/galeria/evento-04-thumb.jpeg', orden: 11 },
  { tipo: 'foto', src: '/galeria/evento-05.jpeg', thumb: '/galeria/evento-05-thumb.jpeg', orden: 12 },
  { tipo: 'foto', src: '/galeria/evento-02.jpeg', thumb: '/galeria/evento-02-thumb.jpeg', orden: 13 },
  { tipo: 'foto', src: '/galeria/evento-01.jpeg', thumb: '/galeria/evento-01-thumb.jpeg', orden: 14 },
  { tipo: 'foto', src: '/galeria/evento-06.jpeg', thumb: '/galeria/evento-06-thumb.jpeg', orden: 15 },
  { tipo: 'foto', src: '/galeria/evento-07.jpeg', thumb: '/galeria/evento-07-thumb.jpeg', orden: 16 },
  { tipo: 'foto', src: '/galeria/evento-13.jpeg', thumb: '/galeria/evento-13-thumb.jpeg', orden: 17 },
  { tipo: 'foto', src: '/galeria/evento-09.jpeg', thumb: '/galeria/evento-09-thumb.jpeg', orden: 18 },
  { tipo: 'foto', src: '/galeria/evento-10.jpeg', thumb: '/galeria/evento-10-thumb.jpeg', orden: 19 },
  { tipo: 'foto', src: '/galeria/evento-11.jpeg', thumb: '/galeria/evento-11-thumb.jpeg', orden: 20 },
  { tipo: 'foto', src: '/galeria/evento-12.jpeg', thumb: '/galeria/evento-12-thumb.jpeg', orden: 21 },
  { tipo: 'foto', src: '/galeria/evento-17.jpeg', thumb: '/galeria/evento-17-thumb.jpeg', orden: 22 },
  { tipo: 'foto', src: '/galeria/evento-20.jpeg', thumb: '/galeria/evento-20-thumb.jpeg', orden: 23 },
  { tipo: 'foto', src: '/galeria/evento-08.jpeg', thumb: '/galeria/evento-08-thumb.jpeg', orden: 24 },
  { tipo: 'foto', src: '/galeria/evento-14.jpeg', thumb: '/galeria/evento-14-thumb.jpeg', orden: 25 },
  { tipo: 'foto', src: '/galeria/evento-15.jpeg', thumb: '/galeria/evento-15-thumb.jpeg', orden: 26 },
  { tipo: 'foto', src: '/galeria/evento-18.jpeg', thumb: '/galeria/evento-18-thumb.jpeg', orden: 27 },
  { tipo: 'foto', src: '/galeria/evento-19.jpeg', thumb: '/galeria/evento-19-thumb.jpeg', orden: 28 },
  { tipo: 'foto', src: '/galeria/evento-21.jpeg', thumb: '/galeria/evento-21-thumb.jpeg', orden: 29 },
  { tipo: 'foto', src: '/galeria/evento-22.jpeg', thumb: '/galeria/evento-22-thumb.jpeg', orden: 30 },
  { tipo: 'foto', src: '/galeria/evento-23.jpeg', thumb: '/galeria/evento-23-thumb.jpeg', orden: 31 },
  { tipo: 'foto', src: '/galeria/evento-24.jpeg', thumb: '/galeria/evento-24-thumb.jpeg', orden: 32 },
]

export const CONTENIDO_DEFAULT = {
  heroEtiqueta: '— Más que catering, creamos experiencias inolvidables',
  heroTitulo: 'Catering Alba',
  heroSubtitulo:
    'Alimentación, decoración, y atención integral para bodas, eventos corporativos, cumpleaños, baby showers y celebraciones especiales en todo Costa Rica.',
  nosotrosIntro:
    'En Catering Service Alba somos mucho más que un servicio de alimentación: diseñamos experiencias completas para bodas, eventos corporativos, cumpleaños, baby showers y todo tipo de celebraciones especiales con más de 15 años de experiencia. Nos encargamos de la alimentación, decoración, mantelería, montaje, desmontaje y atención durante el evento. Brindamos nuestro servicio en todo Costa Rica, llevando calidad, elegancia y atención personalizada hasta el lugar de su evento.',
  pilares: [
    {
      titulo: 'Nuestra filosofía',
      texto:
        'Creemos que cada celebración debe reflejar la esencia de quienes la viven. Por eso, unimos sabores, decoración y atención personalizada para crear ambientes especiales, donde cada elemento tenga un propósito y cada detalle cuente una historia.',
    },
    {
      titulo: 'Nuestro compromiso',
      texto:
        'Nos comprometemos a ofrecer un servicio integral e impecable, cuidando cada detalle desde la planificación hasta la finalización del evento. Nuestro propósito es brindarle tranquilidad, calidad y confianza para que disfrute plenamente de su celebración, mientras nuestro equipo se encarga de hacer realidad todo lo que imaginó.',
    },
  ],
  servicios: [
    {
      titulo: 'Bodas',
      texto: 'Creamos bodas únicas y memorables, cuidando la alimentación, decoración, montaje y cada detalle de ese día tan especial.',
      cta: 'Cotizar mi boda',
    },
    {
      titulo: 'Eventos corporativos',
      texto: 'Diseñamos experiencias profesionales para reuniones, capacitaciones, inauguraciones, cenas empresariales y celebraciones corporativas.',
      cta: 'Cotizar evento corporativo',
    },
    {
      titulo: 'Cumpleaños',
      texto: 'Convertimos cada cumpleaños en una celebración especial con deliciosos menús, decoración y un servicio completamente personalizado.',
      cta: 'Cotizar cumpleaños',
    },
    {
      titulo: 'Baby showers',
      texto: 'Creamos una celebración dulce y especial para recibir al nuevo integrante de la familia, con alimentación, decoración y detalles llenos de ternura.',
      cta: 'Cotizar baby shower',
    },
    {
      titulo: 'Celebraciones especiales',
      texto: 'Aniversarios, graduaciones, primeras comuniones, bautizos y cualquier ocasión que merezca celebrarse de una manera inolvidable.',
      cta: 'Cotizar mi celebración',
    },
  ],
  eventoCompletoIncluye: [
    'Menú personalizado con brindis, dip de bienvenida, bocadillos coffee breaks, entrada, plato fuerte, postre y refrescos',
    'Decoración del evento básica',
    'Mantelería con manteles, cubresillas y telas',
    'Vajilla, cubiertos y cristalería',
    'Equipo para servir y conservar los alimentos',
    'Montaje y desmontaje',
    'Servicio de meseros',
  ],
  opcionesServicio: [
    'Servicio de alimentación',
    'Alimentación a domicilio',
    'Decoración de eventos',
    'Arreglos florales',
    'Alquiler de bases para centros de mesa',
    'Alquiler de equipo',
    'Alquiler de mantelería',
    'Alquiler de vajilla y cristalería',
    'Alquiler de percoladores',
    'Alquiler de baños María',
  ],
}

export const CATEGORIAS_MENU = [
  'Brindis',
  'Dip de bienvenida',
  'Entradas',
  'Carnes',
  'Guarniciones',
  'Ensaladas',
  'Postres',
]

/* =================================================================
   HOOKS DE LECTURA EN TIEMPO REAL (con respaldo a los datos de fábrica)
   ================================================================= */

export function useMenu() {
  const [items, setItems] = useState(MENU_DEFAULT)
  const [cargando, setCargando] = useState(true)
  const [usandoRespaldo, setUsandoRespaldo] = useState(true)

  useEffect(() => {
    const q = query(collection(db, COL_MENU), orderBy('orden', 'asc'))
    const unsub = onSnapshot(
      q,
      (snap) => {
        if (snap.empty) {
          setItems(MENU_DEFAULT)
          setUsandoRespaldo(true)
        } else {
          setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
          setUsandoRespaldo(false)
        }
        setCargando(false)
      },
      () => {
        setItems(MENU_DEFAULT)
        setUsandoRespaldo(true)
        setCargando(false)
      }
    )
    return unsub
  }, [])

  return { items, cargando, usandoRespaldo }
}

export function useGaleria() {
  const [items, setItems] = useState(GALERIA_DEFAULT)
  const [cargando, setCargando] = useState(true)
  const [usandoRespaldo, setUsandoRespaldo] = useState(true)

  useEffect(() => {
    const q = query(collection(db, COL_GALERIA), orderBy('orden', 'asc'))
    const unsub = onSnapshot(
      q,
      (snap) => {
        if (snap.empty) {
          setItems(GALERIA_DEFAULT)
          setUsandoRespaldo(true)
        } else {
          setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
          setUsandoRespaldo(false)
        }
        setCargando(false)
      },
      () => {
        setItems(GALERIA_DEFAULT)
        setUsandoRespaldo(true)
        setCargando(false)
      }
    )
    return unsub
  }, [])

  return { items, cargando, usandoRespaldo }
}

export function useContenido() {
  const [datos, setDatos] = useState(CONTENIDO_DEFAULT)
  const [cargando, setCargando] = useState(true)
  const [usandoRespaldo, setUsandoRespaldo] = useState(true)

  useEffect(() => {
    const ref = doc(db, COL_CONTENIDO, DOC_CONTENIDO)
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setDatos({ ...CONTENIDO_DEFAULT, ...snap.data() })
          setUsandoRespaldo(false)
        } else {
          setDatos(CONTENIDO_DEFAULT)
          setUsandoRespaldo(true)
        }
        setCargando(false)
      },
      () => {
        setDatos(CONTENIDO_DEFAULT)
        setUsandoRespaldo(true)
        setCargando(false)
      }
    )
    return unsub
  }, [])

  return { datos, cargando, usandoRespaldo }
}

export function useSolicitudes() {
  const [items, setItems] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const q = query(collection(db, COL_SOLICITUDES), orderBy('creado', 'desc'))
    const unsub = onSnapshot(
      q,
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setCargando(false)
      },
      () => setCargando(false)
    )
    return unsub
  }, [])

  return { items, cargando }
}

/* =================================================================
   ESCRITURA — usadas por el panel de administración
   ================================================================= */

export async function sembrarMenu() {
  await Promise.all(
    MENU_DEFAULT.map((item) => addDoc(collection(db, COL_MENU), item))
  )
}

export async function sembrarGaleria() {
  await Promise.all(
    GALERIA_DEFAULT.map((item) => addDoc(collection(db, COL_GALERIA), item))
  )
}

export async function sembrarContenido() {
  await setDoc(doc(db, COL_CONTENIDO, DOC_CONTENIDO), CONTENIDO_DEFAULT)
}

export async function guardarContenido(datos) {
  await setDoc(doc(db, COL_CONTENIDO, DOC_CONTENIDO), datos, { merge: true })
}

export async function agregarPlato(plato) {
  await addDoc(collection(db, COL_MENU), plato)
}

export async function actualizarPlato(id, cambios) {
  await updateDoc(doc(db, COL_MENU, id), cambios)
}

export async function borrarPlato(id) {
  await deleteDoc(doc(db, COL_MENU, id))
}

export async function agregarItemGaleria(item) {
  await addDoc(collection(db, COL_GALERIA), item)
}

export async function actualizarItemGaleria(id, cambios) {
  await updateDoc(doc(db, COL_GALERIA, id), cambios)
}

export async function borrarItemGaleria(id) {
  await deleteDoc(doc(db, COL_GALERIA, id))
}

export async function guardarSolicitud(datos) {
  await addDoc(collection(db, COL_SOLICITUDES), {
    ...datos,
    atendida: false,
    creado: serverTimestamp(),
  })
}

export async function marcarSolicitud(id, atendida) {
  await updateDoc(doc(db, COL_SOLICITUDES, id), { atendida })
}

export async function borrarSolicitud(id) {
  await deleteDoc(doc(db, COL_SOLICITUDES, id))
}
