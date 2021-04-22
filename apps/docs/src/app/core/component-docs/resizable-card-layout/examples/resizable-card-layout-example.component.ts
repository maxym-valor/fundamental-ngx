import { Component, OnInit, TemplateRef } from '@angular/core';
import { DialogService, ResizableCardLayoutConfig, LayoutSize, ResizedEvent } from '@fundamental-ngx/core';

@Component({
    selector: 'fd-resizable-card-layout-example',
    templateUrl: './resizable-card-layout-example.component.html',
    styleUrls: ['./resizable-card-layout-example.component.scss']
})
export class ResizableCardLayoutExampleComponent implements OnInit {
    layoutConfig: ResizableCardLayoutConfig;
    layoutSize: LayoutSize;

    miniHeaderRowSpan = 4;
    miniContentRowSpan = 4;

    initialRows = 3;

    listData: number[];

    card1Data: number[];
    card2Data: number[];
    card4Data: number[];
    card5Data: number[];
    card6Data: number[];
    card7Data: number[];

    card3TableData: any[] = [];
    card3TableColumns: string[] = [];
    tableColumns: string[] = [];
    tableData: any[] = [];

    constructor(private _dialogService: DialogService) {}

    ngOnInit(): void {
        this.listData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17];
        this.tableColumns = ['name', 'type', 'region', 'rate', 'quantity', 'tax', 'totalWeight', 'totalAmount'];

        this.tableData = [
            {
                name: 'Apple',
                type: 'Fruit',
                region: 'Virginia',
                rate: 9,
                quantity: 10,
                tax: 9,
                totalWeight: 100,
                totalAmount: 90
            },
            {
                name: 'Banana',
                type: 'Fruit',
                region: 'Costa Rica',
                rate: 7,
                quantity: 11,
                tax: 12,
                totalWeight: 90,
                totalAmount: 77
            },
            {
                name: 'Kale',
                type: 'Vegetable',
                region: 'Colorado',
                rate: 8,
                quantity: 12,
                tax: 9,
                totalWeight: 103,
                totalAmount: 96
            },
            {
                name: 'Kiwi',
                type: 'Fruit',
                region: 'New Zealand',
                rate: 10,
                quantity: 15,
                tax: 9,
                totalWeight: 95,
                totalAmount: 150
            },
            {
                name: 'Spinach',
                type: 'Vegetable',
                region: 'California',
                rate: 15,
                quantity: 20,
                tax: 12,
                totalWeight: 100,
                totalAmount: 300
            },
            {
                name: 'Kale',
                type: 'Vegetable',
                region: 'Colorado',
                rate: 8,
                quantity: 12,
                tax: 9,
                totalWeight: 87,
                totalAmount: 96
            },
            {
                name: 'Kiwi',
                type: 'Fruit',
                region: 'New Zealand',
                rate: 10,
                quantity: 15,
                tax: 9,
                totalWeight: 80,
                totalAmount: 150
            },
            {
                name: 'Spinach',
                type: 'Vegetable',
                region: 'California',
                rate: 15,
                quantity: 20,
                tax: 12,
                totalWeight: 70,
                totalAmount: 300
            }
        ];

