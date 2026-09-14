import { useEffect, useRef, useState } from 'react'

/* =================================================================
   DATOS — Catering Alba
   ================================================================= */

const CONTACTO = {
  telefonoDisplay: '8667 2245',
  telefonoWa: '50686672245',
  telefonoTel: '+50686672245',
}

const NAV = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'nosotros', label: 'Nosotros' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'menu', label: 'Menú' },
  { id: 'galeria', label: 'Galería' },
  { id: 'contacto', label: 'Contacto' },
]

const PILARES = [
  {
    num: '01',
    titulo: 'Nuestra filosofía',
    texto:
      'En Catering Alba creemos que cada evento merece una mesa impecable. Cuidamos cada detalle, desde la selección de ingredientes hasta el montaje final, para que usted solo se preocupe por disfrutar.',
  },
  {
    num: '02',
    titulo: 'Nuestro compromiso',
    texto:
      'Trabajamos con recetas propias, presentación cuidada y un servicio puntual y discreto, adaptando cada menú al estilo, presupuesto y necesidades de quien nos contrata.',
  },
]

const CARACTERISTICAS = [
  { titulo: 'Sabor auténtico', texto: 'Recetas elaboradas con ingredientes frescos y de temporada.' },
  { titulo: 'Presentación impecable', texto: 'Montaje elegante que realza cada plato y cada mesa.' },
  { titulo: 'Puntualidad', texto: 'Llegamos, montamos y servimos con la anticipación que su evento exige.' },
  { titulo: 'Menú a la medida', texto: 'Adaptamos cada propuesta al tipo de evento y número de invitados.' },
]

const SERVICIOS = [
  {
    num: '01',
    titulo: 'Bodas',
    texto:
      'Menús completos para el día más importante: entradas, plato fuerte, postre y mesa de dulces, con montaje acorde a la decoración de su boda.',
    cta: 'Cotizar boda',
  },
  {
    num: '02',
    titulo: 'Eventos corporativos',
    texto:
      'Coffee breaks, almuerzos empresariales y cócteles de cierre para reuniones, capacitaciones y lanzamientos.',
    cta: 'Cotizar evento corporativo',
  },
  {
    num: '03',
    titulo: 'Cumpleaños y quinceañeras',
    texto:
      'Celebraciones a la medida, con opciones de buffet o servicio a la mesa según el estilo de la fiesta.',
    cta: 'Cotizar celebración',
  },
  {
    num: '04',
    titulo: 'Cócteles y recepciones',
    texto:
      'Pasapalos y estaciones interactivas ideales para recepciones, inauguraciones y encuentros sociales.',
    cta: 'Cotizar cóctel',
  },
]

const CATEGORIAS = ['Todos', 'Entradas', 'Platos fuertes', 'Postres', 'Bebidas']

const CARRUSEL = [
  { img: '/galeria/evento-05.jpeg', etiqueta: 'Bodas', titulo: 'Montajes de boda' },
  { img: '/galeria/evento-13.jpeg', etiqueta: 'Cumpleaños', titulo: 'Celebraciones especiales' },
  { img: '/galeria/evento-16.jpeg', etiqueta: 'Detalles', titulo: 'Ambientación a la medida' },
  { img: '/galeria/evento-04.jpeg', etiqueta: 'Eventos', titulo: 'Salones completos' },
  { img: '/galeria/evento-10.jpeg', etiqueta: 'Mesas', titulo: 'Centros de mesa florales' },
]

