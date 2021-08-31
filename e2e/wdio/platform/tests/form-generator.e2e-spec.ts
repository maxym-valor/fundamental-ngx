import {
    click,
    getElementArrayLength, 
    getElementClass,
    getText,
    refreshPage,
    waitForElDisplayed,
    scrollIntoView,
    getValue,
    sendKeys,
    isElementDisplayed,
    doesItExist,
    setValue,
    clickAndMoveElement
} from '../../driver/wdio';
import {
    requiredErrorMessage, termsErrorMesssage, frameworkErrorMessage,
    birthdayYearErrorMessage, passwordConditionsErrorMessage
} from '../fixtures/testData/form-generator'
import { FormGeneratorPo } from '../pages/form-generator.po';

describe('Form generator test suite', function () {
    const formGeneratorPage = new FormGeneratorPo();
    const {
        errorExample, customExample, defaultExample, observableExample, fieldLayoutExample, programmaticExample,
        nameInput, passwordInput, ageInput, dateInput, radioButton, checkbox, submitButton, mainSpecialitySelect, 
        calendarInputGroup, errorMessage, radioButtonLabel, sliderPoint, formValue, validationInput
    } = formGeneratorPage;

    beforeAll(() => {
        formGeneratorPage.open();
    }, 1);

    beforeEach(() => {
        refreshPage();
        waitForElDisplayed(formGeneratorPage.title);
    }, 1);

    it('should check validation for required fields', () => {
        checkGeneralValidation(fieldLayoutExample);
        checkGeneralValidation(defaultExample);
        checkGeneralValidation(observableExample);
        checkGeneralValidation(programmaticExample);
    });

    it('should check framework error messages', () => {
        checkFrameworkValidation(defaultExample);
        checkFrameworkValidation(observableExample);
        checkFrameworkValidation(programmaticExample);
        checkFrameworkValidation(fieldLayoutExample);
    });

    it('should check permissions error', () => {
        checkPermissionsValidation(defaultExample);
        checkPermissionsValidation(observableExample);
        checkPermissionsValidation(programmaticExample);
        checkPermissionsValidation(fieldLayoutExample);
    });

    it('should check birtday year error message', () => {
        checkBirthdayValidation(defaultExample);
        checkBirthdayValidation(observableExample);
        checkBirthdayValidation(programmaticExample);
        checkBirthdayValidation(fieldLayoutExample);
    })

    it('should check password validation', () => {
        checkPasswordValidation(defaultExample);
        checkPasswordValidation(observableExample);
        checkPasswordValidation(programmaticExample);
        checkPasswordValidation(fieldLayoutExample);
    });

    it('should check custom controls example', () => {
        scrollIntoView(sliderPoint);
        clickAndMoveElement(sliderPoint, -400, 0);
        expect(doesItExist(formValue)).toBe(false, 'form value row exists');
        click(customExample + submitButton);
        expect(getText(formValue)).toEqual('Form value: { "some_slider": { "value": 20, "label": "Twenty" } }');
    })

    it('should check custom error example', () => {
        click(errorExample + submitButton);
        checkSpecificValidation(errorExample, validationInput, requiredErrorMessage);
        checkSpecificValidation(errorExample, validationInput, requiredErrorMessage, 1);
        setValue(errorExample + validationInput, '1');
        setValue(errorExample + validationInput, '1', 1);
        expect(doesItExist(errorMessage)).toBe(false, 'error message still visible');
    })

    it('should check RTL', () => {
        formGeneratorPage.checkRtlSwitch();
    });

    function checkPasswordValidation(section: string): void {
        setValue(section + passwordInput, '123');
        checkSpecificValidation(section, passwordInput, passwordConditionsErrorMessage);
        setValue(section + passwordInput, 'FundamentalNgx12#');
        expect(doesItExist(errorMessage)).toBe(false, 'error message exists');
    }

    function checkBirthdayValidation(section: string): void {
        scrollIntoView(section + dateInput);
        setValue(section + dateInput, '1/1/2020');
        checkSpecificValidation(section, calendarInputGroup, birthdayYearErrorMessage);
        setValue(section + dateInput, '1/1/2019');
        expect(doesItExist(errorMessage)).toBe(false, 'error message exists');
    }

    function checkPermissionsValidation(section: string): void {
        scrollIntoView(section + radioButtonLabel, 1);
        checkSpecificValidation(section, radioButtonLabel, termsErrorMesssage, 1);
        click(section + radioButtonLabel);
        expect(doesItExist(errorMessage)).toBe(false, 'error message exists');
    }

    function checkFrameworkValidation(section: string): void {
        scrollIntoView(section + radioButtonLabel);
        checkSpecificValidation(section, radioButtonLabel, frameworkErrorMessage, 3);
        checkSpecificValidation(section, radioButtonLabel, frameworkErrorMessage, 4);
        click(section + radioButtonLabel, 2);
        expect(doesItExist(errorMessage)).toBe(false, 'error message exists');
    }

    function checkGeneralValidation(section: string): void {
        scrollIntoView(section);
        click(section + nameInput);

        const nameLength = getValue(section + nameInput).length;
        for (let i = 0; i < nameLength; i++) {
            sendKeys('Backspace');
        }

        const ageLength = getValue(section + ageInput).length;
        click(section + ageInput);
        for (let i = 0; i < ageLength; i++) {
            sendKeys('Backspace');
        }

        click(section + submitButton);

        checkSpecificValidation(section, nameInput, requiredErrorMessage);
        checkSpecificValidation(section, ageInput, requiredErrorMessage);
        checkSpecificValidation(section, passwordInput, requiredErrorMessage);
        checkSpecificValidation(section, calendarInputGroup, requiredErrorMessage);

        if (section == defaultExample) {
            expect(getElementClass(section + mainSpecialitySelect)).toContain('is-error', 'element is not highlited by error');
        }

        for (let i = 0; i < getElementArrayLength(section + radioButton); i++) {
            expect(getElementClass(section + radioButton, i)).toContain('is-error', 'no error for radio button');
        }
        for (let i = 0; i < getElementArrayLength(section + checkbox); i++) {
            expect(getElementClass(section + checkbox, i)).toContain('is-error', 'no error for checkbox');
        }
    }

    function checkSpecificValidation(section: string, item: string, message: string, i: number = 0): void {
        click(section + item, i);
        expect(isElementDisplayed(errorMessage)).toBe(true, 'error message is not displayed');
        expect(getText(errorMessage)).toEqual(message, 'error message is not match');
    }

});
