import { createServer } from "node:http";

export const ids = {
  supplier: "11111111-1111-4111-8111-111111111111",
  product: "22222222-2222-4222-8222-222222222222",
  departure: "33333333-3333-4333-8333-333333333333",
  reservation: "44444444-4444-4444-8444-444444444444",
  participant: "55555555-5555-4555-8555-555555555555",
};

/** Servidor descartável de testes: não acessa banco, credenciais ou serviços reais. */
export function createSupplierBackend() {
  const state = { refreshCalls: 0, forceUnavailable: false, lastRequest: null };
  const supplier = {
    id: ids.supplier,
    name: "Passeios da Costa",
    email: "fornecedor@example.test",
  };
  const startsAt = new Date(Date.now() + 45 * 60000).toISOString();
  const metrics = {
    totalReservations: 3,
    pendingReservations: 2,
    confirmedReservations: 1,
    cancelledReservations: 0,
    pendingParticipants: 4,
    confirmedParticipants: 2,
    boardedParticipants: 0,
    noShowParticipants: 0,
    unrecordedParticipants: 2,
  };
  const departure = {
    id: ids.departure,
    productId: ids.product,
    product: {
      id: ids.product,
      name: "Piscinas naturais de Pajuçara",
      supplierId: ids.supplier,
    },
    startsAt,
    timeZone: "America/Maceio",
    capacity: 20,
    pricePerPerson: "120.00",
    status: "SCHEDULED",
    metrics,
    availableSeats: 18,
    acceptsReservations: true,
  };
  const reservation = {
    id: ids.reservation,
    responsibleName: "Ana Souza",
    status: "CONFIRMED",
    totalPrice: "240.00",
    createdAt: new Date().toISOString(),
    cancellationReason: null,
    participants: [
      { id: ids.participant, name: "Ana Souza", attendance: "NOT_RECORDED" },
      {
        id: "66666666-6666-4666-8666-666666666666",
        name: "João Souza",
        attendance: "NOT_RECORDED",
      },
    ],
  };
  const reservations = [
    reservation,
    {
      ...reservation,
      id: "77777777-7777-4777-8777-777777777777",
      responsibleName: "Carlos Lima",
      status: "PENDING",
      participants: [
        {
          id: "88888888-8888-4888-8888-888888888888",
          name: "Carlos Lima",
          attendance: "NOT_RECORDED",
        },
      ],
    },
  ];
  const events = [
    {
      id: "event-1",
      actorId: ids.supplier,
      actorRole: "Supplier",
      action: "CONFIRMED",
      createdAt: new Date().toISOString(),
      details: {},
    },
  ];
  const totals = {
    ...metrics,
    departures: 1,
    completedDepartures: 0,
    cancelledDepartures: 0,
    completedParticipants: 0,
  };

  function recalculate() {
    metrics.totalReservations = reservations.length;
    for (const [status, prefix] of [
      ["PENDING", "pending"],
      ["CONFIRMED", "confirmed"],
      ["CANCELLED", "cancelled"],
    ]) {
      const matching = reservations.filter((item) => item.status === status);
      metrics[`${prefix}Reservations`] = matching.length;
      if (status !== "CANCELLED")
        metrics[`${prefix}Participants`] = matching.reduce(
          (sum, item) => sum + item.participants.length,
          0,
        );
    }
    const confirmed = reservations
      .filter((item) => item.status === "CONFIRMED")
      .flatMap((item) => item.participants);
    metrics.boardedParticipants = confirmed.filter(
      (item) => item.attendance === "BOARDED",
    ).length;
    metrics.noShowParticipants = confirmed.filter(
      (item) => item.attendance === "NO_SHOW",
    ).length;
    metrics.unrecordedParticipants = confirmed.filter(
      (item) => item.attendance === "NOT_RECORDED",
    ).length;
    departure.availableSeats =
      departure.capacity - metrics.confirmedParticipants;
    Object.assign(totals, metrics);
  }
  recalculate();

  const server = createServer(async (request, response) => {
    const url = new URL(request.url || "/", "http://localhost");
    let raw = "";
    for await (const chunk of request) raw += chunk;
    const body = raw ? JSON.parse(raw) : null;
    state.lastRequest = {
      path: url.pathname,
      query: url.search,
      method: request.method,
      body,
      authorization: request.headers.authorization,
    };
    function send(status, data) {
      response.writeHead(status, { "Content-Type": "application/json" });
      response.end(JSON.stringify(data));
    }
    if (state.forceUnavailable)
      return send(503, { message: "Servidor temporariamente indisponível." });
    if (url.pathname === "/provedor/login") {
      if (
        body?.email !== supplier.email ||
        body?.password !== "fixture-password"
      )
        return send(401, { message: "E-mail ou senha inválidos." });
      return send(200, {
        supplier,
        accessToken: "fixture-access",
        refreshToken: "fixture-refresh",
      });
    }
    if (url.pathname === "/provedor/relogar") {
      state.refreshCalls++;
      await new Promise((resolve) => setTimeout(resolve, 60));
      if (body?.refreshToken !== "fixture-refresh")
        return send(401, { message: "Sessão revogada." });
      return send(200, {
        accessToken: "fixture-access",
        refreshToken: "fixture-refresh-rotated",
      });
    }
    if (request.headers.authorization !== "Bearer fixture-access")
      return send(401, { message: "Token inválido." });
    if (url.pathname === "/provedor") return send(200, supplier);
    if (url.pathname === "/provedor/saidas") {
      if (
        url.searchParams.get("productId") ===
        "00000000-0000-4000-8000-000000000000"
      )
        return send(200, { items: [], total: 0, page: 1, limit: 20 });
      return send(200, { items: [departure], total: 1, page: 1, limit: 20 });
    }
    if (url.pathname === "/provedor/painel/reservas")
      return send(200, {
        from: url.searchParams.get("from"),
        to: url.searchParams.get("to"),
        totals,
        byDateAndProduct: [
          {
            date: startsAt.slice(0, 10),
            productId: ids.product,
            productName: departure.product.name,
            totals,
          },
        ],
      });
    if (url.pathname.endsWith("/historico"))
      return send(200, {
        items: events,
        total: events.length,
        page: 1,
        limit: 10,
      });
    if (url.pathname.endsWith("/reservas/resolver")) {
      if (body.reservationIds.includes("00000000-0000-4000-8000-000000000000"))
        return send(409, {
          message: "A seleção excede a capacidade disponível da saída.",
        });
      for (const item of reservations.filter((item) =>
        body.reservationIds.includes(item.id),
      )) {
        item.status = body.action === "CONFIRM" ? "CONFIRMED" : "CANCELLED";
        item.cancellationReason = body.reason || null;
      }
      recalculate();
      return send(200, {
        requested: body.reservationIds.length,
        changed: body.reservationIds.length,
        status: body.action === "CONFIRM" ? "CONFIRMED" : "CANCELLED",
      });
    }
    if (url.pathname.endsWith("/participantes/comparecimento")) {
      for (const participant of reservations
        .flatMap((item) => item.participants)
        .filter((item) => body.participantIds.includes(item.id)))
        participant.attendance = body.attendance;
      recalculate();
      return send(200, {
        requested: body.participantIds.length,
        changed: body.participantIds.length,
        attendance: body.attendance,
      });
    }
    if (url.pathname.endsWith("/status")) {
      departure.status = body.status;
      return send(200, departure);
    }
    if (url.pathname.endsWith("/reservas")) {
      const selected = reservations.filter(
        (item) =>
          !url.searchParams.get("status") ||
          item.status === url.searchParams.get("status"),
      );
      return send(200, {
        items: selected,
        total: selected.length,
        page: 1,
        limit: 20,
      });
    }
    send(404, { message: "Não encontrado." });
  });
  return { server, state };
}
