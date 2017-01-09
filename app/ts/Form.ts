/// <reference path="./Sort.ts" />

//Interface encargada de validar los parametros necesarios para nuestra clase
interface formOptions
{
    inputID: string;
    resultID: string;
    itemClass: string;
    sortID: string;
}

//Clase con la logica principal de nuestra aplicación
class Form
{
    private form: HTMLElement;
    private input: HTMLInputElement;
    private result: HTMLElement;
    private sort: Sort;
    private itemClass: string;
    private sortButton: HTMLElement;

    //Obtenemos los selectores necesarios
    constructor(options: formOptions) {
        this.setForm(options.inputID);
        this.setInput(options.inputID);
        this.setResult(options.resultID);
        this.setItemClass(options.itemClass);
        this.setSortButton(options.sortID);
    }

    //Iniciar nuestros eventos y crear nuestro objeto a reordenar
    public init() {
        this.createSort();
        this.trigger();
    }

    // Setters y Getters encargados de las instacias al DOM
    private setForm(id: string): void {
        this.form = <HTMLElement>document.getElementById(id).parentElement;
    }

    private setInput(id: string): void {
        this.input = <HTMLInputElement>document.getElementById(id);
    }

    private setResult(id: string): void {
        this.result = <HTMLElement>document.getElementById(id);
    }

    private setItemClass(cssClass: string): void {
        this.itemClass = cssClass;
    }

    private setSortButton(id: string): void {
        this.sortButton = <HTMLElement>document.getElementById(id);
    }

    private createSort() {
        this.sort = new Sort(this.itemClass);
    }

    private getForm(): HTMLElement {
        return this.form;
    }

    private getResult(): HTMLElement {
        return this.result;
    }

    private getInput(): HTMLInputElement {
        return this.input;
    }

    private getSortButton(): HTMLElement {
        return this.sortButton;
    }


    //Eventos principales - Submit del formulario y Clic al botón de reordenar
    private trigger(): void {
        this.getForm().addEventListener('submit', (e: Event) => {
            let target = <HTMLElement>e.target;
            let value:number = parseInt(this.getInput().value);

            if (!target.classList.contains('error') && !target.classList.contains('disabled')) {
                let item = <HTMLElement>document.createElement("div");
                    item.classList.add(this.itemClass);
                    item.innerHTML = value.toString();

                let waitTime = 100;

                this.getInput().value = "";

                if (!this.sort.isDuplicate(value) && !isNaN(value)) {
                    this.sort.addItem(value);
                    this.getResult().appendChild(item);

                    // Esperamos que el elemento sea agregado al dom para poder agregar la animación
                    setTimeout( () => {
                        (<HTMLElement>this.getResult().lastChild).classList.add("square--added");
                    }, waitTime);
                }
            }

            e.preventDefault();
        }, false);

        this.getSortButton().addEventListener('click', (e: Event) => {
            this.sort.asc();

            e.preventDefault();
        });
    }
}
