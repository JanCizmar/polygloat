import {PolygloatViewer} from './component/PolygloatViewer';
import {createElement} from 'react';
import * as ReactDOM from 'react-dom';
import {PolygloatService} from './polygloatService';
import {TranslationManager} from './translationManager';
import {PolygloatSimpleSpanElement, PolygloatTextAreaElement} from './Types';

export class TranslationHighlighter {
    private viewerComponent: PolygloatViewer;
    private isKeyDown = (() => {
        let state = {};

        window.addEventListener('keyup', (e) => state[e.key] = false);
        window.addEventListener('keydown', (e) => state[e.key] = true);

        return (key) => state.hasOwnProperty(key) && state[key] || false;
    })();

    constructor(private service: PolygloatService, private manager: TranslationManager) {
        let polygloatModalContainer = document.createElement('div');
        document.body.append(polygloatModalContainer);
        let element = createElement(PolygloatViewer, {service: this.service, manager: this.manager});
        this.viewerComponent = ReactDOM.render(element, polygloatModalContainer);
    }

    listen(node: Element) {
        node.addEventListener('mouseenter', () => this.onMouseOver(node));
    };

    onMouseOver = (node): void => {
        const clickListener = () => this.translationEdit(node);

        const leaveListener = () => {
            node.style.backgroundColor = null;
            node.removeEventListener('click', clickListener);
            node.removeEventListener('mouseleave', leaveListener);
            window.removeEventListener('keydown', altDownListener);
            window.removeEventListener('keyup', altUpListener);
        };

        const altDownListener = () => {
            if (this.isKeyDown('Alt')) {
                doHighlight();
                window.addEventListener('keyup', altUpListener);
            }
            window.removeEventListener('keydown', altDownListener);
        };

        const doHighlight = () => {
            node.style.backgroundColor = 'yellow';
            node.addEventListener('click', clickListener);
        };

        const altUpListener = () => {
            node.style.backgroundColor = null;
            node.removeEventListener('click', clickListener);
            window.addEventListener('keydown', altDownListener);
            window.removeEventListener('keyup', altUpListener);
        };

        window.addEventListener('keyup', altUpListener);


        if (this.isKeyDown('Alt')) {
            doHighlight();
        } else {
            window.addEventListener('keydown', altDownListener);
        }

        node.addEventListener('mouseleave', leaveListener);
    };

    private getInput(node: Element): Promise<string> {
        return new Promise(resolve => {
            if (node instanceof HTMLSpanElement) {
                resolve((node as PolygloatSimpleSpanElement).__polygloat.input);
                return;
            }

            if (node instanceof HTMLTextAreaElement) {
                let textArea: PolygloatTextAreaElement = node as PolygloatTextAreaElement;
                textArea.addEventListener('blur', () => {
                    let position = textArea.selectionStart;
                    let nearest = textArea.__polygloat.valueInputs[0];
                    let nearestDistance;

                    for (const input of textArea.__polygloat.valueInputs) {
                        let translation = this.service.instant(input, this.manager.lang);
                        let index = 0;
                        let end = 0;
                        do {
                            index = textArea.value.indexOf(translation, end);
                            let start = index;

                            end = index + translation.length;
                            //check for total match (caret is inside of translation)
                            if (start < position && end > position) {
                                resolve(input);
                                return;
                            }
                            let distance = Math.min(Math.abs(position - start), Math.abs(position - end));
                            if (nearestDistance == undefined || distance < nearestDistance) {
                                nearestDistance = distance;
                                nearest = input;
                            }
                        } while (index > -1);
                    }
                    resolve(nearest);
                    return;
                });
                textArea.blur();
            }
        });
    }

    private translationEdit = async (node) => {
        let input = await this.getInput(node);
        this.viewerComponent.translationEdit(input);
    };
}
