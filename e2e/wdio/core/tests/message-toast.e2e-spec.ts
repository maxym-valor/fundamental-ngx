import { MessageToastPo } from '../pages/message-toast.po';
import {
    waitForElDisplayed,
    refreshPage,
    click,
    isElementDisplayed,
    pause,
    mouseHoverElement,
    doesItExist,
    scrollIntoView,
    getElementArrayLength,
} from '../../driver/wdio';

describe('Textarea component test', function () {
    const messageToastPage = new MessageToastPo();
    const {
        openMessageButton,
        hideAllButton,
        message
    } = messageToastPage;

    beforeAll(() => {
        messageToastPage.open();
    }, 1);

    beforeEach(() => {
        refreshPage();
        waitForElDisplayed(messageToastPage.title);
    }, 2);

    it('should check message from component', () => {
        click(openMessageButton);
        expect(isElementDisplayed(message)).toBe(true, 'message is not displayed');
        pause(7500);
        expect(doesItExist(message)).toBe(false, 'message still displayed');
        click(openMessageButton);
        mouseHoverElement(message);
        pause(10000);
        expect(isElementDisplayed(message)).toBe(true, 'message is not displayed');
    })

    it('should check message from template', () => {
        scrollIntoView(openMessageButton, 1);
        click(openMessageButton, 1);
        expect(isElementDisplayed(message)).toBe(true, 'message is not displayed');
        pause(4000);
        expect(doesItExist(message)).toBe(false, 'message still displayed');
    })

    it('should check message from string', () => {
        click(openMessageButton, 2);
        expect(isElementDisplayed(message)).toBe(true, 'message is not displayed');
        pause(5000);
        expect(doesItExist(message)).toBe(false, 'message still displayed');
    })

    it('should check that possible to open few messages in one time', () => {
        click(openMessageButton);
        click(openMessageButton, 1);
        expect(getElementArrayLength(message)).toBe(2, 'one of messages did not open');
    })

    it('should check working of Hide All button', () => {
        for (let i = 2; i >= 0; i--) {
            click(openMessageButton, i);
        }
        expect(getElementArrayLength(message)).toBe(3, 'not all messages displayed');
        scrollIntoView(hideAllButton);
        click(hideAllButton);
        expect(getElementArrayLength(message)).toBe(0, 'elements is not hidden');
        expect(doesItExist(message)).toBe(false, 'message still displayed');
    })

    it('should check orientation', () => {
        messageToastPage.checkRtlSwitch();
    });

    it('should check visual regression for all examples', () => {
        messageToastPage.saveExampleBaselineScreenshot();
        expect(messageToastPage.compareWithBaseline()).toBeLessThan(5);
    });

});
