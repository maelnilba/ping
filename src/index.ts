import fastify from "fastify";
import fetch from "cross-fetch";
import { jobSchema } from "./zod/jobSchema";

const server = fastify();

server.get("/ping", (req, reply) => {
  // req.headers.authorization
  const params = jobSchema.parse(req.query);
  console.log("get ping");
  if (params.ms_time < 0 || params.ms_time > 60 * 1000) {
    reply.status(404).send({});
    return;
  }

  setTimeout(async () => {
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
  }, params.ms_time);

  reply.status(200).send({});
});

server.get("/", (_, reply) => {
  reply.send({ uptime: process.uptime() });
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
