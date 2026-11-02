import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { createSupplierBackend, ids } from "./fixtures/supplier-backend.mjs";

const { server: backend, state } = createSupplierBackend();
let frontend;
let base;
let logs = "";

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve(server.address().port));
  });
}

before(async () => {
  const backendPort = await listen(backend);
  const reservation = createServer();
  const port = await listen(reservation);
  await new Promise((resolve) => reservation.close(resolve));
  base = `http://127.0.0.1:${port}`;
  frontend = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      String(port),
    ],
    {
      env: {
        ...process.env,
        TURISMO_API_URL: `http://127.0.0.1:${backendPort}`,
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  for (const stream of [frontend.stdout, frontend.stderr])
    stream.on("data", (chunk) => {
      logs += chunk;
    });
  for (let attempt = 0; attempt < 100; attempt++) {
    if (frontend.exitCode !== null) throw new Error(logs);
    try {
      const response = await fetch(`${base}/empresario/login`);
      if (response.ok) return;
    } catch {
      /* aguarda o servidor local */
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Frontend não iniciou. ${logs}`);
});

after(async () => {
  frontend?.kill("SIGTERM");
  backend.closeAllConnections();
  await new Promise((resolve) => backend.close(resolve));
});

function request(path, { cookie, ...options } = {}) {
  return fetch(`${base}/api/empresario/${path}`, {
    ...options,
    headers: {
      Origin: base,
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
      ...options.headers,
    },
  });
}

function cookies(response) {
  return response.headers
    .getSetCookie()
    .map((value) => value.split(";")[0])
    .join("; ");
}
async function login() {
  return request("sessao", {
    method: "POST",
    body: JSON.stringify({
      email: "fornecedor@example.test",
      password: "fixture-password",
    }),
  });
}

test("login não pode enviar credenciais pela URL antes de carregar o JavaScript", async () => {
  const response = await fetch(`${base}/empresario/login`);
  const html = await response.text();
  assert.match(html, /method="post"/);
  assert.match(html, /action="\/api\/empresario\/sessao"/);
  assert.match(html, /Preparando acesso/);
});

test("nega acesso aos dados sem sessão", async () => {
  const response = await request("saidas");
  assert.equal(response.status, 401);
});

test("login mantém tokens em cookies HttpOnly e retorna somente perfil", async () => {
  const response = await login();
  assert.equal(response.status, 200);
  const profile = await response.json();
  assert.equal(profile.id, ids.supplier);
  assert.equal(profile.accessToken, undefined);
  assert.equal(profile.refreshToken, undefined);
  assert.ok(
    response.headers
      .getSetCookie()
      .every((value) => /httponly/i.test(value) && /samesite=lax/i.test(value)),
  );
  const session = await request("sessao", { cookie: cookies(response) });
  assert.equal(session.status, 200);
});

test("recusa credenciais incorretas e JSON inválido", async () => {
  assert.equal(
    (
      await request("sessao", {
        method: "POST",
        body: JSON.stringify({
          email: "wrong@example.test",
          password: "wrong",
        }),
      })
    ).status,
    401,
  );
  assert.equal(
    (await request("sessao", { method: "POST", body: "{" })).status,
    400,
  );
});

test("bloqueia login e mutações originadas em outro site", async () => {
  const cookie = cookies(await login());
  const headers = { Origin: "https://outro-site.example" };
  assert.equal(
    (await request("sessao", { method: "POST", headers, body: "{}" })).status,
    403,
  );
  assert.equal(
    (
      await request(`saidas/${ids.departure}/reservas/resolver`, {
        method: "PATCH",
        cookie,
        headers,
        body: "{}",
      })
    ).status,
    403,
  );
  assert.equal(
    (await request("sessao", { method: "DELETE", cookie, headers })).status,
    403,
  );
});

test("proxy restringe rotas e preserva filtros, perfil e seleção em massa", async () => {
  const cookie = cookies(await login());
  assert.equal((await request("admin", { cookie })).status, 404);
  assert.equal(
    (await request("saidas?status=SCHEDULED&page=2", { cookie })).status,
    200,
  );
  assert.equal(state.lastRequest.path, "/provedor/saidas");
  assert.equal(state.lastRequest.query, "?status=SCHEDULED&page=2");
  assert.equal(state.lastRequest.authorization, "Bearer fixture-access");
  const body = { reservationIds: [ids.reservation], action: "CONFIRM" };
  const result = await request(`saidas/${ids.departure}/reservas/resolver`, {
    method: "PATCH",
    cookie,
    body: JSON.stringify(body),
  });
  assert.equal(result.status, 200);
  assert.deepEqual(state.lastRequest.body, body);
});

test("preserva conflito de capacidade informado pelo backend", async () => {
  const cookie = cookies(await login());
  const response = await request(`saidas/${ids.departure}/reservas/resolver`, {
    method: "PATCH",
    cookie,
    body: JSON.stringify({
      reservationIds: ["00000000-0000-4000-8000-000000000000"],
      action: "CONFIRM",
    }),
  });
  assert.equal(response.status, 409);
  assert.match((await response.json()).message, /capacidade/);
});

test("deduplica renovação simultânea e atualiza os cookies", async () => {
  const previous = state.refreshCalls;
  const cookie =
    "turismo_supplier_access=expired; turismo_supplier_refresh=fixture-refresh";
  const responses = await Promise.all([
    request("saidas", { cookie }),
    request("sessao", { cookie }),
  ]);
  for (const response of responses) {
    assert.equal(response.status, 200);
    assert.match(cookies(response), /fixture-refresh-rotated/);
  }
  assert.equal(state.refreshCalls - previous, 1);
});

test("sessão revogada limpa cookies e falha transitória preserva a sessão", async () => {
  const revoked = await request("sessao", {
    cookie: "turismo_supplier_refresh=revoked",
  });
  assert.equal(revoked.status, 401);
  assert.ok(
    revoked.headers.getSetCookie().every((value) => /max-age=0/i.test(value)),
  );
  state.forceUnavailable = true;
  try {
    const response = await request("sessao", {
      cookie: "turismo_supplier_access=fixture-access",
    });
    assert.equal(response.status, 503);
    assert.deepEqual(response.headers.getSetCookie(), []);
  } finally {
    state.forceUnavailable = false;
  }
});

test("logout remove os dois cookies", async () => {
  const response = await request("sessao", {
    method: "DELETE",
    cookie: cookies(await login()),
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.getSetCookie().length, 2);
  assert.ok(
    response.headers.getSetCookie().every((value) => /max-age=0/i.test(value)),
  );
});
