//Funcion encargada de hacer la validación de números y mostrar mensajes de error
var Validate = (function () {
    //Obtenemos el ID del elemento a validar
    function Validate(id) {
        this.setInput(id);
        Validate.message = "Por favor digite un valor numerico";
    }
    //Iniciamos los eventos
    Validate.prototype.init = function () {
        this.trigger();
    };
    //Creamos al instancia a nuestro elemento a validar
    Validate.prototype.setInput = function (id) {
        this.input = document.getElementById(id);
    };
    //Obtenemos el elemento a validar
    Validate.prototype.getInput = function () {
        return this.input;
    };
    //Validamos que el número sea entero
    Validate.prototype.isInt = function (value) {
        var x;
        if (isNaN(value)) {
            return false;
        }
        x = parseFloat(value);
        return (x | 0) === x;
    };
    //Eventos encargados de valir y mostrar mensajes de error
    Validate.prototype.trigger = function () {
        var _this = this;
        var error = document.querySelector("#" + this.getInput().id + " + .error");
        error.innerHTML = Validate.message;
        this.getInput().parentElement.classList.add("disabled");
        this.getInput().addEventListener('keyup', function (e) {
            var target = e.target;
            var val = target.value;
            target.parentElement.classList.remove("disabled");
            if (_this.isInt(val)) {
                error.classList.remove("error--active");
                target.parentElement.classList.remove("error");
            }
            else if (val.toString() != "") {
                error.classList.add("error--active");
                target.parentElement.classList.add("error");
            }
        }, false);
    };
    return Validate;
}());
// Clase encargada de reordenar nuestro array y el DOM
var Sort = (function () {
    // Obtenemos la clase css de nuestros números
    function Sort(itemSelector) {
        this.items = [];
        this.positions = [];
        this.itemClass = itemSelector;
    }
    //verificamos si existe el elemento que deseamos agregar
    Sort.prototype.isDuplicate = function (n) {
        var result = this.getItems().some(function (item) {
            return item === n;
        });
        return result;
    };
    //Funcion encargada de hacer las llamadas al reordenamiento
    Sort.prototype.asc = function () {
        this.getPositions();
        this._items = this.items.slice();
        this.items = this.mergeSort(this.getItems());
        this.animate();
    };
    //Funcion encargada de animar el reordenamiento
    Sort.prototype.animate = function () {
        var _this = this;
        var elem = document.getElementsByClassName(this.itemClass);
        for (var i = 0; i < elem.length; i++) {
            this.setPosition(i, this.items.indexOf(this._items[i]));
        }
        setTimeout(function () {
            _this.sortDOM();
        }, 700);
    };
    //Callback de la funcion animate() esta funcion se encarga de reordenar el dom despues de la animación
    Sort.prototype.sortDOM = function () {
        var container = document.getElementById("result");
        container.innerHTML = "";
        for (var i = 0; i < this.items.length; i++) {
            var item = document.createElement("div");
            item.classList.add(this.itemClass);
            item.classList.add(this.itemClass + "--added");
            item.innerHTML = this.items[i].toString();
            container.appendChild(item);
        }
    };
    ;
    // Obtenemos los offset de los elementos
    Sort.prototype.getPositions = function () {
        var elem = document.getElementsByClassName(this.itemClass);
        this.positions = [];
        for (var i = 0; i < elem.length; i++) {
            this.positions.push({
                left: elem[i].offsetLeft,
                top: elem[i].offsetTop
            });
        }
    };
    //Se encarga de mover un elemento a una posición especifica
    Sort.prototype.setPosition = function (before, after) {
        var _this = this;
        var elem = document.getElementsByClassName(this.itemClass);
        elem[before].style.position = "absolute";
        elem[before].style.left = this.positions[before].left + "px";
        elem[before].style.top = this.positions[before].top + "px";
        setTimeout(function () {
            elem[before].style.left = _this.positions[after].left + "px";
            elem[before].style.top = _this.positions[after].top + "px";
        }, 100);
    };
    /* Las funciones mergeSort y merge se encargan de reordenar nuestro array
    usando el algoritomo de Ordenamiento por mezcla */
    Sort.prototype.mergeSort = function (arr) {
        var len = arr.length;
        if (len < 2) {
            return arr;
        }
        var mid = Math.floor(len / 2), left = arr.slice(0, mid), right = arr.slice(mid);
        return this.merge(this.mergeSort(left), this.mergeSort(right));
    };
    Sort.prototype.merge = function (left, right) {
        var result = [], lLen = left.length, rLen = right.length, l = 0, r = 0;
        while (l < lLen && r < rLen) {
            if (left[l] < right[r]) {
                result.push(left[l++]);
            }
            else {
                result.push(right[r++]);
            }
        }
        return result.concat(left.slice(l)).concat(right.slice(r));
    };
    //Agregamos un elemento
    Sort.prototype.addItem = function (n) {
        if (!this.isDuplicate(n)) {
            this.items.push(n);
        }
    };
    //Obtenemos el array con todos los elementos
    Sort.prototype.getItems = function () {
        return this.items;
    };
    return Sort;
}());
/// <reference path="./Sort.ts" />
//Clase con la logica principal de nuestra aplicación
var Form = (function () {
    //Obtenemos los selectores necesarios
    function Form(options) {
        this.setForm(options.inputID);
        this.setInput(options.inputID);
        this.setResult(options.resultID);
        this.setItemClass(options.itemClass);
        this.setSortButton(options.sortID);
    }
    //Iniciar nuestros eventos y crear nuestro objeto a reordenar
    Form.prototype.init = function () {
        this.createSort();
        this.trigger();
    };
    // Setters y Getters encargados de las instacias al DOM
    Form.prototype.setForm = function (id) {
        this.form = document.getElementById(id).parentElement;
    };
    Form.prototype.setInput = function (id) {
        this.input = document.getElementById(id);
    };
    Form.prototype.setResult = function (id) {
        this.result = document.getElementById(id);
    };
    Form.prototype.setItemClass = function (cssClass) {
        this.itemClass = cssClass;
    };
    Form.prototype.setSortButton = function (id) {
        this.sortButton = document.getElementById(id);
    };
    Form.prototype.createSort = function () {
        this.sort = new Sort(this.itemClass);
    };
    Form.prototype.getForm = function () {
        return this.form;
    };
    Form.prototype.getResult = function () {
        return this.result;
    };
    Form.prototype.getInput = function () {
        return this.input;
    };
    Form.prototype.getSortButton = function () {
        return this.sortButton;
    };
    //Eventos principales - Submit del formulario y Clic al botón de reordenar
    Form.prototype.trigger = function () {
        var _this = this;
        this.getForm().addEventListener('submit', function (e) {
            var target = e.target;
            var value = parseInt(_this.getInput().value);
            if (!target.classList.contains('error') && !target.classList.contains('disabled')) {
                var item = document.createElement("div");
                item.classList.add(_this.itemClass);
                item.innerHTML = value.toString();
                var waitTime = 100;
                _this.getInput().value = "";
                if (!_this.sort.isDuplicate(value) && !isNaN(value)) {
                    _this.sort.addItem(value);
                    _this.getResult().appendChild(item);
                    // Esperamos que el elemento sea agregado al dom para poder agregar la animación
                    setTimeout(function () {
                        _this.getResult().lastChild.classList.add("square--added");
                    }, waitTime);
                }
            }
            e.preventDefault();
        }, false);
        this.getSortButton().addEventListener('click', function (e) {
            _this.sort.asc();
            e.preventDefault();
        });
    };
    return Form;
}());
/// <reference path="./Validate.ts" />
/// <reference path="./Form.ts" />
var validate = new Validate("input-num");
validate.init();
var sort = new Form({
    inputID: "input-num",
    resultID: "result",
    itemClass: "square",
    sortID: "sort"
});
sort.init();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC90cy9WYWxpZGF0ZS50cyIsImFwcC90cy9Tb3J0LnRzIiwiYXBwL3RzL0Zvcm0udHMiLCJhcHAvdHMvYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGlGQUFpRjtBQUVqRjtJQUtJLHdDQUF3QztJQUN4QyxrQkFBWSxFQUFVO1FBQ2xCLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEIsUUFBUSxDQUFDLE9BQU8sR0FBRyxvQ0FBb0MsQ0FBQTtJQUMzRCxDQUFDO0lBRUQsdUJBQXVCO0lBQ2hCLHVCQUFJLEdBQVg7UUFDSSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVELG1EQUFtRDtJQUMzQywyQkFBUSxHQUFoQixVQUFpQixFQUFVO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQXFCLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVELGlDQUFpQztJQUN6QiwyQkFBUSxHQUFoQjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxvQ0FBb0M7SUFDNUIsd0JBQUssR0FBYixVQUFjLEtBQVU7UUFDbEIsSUFBSSxDQUFDLENBQUM7UUFFTixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDZixDQUFDO1FBRUQsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV0QixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFRCx5REFBeUQ7SUFDakQsMEJBQU8sR0FBZjtRQUFBLGlCQW9CQztRQW5CRyxJQUFJLEtBQUssR0FBZ0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEdBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsR0FB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WUFDcEQsS0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUVoQixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0wsV0FBQztBQUFELENBckdBLEFBcUdDLElBQUE7QUNqSEQsc0NBQXNDO0FBQ3RDLGtDQUFrQztBQUVsQyxJQUFJLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNyQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFcEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUM7SUFDaEIsT0FBTyxFQUFHLFdBQVc7SUFDckIsUUFBUSxFQUFFLFFBQVE7SUFDbEIsU0FBUyxFQUFFLFFBQVE7SUFDbkIsTUFBTSxFQUFFLE1BQU07Q0FDakIsQ0FBQyxDQUFDO0FBQ0MsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vRnVuY2lvbiBlbmNhcmdhZGEgZGUgaGFjZXIgbGEgdmFsaWRhY2nDs24gZGUgbsO6bWVyb3MgeSBtb3N0cmFyIG1lbnNhamVzIGRlIGVycm9yXHJcblxyXG5jbGFzcyBWYWxpZGF0ZVxyXG57XHJcbiAgICBwcml2YXRlIGlucHV0OiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgcHVibGljIHN0YXRpYyBtZXNzYWdlOiBzdHJpbmc7XHJcblxyXG4gICAgLy9PYnRlbmVtb3MgZWwgSUQgZGVsIGVsZW1lbnRvIGEgdmFsaWRhclxyXG4gICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuc2V0SW5wdXQoaWQpO1xyXG4gICAgICAgIFZhbGlkYXRlLm1lc3NhZ2UgPSBcIlBvciBmYXZvciBkaWdpdGUgdW4gdmFsb3IgbnVtZXJpY29cIlxyXG4gICAgfVxyXG5cclxuICAgIC8vSW5pY2lhbW9zIGxvcyBldmVudG9zXHJcbiAgICBwdWJsaWMgaW5pdCgpIHtcclxuICAgICAgICB0aGlzLnRyaWdnZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICAvL0NyZWFtb3MgYWwgaW5zdGFuY2lhIGEgbnVlc3RybyBlbGVtZW50byBhIHZhbGlkYXJcclxuICAgIHByaXZhdGUgc2V0SW5wdXQoaWQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuaW5wdXQgPSA8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy9PYnRlbmVtb3MgZWwgZWxlbWVudG8gYSB2YWxpZGFyXHJcbiAgICBwcml2YXRlIGdldElucHV0KCk6IEhUTUxJbnB1dEVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmlucHV0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vVmFsaWRhbW9zIHF1ZSBlbCBuw7ptZXJvIHNlYSBlbnRlcm9cclxuICAgIHByaXZhdGUgaXNJbnQodmFsdWU6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgbGV0IHg7XHJcblxyXG4gICAgICAgICAgaWYgKGlzTmFOKHZhbHVlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgeCA9IHBhcnNlRmxvYXQodmFsdWUpO1xyXG5cclxuICAgICAgICAgIHJldHVybiAoeCB8IDApID09PSB4O1xyXG4gICAgfVxyXG5cclxuICAgIC8vRXZlbnRvcyBlbmNhcmdhZG9zIGRlIHZhbGlyIHkgbW9zdHJhciBtZW5zYWplcyBkZSBlcnJvclxyXG4gICAgcHJpdmF0ZSB0cmlnZ2VyKCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBlcnJvciA9IDxIVE1MRWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI1wiK3RoaXMuZ2V0SW5wdXQoKS5pZCArIFwiICsgLmVycm9yXCIgKTtcclxuICAgICAgICBlcnJvci5pbm5lckhUTUwgPSBWYWxpZGF0ZS5tZXNzYWdlO1xyXG4gICAgICAgIHRoaXMuZ2V0SW5wdXQoKS5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJkaXNhYmxlZFwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRJbnB1dCgpLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGU6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCB0YXJnZXQgPSA8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldDtcclxuICAgICAgICAgICAgbGV0IHZhbCA9IHRhcmdldC52YWx1ZTtcclxuXHJcbiAgICAgICAgICAgIHRhcmdldC5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNhYmxlZFwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzSW50KHZhbCkpIHtcclxuICAgICAgICAgICAgICAgIGVycm9yLmNsYXNzTGlzdC5yZW1vdmUoXCJlcnJvci0tYWN0aXZlXCIpO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImVycm9yXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZhbC50b1N0cmluZygpICE9IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgIGVycm9yLmNsYXNzTGlzdC5hZGQoXCJlcnJvci0tYWN0aXZlXCIpO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImVycm9yXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0sIGZhbHNlKTtcclxuICAgIH1cclxufVxyXG4iLCIvLyBDbGFzZSBlbmNhcmdhZGEgZGUgcmVvcmRlbmFyIG51ZXN0cm8gYXJyYXkgeSBlbCBET01cclxuXHJcbmNsYXNzIFNvcnRcclxue1xyXG4gICAgcHJpdmF0ZSBpdGVtczogbnVtYmVyW107XHJcbiAgICBwcml2YXRlIF9pdGVtczogbnVtYmVyW107XHJcbiAgICBwcml2YXRlIGl0ZW1DbGFzczogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBwb3NpdGlvbnM6IGFueVtdO1xyXG5cclxuICAgIC8vIE9idGVuZW1vcyBsYSBjbGFzZSBjc3MgZGUgbnVlc3Ryb3MgbsO6bWVyb3NcclxuICAgIGNvbnN0cnVjdG9yKGl0ZW1TZWxlY3Rvcjogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5pdGVtcyA9IFtdO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb25zID0gW107XHJcbiAgICAgICAgdGhpcy5pdGVtQ2xhc3MgPSBpdGVtU2VsZWN0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgLy92ZXJpZmljYW1vcyBzaSBleGlzdGUgZWwgZWxlbWVudG8gcXVlIGRlc2VhbW9zIGFncmVnYXJcclxuICAgIHB1YmxpYyBpc0R1cGxpY2F0ZShuOiBudW1iZXIpOiBib29sZWFuIHtcclxuICAgICAgICBsZXQgcmVzdWx0OiBib29sZWFuID0gdGhpcy5nZXRJdGVtcygpLnNvbWUoIChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtID09PSBuO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vRnVuY2lvbiBlbmNhcmdhZGEgZGUgaGFjZXIgbGFzIGxsYW1hZGFzIGFsIHJlb3JkZW5hbWllbnRvXHJcbiAgICBwdWJsaWMgYXNjKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ2V0UG9zaXRpb25zKCk7XHJcbiAgICAgICAgdGhpcy5faXRlbXMgPSB0aGlzLml0ZW1zLnNsaWNlKCk7XHJcbiAgICAgICAgdGhpcy5pdGVtcyA9IHRoaXMubWVyZ2VTb3J0KHRoaXMuZ2V0SXRlbXMoKSk7XHJcbiAgICAgICAgdGhpcy5hbmltYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy9GdW5jaW9uIGVuY2FyZ2FkYSBkZSBhbmltYXIgZWwgcmVvcmRlbmFtaWVudG9cclxuICAgIHB1YmxpYyBhbmltYXRlKCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBlbGVtOiBhbnkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMuaXRlbUNsYXNzKTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgZWxlbS5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0UG9zaXRpb24oaSwgdGhpcy5pdGVtcy5pbmRleE9mKHRoaXMuX2l0ZW1zW2ldKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc29ydERPTSgpO1xyXG4gICAgICAgIH0sIDcwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy9DYWxsYmFjayBkZSBsYSBmdW5jaW9uIGFuaW1hdGUoKSBlc3RhIGZ1bmNpb24gc2UgZW5jYXJnYSBkZSByZW9yZGVuYXIgZWwgZG9tIGRlc3B1ZXMgZGUgbGEgYW5pbWFjacOzblxyXG4gICAgcHJpdmF0ZSBzb3J0RE9NKCk6dm9pZCB7XHJcbiAgICAgICAgbGV0IGNvbnRhaW5lciA9IDxIVE1MRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdFwiKTtcclxuXHJcbiAgICAgICAgY29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XHJcblxyXG4gICAgICAgIGZvcihsZXQgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IDxIVE1MRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKHRoaXMuaXRlbUNsYXNzKTtcclxuICAgICAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCh0aGlzLml0ZW1DbGFzcytcIi0tYWRkZWRcIik7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmlubmVySFRNTCA9IHRoaXMuaXRlbXNbaV0udG9TdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIE9idGVuZW1vcyBsb3Mgb2Zmc2V0IGRlIGxvcyBlbGVtZW50b3NcclxuICAgIHByaXZhdGUgZ2V0UG9zaXRpb25zKCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBlbGVtOiBhbnkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMuaXRlbUNsYXNzKTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9ucyA9IFtdXHJcblxyXG4gICAgICAgIGZvcihsZXQgaTogbnVtYmVyID0gMDsgaSA8IGVsZW0ubGVuZ3RoOyBpKyspe1xyXG5cclxuICAgICAgICAgICB0aGlzLnBvc2l0aW9ucy5wdXNoKHtcclxuICAgICAgICAgICAgICAgbGVmdDogZWxlbVtpXS5vZmZzZXRMZWZ0LFxyXG4gICAgICAgICAgICAgICB0b3A6IGVsZW1baV0ub2Zmc2V0VG9wXHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vU2UgZW5jYXJnYSBkZSBtb3ZlciB1biBlbGVtZW50byBhIHVuYSBwb3NpY2nDs24gZXNwZWNpZmljYVxyXG4gICAgcHJpdmF0ZSBzZXRQb3NpdGlvbihiZWZvcmU6IG51bWJlciwgYWZ0ZXI6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGxldCBlbGVtOiBhbnkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMuaXRlbUNsYXNzKTtcclxuXHJcbiAgICAgICAgZWxlbVtiZWZvcmVdLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICAgIGVsZW1bYmVmb3JlXS5zdHlsZS5sZWZ0ID0gdGhpcy5wb3NpdGlvbnNbYmVmb3JlXS5sZWZ0K1wicHhcIjtcclxuICAgICAgICBlbGVtW2JlZm9yZV0uc3R5bGUudG9wID0gdGhpcy5wb3NpdGlvbnNbYmVmb3JlXS50b3ArXCJweFwiO1xyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGVsZW1bYmVmb3JlXS5zdHlsZS5sZWZ0ID0gdGhpcy5wb3NpdGlvbnNbYWZ0ZXJdLmxlZnQrXCJweFwiO1xyXG4gICAgICAgICAgICBlbGVtW2JlZm9yZV0uc3R5bGUudG9wID0gdGhpcy5wb3NpdGlvbnNbYWZ0ZXJdLnRvcCtcInB4XCI7XHJcbiAgICAgICAgfSwgMTAwKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyogTGFzIGZ1bmNpb25lcyBtZXJnZVNvcnQgeSBtZXJnZSBzZSBlbmNhcmdhbiBkZSByZW9yZGVuYXIgbnVlc3RybyBhcnJheVxyXG4gICAgdXNhbmRvIGVsIGFsZ29yaXRvbW8gZGUgT3JkZW5hbWllbnRvIHBvciBtZXpjbGEgKi9cclxuICAgIHByaXZhdGUgbWVyZ2VTb3J0KGFycjogbnVtYmVyW10pOiBudW1iZXJbXSB7XHJcbiAgICAgICAgdmFyIGxlbiA9IGFyci5sZW5ndGg7XHJcblxyXG4gICAgICAgIGlmIChsZW4gPDIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFycjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBtaWQgPSBNYXRoLmZsb29yKGxlbi8yKSxcclxuICAgICAgICAgICAgbGVmdCA9IGFyci5zbGljZSgwLG1pZCksXHJcbiAgICAgICAgICAgIHJpZ2h0ID1hcnIuc2xpY2UobWlkKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWVyZ2UodGhpcy5tZXJnZVNvcnQobGVmdCksIHRoaXMubWVyZ2VTb3J0KHJpZ2h0KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBtZXJnZShsZWZ0OiBudW1iZXJbXSwgcmlnaHQ6IG51bWJlcltdKTogbnVtYmVyW10ge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBbXSxcclxuICAgICAgICAgICAgbExlbiA9IGxlZnQubGVuZ3RoLFxyXG4gICAgICAgICAgICByTGVuID0gcmlnaHQubGVuZ3RoLFxyXG4gICAgICAgICAgICBsID0gMCxcclxuICAgICAgICAgICAgciA9IDA7XHJcbiAgICAgICAgICAgIHdoaWxlKGwgPCBsTGVuICYmIHIgPCByTGVuKXtcclxuICAgICAgICAgICAgICAgIGlmKGxlZnRbbF0gPCByaWdodFtyXSl7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChsZWZ0W2wrK10pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gocmlnaHRbcisrXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQuY29uY2F0KGxlZnQuc2xpY2UobCkpLmNvbmNhdChyaWdodC5zbGljZShyKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy9BZ3JlZ2Ftb3MgdW4gZWxlbWVudG9cclxuICAgIHB1YmxpYyBhZGRJdGVtKG46IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGlmICghdGhpcy5pc0R1cGxpY2F0ZShuKSkge1xyXG4gICAgICAgICAgICB0aGlzLml0ZW1zLnB1c2gobik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vT2J0ZW5lbW9zIGVsIGFycmF5IGNvbiB0b2RvcyBsb3MgZWxlbWVudG9zXHJcbiAgICBwdWJsaWMgZ2V0SXRlbXMoKTogbnVtYmVyW10ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLml0ZW1zO1xyXG4gICAgfVxyXG59XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL1NvcnQudHNcIiAvPlxyXG5cclxuLy9JbnRlcmZhY2UgZW5jYXJnYWRhIGRlIHZhbGlkYXIgbG9zIHBhcmFtZXRyb3MgbmVjZXNhcmlvcyBwYXJhIG51ZXN0cmEgY2xhc2VcclxuaW50ZXJmYWNlIGZvcm1PcHRpb25zXHJcbntcclxuICAgIGlucHV0SUQ6IHN0cmluZztcclxuICAgIHJlc3VsdElEOiBzdHJpbmc7XHJcbiAgICBpdGVtQ2xhc3M6IHN0cmluZztcclxuICAgIHNvcnRJRDogc3RyaW5nO1xyXG59XHJcblxyXG4vL0NsYXNlIGNvbiBsYSBsb2dpY2EgcHJpbmNpcGFsIGRlIG51ZXN0cmEgYXBsaWNhY2nDs25cclxuY2xhc3MgRm9ybVxyXG57XHJcbiAgICBwcml2YXRlIGZvcm06IEhUTUxFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBpbnB1dDogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgcmVzdWx0OiBIVE1MRWxlbWVudDtcclxuICAgIHByaXZhdGUgc29ydDogU29ydDtcclxuICAgIHByaXZhdGUgaXRlbUNsYXNzOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHNvcnRCdXR0b246IEhUTUxFbGVtZW50O1xyXG5cclxuICAgIC8vT2J0ZW5lbW9zIGxvcyBzZWxlY3RvcmVzIG5lY2VzYXJpb3NcclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM6IGZvcm1PcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5zZXRGb3JtKG9wdGlvbnMuaW5wdXRJRCk7XHJcbiAgICAgICAgdGhpcy5zZXRJbnB1dChvcHRpb25zLmlucHV0SUQpO1xyXG4gICAgICAgIHRoaXMuc2V0UmVzdWx0KG9wdGlvbnMucmVzdWx0SUQpO1xyXG4gICAgICAgIHRoaXMuc2V0SXRlbUNsYXNzKG9wdGlvbnMuaXRlbUNsYXNzKTtcclxuICAgICAgICB0aGlzLnNldFNvcnRCdXR0b24ob3B0aW9ucy5zb3J0SUQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vSW5pY2lhciBudWVzdHJvcyBldmVudG9zIHkgY3JlYXIgbnVlc3RybyBvYmpldG8gYSByZW9yZGVuYXJcclxuICAgIHB1YmxpYyBpbml0KCkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlU29ydCgpO1xyXG4gICAgICAgIHRoaXMudHJpZ2dlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFNldHRlcnMgeSBHZXR0ZXJzIGVuY2FyZ2Fkb3MgZGUgbGFzIGluc3RhY2lhcyBhbCBET01cclxuICAgIHByaXZhdGUgc2V0Rm9ybShpZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5mb3JtID0gPEhUTUxFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKS5wYXJlbnRFbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0SW5wdXQoaWQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuaW5wdXQgPSA8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRSZXN1bHQoaWQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucmVzdWx0ID0gPEhUTUxFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldEl0ZW1DbGFzcyhjc3NDbGFzczogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5pdGVtQ2xhc3MgPSBjc3NDbGFzcztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldFNvcnRCdXR0b24oaWQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuc29ydEJ1dHRvbiA9IDxIVE1MRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVTb3J0KCkge1xyXG4gICAgICAgIHRoaXMuc29ydCA9IG5ldyBTb3J0KHRoaXMuaXRlbUNsYXNzKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldEZvcm0oKTogSFRNTEVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZvcm07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRSZXN1bHQoKTogSFRNTEVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldElucHV0KCk6IEhUTUxJbnB1dEVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmlucHV0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0U29ydEJ1dHRvbigpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc29ydEJ1dHRvbjtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy9FdmVudG9zIHByaW5jaXBhbGVzIC0gU3VibWl0IGRlbCBmb3JtdWxhcmlvIHkgQ2xpYyBhbCBib3TDs24gZGUgcmVvcmRlbmFyXHJcbiAgICBwcml2YXRlIHRyaWdnZXIoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5nZXRGb3JtKCkuYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGU6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCB0YXJnZXQgPSA8SFRNTEVsZW1lbnQ+ZS50YXJnZXQ7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZTpudW1iZXIgPSBwYXJzZUludCh0aGlzLmdldElucHV0KCkudmFsdWUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdlcnJvcicpICYmICF0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaXNhYmxlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IDxIVE1MRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCh0aGlzLml0ZW1DbGFzcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5pbm5lckhUTUwgPSB2YWx1ZS50b1N0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCB3YWl0VGltZSA9IDEwMDtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldElucHV0KCkudmFsdWUgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zb3J0LmlzRHVwbGljYXRlKHZhbHVlKSAmJiAhaXNOYU4odmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3J0LmFkZEl0ZW0odmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0UmVzdWx0KCkuYXBwZW5kQ2hpbGQoaXRlbSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEVzcGVyYW1vcyBxdWUgZWwgZWxlbWVudG8gc2VhIGFncmVnYWRvIGFsIGRvbSBwYXJhIHBvZGVyIGFncmVnYXIgbGEgYW5pbWFjacOzblxyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgKDxIVE1MRWxlbWVudD50aGlzLmdldFJlc3VsdCgpLmxhc3RDaGlsZCkuY2xhc3NMaXN0LmFkZChcInNxdWFyZS0tYWRkZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgd2FpdFRpbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfSwgZmFsc2UpO1xyXG5cclxuICAgICAgICB0aGlzLmdldFNvcnRCdXR0b24oKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlOiBFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNvcnQuYXNjKCk7XHJcblxyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vVmFsaWRhdGUudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9Gb3JtLnRzXCIgLz5cclxuXHJcbnZhciB2YWxpZGF0ZSA9IG5ldyBWYWxpZGF0ZShcImlucHV0LW51bVwiKTtcclxuICAgIHZhbGlkYXRlLmluaXQoKTtcclxuXHJcbnZhciBzb3J0ID0gbmV3IEZvcm0oe1xyXG4gICAgaW5wdXRJRDogIFwiaW5wdXQtbnVtXCIsXHJcbiAgICByZXN1bHRJRDogXCJyZXN1bHRcIixcclxuICAgIGl0ZW1DbGFzczogXCJzcXVhcmVcIixcclxuICAgIHNvcnRJRDogXCJzb3J0XCJcclxufSk7XHJcbiAgICBzb3J0LmluaXQoKTtcclxuIl19
