import { useEffect, useState } from 'react'
import './admin.css'
import { subirACloudinary, posterDeVideoCloudinary } from './cloudinary'
import {
  CATEGORIAS_MENU,
  useMenu,
  useGaleria,
  useContenido,
  useSolicitudes,
  sembrarMenu,
  sembrarGaleria,
  sembrarContenido,
  guardarContenido,
  agregarPlato,
  actualizarPlato,
  borrarPlato,
  agregarItemGaleria,
  borrarItemGaleria,
  marcarSolicitud,
  borrarSolicitud,
} from './contenido'

const PIN_ADMIN = 'alba2026'

/* =================================================================
   ENTRADA / LOGIN
   ================================================================= */

function AdminLogin({ onEntrar }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  const enviar = (e) => {
    e.preventDefault()
    if (pin === PIN_ADMIN) {
      sessionStorage.setItem('albaAdminAuth', '1')
      onEntrar()
    } else {
      setError(true)
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__caja">
        <h1>Panel de administración</h1>
        <p>Catering Alba — ingrese el PIN para continuar</p>
        <form onSubmit={enviar}>
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value)
              setError(false)
            }}
            placeholder="PIN"
            autoFocus
          />
          {error && <p className="admin-login__error">PIN incorrecto.</p>}
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  )
}

/* =================================================================
   AVISO "usando datos de respaldo" con botón para sembrar Firestore
   ================================================================= */

function AvisoRespaldo({ onSembrar, cargando, etiqueta }) {
  const [enProceso, setEnProceso] = useState(false)

  const sembrar = async () => {
    setEnProceso(true)
    try {
      await onSembrar()
    } catch (err) {
      alert('No se pudo cargar el contenido inicial: ' + err.message)
    }
    setEnProceso(false)
  }

  if (cargando) return null

  return (
    <div className="admin-aviso">
      <span>
        Todavía no hay {etiqueta} guardado en la base de datos — el sitio está mostrando el
        contenido original. Presione el botón para cargarlo y empezar a editarlo desde aquí.
      </span>
      <button onClick={sembrar} disabled={enProceso}>
        {enProceso ? 'Cargando…' : `Cargar ${etiqueta} actual`}
      </button>
    </div>
  )
}

/* =================================================================
   TAB: MENÚ
   ================================================================= */

function FormPlato({ inicial, categorias, onGuardar, onCancelar }) {
  const [datos, setDatos] = useState(
    inicial || { nombre: '', categoria: categorias[0], desc: '', extra: false, imagen: '' }
  )
  const [subiendo, setSubiendo] = useState(false)
  const [progreso, setProgreso] = useState(0)

  const campo = (k) => (e) => setDatos((p) => ({ ...p, [k]: e.target.value }))

  const subirFoto = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSubiendo(true)
    setProgreso(0)
    try {
      const url = await subirACloudinary(file, setProgreso)
      setDatos((p) => ({ ...p, imagen: url }))
    } catch (err) {
      alert('No se pudo subir la foto: ' + err.message)
    }
    setSubiendo(false)
  }

  const guardar = (e) => {
    e.preventDefault()
    if (!datos.nombre.trim()) return
    onGuardar(datos)
  }

  return (
    <form className="admin-form admin-tarjeta" onSubmit={guardar}>
      <div className="admin-form-rejilla">
        <label>
          Nombre del plato
          <input type="text" value={datos.nombre} onChange={campo('nombre')} required />
        </label>
        <label>
          Categoría
          <select value={datos.categoria} onChange={campo('categoria')}>
            {categorias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Descripción
        <textarea rows={2} value={datos.desc} onChange={campo('desc')} />
      </label>
      <label className="admin-checkbox">
        <input
          type="checkbox"
          checked={!!datos.extra}
          onChange={(e) => setDatos((p) => ({ ...p, extra: e.target.checked }))}
        />
        Tiene costo adicional
      </label>
      <label>
        Foto del platillo (opcional)
        {datos.imagen && (
          <img src={datos.imagen} alt="" style={{ width: 80, height: 80, borderRadius: 10, objectFit: 'cover', marginBottom: 6 }} />
        )}
        <input type="file" accept="image/*" onChange={subirFoto} disabled={subiendo} />
        {subiendo && <span className="admin-progreso">Subiendo… {progreso}%</span>}
      </label>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" className="admin-boton admin-boton--oro" disabled={subiendo}>Guardar</button>
        <button type="button" className="admin-boton admin-boton--fantasma" onClick={onCancelar}>Cancelar</button>
      </div>
    </form>
  )
}

