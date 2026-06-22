#!/usr/bin/env node

import { readFile, rename, writeFile } from "node:fs/promises";
import { createServer } from "node:http";

const config = {
  host: process.env.SYNC_HOST || "127.0.0.1",
  port: Number(process.env.SYNC_PORT || 8787),
  token: process.env.SYNC_TOKEN || "",
  statePath: process.env.SYNC_STATE_PATH || `${process.env.HOME}/.william-trene-sync-state.json`,
  allowedOrigin: process.env.SYNC_ALLOWED_ORIGIN || "https://remimarents.github.io"
};

if (!config.token || config.token === "CHANGE_ME") {
  console.error("SYNC_TOKEN must be set to a strong secret.");
  process.exit(1);
}

function jsonResponse(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": config.allowedOrigin,
    "Access-Control-Allow-Methods": "GET,PUT,OPTIONS",
    "Access-Control-Allow-Headers": "Authorization,Content-Type",
    "Cache-Control": "no-store"
  });
  response.end(`${JSON.stringify(payload)}\n`);
}

function unauthorized(response) {
  jsonResponse(response, 401, { ok: false, error: "unauthorized" });
}

function isAuthorized(request) {
  return request.headers.authorization === `Bearer ${config.token}`;
}

async function requestBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

async function readState() {
  try {
    return JSON.parse(await readFile(config.statePath, "utf8"));
  } catch {
    return {
      state: null,
      updatedAt: "",
      updatedBy: ""
    };
  }
}

async function writeState(payload) {
  const next = {
    state: payload.state,
    updatedAt: new Date().toISOString(),
    updatedBy: payload.updatedBy || "unknown"
  };
  const tempPath = `${config.statePath}.tmp`;
  await writeFile(tempPath, `${JSON.stringify(next, null, 2)}\n`);
  await rename(tempPath, config.statePath);
  return next;
}

async function handleRequest(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === "OPTIONS") {
    jsonResponse(response, 204, {});
    return;
  }

  if (url.pathname === "/health") {
    jsonResponse(response, 200, { ok: true });
    return;
  }

  if (url.pathname !== "/api/state") {
    jsonResponse(response, 404, { ok: false, error: "not_found" });
    return;
  }

  if (!isAuthorized(request)) {
    unauthorized(response);
    return;
  }

  if (request.method === "GET") {
    jsonResponse(response, 200, { ok: true, ...(await readState()) });
    return;
  }

  if (request.method === "PUT") {
    const body = await requestBody(request);
    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch {
      jsonResponse(response, 400, { ok: false, error: "invalid_json" });
      return;
    }

    if (!parsed || typeof parsed !== "object" || !parsed.state) {
      jsonResponse(response, 400, { ok: false, error: "missing_state" });
      return;
    }

    const saved = await writeState(parsed);
    jsonResponse(response, 200, { ok: true, updatedAt: saved.updatedAt });
    return;
  }

  jsonResponse(response, 405, { ok: false, error: "method_not_allowed" });
}

const server = createServer((request, response) => {
  handleRequest(request, response).catch((error) => {
    console.error(error);
    jsonResponse(response, 500, { ok: false, error: "server_error" });
  });
});

server.listen(config.port, config.host, () => {
  console.log(`william sync server listening on http://${config.host}:${config.port}`);
});
