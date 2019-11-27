import {NodeHelper} from '../helpers/NodeHelper';
import {PolygloatSimpleSpanElement} from '../Types';
import {PolygloatService} from '../services/polygloatService';
import {Properties} from '../Properties';
import {container, injectable} from 'tsyringe';
import {TranslationHighlighter} from '../TranslationHighlighter';

@injectable()
export class BasicTextHandler {
    private properties: Properties = container.resolve(Properties);
    private service: PolygloatService = container.resolve(PolygloatService);
    private highlighter: TranslationHighlighter = container.resolve(TranslationHighlighter);

    constructor() {
    }

    async refresh(node: Element) {
        let input = (node as PolygloatSimpleSpanElement).__polygloat.input;
        node.innerHTML = await this.service.getTranslation(input, this.properties.currentLanguage);
    }

    async handleNewNode(node: Element): Promise<void> {
        node.innerHTML = node.innerHTML.replace(
            new RegExp(`${this.properties.config.inputPrefix}(.*?)${this.properties.config.inputPostfix}`, 'gm'),
            '<span _polygloat>$1</span>');

        await this.renderTranslations(node, true, '.');
    }

    async renderTranslations(node: Element, addListener: boolean, xPathPrefix: string) {
        let nodeList = document.evaluate(`${xPathPrefix}/span[@_polygloat]`, node);
        for (const span of NodeHelper.nodeListToArray(nodeList)) {
            let input = span.innerHTML;

            this.addPolygloatToPrototype(span);

            if (addListener) {
                this.highlighter.listen(span);
            }

            (span as PolygloatSimpleSpanElement).__polygloat = {input};

            span.innerHTML = await this.service.getTranslation(input, this.properties.currentLanguage);
        }
    }

    private addPolygloatToPrototype(span) {
        let spanPrototype = Object.getPrototypeOf(span);
        spanPrototype.__polygloat = {};
    }
}
