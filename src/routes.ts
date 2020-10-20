import Hapi from "@hapi/hapi";

import { RelayVerifierController } from "./controller";

export const register = (server: Hapi.Server): void => {
    const controller = server.app.app.resolve(RelayVerifierController);
    server.bind(controller);

    server.route({
        method: "GET",
        path: "/verify",
        handler: controller.signWithPassphrase,
    });

    server.route({
        method: "PUT",
        path: "/verify",
        handler: controller.putPassphrase,
    });

    server.route({
        method: "DELETE",
        path: "/verify",
        handler: controller.deletePassphrase,
    });
};
