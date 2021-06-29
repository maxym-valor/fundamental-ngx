import { StepInputPo } from '../pages/step-input.po';
import {
    refreshPage,
    getElementArrayLength,
    click,
    getValue,
    doubleClick,
    pause,
    getText,
    clearValue,
    setValue,
    getElementClass,
    sendKeys,
    isElementDisplayed
} from '../../driver/wdio';
import { sections } from '../fixtures/appData/step-input-content'

describe('Time component test', function () {
    const stepInputPage = new StepInputPo();
    const {
        formExample,
        labelExample,
        localExample,
        stateExample,
        configExample,
        defaultExample,
        currencyExample,
        step,
        input,
        plusButton,
        minusButton,
        text,
        textForDisabledExample
    } = stepInputPage;

    beforeAll(() => {
        stepInputPage.open();
    }, 1);

    afterEach(() => {
        refreshPage();
    }, 2);

    it('should check default example inputs', () => {
        for (let i = 0; i < sections.length; i++) {
            checkInputWorking(sections[i], 'click', 'positive')
            checkInputWorking(sections[i], 'click', 'negative')
            checkInputWorking(sections[i], 'type', 'negative')
            checkInputWorking(sections[i], 'type', 'positive')
        }
    })

    it('should check limitation for step-input', () => {

        setValue(configExample + input, '10', 5);
        expect(getElementClass(configExample + plusButton, 5)).toContain('is-disabled')
        setValue(configExample + input, '-10', 5);
        expect(getElementClass(configExample + minusButton, 5)).toContain('is-disabled')

    })

    it('should verify that in specific input step is 0.5', () => {
        setValue(configExample + plusButton, '0', 6);
        for (let i = 0; i < 6; i++) {
            click(configExample + plusButton, 6)
        }
        expect(parseFloat(getValue(configExample + input, 6)) / 6).toEqual(0.5)
    })

    it('should check Saudi Arabia locale', () => {
        setValue(localExample + input, '5', 2);
        sendKeys('Enter')
        expect(getValue(localExample + input, 2)).toEqual('٥')
    })

    it('should check input status for Input States example', () => {
        expect(getElementClass(stateExample + step, 0)).toContain('is-information');
        expect(getElementClass(stateExample + step, 1)).toContain('is-success');
        expect(getElementClass(stateExample + step, 2)).toContain('is-warning');
        expect(getElementClass(stateExample + step, 3)).toContain('is-error');
    })

    it('should check entering invalid values in inputs', () => {
        for (let i = 0; i < sections.length; i++) {
            checkInputWithInvalidValues(sections[i])
        }
    })

    it('should check disabled inputs', () => {
        const defaultValue = getValue(formExample + input, 2);
        expect(getElementClass(formExample + step, 2)).toContain('is-disabled'); 
        click(formExample + plusButton, 2);
        expect(getValue(formExample + input, 2)).toEqual(defaultValue);

        expect(getElementClass(formExample + step, 3)).toContain('is-readonly'); 
        expect(isElementDisplayed(formExample + plusButton, 3)).toBe(false);
        expect(isElementDisplayed(formExample + minusButton, 3)).toBe(false);
    })

    it('should check RTL orientation', () => {
        stepInputPage.checkRtlSwitch();
    })

    it('should check examples visual regression', () => {
        stepInputPage.saveExampleBaselineScreenshot();
        expect(stepInputPage.compareWithBaseline()).toBeLessThan(5);
    })

    function checkInputWithInvalidValues(section: string) {
        let inputLength = getElementArrayLength(section + input);
        let defaultValue;
        section == formExample || section == localExample ? inputLength = 2 : ''
        for (let i = 0; i < inputLength; i++) {
            defaultValue = getValue(section + input, i)
            setValue(section + input, 'asd123', i)
            sendKeys('Enter')
            expect(getValue(section + input, i)).toEqual(defaultValue)
        }
    }

    function checkInputWorking(section: string, way: 'click' | 'type', sign: 'positive' | 'negative') {
        let inputLength = getElementArrayLength(section + input);
        section === formExample || section === localExample ? inputLength = 2 : ''
        let plusValue = 5;
        let minusValue = -5;
        let steps = 5;
        let additionalText;
        let expectedValue
        for (let i = 0; i < inputLength; i++) {
            additionalText = '';
            setValue(section + input, '0', i)
            if (way === 'click') {
                for (let j = 0; j < steps; j++) {
                    sign === 'positive' ? click(section + plusButton, i) : click(section + minusButton, i);
                }
            }
            if (way === 'type') {
                sign === 'positive' ? setValue(section + input, plusValue.toString(), i) : setValue(section + input, minusValue.toString(), i)
                sendKeys('Enter')
            }

            section === configExample && i === 0 ? additionalText = '.0000' : '';
            section === currencyExample && i === 0 || section == currencyExample && i === 2 ? additionalText = '.00' : '';

            sign === 'positive' ? section === configExample && i === 6 && way === 'click' ? expectedValue = plusValue / 2 : expectedValue = plusValue : ''
            sign === 'negative' ? section === configExample && i === 6 && way === 'click' ? expectedValue = minusValue / 2 : expectedValue = minusValue : ''

            expect(getValue(section + input, i)).toEqual(expectedValue.toString() + additionalText);
            section !== formExample ? expect(getText(section + text, i)).toEqual(`Value: ${expectedValue.toString()}`) : ''

            if (section === formExample) {
                i === 0 ? expect(getText(textForDisabledExample)).toEqual(`${expectedValue.toString()}`) : ''
                i === 1 ? expect(getText(section + text)).toEqual(`Value: ${expectedValue.toString()}`) : ''
            }

        }
    }

});
