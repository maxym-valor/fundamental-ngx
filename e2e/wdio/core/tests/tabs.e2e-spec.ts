import {
    browserIsFirefox,
    click,
    doubleClick,
    getAttributeByName,
    getElementArrayLength,
    getElementClass,
    getText,
    refreshPage,
    scrollIntoView,
    setValue,
    waitForPresent,
} from '../../driver/wdio';
import { TabsPo } from '../pages/tabs.po';

describe('Tabs test suite', () => {

    const tabsPage = new TabsPo();
    const {
        AddExample, tabsExample, FilterExample, ProcessExample, IconOnlyExample, SelectionExample,
        collapsibleExample, stackendContentExample, collapsibleOverflowExample,
        fdTab, addBtn, removeBtn, chooseTabsBtn, expandedListItem, moreBtn, tabPanel,
        modeSelect, iconOnlyMode, compactCheckBox, threeElementsRow, titleField,
        counterField, icon1, titleAndCountSection, contentSection, collapsibleTab, acceleratedIcon,
        fdIcon, filterMode, fdTabFF
    } = tabsPage;

    beforeAll(() => {
        tabsPage.open();
    }, 1);

    afterEach(() => {
        refreshPage();
        waitForPresent(fdTab);
    }, 1);

    it('check tabs select', () => {
        expect(checkTabsSelect(tabsExample)).toBe(true, 'One of the tabs is not selected');
        expect(checkTabsSelect(IconOnlyExample)).toBe(true, 'One of the tabs is not selected');
        expect(checkTabsSelect(ProcessExample)).toBe(true, 'One of the tabs is not selected');
        expect(checkTabsSelect(FilterExample)).toBe(true, 'One of the tabs is not selected');
        expect(checkTabsSelect(AddExample)).toBe(true, 'One of the tabs is not selected');
        expect(checkTabsSelect(collapsibleOverflowExample)).toBe(true, 'One of the tabs is not selected');
        expect(checkTabsSelect(collapsibleExample)).toBe(true, 'One of the tabs is not selected');
        expect(checkTabsSelect(SelectionExample)).toBe(true, 'One of the tabs is not selected');
        expect(checkTabsSelect(stackendContentExample)).toBe(true, 'One of the tabs is not selected');
    });

    it('add-remove tab testing', () => {
        const originalLength = getElementArrayLength(AddExample + fdTab);
        click(addBtn);
        let newLength = getElementArrayLength(AddExample + fdTab);
        expect(newLength).toBeGreaterThan(originalLength);
        doubleClick(removeBtn);
        newLength = getElementArrayLength(AddExample + fdTab);
        expect(originalLength).toBeGreaterThan(newLength)
        for (newLength; newLength !== 1; newLength--) {
            click(removeBtn)
        }
        click(removeBtn)
        const lengthAfterRemoving = getElementArrayLength(AddExample + fdTab);
        // Check that the last tab can not be removed
        expect(lengthAfterRemoving).toEqual(1)

    });

    it('Check choosing tabs via buttons', () => {
        click(chooseTabsBtn, 1)
        expect(getAttributeByName(SelectionExample + fdTab, 'aria-selected', 1)).toEqual('true')
        click(chooseTabsBtn)
        expect(getAttributeByName(SelectionExample + fdTab, 'aria-selected', 0)).toEqual('true')
        expect(getAttributeByName(SelectionExample + fdTab, 'aria-selected', 1)).toEqual('false')
    });

    it('check collapsible overflow', () => {
        scrollIntoView(collapsibleOverflowExample)
        const length = getElementArrayLength(collapsibleOverflowExample + collapsibleTab);
        const lastPointOfMainList = getText(collapsibleOverflowExample + collapsibleTab, length - 1);
        click(moreBtn)
        const firstPointOfExpandedList = getText(expandedListItem);
        click(expandedListItem);
        expect(getText(expandedListItem)).toEqual(lastPointOfMainList);
        expect(getText(collapsibleOverflowExample + collapsibleTab, length - 1)).toEqual(firstPointOfExpandedList);
    });

    it('Should check collapsible tabs', () => {
        scrollIntoView(collapsibleExample)
        clickOnTab(collapsibleExample, 2);
        expect(getAttributeByName(tabPanel, 'aria-expanded', 2)).toEqual('true');
    });

    xdescribe('Tabs constructor testing', () => {

        it('Check that tabs change according to chosen filter and compact modes', () => {
            const myTittle = 'my custom title';
            const myCount = 'my count';
            const myContent = 'my content';
            click(modeSelect)
            click(filterMode)
            click(compactCheckBox)
            expect(getAttributeByName(threeElementsRow, 'ng-reflect-compact')).toEqual('true')
            expect(getElementClass('playground .fd-tabs')).toContain('fd-tabs--filter')
            setValue(titleField, myTittle); setValue(counterField, myCount); setValue(counterField, myContent);
            expect(getText(titleAndCountSection)).toContain(myTittle)
            expect(getText(titleAndCountSection)).toContain(myCount)
            expect(getText(contentSection)).toEqual(myContent)
        });

        it('check that icon changes according to chosen', () => {
            click(modeSelect)
            click(iconOnlyMode)
            click(compactCheckBox)
            click(icon1)
            click(acceleratedIcon)
            expect(getElementClass(fdIcon)).toContain('sap-icon--accelerated')
        });

    });

    xit('should check examples visual regression', () => {
        tabsPage.saveExampleBaselineScreenshot();
        expect(tabsPage.compareWithBaseline()).toBeLessThan(5);
    });

    it('should check RTL and LTR orientation', () => {
        tabsPage.checkRtlSwitch();
    });

    function checkTabsSelect(section: string): boolean {
        let length;
        if (section === collapsibleOverflowExample) {
            length = getElementArrayLength(section + fdTab) - 3
        }
        if (section !== collapsibleOverflowExample) {
            length = getElementArrayLength(section + fdTab)
        }
        for (let i = 0; i < length; i++) {
            if (section === collapsibleExample && i === 0) {
                click(section + fdTab, i)
                if (getAttributeByName(section + fdTab, 'aria-selected', i) === 'true') {
                    return false;
                }
            }
            if (section === stackendContentExample && i === 0) {
                expect(getAttributeByName(section + fdTab, 'aria-selected', i)).toEqual('true')
            }
            if (section !== collapsibleExample && section !== stackendContentExample && i !== 0) {
                click(section + fdTab, i)
                if (getAttributeByName(section + fdTab, 'aria-selected', i) !== 'true') {
                    return false;
                }
            }
        }
        return true;
    }

    function clickOnTab(section: string, index: number = 0): void {
        return (browserIsFirefox() ? click(section + fdTabFF, index) : click(section + fdTab, index))
    }

});