const MENU = [
  { nombre: 'Carpaccio de res', categoria: 'Entradas', desc: 'Finas láminas de res, alcaparras, parmesano y aceite de oliva.', imagen: '/menu/carpaccio-res.jpg' },
  { nombre: 'Tartaleta de camarón', categoria: 'Entradas', desc: 'Base crocante, camarón salteado y salsa cítrica.', imagen: '/menu/tartaleta-camaron.jpg' },
  { nombre: 'Lomito en salsa de vino', categoria: 'Platos fuertes', desc: 'Lomito al punto, reducción de vino tinto y puré de papa trufado.', imagen: '/menu/lomito-vino.jpg' },
  { nombre: 'Pollo relleno gourmet', categoria: 'Platos fuertes', desc: 'Pechuga rellena de espinaca y queso, salsa de hongos silvestres.', imagen: '/menu/pollo-relleno.jpg' },
  { nombre: 'Risotto de camarones', categoria: 'Platos fuertes', desc: 'Arroz cremoso, camarones frescos y toque de limón.', imagen: '/menu/risotto-camarones.jpg' },
  { nombre: 'Mousse de maracuyá', categoria: 'Postres', desc: 'Textura ligera y aireada con reducción de frutos de la pasión.', imagen: '/menu/mousse-maracuya.jpg' },
  { nombre: 'Mesa de postres finos', categoria: 'Postres', desc: 'Selección de mini postres: tartaletas, macarons y brownies.', imagen: '/menu/mesa-postres.jpg' },
  { nombre: 'Barra de cócteles sin alcohol', categoria: 'Bebidas', desc: 'Mocktails de temporada preparados al momento.', imagen: '/menu/barra-cocteles.jpg' },
]

const BENEFICIOS = [
  'Menú personalizado según su evento',
  'Montaje y decoración de mesa incluidos',
  'Servicio de meseros uniformados',
  'Degustación previa disponible',
]

const OPCIONES_SERVICIO = [
  'Solo comida',
  'Comida a domicilio (se prepara y se entrega en la casa)',
  'Solo alquiler de equipo',
  'Solo decoraciones',
  'Alquiler de vajilla',
  'Alquiler de mantelería',
  'Alquiler de percoladores',
  'Alquiler de baño de maría',
]

const GALERIA = [
  { tipo: 'foto', src: '/galeria/evento-03.jpeg', thumb: '/galeria/evento-03-thumb.jpeg' },
  { tipo: 'video', src: '/galeria/evento-video.mp4', thumb: '/galeria/evento-video-poster.jpeg' },
  { tipo: 'foto', src: '/galeria/evento-16.jpeg', thumb: '/galeria/evento-16-thumb.jpeg' },
  { tipo: 'foto', src: '/galeria/evento-04.jpeg', thumb: '/galeria/evento-04-thumb.jpeg' },
  { tipo: 'foto', src: '/galeria/evento-05.jpeg', thumb: '/galeria/evento-05-thumb.jpeg' },
  { tipo: 'foto', src: '/galeria/evento-02.jpeg', thumb: '/galeria/evento-02-thumb.jpeg' },
  { tipo: 'foto', src: '/galeria/evento-01.jpeg', thumb: '/galeria/evento-01-thumb.jpeg' },
  { tipo: 'foto', src: '/galeria/evento-06.jpeg', thumb: '/galeria/evento-06-thumb.jpeg' },
  { tipo: 'foto', src: '/galeria/evento-07.jpeg', thumb: '/galeria/evento-07-thumb.jpeg' },
  { tipo: 'foto', src: '/galeria/evento-13.jpeg', thumb: '/galeria/evento-13-thumb.jpeg' },
  { tipo: 'foto', src: '/galeria/evento-09.jpeg', thumb: '/galeria/evento-09-thumb.jpeg' },
  { tipo: 'foto', src: '/galeria/evento-10.jpeg', thumb: '/galeria/evento-10-thumb.jpeg' },
  { tipo: 'foto', src: '/galeria/evento-11.jpeg', thumb: '/galeria/evento-11-thumb.jpeg' },
  { tipo: 'foto', src: '/galeria/evento-12.jpeg', thumb: '/galeria/evento-12-thumb.jpeg' },
  { tipo: 'foto', src: '/galeria/evento-17.jpeg', thumb: '/galeria/evento-17-thumb.jpeg' },
  { tipo: 'foto', src: '/galeria/evento-20.jpeg', thumb: '/galeria/evento-20-thumb.jpeg' },
  { tipo: 'foto', src: '/galeria/evento-08.jpeg', thumb: '/galeria/evento-08-thumb.jpeg' },
  { tipo: 'foto', src: '/galeria/evento-14.jpeg', thumb: '/galeria/evento-14-thumb.jpeg' },
  { tipo: 'foto', src: '/galeria/evento-15.jpeg', thumb: '/galeria/evento-15-thumb.jpeg' },
  { tipo: 'foto', src: '/galeria/evento-18.jpeg', thumb: '/galeria/evento-18-thumb.jpeg' },
  { tipo: 'foto', src: '/galeria/evento-19.jpeg', thumb: '/galeria/evento-19-thumb.jpeg' },
  { tipo: 'foto', src: '/galeria/evento-21.jpeg', thumb: '/galeria/evento-21-thumb.jpeg' },
  { tipo: 'foto', src: '/galeria/evento-22.jpeg', thumb: '/galeria/evento-22-thumb.jpeg' },
  { tipo: 'foto', src: '/galeria/evento-23.jpeg', thumb: '/galeria/evento-23-thumb.jpeg' },
  { tipo: 'foto', src: '/galeria/evento-24.jpeg', thumb: '/galeria/evento-24-thumb.jpeg' },
]

