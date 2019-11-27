export class NodeHelper {
    static nodeListToArray = (nodeList: XPathResult): Element[] => {
        let node: Element;
        const nodeArray: Element[] = [];
        // @ts-ignore
        while ((node = nodeList.iterateNext()) !== null) {
            nodeArray.push(node);
        }
        return nodeArray;
    };
}
