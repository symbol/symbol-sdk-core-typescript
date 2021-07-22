/*
 * Copyright 2021 SYMBOL
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Address, RawAddress } from '../Address';
import { Base32 } from '../utils/Base32';

/**
 * The address structure describes an address with its network
 */
export class SymbolAddress extends Address {
    constructor(rawAddress: RawAddress) {
        super(rawAddress);
    }

    public getAddressBytes(): Uint8Array {
        const address = new Uint8Array(this.rawAddress.addressWithoutChecksum.length + 3);
        address.set(this.rawAddress.addressWithoutChecksum, 0);
        address.set(this.rawAddress.checksum.subarray(0, 3), this.rawAddress.addressWithoutChecksum.length);
        return address;
    }

    public static createFromEncoded(encodedAddress: string): SymbolAddress {
        const decoded = Base32.Base32Decode(`${encodedAddress}A`).subarray(0, 24);
        return new SymbolAddress({
            addressWithoutChecksum: decoded.subarray(0, 21),
            checksum: decoded.subarray(22, 24),
        });
    }
}