// Eunomi · Modo en vivo del club de restaurantes (FPR).
// Conecta la demo a una base de datos de demostración (Supabase, proyecto "Restaurants", solo prototipos).
// Datos mínimos: solo un apodo. Cada sesión se borra sola a las 24 h.
// Flujo principal (cobra el garzón): QR de la mesa → unirse → el cliente declara su boleta → el local la valida → canje.
(() => {
  "use strict";
  // Valores públicos por diseño (van en la página). Nunca poner aquí claves secretas.
  const LIVE = {
    url: "https://govlzzxygqgrsqxeqtho.supabase.co",
    key: "sb_publishable_O-_6rG4DG0sAzxERyk8pYQ_DJGx0IHt",
  };
  const D = window.__demo;
  if (!D) return;
  const enabled = Boolean(LIVE.url && LIVE.key);
  const slug =
    (location.pathname.replace(/\/(index\.html)?$/, "").split("/").pop() || "demo")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "") || "demo";
  const params = new URLSearchParams(location.search);
  const sessionFromUrl = (params.get("s") || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const store = {
    get(k) {
      try {
        return JSON.parse(localStorage.getItem(k) || "null");
      } catch {
        return null;
      }
    },
    set(k, v) {
      try {
        v == null ? localStorage.removeItem(k) : localStorage.setItem(k, JSON.stringify(v));
      } catch {}
    },
  };
  const ADMIN_KEY = "eunomi-live-admin-" + slug;
  const memberKey = (code) => "eunomi-live-miembro-" + code;
  const { esc, money, num, CFG, rewards } = D;
  const carta = CFG.carta || null;
  // Los prototipos de cada restaurante muestran solo el modo en vivo; la demo estándar conserva la simulación.
  const liveOnly = CFG.soloEnVivo !== false && slug !== "restaurantes" && slug !== "demo";

  const MESSAGES = {
    SESION_NO_EXISTE: "Esta demo en vivo ya terminó o el código no existe.",
    MIEMBRO_NO_EXISTE: "No encontramos a ese cliente en esta demo.",
    NO_AUTORIZADO: "Este dispositivo no administra esta demo.",
    APODO_INVALIDO: "Escribe un nombre o apodo de hasta 30 letras.",
    SESION_LLENA: "Esta demo ya tiene demasiados participantes.",
    MONTO_INVALIDO: "Revisa el monto: entre $100 y $1.000.000.",
    FOLIO_INVALIDO: "Escribe el número de tu boleta.",
    BOLETA_REPETIDA: "Esa boleta ya fue enviada. Cada boleta suma una sola vez.",
    DEMASIADAS_PENDIENTES: "Tienes varias boletas en revisión. Espera a que el local las revise.",
    BOLETA_NO_EXISTE: "No encontramos esa boleta.",
    BOLETA_YA_REVISADA: "Esa boleta ya fue revisada.",
    YA_HAY_PENDIENTE: "Ya tienes un canje pendiente.",
    SALDO_INSUFICIENTE: "No alcanzan los puntos para este premio.",
    CANJE_NO_EXISTE: "Código no encontrado.",
    CANJE_YA_USADO: "Este código ya fue utilizado. No puede canjearse otra vez.",
    CANJE_ANULADO: "El cliente canceló esta solicitud.",
    MESA_INVALIDA: "Revisa cuántas personas vinieron.",
    ORIGEN_INVALIDO: "Elige una opción válida.",
    BOLETA_NO_ANULABLE: "Esa boleta ya no se puede anular.",
    PIN_FORMATO: "El PIN debe tener de 4 a 6 números.",
    PIN_BLOQUEADO: "Demasiados intentos. Espera 10 minutos.",
    NEGOCIO_INVALIDO: "Restaurante no válido.",
    DEMASIADAS_SESIONES: "Se crearon demasiadas demos en la última hora. Intenta más tarde.",
  };
  async function rpc(fn, args) {
    const headers = { "Content-Type": "application/json", apikey: LIVE.key };
    if (LIVE.key.startsWith("eyJ")) headers.Authorization = "Bearer " + LIVE.key;
    let res;
    try {
      res = await fetch(LIVE.url.replace(/\/$/, "") + "/rest/v1/rpc/" + fn, {
        method: "POST",
        headers,
        body: JSON.stringify(args),
      });
    } catch {
      throw new Error("Sin conexión. Revisa internet e intenta de nuevo.");
    }
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const code = (data && data.message) || "";
      throw new Error(MESSAGES[code] || "No se pudo completar. Intenta de nuevo.");
    }
    return data;
  }
  const uid = () =>
    crypto.randomUUID ? crypto.randomUUID() : Date.now() + "-" + Math.random().toString(16).slice(2);
  const time = (t) => new Date(t).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
  const joinUrl = (code) => location.origin + location.pathname + "?s=" + code;

  // Contenedor propio: la demo simulada sigue intacta en #app.
  const app = document.getElementById("app");
  const box = document.createElement("main");
  box.id = "live";
  box.hidden = true;
  app.after(box);
  const style = document.createElement("style");
  style.textContent = `#live{max-width:1100px;margin:28px auto;padding:0 24px}.live-client .presenter,.live-client #app{display:none}.live-head{display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin-bottom:6px}.live-head h1{margin:6px 0}.live-dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:#1f9d55;margin-right:6px;box-shadow:0 0 0 3px #1f9d5533}.live-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:12px}.live-grid h2{display:flex;align-items:center;gap:10px}.live-step{display:inline-grid;place-items:center;width:28px;height:28px;border-radius:50%;background:var(--green);color:#fff;font:600 14px system-ui,sans-serif;flex-shrink:0}.live-qr{width:190px;max-width:62%;margin:6px auto;color:#111}.live-qr svg{display:block;width:100%;height:auto}.live-err{color:#9b2c1f;font-size:14px;min-height:1px}.live-ok{color:#1f6b3a;font-size:14px}.live-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 0;border-bottom:1px solid #e4e0d8}.live-row:last-child{border:0}.live-row small{display:block;color:var(--muted)}.live-row .acts{display:flex;gap:6px}.live-row .acts button{min-height:40px;padding:8px 12px}.live-stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:10px 0}.live-stats div{background:#0000000a;border-radius:12px;padding:12px}.live-stats strong{display:block;font-size:26px}.live-stats small{color:var(--muted)}.member-pick{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}.member-pick button{min-height:40px;padding:8px 12px}.live-code{font-size:44px;letter-spacing:8px;text-align:center;border:1px dashed #9fb0cf;border-radius:14px;padding:18px 0;margin:16px 0}.live-big{display:grid;gap:10px;margin:18px 0}.live-big button{min-height:54px;font-size:17px}.live-pending{background:#fff6e0;border-radius:12px;padding:12px 14px;margin:10px 0;font-size:14px}.live-idea{display:inline-block;background:#fff1c9;color:#6b4a00;border-radius:20px;padding:4px 10px;font:600 12px system-ui,sans-serif}.carta-sec h3{margin:18px 0 6px}.carta-sec li{padding:6px 0;border-bottom:1px dotted #d8d0c4;list-style:none}.carta-sec ul{padding:0;margin:0}.live-more summary{cursor:pointer;color:var(--muted);min-height:36px}.live-opt{border:1px solid #0000001a;border-radius:12px;padding:10px 12px;margin:14px 0}.live-opt legend{font-size:14px;padding:0 4px}.live-chip{display:inline-flex;align-items:center;gap:6px;margin:6px 10px 2px 0;font-size:15px}.live-count{display:grid;grid-template-columns:1fr 44px 36px 44px;align-items:center;gap:6px;margin:6px 0}.live-count button{min-height:40px;padding:0;font-size:20px}.live-count output{text-align:center;font-size:18px;font-weight:600}.live-insights ul{margin:10px 0 0;padding-left:18px}.live-insights li{margin:6px 0;line-height:1.45}.live-only .presenter,.live-only #app{display:none}.live-sub{font-size:15px;margin:16px 0 4px;display:flex;align-items:center;gap:8px}.live-flag{background:#fff6e0;border-radius:10px;padding:10px;border-bottom:0;margin:6px 0}.live-motivo{color:#8a5a00!important;font-weight:600}.live-mini{min-height:36px;padding:6px 10px;font-size:13px}@media(max-width:760px){#live{padding:0 12px;margin:18px auto}.live-grid{grid-template-columns:1fr}}`;
  document.head.append(style);

  let timer = null;
  const poll = (fn) => {
    clearInterval(timer);
    fn();
    timer = setInterval(() => {
      if (!document.hidden) fn();
    }, 3000);
  };

  function cartaHtml(backTo) {
    if (!carta) return "";
    const secs = carta.secciones
      .map(
        (s) =>
          `<div class="carta-sec"><h3>${esc(s.titulo)}</h3><ul>${s.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>`,
      )
      .join("");
    return `<section><button data-live="${backTo}">← Volver</button><p class="stack"><span class="live-idea">Idea · carta en el mismo QR</span></p><h1>Nuestra carta</h1><p class="muted">${esc(carta.nota || "Contenido de ejemplo, sin precios.")}</p>${secs}<div class="live-big"><button class="primary" data-live="${backTo === "home" ? "join" : "wallet"}">${backTo === "home" ? "Unirme al club" : "Volver a mi club"}</button></div></section>`;
  }

  // ---------------- Vista del cliente (entra por el QR de la mesa) ----------------
  function clientView(code) {
    document.body.classList.add("live-client");
    box.hidden = false;
    let me = store.get(memberKey(code));
    let state = null;
    let boletas = [];
    let error = "";
    let screen = me ? "wallet" : "home";
    let flash = "";
    const phone = (body) => D.phone(body);
    function draw() {
      if (!enabled) {
        box.innerHTML = phone(`<section><h1>Demo en vivo no disponible.</h1><p>Pide al presentador que revise la conexión.</p></section>`);
        return;
      }
      const err = `<p class="live-err" role="alert">${esc(error)}</p>`;
      if (screen === "carta") return (box.innerHTML = phone(cartaHtml(me ? "wallet" : "home")));
      if (!me) {
        if (screen === "join")
          return (box.innerHTML = phone(
            `<section><button data-live="home">← Volver</button><h1>Únete al ${esc(CFG.clubName)}.</h1><p>Solo tu nombre o un apodo.</p><form id="liveJoin"><label>Nombre o apodo<input name="apodo" maxlength="30" required autocomplete="off" placeholder="Ej. Pedro"></label><fieldset class="live-opt"><legend>¿Vives aquí o estás de visita? <small>(opcional)</small></legend><label class="live-chip"><input type="radio" name="origen" value="local"><span>Vivo en la zona</span></label><label class="live-chip"><input type="radio" name="origen" value="visita"><span>Estoy de visita</span></label></fieldset><label><input type="checkbox" name="ok" required>Acepto unirme al club (demo).</label><button class="primary full">Unirme</button></form>${err}<p class="total-note">Es una demostración: no pedimos correo ni teléfono.</p></section>`,
          ));
        return (box.innerHTML = phone(
          `<div class="ocean"><span>${CFG.heroTag || ""}</span></div><section><div class="eyebrow">Bienvenido a ${esc(CFG.shortName)}</div><h1>¿Qué quieres hacer?</h1><div class="live-big">${carta ? `<button data-live="carta">Ver la carta</button>` : ""}<button class="primary" data-live="join">Unirme al club y sumar puntos</button></div>${err}</section>`,
        ));
      }
      if (!state) return (box.innerHTML = phone(`<section><p>Cargando…</p>${err}</section>`));
      if (screen === "history") {
        const rows = state.movimientos
          .map(
            (m) =>
              `<div class="live-row"><div>${m.tipo === "suma" ? "Compra de " + money(m.monto) : m.tipo === "bono" ? "Por contarnos tu mesa" : m.tipo === "correccion" ? "Boleta anulada por el local" : esc(m.beneficio || "Canje")}<small>${time(m.creado)}</small></div><strong>${m.puntos > 0 ? "+" : "−"}${num(Math.abs(m.puntos))}</strong></div>`,
          )
          .join("");
        return (box.innerHTML = phone(
          `<section><button data-live="wallet">← Mi club</button><h1>Mis movimientos</h1>${rows || "<p>Aquí aparecerán tus compras y premios.</p>"}</section>`,
        ));
      }
      if (screen === "boleta")
        return (box.innerHTML = phone(
          `<section><button data-live="wallet">← Mi club</button><h1>Suma tu compra</h1><p>Copia estos dos datos de tu boleta.</p><form id="liveBoleta"><label>Número de boleta<input name="folio" maxlength="20" required autocomplete="off" inputmode="text" placeholder="Ej. 12345"></label><label>Total pagado, sin propina<input name="monto" type="number" min="100" max="1000000" step="1" required placeholder="Ej. 25000"></label><fieldset class="live-opt"><legend>¿Con quién nos visitaste hoy? <small>(opcional · +50 puntos)</small></legend>${[["adultos", "Adultos"], ["ninos", "Niños"], ["mayores", "Adultos mayores"]].map(([k, t]) => `<div class="live-count"><span>${t}</span><button type="button" data-cnt="${k}" data-d="-1" aria-label="Menos ${t}">−</button><output id="cnt-${k}">0</output><button type="button" data-cnt="${k}" data-d="1" aria-label="Más ${t}">+</button><input type="hidden" name="${k}" value="0"></div>`).join("")}<small class="muted">Cuéntate tú también. Solo contamos cuántos eran, para mejorar la atención; no guardamos datos de tus acompañantes.</small></fieldset><button class="primary full">Enviar</button></form>${err}<p class="total-note">El local la revisa y tus puntos aparecen aquí. El garzón no tiene que hacer nada.</p></section>`,
        ));
      if (state.pendiente)
        return (box.innerHTML = phone(
          `<section class="success"><span class="pill">Muestra este código</span><h1>${esc(state.pendiente.beneficio)}</h1><div class="live-code">${esc(state.pendiente.codigo)}</div><p>Los puntos se descuentan cuando el local lo confirma.</p><button class="full" data-live="cancel">Cancelar</button>${err}</section>`,
        ));
      const enRevision = boletas.filter((b) => b.estado === "pendiente");
      const rechazadas = boletas.filter((b) => b.estado === "rechazada" || b.estado === "anulada").slice(0, 1);
      const cards = rewards
        .map((r) => {
          const ok = state.saldo >= r.points;
          return `<article class="reward"><div class="reward-art">${r.art}</div><div class="reward-body"><span class="eyebrow">${r.kind}</span><h3>${r.name}</h3><div class="row"><strong>${num(r.points)} puntos</strong><span class="pill">${ok ? "Te alcanza" : "Te faltan " + num(r.points - state.saldo)}</span></div><div class="track"><span style="width:${Math.min(100, (state.saldo / r.points) * 100)}%"></span></div><button class="full${ok ? " primary" : ""}" data-live-redeem="${r.id}" ${ok ? "" : "disabled"}>${ok ? "Canjear" : "Aún no alcanza"}</button></div></article>`;
        })
        .join("");
      box.innerHTML = phone(
        `<section><div class="row"><span>Hola, ${esc(state.apodo)}</span><button data-live="history">Movimientos</button></div>${flash ? `<p class="live-ok" role="status">${flash}</p>` : ""}<div class="balance stack"><small>TUS PUNTOS</small><strong>${num(state.saldo)}</strong><p>Cada $100 = 1 punto</p></div>${enRevision.map((b) => `<div class="live-pending">⏳ Boleta ${esc(b.folio)} · ${money(b.monto)} en revisión${b.motivo ? " · " + esc(b.motivo.toLowerCase()) : ""} (+${num(Math.floor(b.monto / 100) + (b.mesa ? 50 : 0))} pts${b.mesa ? " con tu mesa" : ""})</div>`).join("")}${rechazadas.map((b) => `<div class="live-pending">La boleta ${esc(b.folio)} ${b.estado === "anulada" ? "fue anulada" : "no fue aceptada"} por el local.</div>`).join("")}<div class="live-big"><button class="primary" data-live="boleta">Sumar mi compra</button>${carta ? `<button data-live="carta">Ver la carta</button>` : ""}</div>${err}<h2 class="stack">Tus premios</h2>${cards}<p class="total-note">Demo en vivo. Premios de ejemplo.</p></section>`,
      );
    }
    let lastSaldo = null;
    async function refresh() {
      if (!me || !enabled) {
        if (screen !== "join" && screen !== "boleta") draw();
        return;
      }
      try {
        const [st, bs] = await Promise.all([
          rpc("demo_estado_miembro", { p_token: me.token }),
          rpc("demo_boletas_miembro", { p_token: me.token }),
        ]);
        if (lastSaldo != null && st.saldo > lastSaldo) flash = `¡Sumaste ${num(st.saldo - lastSaldo)} puntos!`;
        lastSaldo = st.saldo;
        state = st;
        boletas = bs;
        error = "";
      } catch (e) {
        error = e.message;
        if (/terminó|No encontramos/.test(e.message)) {
          store.set(memberKey(code), null);
          me = null;
          state = null;
          screen = "home";
        }
      }
      // No redibujar mientras el cliente escribe en un formulario.
      if (screen === "boleta" || screen === "join") return;
      draw();
    }
    box.addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      try {
        if (e.target.id === "liveJoin") {
          const r = await rpc("demo_unirse", { p_sesion: code, p_apodo: String(f.get("apodo")).trim() });
          me = { token: r.token };
          store.set(memberKey(code), me);
          const origen = f.get("origen");
          if (origen) rpc("demo_definir_origen", { p_token: me.token, p_origen: String(origen) }).catch(() => {});
          screen = "wallet";
        } else if (e.target.id === "liveBoleta") {
          const cnt = (k) => Math.max(0, Math.min(30, Number(f.get(k)) || 0));
          const res = await rpc("demo_declarar_boleta_v2", {
            p_token: me.token,
            p_folio: String(f.get("folio")).trim(),
            p_monto: Math.round(Number(f.get("monto"))),
            p_adultos: cnt("adultos"),
            p_ninos: cnt("ninos"),
            p_mayores: cnt("mayores"),
          });
          screen = "wallet";
          flash =
            res.estado === "validada"
              ? `¡Listo! Sumaste ${num(res.puntos)} puntos.`
              : `Tu boleta quedó en revisión (${esc((res.motivo || "").toLowerCase())}). El local la revisará pronto.`;
        } else return;
        error = "";
      } catch (err) {
        error = err.message;
        return draw();
      }
      refresh();
      draw();
    });
    box.addEventListener("click", async (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.cnt) {
        const inp = box.querySelector(`input[name=${b.dataset.cnt}]`);
        const out = box.querySelector(`#cnt-${b.dataset.cnt}`);
        const v = Math.max(0, Math.min(30, (Number(inp.value) || 0) + Number(b.dataset.d)));
        inp.value = String(v);
        out.textContent = String(v);
        return;
      }
      try {
        const a = b.dataset.live;
        if (["home", "join", "carta", "wallet", "history", "boleta"].includes(a)) {
          screen = a;
          flash = a === "wallet" ? flash : "";
          error = "";
          return draw();
        } else if (a === "cancel") await rpc("demo_cancelar_canje", { p_token: me.token });
        else if (b.dataset.liveRedeem) {
          const r = rewards.find((x) => x.id === b.dataset.liveRedeem);
          await rpc("demo_solicitar_canje", { p_token: me.token, p_beneficio: r.name, p_puntos: r.points });
          flash = "";
        } else return;
        error = "";
      } catch (err) {
        error = err.message;
      }
      refresh();
    });
    draw();
    poll(refresh);
  }

  // ---------------- Panel del local (dueño / encargado) ----------------
  let admin = store.get(ADMIN_KEY);
  let adminState = null;
  let adminBoletas = [];
  let adminInsights = null;
  let selectedMember = null;
  let checked = null;
  let codeMsg = "";
  let confirmReset = false;

  function qrSvg(text) {
    if (!window.qrcode) return "";
    const q = window.qrcode(0, "M");
    q.addData(text);
    q.make();
    return q.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
  }
  function loadQrLib() {
    return new Promise((ok) => {
      if (window.qrcode) return ok();
      const s = document.createElement("script");
      s.src = "/demo/restaurantes/qrcode.min.js";
      s.onload = ok;
      s.onerror = ok;
      document.head.append(s);
    });
  }
  function drawAdminShell() {
    const url = joinUrl(admin.codigo);
    box.innerHTML = `<div class="live-head"><div><div class="eyebrow">${esc(CFG.shortName)} · Demo en vivo</div><h1>El club, funcionando.</h1></div><div class="member-pick"><span class="pill"><span class="live-dot"></span>Sesión ${esc(admin.codigo)}</span><button data-live="new">${confirmReset ? "¿Borrar compras, boletas y canjes? Toca otra vez" : "Reiniciar demo"}</button>${liveOnly ? "" : '<button data-live="exit">Salir</button>'}<button data-live="lock" title="Olvidar el acceso en este dispositivo">Cerrar panel aquí</button></div></div>
      <p class="live-err" role="alert" id="liveTop"></p>
      <div class="live-grid">
        <section class="box" style="text-align:center"><h2><span class="live-step">1</span>QR de la mesa</h2><div class="live-qr">${qrSvg(url)}</div><p class="muted">El cliente lo escanea con su celular, ve la carta y se une al club.</p></section>
        <section class="box"><h2><span class="live-step">2</span>Compras del club</h2><p class="muted">Las boletas suman solas. Solo revisas las que tienen algo raro.</p><div id="liveBoletas"></div></section>
        <section class="box"><h2><span class="live-step">3</span>Entregar un premio</h2><form id="liveLookup"><label>Código que muestra el cliente<input name="codigo" inputmode="numeric" maxlength="6" required autocomplete="off" placeholder="Ej. 482"></label><button class="primary full">Revisar código</button></form><div id="liveCheck" aria-live="polite"></div></section>
        <section class="box"><h2>Lo que aprendes de tus clientes</h2><div id="liveStats" class="live-stats"></div><div id="liveInsights" class="live-insights"></div><p class="total-note">Datos de esta demo. Con el club funcionando, verías esto por semana y por temporada.</p></section>
      </div>
      <details class="live-more box" style="margin-top:16px"><summary>Otra forma: si cobra un cajero</summary><p class="muted">El cajero elige al cliente y escribe el monto. Sirve solo si quien cobra no es el garzón.</p><div id="livePick" class="member-pick"></div><form id="liveSale"><label>Monto pagado, sin propina<input name="monto" type="number" min="100" max="1000000" step="1" value="25000" required></label><button class="full">Sumar puntos</button></form><p id="liveSaleMsg" role="status"></p></details>`;
    drawAdminData();
    drawCheck();
  }
  function mesaTxt(b) {
    const parts = [];
    if (b.adultos) parts.push(b.adultos + (b.adultos === 1 ? " adulto" : " adultos"));
    if (b.ninos) parts.push(b.ninos + (b.ninos === 1 ? " niño" : " niños"));
    if (b.mayores) parts.push(b.mayores + (b.mayores === 1 ? " adulto mayor" : " adultos mayores"));
    return parts.join(" · ");
  }
  const pct = (a, b) => (b ? Math.round((a / b) * 100) + "%" : "—");
  function insightsHtml(i) {
    if (!i) return "";
    const rows = [];
    if (i.mesas) {
      rows.push(`<li><strong>${pct(i.con_ninos, i.mesas)}</strong> de las mesas vino con niños${i.con_mayores ? ` y <strong>${pct(i.con_mayores, i.mesas)}</strong> con adultos mayores` : ""}.</li>`);
      rows.push(`<li>En promedio, <strong>${String(i.personas_prom).replace(".", ",")} personas</strong> por mesa y <strong>${money(i.gasto_persona)}</strong> de gasto por persona.</li>`);
      if (i.gasto_persona_ninos && i.gasto_persona_sin_ninos)
        rows.push(`<li>Mesas con niños: <strong>${money(i.gasto_persona_ninos)}</strong> por persona · sin niños: <strong>${money(i.gasto_persona_sin_ninos)}</strong>.</li>`);
    }
    const conOrigen = i.locales + i.visitas;
    if (conOrigen) rows.push(`<li><strong>${pct(i.visitas, conOrigen)}</strong> están de visita y <strong>${pct(i.locales, conOrigen)}</strong> viven en la zona.</li>`);
    if (i.con_compra) rows.push(`<li><strong>${pct(i.volvieron, i.con_compra)}</strong> de los clientes con compras ya volvió (2 o más compras).</li>`);
    return rows.length
      ? `<ul>${rows.join("")}</ul>`
      : '<p class="muted">Cuando los clientes cuenten con quién vinieron y de dónde son, aquí verás a tu clientela en frases simples.</p>';
  }
  function drawAdminData() {
    const bl = document.getElementById("liveBoletas");
    const st = document.getElementById("liveStats");
    const pick = document.getElementById("livePick");
    if (!bl || !adminState) return;
    if (bl.querySelector("[data-confirm='1']")) return;
    const pend = adminBoletas.filter((b) => b.estado === "pendiente");
    const done = adminBoletas.filter((b) => b.estado !== "pendiente").slice(0, 5);
    const ctx = (b) =>
      `<strong>${esc(b.apodo)}</strong> · ${b.compras ? b.compras + (b.compras === 1 ? " compra" : " compras") + " en el club" : "cliente nuevo"}<small>Boleta ${esc(b.folio)} · ${money(b.monto)} · ${time(b.creado)}</small>${b.adultos != null ? `<small>Mesa: ${mesaTxt(b)}</small>` : ""}`;
    const estado = { validada: "Sumada", rechazada: "Rechazada", anulada: "Anulada" };
    bl.innerHTML =
      `<h3 class="live-sub">Para revisar ${pend.length ? `<span class="pill">${pend.length}</span>` : ""}</h3>` +
      (pend.length
        ? pend
            .map(
              (b) =>
                `<div class="live-row live-flag"><div>${ctx(b)}<small class="live-motivo">⚠ ${esc(b.motivo || "Revisar")}</small></div><div class="acts"><button class="primary" data-ok="${b.id}">Aceptar</button><button data-no="${b.id}">Anular</button></div></div>`,
            )
            .join("")
        : '<p class="muted">Nada que revisar. 👍</p>') +
      `<h3 class="live-sub">Sumadas automáticamente</h3>` +
      (done.length
        ? done
            .map(
              (b) =>
                `<div class="live-row"><div>${ctx(b)}</div>${b.estado === "validada" ? `<button class="live-mini" data-anular="${b.id}">Anular</button>` : `<span class="pill">${estado[b.estado]}</span>`}</div>`,
            )
            .join("")
        : '<p class="muted">Cuando un cliente sume su compra, aparece aquí.</p>');
    const ms = adminState.miembros;
    const consumo = adminState.ventas.reduce((s, v) => s + (v.monto || 0), 0);
    const premios = adminState.canjes.filter((c) => c.estado === "confirmado").length;
    st.innerHTML = `<div><small>Clientes en el club</small><strong>${ms.length}</strong></div><div><small>Compras sumadas</small><strong>${adminState.ventas.length}</strong></div><div><small>Consumo registrado</small><strong>${money(consumo)}</strong></div><div><small>Premios entregados</small><strong>${premios}</strong></div>`;
    const ins = document.getElementById("liveInsights");
    if (ins) ins.innerHTML = insightsHtml(adminInsights);
    if (pick) {
      if (selectedMember && !ms.some((m) => m.numero === selectedMember)) selectedMember = null;
      if (!selectedMember && ms.length === 1) selectedMember = ms[0].numero;
      pick.innerHTML = ms.length
        ? ms
            .map(
              (m) =>
                `<button data-live-member="${m.numero}" aria-pressed="${selectedMember === m.numero}">${esc(m.apodo)} · ${num(m.saldo)} pts</button>`,
            )
            .join("")
        : '<p class="muted">Aún no hay clientes.</p>';
    }
  }
  function drawCheck() {
    const el = document.getElementById("liveCheck");
    if (!el) return;
    if (!checked) {
      el.innerHTML = codeMsg ? `<p role="alert" class="live-err">${esc(codeMsg)}</p>` : "";
      return;
    }
    el.innerHTML =
      checked.estado === "pendiente"
        ? `<div class="conditions stack"><h3>${esc(checked.beneficio)}</h3><p>${esc(checked.apodo)} · ${num(checked.puntos)} puntos</p><button class="primary full" data-live="confirm">Entregar premio</button></div>`
        : `<p role="alert" class="${checked.estado === "confirmado" && checked.recien ? "live-ok" : "live-err"}">${checked.estado === "confirmado" ? (checked.recien ? "Listo: " + esc(checked.beneficio) + " entregado a " + esc(checked.apodo) + "." : "Este código ya fue utilizado.") : "El cliente canceló esta solicitud."}</p>`;
  }
  async function refreshAdmin() {
    if (!admin) return;
    const top = document.getElementById("liveTop");
    try {
      const [st, bs, ins] = await Promise.all([
        rpc("demo_estado_admin", { p_sesion: admin.codigo, p_clave: admin.clave }),
        rpc("demo_boletas_admin", { p_sesion: admin.codigo, p_clave: admin.clave }),
        rpc("demo_insights", { p_sesion: admin.codigo, p_clave: admin.clave }).catch(() => null),
      ]);
      adminState = st;
      adminBoletas = bs;
      adminInsights = ins;
      if (top && top.className !== "live-ok") top.textContent = "";
    } catch (e) {
      if (/terminó|no administra/.test(e.message)) {
        store.set(ADMIN_KEY, null);
        admin = null;
        return drawPin("Vuelve a ingresar el PIN.");
      }
      if (top) {
        top.className = "live-err";
        top.textContent = e.message;
      }
    }
    drawAdminData();
  }
  function resetAdminView() {
    adminState = { miembros: [], ventas: [], canjes: [] };
    adminBoletas = [];
    selectedMember = null;
    checked = null;
    codeMsg = "";
  }
  // ¿Este dispositivo ya tiene acceso al panel? (se pide el PIN una vez por dispositivo)
  async function hasAccess() {
    if (!admin) return false;
    try {
      await rpc("demo_estado_admin", { p_sesion: admin.codigo, p_clave: admin.clave });
      return true;
    } catch {
      store.set(ADMIN_KEY, null);
      admin = null;
      return false;
    }
  }
  function showLiveBox() {
    app.hidden = true;
    box.hidden = false;
    document.querySelectorAll(".presenter [data-role]").forEach((b) => b.setAttribute("aria-pressed", "false"));
    liveBtn.setAttribute("aria-pressed", "true");
  }
  async function drawPin(msg) {
    clearInterval(timer);
    let nuevo = false;
    try {
      nuevo = !(await rpc("demo_tiene_pin", { p_negocio: slug.slice(0, 40) || "demo" })).tiene_pin;
    } catch (e) {
      msg = e.message;
    }
    showLiveBox();
    box.innerHTML = `<section class="box" style="max-width:420px;margin:0 auto"><div class="eyebrow">${esc(CFG.shortName)} · Panel del local</div><h1>${nuevo ? "Crea un PIN" : "Ingresa el PIN"}</h1><p class="muted">${nuevo ? "Elige 4 a 6 números. Se pedirá una vez en cada celular o computador que abra este panel." : "Solo el local puede validar boletas y entregar premios."}</p><form id="livePin" data-nuevo="${nuevo ? 1 : 0}"><label>PIN<input name="pin" type="password" inputmode="numeric" pattern="[0-9]{4,6}" minlength="4" maxlength="6" required autocomplete="off"></label>${nuevo ? '<label>Repite el PIN<input name="pin2" type="password" inputmode="numeric" pattern="[0-9]{4,6}" minlength="4" maxlength="6" required autocomplete="off"></label>' : ""}<button class="primary full">${nuevo ? "Crear PIN y abrir" : "Abrir panel"}</button></form><p class="live-err" role="alert">${esc(msg || "")}</p>${liveOnly ? "" : '<button data-live="exit">Volver a la demo</button>'}</section>`;
    const inp = box.querySelector("input[name=pin]");
    if (inp) inp.focus();
  }
  async function startAdmin() {
    if (!enabled) {
      const n = document.getElementById("notice");
      if (n) n.textContent = "El modo en vivo aún no está conectado a la base de datos.";
      return;
    }
    await loadQrLib();
    if (!(await hasAccess())) return drawPin("");
    openPanel();
  }
  function openPanel() {
    confirmReset = false;
    showLiveBox();
    drawAdminShell();
    poll(refreshAdmin);
  }
  function exitAdmin() {
    clearInterval(timer);
    box.hidden = true;
    app.hidden = false;
    liveBtn.setAttribute("aria-pressed", "false");
    D.render();
  }
  box.addEventListener("click", async (e) => {
    if (document.body.classList.contains("live-client")) return;
    const b = e.target.closest("button");
    if (!b) return;
    try {
      if (b.dataset.liveMember) {
        selectedMember = Number(b.dataset.liveMember);
        return drawAdminData();
      }
      if (b.dataset.live === "exit") return exitAdmin();
      if (b.dataset.live === "lock") {
        store.set(ADMIN_KEY, null);
        admin = null;
        return liveOnly ? drawPin("Panel cerrado en este dispositivo.") : exitAdmin();
      }
      if (b.dataset.live === "new") {
        if (!confirmReset) {
          confirmReset = true;
          b.textContent = "¿Borrar compras, boletas y canjes? Toca otra vez";
          setTimeout(() => {
            confirmReset = false;
            if (b.isConnected) b.textContent = "Reiniciar demo";
          }, 5000);
          return;
        }
        confirmReset = false;
        await rpc("demo_reiniciar", { p_sesion: admin.codigo, p_clave: admin.clave });
        checked = null;
        codeMsg = "";
        drawAdminShell();
        const top = document.getElementById("liveTop");
        if (top) {
          top.className = "live-ok";
          top.textContent = "Demo reiniciada. Los clientes siguen registrados con 0 puntos y el QR es el mismo.";
        }
        return refreshAdmin();
      }
      if (b.dataset.anular) {
        if (b.dataset.confirm !== "1") {
          b.dataset.confirm = "1";
          b.textContent = "¿Anular? Toca otra vez";
          setTimeout(() => {
            if (b.isConnected) {
              b.dataset.confirm = "";
              b.textContent = "Anular";
            }
          }, 4000);
          return;
        }
        b.disabled = true;
        await rpc("demo_anular_boleta", { p_sesion: admin.codigo, p_clave: admin.clave, p_id: b.dataset.anular });
        return refreshAdmin();
      }
      if (b.dataset.ok || b.dataset.no) {
        b.disabled = true;
        await rpc("demo_revisar_boleta", {
          p_sesion: admin.codigo,
          p_clave: admin.clave,
          p_id: b.dataset.ok || b.dataset.no,
          p_valida: Boolean(b.dataset.ok),
        });
        return refreshAdmin();
      }
      if (b.dataset.live === "confirm" && checked) {
        b.disabled = true;
        await rpc("demo_confirmar_canje", { p_sesion: admin.codigo, p_clave: admin.clave, p_codigo: checked.codigo });
        checked = { ...checked, estado: "confirmado", recien: true };
        codeMsg = "";
        drawCheck();
        return refreshAdmin();
      }
    } catch (err) {
      const top = document.getElementById("liveTop");
      if (top) top.textContent = err.message;
      if (b.dataset.live === "confirm") {
        checked = null;
        codeMsg = err.message;
        drawCheck();
      }
      refreshAdmin();
    }
  });
  box.addEventListener("submit", async (e) => {
    if (document.body.classList.contains("live-client")) return;
    e.preventDefault();
    const btn = e.target.querySelector("button");
    if (e.target.id === "livePin") {
      const f = new FormData(e.target);
      const pin = String(f.get("pin") || "").trim();
      if (e.target.dataset.nuevo === "1" && pin !== String(f.get("pin2") || "").trim()) return drawPin("Los PIN no coinciden.");
      btn.disabled = true;
      try {
        const r = await rpc("demo_abrir_panel", { p_negocio: slug.slice(0, 40) || "demo", p_pin: pin });
        if (!r.ok) return drawPin("PIN incorrecto.");
        resetAdminView();
        admin = { codigo: r.codigo, clave: r.clave };
        store.set(ADMIN_KEY, admin);
        return openPanel();
      } catch (err) {
        return drawPin(err.message);
      }
    }
    if (e.target.id === "liveSale") {
      const msg = document.getElementById("liveSaleMsg");
      if (!selectedMember) {
        msg.innerHTML = '<span class="live-err">Primero elige al cliente.</span>';
        return;
      }
      const monto = Math.round(Number(new FormData(e.target).get("monto")));
      btn.disabled = true;
      try {
        const r = await rpc("demo_registrar_venta", {
          p_sesion: admin.codigo,
          p_clave: admin.clave,
          p_numero: selectedMember,
          p_monto: monto,
          p_idem: uid(),
        });
        msg.innerHTML = `<span class="live-ok">+${num(r.puntos)} puntos para ${esc(r.apodo)}.</span>`;
      } catch (err) {
        msg.innerHTML = `<span class="live-err">${esc(err.message)}</span>`;
      }
      btn.disabled = false;
      refreshAdmin();
    } else if (e.target.id === "liveLookup") {
      const codigo = String(new FormData(e.target).get("codigo")).trim();
      btn.disabled = true;
      try {
        checked = await rpc("demo_consultar_canje", { p_sesion: admin.codigo, p_clave: admin.clave, p_codigo: codigo });
        codeMsg = "";
      } catch (err) {
        checked = null;
        codeMsg = err.message;
      }
      btn.disabled = false;
      drawCheck();
    }
  });

  // Botón "En vivo" en la barra del presentador.
  const nav = document.querySelector(".presenter nav");
  const liveBtn = document.createElement("button");
  liveBtn.textContent = "En vivo";
  liveBtn.title = "Mostrar el club funcionando con el celular del cliente";
  liveBtn.addEventListener("click", () => startAdmin());
  if (nav) nav.append(liveBtn);
  window.__demoLive = () => startAdmin();
  document.querySelectorAll(".presenter [data-role], .presenter [data-action=reset]").forEach((b) =>
    b.addEventListener("click", () => {
      if (!box.hidden) {
        clearInterval(timer);
        box.hidden = true;
        app.hidden = false;
        liveBtn.setAttribute("aria-pressed", "false");
      }
    }),
  );

  if (sessionFromUrl) clientView(sessionFromUrl);
  else if (liveOnly) {
    document.body.classList.add("live-only");
    startAdmin();
  }
})();
