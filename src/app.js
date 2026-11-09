const introduction = {
  id: 'introduction',
  title: 'Introducción general',
  image: '/images/0.1.png',
  imageAlt: 'Ilustración de apoyo para la guía BioRed',
  resources: [
    { label: 'Repositorio del firmware BioRed', href: 'https://github.com/AngelPrz8a/BioRed_Firmware_ESP32' },
    { label: 'README: instalación y configuración', href: 'https://github.com/AngelPrz8a/BioRed_Firmware_ESP32#readme' },
  ],
}

const pages = [introduction, ...window.courseSections]
const app = document.querySelector('#app')
const completedTopics = new Set()
const carouselIndexes = new Map()
let currentPageId = introduction.id
let currentView = 'home'
let menuIsOpen = false
let contentsAreHighlighted = false

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character])
}

function imagePath(path) {
  return path.startsWith('/images/') ? `images/${path.slice('/images/'.length)}` : path
}

function completionMarkup() {
  const total = window.courseSections.length
  const completed = completedTopics.size
  const percent = Math.round((completed / total) * 100)
  return `
    <div class="progress-copy">
      <span>${completed === 0 ? 'Actividad opcional de repaso' : 'Avance del recorrido'}</span>
      <strong>${completed} de ${total} temas repasados</strong>
    </div>
    <div class="progress-track" role="progressbar" aria-valuenow="${completed}" aria-valuemin="0" aria-valuemax="${total}" aria-label="Temas repasados">
      <span style="width: ${percent}%"></span>
    </div>`
}

function topbarMarkup() {
  return `
    <header class="topbar">
      <button class="menu-toggle" type="button" aria-expanded="${menuIsOpen}" aria-controls="course-menu" data-action="toggle-menu">
        <span class="hamburger ${menuIsOpen ? 'open' : ''}" aria-hidden="true"><i></i><i></i><i></i></span>
        <span>${menuIsOpen ? 'CERRAR' : 'MENÚ'}</span>
      </button>
      <a class="brand" href="#" aria-label="BioRed, portada" data-action="home">
        <span class="brand-name">Bio<span>Red</span></span>
      </a>
      <span class="course-title">${escapeHTML(currentView === 'home' ? 'Guía interactiva · ESP32' : currentPage().title)}</span>
    </header>`
}

function menuMarkup() {
  if (!menuIsOpen) return ''
  return `
    <div class="menu-scrim" data-action="close-menu"></div>
    <aside id="course-menu" class="course-menu" aria-label="Menú de contenidos">
      <div class="menu-heading"><span>CONTENIDOS</span><span>${String(pages.length).padStart(2, '0')} TEMAS</span></div>
      ${pages.map((page, index) => `
        <button class="menu-item ${page.id === currentPageId ? 'selected' : ''}" type="button" data-page="${escapeHTML(page.id)}">
          <span class="menu-item-number">${index === 0 ? 'i' : index}</span>
          <span>${escapeHTML(page.title)}</span>
        </button>`).join('')}
    </aside>`
}

function homeMarkup() {
  return `
    <main class="home-page">
      <section class="cover">
        <div class="cover-copy">
          <span class="cover-kicker">GUÍA INTERACTIVA · ESP32</span>
          <h1>Preparación para usar el firmware BioRed</h1>
          <p>La placa ESP32 permite medir temperatura y humedad, conectarse a WiFi y enviar lecturas con el firmware BioRed.</p>
          <button class="cover-button" type="button" data-action="show-contents">Ver más <span aria-hidden="true">›</span></button>
        </div>
        <img class="cover-art" src="images/portada-ilustracion.png" alt="" />
      </section>

      <section id="course-contents" class="contents-section ${contentsAreHighlighted ? 'highlighted' : ''}">
        <div class="contents-heading"><span class="contents-accent"></span><h2>Desarrollo de contenidos</h2></div>
        <div class="contents-list">
          <button class="content-row intro-row" type="button" data-page="introduction">
            <span class="row-number info-number">i</span>
            <span class="row-copy"><strong>Introducción</strong><small>Recorrido y objetivo de la guía</small></span>
            <span class="row-action">Ver <span aria-hidden="true">›</span></span>
          </button>
          ${window.courseSections.map((section) => `
            <button class="content-row" type="button" data-page="${escapeHTML(section.id)}">
              <span class="row-number">${Number(section.number)}</span>
              <span class="row-copy"><strong>${escapeHTML(section.title)}</strong><small>${escapeHTML(section.shortTitle)}</small></span>
              <span class="row-action">Ver <span aria-hidden="true">›</span></span>
            </button>`).join('')}
        </div>
        <div class="course-progress">
          ${completionMarkup()}
          <p>Las preguntas al final de cada tema son opcionales y permiten repasar sin interrumpir el recorrido.</p>
        </div>
        <div class="start-course">
          <p>El recorrido puede seguirse en orden o consultarse cuando se requiera.</p>
          <button class="start-button" type="button" data-page="introduction">Comenzar recorrido <span aria-hidden="true">›</span></button>
        </div>
      </section>
    </main>`
}

