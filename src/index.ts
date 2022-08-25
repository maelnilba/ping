import fastify from "fastify";
import fetch from "cross-fetch";
import { pingDeleteSchema, pingSchema } from "./zod/pingSchema";

const server = fastify();

const tm = new Map<string, { timeout: NodeJS.Timeout; key?: string }>();

server.get("/ping", (req, reply) => {
  // req.headers.authorization
  const params = pingSchema.parse(req.query);

  // allow from 1ms to 1hour
  if (params.ms_time <= 0 || params.ms_time > 60 * 60 * 1000) {
    reply.status(404).send({});
    return;
  }

  // timeout the actions
  const t = setTimeout(async () => {
    let request: RequestInit = {
      method: "GET",
    };

    if (params.data) {
      request = {
        method: "POST",
        body: params.data,
      };
    }

    if (params.key) {
      request = {
        ...request,
        headers: {
          authorization: params.key,
        },
      };
    }

    fetch(params.url, request).catch((e) => console.log(e));

    // unstore the timeout
    if (params.id && tm.has(params.id)) {
      tm.delete(params.id);
    }
  }, params.ms_time);

  // store the timeout ref in a map
  if (params.id && !tm.has(params.id)) {
    tm.set(params.id, { timeout: t, key: params.key });
  }

  reply.status(200).send({});
});

server.delete("/ping", (req, reply) => {
  const params = pingDeleteSchema.parse(req.query);
  if (tm.has(params.id)) {
    let t = tm.get(params.id);

    if (!t) {
      reply.status(404).send({});
      return;
    }

    if (t.key) {
      if (params.key === t.key) {
        clearTimeout(tm.get(params.id)?.timeout);
        tm.delete(params.id);
      }
    } else {
      clearTimeout(tm.get(params.id)?.timeout);
      tm.delete(params.id);
    }
    reply.status(200).send({});
    return;
  }

  reply.status(404).send({});
});

server.get("/", (_, reply) => {
  reply.send({ uptime: process.uptime() });
});

server.listen(
  {
    port: process.env.PORT ? parseInt(process.env.PORT) : 8080,
    host: process.env.HOST || "0.0.0.0",
  },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  }
);
