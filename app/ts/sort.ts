class Sort
{
    private items: number[];
    private _items: number[];
    private itemClass: string;
    private positions: any[];

    constructor(itemSelector: string) {
        this.items = [];
        this.positions = [];
        this.itemClass = itemSelector;
    }

    public isDuplicate(n: number): boolean {
        let result: boolean = this.getItems().some( (item) => {
            return item === n;
        });

        return result;
    }

    public asc(): void {
        this.getPositions();
        this._items = this.items.slice();
        this.items = this.mergeSort(this.getItems());
        this.animate();
    }

    public animate(): void {
        let elem: any = document.getElementsByClassName(this.itemClass);

        for(let i: number = 0; i < elem.length; i++){
            this.setPosition(i, this.items.indexOf(this._items[i]));
        }

        setTimeout( () => {
            this.sortDOM();
        }, 700);
    }

    private sortDOM():void {
        let container = <HTMLElement>document.getElementById("result");

        container.innerHTML = "";

        for(let i: number = 0; i < this.items.length; i++){
            let item = <HTMLElement>document.createElement("div");
                item.classList.add(this.itemClass);
                item.classList.add(this.itemClass+"--added");
                item.innerHTML = this.items[i].toString();

            container.appendChild(item);
        }
    };

    private getPositions(): void {
        let elem: any = document.getElementsByClassName(this.itemClass);

        for(let i: number = 0; i < elem.length; i++){

           this.positions.push({
               left: elem[i].offsetLeft,
               top: elem[i].offsetTop
           });
        }
    }

    private setPosition(before: number, after: number): void {
        let elem: any = document.getElementsByClassName(this.itemClass);

        elem[before].style.position = "absolute";
        elem[before].style.left = this.positions[before].left+"px";
        elem[before].style.top = this.positions[before].top+"px";

        setTimeout( () => {
            elem[before].style.left = this.positions[after].left+"px";
            elem[before].style.top = this.positions[after].top+"px";
        }, 100);
    }

    private mergeSort(arr: number[]): number[] {
        var len = arr.length;

        if (len <2) {
            return arr;
        }

        var mid = Math.floor(len/2),
            left = arr.slice(0,mid),
            right =arr.slice(mid);

        return this.merge(this.mergeSort(left), this.mergeSort(right));
    }

    private merge(left: number[], right: number[]): number[] {
        var result = [],
            lLen = left.length,
            rLen = right.length,
            l = 0,
            r = 0;
            while(l < lLen && r < rLen){
                if(left[l] < right[r]){
                result.push(left[l++]);
            } else {
                result.push(right[r++]);
            }
        }

        return result.concat(left.slice(l)).concat(right.slice(r));
    }


    public addItem(n: number): void {
        if (!this.isDuplicate(n)) {
            this.items.push(n);
        }
    }

    public getItems(): number[] {
        return this.items;
    }
}
