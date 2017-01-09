//Funcion encargada de hacer la validación de números y mostrar mensajes de error

class Validate
{
    private input: HTMLInputElement;
    public static message: string;

    //Obtenemos el ID del elemento a validar
    constructor(id: string) {
        this.setInput(id);
        Validate.message = "Por favor digite un valor numerico"
    }

    //Iniciamos los eventos
    public init() {
        this.trigger();
    }

    //Creamos al instancia a nuestro elemento a validar
    private setInput(id: string): void {
        this.input = <HTMLInputElement>document.getElementById(id);
    }

    //Obtenemos el elemento a validar
    private getInput(): HTMLInputElement {
        return this.input;
    }

    //Validamos que el número sea entero
    private isInt(value: any): boolean {
          let x;

          if (isNaN(value)) {
            return false;
          }

          x = parseFloat(value);

          return (x | 0) === x;
    }

    //Eventos encargados de valir y mostrar mensajes de error
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