function TabMenu() {
  const { items, cargando, usandoRespaldo } = useMenu()
  const [editando, setEditando] = useState(null) // id o 'nuevo' o null
  const [enProceso, setEnProceso] = useState(false)

  const guardar = async (datos) => {
    setEnProceso(true)
    try {
      if (editando === 'nuevo') {
        await agregarPlato(datos)
      } else {
        await actualizarPlato(editando, datos)
      }
      setEditando(null)
    } catch (err) {
      alert('No se pudo guardar: ' + err.message)
    }
    setEnProceso(false)
  }

  const borrar = async (id) => {
    if (!window.confirm('¿Borrar este platillo del menú?')) return
    try {
      await borrarPlato(id)
    } catch (err) {
      alert('No se pudo borrar: ' + err.message)
    }
  }

  const porCategoria = CATEGORIAS_MENU.map((cat) => ({
    cat,
    platos: items.filter((m) => m.categoria === cat),
  })).filter((g) => g.platos.length > 0)

  return (
    <div>
      <div className="admin-seccion-titulo">
        <h2>Menú</h2>
        {!editando && (
          <button className="admin-boton admin-boton--oro" onClick={() => setEditando('nuevo')}>
            + Agregar platillo
          </button>
        )}
      </div>

      <AvisoRespaldo
        cargando={cargando}
        etiqueta={usandoRespaldo ? 'el menú' : null}
        onSembrar={sembrarMenu}
      />
      {usandoRespaldo && !cargando ? null : null}

      {editando === 'nuevo' && (
        <FormPlato
          categorias={CATEGORIAS_MENU}
          onGuardar={guardar}
          onCancelar={() => setEditando(null)}
        />
      )}

      {porCategoria.map((g) => (
        <div className="admin-grupo-cat" key={g.cat}>
          <h3>{g.cat}</h3>
          {g.platos.map((m) =>
            editando === m.id ? (
              <FormPlato
                key={m.id}
                inicial={m}
                categorias={CATEGORIAS_MENU}
                onGuardar={guardar}
                onCancelar={() => setEditando(null)}
              />
            ) : (
              <div className="admin-fila" key={m.id || m.nombre}>
                <div className="admin-fila__info">
                  {m.imagen && <img className="admin-fila__foto" src={m.imagen} alt="" />}
                  <div>
                    <div className="admin-fila__nombre">
                      {m.nombre} {m.extra && <span style={{ opacity: 0.5 }}>· costo adicional</span>}
                    </div>
                    {m.desc && <div className="admin-fila__desc">{m.desc}</div>}
                  </div>
                </div>
                {m.id && (
                  <div className="admin-fila__acciones">
                    <button onClick={() => setEditando(m.id)}>Editar</button>
                    <button onClick={() => borrar(m.id)}>Borrar</button>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      ))}

      {porCategoria.length === 0 && !cargando && (
        <p className="admin-vacio">Todavía no hay platillos.</p>
      )}
    </div>
  )
}

/* =================================================================
   TAB: GALERÍA
   ================================================================= */

function TabGaleria() {
  const { items, cargando, usandoRespaldo } = useGaleria()
  const [subiendo, setSubiendo] = useState(false)
  const [progreso, setProgreso] = useState(0)

  const subir = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSubiendo(true)
    setProgreso(0)
    try {
      const esVideo = file.type.startsWith('video/')
      const url = await subirACloudinary(file, setProgreso)
      await agregarItemGaleria({
        tipo: esVideo ? 'video' : 'foto',
        src: url,
        thumb: esVideo ? posterDeVideoCloudinary(url) : url,
        orden: Date.now(),
      })
    } catch (err) {
      alert('No se pudo subir el archivo: ' + err.message)
    }
    setSubiendo(false)
    e.target.value = ''
  }

  const borrar = async (id) => {
    if (!window.confirm('¿Quitar este archivo de la galería?')) return
    try {
      await borrarItemGaleria(id)
    } catch (err) {
      alert('No se pudo borrar: ' + err.message)
    }
  }

  return (
    <div>
      <div className="admin-seccion-titulo">
        <h2>Galería</h2>
        <label className="admin-boton admin-boton--oro" style={{ cursor: 'pointer' }}>
          {subiendo ? `Subiendo… ${progreso}%` : '+ Subir foto o video'}
          <input
            type="file"
            accept="image/*,video/*"
            onChange={subir}
            disabled={subiendo}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      <AvisoRespaldo
        cargando={cargando}
        etiqueta={usandoRespaldo ? 'la galería' : null}
        onSembrar={sembrarGaleria}
      />

      <div className="admin-galeria-rejilla">
        {items.map((g) => (
          <div className="admin-galeria-item" key={g.id || g.src}>
            <img src={g.thumb || g.src} alt="" />
            <span className="admin-galeria-item__tipo">{g.tipo}</span>
            {g.id ? (
              <button className="admin-galeria-item__borrar" onClick={() => borrar(g.id)} aria-label="Borrar">
                × Borrar
              </button>
            ) : (
              <span className="admin-galeria-item__aviso">Sin guardar</span>
            )}
          </div>
        ))}
      </div>

      {items.length === 0 && !cargando && <p className="admin-vacio">Todavía no hay fotos ni videos.</p>}
    </div>
  )
}

/* =================================================================
   TAB: TEXTOS GENERALES
   ================================================================= */

function TabTextos() {
  const { datos, cargando, usandoRespaldo } = useContenido()
  const [form, setForm] = useState(datos)
  const [guardando, setGuardando] = useState(false)
  const [guardado, setGuardado] = useState(false)

  useEffect(() => {
    setForm(datos)
  }, [datos])

  const campo = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }))
    setGuardado(false)
  }

  const campoPilar = (i, k) => (e) => {
    const pilares = [...form.pilares]
    pilares[i] = { ...pilares[i], [k]: e.target.value }
    setForm((p) => ({ ...p, pilares }))
    setGuardado(false)
  }

  const campoServicio = (i, k) => (e) => {
    const servicios = [...form.servicios]
    servicios[i] = { ...servicios[i], [k]: e.target.value }
    setForm((p) => ({ ...p, servicios }))
    setGuardado(false)
  }

  const campoLista = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value.split('\n') }))
    setGuardado(false)
  }

  const guardar = async () => {
    setGuardando(true)
    try {
      const limpio = {
        ...form,
        eventoCompletoIncluye: form.eventoCompletoIncluye.map((s) => s.trim()).filter(Boolean),
        opcionesServicio: form.opcionesServicio.map((s) => s.trim()).filter(Boolean),
      }
      await guardarContenido(limpio)
      setGuardado(true)
    } catch (err) {
      alert('No se pudo guardar: ' + err.message)
    }
    setGuardando(false)
  }

  return (
    <div>
      <div className="admin-seccion-titulo">
        <h2>Textos generales</h2>
        <button className="admin-boton admin-boton--oro" onClick={guardar} disabled={guardando}>
          {guardando ? 'Guardando…' : guardado ? 'Guardado ✓' : 'Guardar cambios'}
        </button>
      </div>

      <AvisoRespaldo
        cargando={cargando}
        etiqueta={usandoRespaldo ? 'los textos' : null}
        onSembrar={sembrarContenido}
      />

      <div className="admin-lista-textos">
        <div className="admin-tarjeta admin-form">
          <h4>Inicio (Hero)</h4>
          <label>
            Frase pequeña de encabezado
            <input type="text" value={form.heroEtiqueta} onChange={campo('heroEtiqueta')} />
          </label>
          <label>
            Título principal
            <input type="text" value={form.heroTitulo} onChange={campo('heroTitulo')} />
          </label>
          <label>
            Subtítulo
            <textarea rows={3} value={form.heroSubtitulo} onChange={campo('heroSubtitulo')} />
          </label>
        </div>

        <div className="admin-tarjeta admin-form">
          <h4>Nosotros</h4>
          <label>
            Texto de introducción
            <textarea rows={5} value={form.nosotrosIntro} onChange={campo('nosotrosIntro')} />
          </label>
          {form.pilares.map((p, i) => (
            <div key={i} style={{ display: 'grid', gap: 8, borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: 10 }}>
              <label>
                Título del pilar {i + 1}
                <input type="text" value={p.titulo} onChange={campoPilar(i, 'titulo')} />
              </label>
              <label>
                Texto del pilar {i + 1}
                <textarea rows={3} value={p.texto} onChange={campoPilar(i, 'texto')} />
              </label>
            </div>
          ))}
        </div>

        <div className="admin-tarjeta admin-form">
          <h4>Servicios</h4>
          {form.servicios.map((s, i) => (
            <div key={i} style={{ display: 'grid', gap: 8, borderTop: i > 0 ? '1px solid rgba(0,0,0,0.08)' : 'none', paddingTop: i > 0 ? 10 : 0 }}>
              <label>
                Título del servicio {i + 1}
                <input type="text" value={s.titulo} onChange={campoServicio(i, 'titulo')} />
              </label>
              <label>
                Texto
                <textarea rows={2} value={s.texto} onChange={campoServicio(i, 'texto')} />
              </label>
              <label>
                Texto del botón de WhatsApp
                <input type="text" value={s.cta} onChange={campoServicio(i, 'cta')} />
              </label>
            </div>
          ))}
        </div>

        <div className="admin-tarjeta admin-form">
          <h4>Paquete "Evento completo" incluye</h4>
          <label>
            Un punto por línea
            <textarea
              rows={8}
              value={form.eventoCompletoIncluye.join('\n')}
              onChange={campoLista('eventoCompletoIncluye')}
            />
          </label>
        </div>

        <div className="admin-tarjeta admin-form">
          <h4>Servicios a la medida (opciones para elegir)</h4>
          <label>
            Un punto por línea
            <textarea
              rows={10}
              value={form.opcionesServicio.join('\n')}
              onChange={campoLista('opcionesServicio')}
            />
          </label>
        </div>
      </div>
    </div>
  )
}

