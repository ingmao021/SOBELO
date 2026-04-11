import { computed, ref, watch } from 'vue'

type Language = 'es' | 'en'
type Theme = 'light' | 'dark'

type Dictionary = Record<string, string>

const dictionaries: Record<Language, Dictionary> = {
  es: {
    skip_content: 'Ir al contenido principal',
    skip_nav: 'Ir a la navegacion',
    skip_footer: 'Ir al pie de pagina',
    nav_home: 'Inicio',
    nav_faq: 'Preguntas frecuentes',
    nav_player: 'Reproductor',
    nav_aria: 'Navegacion principal',
    theme_to_light: 'Cambiar a modo claro',
    theme_to_dark: 'Cambiar a modo oscuro',
    lang_button_es: 'Espanol',
    lang_button_en: 'English',
    player_title: 'Lista de reproduccion',
    player_list_aria: 'Lista de canciones',
    player_add_button: 'Agregar',
    player_clear_button: 'Limpiar',
    player_remove_song: 'Eliminar cancion',
    player_empty_title: 'La lista de reproduccion esta vacia',
    player_empty_copy: 'Agregue archivos multimedia a la lista de reproduccion',
    player_select_files: 'Seleccionar archivos multimedia',
    player_upload_hint: 'Agrega canciones por lotes desde el boton Agregar o selecciona archivos de audio.',
    player_audio_missing: 'La cancion activa no tiene audio. Agrega un archivo desde el modal para reproducir.',
    intro_title: 'SOBELO: Reproductor de Musica en Linea',
    intro_copy: 'Un reproductor multimedia en linea centrado en privacidad, ejecutado en su navegador.',
    intro_features: 'Caracteristicas principales',
    intro_how_to: 'Como usar',
    intro_feature_1_title: 'Privacidad primero',
    intro_feature_1_copy: 'Todos los archivos se reproducen en tu dispositivo, sin subir contenido a servidores.',
    intro_feature_2_title: 'Formatos comunes',
    intro_feature_2_copy: 'Compatibilidad con MP3, FLAC, WAV y OGG para uso local rapido.',
    intro_feature_3_title: 'Sin instalacion',
    intro_feature_3_copy: 'Abre, agrega canciones y reproduce inmediatamente desde el navegador.',
    intro_feature_4_title: 'Controles fluidos',
    intro_feature_4_copy: 'Volumen, progreso, cambio de pista y modo de repeticion en una sola vista.',
    intro_step_1: 'Pulsa Agregar cancion y selecciona un archivo de audio.',
    intro_step_2: 'Organiza la playlist y elige una pista desde la lista.',
    intro_step_3: 'Controla reproduccion, volumen y progreso desde el panel principal.',
    faq_heading: 'Preguntas frecuentes',
    faq_1_q: 'Es SOBELO gratuito?',
    faq_1_a: 'Si. SOBELO es 100% gratuito. No hay costos ocultos ni limites de uso.',
    faq_2_q: 'Mi privacidad esta protegida?',
    faq_2_a: 'Absolutamente. Tus archivos se procesan localmente en tu navegador y no se suben a nuestros servidores.',
    faq_3_q: 'Que formatos se admiten?',
    faq_3_a: 'Soporta formatos como MP3, FLAC, WAV y OGG para audio local de forma segura.',
    modal_title: 'Agregar cancion',
    modal_label_title: 'Titulo',
    modal_label_artist: 'Artista',
    modal_label_audio: 'Archivo de audio',
    modal_label_cover: 'Imagen de portada',
    modal_label_position: 'Posicion',
    modal_label_index: 'Indice',
    modal_pos_start: 'Al inicio',
    modal_pos_end: 'Al final',
    modal_pos_index: 'En posicion especifica',
    modal_cancel: 'Cancelar',
    modal_add: 'Agregar',
    modal_error_required: 'Titulo y artista son obligatorios.',
    modal_error_index: 'El indice debe ser un numero entero mayor o igual a 0.',
    modal_error_add: 'No se pudo agregar la cancion.',
    footer_copy: '(c) 2026 SOBELO. Todos los derechos reservados.',
    footer_privacy: 'Politica de privacidad',
    footer_terms: 'Terminos de servicio',
    footer_github: 'GitHub',
    footer_disclaimer: 'SOBELO no aloja ni almacena archivos multimedia. Todo el contenido se procesa localmente en el navegador.',
    control_favorite: 'Favorito',
    control_prev: 'Anterior',
    control_play: 'Reproducir',
    control_pause: 'Pausar',
    control_next: 'Siguiente',
    control_shuffle: 'Mezclar',
    control_repeat: 'Cambiar repeticion',
    control_notice_empty_list: 'No hay canciones en la lista.',
    control_notice_missing_audio: 'Esta cancion no tiene archivo de audio.',
    control_notice_play_failed: 'No se pudo reproducir el audio.'
  },
  en: {
    skip_content: 'Skip to main content',
    skip_nav: 'Skip to navigation',
    skip_footer: 'Skip to footer',
    nav_home: 'Home',
    nav_faq: 'FAQ',
    nav_player: 'Player',
    nav_aria: 'Main navigation',
    theme_to_light: 'Switch to light mode',
    theme_to_dark: 'Switch to dark mode',
    lang_button_es: 'Spanish',
    lang_button_en: 'English',
    player_title: 'Playlist',
    player_list_aria: 'Song list',
    player_add_button: 'Add',
    player_clear_button: 'Clear',
    player_remove_song: 'Remove song',
    player_empty_title: 'Your playlist is empty',
    player_empty_copy: 'Add media files to start listening',
    player_select_files: 'Select media files',
    player_upload_hint: 'Add songs in batches from the Add button or select audio files.',
    player_audio_missing: 'The active song has no audio file. Add one from the modal to play it.',
    intro_title: 'SOBELO: Online Music Player',
    intro_copy: 'A privacy-first online media player that runs directly in your browser.',
    intro_features: 'Key features',
    intro_how_to: 'How to use',
    intro_feature_1_title: 'Privacy first',
    intro_feature_1_copy: 'All files are played on your device, without uploading content to servers.',
    intro_feature_2_title: 'Common formats',
    intro_feature_2_copy: 'Support for MP3, FLAC, WAV and OGG for fast local usage.',
    intro_feature_3_title: 'No installation',
    intro_feature_3_copy: 'Open, add songs and play instantly in your browser.',
    intro_feature_4_title: 'Smooth controls',
    intro_feature_4_copy: 'Volume, progress, track switch and repeat mode in one view.',
    intro_step_1: 'Tap Add song and select an audio file.',
    intro_step_2: 'Organize the playlist and choose a track from the list.',
    intro_step_3: 'Control playback, volume and progress from the main panel.',
    faq_heading: 'Frequently asked questions',
    faq_1_q: 'Is SOBELO free?',
    faq_1_a: 'Yes. SOBELO is 100% free. There are no hidden costs or usage limits.',
    faq_2_q: 'Is my privacy protected?',
    faq_2_a: 'Absolutely. Your files are processed locally in your browser and never uploaded to our servers.',
    faq_3_q: 'Which formats are supported?',
    faq_3_a: 'Supports MP3, FLAC, WAV and OGG formats for secure local audio playback.',
    modal_title: 'Add song',
    modal_label_title: 'Title',
    modal_label_artist: 'Artist',
    modal_label_audio: 'Audio file',
    modal_label_cover: 'Cover image',
    modal_label_position: 'Position',
    modal_label_index: 'Index',
    modal_pos_start: 'At start',
    modal_pos_end: 'At end',
    modal_pos_index: 'At specific index',
    modal_cancel: 'Cancel',
    modal_add: 'Add',
    modal_error_required: 'Title and artist are required.',
    modal_error_index: 'Index must be an integer greater than or equal to 0.',
    modal_error_add: 'Could not add the song.',
    footer_copy: '(c) 2026 SOBELO. All rights reserved.',
    footer_privacy: 'Privacy policy',
    footer_terms: 'Terms of service',
    footer_github: 'GitHub',
    footer_disclaimer: 'SOBELO does not host or store media files. All content is processed locally in your browser.',
    control_favorite: 'Favorite',
    control_prev: 'Previous',
    control_play: 'Play',
    control_pause: 'Pause',
    control_next: 'Next',
    control_shuffle: 'Shuffle',
    control_repeat: 'Toggle repeat',
    control_notice_empty_list: 'No songs in the playlist.',
    control_notice_missing_audio: 'This song does not have an audio file.',
    control_notice_play_failed: 'Could not play audio.'
  }
}

