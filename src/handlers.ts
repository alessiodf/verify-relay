import Hapi from "@hapi/hapi";

import * as Routes from "./routes";

export = {
    async register(server: Hapi.Server): Promise<void> {
        Routes.register(server);
    },
    name: "Relay Verifier",
};
