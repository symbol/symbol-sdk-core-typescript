import SHA3 from 'sha3';
import { Address, RawAddress } from '../Address';
import { SymbolNetworkList } from '../constants';
import { Network } from '../Network';
import { SymbolAddress } from './SymbolAddress';

export class SymbolNetwork extends Network {
    /**
     * Constructor
     * @param {string} name Network name
     * @param {number} identifier Network identifier
     * @param {string} generationHash Symbol network generation hash
     */
    constructor(name: string, identifier: number, public readonly generationHash: string) {
        super(name, identifier);
    }

    /**
     * Get hasher for address generation based on selected network type
     * @returns {SHA3}
     */
    public addressHasher(): SHA3 {
        return new SHA3(256);
    }

    /**
     * Get network by its name
     * @param {string} name Network name
     * @returns {Network | undefined}
     */
    public findByName(name: string): Network | undefined {
        const network = SymbolNetworkList.find((n) => n.name.toLowerCase() === name.toLowerCase());
        if (network) {
            return new SymbolNetwork(network.name, network.identifier, network.generationHash);
        }
        return undefined;
    }

    /**
     * Get network by its identifier
     * @param {number} identifier Network identifier
     * @returns {Network | undefined}
     */
    public findByIdentifier(identifier: number): Network | undefined {
        const network = SymbolNetworkList.find((n) => n.identifier === identifier);
        if (network) {
            return new SymbolNetwork(network.name, network.identifier, network.generationHash);
        }
        return undefined;
    }

    /**
     * List all networks
     * @returns {SymbolNetwork[]}
     */
    public static list(): SymbolNetwork[] {
        return SymbolNetworkList.map((n) => new SymbolNetwork(n.name, n.identifier, n.generationHash));
    }

    public createAddress(rawAddress: RawAddress): Address {
        return new SymbolAddress(rawAddress);
    }

    /**
     * Create address object from encoded address
     * @param {string} encodedAddress Encoded address
     * @returns {Address}
     */
    public createAddressFromEncoded(encodedAddress: string): Address {
        return SymbolAddress.createFromEncoded(encodedAddress);
    }
}