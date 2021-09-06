import { Key, NemCrypto, NemKeyPair } from '@core';
import { Converter } from '@utils';
import { expect } from 'chai';

describe('Nem crypto cipher', () => {
    // Arrange:
    const deterministicSenderPrivateKey = Key.createFromHex('575DBB3062267EFF57C970A336EBBC8FBCFE12C5BD3ED7BC11EB0481D7704CED');
    const deterministicReceiverPrivateKey = Key.createFromHex('5B0E3FA5D3B49A79022D7C1E121BA1CBBF4DB5821F47AB8C708EF88DEFC29BFE');
    const sender = new NemKeyPair(deterministicSenderPrivateKey);
    const recipient = new NemKeyPair(deterministicReceiverPrivateKey);
    const message = 'Nem is awesome!';
    const encryptedHex =
        '26A5EEBD8B959F664DB060DE9E8265BD4A4597D2BE9DAA2C481042879BEA9F995790143301428700938A0ABB7D8122499E16AE67FFD5E2E4143A58100CA0BD604EC054F82FFF719B26C3E2B68CB6EBB0';

    describe('encode & decode message', () => {
        it('Can encode message with sender private key', () => {
            // Arrange:
            const iv = Converter.hexToUint8('5790143301428700938A0ABB7D812249');
            const salt = Converter.hexToUint8('26A5EEBD8B959F664DB060DE9E8265BD4A4597D2BE9DAA2C481042879BEA9F99');

            // Act:
            const encoded = NemCrypto.encode(sender.privateKey, recipient.publicKey, Converter.utf8ToUint8(message), iv, salt);

            // Assert:
            expect(encryptedHex).equal(Converter.uint8ToHex(encoded));
        });

        it('Can decode message with recipient private key', () => {
            // Act:
            const decoded = NemCrypto.decode(recipient.privateKey, sender.publicKey, Converter.hexToUint8(encryptedHex));

            // Assert:
            expect(message).equal(Converter.uint8ToUtf8(decoded));
        });

        it('Roundtrip decode encode', () => {
            // Act:
            const decrypted = NemCrypto.decode(recipient.privateKey, sender.publicKey, Converter.hexToUint8(encryptedHex));
            const encrypted = NemCrypto.encode(sender.privateKey, recipient.publicKey, decrypted);

            // Assert:
            expect(Converter.uint8ToUtf8(decrypted)).equal(message);
            expect(encrypted.length).equal(80);
        });

        it('Roundtrip encode decode', () => {
            // Act:
            const encrypted = NemCrypto.encode(sender.privateKey, recipient.publicKey, Converter.utf8ToUint8(message));
            const decrypted = NemCrypto.decode(recipient.privateKey, sender.publicKey, encrypted);

            // Assert:
            expect(Converter.uint8ToUtf8(decrypted)).equal(message);
        });

        it('Encoding throw error if message exceed 32 btyes', () => {
            // Arrange:
            const exceedBtyesMessage = message.repeat(10);

            // Act:
            const encoded = () => NemCrypto.encode(sender.privateKey, recipient.publicKey, Converter.utf8ToUint8(exceedBtyesMessage));

            // Assert:
            expect(encoded).to.throw(Error);
        });

        it('Decoding throw error if payload exceed 80 btyes', () => {
            // Arrange:
            const exceedBtyesPayload = encryptedHex.repeat(2);

            // Act:
            const decoded = () => NemCrypto.decode(recipient.privateKey, sender.publicKey, Converter.hexToUint8(exceedBtyesPayload));

            // Assert:
            expect(decoded).to.throw(Error);
        });
    });
});