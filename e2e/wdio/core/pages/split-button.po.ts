import { CoreBaseComponentPo } from './core-base-component.po';
import { waitForElDisplayed, waitForPresent, getElementArrayLength } from '../../driver/wdio';

export class SplitButtonPo extends CoreBaseComponentPo {
    private url = '/splitButton';

    root = '#page-content';

    buttonBehaviorExample = 'fd-split-button-behaviors-example ';
    iconBehaviorExample = 'fd-split-button-icons-example ';
    buttonTypesExample = 'fd-split-button-types-example ';
    buttonPragmaticalExample = 'fd-split-button-programmatical-example ';
    buttonTemplateExample = 'fd-split-button-template-example ';

    mainbtn = '.fd-button__text'
    arrowDownBtn = '.sap-icon--slim-arrow-down'
    icons = 'fd-icon';
    cartIcon = 'fd-icon.sap-icon--cart'
    menuIcon = 'fd-icon.sap-icon--menu'
    button = '.fd-button';
    splitMenu = 'div.fd-popover__popper'
    splitItem = '.fd-menu__list li';


    open(): void {
        super.open(this.url);
        waitForElDisplayed(this.root);
        waitForPresent(this.title);
    }

    getScreenshotFolder(): object {
        return super.getScreenshotFolder(this.url);
    }

    saveExampleBaselineScreenshot(specName: string = 'split-button'): void {
        super.saveExampleBaselineScreenshot(specName, this.getScreenshotFolder());
    }

    compareWithBaseline(specName: string = 'split-button'): any {
        return super.compareWithBaseline(specName, this.getScreenshotFolder());
    }
}
