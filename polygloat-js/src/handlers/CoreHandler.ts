import {NodeHelper} from '../helpers/NodeHelper';
import {PolygloatService} from '../services/polygloatService';
import {BasicTextHandler} from './BasicTextHandler';
import {TextAreaHandler} from './TextAreaHandler';
import {injectable} from 'tsyringe';
import {EventService, EventType} from '../services/EventService';
import {Properties} from '../Properties';
import {InputHandler} from './InputHandler';

@injectable()
export class CoreHandler {
    constructor(private service: PolygloatService,
                private basicTextHandler: BasicTextHandler,
                private textAreaHandler: TextAreaHandler,
                private inputHandler: InputHandler,
                private eventService: EventService,
                private properties: Properties) {
        eventService.subscribe(EventType.TRANSLATION_CHANGED, () => {
            this.refresh();
        });
    }

    onNewNodes = async (nodes: Element[]): Promise<void> => {
        for (const node of nodes) {
            //texts inside newValue areas can not be replaced with spans, because it is not going to be rendered properly
            let textAreaParentList = NodeHelper.nodeListToArray(
                document.evaluate('./ancestor-or-self::*[name() = \'textarea\' or name() = \'input\']', node));
            if (textAreaParentList.length < 1) {
                await this.basicTextHandler.handleNewNode(node);
                continue;
            }
            if (node instanceof HTMLTextAreaElement) {
                await this.textAreaHandler.handleNewNode(node as HTMLTextAreaElement);
            }
            if (node instanceof HTMLInputElement) {
                await this.inputHandler.handleNewNode(node as HTMLInputElement);
            }
        }
    };

    async handleAttribute(mutation: MutationRecord) {
        const target = (mutation.target as HTMLElement);
        if (this.isAttributeAllowed(target.tagName, mutation.attributeName)) {
            if (target.getAttribute(mutation.attributeName).indexOf(this.properties.config.inputPrefix) > -1) {
                if (target.getAttribute('_polygloat') !== '') {
                    this.onNewNodes([target]);
                }
            }
        }
    }

    async refresh() {
        let nodeList = document.evaluate(`//*[@_polygloat]`, document.body);
        for (const node of NodeHelper.nodeListToArray(nodeList)) {
            if (node instanceof HTMLSpanElement) {
                await this.basicTextHandler.refresh(node);
                continue;
            }
            if (node instanceof HTMLTextAreaElement) {
                await this.textAreaHandler.refresh(node);
            }
            if (node instanceof HTMLInputElement) {
                await this.inputHandler.refresh(node);
            }
        }
    }

    isAttributeAllowed(tagName: string, attribute: string): boolean {
        let tagsFiltered = Object.keys(this.properties.config.tagAttributes).filter(k => k.toLowerCase() === tagName.toLowerCase());
        if (tagsFiltered.length < 1) {
            return false;
        }
        return this.properties.config.tagAttributes[tagsFiltered[0]]
            .filter(attr => attr.toLowerCase() === attribute.toLowerCase()).length > 0;
    }

}
