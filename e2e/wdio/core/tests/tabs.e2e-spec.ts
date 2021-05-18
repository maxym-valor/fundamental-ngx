import {
    click,
    doubleClick,
    getAttributeByName,
    getElementArrayLength,
    getElementClass,
    getText,
    refreshPage,
    setValue,
    waitForPresent,
} from '../../driver/wdio';
import { tabsPo } from '../../core/pages/tabs.po';

describe('Tabs test suite', () => {

    const tabsPage = new tabsPo();
    const {
        AddExample, tabsExample, FilterExample, ProcessExample, IconOnlyExample, SelectionExample,
        collapsibleExample, stackendContentExample, collapsibleOverflowExample,
        fdTab, addBtn, removeBtn, chooseTabsBtn, expandedListPoint, moreBtn, tabPanel,
        modeSelect, iconOnlyMode, compactCheckBox, threeElementsRow, titleField,
        counterField, contentField, icon1, titleAndCountSection, contentSection, collapsibleTab, acceleratedIcon,
        fdIcon, filterMode
    } = tabsPage;

    beforeAll(() => {
        tabsPage.open();
    }, 1);

    afterEach(() => {
        refreshPage();
        waitForPresent(fdTab);
    }, 1);

    it('check tabs select', () => {
        expect(checkTabsSelect(tabsExample)).toBe(true);
        expect(checkTabsSelect(IconOnlyExample)).toBe(true);
        expect(checkTabsSelect(ProcessExample)).toBe(true);
        expect(checkTabsSelect(FilterExample)).toBe(true);
        expect(checkTabsSelect(AddExample)).toBe(true);
        expect(checkTabsSelect(collapsibleOverflowExample)).toBe(true);
        expect(checkTabsSelect(collapsibleExample)).toBe(true);
        expect(checkTabsSelect(SelectionExample)).toBe(true);
        expect(checkTabsSelect(stackendContentExample)).toBe(true);
    });

    it('add-remove tab testing', () => {
        const lengthBefore = getElementArrayLength(AddExample + fdTab);
        click(addBtn);
        let lengthAfter = getElementArrayLength(AddExample + fdTab);
        expect(lengthAfter).toBeGreaterThan(lengthBefore);
        doubleClick(removeBtn);
        lengthAfter = getElementArrayLength(AddExample + fdTab);
        expect(lengthBefore).toBeGreaterThan(lengthAfter)
        for (lengthAfter; lengthAfter != 1; lengthAfter--)
            click(removeBtn)
        click(removeBtn)
        lengthAfter = getElementArrayLength(AddExample + fdTab);
        // Check that the last tab can not be removed
        expect(lengthAfter).toEqual(1)

    });

    it('Check choosing tabs via buttons', () => {
        click(chooseTabsBtn, 1)
        expect(getAttributeByName(SelectionExample + fdTab, 'aria-selected', 1)).toEqual('true')
        click(chooseTabsBtn, 0)
        expect(getAttributeByName(SelectionExample + fdTab, 'aria-selected', 0)).toEqual('true')
        expect(getAttributeByName(SelectionExample + fdTab, 'aria-selected', 1)).toEqual('false')
    });

    it('check collapsible overflow', () => {
        const length = getElementArrayLength(collapsibleOverflowExample + collapsibleTab);
        const lastPointOfMainList = getText(collapsibleOverflowExample + collapsibleTab, length - 1);
        click(moreBtn)
        const firstPointOfExpandedList = getText(expandedListPoint, 0);
        click(expandedListPoint, 0);
        expect(getText(expandedListPoint, 0)).toEqual(lastPointOfMainList);
        expect(getText(collapsibleOverflowExample + collapsibleTab, length - 1)).toEqual(firstPointOfExpandedList);
    });
    it('Should check collapsible tabs', () => {
        click(collapsibleExample + fdTab, 2);
        expect(getAttributeByName(tabPanel, 'aria-expanded', 2)).toEqual('true');
    });


    describe('Tabs constructor testing', () => {
        it('filter mode', () => {
            const myTittle = 'my custom title';
            const myCount = 'my count';
            const myContent = 'my content';
            click(modeSelect)
            click(filterMode)
            click(compactCheckBox)
            expect(getAttributeByName(threeElementsRow, 'ng-reflect-compact')).toEqual('true')
            // these assertions skipped due wdio bug
            //expect(getAttributeByName(threeElementsRow, 'ng-reflect-mode')).toEqual('filter')
            //expect(getElementClass('playground .fd-tabs')).toContain('fd-tabs--filter')
            setValue(titleField, myTittle); setValue(counterField, myCount); setValue(contentField, myContent);
            expect(getText(titleAndCountSection)).toContain(myTittle)
            expect(getText(titleAndCountSection)).toContain(myCount)
            expect(getText(contentSection)).toEqual(myContent)
        });
        // skipped due a wdio bug
        xit('icon only', () => {
            click(modeSelect)
            click(iconOnlyMode)
            click(compactCheckBox)
            click(icon1)
            click(acceleratedIcon)
            expect(getElementClass(fdIcon, 0)).toContain('sap-icon--accelerated')
        });



    });

    it('should check examples visual regression', () => {
        tabsPage.saveExampleBaselineScreenshot();
        expect(tabsPage.compareWithBaseline()).toBeLessThan(5);
    });

    it('should check RTL and LTR orientation', () => {
        tabsPage.checkRtlSwitch();
    });




    function checkTabsSelect(section: string): boolean {
        let length;
        if (section == collapsibleOverflowExample) {
            length = getElementArrayLength(section + fdTab) - 3
        }
        else length = getElementArrayLength(section + fdTab)
        for (let i = 0; i < length; i++) {
            if (section == collapsibleExample && i == 0) {
                click(section + fdTab, i)
                if (getAttributeByName(section + fdTab, 'aria-selected', i) == 'true')
                    return false;
            }
            else if (section == stackendContentExample && i == 0) {
                expect(getAttributeByName(section + fdTab, 'aria-selected', i)).toEqual('true')
            }
            else {
                click(section + fdTab, i)
                if (getAttributeByName(section + fdTab, 'aria-selected', i) != 'true')
                    return false;
            }
        }
        return true;
    }

});