function figureMarkup(image, alt, caption) {
  return `
    <figure class="general-figure">
      <img src="${escapeHTML(imagePath(image))}" alt="${escapeHTML(alt)}" />
      <figcaption>${escapeHTML(caption)}</figcaption>
    </figure>`
}

function carouselMarkup(images, title, key) {
  if (!images?.length) return ''
  const index = carouselIndexes.get(key) ?? 0
  const image = images[index]
  return `
    <div class="step-gallery" aria-label="Galería de imágenes: ${escapeHTML(title)}">
      <figure class="carousel-frame">
        <img src="${escapeHTML(imagePath(image.src))}" alt="${escapeHTML(image.alt)}" loading="lazy" />
        <figcaption>${escapeHTML(image.caption)}</figcaption>
        <span class="carousel-count">${index + 1} / ${images.length}</span>
        ${images.length > 1 ? `
          <button class="carousel-arrow previous" type="button" data-carousel="${escapeHTML(key)}" data-direction="-1" aria-label="Imagen anterior de ${escapeHTML(title)}">‹</button>
          <button class="carousel-arrow next" type="button" data-carousel="${escapeHTML(key)}" data-direction="1" aria-label="Imagen siguiente de ${escapeHTML(title)}">›</button>` : ''}
      </figure>
      ${images.length > 1 ? `<div class="carousel-dots" aria-label="Seleccionar imagen para ${escapeHTML(title)}">
        ${images.map((_, dotIndex) => `<button type="button" class="${dotIndex === index ? 'active' : ''}" data-carousel="${escapeHTML(key)}" data-index="${dotIndex}" aria-label="Mostrar imagen ${dotIndex + 1}" ${dotIndex === index ? 'aria-current="true"' : ''}></button>`).join('')}
      </div>` : ''}
    </div>`
}

function componentListItemMarkup(item) {
  if (typeof item === 'string') return `<li>${escapeHTML(item)}</li>`
  return `<li><strong>${escapeHTML(item.title)}</strong> ${escapeHTML(item.text)}</li>`
}

