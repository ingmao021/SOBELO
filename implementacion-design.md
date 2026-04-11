<!doctype html>
<html lang="es">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>SOBELO - Reproductor de Musica en Linea</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet" />
	<style>
		:root {
			--bg-canvas: #1d1f23;
			--surface: #ffffff;
			--surface-soft: #f8fafc;
			--text-main: #1e293b;
			--text-muted: #64748b;
			--line: #e2e8f0;
			--blue: #3b82f6;
			--blue-deep: #2563eb;
			--radius-lg: 16px;
			--radius-md: 10px;
			--radius-sm: 8px;
			--shadow-card: 0 10px 30px -5px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.05);
		}

		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			font-family: Inter, Roboto, sans-serif;
			color: var(--text-main);
			background: linear-gradient(180deg, #191b20 0, #1d1f23 220px, #1d1f23 100%);
			min-height: 100vh;
		}

		.skip-links {
			position: absolute;
			left: 10px;
			top: 10px;
			z-index: 5;
			display: flex;
			gap: 8px;
		}

		.skip-links a {
			font: 700 12px/1 Roboto, sans-serif;
			background: #000;
			color: #fff;
			text-decoration: none;
			border-radius: 4px;
			padding: 7px 10px;
			transform: translateY(-200%);
			transition: transform .2s ease;
		}

		.skip-links a:focus {
			transform: translateY(0);
		}

		.shell {
			max-width: 1560px;
			margin: 230px auto 60px;
			background: var(--surface);
			box-shadow: var(--shadow-card);
			border: 1px solid #f1f5f9;
		}

		.header {
			height: 66px;
			border-bottom: 1px solid #f1f5f9;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			padding: 0 34px;
			background: #fff;
			position: sticky;
			top: 0;
			z-index: 4;
		}

		.header nav {
			display: flex;
			align-items: center;
			gap: 14px;
			font-size: 12px;
			font-weight: 500;
			color: #64748b;
		}

		.header a {
			color: inherit;
			text-decoration: none;
			padding: 8px 12px;
			border-radius: 6px;
		}

		.header button {
			border: 0;
			background: transparent;
			color: inherit;
			padding: 8px 12px;
			border-radius: 6px;
			font: inherit;
			cursor: pointer;
		}

		.header a.active {
			color: var(--blue);
			font-weight: 700;
		}

		.header .dot {
			color: #94a3b8;
			font-size: 15px;
		}

		.header .theme-toggle {
			font-size: 15px;
			color: #94a3b8;
			padding: 8px;
			width: 36px;
			height: 36px;
		}

		.main-top {
			display: grid;
			grid-template-columns: minmax(0, 2fr) minmax(260px, 1fr);
			gap: 16px;
			padding: 20px;
			background: var(--surface-soft);
			border-bottom: 1px solid #f1f5f9;
		}

		.video-panel,
		.playlist-panel {
			border: 1px solid rgba(15, 23, 42, 0.06);
			background: rgba(255, 255, 255, 0.82);
			border-radius: var(--radius-sm);
			backdrop-filter: blur(5px);
		}

		.video-frame {
			margin: 0;
			min-height: 320px;
			border-radius: var(--radius-lg);
			border: 1px solid rgba(15, 23, 42, 0.04);
			background: #f1f3f5;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			gap: 18px;
			padding: 22px;
			color: #94a3b8;
			text-align: center;
		}

		.upload-cloud {
			width: 80px;
			height: 80px;
			border-radius: 20px;
			display: grid;
			place-items: center;
			color: var(--blue);
			font-size: 36px;
			font-weight: 700;
		}

		.btn-primary,
		.btn-secondary {
			border: 0;
			border-radius: 999px;
			padding: 10px 18px;
			font: 700 12px/1 Roboto, sans-serif;
			cursor: pointer;
		}

		.btn-primary {
			background: linear-gradient(133deg, var(--blue), var(--blue-deep));
			color: #fff;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
		}

		.btn-secondary {
			background: #e2e8f0;
			color: #94a3b8;
			opacity: .7;
		}

		.upload-hint {
			margin: 0;
			font-size: 11px;
			color: #94a3b8;
		}

		.controls {
			margin-top: 12px;
			border: 1px solid rgba(15, 23, 42, 0.05);
			border-radius: var(--radius-sm);
			padding: 12px 16px;
			background: rgba(255, 255, 255, 0.75);
			box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04);
		}

		.timeline {
			display: grid;
			grid-template-columns: 40px 1fr 40px;
			align-items: center;
			gap: 12px;
			font-size: 12px;
			color: #334155;
			margin-bottom: 10px;
		}

		.progress {
			height: 6px;
			background: #e2e8f0;
			opacity: .5;
			border-radius: 999px;
		}

		.control-row {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			gap: 8px;
		}

		.icon-btn {
			width: 34px;
			height: 34px;
			border: 0;
			border-radius: 999px;
			background: #f5f5f5;
			opacity: .6;
			color: #334155;
			font-size: 11px;
			cursor: pointer;
		}

		.vol {
			margin-left: 2px;
			width: 104px;
			height: 6px;
			border-radius: 999px;
			background: linear-gradient(90deg, var(--blue) 10%, #e2e8f0 10%);
			opacity: .75;
		}

		.speed {
			border: 1px solid rgba(0, 0, 0, 0.08);
			border-radius: 6px;
			padding: 7px 12px;
			font-size: 12px;
			color: #94a3b8;
			background: #f5f5f5;
			opacity: .75;
		}

		.playlist-panel {
			display: flex;
			flex-direction: column;
			padding: 16px;
			min-height: 560px;
		}

		.playlist-head {
			border-bottom: 1px solid rgba(59, 130, 246, 0.25);
			padding-bottom: 10px;
			margin-bottom: 12px;
		}

		.playlist-title {
			margin: 0 0 10px;
			color: var(--blue);
			font: 700 20px/1.1 Roboto, sans-serif;
		}

		.playlist-actions {
			display: flex;
			gap: 8px;
		}

		.playlist-empty {
			margin: auto;
			text-align: center;
			color: var(--text-muted);
			max-width: 270px;
		}

		.playlist-empty .icon {
			font-size: 36px;
			color: #6b93d7;
			opacity: .9;
		}

		.playlist-empty h3 {
			margin: 12px 0 8px;
			font: 700 28px/1.12 Roboto, sans-serif;
			color: #0f172a;
		}

		.playlist-empty p {
			margin: 0;
			font-size: 12px;
		}

		.intro,
		.faq {
			background: #fff;
			padding: 40px 24px 34px;
		}

		.intro-wrap,
		.faq-wrap {
			max-width: 1200px;
			margin: 0 auto;
			text-align: center;
		}

		h1 {
			margin: 0;
			font: 800 46px/1.04 Roboto, sans-serif;
			color: #1e293b;
		}

		.subtitle {
			margin: 14px auto 0;
			max-width: 860px;
			font-size: 14px;
			color: #475569;
		}

		h2 {
			margin: 36px 0 18px;
			font: 700 32px/1.1 Roboto, sans-serif;
			color: #1f2937;
		}

		.features {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 14px;
			margin-top: 10px;
			text-align: left;
		}

		.feature {
			border: 1px solid var(--line);
			border-radius: 6px;
			padding: 17px 20px;
			background: #fff;
		}

		.feature h3 {
			margin: 0 0 8px;
			color: #2563eb;
			font: 700 14px/1.2 Roboto, sans-serif;
		}

		.feature p {
			margin: 0;
			font-size: 12px;
			line-height: 1.5;
			color: #475569;
		}

		.steps {
			margin: 12px auto 0;
			max-width: 780px;
			text-align: left;
			color: #334155;
			font-size: 13px;
			line-height: 1.8;
			font-weight: 500;
		}

		.faq {
			background: var(--surface-soft);
			border-top: 1px solid #f1f5f9;
			border-bottom: 1px solid #f1f5f9;
		}

		.faq-wrap {
			max-width: 1000px;
		}

		.faq-list {
			margin-top: 22px;
			display: grid;
			gap: 22px;
		}

		.faq-item {
			text-align: left;
			background: #fff;
			border: 1px solid #e5e7eb;
			border-radius: var(--radius-sm);
			box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
			padding: 22px 24px;
		}

		.faq-item h3 {
			margin: 0 0 10px;
			font: 700 16px/1.4 Roboto, sans-serif;
			color: #1e293b;
		}

		.faq-item p {
			margin: 0;
			color: #475569;
			font-size: 12px;
			line-height: 1.6;
		}

		.faq-item strong {
			color: #2563eb;
		}

		.footer {
			text-align: center;
			padding: 18px 20px 34px;
			font-size: 11px;
			color: #94a3b8;
			background: #f8fafc;
		}

		.footer-links {
			margin-bottom: 10px;
			color: #94a3b8;
		}

		.footer-links a {
			color: #3b82f6;
			text-decoration: none;
			margin: 0 8px;
		}

		.footer small {
			display: block;
			max-width: 860px;
			margin: 8px auto 0;
			line-height: 1.6;
		}

		body[data-theme="dark"] {
			--surface: #0f172a;
			--surface-soft: #111827;
			--text-main: #e2e8f0;
			--text-muted: #94a3b8;
			--line: #1f2937;
			background: linear-gradient(180deg, #0b1020 0, #0f172a 220px, #0b1020 100%);
		}

		body[data-theme="dark"] .shell,
		body[data-theme="dark"] .header,
		body[data-theme="dark"] .intro,
		body[data-theme="dark"] .feature,
		body[data-theme="dark"] .faq-item,
		body[data-theme="dark"] .playlist-panel,
		body[data-theme="dark"] .video-panel,
		body[data-theme="dark"] .controls,
		body[data-theme="dark"] .footer {
			background: #0f172a;
			border-color: #1f2937;
		}

		body[data-theme="dark"] .main-top,
		body[data-theme="dark"] .faq {
			background: #111827;
		}

		body[data-theme="dark"] h1,
		body[data-theme="dark"] h2,
		body[data-theme="dark"] h3,
		body[data-theme="dark"] .faq-item p,
		body[data-theme="dark"] .feature p,
		body[data-theme="dark"] .steps,
		body[data-theme="dark"] .subtitle,
		body[data-theme="dark"] .upload-hint,
		body[data-theme="dark"] .footer,
		body[data-theme="dark"] .footer-links {
			color: #cbd5e1;
		}

		body[data-theme="dark"] .video-frame {
			background: #1f2937;
		}

		body[data-theme="dark"] .icon-btn,
		body[data-theme="dark"] .speed,
		body[data-theme="dark"] .btn-secondary {
			background: #1e293b;
			color: #94a3b8;
		}

		@media (max-width: 1180px) {
			.shell {
				margin-top: 140px;
			}

			.main-top {
				grid-template-columns: 1fr;
			}

			.playlist-panel {
				min-height: 380px;
			}
		}

		@media (max-width: 760px) {
			.header {
				justify-content: center;
				padding: 0 14px;
			}

			.header nav {
				gap: 4px;
			}

			.header a {
				padding: 8px 6px;
				font-size: 11px;
			}

			h1 {
				font-size: 34px;
			}

			h2 {
				font-size: 28px;
			}

			.features {
				grid-template-columns: 1fr;
			}
		}
	</style>
</head>
<body>
	<div class="skip-links">
		<a href="#contenido" data-i18n="skip_content">Ir al contenido principal</a>
		<a href="#nav" data-i18n="skip_nav">Ir a la navegacion</a>
		<a href="#pie" data-i18n="skip_footer">Ir al pie de pagina</a>
	</div>

	<main class="shell" id="contenido">
		<header class="header" id="nav">
			<nav>
				<a href="#" class="active" data-i18n="nav_home">Inicio</a>
				<a href="#faq" data-i18n="nav_faq">Preguntas frecuentes</a>
				<button id="themeToggle" class="theme-toggle" type="button" aria-label="Cambiar tema">☀</button>
				<button id="langToggle" type="button">Espanol</button>
			</nav>
		</header>
        

		<section class="main-top">
			<div class="video-panel">
				<div class="video-frame">
                    <div class="upload-cloud">
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 640 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                            <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128l-368 0zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39L296 392c0 13.3 10.7 24 24 24s24-10.7 24-24l0-134.1 39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z">
                            </path>
                        </svg>
                    </div>
                    <button class="btn-primary" data-i18n="btn_select_files">Seleccionar archivos multimedia</button>
                    <p class="upload-hint" data-i18n="upload_hint">Admite agregar archivos multimedia por lotes, arrastra archivos directamente al reproductor o haz clic para seleccionar</p>
                </div>

				<div class="controls">
					<div class="timeline">
						<span>0:00</span>
						<div class="progress"></div>
						<span>0:00</span>
					</div>

					<div class="control-row">
						<button class="icon-btn">▶</button>
						<button class="icon-btn">■</button>
						<button class="icon-btn">⏮</button>
						<button class="icon-btn">⏭</button>
						<button class="icon-btn">↶</button>
						<button class="icon-btn">↷</button>
						<button class="icon-btn">🔈</button>
						<div class="vol" aria-hidden="true"></div>
						<span style="font-size:11px;color:#334155;">10%</span>
						<span class="speed">1.0x</span>
						<button class="icon-btn">CC</button>
						<button class="icon-btn">⛶</button>
					</div>
				</div>
			</div>

			<aside class="playlist-panel">
				<div class="playlist-head">
					<h2 class="playlist-title" data-i18n="playlist_title">≡ Lista de reproduccion</h2>
					<div class="playlist-actions">
						<button class="btn-primary" data-i18n="btn_add">+ Agregar</button>
						<button class="btn-secondary" data-i18n="btn_clear">🗑 Limpiar</button>
					</div>
				</div>
				<div class="playlist-empty">
					<div class="icon">⌗</div>
					<h3 data-i18n="playlist_empty_title">La lista de reproduccion esta vacia</h3>
					<p data-i18n="playlist_empty_text">Agregue archivos multimedia a la lista de reproduccion</p>
				</div>
			</aside>
		</section>

		<section class="intro">
			<div class="intro-wrap">
				<h1 data-i18n="intro_title">SOBELO: Reproductor de Musica en Linea</h1>
				<p class="subtitle" data-i18n-html="intro_subtitle">Un reproductor multimedia en linea gratuito y centrado en la privacidad que se ejecuta en su navegador.<br />No requiere instalacion.</p>

				<h2 data-i18n="features_heading">Caracteristicas principales</h2>
				<div class="features">
					<article class="feature">
						<h3 data-i18n="feature_1_title">100% Centrado en la privacidad</h3>
						<p data-i18n="feature_1_text">Sus archivos nunca salen de su dispositivo. Todo el procesamiento se realiza localmente en su navegador.</p>
					</article>
					<article class="feature">
						<h3 data-i18n="feature_2_title">Amplio soporte de formatos</h3>
						<p data-i18n="feature_2_text">Reproduzca MP3, FLAC, WAV, MP4 de forma segura.</p>
					</article>
					<article class="feature">
						<h3 data-i18n="feature_3_title">Subir de forma segura</h3>
						<p data-i18n="feature_3_text">Con una conexion HTTPS segura, cargue su archivo con confianza; su archivo esta protegido y se elimina automaticamente despues de un dia.</p>
					</article>
					<article class="feature">
						<h3 data-i18n="feature_4_title">Sin instalacion</h3>
						<p data-i18n="feature_4_text">Simplemente abre tu cancion y reproduzca. No se necesitan complementos ni descargas de software.</p>
					</article>
				</div>

				<h2 data-i18n="how_to_use">Como usar</h2>
				<ol class="steps">
					<li data-i18n="step_1">Arrastrar y soltar: Simplemente arrastre sus archivos de video y audio a la ventana.</li>
					<li data-i18n="step_2">Reproduccion instantanea: El reproductor comienza inmediatamente sin subir nada.</li>
					<li data-i18n="step_3">Control: Use atajos de teclado y controles en pantalla para una experiencia perfecta.</li>
				</ol>
			</div>
		</section>

		<section class="faq" id="faq">
			<div class="faq-wrap">
				<h2 data-i18n="faq_heading">Preguntas frecuentes</h2>
				<div class="faq-list">
					<article class="faq-item">
						<h3 data-i18n="faq_1_q">¿Es OnlinePlayer gratuito?</h3>
						<p data-i18n-html="faq_1_a">Si, SOBELO es <strong>100% gratuito</strong>. No hay costos ocultos, suscripciones ni limitaciones. Puede utilizar todas las funciones sin registrarse.</p>
					</article>

					<article class="faq-item">
						<h3 data-i18n="faq_2_q">¿Esta protegida mi privacidad?</h3>
						<p data-i18n-html="faq_2_a">Absolutamente. SOBELO funciona <strong>localmente en su navegador</strong>. Sus archivos de video y audio nunca se cargan en nuestros servidores, lo que garantiza que sus datos permanezcan privados y seguros en su dispositivo.</p>
					</article>

					<article class="faq-item">
						<h3 data-i18n="faq_3_q">¿Que formatos admiten?</h3>
						<p data-i18n-html="faq_3_a">Admitimos una amplia gama de formatos, incluidos <strong>MP3, FLAC, WAV, MP4</strong>. Incluso si su navegador no admite de forma nativa un formato, nuestro motor integrado le permite reproducirlo sin problemas.</p>
					</article>
				</div>
			</div>
		</section>

		<footer class="footer" id="pie">
			<div class="footer-links">
				<span data-i18n="footer_copy">(c) 2026 SOBELO. Todos los derechos reservados.</span>
				<a href="#" data-i18n="footer_privacy">Politica de privacidad</a>
				<a href="#" data-i18n="footer_terms">Terminos de Servicio</a>
				<a href="#" data-i18n="footer_github">GitHub</a>
			</div>
			<small data-i18n="footer_disclaimer">Descargo de responsabilidad: SOBELO no aloja ni almacena ningun archivo de video o audio. Todo el contenido multimedia se procesa localmente en su navegador o se transmite directamente desde su almacenamiento en la nube autorizado.</small>
		</footer>
	</main>
	<script>
		(function () {
			const langToggle = document.getElementById("langToggle");
			const themeToggle = document.getElementById("themeToggle");
			const dictionaries = {
				es: {
					skip_content: "Ir al contenido principal",
					skip_nav: "Ir a la navegacion",
					skip_footer: "Ir al pie de pagina",
					nav_home: "Inicio",
					nav_faq: "Preguntas frecuentes",
					lang_button: "Espanol",
					btn_select_files: "Seleccionar archivos multimedia",
					upload_hint: "Admite agregar archivos multimedia por lotes, arrastra archivos directamente al reproductor o haz clic para seleccionar",
					playlist_title: "≡ Lista de reproduccion",
					btn_add: "+ Agregar",
					btn_clear: "🗑 Limpiar",
					playlist_empty_title: "La lista de reproduccion esta vacia",
					playlist_empty_text: "Agregue archivos multimedia a la lista de reproduccion",
					intro_title: "SOBELO: Reproductor de Musica en Linea",
					intro_subtitle: "Un reproductor multimedia en linea gratuito y centrado en la privacidad que se ejecuta en su navegador.<br>No requiere instalacion.",
					features_heading: "Caracteristicas principales",
					feature_1_title: "100% Centrado en la privacidad",
					feature_1_text: "Sus archivos nunca salen de su dispositivo. Todo el procesamiento se realiza localmente en su navegador.",
					feature_2_title: "Amplio soporte de formatos",
					feature_2_text: "Reproduzca MP3, FLAC, WAV, MP4 de forma segura.",
					feature_3_title: "Subir de forma segura",
					feature_3_text: "Con una conexion HTTPS segura, cargue su archivo con confianza; su archivo esta protegido y se elimina automaticamente despues de un dia.",
					feature_4_title: "Sin instalacion",
					feature_4_text: "Simplemente abre tu cancion y reproduzca. No se necesitan complementos ni descargas de software.",
					how_to_use: "Como usar",
					step_1: "Arrastrar y soltar: Simplemente arrastre sus archivos de video y audio a la ventana.",
					step_2: "Reproduccion instantanea: El reproductor comienza inmediatamente sin subir nada.",
					step_3: "Control: Use atajos de teclado y controles en pantalla para una experiencia perfecta.",
					faq_heading: "Preguntas frecuentes",
					faq_1_q: "Es OnlinePlayer gratuito?",
					faq_1_a: "Si, SOBELO es <strong>100% gratuito</strong>. No hay costos ocultos, suscripciones ni limitaciones. Puede utilizar todas las funciones sin registrarse.",
					faq_2_q: "Esta protegida mi privacidad?",
					faq_2_a: "Absolutamente. SOBELO funciona <strong>localmente en su navegador</strong>. Sus archivos de video y audio nunca se cargan en nuestros servidores, lo que garantiza que sus datos permanezcan privados y seguros en su dispositivo.",
					faq_3_q: "Que formatos admiten?",
					faq_3_a: "Admitimos una amplia gama de formatos, incluidos <strong>MP3, FLAC, WAV, MP4</strong>. Incluso si su navegador no admite de forma nativa un formato, nuestro motor integrado le permite reproducirlo sin problemas.",
					footer_copy: "(c) 2026 SOBELO. Todos los derechos reservados.",
					footer_privacy: "Politica de privacidad",
					footer_terms: "Terminos de Servicio",
					footer_github: "GitHub",
					footer_disclaimer: "Descargo de responsabilidad: SOBELO no aloja ni almacena ningun archivo de video o audio. Todo el contenido multimedia se procesa localmente en su navegador o se transmite directamente desde su almacenamiento en la nube autorizado."
				},
				en: {
					skip_content: "Skip to main content",
					skip_nav: "Skip to navigation",
					skip_footer: "Skip to footer",
					nav_home: "Home",
					nav_faq: "FAQ",
					lang_button: "English",
					btn_select_files: "Select media files",
					upload_hint: "Supports batch media upload, drag files directly to the player or click to select",
					playlist_title: "≡ Playlist",
					btn_add: "+ Add",
					btn_clear: "🗑 Clear",
					playlist_empty_title: "Your playlist is empty",
					playlist_empty_text: "Add media files to the playlist",
					intro_title: "SOBELO: Online Music Player",
					intro_subtitle: "A free privacy-focused online media player that runs in your browser.<br>No installation required.",
					features_heading: "Key features",
					feature_1_title: "100% Privacy focused",
					feature_1_text: "Your files never leave your device. All processing happens locally in your browser.",
					feature_2_title: "Wide format support",
					feature_2_text: "Play MP3, FLAC, WAV, MP4 safely.",
					feature_3_title: "Secure upload",
					feature_3_text: "With secure HTTPS, upload your file confidently; your file is protected and automatically removed after one day.",
					feature_4_title: "No installation",
					feature_4_text: "Just open your song and play. No plugins or software downloads required.",
					how_to_use: "How to use",
					step_1: "Drag and drop: Simply drag your video and audio files into the window.",
					step_2: "Instant playback: The player starts immediately without uploading anything.",
					step_3: "Control: Use keyboard shortcuts and on-screen controls for a smooth experience.",
					faq_heading: "Frequently asked questions",
					faq_1_q: "Is OnlinePlayer free?",
					faq_1_a: "Yes, SOBELO is <strong>100% free</strong>. No hidden costs, subscriptions, or limits. You can use all features without registration.",
					faq_2_q: "Is my privacy protected?",
					faq_2_a: "Absolutely. SOBELO works <strong>locally in your browser</strong>. Your media files are never uploaded to our servers, keeping your data private and secure on your device.",
					faq_3_q: "Which formats are supported?",
					faq_3_a: "We support many formats including <strong>MP3, FLAC, WAV, MP4</strong>. Even if your browser does not natively support a format, our integrated engine helps play it smoothly.",
					footer_copy: "(c) 2026 SOBELO. All rights reserved.",
					footer_privacy: "Privacy policy",
					footer_terms: "Terms of Service",
					footer_github: "GitHub",
					footer_disclaimer: "Disclaimer: SOBELO does not host or store any video or audio files. All media is processed locally in your browser or streamed directly from your authorized cloud storage."
				}
			};

			function applyLanguage(language) {
				const dict = dictionaries[language] || dictionaries.es;
				document.documentElement.lang = language;
				document.querySelectorAll("[data-i18n]").forEach((node) => {
					const key = node.getAttribute("data-i18n");
					if (dict[key]) {
						node.textContent = dict[key];
					}
				});
				document.querySelectorAll("[data-i18n-html]").forEach((node) => {
					const key = node.getAttribute("data-i18n-html");
					if (dict[key]) {
						node.innerHTML = dict[key];
					}
				});
				if (langToggle) {
					langToggle.textContent = language === "es" ? "English" : "Espanol";
				}
				localStorage.setItem("lang", language);
			}

			function applyTheme(theme) {
				document.body.setAttribute("data-theme", theme);
				if (themeToggle) {
					themeToggle.textContent = theme === "dark" ? "☾" : "☀";
					themeToggle.setAttribute("aria-label", theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
				}
				localStorage.setItem("theme", theme);
			}

			const currentLang = localStorage.getItem("lang") || "es";
			const currentTheme = localStorage.getItem("theme") || "light";

			applyLanguage(currentLang);
			applyTheme(currentTheme);

			if (langToggle) {
				langToggle.addEventListener("click", () => {
					const nextLang = document.documentElement.lang === "es" ? "en" : "es";
					applyLanguage(nextLang);
				});
			}

			if (themeToggle) {
				themeToggle.addEventListener("click", () => {
					const nextTheme = document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
					applyTheme(nextTheme);
				});
			}
		})();
	</script>
</body>
</html>