const language = ref<Language>('es')
const theme = ref<Theme>('light')

let initialized = false

function initialize(): void {
  if (initialized || typeof window === 'undefined') {
    return
  }

  const storedLang = window.localStorage.getItem('lang')
  const storedTheme = window.localStorage.getItem('theme')

  if (storedLang === 'es' || storedLang === 'en') {
    language.value = storedLang
  }

  if (storedTheme === 'light' || storedTheme === 'dark') {
    theme.value = storedTheme
  }

  initialized = true
}

function toggleLanguage(): void {
  language.value = language.value === 'es' ? 'en' : 'es'
}

function toggleTheme(): void {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

function t(key: string): string {
  return dictionaries[language.value][key] ?? key
}

watch(language, (next) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = next
  }

  if (typeof window !== 'undefined') {
    window.localStorage.setItem('lang', next)
  }
}, { immediate: true })

watch(theme, (next) => {
  if (typeof document !== 'undefined') {
    document.body.setAttribute('data-theme', next)
  }

  if (typeof window !== 'undefined') {
    window.localStorage.setItem('theme', next)
  }
}, { immediate: true })

export function useUiPreferences() {
  initialize()

  return {
    language: computed(() => language.value),
    theme: computed(() => theme.value),
    toggleLanguage,
    toggleTheme,
    t
  }
}