/* =================================================================
   HOOKS
   ================================================================= */

function useReveal(threshold = 0.14) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return { ref, visible }
}

function Reveal({ children, delay = 0, className = '' }) {
  const { ref, visible } = useReveal()
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'reveal--visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* =================================================================
   LOGO Y BOTONES
   ================================================================= */

function Boton({ children, className = '', as = 'button', ...props }) {
  const Etiqueta = as
  return (
    <Etiqueta className={`boton ${className}`} {...props}>
      <span className="boton__capa" />
      <span className="boton__texto">{children}</span>
    </Etiqueta>
  )
}

function LogoAlba({ tamano = 64 }) {
  return (
    <div className="logo-marco" style={{ width: tamano, height: tamano }}>
      <img className="logo-img" src="/logo-alba.png" alt="Catering Alba" />
    </div>
  )
}

/* =================================================================
   ICONOS (línea fina, minimalistas)
   ================================================================= */

function IconWhatsApp({ tamano = 16 }) {
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.13.82.83-3.05-.2-.31a8.18 8.18 0 0 1-1.26-4.35c0-4.53 3.69-8.22 8.25-8.22 2.2 0 4.27.86 5.83 2.42a8.17 8.17 0 0 1 2.41 5.81c0 4.53-3.69 8.21-8.24 8.21Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.48c-.17 0-.43.06-.66.31s-.87.85-.87 2.08.89 2.41 1.02 2.58c.12.17 1.76 2.68 4.26 3.76.6.26 1.06.41 1.42.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29Z" />
    </svg>
  )
}

function IconTelefono() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  )
}

function IconEstrella() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
      <path d="M12 2.5 14.6 9l7 .5-5.4 4.6 1.8 6.9L12 17.3 5.9 21l1.8-6.9L2.4 9.5l7-.5Z" />
    </svg>
  )
}

function IconPlato() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
      <circle cx="12" cy="12" r="9.5" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  )
}

function IconReloj() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 7v5l3.2 2" />
    </svg>
  )
}

function IconAjuste() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
      <path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h13M21 18h-1" />
      <circle cx="15" cy="6" r="2" />
      <circle cx="7" cy="12" r="2" />
      <circle cx="19" cy="18" r="2" />
    </svg>
  )
}

const ICONOS_CARACTERISTICA = [IconEstrella, IconPlato, IconReloj, IconAjuste]

function IconPlay() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7Z" />
    </svg>
  )
}

function IconCerrar() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 5l14 14M19 5 5 19" />
    </svg>
  )
}

function IconFlecha({ direccion = 'izq' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      {direccion === 'izq' ? <path d="M15 5 8 12l7 7" /> : <path d="M9 5l7 7-7 7" />}
    </svg>
  )
}

/* =================================================================
   HEADER
   ================================================================= */

