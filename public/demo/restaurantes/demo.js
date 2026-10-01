(() => {
  "use strict";
  const app = document.getElementById("app"),
    notice = document.getElementById("notice");
  const CFG = Object.assign(
    {
      brandHtml:
        '<div class="brand">ORILLA<small>COCINA · MAR · ENCUENTROS</small></div>',
      clubName: "Club Orilla",
      shortName: "Orilla",
      heroTag: "BUENOS MOMENTOS QUE SE REPITEN",
      heroTitle: "Volver tiene<br>su recompensa.",
      heroText:
        "Disfruta tu comida, acumula puntos y elige un beneficio para tu próxima visita.",
      codePrefix: "ORI-",
      rewards: null,
      rewardNote: "",
      qrUrl: "eunomi.cl/demo/restaurantes",
      qrSvg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 33 33\" role=\"img\" aria-label=\"C\u00f3digo QR\" shape-rendering=\"crispEdges\"><rect width=\"33\" height=\"33\" fill=\"#fff\"/><path d=\"M2 2h1v1h-1zM3 2h1v1h-1zM4 2h1v1h-1zM5 2h1v1h-1zM6 2h1v1h-1zM7 2h1v1h-1zM8 2h1v1h-1zM10 2h1v1h-1zM15 2h1v1h-1zM16 2h1v1h-1zM18 2h1v1h-1zM19 2h1v1h-1zM20 2h1v1h-1zM22 2h1v1h-1zM24 2h1v1h-1zM25 2h1v1h-1zM26 2h1v1h-1zM27 2h1v1h-1zM28 2h1v1h-1zM29 2h1v1h-1zM30 2h1v1h-1zM2 3h1v1h-1zM8 3h1v1h-1zM12 3h1v1h-1zM15 3h1v1h-1zM16 3h1v1h-1zM17 3h1v1h-1zM19 3h1v1h-1zM21 3h1v1h-1zM24 3h1v1h-1zM30 3h1v1h-1zM2 4h1v1h-1zM4 4h1v1h-1zM5 4h1v1h-1zM6 4h1v1h-1zM8 4h1v1h-1zM11 4h1v1h-1zM14 4h1v1h-1zM16 4h1v1h-1zM19 4h1v1h-1zM20 4h1v1h-1zM21 4h1v1h-1zM22 4h1v1h-1zM24 4h1v1h-1zM26 4h1v1h-1zM27 4h1v1h-1zM28 4h1v1h-1zM30 4h1v1h-1zM2 5h1v1h-1zM4 5h1v1h-1zM5 5h1v1h-1zM6 5h1v1h-1zM8 5h1v1h-1zM10 5h1v1h-1zM11 5h1v1h-1zM12 5h1v1h-1zM13 5h1v1h-1zM14 5h1v1h-1zM18 5h1v1h-1zM20 5h1v1h-1zM21 5h1v1h-1zM24 5h1v1h-1zM26 5h1v1h-1zM27 5h1v1h-1zM28 5h1v1h-1zM30 5h1v1h-1zM2 6h1v1h-1zM4 6h1v1h-1zM5 6h1v1h-1zM6 6h1v1h-1zM8 6h1v1h-1zM10 6h1v1h-1zM24 6h1v1h-1zM26 6h1v1h-1zM27 6h1v1h-1zM28 6h1v1h-1zM30 6h1v1h-1zM2 7h1v1h-1zM8 7h1v1h-1zM10 7h1v1h-1zM12 7h1v1h-1zM13 7h1v1h-1zM18 7h1v1h-1zM19 7h1v1h-1zM20 7h1v1h-1zM21 7h1v1h-1zM24 7h1v1h-1zM30 7h1v1h-1zM2 8h1v1h-1zM3 8h1v1h-1zM4 8h1v1h-1zM5 8h1v1h-1zM6 8h1v1h-1zM7 8h1v1h-1zM8 8h1v1h-1zM10 8h1v1h-1zM12 8h1v1h-1zM14 8h1v1h-1zM16 8h1v1h-1zM18 8h1v1h-1zM20 8h1v1h-1zM22 8h1v1h-1zM24 8h1v1h-1zM25 8h1v1h-1zM26 8h1v1h-1zM27 8h1v1h-1zM28 8h1v1h-1zM29 8h1v1h-1zM30 8h1v1h-1zM10 9h1v1h-1zM11 9h1v1h-1zM12 9h1v1h-1zM15 9h1v1h-1zM18 9h1v1h-1zM19 9h1v1h-1zM22 9h1v1h-1zM2 10h1v1h-1zM6 10h1v1h-1zM8 10h1v1h-1zM9 10h1v1h-1zM10 10h1v1h-1zM13 10h1v1h-1zM15 10h1v1h-1zM18 10h1v1h-1zM19 10h1v1h-1zM22 10h1v1h-1zM23 10h1v1h-1zM24 10h1v1h-1zM25 10h1v1h-1zM26 10h1v1h-1zM27 10h1v1h-1zM30 10h1v1h-1zM2 11h1v1h-1zM6 11h1v1h-1zM10 11h1v1h-1zM11 11h1v1h-1zM14 11h1v1h-1zM15 11h1v1h-1zM16 11h1v1h-1zM17 11h1v1h-1zM18 11h1v1h-1zM20 11h1v1h-1zM24 11h1v1h-1zM25 11h1v1h-1zM26 11h1v1h-1zM27 11h1v1h-1zM28 11h1v1h-1zM29 11h1v1h-1zM30 11h1v1h-1zM3 12h1v1h-1zM4 12h1v1h-1zM5 12h1v1h-1zM8 12h1v1h-1zM10 12h1v1h-1zM13 12h1v1h-1zM14 12h1v1h-1zM17 12h1v1h-1zM19 12h1v1h-1zM20 12h1v1h-1zM22 12h1v1h-1zM26 12h1v1h-1zM30 12h1v1h-1zM3 13h1v1h-1zM5 13h1v1h-1zM10 13h1v1h-1zM14 13h1v1h-1zM16 13h1v1h-1zM17 13h1v1h-1zM19 13h1v1h-1zM20 13h1v1h-1zM22 13h1v1h-1zM24 13h1v1h-1zM26 13h1v1h-1zM27 13h1v1h-1zM29 13h1v1h-1zM30 13h1v1h-1zM3 14h1v1h-1zM4 14h1v1h-1zM5 14h1v1h-1zM6 14h1v1h-1zM7 14h1v1h-1zM8 14h1v1h-1zM11 14h1v1h-1zM13 14h1v1h-1zM14 14h1v1h-1zM15 14h1v1h-1zM16 14h1v1h-1zM19 14h1v1h-1zM21 14h1v1h-1zM22 14h1v1h-1zM23 14h1v1h-1zM29 14h1v1h-1zM2 15h1v1h-1zM3 15h1v1h-1zM5 15h1v1h-1zM7 15h1v1h-1zM10 15h1v1h-1zM12 15h1v1h-1zM14 15h1v1h-1zM17 15h1v1h-1zM18 15h1v1h-1zM24 15h1v1h-1zM25 15h1v1h-1zM26 15h1v1h-1zM27 15h1v1h-1zM28 15h1v1h-1zM29 15h1v1h-1zM30 15h1v1h-1zM2 16h1v1h-1zM4 16h1v1h-1zM5 16h1v1h-1zM6 16h1v1h-1zM8 16h1v1h-1zM10 16h1v1h-1zM12 16h1v1h-1zM14 16h1v1h-1zM15 16h1v1h-1zM16 16h1v1h-1zM17 16h1v1h-1zM18 16h1v1h-1zM23 16h1v1h-1zM25 16h1v1h-1zM26 16h1v1h-1zM27 16h1v1h-1zM28 16h1v1h-1zM30 16h1v1h-1zM2 17h1v1h-1zM3 17h1v1h-1zM4 17h1v1h-1zM10 17h1v1h-1zM12 17h1v1h-1zM13 17h1v1h-1zM14 17h1v1h-1zM15 17h1v1h-1zM17 17h1v1h-1zM19 17h1v1h-1zM20 17h1v1h-1zM22 17h1v1h-1zM24 17h1v1h-1zM26 17h1v1h-1zM29 17h1v1h-1zM30 17h1v1h-1zM2 18h1v1h-1zM5 18h1v1h-1zM7 18h1v1h-1zM8 18h1v1h-1zM10 18h1v1h-1zM12 18h1v1h-1zM13 18h1v1h-1zM15 18h1v1h-1zM18 18h1v1h-1zM19 18h1v1h-1zM21 18h1v1h-1zM22 18h1v1h-1zM29 18h1v1h-1zM2 19h1v1h-1zM7 19h1v1h-1zM9 19h1v1h-1zM15 19h1v1h-1zM16 19h1v1h-1zM17 19h1v1h-1zM18 19h1v1h-1zM24 19h1v1h-1zM25 19h1v1h-1zM26 19h1v1h-1zM27 19h1v1h-1zM29 19h1v1h-1zM30 19h1v1h-1zM4 20h1v1h-1zM5 20h1v1h-1zM8 20h1v1h-1zM9 20h1v1h-1zM10 20h1v1h-1zM11 20h1v1h-1zM12 20h1v1h-1zM13 20h1v1h-1zM17 20h1v1h-1zM18 20h1v1h-1zM19 20h1v1h-1zM20 20h1v1h-1zM22 20h1v1h-1zM28 20h1v1h-1zM30 20h1v1h-1zM4 21h1v1h-1zM5 21h1v1h-1zM6 21h1v1h-1zM7 21h1v1h-1zM11 21h1v1h-1zM12 21h1v1h-1zM16 21h1v1h-1zM19 21h1v1h-1zM21 21h1v1h-1zM22 21h1v1h-1zM23 21h1v1h-1zM29 21h1v1h-1zM30 21h1v1h-1zM2 22h1v1h-1zM3 22h1v1h-1zM5 22h1v1h-1zM6 22h1v1h-1zM8 22h1v1h-1zM11 22h1v1h-1zM13 22h1v1h-1zM15 22h1v1h-1zM16 22h1v1h-1zM17 22h1v1h-1zM19 22h1v1h-1zM22 22h1v1h-1zM23 22h1v1h-1zM24 22h1v1h-1zM25 22h1v1h-1zM26 22h1v1h-1zM27 22h1v1h-1zM30 22h1v1h-1zM10 23h1v1h-1zM11 23h1v1h-1zM13 23h1v1h-1zM14 23h1v1h-1zM17 23h1v1h-1zM18 23h1v1h-1zM20 23h1v1h-1zM21 23h1v1h-1zM22 23h1v1h-1zM26 23h1v1h-1zM30 23h1v1h-1zM2 24h1v1h-1zM3 24h1v1h-1zM4 24h1v1h-1zM5 24h1v1h-1zM6 24h1v1h-1zM7 24h1v1h-1zM8 24h1v1h-1zM10 24h1v1h-1zM11 24h1v1h-1zM12 24h1v1h-1zM13 24h1v1h-1zM14 24h1v1h-1zM15 24h1v1h-1zM16 24h1v1h-1zM17 24h1v1h-1zM19 24h1v1h-1zM21 24h1v1h-1zM22 24h1v1h-1zM24 24h1v1h-1zM26 24h1v1h-1zM27 24h1v1h-1zM28 24h1v1h-1zM30 24h1v1h-1zM2 25h1v1h-1zM8 25h1v1h-1zM11 25h1v1h-1zM14 25h1v1h-1zM15 25h1v1h-1zM17 25h1v1h-1zM18 25h1v1h-1zM19 25h1v1h-1zM20 25h1v1h-1zM22 25h1v1h-1zM26 25h1v1h-1zM2 26h1v1h-1zM4 26h1v1h-1zM5 26h1v1h-1zM6 26h1v1h-1zM8 26h1v1h-1zM10 26h1v1h-1zM11 26h1v1h-1zM12 26h1v1h-1zM13 26h1v1h-1zM14 26h1v1h-1zM15 26h1v1h-1zM19 26h1v1h-1zM21 26h1v1h-1zM22 26h1v1h-1zM23 26h1v1h-1zM24 26h1v1h-1zM25 26h1v1h-1zM26 26h1v1h-1zM27 26h1v1h-1zM2 27h1v1h-1zM4 27h1v1h-1zM5 27h1v1h-1zM6 27h1v1h-1zM8 27h1v1h-1zM12 27h1v1h-1zM13 27h1v1h-1zM15 27h1v1h-1zM16 27h1v1h-1zM17 27h1v1h-1zM18 27h1v1h-1zM21 27h1v1h-1zM22 27h1v1h-1zM23 27h1v1h-1zM25 27h1v1h-1zM30 27h1v1h-1zM2 28h1v1h-1zM4 28h1v1h-1zM5 28h1v1h-1zM6 28h1v1h-1zM8 28h1v1h-1zM12 28h1v1h-1zM13 28h1v1h-1zM14 28h1v1h-1zM17 28h1v1h-1zM18 28h1v1h-1zM19 28h1v1h-1zM20 28h1v1h-1zM21 28h1v1h-1zM22 28h1v1h-1zM23 28h1v1h-1zM27 28h1v1h-1zM28 28h1v1h-1zM29 28h1v1h-1zM30 28h1v1h-1zM2 29h1v1h-1zM8 29h1v1h-1zM12 29h1v1h-1zM13 29h1v1h-1zM16 29h1v1h-1zM18 29h1v1h-1zM19 29h1v1h-1zM20 29h1v1h-1zM22 29h1v1h-1zM23 29h1v1h-1zM24 29h1v1h-1zM27 29h1v1h-1zM29 29h1v1h-1zM30 29h1v1h-1zM2 30h1v1h-1zM3 30h1v1h-1zM4 30h1v1h-1zM5 30h1v1h-1zM6 30h1v1h-1zM7 30h1v1h-1zM8 30h1v1h-1zM10 30h1v1h-1zM16 30h1v1h-1zM18 30h1v1h-1zM19 30h1v1h-1zM22 30h1v1h-1zM23 30h1v1h-1zM24 30h1v1h-1zM25 30h1v1h-1zM26 30h1v1h-1zM27 30h1v1h-1zM29 30h1v1h-1z\" fill=\"currentColor\"/></svg>",
    },
    window.DEMO_CONFIG || {},
  );
  const defaultRewards = [
    {
      id: "postre",
      name: "Postre de la casa",
      art: "Un final dulce",
      points: 600,
      cost: 1800,
      kind: "Producto",
      condition:
        "Una porción de la selección del día, junto a un plato principal.",
    },
    {
      id: "aperitivo",
      name: "Aperitivo sin alcohol",
      art: "Brindemos por volver",
      points: 400,
      cost: 1200,
      kind: "Producto",
      condition:
        "Una bebida sin alcohol de la selección del club, junto a un plato principal.",
    },
    {
      id: "descuento",
      name: "$5.000 de descuento",
      art: "Tu próxima mesa",
      points: 1000,
      cost: 5000,
      kind: "Descuento",
      condition:
        "En una cuenta de al menos $30.000. No acumulable con otras promociones.",
    },
  ];
  const rewards = CFG.rewards || defaultRewards;
  // FPR-11: tres formas de acreditar compras, simuladas. Tiempos = hipótesis por medir en el local.
  const methods = [
    {
      id: "caja",
      short: "El cajero anota el correo o número del cliente y el monto.",
      badge: "Solo si cobra un cajero",
      name: "Cajero: correo o teléfono + monto",
      how: "Al cobrar, el cajero pregunta si es del club, escribe el correo o teléfono (o escanea el QR del cliente) y el monto. Los puntos quedan al instante.",
      roles: [
        ["Garzón", "Nada"],
        ["Cajero", "~5 a 15 s por cuenta del club"],
        ["Cliente", "Decir su correo o mostrar su QR"],
        ["Administrador", "Revisar correcciones"],
      ],
      risk: "Acreditar a conocidos o montos equivocados. Queda registrado quién acreditó y se puede cuadrar con la caja.",
      needs: "Que cobre alguien que no sea el garzón. Si el garzón cobra en la mesa, esta opción no sirve.",
      effort: "Bajo · sin costo de terceros",
    },
    {
      id: "boleta",
      short: "El cliente escanea el QR y anota su número de boleta y el monto.",
      badge: "Garzón: nada",
      name: "El cliente declara su boleta",
      how: "El cliente escanea un QR (mesa, cuenta o boleta) e ingresa el número de boleta y el monto. Queda en revisión hasta que el local lo valida.",
      roles: [
        ["Garzón", "Nada"],
        ["Cajero", "Nada"],
        ["Cliente", "~30 a 60 s desde su celular"],
        ["Administrador", "Validar pendientes (minutos al día, por medir)"],
      ],
      risk: "Boletas inventadas o ajenas. Por eso quedan en revisión y una boleta solo se acredita una vez.",
      needs: "Que la boleta tenga un número visible y único, y que el local pueda revisar sus ventas.",
      effort: "Medio · sin costo de terceros",
    },
    {
      id: "integracion",
      short: "La venta llega sola desde el sistema de caja del local.",
      badge: "Garzón: nada · por confirmar",
      name: "Integración con la caja",
      how: "El sistema de caja del local informa cada venta y los puntos se acreditan solos.",
      roles: [
        ["Garzón", "Nada"],
        ["Cajero", "Nada, si el cliente se identifica por su cuenta"],
        ["Cliente", "Nada o identificarse"],
        ["Administrador", "Configurar una vez"],
      ],
      risk: "Depende del proveedor de caja. Hay que resolver cómo se reconoce al cliente en cada venta.",
      needs: "Que el proveedor confirme que tiene API o exportación de ventas. Costo: por averiguar.",
      effort: "Alto · distinto para cada proveedor",
    },
  ];
  let role = "cliente",
    screen = "welcome",
    adminTab = "resumen",
    registered = false,
    balance = 0,
    purchases = [],
    redemptions = [],
    pending = null,
    selected = "postre",
    paused = new Set(),
    serial = 482,
    lastCode = "",
    method = null,
    claims = [],
    folioSerial = 10234,
    cajaWarn = null;
  const MEMBER = "camila@example.com";
  const getMethod = (id) => methods.find((m) => m.id === id);
  const originLabel = {
    demo: "Compra simulada",
    caja: "Acreditada en caja",
    boleta: "Boleta declarada",
    integracion: "Venta recibida de la caja",
  };
  function credit(amount, origin, extra = {}) {
    const points = Math.floor(amount / 100);
    purchases.push({
      amount,
      points,
      time: Date.now(),
      newvisit: true,
      origin,
      ...extra,
    });
    balance += points;
    return points;
  }
  const money = (n) => "$" + n.toLocaleString("es-CL"),
    num = (n) => n.toLocaleString("es-CL"),
    getReward = (id) => rewards.find((r) => r.id === id),
    esc = (s) =>
      String(s).replace(
        /[&<>"']/g,
        (c) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          })[c],
      );
  const brand = CFG.brandHtml;
  const phone = (body) =>
    `<div class="phone"><header>${brand}<span class="pill">Club del local</span></header>${body}</div>`;
  const msg = (t) => {
    notice.textContent = t;
  };
  function rewardCard(r) {
    const available = !paused.has(r.id),
      enough = balance >= r.points;
    return `<article class="reward"><div class="reward-art">${r.art}</div><div class="reward-body"><span class="eyebrow">${r.kind}</span><h3>${r.name}</h3><div class="row"><strong>${num(r.points)} puntos</strong><span class="pill">${!available ? "No disponible" : enough ? "Te alcanza" : `Te faltan ${num(r.points - balance)}`}</span></div><div class="track"><span style="width:${Math.min(100, (balance / r.points) * 100)}%"></span></div><button class="full" data-reward="${r.id}">Ver beneficio</button></div></article>`;
  }
  function render() {
    document
      .querySelectorAll("[data-role]")
      .forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.role === role)),
      );
    if (role === "cliente") {
      if (!registered && screen !== "register")
        app.innerHTML = phone(
          `<div class="ocean"><span>${CFG.heroTag}</span></div><section><div class="eyebrow">Bienvenido al ${CFG.clubName}</div><h1>${CFG.heroTitle}</h1><p>${CFG.heroText}</p><div class="step"><span>1</span>Únete gratis al club.</div><div class="step"><span>2</span>Acumula puntos por tu consumo.</div><div class="step"><span>3</span>Regresa y disfruta tu premio.</div><button class="primary full" data-screen="register">Quiero unirme</button><p class="muted"><small>Sin descargar una aplicación. En este ejemplo, cada $100 de consumo suma 1 punto.</small></p></section>`,
        );
      else if (screen === "register")
        app.innerHTML = phone(
          `<section><button data-screen="welcome">← Volver</button><h1>Tu lugar en el club.</h1><p>Solo necesitas tu nombre y correo.</p><form id="register"><label>Nombre<input value="Camila" readonly aria-label="Nombre de ejemplo"></label><label>Correo electrónico<input value="camila@example.com" readonly aria-label="Correo de ejemplo"></label><label><input type="checkbox" name="club" required>Acepto unirme al ${CFG.clubName} y el aviso de privacidad (obligatorio).</label><label><input type="checkbox" name="promos">Quiero recibir promociones (opcional).</label><details class="privacy"><summary>Aviso de privacidad (resumen)</summary><p>${CFG.shortName} es responsable de tus datos y Eunomi los trata por encargo. Usamos solo tu nombre, tu correo y tus compras del club para sumar puntos y entregar beneficios. Las promociones son aparte y opcionales. Puedes pedir acceso, corrección o eliminación, o salir del club cuando quieras.</p><p class="total-note">Texto de ejemplo, pendiente de revisión legal.</p></details><button class="primary full">Unirme con datos de ejemplo</button></form><p class="total-note">Datos ficticios precargados. Ninguna casilla viene marcada. En el producto real se confirmará el correo; aquí no se envían mensajes.</p></section>`,
        );
      else if (screen === "claim")
        app.innerHTML = phone(
          `<section><button data-screen="wallet">← Mi club</button><span class="eyebrow">Sumar una compra</span><h1>Declara tu boleta.</h1><p>Ingresa el número y el total de tu boleta. El restaurante la revisa y luego se suman tus puntos.</p><form id="claim"><label>Número de boleta<input name="folio" value="${"B-" + folioSerial}" required autocomplete="off" maxlength="20"></label><label>Total pagado, sin propina<input name="amount" type="number" min="100" max="1000000" step="1" value="60000" required></label><button class="primary full">Enviar a revisión</button></form><div id="claimResult" aria-live="polite"></div><p class="total-note">Número de boleta ficticio. En el local real, el QR estaría en la mesa, la cuenta o la boleta.</p></section>`,
        );
      else if (screen === "detail") {
        const r = getReward(selected);
        app.innerHTML = phone(
          `<section><button data-screen="wallet">← Mis beneficios</button><div class="reward-art stack">${r.art}</div><span class="eyebrow">${r.kind}</span><h1>${r.name}</h1><h2>${num(r.points)} puntos</h2><p class="conditions">${r.condition}<br>Consulta disponibilidad antes de pedirlo. Válido para una visita posterior a la compra que generó los puntos.</p><p>Tus puntos se descuentan cuando el personal confirma el canje.</p><button class="primary full" data-action="request" ${balance < r.points || paused.has(r.id) || pending ? "disabled" : ""}>${paused.has(r.id) ? "Temporalmente no disponible" : pending ? "Ya tienes un canje pendiente" : balance < r.points ? `Te faltan ${num(r.points - balance)} puntos` : "Presentar canje"}</button></section>`,
        );
      } else if (screen === "code" && pending) {
        const r = getReward(pending.reward);
        app.innerHTML = phone(
          `<section class="success"><span class="pill">Pendiente de validación</span><h1>${r.name}</h1><p>Muestra este código al personal antes de pedir tu beneficio.</p><div class="code">${pending.code}</div><p>${r.points} puntos · Tu saldo aún no cambia</p><button class="full" data-action="cancel">Cancelar solicitud</button><button class="full" data-screen="wallet">Volver a mi club</button></section>`,
        );
      } else if (screen === "history")
        app.innerHTML = phone(
          `<section><button data-screen="wallet">← Mi club</button><h1>Mis movimientos</h1>${
            purchases.length || redemptions.length || claims.length
              ? [
                  ...purchases.map((p) => ({
                    time: p.time,
                    text: `${originLabel[p.origin] || "Compra"} · ${money(p.amount)}${p.folio ? " · " + esc(p.folio) : ""}`,
                    points: "+" + p.points,
                  })),
                  ...claims
                    .filter((c) => c.status !== "validada")
                    .map((c) => ({
                      time: c.time,
                      text: `Boleta ${esc(c.folio)} · ${money(c.amount)} · ${c.status === "pendiente" ? "en revisión" : "rechazada por el local"}`,
                      points: c.status === "pendiente" ? "(" + c.points + ")" : "0",
                    })),
                  ...redemptions.map((r) => ({
                    time: r.time,
                    text: getReward(r.reward).name,
                    points: "−" + getReward(r.reward).points,
                  })),
                ]
                  .sort((a, b) => b.time - a.time)
                  .map(
                    (x) =>
                      `<div class="row record"><div>${x.text}<small>${new Date(x.time).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}</small></div><strong>${x.points} pts</strong></div>`,
                  )
                  .join("")
              : "<p>Aquí aparecerán tus compras y canjes.</p>"
          }</section>`,
        );
      else
        app.innerHTML = phone(
          `<section><div class="row"><span>Hola, Camila</span><button data-screen="history">Movimientos</button></div><div class="balance stack"><small>TUS PUNTOS DISPONIBLES</small><strong>${num(balance)}</strong><p>${balance >= 400 ? "Ya puedes disfrutar un beneficio." : "Tu primera recompensa está por llegar."}</p>${pendingClaimPoints() ? `<p>En revisión: ${num(pendingClaimPoints())} puntos</p>` : ""}</div>${method === "boleta" ? `<button class="full" data-screen="claim">Declarar mi boleta</button>` : ""}${pending ? `<button class="primary full" data-screen="code">Ver canje pendiente · ${pending.code}</button>` : ""}<h2 class="stack">Tu próxima visita, con premio</h2><p class="muted"><small>Cada $100 de consumo = 1 punto. Por ejemplo, $60.000 suman 600 puntos.</small></p>${rewards.map(rewardCard).join("")}<p class="total-note">Equivalencia y condiciones de ejemplo, pendientes de definir con el restaurante.${CFG.rewardNote ? " " + CFG.rewardNote : ""}</p></section>`,
        );
    } else if (role === "personal")
      app.innerHTML = phone(
        `${method === "caja" ? `<section class="caja"><span class="eyebrow">Caja · Al cobrar</span><h2>Acreditar compra del club</h2><form id="caja"><label>Correo o teléfono del cliente<input name="who" value="${MEMBER}" required autocomplete="off"></label><label>Monto pagado, sin propina<input name="amount" type="number" min="100" max="1000000" step="1" value="60000" required></label><button class="primary full">Acreditar</button></form><div id="cajaResult" aria-live="polite"></div><p class="total-note">Lo hace quien cobra, no el garzón. Meta: pocos segundos por cuenta.</p></section>` : ""}<section><span class="eyebrow">Personal · Turno de ejemplo</span><h1>Validar beneficio.</h1><p>Consulta el código que te muestra el cliente.</p><form id="lookup"><label>Código de canje<input name="code" placeholder="Ej. ${CFG.codePrefix}482" value="${pending?.code || lastCode}" required autocomplete="off"></label><button class="primary full">Consultar código</button></form><div id="result" aria-live="polite"></div><p class="total-note">Comprueba disponibilidad y aplica el beneficio en la cuenta antes de confirmarlo.</p></section>`,
      );
    else renderAdmin();
  }
  function pendingClaimPoints() {
    return claims
      .filter((c) => c.status === "pendiente")
      .reduce((s, c) => s + c.points, 0);
  }
  function renderMethods() {
    const cards = methods
      .map(
        (m, i) =>
          `<article class="box method${method === m.id ? " chosen" : ""}"><span class="eyebrow">Opción ${i + 1}${CFG.metodoRecomendado === m.id ? " · Recomendada para su local" : ""}</span><h2>${m.name}</h2><p>${m.short}</p><p><span class="pill">${m.badge}</span></p><details class="method-more"><summary>Ver detalle</summary><dl class="roles">${m.roles.map(([r, t]) => `<div><dt>${r}</dt><dd>${t}</dd></div>`).join("")}</dl><p class="small-block"><strong>Riesgo:</strong> ${m.risk}</p><p class="small-block"><strong>Necesita:</strong> ${m.needs}</p><p class="small-block"><strong>Construcción:</strong> ${m.effort}</p></details><button class="full${method === m.id ? " primary" : ""}" data-method="${m.id}" aria-pressed="${method === m.id}">${method === m.id ? "Simulando esta opción" : "Probar aquí"}</button></article>`,
      )
      .join("");
    let panel = "";
    if (method === "caja")
      panel = `<section class="box"><h2>Cómo se ve en tu local</h2><p>El cajero acredita al cobrar desde la vista Personal. El garzón no hace nada.</p><button class="primary" data-role="personal">Ir a la caja (vista Personal)</button></section>`;
    else if (method === "boleta") {
      const list = claims
        .slice()
        .reverse()
        .map(
          (c) =>
            `<div class="history record"><div><strong>Boleta ${esc(c.folio)}</strong><small>Camila · ${new Date(c.time).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}</small></div><div>${money(c.amount)}<small>${num(c.points)} puntos</small></div>${
              c.status === "pendiente"
                ? `<button data-validate="${c.id}">Validar</button><button data-reject="${c.id}">Rechazar</button>`
                : `<span class="pill">${c.status === "validada" ? "Validada" : "Rechazada"}</span><span></span>`
            }</div>`,
        )
        .join("");
      panel = `<section class="box"><h2>Boletas por revisar</h2><p class="muted">Compara cada boleta con tus ventas del día. Una boleta solo se puede acreditar una vez.</p>${list || '<p class="muted">Aún no hay boletas. Desde la vista Cliente, usa “Declarar mi boleta”.</p>'}<button data-role="cliente">Ir a la vista Cliente</button></section>`;
    } else if (method === "integracion")
      panel = `<section class="box"><h2>Ventas recibidas desde la caja</h2><p class="muted">Simulación: no hay conexión con ningún proveedor real. Antes de ofrecer esta opción hay que confirmar con el proveedor del local que existe una API o exportación, y su costo.</p><form id="integracion" class="inline"><label>Monto de la venta ficticia<input name="amount" type="number" min="100" max="1000000" step="1" value="60000" required></label><button class="primary">Simular venta recibida</button></form><p class="total-note">En esta simulación, la venta llega asociada al correo de Camila. Cómo se reconoce al cliente en la caja real está por averiguar.</p></section>`;
    return `<div class="method-intro"><p><strong>¿Cómo se suman las compras?</strong> ${CFG.metodoNota ? esc(CFG.metodoNota) + " " : ""}El garzón no hace nada extra.</p><button class="primary" data-action="go-live">Mostrarlo en vivo con un celular</button></div><div class="methods">${cards}</div>${panel}<p class="total-note">Datos ficticios. Tiempos y costos por confirmar con el local.</p>`;
  }
  function renderQr() {
    return `<p class="muted">Así llega el cliente al club: un QR en la mesa, la cuenta o la entrada. Escanéalo con tu celular para probar la demo tú mismo.</p><div class="qr-card box"><div class="qr-brand">${brand}</div><p class="qr-title">Únete al ${CFG.clubName}</p><p class="qr-sub">Escanea, suma puntos con tu consumo y elige un premio para tu próxima visita.</p><div class="qr-code">${CFG.qrSvg}</div><p class="qr-foot">Sin descargar aplicaciones · ${CFG.qrUrl}</p></div><p class="total-note">Tarjeta de ejemplo. En la versión real, cada local tendría su propio QR y el diseño se ajusta a su estilo.</p>`;
  }
  function renderAdmin() {
    const total = purchases.reduce((s, p) => s + p.amount, 0),
      costKnown = rewards.every((r) => r.cost != null),
      spent = redemptions.reduce((s, r) => s + (getReward(r.reward).cost || 0), 0),
      visits = purchases.filter((p) => p.newvisit).length;
    app.innerHTML = `<header class="admin-head"><div><div class="eyebrow">${CFG.shortName} · Administración</div><h1>Tu club, de un vistazo.</h1><p class="muted">Actividad de esta demostración · se actualiza al simular compras y canjes</p></div><span class="pill">Sesión de ejemplo</span></header><nav class="tabs"><button data-tab="resumen" aria-pressed="${adminTab === "resumen"}">Resumen</button><button data-tab="canjes" aria-pressed="${adminTab === "canjes"}">Historial de canjes</button><button data-tab="premios" aria-pressed="${adminTab === "premios"}">Beneficios</button><button data-tab="acreditacion" aria-pressed="${adminTab === "acreditacion"}">Acreditación${claims.some((c) => c.status === "pendiente") ? ` (${claims.filter((c) => c.status === "pendiente").length})` : ""}</button><button data-tab="qr" aria-pressed="${adminTab === "qr"}">QR para mesas</button></nav>${
      adminTab === "qr"
        ? renderQr()
        : adminTab === "acreditacion"
        ? renderMethods()
        : adminTab === "resumen"
        ? `<div class="stats"><div class="box"><small>Canjes realizados</small><strong class="stat">${redemptions.length}</strong><small>${pending ? "1 pendiente" : "Sin pendientes"}</small></div><div class="box"><small>Consumo registrado</small><strong class="stat">${money(total)}</strong><small>${purchases.length} ${purchases.length === 1 ? "compra" : "compras"} del club</small></div><div class="box"><small>Clientes que volvieron (2 o más visitas)</small><strong class="stat">${visits >= 2 ? 1 : 0}</strong><small>${purchases.length ? "De 1 cliente con compras" : "Aún sin compras"}</small></div><div class="box"><small>Costo estimado de beneficios</small><strong class="stat">${costKnown ? money(spent) : "Por definir"}</strong><small>${costKnown ? "Valores ilustrativos, no contables" : "El costo real de cada beneficio lo define el local"}</small></div></div><div class="cols"><section class="box"><h2>Beneficios más utilizados</h2>${rewards.map((r) => `<div class="row record"><span>${r.name}</span><strong>${redemptions.filter((x) => x.reward === r.id).length}</strong></div>`).join("")}</section><section class="box"><h2>Actividad del club</h2><div class="row record"><span>Miembros inscritos</span><strong>${registered ? 1 : 0}</strong></div><div class="row record"><span>Puntos entregados</span><strong>${num(purchases.reduce((s, p) => s + p.points, 0))}</strong></div><div class="row record"><span>Puntos disponibles</span><strong>${num(balance)}</strong></div><div class="row record"><span>Promedio por compra</span><strong>${purchases.length ? money(Math.round(total / purchases.length)) : "—"}</strong></div></section></div><p class="total-note">Solo compras registradas en el club. No son las ventas totales del restaurante ni una medición de ventas adicionales causadas por el programa.</p>`
        : adminTab === "canjes"
          ? `<section class="box"><h2>Registro de canjes</h2>${
              redemptions.length
                ? redemptions
                    .slice()
                    .reverse()
                    .map(
                      (x) =>
                        `<div class="history record"><div><strong>${getReward(x.reward).name}</strong><small>${x.code} · Camila</small></div><div>${getReward(x.reward).points} puntos<small>${new Date(x.time).toLocaleString("es-CL")}</small></div><div>Valentina<small>Personal de ejemplo</small></div><span class="pill">Completado</span></div>`,
                    )
                    .join("")
                : '<p class="muted">Todavía no hay canjes. Al confirmar uno desde la vista Personal, aparecerá aquí.</p>'
            }</section>`
          : `<section class="box"><h2>Beneficios del restaurante</h2>${rewards.map((r) => `<div class="row record"><div><h3>${r.name}</h3><small>${num(r.points)} puntos · ${r.cost != null ? "Costo de ejemplo " + money(r.cost) : "Costo para el local: por definir"}${r.priceNote ? " · " + r.priceNote : ""}</small><small>${r.condition}</small></div><button data-pause="${r.id}">${paused.has(r.id) ? "Activar" : "Pausar"}</button></div>`).join("")}<p class="total-note">Pausar retira la disponibilidad para clientes y bloquea la validación de solicitudes pendientes.</p></section>`
    }`;
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.role) {
      role = b.dataset.role;
      screen = registered ? "wallet" : "welcome";
      msg("");
    } else if (b.dataset.screen) {
      screen = b.dataset.screen;
    } else if (b.dataset.reward) {
      selected = b.dataset.reward;
      screen = "detail";
    } else if (b.dataset.tab) {
      adminTab = b.dataset.tab;
    } else if (b.dataset.method) {
      method = method === b.dataset.method ? null : b.dataset.method;
      cajaWarn = null;
      msg(
        method
          ? `Simulando: ${getMethod(method).name}.`
          : "Ninguna opción seleccionada.",
      );
    } else if (b.dataset.validate || b.dataset.reject) {
      const c = claims.find(
        (x) => x.id === Number(b.dataset.validate || b.dataset.reject),
      );
      if (!c || c.status !== "pendiente") return;
      if (b.dataset.validate) {
        c.status = "validada";
        credit(c.amount, "boleta", { folio: c.folio });
        msg(`Boleta ${c.folio} validada: +${num(c.points)} puntos para Camila.`);
      } else {
        c.status = "rechazada";
        msg(`Boleta ${c.folio} rechazada. No se sumaron puntos.`);
      }
    } else if (b.dataset.action === "go-live") {
      if (window.__demoLive) window.__demoLive();
      return;
    } else if (b.dataset.action === "caja-repeat") {
      if (!cajaWarn) return;
      const p = credit(cajaWarn, "caja", { by: "Caja de ejemplo" });
      msg(`Compra de ${money(cajaWarn)} acreditada en caja: +${num(p)} puntos.`);
      cajaWarn = null;
    } else if (b.dataset.pause) {
      paused.has(b.dataset.pause)
        ? paused.delete(b.dataset.pause)
        : paused.add(b.dataset.pause);
    } else if (b.dataset.action === "reset") {
      registered = false;
      balance = 0;
      purchases = [];
      redemptions = [];
      pending = null;
      paused.clear();
      role = "cliente";
      screen = "welcome";
      serial = 482;
      lastCode = "";
      method = null;
      claims = [];
      folioSerial = 10234;
      cajaWarn = null;
      adminTab = "resumen";
      msg("Demostración reiniciada.");
    } else if (b.dataset.action === "request") {
      const r = getReward(selected);
      if (pending || paused.has(r.id) || balance < r.points) return;
      pending = { reward: r.id, code: CFG.codePrefix + serial++ };
      lastCode = pending.code;
      screen = "code";
    } else if (b.dataset.action === "cancel") {
      pending = null;
      screen = "wallet";
      msg("Solicitud cancelada. Tus puntos no cambiaron.");
    } else if (b.dataset.action === "confirm") {
      if (
        !pending ||
        paused.has(pending.reward) ||
        balance < getReward(pending.reward).points
      )
        return;
      balance -= getReward(pending.reward).points;
      redemptions.push({ ...pending, time: Date.now() });
      pending = null;
      msg("Canje confirmado. Puntos descontados e historial actualizado.");
    } else return;
    render();
  });
  document.addEventListener("submit", (e) => {
    e.preventDefault();
    if (e.target.id === "register") {
      registered = true;
      screen = "wallet";
      msg(
        "Camila se unió al club. Usa “Simular una compra” en la barra de presentación.",
      );
      render();
    } else if (e.target.id === "purchase") {
      if (!registered) {
        msg("Primero completa la inscripción de ejemplo en la vista Cliente.");
        return;
      }
      const data = new FormData(e.target),
        amount = Number(data.get("amount"));
      if (!Number.isFinite(amount) || amount < 100 || amount > 1000000) return;
      const points = Math.floor(amount / 100);
      purchases.push({
        amount,
        points,
        time: Date.now(),
        newvisit: data.get("newvisit") === "on",
        origin: "demo",
      });
      balance += points;
      msg(
        `Compra simulada de ${money(amount)}: +${num(points)} puntos. Las 3 formas de acreditar están en Administrador › Acreditación.`,
      );
      if (role === "cliente") screen = "wallet";
      render();
    } else if (e.target.id === "claim") {
      const data = new FormData(e.target),
        folio = String(data.get("folio")).trim().toUpperCase(),
        amount = Math.round(Number(data.get("amount"))),
        out = document.getElementById("claimResult");
      if (!registered) return;
      if (!folio || !Number.isFinite(amount) || amount < 100 || amount > 1000000) {
        out.innerHTML = '<p role="alert">Revisa el número de boleta y el monto.</p>';
        return;
      }
      if (claims.some((c) => c.folio === folio && c.status !== "rechazada")) {
        out.innerHTML =
          '<p role="alert">Esta boleta ya fue declarada. Una boleta solo suma puntos una vez.</p>';
        return;
      }
      claims.push({
        id: claims.length + 1,
        folio,
        amount,
        points: Math.floor(amount / 100),
        status: "pendiente",
        time: Date.now(),
      });
      folioSerial++;
      screen = "wallet";
      msg(
        `Boleta ${folio} enviada. Quedará en revisión hasta que el restaurante la valide (Administrador › Acreditación).`,
      );
      render();
    } else if (e.target.id === "caja") {
      const data = new FormData(e.target),
        who = String(data.get("who")).trim().toLowerCase(),
        amount = Math.round(Number(data.get("amount"))),
        out = document.getElementById("cajaResult");
      if (!Number.isFinite(amount) || amount < 100 || amount > 1000000) {
        out.innerHTML = '<p role="alert">Revisa el monto.</p>';
        return;
      }
      if (!registered || who !== MEMBER) {
        out.innerHTML =
          '<p role="alert">No encontramos a esa persona en el club. Cobra normal; puedes invitarla a unirse con el QR.</p>';
        return;
      }
      const last = purchases.filter((p) => p.origin === "caja").pop();
      if (last && last.amount === amount && Date.now() - last.time < 120000) {
        cajaWarn = amount;
        out.innerHTML = `<div role="alert" class="conditions">Hace un momento acreditaste una compra igual. ¿Es otra cuenta?<button class="full" data-action="caja-repeat">Sí, acreditar otra</button></div>`;
        return;
      }
      const p = credit(amount, "caja", { by: "Caja de ejemplo" });
      msg(`Compra de ${money(amount)} acreditada en caja: +${num(p)} puntos para Camila.`);
      render();
    } else if (e.target.id === "integracion") {
      const amount = Math.round(Number(new FormData(e.target).get("amount")));
      if (!Number.isFinite(amount) || amount < 100 || amount > 1000000) return;
      if (!registered) {
        msg("Primero completa la inscripción de ejemplo en la vista Cliente.");
        return;
      }
      const folio = "B-" + folioSerial++;
      const p = credit(amount, "integracion", { folio });
      msg(`Venta ficticia ${folio} recibida desde la caja: +${num(p)} puntos para Camila, sin que nadie hiciera nada.`);
      render();
    } else if (e.target.id === "lookup") {
      const code = String(new FormData(e.target).get("code"))
          .trim()
          .toUpperCase(),
        out = document.getElementById("result");
      if (redemptions.some((r) => r.code === code)) {
        out.innerHTML =
          '<p role="alert">Este código ya fue utilizado. No puede canjearse otra vez.</p>';
        return;
      }
      if (!pending || pending.code !== code) {
        out.innerHTML = '<p role="alert">Código no encontrado o cancelado.</p>';
        return;
      }
      const r = getReward(pending.reward);
      out.innerHTML = paused.has(r.id)
        ? '<p role="alert">Beneficio pausado. No se descontaron puntos.</p>'
        : `<div class="conditions stack"><span class="pill">Código válido</span><h2 class="stack">${r.name}</h2><p>Camila · ${r.points} puntos</p><p>${r.condition}</p><button class="primary full" data-action="confirm">Confirmar entrega y canje</button></div>`;
    }
  });
  render();
  // Modo en vivo (datos reales en una base de demo): se carga aparte y no cambia la demo simulada.
  window.__demo = { CFG, rewards, brand, phone, money, num, esc, render };
  const live = document.createElement("script");
  live.src = "/demo/restaurantes/live.js";
  live.defer = true;
  document.body.append(live);
})();
