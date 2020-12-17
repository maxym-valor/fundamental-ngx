(window.webpackJsonp=window.webpackJsonp||[]).push([[31],{wD3I:function(t,e,n){"use strict";n.r(e),n.d(e,"FormattedTextDocsModule",(function(){return N}));var o={};n.r(o),n.d(o,"default",(function(){return w}));var r={};n.r(r),n.d(r,"default",(function(){return T}));var a={};n.r(a),n.d(a,"default",(function(){return k}));var i={};n.r(i),n.d(i,"default",(function(){return v}));var l={};n.r(l),n.d(l,"default",(function(){return M}));var c={};n.r(c),n.d(c,"default",(function(){return Q}));var d=n("sEIs"),m=n("LTOS"),p=n("MOJJ"),s=n("eCHz"),f=n("uYCi"),u=n("EM62"),b=n("P+xO"),h=n("Zn6N"),x=n("7o9V"),R=n("h8DJ"),g=function(){function t(){}return t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=u.Fb({type:t,selectors:[["fd-formatted-text-header"]],decls:69,vars:0,consts:[["module","FormattedTextModule"]],template:function(t,e){1&t&&(u.Rb(0,"header"),u.Rc(1,"Formatted text component"),u.Qb(),u.Rb(2,"description"),u.Rc(3," The FormattedText component allows the usage of a limited set of tags for inline display of formatted text in HTML format. "),u.Mb(4,"br"),u.Rc(5," You can safely append formatted the text using HTML tags or embed formatted text. "),u.Mb(6,"br"),u.Mb(7,"br"),u.Rc(8," The following tags are supported: "),u.Rb(9,"code"),u.Rc(10,"<a>"),u.Qb(),u.Rc(11,", "),u.Rb(12,"code"),u.Rc(13,"<abbr>"),u.Qb(),u.Rc(14,", "),u.Rb(15,"code"),u.Rc(16,"<blockquote>"),u.Qb(),u.Rc(17,", "),u.Rb(18,"code"),u.Rc(19,"<br>"),u.Qb(),u.Rc(20,", "),u.Rb(21,"code"),u.Rc(22,"<cite>"),u.Qb(),u.Rc(23,", "),u.Rb(24,"code"),u.Rc(25,"<code>"),u.Qb(),u.Rc(26,", "),u.Rb(27,"code"),u.Rc(28,"<em>"),u.Qb(),u.Rc(29,", "),u.Rb(30,"code"),u.Rc(31,"<h1-6>"),u.Qb(),u.Rc(32,", "),u.Rb(33,"code"),u.Rc(34,"<p>"),u.Qb(),u.Rc(35,", "),u.Rb(36,"code"),u.Rc(37,"<pre>"),u.Qb(),u.Rc(38,", "),u.Rb(39,"code"),u.Rc(40,"<strong>"),u.Qb(),u.Rc(41,", "),u.Rb(42,"code"),u.Rc(43,"<span>"),u.Qb(),u.Rc(44,", "),u.Rb(45,"code"),u.Rc(46,"<u>"),u.Qb(),u.Rc(47,", "),u.Rb(48,"code"),u.Rc(49,"<dl>"),u.Qb(),u.Rc(50,", "),u.Rb(51,"code"),u.Rc(52,"<dt>"),u.Qb(),u.Rc(53,", "),u.Rb(54,"code"),u.Rc(55,"<dd>"),u.Qb(),u.Rc(56,", "),u.Rb(57,"code"),u.Rc(58,"<ul>"),u.Qb(),u.Rc(59,", "),u.Rb(60,"code"),u.Rc(61,"<ol>"),u.Qb(),u.Rc(62,", "),u.Rb(63,"code"),u.Rc(64,"<li>"),u.Qb(),u.Rc(65,".\n"),u.Qb(),u.Mb(66,"import",0),u.Mb(67,"fd-header-tabs"),u.Mb(68,"router-outlet"))},directives:[b.a,h.a,x.a,R.a,d.g],encapsulation:2}),t}(),w='<h3>Input embed code</h3>\n<div [innerText]="rawHtmlBase"></div>\n<h3>Output result:</h3>\n<div>\n    <fd-formatted-text [htmlText]="rawHtmlBase" style="background-color: #e5e5e5; padding: 10px"></fd-formatted-text>\n</div>\n',T="import { Component } from '@angular/core';\n\n@Component({\n    selector: 'fd-formatted-text-example',\n    templateUrl: './formatted-text-example.component.html'\n})\nexport class FormattedTextExampleComponent {\n    rawHtmlBase = `\n        <h1>Title h1</h1>\n        <p>Paragraph with link <a href='http://loripsum.net/' target='_blank'>Link to http://loripsum.net.</a> </p>\n        <blockquote cite='http://loripsum.net'>\n            Blockquote with cite\n        </blockquote>\n        <h3>ordered list of items</h3>\n        <ol>\n            <li>ordered list's item 1</li>\n            <li style=\"color: red;\">ordered list's item 2 with style=\"color: red;\"</li>\n            <li>ordered list's item 3</li>\n        </ol>\n        <h3>unordered list of items</h3>\n        <ul>\n            <li>unordered list's item 1</li>\n            <li>unordered list's item 2</li>\n            <li>unordered list's item 3</li>\n        </ul>\n        <h1>Wrong link href will skipped</h1>\n        <a href=\"google.com\" title=\"Redirect to google.com\" style=\"color:#1a0dab;font-size:14px;\">Link with wrong href google.com (instead http://www.google.com), title and style</a>\n        <h1>Link with anchor</h1>\n        <a href=\"#target1\" title=\"Redirect to google.com\">Anchor link to #target1</a>\n    `;\n}\n",k='<h3>Input embed code</h3>\n<div [innerText]="rawHtmlLinks"></div>\n<h3>Output result:</h3>\n<div>\n    <fd-formatted-text [htmlText]="rawHtmlLinks" convertedLinksDefaultTarget="_self"></fd-formatted-text>\n</div>\n',v="import { Component } from '@angular/core';\n\n@Component({\n    selector: 'fd-formatted-text-links-example',\n    templateUrl: './formatted-text-example.component.html'\n})\nexport class FormattedTextLinksExampleComponent {\n    rawHtmlLinks = `<a href=\"https://www.sap.com\" target=\"_blank\">Link to sap.com with target \"_self\" (will change if already exists)</a>`;\n}\n",M='<h3>Input embed code</h3>\n<div [innerText]="rawHTMLWithScript"></div>\n<h3>Output result:</h3>\n<div>\n    <fd-formatted-text [htmlText]="rawHTMLWithScript"></fd-formatted-text>\n</div>\n',Q="import { Component } from '@angular/core';\n\n@Component({\n    selector: 'fd-formatted-text-script-example',\n    templateUrl: './formatted-text-example.component.html'\n})\nexport class FormattedTextScriptExampleComponent {\n    rawHTMLWithScript = `<script>alert(1);<\/script>`;\n}\n",F=n("9Cr2"),L=n("dB5E"),y=n("VBXh"),H=function(){function t(){this.rawHtmlBase='\n        <h1>Title h1</h1>\n        <p>Paragraph with link <a href=\'http://loripsum.net/\' target=\'_blank\'>Link to http://loripsum.net.</a> </p>\n        <blockquote cite=\'http://loripsum.net\'>\n            Blockquote with cite\n        </blockquote>\n        <h3>ordered list of items</h3>\n        <ol>\n            <li>ordered list\'s item 1</li>\n            <li style="color: red;">ordered list\'s item 2 with style="color: red;"</li>\n            <li>ordered list\'s item 3</li>\n        </ol>\n        <h3>unordered list of items</h3>\n        <ul>\n            <li>unordered list\'s item 1</li>\n            <li>unordered list\'s item 2</li>\n            <li>unordered list\'s item 3</li>\n        </ul>\n        <h1>Wrong link href will skipped</h1>\n        <a href="google.com" title="Redirect to google.com" style="color:#1a0dab;font-size:14px;">Link with wrong href google.com (instead http://www.google.com), title and style</a>\n        <h1>Link with anchor</h1>\n        <a href="#target1" title="Redirect to google.com">Anchor link to #target1</a>\n    '}return t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=u.Fb({type:t,selectors:[["fd-formatted-text-example"]],decls:7,vars:2,consts:[[3,"innerText"],[2,"background-color","#e5e5e5","padding","10px",3,"htmlText"]],template:function(t,e){1&t&&(u.Rb(0,"h3"),u.Rc(1,"Input embed code"),u.Qb(),u.Mb(2,"div",0),u.Rb(3,"h3"),u.Rc(4,"Output result:"),u.Qb(),u.Rb(5,"div"),u.Mb(6,"fd-formatted-text",1),u.Qb()),2&t&&(u.Ab(2),u.pc("innerText",e.rawHtmlBase),u.Ab(4),u.pc("htmlText",e.rawHtmlBase))},directives:[y.a],encapsulation:2}),t}(),C=n("gJWE"),E=n("ekBi"),A=function(){function t(){this.rawHtmlLinks='<a href="https://www.sap.com" target="_blank">Link to sap.com with target "_self" (will change if already exists)</a>'}return t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=u.Fb({type:t,selectors:[["fd-formatted-text-links-example"]],decls:7,vars:2,consts:[[3,"innerText"],["convertedLinksDefaultTarget","_self",3,"htmlText"]],template:function(t,e){1&t&&(u.Rb(0,"h3"),u.Rc(1,"Input embed code"),u.Qb(),u.Mb(2,"div",0),u.Rb(3,"h3"),u.Rc(4,"Output result:"),u.Qb(),u.Rb(5,"div"),u.Mb(6,"fd-formatted-text",1),u.Qb()),2&t&&(u.Ab(2),u.pc("innerText",e.rawHtmlLinks),u.Ab(4),u.pc("htmlText",e.rawHtmlLinks))},directives:[y.a],encapsulation:2}),t}(),B=function(){function t(){this.rawHTMLWithScript="<script>alert(1);<\/script>"}return t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=u.Fb({type:t,selectors:[["fd-formatted-text-script-example"]],decls:7,vars:2,consts:[[3,"innerText"],[3,"htmlText"]],template:function(t,e){1&t&&(u.Rb(0,"h3"),u.Rc(1,"Input embed code"),u.Qb(),u.Mb(2,"div",0),u.Rb(3,"h3"),u.Rc(4,"Output result:"),u.Qb(),u.Rb(5,"div"),u.Mb(6,"fd-formatted-text",1),u.Qb()),2&t&&(u.Ab(2),u.pc("innerText",e.rawHTMLWithScript),u.Ab(4),u.pc("htmlText",e.rawHTMLWithScript))},directives:[y.a],encapsulation:2}),t}(),I=[{path:"",component:g,children:[{path:"",component:function(){function t(){this.formattedTextExample=[{language:"html",code:o,fileName:"formatted-text-example"},{language:"typescript",code:r,fileName:"formatted-text-example",component:"FormattedTextExampleComponent"}],this.linkFormattedTextExample=[{language:"html",code:a,fileName:"formatted-text-example"},{language:"typescript",code:i,fileName:"formatted-text-example",component:"FormattedTextExampleComponent"}],this.scriptFormattedTextExample=[{language:"html",code:l,fileName:"formatted-text-example"},{language:"typescript",code:c,fileName:"formatted-text-example",component:"FormattedTextExampleComponent"}]}return t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=u.Fb({type:t,selectors:[["app-input"]],decls:17,vars:3,consts:[["id","default","componentName","formatted-text"],[3,"exampleFiles"],["id","links-target","componentName","formatted-text"],["id","prevent-script","componentName","formatted-text"]],template:function(t,e){1&t&&(u.Rb(0,"fd-docs-section-title",0),u.Rc(1," Simple Formatted Text\n"),u.Qb(),u.Rb(2,"component-example"),u.Mb(3,"fd-formatted-text-example"),u.Qb(),u.Mb(4,"code-example",1),u.Mb(5,"separator"),u.Rb(6,"fd-docs-section-title",2),u.Rc(7," Formatted text with custom link target\n"),u.Qb(),u.Rb(8,"component-example"),u.Mb(9,"fd-formatted-text-links-example"),u.Qb(),u.Mb(10,"code-example",1),u.Mb(11,"separator"),u.Rb(12,"fd-docs-section-title",3),u.Rc(13," Formatted text with prevent script execution\n"),u.Qb(),u.Rb(14,"component-example"),u.Mb(15,"fd-formatted-text-script-example"),u.Qb(),u.Mb(16,"code-example",1)),2&t&&(u.Ab(4),u.pc("exampleFiles",e.formattedTextExample),u.Ab(6),u.pc("exampleFiles",e.linkFormattedTextExample),u.Ab(6),u.pc("exampleFiles",e.scriptFormattedTextExample))},directives:[F.a,L.a,H,C.a,E.a,A,B],encapsulation:2}),t}()},{path:"api",component:s.a,data:{content:f.a.formattedText}}]}],N=function(){function t(){}return t.\u0275mod=u.Jb({type:t}),t.\u0275inj=u.Ib({factory:function(e){return new(e||t)},imports:[[d.f.forChild(I),p.a,m.FormattedTextModule,m.FormModule,m.PopoverModule,m.InputGroupModule],d.f]}),t}()}}]);