function Header({ activo, irA }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`encabezado ${scrolled ? 'encabezado--scroll' : ''}`}>
      <div className="envoltura encabezado__fila">
        <a
          className="encabezado__marca"
          href="#inicio"
          onClick={(e) => {
            e.preventDefault()
            irA('inicio')
          }}
        >
          <LogoAlba tamano={60} />
          <span>Catering Alba</span>
        </a>

        <nav className="encabezado__nav">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className={`encabezado__enlace ${activo === n.id ? 'encabezado__enlace--activo' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                irA(n.id)
              }}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <a
          className="encabezado__whatsapp"
          href={`https://wa.me/${CONTACTO.telefonoWa}`}
          target="_blank"
          rel="noreferrer"
        >
          <IconWhatsApp /> {CONTACTO.telefonoDisplay}
        </a>

        <button
          className="encabezado__hamburguesa"
          aria-label="Abrir menú"
          onClick={() => setMenuAbierto((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {menuAbierto && (
        <div className="encabezado__movil">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={(e) => {
                e.preventDefault()
                irA(n.id)
                setMenuAbierto(false)
              }}
            >
              {n.label}
            </a>
          ))}
          <a href={`https://wa.me/${CONTACTO.telefonoWa}`} target="_blank" rel="noreferrer">
            <IconWhatsApp /> {CONTACTO.telefonoDisplay}
          </a>
        </div>
      )}
    </header>
  )
}

/* =================================================================
   HERO
   ================================================================= */

