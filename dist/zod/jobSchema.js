"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobSchema = void 0;
const zod_1 = require("zod");
exports.jobSchema = zod_1.z.object({
    url: zod_1.z.string().url(),
    ms_time: zod_1.z
        .string()
        .transform((arg) => (isNaN(parseInt(arg)) ? 0 : parseInt(arg))),
    data: zod_1.z.string().optional(),
    key: zod_1.z.string().optional(),
});
//# sourceMappingURL=jobSchema.js.map