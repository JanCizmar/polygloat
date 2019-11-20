// Select the node that will be observed for mutations
import {PolygloatService} from './polygloatService';
import * as ReactDOM from 'react-dom';
import {PolygloatViewer} from './component/PolygloatViewer';
import {createElement} from 'react';

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
    polygloatModalContainer: Element;
    private service = new PolygloatService();
    private viewerComponent: PolygloatViewer;

    private is_key_down = (() => {
        let state = {};

        window.addEventListener('keyup', (e) => state[e.key] = false);
        window.addEventListener('keydown', (e) => state[e.key] = true);

        return (key) => state.hasOwnProperty(key) && state[key] || false;
    })();

    public static getInstance(): TranslationManager {
        if (this.instance == null) {
            this.instance = new TranslationManager();
        }
        return this.instance;
    }

    public manage = async () => {
        this.observer.observe(document.body, {attributes: true, childList: true, subtree: true});
        await this.service.fetchTranslations();
        this.polygloatModalContainer = document.createElement('div');
        document.body.append(this.polygloatModalContainer);
        let element = createElement(PolygloatViewer);
        this.viewerComponent = ReactDOM.render(element, this.polygloatModalContainer);
    };

    private translationEdit = (input) => {
        this.viewerComponent.translationEdit(input);
    };

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

            if (this.is_key_down('Alt')) {
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


        if (this.is_key_down('Alt')) {
            doHighlight();
        } else {
            window.addEventListener('keydown', altDownListener);
        }

        span.addEventListener('mouseleave', leaveListener);
    };

    private onNewNodes = async (nodes: Element[]) => {
        for (const node of nodes) {
            node.innerHTML = node.innerHTML.replace(
                /%-%polygloat:(.*?)%-%/gm,
                '<span data-polygloat-input=\'$1\'>$1</span>');

            let nodeList = document.evaluate('./span[@data-polygloat-input]', node);
            for (const span of nodeListToArray(nodeList)) {
                let input = span.getAttribute('data-polygloat-input');
                span.addEventListener('mouseenter', () => this.translationHighlight(span, input));
                span.innerHTML = await this.service.getTranslation(input);
            }
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
