// Type definitions for minibuffer 0.0.1
// Project: https://github.com/rochars/minibuffer
// Definitions by: Rafael da Silva Rocha <https://github.com/rochars>
// Definitions: https://github.com/rochars/minibuffer

export default minibuffer;

declare class minibuffer {
    
    constructor();

    read(buffer: Uint8Array, typeDefinition: object): number;

    write(buffer: Uint8Array, typeDefinition: object, num: number, index?: null): void;
}
