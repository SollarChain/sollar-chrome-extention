// @ts-ignore
import forge from 'node-forge';

class DigitalSignature {
    forge: any = forge;
    keysPair: any = {};
    sign: string = '';
    signedData: any;
    dataToSign: any;

    constructor(dataToSign: any) {
        this.dataToSign = dataToSign;

        this.signedData = {
            data: dataToSign,
            sign: '',
            pubkey: '',
        };

        if (dataToSign !== undefined) {
            this.keysPair = this.generate();
            this.signedData.pubkey = this.keysPair.public;

            const signData = this.signData();
            this.signedData.sign = '';

            if (signData) {
                this.signedData.sign = signData.sign;
            }

            if (this.verifyData() === false) {
                console.log('Sign self-validation error! Invalid key or sign checking');
            }
        }
    }

    generate(len: number = 2048) {
        let keypair = this.forge.rsa.generateKeyPair({ len });
        keypair = {
        public: this.repairKey(this.fix(this.forge.pki.publicKeyToRSAPublicKeyPem(keypair.publicKey, 72))),
        private: this.repairKey(this.fix(this.forge.pki.privateKeyToPem(keypair.privateKey, 72)))
        };
        this.keysPair = keypair;
        // console.log('Info: Keypair generated');
        return keypair;
    }

    fix(str: string) {
        return str.replace(/\r/g, '') + '\n'
    }

    repairKey(key: string) {
        if (key[key.length - 1] !== "\n") {
            key += "\n";
        }
        return key.replace(new RegExp("\n\n", 'g'), "\n");
    }

    signData(data: any = this.dataToSign, key: string = this.keysPair.private) {
        if (!data) {
            console.log('No data to sign');
            return '';
        }
        let md = this.forge.md.sha256.create();
        md.update(data, 'utf8');
        let privateKey = this.forge.pki.privateKeyFromPem(key);
        this.sign = privateKey.sign(md);
        // console.log('Info: Data signed');
        return { data: data, sign: this.forge.util.bytesToHex(this.sign) };
    }

    verifyData(data: any = this.signedData, sign: string = this.signedData.sign, key: string = this.signedData.pubkey) {
        if (typeof data === 'object') {
            sign = data.sign;
            data = data.data;
        }
        try {
            let publicKey = this.forge.pki.publicKeyFromPem(this.repairKey(this.fix(key)));
            let md = this.forge.md.sha256.create();
            md.update(data, 'utf8');
            return publicKey.verify(md.digest().bytes(), this.forge.util.hexToBytes(sign)); //verifying only in bytes format
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}

export default DigitalSignature;
