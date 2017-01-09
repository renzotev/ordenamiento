class Validate
{
    private input: HTMLInputElement;
    public static message: string;

    constructor(id: string) {
        this.setInput(id);
        Validate.message = "Por favor digite un valor numerico"
    }

    public init() {
        this.trigger();
    }

    private setInput(id: string): void {
        this.input = <HTMLInputElement>document.getElementById(id);
    }

    private getInput(): HTMLInputElement {
        return this.input;
    }

    private isInt(value: any): boolean {
          let x;

          if (isNaN(value)) {
            return false;
          }

          x = parseFloat(value);

          return (x | 0) === x;
    }

    private trigger(): void {
        let error = <HTMLElement>document.querySelector("#"+this.getInput().id + " + .error" );
        error.innerHTML = Validate.message;
        this.getInput().parentElement.classList.add("disabled");

        this.getInput().addEventListener('keyup', (e: Event) => {
            let target = <HTMLInputElement>e.target;
            let val = target.value;

            target.parentElement.classList.remove("disabled");

            if (this.isInt(val)) {
                error.classList.remove("error--active");
                target.parentElement.classList.remove("error");
            } else if (val.toString() != "") {
                error.classList.add("error--active");
                target.parentElement.classList.add("error");
            }

        }, false);
    }
}