        this.card1Data = this.listData.slice(0, this.initialRows + 2);
        this.card4Data = this.listData.slice(0, this.initialRows);
        this.card5Data = this.listData.slice(0, this.initialRows);
        this.card6Data = this.listData.slice(0, this.initialRows);
        this.card7Data = this.listData.slice(0, this.initialRows);
        this.card3TableColumns = this.tableColumns.slice(0, 4);
        this.card3TableData = this.tableData.slice(0, this.initialRows);
    }

    openDialog(dialogTemplate: TemplateRef<any>): void {
        this._dialogService.open(dialogTemplate, {
            mobile: true,
            verticalPadding: true
        });
    }

    onStepChange(event: ResizedEvent): void {
        this._showData(event);
    }

    onMiniHeaderReached(event: ResizedEvent): void {
        this._showData(event);
    }

    onMiniContentReached(event: ResizedEvent): void {
        this._showData(event);
    }

    /** Decides how much data is shown on card */
    private _showData(event: ResizedEvent): void {
        switch (event.card.title) {
            case 'card1':
                this._handleCard1Data(event);
                break;

            case 'card2':
                this._handleCard2Data(event);
                break;

            case 'card3':
                this._handleCard3Data(event);
                break;

            case 'card4':
                this._handleCard4Data(event);
                break;

            case 'card5':
                this._handleCard5Data(event);
                break;

            case 'card6':
                this._handleCard6Data(event);
                break;

            case 'card7':
                this._handleCard7Data(event);
                break;
        }
    }

    private _handleCard1Data(event: ResizedEvent): void {
        if (event.newCardHeightRowSpan === this.miniHeaderRowSpan) {
            this.card1Data = [];
        } else if (event.newCardHeightRowSpan === this.miniHeaderRowSpan + this.miniContentRowSpan) {
            this.card1Data = this._getListData(1);
        } else {
            const index =
                1 + Math.floor((event.newCardHeightRowSpan - (this.miniHeaderRowSpan + this.miniContentRowSpan)) / 3);
            this.card1Data = this._getListData(index);
        }
    }

    private _handleCard2Data(event: ResizedEvent): void {}

    private _handleCard3Data(event: ResizedEvent): void {
        // columns data
        switch (event.newCardWidthColSpan) {
            case 1:
                this.card3TableColumns = this._getTableColumns(2);
                break;
            case 2:
                this.card3TableColumns = this._getTableColumns(4);
                break;
            case 3:
                this.card3TableColumns = this._getTableColumns(6);
                break;
            case 4:
                this.card3TableColumns = this._getTableColumns(8);
                break;
            default:
                this.card3TableColumns = this._getTableColumns(2);
        }

        // row data
        switch (event.newCardHeightRowSpan) {
            case this.miniHeaderRowSpan:
                this.card3TableData = this._getTableData(0);
                break;
            case this.miniHeaderRowSpan + this.miniContentRowSpan:
                this.card3TableData = this._getTableData(1);
                break;
            default:
                const difference = event.newCardHeightRowSpan - (this.miniHeaderRowSpan + this.miniContentRowSpan);
                const index = 1 + Math.floor(difference / 3);
                this.card3TableData = this._getTableData(index);
        }
    }

    private _handleCard4Data(event: ResizedEvent): void {
        if (event.newCardHeightRowSpan === this.miniHeaderRowSpan) {
            this.card4Data = [];
        } else if (event.newCardHeightRowSpan === this.miniHeaderRowSpan + this.miniContentRowSpan) {
            this.card4Data = this._getListData(1);
        } else {
            const index =
                1 + Math.floor((event.newCardHeightRowSpan - (this.miniHeaderRowSpan + this.miniContentRowSpan)) / 3);
            this.card4Data = this._getListData(index);
        }
    }

    private _handleCard5Data(event: ResizedEvent): void {
        if (event.newCardHeightRowSpan === this.miniHeaderRowSpan) {
            this.card5Data = [];
        } else if (event.newCardHeightRowSpan === this.miniHeaderRowSpan + this.miniContentRowSpan) {
            this.card5Data = this._getListData(1);
        } else {
            const index =
                1 + Math.floor((event.newCardHeightRowSpan - (this.miniHeaderRowSpan + this.miniContentRowSpan)) / 3);
            this.card5Data = this._getListData(index);
        }
    }

    private _handleCard6Data(event: ResizedEvent): void {
        if (event.newCardHeightRowSpan === this.miniHeaderRowSpan) {
            this.card6Data = [];
        } else if (event.newCardHeightRowSpan === this.miniHeaderRowSpan + this.miniContentRowSpan) {
            this.card6Data = this._getListData(1);
        } else {
            const index =
                1 + Math.floor((event.newCardHeightRowSpan - (this.miniHeaderRowSpan + this.miniContentRowSpan)) / 3);
            this.card6Data = this._getListData(index);
        }
    }

    private _handleCard7Data(event: ResizedEvent): void {
        if (event.newCardHeightRowSpan === this.miniHeaderRowSpan) {
            this.card7Data = [];
        } else if (event.newCardHeightRowSpan === this.miniHeaderRowSpan + this.miniContentRowSpan) {
            this.card7Data = this._getListData(1);
        } else {
            const index =
                1 + Math.floor((event.newCardHeightRowSpan - (this.miniHeaderRowSpan + this.miniContentRowSpan)) / 3);
            this.card7Data = this._getListData(index);
        }
    }

    private _getListData(index: number): Array<number> {
        return this.listData.slice(0, index);
    }

    private _getTableData(index: number): Array<number> {
        return this.tableData.slice(0, index);
    }

    private _getTableColumns(index: number): Array<string> {
        return this.tableColumns.slice(0, index);
    }
}
