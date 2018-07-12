// Type definitions for minibuffer 0.0.3
// Project: https://github.com/rochars/minibuffer
// Definitions by: Rafael da Silva Rocha <https://github.com/rochars>
// Definitions: https://github.com/rochars/minibuffer

export default MiniBuffer;

declare class MiniBuffer {
    
    constructor();

    read(buffer: Uint8Array, typeDefinition: object): number;

    write(buffer: Uint8Array, typeDefinition: object, num: number, index?: number): void;
}