function componentStepMarkup(section, step, index) {
  const key = `${section.id}-${index}`
  const title = step.label ? `${step.label} ${step.title}` : step.title
  return `
    <section class="component-step">
      <div class="component-step-heading">
        <h3>${escapeHTML(title)}</h3>
      </div>
      <p>${escapeHTML(step.text)}</p>
      ${carouselMarkup(step.images, step.title, key)}
      ${step.instructions?.length ? `<div class="step-instructions"><h4>Instrucciones</h4><ol>${step.instructions.map((instruction) => `<li>${escapeHTML(instruction)}</li>`).join('')}</ol></div>` : ''}
      ${step.codeBlocks?.length ? `<div class="step-code-blocks">${step.codeBlocks.map((block) => `<div class="step-code-block">${block.label ? `<h4>${escapeHTML(block.label)}</h4>` : ''}<pre><code>${escapeHTML(block.code)}</code></pre></div>`).join('')}</div>` : ''}
      ${step.table ? `<div class="connection-table-wrap"><table class="connection-table"><caption>${escapeHTML(step.table.caption ?? 'Conexión de referencia del sensor DHT22 y la tarjeta ESP32')}</caption><thead><tr>${step.table.headers.map((header) => `<th scope="col">${escapeHTML(header)}</th>`).join('')}</tr></thead><tbody>${step.table.rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHTML(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : ''}
      ${step.bullets?.length ? `<ul class="step-bullets">${step.bullets.map((item) => `<li>${escapeHTML(item)}</li>`).join('')}</ul>` : ''}
      ${step.resources?.length ? `<div class="step-links">${step.resources.map((resource) => `<a href="${escapeHTML(resource.href)}" target="_blank" rel="noreferrer">${escapeHTML(resource.label)} <span aria-hidden="true">↗</span></a>`).join('')}</div>` : ''}
    </section>`
}

function stepsMarkup(section) {
  const components = [
    { key: 'essential', title: 'Esencial', description: 'Lo mínimo para que el sistema funcione. Si falta algún elemento de este apartado, no es posible avanzar.', list: section.essentials },
    { key: 'recommended', title: 'Recomendado', description: 'Lo que mejora la experiencia o la seguridad, aunque puede omitirse.', list: section.recommended },
    { key: 'tips', title: 'Notas y tips', description: 'Explicaciones y consejos para evitar los errores más comunes.', list: section.tips },
  ]
  return `
    <section class="content-subsection">
      <div class="component-accordion">
        ${components.map((component) => `
          <details class="component-item">
            <summary class="component-summary">
              <span class="component-summary-copy"><strong>${component.title}</strong><span>${component.description}</span></span>
              <span class="step-chevron" aria-hidden="true">⌄</span>
            </summary>
            <div class="component-detail">
              ${component.key === 'essential' && section.image ? figureMarkup(section.image, section.imageAlt, section.title) : ''}
              ${section.steps.filter((step) => step.component === component.key && step.beforeList).map((step) => componentStepMarkup(section, step, section.steps.indexOf(step))).join('')}
              ${component.list.length ? `<ul class="component-list">${component.list.map(componentListItemMarkup).join('')}</ul>` : ''}
              ${section.steps.map((step, index) => step.component === component.key && !step.beforeList ? componentStepMarkup(section, step, index) : '').join('')}
            </div>
          </details>`).join('')}
      </div>
    </section>`
}

function checkMarkup(section) {
  const check = section.knowledgeCheck
  if (!check) return ''
  const completed = completedTopics.has(section.id)
  return `
    <section class="knowledge-check" aria-labelledby="check-${escapeHTML(section.id)}">
      <div class="knowledge-check-heading">
        <span class="knowledge-check-icon" aria-hidden="true">?</span>
        <div><span class="knowledge-check-kicker">ACTIVIDAD OPCIONAL DE REPASO</span><h2 id="check-${escapeHTML(section.id)}">Comprobación de conocimientos</h2></div>
      </div>
      <p class="knowledge-check-question">${escapeHTML(check.question)}</p>
      <fieldset class="knowledge-check-options" ${completed ? 'disabled' : ''}>
        <legend class="visually-hidden">Selección de una respuesta</legend>
        ${check.options.map((option, index) => `<label class="knowledge-check-option">
          <input type="radio" name="check-${escapeHTML(section.id)}" value="${escapeHTML(option)}" ${completed && option === check.correctAnswer ? 'checked' : ''} />
          <span>${escapeHTML(option)}</span>
        </label>`).join('')}
      </fieldset>
      ${completed ? `<p class="knowledge-check-feedback correct" role="status">${escapeHTML(check.explanation)}</p>` : ''}
      <button class="knowledge-check-submit" type="button" data-check="${escapeHTML(section.id)}" ${completed ? 'disabled' : ''}>
        ${completed ? 'Tema repasado' : 'Comprobar respuesta'} <span aria-hidden="true">${completed ? '✓' : '→'}</span>
      </button>
    </section>`
}

function introductionMarkup() {
  return `
    <div class="reading-content">
      <p class="lead">Esta guía conduce desde cero hasta el funcionamiento de una placa ESP32 que mide temperatura y humedad y envía esos datos por Internet. Es un material de aprendizaje: no se exigen conocimientos previos, ya que puede ser utilizado tanto por quienes programan como por quienes se inician o nunca han trabajado con un microcontrolador. Cada término se explica la primera vez que aparece, y cada paso indica qué se hace, por qué se hace y cómo comprobar que quedó correcto.</p>
      ${figureMarkup(introduction.image, introduction.imageAlt, '')}
      <p><strong>Organización.</strong> El material consta de ocho secciones, ordenadas según el trabajo real: lo físico (hardware y red), lo que se instala en el computador (software y librerías), el proyecto (clonación y configuración) y la puesta en marcha. Todas las secciones siguen el mismo patrón:</p>
      <ul>
        <li><strong>Esencial:</strong> lo mínimo para que el sistema funcione. Si falta algún elemento de este apartado, no es posible avanzar.</li>
        <li><strong>Recomendado:</strong> lo que mejora la experiencia o la seguridad, aunque puede omitirse.</li>
        <li><strong>Notas y tips:</strong> explicaciones y consejos para evitar los errores más comunes.</li>
      </ul>
      <p><strong>Para quienes ya programan,</strong> el avance será más rápido, pero se recomienda leer las notas, pues existen detalles propios de este proyecto (nombre de carpeta, versión de una librería y activación en dos niveles) que generan fallos incluso con experiencia.</p>
      <p><strong>Para quienes no programan,</strong> no es necesario escribir código: casi todo el proceso consiste en instalar, copiar, renombrar y cambiar un valor de 0 a 1.</p>
      <div class="reading-callout goal-callout">
        <h2>Al finalizar se contará con</h2>
        <p>Una placa que se conecta al WiFi mediante una página de configuración y publica lecturas hacia un servidor MQTT o una API.</p>
      </div>
    </div>`
}

function readerMarkup(section) {
  const intro = section.id === introduction.id
  const content = intro ? introductionMarkup() : `
    <div class="reading-content">
      <section class="topic-overview">
        <h2>Qué se verá aquí</h2><p class="lead">${escapeHTML(section.description)}</p>
        <h2>Para qué sirve</h2><p>${escapeHTML(section.why)}</p>
      </section>
      ${stepsMarkup(section)}
      <div class="learning-outcome"><span class="outcome-icon" aria-hidden="true">✓</span><p><strong>Al finalizar</strong><br />${escapeHTML(section.outcome)}</p></div>
      ${checkMarkup(section)}
    </div>`
  const resources = section.resources?.length ? `
    <section class="resources-section">
      <h2>Recursos y enlaces</h2>
      ${section.resources.map((resource) => `<a class="resource-link" href="${escapeHTML(resource.href)}" target="_blank" rel="noreferrer">
        <span class="resource-icon" aria-hidden="true">↗</span><span>${escapeHTML(resource.label)}</span><span class="resource-arrow" aria-hidden="true">↗</span>
      </a>`).join('')}
    </section>` : ''
  const index = pages.findIndex((page) => page.id === section.id)
  return `
    <article class="reading-page">
      <div class="reading-heading">
        <span class="topic-icon" aria-hidden="true">${intro ? 'i' : escapeHTML(section.number)}</span>
        <div><span class="reading-kicker">${intro ? 'GUÍA DE APRENDIZAJE' : `TEMA ${escapeHTML(section.number)}`}</span><h1>${escapeHTML(section.title)}</h1></div>
      </div>
      <div class="reader-progress">${completionMarkup()}</div>
      ${content}${resources}
    </article>
    <nav class="page-navigation" aria-label="Navegación entre temas">
      <button class="nav-back" type="button" data-relative="-1" ${index === 0 ? 'disabled' : ''}><span aria-hidden="true">‹</span> Regresar</button>
      <span class="nav-page-count">${String(index + 1).padStart(2, '0')} / ${String(pages.length).padStart(2, '0')}</span>
      <button class="nav-next" type="button" data-relative="1" ${index === pages.length - 1 ? 'disabled' : ''}>Continuar <span aria-hidden="true">›</span></button>
    </nav>`
}

function currentPage() {
  return pages.find((page) => page.id === currentPageId) ?? introduction
}

function render() {
  app.innerHTML = `${topbarMarkup()}${menuMarkup()}${currentView === 'home' ? homeMarkup() : readerMarkup(currentPage())}`
}

function navigateTo(pageId) {
  if (pageId === 'home') {
    currentView = 'home'
    currentPageId = introduction.id
  } else if (pages.some((page) => page.id === pageId)) {
    currentView = 'reader'
    currentPageId = pageId
  } else {
    return
  }
  menuIsOpen = false
  carouselIndexes.clear()
  render()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function updateCarousel(button) {
  const key = button.dataset.carousel
  const section = window.courseSections.find((item) => item.steps.some((step, index) => `${item.id}-${index}` === key))
  const stepIndex = Number(key.slice(key.lastIndexOf('-') + 1))
  const images = section?.steps[stepIndex]?.images ?? []
  if (!images.length) return
  const currentIndex = carouselIndexes.get(key) ?? 0
  const requestedIndex = button.dataset.index === undefined
    ? currentIndex + Number(button.dataset.direction)
    : Number(button.dataset.index)
  carouselIndexes.set(key, (requestedIndex + images.length) % images.length)
  const detail = button.closest('.component-step')
  const gallery = detail?.querySelector('.step-gallery')
  if (gallery) gallery.outerHTML = carouselMarkup(images, section.steps[stepIndex].title, key)
}

app.addEventListener('click', (event) => {
  const button = event.target.closest('button, a[data-action], [data-action="close-menu"]')
  if (!button) return
  if (button.dataset.page) {
    navigateTo(button.dataset.page)
  } else if (button.dataset.action === 'home') {
    event.preventDefault()
    navigateTo('home')
  } else if (button.dataset.action === 'toggle-menu') {
    menuIsOpen = !menuIsOpen
    render()
  } else if (button.dataset.action === 'close-menu') {
    menuIsOpen = false
    render()
  } else if (button.dataset.action === 'show-contents') {
    contentsAreHighlighted = true
    render()
    document.querySelector('#course-contents')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else if (button.dataset.relative) {
    const index = pages.findIndex((page) => page.id === currentPageId)
    navigateTo(pages[index + Number(button.dataset.relative)]?.id)
  } else if (button.dataset.carousel !== undefined) {
    updateCarousel(button)
  } else if (button.dataset.check) {
    const section = window.courseSections.find((item) => item.id === button.dataset.check)
    const selected = app.querySelector(`input[name="check-${CSS.escape(section.id)}"]:checked`)
    const check = section.knowledgeCheck
    const previousFeedback = button.parentElement.querySelector('.knowledge-check-feedback')
    previousFeedback?.remove()
    if (!selected) {
      button.insertAdjacentHTML('beforebegin', `<p class="knowledge-check-feedback" role="status">Se debe seleccionar una respuesta para comprobarla. La actividad es opcional y se puede continuar sin responder.</p>`)
      return
    }
    if (selected.value === check.correctAnswer) {
      completedTopics.add(section.id)
      selected.closest('.knowledge-check-option').classList.add('correct-answer')
      button.insertAdjacentHTML('beforebegin', `<p class="knowledge-check-feedback correct" role="status">${escapeHTML(check.explanation)}</p>`)
      button.disabled = true
      button.innerHTML = 'Tema repasado <span aria-hidden="true">✓</span>'
      app.querySelectorAll('.knowledge-check-option input').forEach((input) => { input.disabled = true })
      const progress = document.querySelectorAll('.course-progress, .reader-progress')
      progress.forEach((element) => { element.innerHTML = completionMarkup() })
    } else {
      button.insertAdjacentHTML('beforebegin', `<p class="knowledge-check-feedback" role="status">${escapeHTML(check.retryHint)}</p>`)
    }
  }
})

render()
