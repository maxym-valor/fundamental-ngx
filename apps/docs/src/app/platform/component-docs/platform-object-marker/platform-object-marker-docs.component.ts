import { Component, OnInit } from '@angular/core';
import { ExampleFile } from '../../../documentation/core-helpers/code-example/example-file';
import * as PlatformObjectMarkerDefaultExample from '!raw-loader!./object-marker-example/object-marker-example.component.html'
import * as PlatformObjectMarkerTextAndIconExample from '!raw-loader!./object-marker-example/object-marker-text-and-icon-example.component.html'

@Component({
  selector: 'fdp-platform-object-marker',
  templateUrl: './platform-object-marker-docs.component.html'
})
export class PlatformObjectMarkerDocsComponent {

    platformDefaultObjectMarkerHtmlType: ExampleFile[] = [
        {
            language: 'html',
            code: PlatformObjectMarkerDefaultExample,
            fileName: 'object-marker-example',
        }
    ];
    platformTextAndIconObjectMarkerHtmlType: ExampleFile[] = [
        {
            language: 'html',
            code: PlatformObjectMarkerTextAndIconExample,
            fileName: 'object-marker-example',
        }
    ];

}
