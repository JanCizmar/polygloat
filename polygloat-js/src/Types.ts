export interface PolygloatTextInputElement {
    __polygloat: TextInputElementData;
}

export interface PolygloatTextAreaElement extends HTMLTextAreaElement, PolygloatTextInputElement {
}

export interface PolygloatInputElement extends HTMLInputElement, PolygloatTextInputElement {
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