/* =================================================================
   TAB: SOLICITUDES DE COTIZACIÓN
   ================================================================= */

function TabSolicitudes() {
  const { items, cargando } = useSolicitudes()
  const [verAtendidas, setVerAtendidas] = useState(false)

  const visibles = verAtendidas ? items : items.filter((s) => !s.atendida)

  const alternar = async (s) => {
    try {
      await marcarSolicitud(s.id, !s.atendida)
    } catch (err) {
      alert('No se pudo actualizar: ' + err.message)
    }
  }

  const borrar = async (id) => {
    if (!window.confirm('¿Borrar esta solicitud?')) return
    try {
      await borrarSolicitud(id)
    } catch (err) {
      alert('No se pudo borrar: ' + err.message)
    }
  }

  return (
    <div>
      <div className="admin-seccion-titulo">
        <h2>Solicitudes de cotización</h2>
        <label className="admin-checkbox" style={{ fontSize: '0.85rem' }}>
          <input type="checkbox" checked={verAtendidas} onChange={(e) => setVerAtendidas(e.target.checked)} />
          Mostrar atendidas
        </label>
      </div>

      {cargando && <p className="admin-vacio">Cargando…</p>}

      {!cargando && visibles.length === 0 && (
        <p className="admin-vacio">
          {items.length === 0
            ? 'Todavía no ha llegado ninguna solicitud desde el formulario del sitio.'
            : 'No hay solicitudes pendientes.'}
        </p>
      )}

      {visibles.map((s) => (
        <div key={s.id} className={`admin-tarjeta admin-solicitud ${s.atendida ? 'atendida' : ''}`}>
          <div className="admin-solicitud__cabecera">
            <div>
              <div className="admin-fila__nombre">{s.nombre}</div>
              <div className="admin-fila__desc">
                {s.creado?.toDate ? s.creado.toDate().toLocaleString('es-CR') : ''}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <a
                className="admin-boton admin-boton--oro"
                href={`https://wa.me/506${(s.telefono || '').replace(/\D/g, '').slice(-8)}`}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
              <button className="admin-boton admin-boton--fantasma" onClick={() => alternar(s)}>
                {s.atendida ? 'Marcar pendiente' : 'Marcar atendida'}
              </button>
              <button className="admin-boton admin-boton--peligro" onClick={() => borrar(s.id)}>
                Borrar
              </button>
            </div>
          </div>
          <div className="admin-solicitud__campos">
            <div><strong>Teléfono</strong>{s.telefono}</div>
            <div><strong>Correo</strong>{s.correo || '—'}</div>
            <div><strong>Tipo de evento</strong>{s.tipoEvento || '—'}</div>
            <div><strong>Fecha</strong>{s.fecha || '—'}</div>
            <div><strong>Lugar</strong>{s.lugar || '—'}</div>
            <div><strong>Invitados</strong>{s.invitados || '—'}</div>
            <div><strong>Presupuesto</strong>{s.presupuesto || '—'}</div>
            <div><strong>Servicios</strong>{s.servicios || '—'}</div>
          </div>
          {s.mensaje && (
            <div style={{ marginTop: 10, fontSize: '0.85rem' }}>
              <strong style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', opacity: 0.5 }}>
                Comentarios
              </strong>
              {s.mensaje}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/* =================================================================
   PANEL PRINCIPAL
   ================================================================= */

const TABS = [
  { id: 'menu', label: 'Menú' },
  { id: 'galeria', label: 'Galería' },
  { id: 'textos', label: 'Textos generales' },
  { id: 'solicitudes', label: 'Solicitudes' },
]

export default function AdminPanel() {
  const [autenticado, setAutenticado] = useState(
    () => sessionStorage.getItem('albaAdminAuth') === '1'
  )
  const [tab, setTab] = useState('menu')

  if (!autenticado) {
    return <AdminLogin onEntrar={() => setAutenticado(true)} />
  }

  const salir = () => {
    sessionStorage.removeItem('albaAdminAuth')
    setAutenticado(false)
  }

  return (
    <div className="admin">
      <div className="admin-topbar">
        <span className="admin-topbar__marca">Catering Alba — Administración</span>
        <div className="admin-topbar__acciones">
          <a href="#inicio">Ver sitio</a>
          <button onClick={salir}>Salir</button>
        </div>
      </div>
      <div className="admin-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={tab === t.id ? 'activo' : ''}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="admin-contenido">
        {tab === 'menu' && <TabMenu />}
        {tab === 'galeria' && <TabGaleria />}
        {tab === 'textos' && <TabTextos />}
        {tab === 'solicitudes' && <TabSolicitudes />}
      </div>
    </div>
  )
}
