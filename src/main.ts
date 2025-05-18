import "@APP/common/sentry/instrument";

import { Backend } from "./application";

void Backend.start({
    cors: { credentials: true },
});
