import { FacestPo } from '../pages/facest.po';
import { getElementArrayLength, isElementClickable, refreshPage, waitForPresent } from '../../driver/wdio';

describe('dynamic side content test suite', function () {
    const facestPage = new FacestPo();
    const { linkFacestExample, link } = facestPage;

    beforeAll(() => {
        facestPage.open();
    }, 1);

    afterEach(() => {
        refreshPage();
        waitForPresent(link);
    }, 1);

    it('Should check that links is clickable', () => {
        const linkLength = getElementArrayLength(linkFacestExample + link);
        for (let i = 0; i < linkLength; i++) {
            expect(isElementClickable(linkFacestExample + link, i)).toBe(true)
        }
    })

    xdescribe('check orientation', function () {
        it('should check RTL and LTR orientation', () => {
            facestPage.checkRtlSwitch();
        });
    });

    xdescribe('Check visual regression', function () {
        it('should check examples visual regression', () => {
            facestPage.saveExampleBaselineScreenshot();
            expect(facestPage.compareWithBaseline()).toBeLessThan(1);
        });
    });
});
