// =====================================================================
// FIREBASE — Catering Alba
// =====================================================================
// Este proyecto reutiliza el mismo proyecto de Firebase ("acosta-food")
// que ya usás en Los Pirchas y Carnicería San Bosco. Las colecciones que
// usa este sitio están separadas con el prefijo "alba_", así que no se
// mezclan con las de los demás sitios.
// =====================================================================

import { initializeApp, getApps, getApp } from 'firebase/app'
import { initializeFirestore, getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBLVHsF0VqPorPkK0auaWUH_4-k-loC6iU',
  authDomain: 'acosta-food.firebaseapp.com',
  projectId: 'acosta-food',
  storageBucket: 'acosta-food.firebasestorage.app',
  messagingSenderId: '605529235094',
  appId: '1:605529235094:web:035dff54f04af00654acb7',
  measurementId: 'G-QWEN1MWXXZ',
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

// Safari en iPhone a veces bloquea la conexión normal de Firestore y las
// escrituras se quedan "pegadas" sin confirmarse. El modo de detección
// automática de "long polling" evita ese problema.
let _db
try {
  _db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true })
} catch {
  _db = getFirestore(app)
}
export const db = _db
export default app
