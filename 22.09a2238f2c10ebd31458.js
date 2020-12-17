(window.webpackJsonp=window.webpackJsonp||[]).push([[22],{Athy:function(e,t,n){"use strict";n.r(t),n.d(t,"DatetimePickerDocsModule",(function(){return fe}));var a={};n.r(a),n.d(a,"default",(function(){return C}));var o={};n.r(o),n.d(o,"default",(function(){return T}));var i={};n.r(i),n.d(i,"default",(function(){return A}));var d={};n.r(d),n.d(d,"default",(function(){return w}));var c={};n.r(c),n.d(c,"default",(function(){return Q}));var r={};n.r(r),n.d(r,"default",(function(){return P}));var l={};n.r(l),n.d(l,"default",(function(){return N}));var m={};n.r(m),n.d(m,"default",(function(){return E}));var p={};n.r(p),n.d(p,"default",(function(){return I}));var s={};n.r(s),n.d(s,"default",(function(){return S}));var b={};n.r(b),n.d(b,"default",(function(){return _}));var u={};n.r(u),n.d(u,"default",(function(){return O}));var f={};n.r(f),n.d(f,"default",(function(){return V}));var h=n("sEIs"),g=n("LTOS"),D=n("eCHz"),R=n("uYCi"),M=n("EM62"),F=n("P+xO"),x=n("Zn6N"),v=n("7o9V"),y=n("h8DJ"),k=function(){function e(){}return e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=M.Fb({type:e,selectors:[["app-datetime-picker-header"]],decls:28,vars:0,consts:[["module","DatetimePickerModule"]],template:function(e,t){1&e&&(M.Rb(0,"header"),M.Rc(1,"Datetime Picker"),M.Qb(),M.Rb(2,"description"),M.Rc(3," The datetime picker component is an opinionated composition of the fd-popover, fd-calendar and fd-time components to accomplish the UI pattern for picking a date and time. "),M.Mb(4,"br"),M.Mb(5,"br"),M.Rc(6," The Time Picker component "),M.Rb(7,"strong"),M.Rc(8,"relies on provided datetime implementation"),M.Qb(),M.Rc(9," ("),M.Rb(10,"code"),M.Rc(11,"DatetimeAdapter"),M.Qb(),M.Rc(12,") and "),M.Rb(13,"strong"),M.Rc(14,"datetime formats"),M.Qb(),M.Rc(15," ("),M.Rb(16,"code"),M.Rc(17,"DateTimeFormats"),M.Qb(),M.Rc(18,"). "),M.Mb(19,"br"),M.Mb(20,"br"),M.Rc(21," The datetime picker supports the same keyboard navigability as the calendar and time components. The popover can be opened by focusing the datetime picker input field and closed by focusing the icon button followed by pressing enter or space. "),M.Mb(22,"br"),M.Mb(23,"br"),M.Rc(24," Fully compatible with Angular forms.\n"),M.Qb(),M.Mb(25,"import",0),M.Mb(26,"fd-header-tabs"),M.Mb(27,"router-outlet"))},directives:[F.a,x.a,v.a,y.a,h.g],styles:[""]}),e}(),C="\x3c!-- Just needs a date object in the ts file! --\x3e\n<fd-datetime-picker [(ngModel)]=\"date\"></fd-datetime-picker>\n\n<br />\n<br />\n<span>\n    Selected: {{ date || 'null' }}\n</span>",T="import { Component } from '@angular/core';\nimport { FdDate } from '@fundamental-ngx/core';\n\n@Component({\n    selector: 'fd-datetime-example',\n    templateUrl: './datetime-example.component.html'\n})\nexport class DatetimeExampleComponent {\n    date = FdDate.getNow();\n}\n",A='<fd-datetime-picker [(ngModel)]="date"></fd-datetime-picker>\n\n<br />\n<br />\n<button\n    label="Change"\n    fd-button\n    (click)="changeDay()"\n></button>\n\n<br />\n<br />\nSelected: {{ date || \'null\' }}',w="import { Component } from '@angular/core';\nimport { FdDate } from '@fundamental-ngx/core';\n\n@Component({\n    selector: 'fd-datetime-program-example',\n    templateUrl: './datetime-program-example.component.html'\n})\nexport class DatetimeProgramExampleComponent {\n    date = FdDate.getNow();\n\n    changeDay(): void {\n        this.date = new FdDate(2018, 10, 5, 15, 30);\n    }\n}\n",Q="import { Component, ViewChild } from '@angular/core';\nimport { DatetimePickerComponent, FdDate } from '@fundamental-ngx/core';\n\n@Component({\n    selector: 'fd-date-time-picker-allow-null-example',\n    template: `\n        <fd-datetime-picker\n            [allowNull]=\"false\"\n            [(ngModel)]=\"selectedDay\"\n            [state]=\"isInvalid() ? 'error' : 'success'\"\n        ></fd-datetime-picker>\n        <br />\n        <br />\n        <span>Selected Date: {{ selectedDay }}</span>\n    `\n})\nexport class DatetimePickerAllowNullExampleComponent {\n    @ViewChild(DatetimePickerComponent) datePicker: DatetimePickerComponent<FdDate>;\n\n    selectedDay: FdDate = FdDate.getNow();\n\n    isInvalid(): boolean {\n        return this.datePicker?.isInvalidDateInput;\n    }\n}\n",P='<fd-datetime-picker\n    placeholder="MMM DD, YYYY, h:mm a"\n    [(ngModel)]="date"\n></fd-datetime-picker>\n<br />\n<br />\n<br />\nSelected: {{ date || \'null\' }}',N="import { Component } from '@angular/core';\nimport { FdDate, DateTimeFormats, DATE_TIME_FORMATS, FD_DATETIME_FORMATS } from '@fundamental-ngx/core';\n\n/**\n * FD_DATETIME_FORMATS is based on Intl.DateTimeFormat,\n * see the doc https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat\n */\n\nexport const CUSTOM_FD_DATETIME_FORMATS: DateTimeFormats = {\n    ...FD_DATETIME_FORMATS,\n    display: {\n        ...FD_DATETIME_FORMATS.display,\n        dateTimeInput: {\n            year: 'numeric',\n            month: 'short',\n            day: 'numeric',\n            hour: '2-digit',\n            minute: '2-digit',\n            hour12: false\n        }\n    }\n};\n\n@Component({\n    selector: 'fd-datetime-format-example',\n    templateUrl: './datetime-format-example.component.html',\n    providers: [\n        {\n            provide: DATE_TIME_FORMATS,\n            useValue: CUSTOM_FD_DATETIME_FORMATS\n        }\n    ]\n})\nexport class DatetimeFormatExampleComponent {\n    date = FdDate.getNow();\n}\n",E="import { Component, LOCALE_ID, ViewChild } from '@angular/core';\nimport { DatetimePickerComponent, FdDate, DatetimeAdapter, FdDatetimeAdapter } from '@fundamental-ngx/core';\n\nconst placeholders = new Map([\n    ['en-ca', 'mm/dd/yyyy, hh:mm a'],\n    ['fr', 'dd/mm/yyyy  hh:mm'],\n    ['bg', '\u0434\u0434.\u043c\u043c.\u0433\u0433 \u0447\u0447:\u043c\u043c'],\n    ['de', 'dd.mm.yy, hh:mm'],\n    ['pl', 'dd.mm.yyyy, hh:mm']\n]);\n\n@Component({\n    selector: 'fd-datetime-picker-complex-i18n-example',\n    templateUrl: './datetime-picker-complex-i18n-example.component.html',\n    styleUrls: ['./datetime-picker-complex-i18n-example.component.scss'],\n    providers: [\n        // Note that this is usually provided in the root of your application.\n        // Due to the limit of this example we must provide it on this level.\n        {\n            provide: LOCALE_ID,\n            useValue: 'en-ca'\n        },\n        {\n            provide: DatetimeAdapter,\n            useClass: FdDatetimeAdapter\n        }\n    ]\n})\nexport class DatetimePickerComplexI18nExampleComponent {\n    locale = 'en-ca';\n\n    date = FdDate.getNow();\n\n    placeholder = placeholders.get(this.locale);\n\n    @ViewChild(DatetimePickerComponent) datetimePickerComponent: DatetimePickerComponent<FdDate>;\n\n    constructor(private datetimeAdapter: DatetimeAdapter<FdDate>) {}\n\n    public setLocale(locale: string): void {\n        this.locale = locale;\n        this.datetimeAdapter.setLocale(locale);\n        this.placeholder = placeholders.get(this.locale);\n    }\n}\n",I='<label fd-form-label>Languages</label>\n<div class="example">\n  <fd-select\n    (valueChange)="setLocale($event)"\n    placeholder="Select an option"\n    [(value)]="locale"\n  >\n    <fd-option\n      *ngFor="let option of [\'en-ca\',\'fr\',\'de\',\'bg\',\'ar\', \'zh\']"\n      [value]="option"\n    >{{ option }}</fd-option>\n  </fd-select>\n</div>\n\n<fd-datetime-picker\n  [placeholder]="placeholder"\n  [(ngModel)]="date"\n></fd-datetime-picker>',S='\x3c!-- Just needs a date object in the ts file! --\x3e\n<fd-datetime-picker [disabled]="true" [(ngModel)]="date"></fd-datetime-picker>\n',_="import { Component } from '@angular/core';\nimport { FdDate } from '@fundamental-ngx/core';\n\n@Component({\n    selector: 'fd-datetime-disabled-example',\n    templateUrl: './datetime-disabled-example.component.html'\n})\nexport class DatetimeDisabledExampleComponent {\n    date = FdDate.getNow();\n}\n",O='<form\n    [formGroup]="customForm"\n    class="flex-form"\n>\n    <div fd-form-item>\n        <label fd-form-label>Valid Date Picker</label>\n        <fd-datetime-picker\n            [state]="isValid() ? \'success\' : \'error\'"\n            formControlName="date"\n            [disableFunction]="disableFunction"\n        >\n        </fd-datetime-picker>\n        <fd-form-message\n            *ngIf="isValid()"\n            [type]="\'success\'"\n        >This is valid DateTimePicker</fd-form-message>\n        <fd-form-message\n            *ngIf="!isValid()"\n            [type]="\'error\'"\n        >This is invalid DateTimePicker</fd-form-message>\n        <br />\n        Touched: {{ customForm.controls.date.touched }}<br />\n        Dirty: {{ customForm.controls.date.dirty }}<br />\n        Valid: {{ customForm.controls.date.valid }}<br />\n        Selected Date:\n        {{ customForm.controls.date.value || \'null\' }}\n    </div>\n    <br /><br />\n    <div fd-form-item>\n        <label fd-form-label>Disabled Date Picker</label>\n        <fd-datetime-picker\n            [state]="\'information\'"\n            formControlName="disabledDate"\n        ></fd-datetime-picker>\n        <fd-form-message [type]="\'information\'">This is disabled DateTimePicker</fd-form-message>\n        <br />\n        Touched: {{ customForm.controls.date.touched }}<br />\n        Dirty: {{ customForm.controls.date.dirty }}<br />\n        Valid: {{ customForm.controls.date.valid }}<br />\n        Disabled: {{ customForm.controls.disabledDate.disabled }}<br />\n        Selected Date:\n        {{ customForm.controls.date.value || \'null\' }}\n    </div>\n</form>',V="import { Component } from '@angular/core';\nimport { FormControl, FormGroup } from '@angular/forms';\nimport { DatetimeAdapter, FdDate } from '@fundamental-ngx/core';\n\n@Component({\n    selector: 'fd-datetime-form-example',\n    templateUrl: './datetime-form-example.component.html'\n})\nexport class DatetimeFormExampleComponent {\n    customForm = new FormGroup({\n        date: new FormControl(FdDate.getNow()),\n        disabledDate: new FormControl({ value: FdDate.getNow(), disabled: true })\n    });\n\n    constructor(private datetimeAdapter: DatetimeAdapter<FdDate>) {}\n\n    isValid(): boolean {\n        return this.customForm.get('date').valid;\n    }\n\n    disableFunction = (fdDate: FdDate): boolean => {\n        return this.datetimeAdapter.compareDate(FdDate.getToday(), fdDate) > 0;\n    };\n}\n",L=n("9Cr2"),U=n("dB5E"),J=n("Zc3A"),j=n("nIj0"),Y=function(){function e(){this.date=g.FdDate.getNow()}return e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=M.Fb({type:e,selectors:[["fd-datetime-example"]],decls:5,vars:2,consts:[[3,"ngModel","ngModelChange"]],template:function(e,t){1&e&&(M.Rb(0,"fd-datetime-picker",0),M.dc("ngModelChange",(function(e){return t.date=e})),M.Qb(),M.Mb(1,"br"),M.Mb(2,"br"),M.Rb(3,"span"),M.Rc(4),M.Qb()),2&e&&(M.pc("ngModel",t.date),M.Ab(4),M.Tc(" Selected: ",t.date||"null","\n"))},directives:[J.a,j.t,j.w],encapsulation:2}),e}(),z=n("gJWE"),G=n("ekBi"),B=n("0b/r"),W=function(){function e(){this.date=g.FdDate.getNow()}return e.prototype.changeDay=function(){this.date=new g.FdDate(2018,10,5,15,30)},e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=M.Fb({type:e,selectors:[["fd-datetime-program-example"]],decls:7,vars:2,consts:[[3,"ngModel","ngModelChange"],["label","Change","fd-button","",3,"click"]],template:function(e,t){1&e&&(M.Rb(0,"fd-datetime-picker",0),M.dc("ngModelChange",(function(e){return t.date=e})),M.Qb(),M.Mb(1,"br"),M.Mb(2,"br"),M.Rb(3,"button",1),M.dc("click",(function(){return t.changeDay()})),M.Qb(),M.Mb(4,"br"),M.Mb(5,"br"),M.Rc(6)),2&e&&(M.pc("ngModel",t.date),M.Ab(6),M.Tc("\nSelected: ",t.date||"null",""))},directives:[J.a,j.t,j.w,B.a],encapsulation:2}),e}(),H=function(){function e(){this.selectedDay=g.FdDate.getNow()}return e.prototype.isInvalid=function(){var e;return null===(e=this.datePicker)||void 0===e?void 0:e.isInvalidDateInput},e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=M.Fb({type:e,selectors:[["fd-date-time-picker-allow-null-example"]],viewQuery:function(e,t){var n;1&e&&M.Wc(g.DatetimePickerComponent,!0),2&e&&M.Bc(n=M.ec())&&(t.datePicker=n.first)},decls:5,vars:4,consts:[[3,"allowNull","ngModel","state","ngModelChange"]],template:function(e,t){1&e&&(M.Rb(0,"fd-datetime-picker",0),M.dc("ngModelChange",(function(e){return t.selectedDay=e})),M.Qb(),M.Mb(1,"br"),M.Mb(2,"br"),M.Rb(3,"span"),M.Rc(4),M.Qb()),2&e&&(M.pc("allowNull",!1)("ngModel",t.selectedDay)("state",t.isInvalid()?"error":"success"),M.Ab(4),M.Tc("Selected Date: ",t.selectedDay,""))},directives:[J.a,j.t,j.w],encapsulation:2}),e}(),Z=n("D57K"),$=Object(Z.a)(Object(Z.a)({},g.FD_DATETIME_FORMATS),{display:Object(Z.a)(Object(Z.a)({},g.FD_DATETIME_FORMATS.display),{dateTimeInput:{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit",hour12:!1}})}),K=function(){function e(){this.date=g.FdDate.getNow()}return e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=M.Fb({type:e,selectors:[["fd-datetime-format-example"]],features:[M.zb([{provide:g.DATE_TIME_FORMATS,useValue:$}])],decls:5,vars:2,consts:[["placeholder","MMM DD, YYYY, h:mm a",3,"ngModel","ngModelChange"]],template:function(e,t){1&e&&(M.Rb(0,"fd-datetime-picker",0),M.dc("ngModelChange",(function(e){return t.date=e})),M.Qb(),M.Mb(1,"br"),M.Mb(2,"br"),M.Mb(3,"br"),M.Rc(4)),2&e&&(M.pc("ngModel",t.date),M.Ab(4),M.Tc("\nSelected: ",t.date||"null",""))},directives:[J.a,j.t,j.w],encapsulation:2}),e}(),X=function(){function e(){this.date=g.FdDate.getNow()}return e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=M.Fb({type:e,selectors:[["fd-datetime-disabled-example"]],decls:1,vars:2,consts:[[3,"disabled","ngModel","ngModelChange"]],template:function(e,t){1&e&&(M.Rb(0,"fd-datetime-picker",0),M.dc("ngModelChange",(function(e){return t.date=e})),M.Qb()),2&e&&M.pc("disabled",!0)("ngModel",t.date)},directives:[J.a,j.t,j.w],encapsulation:2}),e}(),q=n("QkpV"),ee=n("aNX7"),te=n("2kYt"),ne=n("Heni");function ae(e,t){1&e&&(M.Rb(0,"fd-form-message",6),M.Rc(1,"This is valid DateTimePicker"),M.Qb()),2&e&&M.pc("type","success")}function oe(e,t){1&e&&(M.Rb(0,"fd-form-message",6),M.Rc(1,"This is invalid DateTimePicker"),M.Qb()),2&e&&M.pc("type","error")}var ie=function(){function e(e){var t=this;this.datetimeAdapter=e,this.customForm=new j.k({date:new j.h(g.FdDate.getNow()),disabledDate:new j.h({value:g.FdDate.getNow(),disabled:!0})}),this.disableFunction=function(e){return t.datetimeAdapter.compareDate(g.FdDate.getToday(),e)>0}}return e.prototype.isValid=function(){return this.customForm.get("date").valid},e.\u0275fac=function(t){return new(t||e)(M.Lb(g.DatetimeAdapter))},e.\u0275cmp=M.Fb({type:e,selectors:[["fd-datetime-form-example"]],decls:33,vars:16,consts:[[1,"flex-form",3,"formGroup"],["fd-form-item",""],["fd-form-label",""],["formControlName","date",3,"state","disableFunction"],[3,"type",4,"ngIf"],["formControlName","disabledDate",3,"state"],[3,"type"]],template:function(e,t){1&e&&(M.Rb(0,"form",0),M.Rb(1,"div",1),M.Rb(2,"label",2),M.Rc(3,"Valid Date Picker"),M.Qb(),M.Mb(4,"fd-datetime-picker",3),M.Pc(5,ae,2,1,"fd-form-message",4),M.Pc(6,oe,2,1,"fd-form-message",4),M.Mb(7,"br"),M.Rc(8),M.Mb(9,"br"),M.Rc(10),M.Mb(11,"br"),M.Rc(12),M.Mb(13,"br"),M.Rc(14),M.Qb(),M.Mb(15,"br"),M.Mb(16,"br"),M.Rb(17,"div",1),M.Rb(18,"label",2),M.Rc(19,"Disabled Date Picker"),M.Qb(),M.Mb(20,"fd-datetime-picker",5),M.Rb(21,"fd-form-message",6),M.Rc(22,"This is disabled DateTimePicker"),M.Qb(),M.Mb(23,"br"),M.Rc(24),M.Mb(25,"br"),M.Rc(26),M.Mb(27,"br"),M.Rc(28),M.Mb(29,"br"),M.Rc(30),M.Mb(31,"br"),M.Rc(32),M.Qb(),M.Qb()),2&e&&(M.pc("formGroup",t.customForm),M.Ab(4),M.pc("state",t.isValid()?"success":"error")("disableFunction",t.disableFunction),M.Ab(1),M.pc("ngIf",t.isValid()),M.Ab(1),M.pc("ngIf",!t.isValid()),M.Ab(2),M.Tc(" Touched: ",t.customForm.controls.date.touched,""),M.Ab(2),M.Tc(" Dirty: ",t.customForm.controls.date.dirty,""),M.Ab(2),M.Tc(" Valid: ",t.customForm.controls.date.valid,""),M.Ab(2),M.Tc(" Selected Date: ",t.customForm.controls.date.value||"null"," "),M.Ab(6),M.pc("state","information"),M.Ab(1),M.pc("type","information"),M.Ab(3),M.Tc(" Touched: ",t.customForm.controls.date.touched,""),M.Ab(2),M.Tc(" Dirty: ",t.customForm.controls.date.dirty,""),M.Ab(2),M.Tc(" Valid: ",t.customForm.controls.date.valid,""),M.Ab(2),M.Tc(" Disabled: ",t.customForm.controls.disabledDate.disabled,""),M.Ab(2),M.Tc(" Selected Date: ",t.customForm.controls.date.value||"null"," "))},directives:[j.J,j.u,j.l,q.a,ee.a,J.a,j.t,j.j,te.t,ne.a],encapsulation:2}),e}(),de=n("zms7"),ce=n("LWoR");function re(e,t){if(1&e&&(M.Rb(0,"fd-option",5),M.Rc(1),M.Qb()),2&e){var n=t.$implicit;M.pc("value",n),M.Ab(1),M.Sc(n)}}var le=function(){return["en-ca","fr","de","bg","ar","zh"]},me=new Map([["en-ca","mm/dd/yyyy, hh:mm a"],["fr","dd/mm/yyyy  hh:mm"],["bg","\u0434\u0434.\u043c\u043c.\u0433\u0433 \u0447\u0447:\u043c\u043c"],["de","dd.mm.yy, hh:mm"],["pl","dd.mm.yyyy, hh:mm"]]),pe=function(){function e(e){this.datetimeAdapter=e,this.locale="en-ca",this.date=g.FdDate.getNow(),this.placeholder=me.get(this.locale)}return e.prototype.setLocale=function(e){this.locale=e,this.datetimeAdapter.setLocale(e),this.placeholder=me.get(this.locale)},e.\u0275fac=function(t){return new(t||e)(M.Lb(g.DatetimeAdapter))},e.\u0275cmp=M.Fb({type:e,selectors:[["fd-datetime-picker-complex-i18n-example"]],viewQuery:function(e,t){var n;1&e&&M.Wc(g.DatetimePickerComponent,!0),2&e&&M.Bc(n=M.ec())&&(t.datetimePickerComponent=n.first)},features:[M.zb([{provide:M.v,useValue:"en-ca"},{provide:g.DatetimeAdapter,useClass:g.FdDatetimeAdapter}])],decls:6,vars:5,consts:[["fd-form-label",""],[1,"example"],["placeholder","Select an option",3,"value","valueChange"],[3,"value",4,"ngFor","ngForOf"],[3,"placeholder","ngModel","ngModelChange"],[3,"value"]],template:function(e,t){1&e&&(M.Rb(0,"label",0),M.Rc(1,"Languages"),M.Qb(),M.Rb(2,"div",1),M.Rb(3,"fd-select",2),M.dc("valueChange",(function(e){return t.setLocale(e)}))("valueChange",(function(e){return t.locale=e})),M.Pc(4,re,2,2,"fd-option",3),M.Qb(),M.Qb(),M.Rb(5,"fd-datetime-picker",4),M.dc("ngModelChange",(function(e){return t.date=e})),M.Qb()),2&e&&(M.Ab(3),M.pc("value",t.locale),M.Ab(1),M.pc("ngForOf",M.tc(4,le)),M.Ab(1),M.pc("placeholder",t.placeholder)("ngModel",t.date))},directives:[ee.a,de.a,te.s,J.a,j.t,j.w,ce.a],styles:[".docs-example-fd-form-group[_ngcontent-%COMP%]{width:300px;display:block}fd-datetime-picker[_ngcontent-%COMP%], fd-select[_ngcontent-%COMP%]{padding:.5rem .5rem .5rem 0}fd-datetime-picker[_ngcontent-%COMP%]   .example[_ngcontent-%COMP%], fd-select[_ngcontent-%COMP%]   .example[_ngcontent-%COMP%]{width:230px}"]}),e}(),se=function(){function e(){this.datetimePickerSingle=[{language:"html",code:a,fileName:"datetime-example"},{language:"typescript",code:o,fileName:"datetime-example",component:"DatetimeExampleComponent"}],this.datetimeProgram=[{language:"html",code:i,fileName:"datetime-program-example"},{language:"typescript",code:d,fileName:"datetime-program-example",component:"DatetimeProgramExampleComponent"}],this.datetimeFormat=[{language:"html",code:r,fileName:"datetime-format-example"},{language:"typescript",code:l,fileName:"datetime-format-example",component:"DatetimeFormatExampleComponent"}],this.datetimeDisabled=[{language:"html",code:s,fileName:"datetime-disabled-example"},{language:"typescript",code:b,fileName:"datetime-disabled-example",component:"DatetimeDisabledExampleComponent"}],this.datetimeForm=[{language:"html",code:u,fileName:"datetime-form-example"},{language:"typescript",code:f,fileName:"datetime-form-example",component:"DatetimeFormExampleComponent"}],this.datetimePickerAllowNull=[{language:"typescript",code:c,fileName:"date-time-picker-allow-null-example",component:"DatetimePickerAllowNullExampleComponent"}],this.datetimeI18nComplex=[{language:"typescript",code:m,fileName:"datetime-picker-complex-i18n-example",component:"DatetimePickerComplexI18nExampleComponent"},{language:"html",code:p,fileName:"datetime-picker-complex-i18n-example",component:"DatetimePickerComplexI18nExampleComponent"}]}return e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=M.Fb({type:e,selectors:[["app-datetime-picker-docs"]],decls:112,vars:21,consts:[[3,"id","componentName"],[3,"exampleFiles"]],template:function(e,t){1&e&&(M.Rb(0,"fd-docs-section-title",0),M.Rc(1," Simple Datetime Picker\n"),M.Qb(),M.Rb(2,"description"),M.Rc(3," The simplest form of the datetime picker. It makes use of ngModel to bind to the desired value. The alternative is to use the date input combined with the dateChange output. There is also added "),M.Rb(4,"code"),M.Rc(5,"[position]"),M.Qb(),M.Rc(6," attribute which allows us to decide where popup should be shown\n"),M.Qb(),M.Rb(7,"description"),M.Rc(8," The value for the input only changes the model on blur or an enter/return keystroke.\n"),M.Qb(),M.Rb(9,"description"),M.Rc(10," Some default options that belong to the "),M.Rb(11,"code"),M.Rc(12,"time"),M.Qb(),M.Rc(13," component such as "),M.Rb(14,"code"),M.Rc(15,"[displaySeconds]"),M.Qb(),M.Rc(16,", "),M.Rb(17,"code"),M.Rc(18,"[displayMinutes]"),M.Qb(),M.Rc(19,", "),M.Rb(20,"code"),M.Rc(21,"[displayHours]"),M.Qb(),M.Rc(22," and "),M.Rb(23,"code"),M.Rc(24,"[meridian]"),M.Qb(),M.Rc(25," are based on the "),M.Rb(26,"code"),M.Rc(27,"DateTimeFormats.display.dateTimeInput"),M.Qb(),M.Rc(28," options. "),M.Mb(29,"br"),M.Rc(30," For example if Datetime picker display format option contains hours, minutes and day period info then default options will be the next: "),M.Rb(31,"code"),M.Rc(32,'[displaySeconds]="false"'),M.Qb(),M.Rc(33,", "),M.Rb(34,"code"),M.Rc(35,'[displayMinutes]="true"'),M.Qb(),M.Rc(36,", "),M.Rb(37,"code"),M.Rc(38,'[displayHours]="true"'),M.Qb(),M.Rc(39," and "),M.Rb(40,"code"),M.Rc(41,'[meridian]="true"'),M.Qb(),M.Rc(42,". The listed above options are applied to the "),M.Rb(43,"code"),M.Rc(44,"time"),M.Qb(),M.Rc(45," component only (used internally) and can be defined explicitly if needed.\n"),M.Qb(),M.Rb(46,"component-example"),M.Mb(47,"fd-datetime-example"),M.Qb(),M.Mb(48,"code-example",1),M.Mb(49,"separator"),M.Rb(50,"fd-docs-section-title",0),M.Rc(51," Programmatic Change\n"),M.Qb(),M.Rb(52,"description"),M.Rc(53," It is possible to programmatically change the value of the date of the datetime picker and still conserve full functionality.\n"),M.Qb(),M.Rb(54,"component-example"),M.Mb(55,"fd-datetime-program-example"),M.Qb(),M.Mb(56,"code-example",1),M.Mb(57,"separator"),M.Rb(58,"fd-docs-section-title",0),M.Rc(59," Null Validity\n"),M.Qb(),M.Rb(60,"description"),M.Rc(61," Null input values are considered valid by default. Use "),M.Rb(62,"code"),M.Rc(63,'[allowNull]="false"'),M.Qb(),M.Rc(64," to make them invalid.\n"),M.Qb(),M.Rb(65,"component-example"),M.Mb(66,"fd-date-time-picker-allow-null-example"),M.Qb(),M.Mb(67,"code-example",1),M.Mb(68,"separator"),M.Rb(69,"fd-docs-section-title",0),M.Rc(70," Formatting\n"),M.Qb(),M.Rb(71,"description"),M.Rc(72," Providing a custom format for the dates is possible through providing "),M.Rb(73,"code"),M.Rc(74,"DATE_TIME_FORMATS"),M.Qb(),M.Rc(75," config. Note that when providing a custom format, the "),M.Rb(76,"code"),M.Rc(77,"[placeholder]"),M.Qb(),M.Rc(78," input should be set to match the new format as well.\n"),M.Qb(),M.Rb(79,"component-example"),M.Mb(80,"fd-datetime-format-example"),M.Qb(),M.Mb(81,"code-example",1),M.Mb(82,"separator"),M.Rb(83,"fd-docs-section-title",0),M.Rc(84," Disabled State\n"),M.Qb(),M.Rb(85,"component-example"),M.Mb(86,"fd-datetime-disabled-example"),M.Qb(),M.Mb(87,"code-example",1),M.Mb(88,"separator"),M.Rb(89,"fd-docs-section-title",0),M.Rc(90," Date Time Picker in Reactive Form\n"),M.Qb(),M.Rb(91,"description"),M.Rc(92,"The date-time-picker component may also be used within Angular Reactive Forms. DateTime Picker follows Date Picker with "),M.Rb(93,"code"),M.Rc(94,"[disableFunction]"),M.Qb(),M.Qb(),M.Rb(95,"component-example"),M.Mb(96,"fd-datetime-form-example"),M.Qb(),M.Mb(97,"code-example",1),M.Mb(98,"separator"),M.Rb(99,"fd-docs-section-title",0),M.Rc(100," i18n example.\n"),M.Qb(),M.Rb(101,"description"),M.Rc(102," To change a locale option in "),M.Rb(103,"code"),M.Rc(104,"DatePicker"),M.Qb(),M.Rc(105," component, it is needed to set a locale via "),M.Rb(106,"code"),M.Rc(107,"DatetimeAdapter.setLocale"),M.Qb(),M.Rc(108," method.\n"),M.Qb(),M.Rb(109,"component-example"),M.Mb(110,"fd-datetime-picker-complex-i18n-example"),M.Qb(),M.Mb(111,"code-example",1)),2&e&&(M.pc("id","datetime-picker-simple")("componentName","datetime-picker"),M.Ab(48),M.pc("exampleFiles",t.datetimePickerSingle),M.Ab(2),M.pc("id","datetime-picker-progChange")("componentName","datetime-picker"),M.Ab(6),M.pc("exampleFiles",t.datetimeProgram),M.Ab(2),M.pc("id","datetime-picker-null")("componentName","datetime-picker"),M.Ab(9),M.pc("exampleFiles",t.datetimePickerAllowNull),M.Ab(2),M.pc("id","datetime-picker-formatting")("componentName","datetime-picker"),M.Ab(12),M.pc("exampleFiles",t.datetimeFormat),M.Ab(2),M.pc("id","datetime-picker-disabled")("componentName","datetime-picker"),M.Ab(4),M.pc("exampleFiles",t.datetimeDisabled),M.Ab(2),M.pc("id","datetime-picker-inReactiveForm")("componentName","datetime-picker"),M.Ab(8),M.pc("exampleFiles",t.datetimeForm),M.Ab(2),M.pc("id","datetime-picker-complexI18n")("componentName","datetime-picker"),M.Ab(12),M.pc("exampleFiles",t.datetimeI18nComplex))},directives:[L.a,x.a,U.a,Y,z.a,G.a,W,H,K,X,ie,pe],styles:[""]}),e}(),be=n("MOJJ"),ue=[{path:"",component:k,children:[{path:"",component:se},{path:"api",component:D.a,data:{content:R.a.datetimePicker}}]}],fe=function(){function e(){}return e.\u0275mod=M.Jb({type:e}),e.\u0275inj=M.Ib({factory:function(t){return new(t||e)},imports:[[g.FormModule,g.SelectModule,g.InputGroupModule,g.FdDatetimeModule,g.DatetimePickerModule,g.SegmentedButtonModule,be.a,h.f.forChild(ue)],h.f]}),e}()}}]);