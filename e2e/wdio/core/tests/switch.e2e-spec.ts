import {
    click,
    elementDisplayed,
    getAttributeByName,
    getElementArrayLength,
    getElementClass,
    refreshPage,
    waitForPresent
} from '../../driver/wdio';
import { switchPo } from '../../core/pages/switch.po';

describe('Switch test suite', () => {

    const switchPage = new switchPo();
    const {
        switchSizes, switchSizesExample, toggle,
        toggleInput, switchBindingExample, switchFormsExample, semanticswitchExample,
        playGroundSwitchExample, disabledToggle, acceptIcon, declineIcon, semanticSwitch,
        switchBtn, checkboxes
    } = switchPage;

    beforeAll(() => {
        switchPage.open();
    }, 1);

    afterEach(() => {
        refreshPage();
        waitForPresent(switchSizes);
    }, 1);

    it('Should check turn on/ Turn off switch toggle', () => {
        checkSwitchingWork(switchSizesExample);
        checkSwitchingWork(switchFormsExample);
        checkSwitchingWork(semanticswitchExample);
        checkSwitchingWork(switchBindingExample);
        checkSwitchingWork(playGroundSwitchExample);
    });

    it('Should check icons on semantic toggles', () => {
        for (let i = 0; i < 2; i++) {
            expect(elementDisplayed(declineIcon, i)).toBe(true);
            click(semanticSwitch, i);
            browser.pause(1000)
            expect(elementDisplayed(declineIcon, i)).toBe(false);
            expect(elementDisplayed(acceptIcon, i)).toBe(true);
        }
    });

    it('Should check toggle state changes by click on buttons', () => {
        click(switchBtn, 1);
        expect(checkToggleState(switchBindingExample)).toBe(true);
        click(switchBtn, 1);
        expect(checkToggleState(switchBindingExample)).toBe(false);
        click(switchBtn, 0);
        expect(checkToggleState(switchBindingExample)).toBe(true);
    });

    it('should check switch toggle manage by checkboxes', () => {
        click(checkboxes, 1)
        expect(checkToggleState(playGroundSwitchExample)).toBe(true)
        click(checkboxes, 2)
        expect(getElementClass(playGroundSwitchExample + toggle)).not.toContain('fd-switch--compact')
        click(checkboxes, 0)
        expect(getElementClass(playGroundSwitchExample + toggle)).toContain('is-disabled')
        click(checkboxes, 2)
        expect(getElementClass(playGroundSwitchExample + toggle)).toContain('fd-switch--compact')
    });

    it('should check RTL and LTR orientation', () => {
        switchPage.checkRtlSwitch();
    });

    it('should check examples visual regression', () => {
        switchPage.saveExampleBaselineScreenshot();
        expect(switchPage.compareWithBaseline()).toBeLessThan(5);
    });


    function checkSwitchingWork(section: string, length: number = getElementArrayLength(section + toggle),
        switchToggle: string = section + toggle, flag: string = section + toggleInput): void {
        for (let i = 0; i < length; i++) {
            if (getElementClass(switchToggle, i) != disabledToggle) {
                if (getAttributeByName(flag, 'aria-checked', i) == 'true') {
                    click(switchToggle, i);
                    expect(checkToggleState(section, i)).toBe(false);
                }
                else {
                    click(switchToggle, i);
                    expect(checkToggleState(section, i)).toBe(true);
                }
            }
        }
    }
    function checkToggleState(section: string, i: number = 0, flag: string = section + toggleInput): boolean {
        if (getAttributeByName(section + toggle, 'class', i) != disabledToggle) {
            if (getAttributeByName(flag, 'aria-checked', i) == 'true')
                return true;
            else return false;
        }
    }

});