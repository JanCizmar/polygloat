export interface PolygloatTextInputElement extends HTMLElement {
    __polygloat: TextInputElementData;
    selectionStart: number;
    value: string;
}

export interface PolygloatTextAreaElement extends PolygloatTextInputElement, HTMLTextAreaElement {
    addEventListener: any;
    removeEventListener: any;
}

export interface PolygloatInputElement extends PolygloatTextInputElement, HTMLInputElement {
    addEventListener: any;
    removeEventListener: any;
}

export interface TextInputElementData {
    oldValue: string;
    valueInputs: string[];
    touched: boolean;
    oldPlaceholder: string;
    placeholderInputs: string[];
}

export interface SimpleSpanElementData {
    input: string;
}

export interface PolygloatSimpleSpanElement extends HTMLSpanElement {
    __polygloat: SimpleSpanElementData;
}
