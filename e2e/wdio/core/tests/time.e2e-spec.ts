import { TimePo } from '../pages/time.po';
import {
    click,
    clickNextElement,
    clickPreviousElement,
    getNextElementText,
    getPreviousElementText,
    getText,
    pause,
    refreshPage,
} from '../../driver/wdio';
import { sections } from '../fixtures/appData/time-contents'

describe('Time component test', function () {
    const timePage = new TimePo();
    const {
        downArrow,
        UpArrow,
        hoursColumn,
        minutesColumn,
        secondsColumn,
        currentHour,
        currentMinute,
        currentSec,
        noSpinnersExample,
        programmaticallyExample,
        withoutSecondsExample,
        onlyHoursExample,
        set11HoursBtn,
        formExample,
        timeItem,
        enableTimeRow
    } = timePage;

    beforeAll(() => {
        timePage.open();
    }, 1);

    afterEach(() => {
        refreshPage();
    }, 2);

    it('Should check that change time by arrows works correct', () => {
        for (let i = 0; i < sections.length; i++) {
            if (sections[i] !== noSpinnersExample) {
                checkClockMoving(sections[i], 'arrowClick');
            }
        }
    });

    it('Should check that time changing by clicking on another digit', () => {
        for (let i = 0; i < sections.length; i++) {
            checkClockMoving(sections[i], 'buttonClick');
        }
    });

    it('Should check if the button Set Hours to 11 works correctly', () => {
        click(set11HoursBtn);
        expect(getText(programmaticallyExample + currentHour)).toEqual('11', 'Current hour is not 11');
    });

    it('should check that Enabled time to equal chosen time', () => {
        const chosenHourValue = getText(formExample + hoursColumn + timeItem, 15);
        click(formExample + hoursColumn + timeItem, 15);

        click(formExample + minutesColumn);
        const chosenMinuteValue = getText(formExample + minutesColumn + timeItem, 35);
        click(formExample + minutesColumn + timeItem, 35);

        click(formExample + secondsColumn);
        const chosenSecondValue = getText(formExample + secondsColumn + timeItem, 35);
        click(formExample + secondsColumn + timeItem, 35);

        expect(getText(enableTimeRow)).toEqual(chosenHourValue + 'h ' + chosenMinuteValue + 'm ' + chosenSecondValue + 's');
    });

    it('should check orientation', () => {
        timePage.checkRtlSwitch();
    });

    describe('visual regression', function () {
        it('should check examples visual regression', () => {
            timePage.saveExampleBaselineScreenshot();
            expect(timePage.compareWithBaseline()).toBeLessThan(5);
        });
    });

    function checkClockMoving(section: string, action: string): void {
        const nextHourValue = getNextElementText(section + currentHour);
        action === 'arrowClick' ? click(section + downArrow) : clickNextElement(section + currentHour);
        expect(getText(section + currentHour)).toEqual(nextHourValue, 'Current hour is not equal chosen value');

        if (section !== onlyHoursExample) {
            click(section + minutesColumn);
            const previousMinuteValue = getPreviousElementText(section + currentMinute);
            action === 'arrowClick' ? click(section + UpArrow) : clickPreviousElement(section + currentMinute);
            expect(getText(section + currentMinute)).toEqual(previousMinuteValue, 'Current hour is not equal chosen value');
        }

        if (section !== withoutSecondsExample && section !== onlyHoursExample) {
            click(section + secondsColumn);
            const previousSecondValue = getPreviousElementText(section + currentSec);
            action === 'arrowClick' ? click(section + UpArrow) : clickPreviousElement(section + currentSec);
            expect(getText(section + currentSec)).toEqual(previousSecondValue, 'Current hour is not equal chosen value');
        }
    }
});
