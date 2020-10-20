import { Controller } from "@arkecosystem/core-api";
import { Container, Contracts } from "@arkecosystem/core-kernel";
import { Crypto, Identities } from "@arkecosystem/crypto";
import Boom from "@hapi/boom";
import Hapi from "@hapi/hapi";
import { randomBytes } from "crypto";

@Container.injectable()
export class RelayVerifierController extends Controller {
    @Container.inject(Container.Identifiers.WalletRepository)
    @Container.tagged("state", "blockchain")
    private readonly walletRepository!: Contracts.State.WalletRepository;

    private passphrase!: string | undefined;
    private key!: string;

    public signWithPassphrase(request: Hapi.Request): any {
        if (!this.passphrase || request.query.key !== this.key) {
            return Boom.notFound();
        }

        return Crypto.Message.sign(Crypto.Slots.getTime().toString(), this.passphrase);
    }

    public deletePassphrase(request: Hapi.Request): any {
        if (!this.passphrase || request.info.remoteAddress !== "127.0.0.1") {
            return Boom.notFound();
        }

        this.passphrase = undefined;

        return {
            success: true,
        };
    }

    public putPassphrase(request: Hapi.Request): any {
        if (request.info.remoteAddress !== "127.0.0.1") {
            return Boom.notFound();
        }

        const payloadPassphrase: string = Object.keys(request.payload)[0];
        if (!payloadPassphrase) {
            return Boom.badData("No passphrase provided");
        }

        const wallet: Contracts.State.Wallet = this.walletRepository.findByPublicKey(
            Identities.PublicKey.fromPassphrase(payloadPassphrase),
        );

        if (wallet.hasAttribute("delegate")) {
            this.key = randomBytes(32).toString("hex");
            this.passphrase = payloadPassphrase;
            return {
                delegate: wallet.getAttribute("delegate").username,
                key: this.key,
            };
        }

        return Boom.notFound("Delegate not found with provided passphrase");
    }
}
