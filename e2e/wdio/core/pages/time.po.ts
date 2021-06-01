import { CoreBaseComponentPo } from './core-base-component.po';
import { waitForElDisplayed, waitForPresent } from '../../driver/wdio';

export class TimePo extends CoreBaseComponentPo {
    private url = '/time';
    root = '#page-content';
   
    timeExapmple = 'fd-time-example ';
    TwelveExample = 'fd-time-12-example ';
    noSpinnersExample = 'fd-time-no-spinners-example ';
    sizesExample = 'fd-time-sizes-example ';
    programmaticallyExample = 'fd-time-programmatically-example ';
    withoutSecondsExample = 'fd-time-no-seconds-example ';
    onlyHoursExample = 'fd-time-only-hours-example ';
    twoDigitsExample = 'fd-time-two-digits-example ';
    i18n8Example = 'fd-time-i18n-example ';
    formExample = 'fd-time-form-example ';

    downArrow = 'button:nth-child(4)';
    UpArrow = 'button:nth-child(2)';

    hoursColumn = 'fd-time-column:nth-child(1) ';
    minutesColumn = 'fd-time-column:nth-child(2) ';
    secondsColumn = 'fd-time-column:nth-child(3) ';
    formatColumn = 'fd-time-column:nth-child(4) ul ';

    currentHour = this.hoursColumn + ' > .fd-time__wrapper ul > li:nth-child(12)';
    currentMinute = this.minutesColumn + ' > .fd-time__wrapper ul > li:nth-child(30)'
    currentSec = this.secondsColumn + ' > .fd-time__wrapper ul > li:nth-child(30)';

    set11HoursBtn = this.programmaticallyExample + '.fd-button--standard';
    timeItem = 'li.fd-time__item';
    enableTimeRow = this.formExample + 'span.ng-star-inserted'

    open(): void {
        super.open(this.url);
        waitForElDisplayed(this.root);
        waitForPresent(this.title);
    }

    getScreenshotFolder(): object {
        return super.getScreenshotFolder(this.url);
    }

    saveExampleBaselineScreenshot(specName: string = 'time'): void {
        super.saveExampleBaselineScreenshot(specName, this.getScreenshotFolder());
    }

    compareWithBaseline(specName: string = 'time'): any {
        return super.compareWithBaseline(specName, this.getScreenshotFolder());
    }
}
