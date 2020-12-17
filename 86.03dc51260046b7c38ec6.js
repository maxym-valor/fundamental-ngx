(window.webpackJsonp=window.webpackJsonp||[]).push([[86],{GuCN:function(t,e,i){"use strict";i.r(e),i.d(e,"PlatformDisplayListItemDocsModule",(function(){return H}));var n={};i.r(n),i.d(n,"default",(function(){return I}));var a={};i.r(a),i.d(a,"default",(function(){return R}));var o={};i.r(o),i.d(o,"default",(function(){return k}));var l={};i.r(l),i.d(l,"default",(function(){return w}));var s=i("oqI+"),r=i("sEIs"),c=i("63W6"),d=i("LTOS"),p=i("eCHz"),m=i("MOJJ"),f=i("qOWU"),b=i("EM62"),u=i("P+xO"),y=i("Zn6N"),g=i("7o9V"),v=i("h8DJ"),h=function(){function t(){}return t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=b.Fb({type:t,selectors:[["app-display-list-item-header"]],decls:26,vars:0,consts:[["routerLink","'/core/list'"],["module","PlatformListModule"],["module","DisplayListItemModule"]],template:function(t,e){1&t&&(b.Rb(0,"header"),b.Rc(1,"Display List Item"),b.Qb(),b.Rb(2,"description"),b.Rb(3,"p"),b.Rc(4," The display list item is the simplest list item. It shows content in the form of labels and text. This component makes use of "),b.Rb(5,"a",0),b.Rc(6,"list-item"),b.Qb(),b.Rc(7," directive present in fundamental-ngx/core and has additional enhancements on top of it. "),b.Qb(),b.Rb(8,"h3"),b.Rc(9,"Platform specific enhancements:"),b.Qb(),b.Rb(10,"ul"),b.Rb(11,"li"),b.Rc(12,"Display-List-Item is implemented as Angular component to hide complexity of dealing with HTML in order to deliver high-order component."),b.Qb(),b.Rb(13,"li"),b.Rc(14,"Alignment of sub elements title, secondary, footer, group header, navigation are abstracted."),b.Qb(),b.Rb(15,"li"),b.Rc(16,"Enhanced support for accessibility which covers access by keyboard, mouse and touch."),b.Qb(),b.Rb(17,"li"),b.Rc(18,"Enhanced compatibility with assistive technology (screen readers)."),b.Qb(),b.Rb(19,"li"),b.Rc(20,"Supports both imperative and declarative way of accepting the items for all the list variants."),b.Qb(),b.Qb(),b.Qb(),b.Mb(21,"import",1),b.Mb(22,"br"),b.Mb(23,"import",2),b.Mb(24,"fd-header-tabs"),b.Mb(25,"router-outlet"))},directives:[u.a,y.a,r.e,g.a,v.a,r.g],encapsulation:2}),t}(),I='<fdp-list [navigated]="true">\n    <fdp-list-group-header>Vegetables Group</fdp-list-group-header>\n    <fdp-display-list-item title="Green Vegetables">\n    </fdp-display-list-item>\n    <fdp-display-list-item title="Dry Vegetables">\n    </fdp-display-list-item>\n    <fdp-list-footer>List footer</fdp-list-footer>\n</fdp-list>',R='<h3>Cozy Mode</h3>\n<fdp-list noBorder="true" [navigationIndicator]="true">\n    <fdp-display-list-item *ngFor="let item of items" [title]="item.title" [secondary]="item.secondary"\n        [navigationIndicator]="item.navigationIndicator" [link]="item.link"></fdp-display-list-item>\n</fdp-list>\n\n<h3>Compact Mode</h3>\n<fdp-list contentDensity="compact" noBorder="true" [navigationIndicator]="true">\n    <fdp-display-list-item *ngFor="let item of items" [title]="item.title" [secondary]="item.secondary"\n        [navigationIndicator]="item.navigationIndicator" [link]="item.link">\n    </fdp-display-list-item>\n</fdp-list>\n',k="import { Component } from '@angular/core';\n\nexport interface Movie {\n    title: string;\n    secondary: string;\n    navigationIndicator: boolean;\n    link: string;\n}\n\n@Component({\n    selector: 'fdp-borderless-display-list-item-example',\n    templateUrl: './platform-borderless-display-list-item-example.component.html'\n})\nexport class PlatformDisplayListItemBorderLessExampleComponent {\n    items: Movie[] = [\n        { title: 'Star War', secondary: 'Next session', navigationIndicator: true, link: '/platform/home' },\n        { title: 'Spide Man', secondary: 'No latest release', navigationIndicator: false, link: '' },\n        { title: 'Iron Man', secondary: 'No latest release', navigationIndicator: false, link: '' },\n        { title: 'Wonder Women', secondary: 'Next session', navigationIndicator: true, link: '' }];\n\n}\n\n",w='<h5>Declarative Approach</h5>\n<fdp-list [navigationIndicator]="true">\n    <fdp-display-list-item title="Corona">\n    </fdp-display-list-item>\n    <fdp-display-list-item title="Fever">\n    </fdp-display-list-item>\n    <fdp-display-list-item title="Sneeze">\n    </fdp-display-list-item>\n</fdp-list>',x=i("9Cr2"),L=i("dB5E"),M=i("VVvo"),Q=i("2kYt"),D=i("D57K"),A=i("D/Ez"),N=i("P2tn"),P=i("henO"),B=i("Cz9v"),C=i("+mO0"),S=i("nCrf");function F(t,e){1&t&&b.Nb(0)}function O(t,e){if(1&t){var i=b.Sb();b.Pb(0),b.Rb(1,"li",2,3),b.dc("keydown",(function(t){return b.Ec(i),b.hc()._onKeyDown(t)}))("keyup",(function(t){return b.Ec(i),b.hc()._onKeyUp(t)})),b.Rb(3,"a",4,5),b.Pc(5,F,1,0,"ng-container",6),b.Qb(),b.Qb(),b.Ob()}if(2&t){var n=b.hc(),a=b.Cc(3);b.Ab(1),b.Db("fd-list__item--inactive","inactive"===n.listType),b.pc("selected",n._selected),b.Bb("id",n.id)("aria-selected",n._selected)("ariaLabelledBy",n.ariaLabelledBy)("aria-level",n.ariaLevel)("aria-posinet",n.ariaPosinet),b.Ab(2),b.pc("routerLink",n.routerLink)("navigationIndicator",n.navigationIndicator)("navigated",n.navigated),b.Ab(2),b.pc("ngTemplateOutlet",a)}}function T(t,e){1&t&&b.Nb(0)}function W(t,e){if(1&t){var i=b.Sb();b.Pb(0),b.Rb(1,"li",7,3),b.dc("keydown",(function(t){return b.Ec(i),b.hc()._onKeyDown(t)}))("keyup",(function(t){return b.Ec(i),b.hc()._onKeyUp(t)})),b.Pc(3,T,1,0,"ng-container",6),b.Qb(),b.Ob()}if(2&t){var n=b.hc(),a=b.Cc(3);b.Ab(1),b.Db("fd-list__item--inactive","inactive"===n.listType),b.pc("selected",n._selected),b.Bb("id",n.id)("ariaLabelledBy",n.ariaLabelledBy)("aria-level",n.ariaLevel)("aria-posinet",n.ariaPosinet),b.Ab(2),b.pc("ngTemplateOutlet",a)}}function _(t,e){if(1&t&&(b.Rb(0,"span",10),b.Rc(1),b.Qb()),2&t){var i=b.hc(2);b.Bb("aria-label",i.title)("nowrap",i.titleWrap)("title",i.title),b.Ab(1),b.Sc(i.title)}}function E(t,e){if(1&t&&(b.Pc(0,_,2,4,"span",8),b.Rb(1,"span",9),b.Rc(2),b.Qb()),2&t){var i=b.hc();b.pc("ngIf",i.title),b.Ab(1),b.Bb("aria-label",i.secondary)("title",i.secondary)("nowrap",i.secondaryWrap),b.Ab(1),b.Tc(" ",i.secondary," ")}}var z=function(t){function e(e,i,n,a){var o=t.call(this,e,i,n,a)||this;return o._listConfig=n,o._router=a,o}return Object(D.c)(e,t),e.\u0275fac=function(t){return new(t||e)(b.Lb(b.h),b.Lb(b.l),b.Lb(N.a),b.Lb(r.c))},e.\u0275cmp=b.Fb({type:e,selectors:[["fdp-display-list-item"]],features:[b.zb([{provide:A.a,useExisting:Object(b.U)((function(){return e}))}]),b.xb],decls:4,vars:2,consts:[[4,"ngIf"],["commonTemplate",""],["fd-list-item","","tabIndex","-1",1,"fd-list__item--link",3,"selected","keydown","keyup"],["listItem",""],["fd-list-link","",3,"routerLink","navigationIndicator","navigated"],["link",""],[4,"ngTemplateOutlet"],["fd-list-item","","tabIndex","-1",3,"selected","keydown","keyup"],["fd-list-title","",4,"ngIf"],["fd-list-secondary",""],["fd-list-title",""]],template:function(t,e){1&t&&(b.Pc(0,O,6,12,"ng-container",0),b.Pc(1,W,4,8,"ng-container",0),b.Pc(2,E,3,5,"ng-template",null,1,b.Qc)),2&t&&(b.pc("ngIf",e.navigationIndicator||e.navigated&&!(null!=e.noDataText)),b.Ab(1),b.pc("ngIf",!(e.navigationIndicator||e.navigated||null!=e.noDataText)))},directives:[Q.t,P.a,r.e,B.a,Q.A,C.a,S.a],encapsulation:2,changeDetection:0}),e}(A.a);function J(t,e){if(1&t&&b.Mb(0,"fdp-display-list-item",3),2&t){var i=e.$implicit;b.pc("title",i.title)("secondary",i.secondary)("navigationIndicator",i.navigationIndicator)("link",i.link)}}function V(t,e){if(1&t&&b.Mb(0,"fdp-display-list-item",3),2&t){var i=e.$implicit;b.pc("title",i.title)("secondary",i.secondary)("navigationIndicator",i.navigationIndicator)("link",i.link)}}var K=function(){function t(){this.items=[{title:"Star War",secondary:"Next session",navigationIndicator:!0,link:"/platform/home"},{title:"Spide Man",secondary:"No latest release",navigationIndicator:!1,link:""},{title:"Iron Man",secondary:"No latest release",navigationIndicator:!1,link:""},{title:"Wonder Women",secondary:"Next session",navigationIndicator:!0,link:""}]}return t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=b.Fb({type:t,selectors:[["fdp-borderless-display-list-item-example"]],decls:8,vars:4,consts:[["noBorder","true",3,"navigationIndicator"],[3,"title","secondary","navigationIndicator","link",4,"ngFor","ngForOf"],["contentDensity","compact","noBorder","true",3,"navigationIndicator"],[3,"title","secondary","navigationIndicator","link"]],template:function(t,e){1&t&&(b.Rb(0,"h3"),b.Rc(1,"Cozy Mode"),b.Qb(),b.Rb(2,"fdp-list",0),b.Pc(3,J,1,4,"fdp-display-list-item",1),b.Qb(),b.Rb(4,"h3"),b.Rc(5,"Compact Mode"),b.Qb(),b.Rb(6,"fdp-list",2),b.Pc(7,V,1,4,"fdp-display-list-item",1),b.Qb()),2&t&&(b.Ab(2),b.pc("navigationIndicator",!0),b.Ab(1),b.pc("ngForOf",e.items),b.Ab(3),b.pc("navigationIndicator",!0),b.Ab(1),b.pc("ngForOf",e.items))},directives:[M.a,Q.s,z],encapsulation:2}),t}(),U=i("gJWE"),j=i("ekBi"),G=function(){function t(){this.items=[{title:"First Stage",secondary:"First stage take medical help on call (Standard text)"},{title:"Second Stage",secondary:"Second stage take medical help in person (Standard text)"},{title:"Third Stage",secondary:"Third stage admit in hospital (Standard text)"}]}return t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=b.Fb({type:t,selectors:[["fdp-display-list-item-with-navigation-example"]],decls:6,vars:1,consts:[[3,"navigationIndicator"],["title","Corona"],["title","Fever"],["title","Sneeze"]],template:function(t,e){1&t&&(b.Rb(0,"h5"),b.Rc(1,"Declarative Approach"),b.Qb(),b.Rb(2,"fdp-list",0),b.Mb(3,"fdp-display-list-item",1),b.Mb(4,"fdp-display-list-item",2),b.Mb(5,"fdp-display-list-item",3),b.Qb()),2&t&&(b.Ab(2),b.pc("navigationIndicator",!0))},directives:[M.a,z],encapsulation:2}),t}(),q=[{path:"",component:h,children:[{path:"",component:function(){function t(){this.simpleDLI=[{language:"html",code:n,fileName:"platform-display-list-item-example"}],this.borderLessDLI=[{language:"html",code:a,fileName:"platform-borderless-display-list-item-example"},{language:"typescript",component:"PlatformDisplayListBorderLessExampleComponent",code:o,fileName:"platform-borderless-display-list-item-example"}],this.dliWithNavigation=[{language:"html",code:l,fileName:"platform-display-list-item-with-navigation-example"}]}return t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=b.Fb({type:t,selectors:[["app-standard-list-item"]],decls:28,vars:2,consts:[["id","list1","componentName","List"],[3,"exampleFiles"],["id","list5","componentName","List"]],template:function(t,e){1&t&&(b.Rb(0,"fd-docs-section-title",0),b.Rc(1," Display List Item - With Partial Navigation\n"),b.Qb(),b.Rb(2,"description"),b.Rc(3,"A Display list without border, setting "),b.Rb(4,"code"),b.Rc(5,'noBorder="true"'),b.Qb(),b.Rc(6," will help to have no border and "),b.Rb(7,"code"),b.Rc(8,' [navigationIndicator]="true"'),b.Qb(),b.Rc(9," helps to display navigation and it will display navigation for specfic items for which navigtion indicator is set to true again, by default its value is false. Below examples shows declarative way to bind the list items. Where we can pass list items individually where a number of items are less"),b.Qb(),b.Rb(10,"component-example"),b.Mb(11,"fdp-borderless-display-list-item-example"),b.Qb(),b.Mb(12,"code-example",1),b.Mb(13,"separator"),b.Rb(14,"fd-docs-section-title",2),b.Rc(15," Display List Item - Navigation\n"),b.Qb(),b.Rb(16,"description"),b.Rc(17,"Display List with Navigation Option. "),b.Rb(18,"code"),b.Rc(19,'[navigationIndicator]="true"'),b.Qb(),b.Rc(20," will provide *>* indicator, "),b.Rb(21,"code"),b.Rc(22,"[link]"),b.Qb(),b.Rc(23," will help to get into the desired destination on click of navigation. Below example shows declarative way to use it."),b.Qb(),b.Rb(24,"component-example"),b.Mb(25,"fdp-display-list-item-with-navigation-example"),b.Qb(),b.Mb(26,"code-example",1),b.Mb(27,"separator")),2&t&&(b.Ab(12),b.pc("exampleFiles",e.borderLessDLI),b.Ab(14),b.pc("exampleFiles",e.dliWithNavigation))},directives:[x.a,y.a,L.a,K,U.a,j.a,G],encapsulation:2}),t}()},{path:"api",component:p.a,data:{content:f.a.displaylistitem}}]}],H=function(){function t(){}return t.\u0275mod=b.Jb({type:t}),t.\u0275inj=b.Ib({factory:function(e){return new(e||t)},imports:[[s.h,d.DragAndDropModule,r.f.forChild(q),m.a,d.ToolbarModule,c.PlatformListModule,c.PlatformButtonModule,c.DisplayListItemModule],r.f]}),t}()}}]);