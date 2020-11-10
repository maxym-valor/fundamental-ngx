import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApiComponent } from '../../../../documentation/core-helpers/api/api.component';
import { API_FILES } from '../../../api-files';
import { SharedDocumentationPageModule } from '../../../../documentation/shared-documentation-page.module';

import {
    PlatformTextAreaModule,
    FdpFormGroupModule,
    PlatformButtonModule,
    PlatformRadioGroupModule,
    PlatformInputModule,
    PlatformCheckboxGroupModule,
    PlatformStepInputModule,
    PlatformInputGroupModule,
    PlatformSwitchModule
} from '@fundamental-ngx/platform';
import { PlatformFormContainerDocsComponent } from './platform-form-container-docs.component';
import { PlatformFormContainerRecommendedExampleComponent } from './platform-form-container-examples/platform-form-container-recommended-example.component';
import { PlatformFormContainerPossibleExampleComponent } from './platform-form-container-examples/platform-form-container-possible-example.component';
import { PlatformFormContainerNotRecommendedExampleComponent } from './platform-form-container-examples/platform-form-container-not-recommended-example.component';
import { PlatformFormContainerComplexExampleComponent } from './platform-form-container-examples/platform-form-container-complex-example.component';
import { PlatformFormContainerHeaderComponent } from './platform-form-container-header/platform-form-container-header.component';

const routes: Routes = [
    {
        path: '',
        component: PlatformFormContainerHeaderComponent,
        children: [
            { path: '', component: PlatformFormContainerDocsComponent },
            { path: 'api', component: ApiComponent, data: { content: API_FILES.formContainer } }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        SharedDocumentationPageModule,
        PlatformTextAreaModule,
        PlatformButtonModule,
        PlatformRadioGroupModule,
        PlatformInputModule,
        PlatformCheckboxGroupModule,
        PlatformStepInputModule,
        PlatformInputGroupModule,
        PlatformSwitchModule,
        FdpFormGroupModule
    ],
    exports: [RouterModule],
    declarations: [
        PlatformFormContainerDocsComponent,
        PlatformFormContainerHeaderComponent,
        PlatformFormContainerRecommendedExampleComponent,
        PlatformFormContainerPossibleExampleComponent,
        PlatformFormContainerNotRecommendedExampleComponent,
        PlatformFormContainerComplexExampleComponent
    ]
})
export class PlatformFormContainerDocsModule {}
