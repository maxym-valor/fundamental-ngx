import { SplitterPo } from '../pages/spltiller.po';
import {
    click,
    getElementArrayLength,
    refreshPage,
    scrollIntoView,
    waitForElDisplayed,
    getAttributeByName,
    clickAndMoveElement,
    getAttributeByNameArr,
    getElementSize,
    waitForPresent,
    isElementDisplayed,
    pause,
    dragAndDrop,
    getCurrentUrl
} from '../../driver/wdio';

describe('Standard List test suite', function () {
    const splitterPage = new SplitterPo();
    const {
        basicExample,
        splitterSection,
        requiredWidthExample,
        sliderApiExample,
        button,
        resizer,
        paginationItem
    } = splitterPage;

    beforeAll(() => {
        splitterPage.open();
    }, 1);

    beforeEach(() => {
        refreshPage();
        waitForPresent(splitterPage.root);
        waitForElDisplayed(splitterPage.title);
    }, 1);

    describe('Basic example', () => {
        it('should check horizontal resizing', () => {
            checkHorizontalResize(basicExample);
        });

        it('should check hiding section by resizing', () => {
            checkHidingSections(basicExample);
        });

        it('should check hiding nested sections', () => {
            // if (getCurrentUrl().includes('localhost')) {
            //     return;
            // }
            scrollIntoView(basicExample + splitterSection);
            const firstNestedSectionHeight = getElementSize(basicExample + splitterSection, 5, 'height');
            clickAndMoveElement(basicExample + resizer, 0, firstNestedSectionHeight, 3);

            expect(getAttributeByName(basicExample + splitterSection, 'style', 5)).toContain('height: 0');
            scrollIntoView(basicExample + resizer, 2);
            const secondNestedSectionHeight = getElementSize(basicExample + splitterSection, 4, 'height');
            clickAndMoveElement(basicExample + resizer, 0, secondNestedSectionHeight, 2);
            expect(getAttributeByName(basicExample + splitterSection, 'style', 4)).toContain('height: 0');
        });
    });

    describe('Required parent width example', () => {
        it('should check resizing', () => {
            checkHorizontalResize(requiredWidthExample);
        });

        it('should check hiding section by resizing', () => {
            checkHidingSections(requiredWidthExample);
        });
    });

    describe('Slider API example', () => {
        it('should check horizontal resizing', () => {
            checkHorizontalResize(sliderApiExample);
        });

        it('should check hiding section by resizing', () => {
            checkHidingSections(sliderApiExample);
        });

        it('should check hiding sections by buttons', () => {
            click(sliderApiExample + button);
            expect(getElementArrayLength(sliderApiExample + splitterSection)).toBe(2);

            click(paginationItem, 1);
            expect(getElementArrayLength(sliderApiExample + splitterSection)).toBe(1);

            click(paginationItem, 0);
            expect(getElementArrayLength(sliderApiExample + splitterSection)).toBe(2);

            click(sliderApiExample + button, 1);
            expect(getElementArrayLength(sliderApiExample + splitterSection)).toBe(3);
        });
    });


    function checkHidingSections(section: string): void {
        // if (getCurrentUrl().includes('localhost')) {
        //     return;
        // }
        scrollIntoView(section + splitterSection);
        const firstSectionWidth = getElementSize(section + splitterSection, 0, 'width');
        clickAndMoveElement(section + resizer, -firstSectionWidth, 0);

        expect(getAttributeByName(section + splitterSection, 'style', 0)).toContain('width: 0');

        const thirdSectionWidth = getElementSize(section + splitterSection, 2, 'width');
        clickAndMoveElement(section + resizer, thirdSectionWidth, 0, 1);
        expect(getAttributeByName(section + splitterSection, 'style', 2)).toContain('width: 0');

        const secondSectiondWidth = getElementSize(section + splitterSection, 1, 'width');
        clickAndMoveElement(section + resizer, -secondSectiondWidth, 0, 1);
        expect(getAttributeByName(section + splitterSection, 'style', 2)).not.toContain('width: 0');
        expect(getAttributeByName(section + splitterSection, 'style', 1)).toContain('width: 0');
    }

    function checkHorizontalResize(section: string): void {
        scrollIntoView(section + splitterSection);
        const defaultSizesOfSections = getAttributeByNameArr(section + splitterSection, 'style');

        clickAndMoveElement(section + resizer, -200, 0);
        expect(getAttributeByName(section + splitterSection, 'style')).not.toEqual(defaultSizesOfSections[0]);

        clickAndMoveElement(section + resizer, 200, 0, 1);
        expect(getAttributeByName(section + splitterSection, 'style', 1)).not.toEqual(defaultSizesOfSections[1]);
        expect(getAttributeByName(section + splitterSection, 'style', 2)).not.toEqual(defaultSizesOfSections[2]);
    }

});
