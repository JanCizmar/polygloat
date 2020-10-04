import {container, injectable} from "tsyringe";
import {NodeHelper} from "../helpers/NodeHelper";
import {CoreHandler} from "../handlers/CoreHandler";
import {Properties} from "../Properties";

@injectable()
export class Observer {
    constructor(private properties: Properties) {
    }

    private coreHandler: CoreHandler = container.resolve(CoreHandler);
    private observer = new MutationObserver(
        async (mutationsList: MutationRecord[]) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'characterData') {
                    if (!!mutation.target.parentElement) {
                        await this.coreHandler.onNewNodes([mutation.target.parentElement]);
                    }
                }
                if (mutation.type === 'childList') {
                    await this.handleSubtree(mutation.target);
                }
                if (mutation.type === 'attributes') {
                    await this.coreHandler.handleAttribute(mutation);
                }
            }
        });

    private async handleSubtree(target: Node) {
        let nodes: XPathResult = document.evaluate(`./descendant-or-self::*[contains(text(), \'${this.properties.config.inputPrefix}\')]`, target);
        let inputNodes = (target as Element).getElementsByTagName("input");// document.evaluate('.//input', target);
        let polygloatInputs = Array.from(inputNodes)//NodeHelper.nodeListToArray(inputNodes)
            .filter(i => i.value.indexOf(this.properties.config.inputPrefix) > -1);

        const newNodes = NodeHelper.nodeListToArray(nodes).concat(polygloatInputs);
        if (newNodes.length) {
            await this.coreHandler.onNewNodes(newNodes);
        }
    }

    public observe() {
        this.observer.observe(document.body, {attributes: true, childList: true, subtree: true, characterData: true});
    }

    public stopObserving() {
        this.observer.disconnect();
    }
}