// Select the node that will be observed for mutations
import {PolygloatService} from './polygloatService';
import * as React from 'react';
import {TranslationData} from './DTOs/TranslationData';
import {PolygloatInputElement, PolygloatSimpleSpanElement, PolygloatTextAreaElement} from './Types';
import {TranslationHighlighter} from './TranslationHighlighter';

const INPUT_PREFIX = '%-%polygloat:';
const INPUT_POSTFIX = '%-%';

const nodeListToArray = (nodeList: XPathResult): Element[] => {
    let node: Element;
    const nodeArray: Element[] = [];
    // @ts-ignore
    while ((node = nodeList.iterateNext()) !== null) {
        nodeArray.push(node);
    }
    return nodeArray;
};

// Start observing the target node for configured mutations
export class TranslationManager {
    private static instance: TranslationManager;
    private _service: PolygloatService;
    private _lang;
    private highlighter: TranslationHighlighter = new TranslationHighlighter(this.service, this);

    constructor(lang: string) {
        this._lang = lang;
    }

    public get lang() {
        return this._lang;
    }

    public set lang(value) {
        this._lang = value;
        this.refresh();
    }

    public get service() {
        if (this._service == null) {
            this._service = new PolygloatService();
        }
        return this._service;
    }

    public static getInstance(lang?: string): TranslationManager {
        if (this.instance == null) {
            this.instance = new TranslationManager(lang);
        }
        return this.instance;
    }

    // noinspection JSUnusedGlobalSymbols
    public manage = async () => {
        this.observer.observe(document.body, {attributes: true, childList: true, subtree: true});
        await this.service.getTranslations(this.lang);

    };

    public onTranslationChange = (data: TranslationData) => {
        this.refresh();
        /*let nodeList = document.evaluate(`//span[@_polygloat]`, document.body);
        for (const span of nodeListToArray(nodeList).filter(n => (n as PolygloatSimpleSpanElement).__polygloat.input == data.input)) {
            span.innerHTML = data.translations.get(this.lang);
        }*/
    };

    async renderTranslations(node: Element, addListener: boolean, xPathPrefix: string) {
        let nodeList = document.evaluate(`${xPathPrefix}/span[@_polygloat]`, node);
        for (const span of nodeListToArray(nodeList)) {
            let input = span.innerHTML;

            this.addPolygloatToPrototype(span);

            if (addListener) {
                this.highlighter.listen(span);
            }

            (span as PolygloatSimpleSpanElement).__polygloat = {input};

            span.innerHTML = await this.service.getTranslation(input, this.lang);
        }
    }

    async refresh() {
        let nodeList = document.evaluate(`//*[@_polygloat]`, document.body);
        for (const node of nodeListToArray(nodeList)) {
            if (node instanceof HTMLSpanElement) {
                let input = (node as PolygloatSimpleSpanElement).__polygloat.input;
                node.innerHTML = await this.service.getTranslation(input, this.lang);
                continue;
            }
            if (node instanceof HTMLTextAreaElement) {
                let textArea: PolygloatTextAreaElement = node as PolygloatTextAreaElement;
                if (!textArea.__polygloat.touched) {
                    await this.replaceTextAreaNode(node);
                }
                textArea.setAttribute('placeholder', (await this.replace(textArea.__polygloat.oldPlaceholder)).text);
            }
        }
    }

    private addPolygloatToPrototype(span) {
        let spanPrototype = Object.getPrototypeOf(span);
        spanPrototype.__polygloat = {};
    }

    private onNewNodes = async (nodes: Element[]): Promise<void> => {
        for (const node of nodes) {
            //texts inside text areas can not be replaced with spans, because it is not going to be rendered properly
            let textAreaParentList = nodeListToArray(document.evaluate('./ancestor-or-self::*[name() = \'textarea\']', node));

            if (textAreaParentList.length < 1) {
                await this.replaceStandardNode(node);
                continue;
            }
            this.replaceTextAreaNode(node as HTMLTextAreaElement);
        }
    };

    private observer = new MutationObserver(
        async (mutationsList: MutationRecord[]) => {
            for (let mutation of mutationsList) {
                //console.log(mutation);
                if (mutation.type === 'childList') {
                    let nodes: XPathResult = document.evaluate(`.//*[contains(text(), \'${INPUT_PREFIX}\')]`, mutation.target);
                    //todo: wrap with iterable
                    await this.onNewNodes(nodeListToArray(nodes));
                }
                if (mutation.type === 'attributes') {
                    if (mutation.target instanceof HTMLInputElement || mutation.target instanceof HTMLTextAreaElement) {
                        if (mutation.attributeName == 'placeholder' || mutation.attributeName == 'value') {
                            if (mutation.target.getAttribute(mutation.attributeName).indexOf(INPUT_PREFIX) > -1) {
                                await this.handleAttribute(mutation.target, mutation.attributeName);
                            }
                        }
                    }
                }
            }
        });

    /**
     * Standard replacement of no-input Element node
     * @param node the node to replace translations inside
     */
    private async replaceStandardNode(node: Element) {
        node.innerHTML = node.innerHTML.replace(
            new RegExp(`${INPUT_PREFIX}(.*?)${INPUT_POSTFIX}`, 'gm'),
            '<span _polygloat>$1</span>');

        await this.renderTranslations(node, true, '.');
    }

    /**
     * Replacement of translations inside textarea element node
     * @param node the textarea node to replace translations inside
     */
    private async replaceTextAreaNode(node: HTMLTextAreaElement) {
        let oldValue = node.innerHTML;
        let inputs = await this.replaceAndGetInputs(node);
        this.addPolygloatToPrototype(node);
        let polygloatTextarea: PolygloatTextAreaElement = node as PolygloatTextAreaElement;
        polygloatTextarea.__polygloat = {
            ...polygloatTextarea.__polygloat,
            oldValue,
            valueInputs: inputs,
            touched: !!polygloatTextarea.__polygloat.touched
        };
        polygloatTextarea.setAttribute('_polygloat', '');

        this.highlighter.listen(node);
    }

    private async replace(text: string): Promise<{ inputs: string[], text: string }> {
        //to ensure, that translations are loaded before instant is called
        let inputs: string[] = [];
        await this.service.getTranslations(this.lang);
        text = text.replace(new RegExp(`${INPUT_PREFIX}(.*?)${INPUT_POSTFIX}`, 'gm'), (_, g1) => {
            inputs.push(g1);
            return this.service.instant(g1, this.lang);
        });
        return {inputs, text};
    }

    private async replaceAndGetInputs(node: HTMLTextAreaElement) {
        //to ensure, that translations are loaded before instant is called
        let {text, inputs} = await this.replace(node.innerHTML);
        node.innerHTML = text;
        return inputs;
    }

    private async handleAttribute(target: Element, attribute: string) {
        target.setAttribute('_polygloat', '');
        let value = target.getAttribute(attribute);
        let {inputs, text} = await this.replace(value);
        target.setAttribute(attribute, text);
        this.addPolygloatToPrototype(target);
        let input = target as PolygloatInputElement;
        input.__polygloat = {
            ...input.__polygloat,
            oldValue: attribute === 'value' ? value : input.__polygloat.oldValue,
            valueInputs: attribute === 'value' ? inputs : input.__polygloat.valueInputs,
            oldPlaceholder: attribute === 'placeholder' ? value : input.__polygloat.oldPlaceholder,
            placeholderInputs: attribute === 'placeholder' ? inputs : input.__polygloat.placeholderInputs,
            touched: !!input.__polygloat.touched
        };

    }
}
