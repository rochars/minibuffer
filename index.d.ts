// Type definitions for minibuffer 0.2
// Project: https://github.com/rochars/minibuffer
// Definitions by: Rafael da Silva Rocha <https://github.com/rochars>
// Definitions: https://github.com/rochars/minibuffer

export default MiniBuffer;

declare class MiniBuffer {
    
    constructor();

    head: number;

    clear(): void;

    read(buffer: Uint8Array, typeDefinition: object): number;

    write(buffer: Uint8Array, typeDefinition: object, num: number, index?: number): void;

    writeStr(buffer: Uint8Array, str: string, size?: number, index?: number): void;

	readStr(buffer: Uint8Array, size: number, index?: number): string;
}
