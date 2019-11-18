// Select the node that will be observed for mutations
import {PolygloatService} from './polygloatService';
import * as ReactDOM from 'react-dom';
import {PolygloatViewer} from './PolygloatViewer';
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

  polygloatModalContainer: Element;

  private static instance: TranslationManager;
  private service = new PolygloatService();

  public static getInstance(): TranslationManager {
    if (this.instance == null) {
      this.instance = new TranslationManager();
    }
    return this.instance;
  }

  private renderMoal = (translation) => {
    let element = createElement(PolygloatViewer);
    ReactDOM.render(element, this.polygloatModalContainer);
  };


  public manage = async () => {
    this.observer.observe(document.body, {attributes: true, childList: true, subtree: true});
    await this.service.fetchTranslations();
    this.polygloatModalContainer = document.createElement('div');
    document.body.append(this.polygloatModalContainer);
  };

  private onNewNodes = async (nodes: Element[]) => {
    for (const node of nodes) {
      node.innerHTML = node.innerHTML.replace(
        /%-%polygloat:(.*?)%-%/gm,
        '<span data-polygloat-input=\'$1\'>$1</span>');

      let nodeList = document.evaluate('./span[@data-polygloat-input]', node);
      for (const span of nodeListToArray(nodeList)) {
        let input = span.getAttribute('data-polygloat-input');
        span.innerHTML = await this.service.getTranslation(input);
      }
    }
  };

  private observer = new MutationObserver(
    async (mutationsList: MutationRecord[]) => {
      for (let mutation of mutationsList) {
        console.log(mutation);
        if (mutation.type === 'childList') {
          let nodes: XPathResult = document.evaluate('.//*[contains(text(), \'%-%polygloat:\')]', mutation.target);
          await this.onNewNodes(nodeListToArray(nodes));
        }
      }
    });
}
