import * as Sentry from "@sentry/nestjs";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import dotenv from "dotenv";
import path from "path";

import { ENV_SENTRY_DNS_KEY } from "../constants/env-keys.const";

dotenv.config({
    path: path.resolve(
        process.env["NODE_ENV"] === "production"
            ? ".production.env"
            : process.env["NODE_ENV"] === "stage"
              ? ".stage.env"
              : ".development.env",
    ),
});

Sentry.init({
    dsn: process.env[ENV_SENTRY_DNS_KEY], // develop 환경에서 비워두기
    integrations: [nodeProfilingIntegration()],
    // Tracing must be enabled for profiling to work
    tracesSampleRate: 1.0,
    // Set sampling rate for profiling - this is evaluated only once per SDK.init call
    profileSessionSampleRate: 1.0,
    // Trace lifecycle automatically enables profiling during active traces
    profileLifecycle: "trace",
    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
});

// Profiling happens automatically after setting it up with `Sentry.init()`.
// All spans (unless those discarded by sampling) will have profiling data attached to them.
Sentry.startSpan(
    {
        name: "Deily-Sentence-Span",
    },
    () => {
        // The code executed here will be profiled
    },
);
