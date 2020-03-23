import {NodeHelper} from '../helpers/NodeHelper';
import {PolygloatData, PolygloatSimpleSpanElement} from '../Types';
import {PolygloatService} from '../services/polygloatService';
import {Properties} from '../Properties';
import {container, injectable} from 'tsyringe';
import {TranslationHighlighter} from '../TranslationHighlighter';
import {Utils} from "tslint";

@injectable()
export class BasicTextHandler {
    private properties: Properties = container.resolve(Properties);
    private service: PolygloatService = container.resolve(PolygloatService);
    private highlighter: TranslationHighlighter = container.resolve(TranslationHighlighter);

    constructor() {
    }

    async refresh(node: Element) {
        const data = (node as PolygloatSimpleSpanElement).__polygloat;
        node.innerHTML = await this.service.translate(data.input, data.params, this.properties.currentLanguage);
    }

    async handleNewNode(node: Element): Promise<void> {
        let xPathResult = document.evaluate(`./text()[contains(.,'${this.properties.config.inputPrefix}')]`, node);

        for (const element of NodeHelper.nodeListToArray(xPathResult)) {
            //create virtual element to replace multiple text siblings in it
            const spanPromises: Promise<PolygloatSimpleSpanElement>[] = [];

            element.textContent.replace(this.service.unWrapRegex, (_, g1) => {
                spanPromises.push(this.createSpan(this.service.parseUnwrapped(g1)));
                return null;
            });

            element.replaceWith(...await Promise.all(spanPromises));
        }
    }

    readonly createSpan = async (data: PolygloatData): Promise<PolygloatSimpleSpanElement> => {
        const span: PolygloatSimpleSpanElement = document.createElement("span") as PolygloatSimpleSpanElement;
        span.setAttribute("_polygloat", "");

        this.addPolygloatToPrototype(span);

        span.__polygloat = {...data};
        let translation = await this.service.getTranslation(data.input, this.properties.currentLanguage);
        span.innerHTML = this.service.replaceParams(translation, data.params);

        this.highlighter.listen(span);
        return span;
    };

    private addPolygloatToPrototype(span) {
        let spanPrototype = Object.getPrototypeOf(span);
        spanPrototype.__polygloat = {};
    }
}
