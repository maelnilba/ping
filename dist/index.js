"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const jobSchema_1 = require("./zod/jobSchema");
const server = (0, fastify_1.default)();
server.get("/ping", (req, reply) => {
    // req.headers.authorization
    const params = jobSchema_1.jobSchema.parse(req.query);
    console.log("get ping");
    if (params.ms_time < 0 || params.ms_time > 60 * 1000) {
        reply.status(404).send({});
        return;
    }
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        let request = {
            method: "GET",
        };
        if (params.data) {
            request = {
                method: "POST",
                body: params.data,
            };
        }
        if (params.key) {
            request = Object.assign(Object.assign({}, request), { headers: {
                    authorization: params.key,
                } });
        }
        (0, cross_fetch_1.default)(params.url, request).catch((e) => console.log(e));
    }), params.ms_time);
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
//# sourceMappingURL=index.js.map