import { Identifiers, Server } from "@arkecosystem/core-api";
import { Providers } from "@arkecosystem/core-kernel";

import Handlers from "./handlers";

export class ServiceProvider extends Providers.ServiceProvider {
    public async register(): Promise<void> {
        for (const identifier of [Identifiers.HTTP, Identifiers.HTTPS]) {
            if (this.app.isBound<Server>(identifier)) {
                const server: Server = this.app.get<Server>(identifier);
                await server.register({
                    plugin: Handlers,
                    routes: { prefix: "/api" },
                });
            }
        }
    }
}