function Hero({ irA }) {
  return (
    <section id="inicio" className="hero">
      <div className="hero__textura" />
      <div className="envoltura hero__contenido">
        <Reveal>
          <span className="ojo-etiqueta ojo-etiqueta--claro">— Catering para eventos</span>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="hero__titulo">
            Catering <em>Alba</em>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="hero__subtitulo">
            Menús elegantes y servicio impecable para bodas, eventos corporativos, cumpleaños
            y celebraciones especiales en todo Costa Rica.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="hero__acciones">
            <Boton
              as="a"
              className="boton--claro"
              href={`https://wa.me/${CONTACTO.telefonoWa}?text=${encodeURIComponent(
                'Hola, quisiera cotizar el servicio de catering para mi evento.'
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              <IconWhatsApp /> Cotizar mi evento
            </Boton>
            <Boton
              className="boton--fantasma-claro"
              onClick={() => irA('menu')}
            >
              Ver menú
            </Boton>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* =================================================================
   NOSOTROS
   ================================================================= */

function Nosotros() {
  return (
    <section id="nosotros" className="seccion seccion--clara">
      <div className="envoltura">
        <Reveal>
          <div className="cabecera-seccion">
            <div>
              <span className="ojo-etiqueta">— Quiénes somos</span>
              <h2 className="titulo-seccion">Catering con carácter propio</h2>
            </div>
            <p className="nota-seccion">
              Un equipo dedicado a que su evento se vea, se sienta y sepa exactamente como usted
              lo imaginó.
            </p>
          </div>
        </Reveal>

        <div className="rejilla-pilares">
          {PILARES.map((p, i) => (
            <Reveal key={p.num} delay={i * 100}>
              <div className="tarjeta-pilar" data-num={p.num}>
                <h3 className="tarjeta-pilar__titulo">{p.titulo}</h3>
                <p className="tarjeta-pilar__texto">{p.texto}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="rejilla-caracteristicas">
          {CARACTERISTICAS.map((c, i) => {
            const Icono = ICONOS_CARACTERISTICA[i]
            return (
              <Reveal key={c.titulo} delay={i * 80}>
                <div className="tarjeta-caracteristica">
                  <Icono />
                  <h4>{c.titulo}</h4>
                  <p>{c.texto}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* =================================================================
   SERVICIOS
   ================================================================= */

function Servicios() {
  return (
    <section id="servicios" className="seccion seccion--oscura">
      <div className="envoltura">
        <Reveal>
          <div className="cabecera-seccion">
            <div>
              <span className="ojo-etiqueta ojo-etiqueta--claro">— Lo que hacemos</span>
              <h2 className="titulo-seccion titulo-seccion--claro">Servicios de Catering Alba</h2>
            </div>
            <p className="nota-seccion nota-seccion--clara">
              Escríbanos por WhatsApp y le preparamos una propuesta a la medida de su evento.
            </p>
          </div>
        </Reveal>

        <div className="rejilla-servicios">
          {SERVICIOS.map((s, i) => (
            <Reveal key={s.num} delay={i * 100}>
              <div className="tarjeta-pilar tarjeta-pilar--servicio tarjeta-pilar--oscura" data-num={s.num}>
                <div className="tarjeta-pilar__cabecera">
                  <span className="tarjeta-pilar__num">{s.num}</span>
                </div>
                <h3 className="tarjeta-pilar__titulo">{s.titulo}</h3>
                <p className="tarjeta-pilar__texto">{s.texto}</p>
                <a
                  className="tarjeta-servicio__enlace tarjeta-servicio__enlace--claro"
                  href={`https://wa.me/${CONTACTO.telefonoWa}?text=${encodeURIComponent(
                    'Hola, quisiera información sobre ' + s.titulo
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <IconWhatsApp tamano={14} /> {s.cta}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* =================================================================
   ELIJA SU SERVICIO
   ================================================================= */

function EligeTuServicio() {
  const [seleccion, setSeleccion] = useState([])

  const alternar = (op) => {
    setSeleccion((prev) =>
      prev.includes(op) ? prev.filter((x) => x !== op) : [...prev, op]
    )
  }

  const mensaje =
    seleccion.length > 0
      ? `Hola, quisiera cotizar los siguientes servicios:\n- ${seleccion.join('\n- ')}`
      : 'Hola, quisiera información sobre sus servicios por aparte (solo comida, solo alquiler, etc).'

  return (
    <section id="elegir-servicio" className="seccion seccion--clara">
      <div className="envoltura">
        <Reveal>
          <div className="cabecera-seccion">
            <div>
              <span className="ojo-etiqueta">— A la medida</span>
              <h2 className="titulo-seccion">Elija su servicio</h2>
            </div>
            <p className="nota-seccion">
              También ofrecemos servicios por aparte: solo comida, solo alquiler de equipo,
              o solo decoración. Marque lo que necesita y le cotizamos.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="selector-servicios">
            {OPCIONES_SERVICIO.map((op) => {
              const activo = seleccion.includes(op)
              return (
                <button
                  key={op}
                  type="button"
                  className={`selector-servicios__item ${activo ? 'selector-servicios__item--activo' : ''}`}
                  onClick={() => alternar(op)}
                  aria-pressed={activo}
                >
                  <span className="selector-servicios__casilla">
                    {activo && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M4 12l6 6L20 6" />
                      </svg>
                    )}
                  </span>
                  <span>{op}</span>
                </button>
              )
            })}
          </div>

          <div className="selector-servicios__accion">
            <Boton
              as="a"
              className="boton--oscuro"
              href={`https://wa.me/${CONTACTO.telefonoWa}?text=${encodeURIComponent(mensaje)}`}
              target="_blank"
              rel="noreferrer"
            >
              <IconWhatsApp /> {seleccion.length > 0 ? 'Cotizar selección' : 'Consultar servicios'}
            </Boton>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* =================================================================
   CARRUSEL
   ================================================================= */

function Carrusel() {
  const [activo, setActivo] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setActivo((i) => (i + 1) % CARRUSEL.length)
    }, 4500)
    return () => clearInterval(t)
  }, [])

  const irA = (i) => setActivo(i)
  const anterior = () => setActivo((i) => (i - 1 + CARRUSEL.length) % CARRUSEL.length)
  const siguiente = () => setActivo((i) => (i + 1) % CARRUSEL.length)

  return (
    <div className="carrusel">
      {CARRUSEL.map((c, i) => (
        <div key={c.img} className={`carrusel__slide ${i === activo ? 'carrusel__slide--activo' : ''}`}>
          <img src={c.img} alt={c.titulo} />
          <div className="carrusel__overlay" />
          <div className="carrusel__texto">
            <span className="carrusel__etiqueta">{c.etiqueta}</span>
            <h3 className="carrusel__titulo">{c.titulo}</h3>
          </div>
        </div>
      ))}

      <button className="carrusel__flecha carrusel__flecha--izq" onClick={anterior} aria-label="Anterior">
        <IconFlecha direccion="izq" />
      </button>
      <button className="carrusel__flecha carrusel__flecha--der" onClick={siguiente} aria-label="Siguiente">
        <IconFlecha direccion="der" />
      </button>

      <div className="carrusel__puntos">
        {CARRUSEL.map((c, i) => (
          <button
            key={c.img}
            className={`carrusel__punto ${i === activo ? 'carrusel__punto--activo' : ''}`}
            onClick={() => irA(i)}
            aria-label={`Ir a diapositiva ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

/* =================================================================
   MENÚ
   ================================================================= */

function Menu() {
  const [filtro, setFiltro] = useState('Todos')
  const items = filtro === 'Todos' ? MENU : MENU.filter((m) => m.categoria === filtro)

  return (
    <section id="menu" className="seccion seccion--clara">
      <div className="envoltura">
        <Reveal>
          <div className="cabecera-seccion">
            <div>
              <span className="ojo-etiqueta">— Nuestra propuesta</span>
              <h2 className="titulo-seccion">Menú Catering Alba</h2>
            </div>
            <p className="nota-seccion">Una muestra de nuestras opciones. El menú final se ajusta a su evento.</p>
          </div>
        </Reveal>

        <Reveal>
          <Carrusel />
        </Reveal>

        <div className="cintas-nav-envoltura">
          <div className="cintas-nav">
            {CATEGORIAS.map((c) => (
              <button
                key={c}
                className={`cinta ${filtro === c ? 'cinta--activa' : ''}`}
                onClick={() => setFiltro(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="rejilla-puestos">
          {items.map((m, i) => (
            <Reveal key={m.nombre} delay={(i % 4) * 80}>
              <div className="tarjeta-puesto">
                {m.imagen && (
                  <div className="tarjeta-puesto__foto">
                    <img src={m.imagen} alt={m.nombre} />
                  </div>
                )}
                <span className="tarjeta-puesto__categoria">{m.categoria}</span>
                <h3 className="tarjeta-puesto__nombre">{m.nombre}</h3>
                <p className="tarjeta-puesto__desc">{m.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* =================================================================
   GALERÍA
   ================================================================= */

function Galeria() {
  const [abierto, setAbierto] = useState(null)

  const abrir = (i) => setAbierto(i)
  const cerrar = () => setAbierto(null)
  const anterior = (e) => {
    e.stopPropagation()
    setAbierto((i) => (i - 1 + GALERIA.length) % GALERIA.length)
  }
  const siguiente = (e) => {
    e.stopPropagation()
    setAbierto((i) => (i + 1) % GALERIA.length)
  }

  useEffect(() => {
    if (abierto === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') cerrar()
      if (e.key === 'ArrowLeft') setAbierto((i) => (i - 1 + GALERIA.length) % GALERIA.length)
      if (e.key === 'ArrowRight') setAbierto((i) => (i + 1) % GALERIA.length)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [abierto])

  const item = abierto !== null ? GALERIA[abierto] : null

  return (
    <section id="galeria" className="seccion seccion--oscura">
      <div className="envoltura">
        <Reveal>
          <div className="cabecera-seccion">
            <div>
              <span className="ojo-etiqueta ojo-etiqueta--claro">— Eventos realizados</span>
              <h2 className="titulo-seccion titulo-seccion--claro">Galería</h2>
            </div>
            <p className="nota-seccion nota-seccion--clara">
              Un vistazo a algunas de las bodas, quinceaños y celebraciones que hemos montado.
            </p>
          </div>
        </Reveal>

        <div className="rejilla-galeria">
          {GALERIA.map((g, i) => (
            <Reveal key={g.src} delay={(i % 6) * 60}>
              <button className="galeria-item" onClick={() => abrir(i)} aria-label="Ver imagen">
                <img src={g.thumb} alt="Evento Catering Alba" />
                {g.tipo === 'video' && (
                  <span className="galeria-item__play">
                    <IconPlay />
                  </span>
                )}
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {item && (
        <div className="lightbox" onClick={cerrar}>
          <button className="lightbox__cerrar" onClick={cerrar} aria-label="Cerrar">
            <IconCerrar />
          </button>
          <button className="lightbox__nav lightbox__nav--izq" onClick={anterior} aria-label="Anterior">
            <IconFlecha direccion="izq" />
          </button>
          <div className="lightbox__contenido" onClick={(e) => e.stopPropagation()}>
            {item.tipo === 'video' ? (
              <video
                src={item.src}
                poster={item.thumb}
                controls
                autoPlay
                playsInline
                className="lightbox__media"
              />
            ) : (
              <img src={item.src} alt="Evento Catering Alba" className="lightbox__media" />
            )}
          </div>
          <button className="lightbox__nav lightbox__nav--der" onClick={siguiente} aria-label="Siguiente">
            <IconFlecha direccion="der" />
          </button>
        </div>
      )}
    </section>
  )
}

/* =================================================================
   FORMULARIO DE CONTRATACIÓN
   ================================================================= */

const TIPOS_EVENTO = ['Boda', 'Evento corporativo', 'Cumpleaños', 'Cóctel / recepción', 'Otro']

function FormularioContratar() {
  const [datos, setDatos] = useState({
    nombre: '',
    telefono: '',
    correo: '',
    tipoEvento: '',
    fecha: '',
    invitados: '',
    lugar: '',
    mensaje: '',
  })

  const actualizar = (campo) => (e) => {
    setDatos((prev) => ({ ...prev, [campo]: e.target.value }))
  }

  const listoParaEnviar = datos.nombre.trim() !== '' && datos.telefono.trim() !== ''

  const enviarPorWhatsApp = (e) => {
    e.preventDefault()
    if (!listoParaEnviar) return

    const lineas = [
      'Hola, quisiera contratar el servicio de Catering Alba. Estos son mis datos:',
      '',
      `Nombre: ${datos.nombre}`,
      `Teléfono: ${datos.telefono}`,
    ]
    if (datos.correo) lineas.push(`Correo: ${datos.correo}`)
    if (datos.tipoEvento) lineas.push(`Tipo de evento: ${datos.tipoEvento}`)
    if (datos.fecha) lineas.push(`Fecha del evento: ${datos.fecha}`)
    if (datos.invitados) lineas.push(`Número de invitados: ${datos.invitados}`)
    if (datos.lugar) lineas.push(`Lugar: ${datos.lugar}`)
    if (datos.mensaje) lineas.push('', `Detalles adicionales: ${datos.mensaje}`)

    const mensaje = lineas.join('\n')
    window.open(`https://wa.me/${CONTACTO.telefonoWa}?text=${encodeURIComponent(mensaje)}`, '_blank')
  }

  return (
    <section id="formulario" className="seccion seccion--oscura">
      <div className="envoltura">
        <Reveal>
          <div className="cabecera-seccion">
            <div>
              <span className="ojo-etiqueta ojo-etiqueta--claro">— Contrate su evento</span>
              <h2 className="titulo-seccion titulo-seccion--claro">Cuéntenos de su evento</h2>
            </div>
            <p className="nota-seccion nota-seccion--clara">
              Complete sus datos y le escribimos por WhatsApp con una propuesta.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <form className="formulario" onSubmit={enviarPorWhatsApp}>
            <div className="formulario__rejilla">
              <label className="formulario__campo">
                <span>Nombre completo *</span>
                <input
                  type="text"
                  value={datos.nombre}
                  onChange={actualizar('nombre')}
                  placeholder="Su nombre"
                  required
                />
              </label>

              <label className="formulario__campo">
                <span>Teléfono *</span>
                <input
                  type="tel"
                  value={datos.telefono}
                  onChange={actualizar('telefono')}
                  placeholder="8888-8888"
                  required
                />
              </label>

              <label className="formulario__campo">
                <span>Correo electrónico</span>
                <input
                  type="email"
                  value={datos.correo}
                  onChange={actualizar('correo')}
                  placeholder="correo@ejemplo.com"
                />
              </label>

              <label className="formulario__campo">
                <span>Tipo de evento</span>
                <select value={datos.tipoEvento} onChange={actualizar('tipoEvento')}>
                  <option value="">Seleccione una opción</option>
                  {TIPOS_EVENTO.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </label>

              <label className="formulario__campo">
                <span>Fecha del evento</span>
                <input type="date" value={datos.fecha} onChange={actualizar('fecha')} />
              </label>

              <label className="formulario__campo">
                <span>Número de invitados</span>
                <input
                  type="number"
                  min="1"
                  value={datos.invitados}
                  onChange={actualizar('invitados')}
                  placeholder="Ej. 80"
                />
              </label>

              <label className="formulario__campo formulario__campo--ancho">
                <span>Lugar del evento</span>
                <input
                  type="text"
                  value={datos.lugar}
                  onChange={actualizar('lugar')}
                  placeholder="Salón, dirección o zona"
                />
              </label>

              <label className="formulario__campo formulario__campo--ancho">
                <span>Detalles adicionales</span>
                <textarea
                  rows={4}
                  value={datos.mensaje}
                  onChange={actualizar('mensaje')}
                  placeholder="Menú deseado, presupuesto aproximado, alguna solicitud especial..."
                />
              </label>
            </div>

            <Boton as="button" type="submit" className="boton--claro" disabled={!listoParaEnviar}>
              <IconWhatsApp /> Enviar por WhatsApp
            </Boton>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

/* =================================================================
   CONTACTO
   ================================================================= */

function Contacto() {
  return (
    <section id="contacto" className="seccion-cta">
      <div className="envoltura">
        <Reveal>
          <div className="cta-caja">
            <div>
              <h2 className="cta-caja__titulo">¿Tiene un evento en puerta?</h2>
              <p className="cta-caja__texto">
                Cuéntenos la fecha, el lugar y el número de invitados, y le preparamos una
                propuesta de menú y precio sin compromiso.
              </p>
              <ul className="cta-caja__lista">
                {BENEFICIOS.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
            <div className="cta-caja__acciones">
              <Boton
                as="a"
                className="boton--claro"
                href={`https://wa.me/${CONTACTO.telefonoWa}?text=${encodeURIComponent(
                  'Hola, quisiera cotizar el servicio de catering para mi evento.'
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                <IconWhatsApp /> {CONTACTO.telefonoDisplay}
              </Boton>
              <a className="cta-caja__llamar" href={`tel:${CONTACTO.telefonoTel}`}>
                <IconTelefono />
                {CONTACTO.telefonoDisplay}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* =================================================================
   FOOTER
   ================================================================= */

function Pie() {
  return (
    <footer className="pie">
      <div className="envoltura pie__fila">
        <div className="pie__marca">
          <LogoAlba tamano={44} />
          <span>Catering Alba</span>
        </div>
        <div className="pie__distritos">
          {SERVICIOS.map((s) => (
            <span key={s.num}>{s.titulo}</span>
          ))}
        </div>
        <span className="pie__copy">© {new Date().getFullYear()} Catering Alba</span>
      </div>
    </footer>
  )
}

function IconMaletin() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="7.5" width="18" height="12" rx="2" />
      <path d="M8 7.5V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1.5" />
      <path d="M3 12.5h18" />
    </svg>
  )
}

/* =================================================================
   BOTÓN FLOTANTE — CONTRATAR
   ================================================================= */

function BotonContratar() {
  return (
    <a
      className="flotante-contratar"
      href="#formulario"
      onClick={(e) => {
        e.preventDefault()
        document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }}
    >
      <IconMaletin />
      <span>Contratar</span>
    </a>
  )
}

/* =================================================================
   APP
   ================================================================= */

export default function App() {
  const [activo, setActivo] = useState('inicio')

  const irA = (id) => {
    setActivo(id)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="pagina">
      <Header activo={activo} irA={irA} />
      <Hero irA={irA} />
      <Nosotros />
      <Servicios />
      <EligeTuServicio />
      <Menu />
      <Galeria />
      <FormularioContratar />
      <Contacto />
      <Pie />
      <BotonContratar />
    </div>
  )
}
