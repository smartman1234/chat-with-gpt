import * as hashes from 'jshashes';

const hasher = new hashes.MD5();

const hashCache = new Map<string, string>();

export async function md5(data: string): Promise<string> {
    if (!hashCache.has(data)) {
        const hashHex = hasher.hex(data);
        hashCache.set(data, hashHex);
    }
    return hashCache.get(data)!;
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function share(text: string) {
    if (navigator.share) {
        await navigator.share({
            text,
        });
    }
}

export function ellipsize(text: string, maxLength: number) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

export function cloneArrayBuffer(buffer) {
  const newBuffer = new ArrayBuffer(buffer.byteLength);
  new Uint8Array(newBuffer).set(new Uint8Array(buffer));
  return newBuffer;
}

export class AsyncLoop {
    public cancelled = false;

    constructor(private handler: any, private pauseBetween: number = 1000) {
    }

    public async start() {
        this.loop().then(() => {});
    }

    private async loop() {
        while (!this.cancelled) {
            try {
                await this.handler();
            } catch (e) {
                console.error(e);
            }

            await sleep(this.pauseBetween);
        }
    }
}