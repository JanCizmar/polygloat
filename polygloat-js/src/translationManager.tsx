// Select the node that will be observed for mutations
import {PolygloatService} from './polygloatService';
import * as ReactDOM from 'react-dom';
import {PolygloatViewer} from './component/PolygloatViewer';
import * as React from 'react';
import {createElement} from 'react';
import {TranslationData} from './DTOs/TranslationData';

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
    private polygloatModalContainer: Element;
    private _service: PolygloatService;
    private viewerComponent: PolygloatViewer;
    private _lang;
    private isKeyDown = (() => {
        let state = {};

        window.addEventListener('keyup', (e) => state[e.key] = false);
        window.addEventListener('keydown', (e) => state[e.key] = true);

        return (key) => state.hasOwnProperty(key) && state[key] || false;
    })();

    constructor(lang: string) {
        this._lang = lang;
    }

    public get lang() {
        return this._lang;
    }

    public set lang(value) {
        this._lang = value;
        this.renderTranslations(document.body, false, './');
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
        this.polygloatModalContainer = document.createElement('div');
        document.body.append(this.polygloatModalContainer);
        let element = createElement(PolygloatViewer, {service: this.service, manager: this});
        this.viewerComponent = ReactDOM.render(element, this.polygloatModalContainer);
    };

    private translationEdit = (input) => {
        this.viewerComponent.translationEdit(input);
    };


    public onTranslationChange = (data: TranslationData) => {
        let nodeList = document.evaluate(`//span[@data-polygloat-input='${data.input}']`, document.body);
        for (const span of nodeListToArray(nodeList)) {
            span.innerHTML = data.translations.get(this.lang);
        }
    };

    async renderTranslations(node: Element, addListener: boolean, xPathPrefix: string) {
        let nodeList = document.evaluate(`${xPathPrefix}/span[@data-polygloat-input]`, node);
        for (const span of nodeListToArray(nodeList)) {
            let input = span.getAttribute('data-polygloat-input');
            if (addListener) {
                span.addEventListener('mouseenter', () => this.translationHighlight(span, input));
            }
            span.innerHTML = await this.service.getTranslation(input, this.lang);
        }
    }

    private translationHighlight = (span, input) => {
        const clickListener = () => this.translationEdit(input);

        const leaveListener = () => {
            span.style.backgroundColor = null;
            span.removeEventListener('click', clickListener);
            span.removeEventListener('mouseleave', leaveListener);
            window.removeEventListener('keydown', altDownListener);
            window.removeEventListener('keyup', altUpListener);
            console.log('remove all listeners');
        };

        const altDownListener = () => {
            console.log('altdown');

            if (this.isKeyDown('Alt')) {
                doHighlight();
                window.addEventListener('keyup', altUpListener);
            }
            window.removeEventListener('keydown', altDownListener);
        };

        const doHighlight = () => {
            span.style.backgroundColor = 'yellow';
            span.addEventListener('click', clickListener);
        };

        const altUpListener = () => {
            console.log('altup');
            span.style.backgroundColor = null;
            span.removeEventListener('click', clickListener);
            window.addEventListener('keydown', altDownListener);
            window.removeEventListener('keyup', altUpListener);
        };

        window.addEventListener('keyup', altUpListener);


        if (this.isKeyDown('Alt')) {
            doHighlight();
        } else {
            window.addEventListener('keydown', altDownListener);
        }

        span.addEventListener('mouseleave', leaveListener);
    };

    private onNewNodes = async (nodes: Element[]) => {
        for (const node of nodes) {
            node.innerHTML = node.innerHTML.replace(/%-%polygloat:(.*?)%-%/gm, (_, g1) => {
                let escaped = g1.replace('"', '&quot;');
                return '<span data-polygloat-input="' + escaped + '">' + escaped + '</span>';
            });

            await this.renderTranslations(node, true, '.');
        }
    };


    private observer = new MutationObserver(
        async (mutationsList: MutationRecord[]) => {
            for (let mutation of mutationsList) {
                //console.log(mutation);
                if (mutation.type === 'childList') {
                    let nodes: XPathResult = document.evaluate('.//*[contains(text(), \'%-%polygloat:\')]', mutation.target);
                    //todo: wrap with iterable
                    await this.onNewNodes(nodeListToArray(nodes));
                }
            }
        });
}
