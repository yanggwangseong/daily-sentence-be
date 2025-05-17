import { Backend } from "./application";
import "./common/sentry/instrument";

void Backend.start({
    cors: { credentials: true },
});
