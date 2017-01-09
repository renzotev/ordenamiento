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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC90cy9WYWxpZGF0ZS50cyIsImFwcC90cy9Tb3J0LnRzIiwiYXBwL3RzL0Zvcm0udHMiLCJhcHAvdHMvYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGlGQUFpRjtBQUVqRjtJQUtJLHdDQUF3QztJQUN4QyxrQkFBWSxFQUFVO1FBQ2xCLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEIsUUFBUSxDQUFDLE9BQU8sR0FBRyxvQ0FBb0MsQ0FBQTtJQUMzRCxDQUFDO0lBRUQsdUJBQXVCO0lBQ2hCLHVCQUFJLEdBQVg7UUFDSSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVELG1EQUFtRDtJQUMzQywyQkFBUSxHQUFoQixVQUFpQixFQUFVO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQXFCLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVELGlDQUFpQztJQUN6QiwyQkFBUSxHQUFoQjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxvQ0FBb0M7SUFDNUIsd0JBQUssR0FBYixVQUFjLEtBQVU7UUFDbEIsSUFBSSxDQUFDLENBQUM7UUFFTixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDZixDQUFDO1FBRUQsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV0QixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFRCx5REFBeUQ7SUFDakQsMEJBQU8sR0FBZjtRQUFBLGlCQW9CQztRQW5CRyxJQUFJLEtBQUssR0FBZ0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEdBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsR0FB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Q0FBQztZQUVoQixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0wsV0FBQztBQUFELENBckdBLEFBcUdDLElBQUE7QUNqSEQsc0NBQXNDO0FBQ3RDLGtDQUFrQztBQUVsQyxJQUFJLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNyQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFcEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUM7SUFDaEIsT0FBTyxFQUFHLFdBQVc7SUFDckIsUUFBUSxFQUFFLFFBQVE7SUFDbEIsU0FBUyxFQUFFLFFBQVE7SUFDbkIsTUFBTSxFQUFFLE1BQU07Q0FDakIsQ0FBQyxDQUFDO0FBQ0MsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vRnVuY2lvbiBlbmNhcmdhZGEgZGUgaGFjZXIgbGEgdmFsaWRhY2nDs24gZGUgbsO6bWVyb3MgeSBtb3N0cmFyIG1lbnNhamVzIGRlIGVycm9yXG5cbmNsYXNzIFZhbGlkYXRlXG57XG4gICAgcHJpdmF0ZSBpbnB1dDogSFRNTElucHV0RWxlbWVudDtcbiAgICBwdWJsaWMgc3RhdGljIG1lc3NhZ2U6IHN0cmluZztcblxuICAgIC8vT2J0ZW5lbW9zIGVsIElEIGRlbCBlbGVtZW50byBhIHZhbGlkYXJcbiAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuc2V0SW5wdXQoaWQpO1xuICAgICAgICBWYWxpZGF0ZS5tZXNzYWdlID0gXCJQb3IgZmF2b3IgZGlnaXRlIHVuIHZhbG9yIG51bWVyaWNvXCJcbiAgICB9XG5cbiAgICAvL0luaWNpYW1vcyBsb3MgZXZlbnRvc1xuICAgIHB1YmxpYyBpbml0KCkge1xuICAgICAgICB0aGlzLnRyaWdnZXIoKTtcbiAgICB9XG5cbiAgICAvL0NyZWFtb3MgYWwgaW5zdGFuY2lhIGEgbnVlc3RybyBlbGVtZW50byBhIHZhbGlkYXJcbiAgICBwcml2YXRlIHNldElucHV0KGlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pbnB1dCA9IDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICB9XG5cbiAgICAvL09idGVuZW1vcyBlbCBlbGVtZW50byBhIHZhbGlkYXJcbiAgICBwcml2YXRlIGdldElucHV0KCk6IEhUTUxJbnB1dEVsZW1lbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dDtcbiAgICB9XG5cbiAgICAvL1ZhbGlkYW1vcyBxdWUgZWwgbsO6bWVybyBzZWEgZW50ZXJvXG4gICAgcHJpdmF0ZSBpc0ludCh2YWx1ZTogYW55KTogYm9vbGVhbiB7XG4gICAgICAgICAgbGV0IHg7XG5cbiAgICAgICAgICBpZiAoaXNOYU4odmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgeCA9IHBhcnNlRmxvYXQodmFsdWUpO1xuXG4gICAgICAgICAgcmV0dXJuICh4IHwgMCkgPT09IHg7XG4gICAgfVxuXG4gICAgLy9FdmVudG9zIGVuY2FyZ2Fkb3MgZGUgdmFsaXIgeSBtb3N0cmFyIG1lbnNhamVzIGRlIGVycm9yXG4gICAgcHJpdmF0ZSB0cmlnZ2VyKCk6IHZvaWQge1xuICAgICAgICBsZXQgZXJyb3IgPSA8SFRNTEVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNcIit0aGlzLmdldElucHV0KCkuaWQgKyBcIiArIC5lcnJvclwiICk7XG4gICAgICAgIGVycm9yLmlubmVySFRNTCA9IFZhbGlkYXRlLm1lc3NhZ2U7XG4gICAgICAgIHRoaXMuZ2V0SW5wdXQoKS5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJkaXNhYmxlZFwiKTtcblxuICAgICAgICB0aGlzLmdldElucHV0KCkuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCB0YXJnZXQgPSA8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldDtcbiAgICAgICAgICAgIGxldCB2YWwgPSB0YXJnZXQudmFsdWU7XG5cbiAgICAgICAgICAgIHRhcmdldC5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNhYmxlZFwiKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNJbnQodmFsKSkge1xuICAgICAgICAgICAgICAgIGVycm9yLmNsYXNzTGlzdC5yZW1vdmUoXCJlcnJvci0tYWN0aXZlXCIpO1xuICAgICAgICAgICAgICAgIHRhcmdldC5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJlcnJvclwiKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsLnRvU3RyaW5nKCkgIT0gXCJcIikge1xuICAgICAgICAgICAgICAgIGVycm9yLmNsYXNzTGlzdC5hZGQoXCJlcnJvci0tYWN0aXZlXCIpO1xuICAgICAgICAgICAgICAgIHRhcmdldC5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJlcnJvclwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LCBmYWxzZSk7XG4gICAgfVxufVxuIiwiLy8gQ2xhc2UgZW5jYXJnYWRhIGRlIHJlb3JkZW5hciBudWVzdHJvIGFycmF5IHkgZWwgRE9NXG5cbmNsYXNzIFNvcnRcbntcbiAgICBwcml2YXRlIGl0ZW1zOiBudW1iZXJbXTtcbiAgICBwcml2YXRlIF9pdGVtczogbnVtYmVyW107XG4gICAgcHJpdmF0ZSBpdGVtQ2xhc3M6IHN0cmluZztcbiAgICBwcml2YXRlIHBvc2l0aW9uczogYW55W107XG5cbiAgICAvLyBPYnRlbmVtb3MgbGEgY2xhc2UgY3NzIGRlIG51ZXN0cm9zIG7Dum1lcm9zXG4gICAgY29uc3RydWN0b3IoaXRlbVNlbGVjdG9yOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5pdGVtcyA9IFtdO1xuICAgICAgICB0aGlzLnBvc2l0aW9ucyA9IFtdO1xuICAgICAgICB0aGlzLml0ZW1DbGFzcyA9IGl0ZW1TZWxlY3RvcjtcbiAgICB9XG5cbiAgICAvL3ZlcmlmaWNhbW9zIHNpIGV4aXN0ZSBlbCBlbGVtZW50byBxdWUgZGVzZWFtb3MgYWdyZWdhclxuICAgIHB1YmxpYyBpc0R1cGxpY2F0ZShuOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICAgICAgbGV0IHJlc3VsdDogYm9vbGVhbiA9IHRoaXMuZ2V0SXRlbXMoKS5zb21lKCAoaXRlbSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW0gPT09IG47XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLy9GdW5jaW9uIGVuY2FyZ2FkYSBkZSBoYWNlciBsYXMgbGxhbWFkYXMgYWwgcmVvcmRlbmFtaWVudG9cbiAgICBwdWJsaWMgYXNjKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmdldFBvc2l0aW9ucygpO1xuICAgICAgICB0aGlzLl9pdGVtcyA9IHRoaXMuaXRlbXMuc2xpY2UoKTtcbiAgICAgICAgdGhpcy5pdGVtcyA9IHRoaXMubWVyZ2VTb3J0KHRoaXMuZ2V0SXRlbXMoKSk7XG4gICAgICAgIHRoaXMuYW5pbWF0ZSgpO1xuICAgIH1cblxuICAgIC8vRnVuY2lvbiBlbmNhcmdhZGEgZGUgYW5pbWFyIGVsIHJlb3JkZW5hbWllbnRvXG4gICAgcHVibGljIGFuaW1hdGUoKTogdm9pZCB7XG4gICAgICAgIGxldCBlbGVtOiBhbnkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMuaXRlbUNsYXNzKTtcblxuICAgICAgICBmb3IobGV0IGk6IG51bWJlciA9IDA7IGkgPCBlbGVtLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIHRoaXMuc2V0UG9zaXRpb24oaSwgdGhpcy5pdGVtcy5pbmRleE9mKHRoaXMuX2l0ZW1zW2ldKSk7XG4gICAgICAgIH1cblxuICAgICAgICBzZXRUaW1lb3V0KCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNvcnRET00oKTtcbiAgICAgICAgfSwgNzAwKTtcbiAgICB9XG5cbiAgICAvL0NhbGxiYWNrIGRlIGxhIGZ1bmNpb24gYW5pbWF0ZSgpIGVzdGEgZnVuY2lvbiBzZSBlbmNhcmdhIGRlIHJlb3JkZW5hciBlbCBkb20gZGVzcHVlcyBkZSBsYSBhbmltYWNpw7NuXG4gICAgcHJpdmF0ZSBzb3J0RE9NKCk6dm9pZCB7XG4gICAgICAgIGxldCBjb250YWluZXIgPSA8SFRNTEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZXN1bHRcIik7XG5cbiAgICAgICAgY29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAgICAgZm9yKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5pdGVtcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBsZXQgaXRlbSA9IDxIVE1MRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCh0aGlzLml0ZW1DbGFzcyk7XG4gICAgICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKHRoaXMuaXRlbUNsYXNzK1wiLS1hZGRlZFwiKTtcbiAgICAgICAgICAgICAgICBpdGVtLmlubmVySFRNTCA9IHRoaXMuaXRlbXNbaV0udG9TdHJpbmcoKTtcblxuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGl0ZW0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIE9idGVuZW1vcyBsb3Mgb2Zmc2V0IGRlIGxvcyBlbGVtZW50b3NcbiAgICBwcml2YXRlIGdldFBvc2l0aW9ucygpOiB2b2lkIHtcbiAgICAgICAgbGV0IGVsZW06IGFueSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcy5pdGVtQ2xhc3MpO1xuXG4gICAgICAgIGZvcihsZXQgaTogbnVtYmVyID0gMDsgaSA8IGVsZW0ubGVuZ3RoOyBpKyspe1xuXG4gICAgICAgICAgIHRoaXMucG9zaXRpb25zLnB1c2goe1xuICAgICAgICAgICAgICAgbGVmdDogZWxlbVtpXS5vZmZzZXRMZWZ0LFxuICAgICAgICAgICAgICAgdG9wOiBlbGVtW2ldLm9mZnNldFRvcFxuICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vU2UgZW5jYXJnYSBkZSBtb3ZlciB1biBlbGVtZW50byBhIHVuYSBwb3NpY2nDs24gZXNwZWNpZmljYVxuICAgIHByaXZhdGUgc2V0UG9zaXRpb24oYmVmb3JlOiBudW1iZXIsIGFmdGVyOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgbGV0IGVsZW06IGFueSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcy5pdGVtQ2xhc3MpO1xuXG4gICAgICAgIGVsZW1bYmVmb3JlXS5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgICAgZWxlbVtiZWZvcmVdLnN0eWxlLmxlZnQgPSB0aGlzLnBvc2l0aW9uc1tiZWZvcmVdLmxlZnQrXCJweFwiO1xuICAgICAgICBlbGVtW2JlZm9yZV0uc3R5bGUudG9wID0gdGhpcy5wb3NpdGlvbnNbYmVmb3JlXS50b3ArXCJweFwiO1xuXG4gICAgICAgIHNldFRpbWVvdXQoICgpID0+IHtcbiAgICAgICAgICAgIGVsZW1bYmVmb3JlXS5zdHlsZS5sZWZ0ID0gdGhpcy5wb3NpdGlvbnNbYWZ0ZXJdLmxlZnQrXCJweFwiO1xuICAgICAgICAgICAgZWxlbVtiZWZvcmVdLnN0eWxlLnRvcCA9IHRoaXMucG9zaXRpb25zW2FmdGVyXS50b3ArXCJweFwiO1xuICAgICAgICB9LCAxMDApO1xuICAgIH1cblxuXG4gICAgLyogTGFzIGZ1bmNpb25lcyBtZXJnZVNvcnQgeSBtZXJnZSBzZSBlbmNhcmdhbiBkZSByZW9yZGVuYXIgbnVlc3RybyBhcnJheVxuICAgIHVzYW5kbyBlbCBhbGdvcml0b21vIGRlIE9yZGVuYW1pZW50byBwb3IgbWV6Y2xhICovXG4gICAgcHJpdmF0ZSBtZXJnZVNvcnQoYXJyOiBudW1iZXJbXSk6IG51bWJlcltdIHtcbiAgICAgICAgdmFyIGxlbiA9IGFyci5sZW5ndGg7XG5cbiAgICAgICAgaWYgKGxlbiA8Mikge1xuICAgICAgICAgICAgcmV0dXJuIGFycjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBtaWQgPSBNYXRoLmZsb29yKGxlbi8yKSxcbiAgICAgICAgICAgIGxlZnQgPSBhcnIuc2xpY2UoMCxtaWQpLFxuICAgICAgICAgICAgcmlnaHQgPWFyci5zbGljZShtaWQpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLm1lcmdlKHRoaXMubWVyZ2VTb3J0KGxlZnQpLCB0aGlzLm1lcmdlU29ydChyaWdodCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgbWVyZ2UobGVmdDogbnVtYmVyW10sIHJpZ2h0OiBudW1iZXJbXSk6IG51bWJlcltdIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdLFxuICAgICAgICAgICAgbExlbiA9IGxlZnQubGVuZ3RoLFxuICAgICAgICAgICAgckxlbiA9IHJpZ2h0Lmxlbmd0aCxcbiAgICAgICAgICAgIGwgPSAwLFxuICAgICAgICAgICAgciA9IDA7XG4gICAgICAgICAgICB3aGlsZShsIDwgbExlbiAmJiByIDwgckxlbil7XG4gICAgICAgICAgICAgICAgaWYobGVmdFtsXSA8IHJpZ2h0W3JdKXtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChsZWZ0W2wrK10pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChyaWdodFtyKytdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQuY29uY2F0KGxlZnQuc2xpY2UobCkpLmNvbmNhdChyaWdodC5zbGljZShyKSk7XG4gICAgfVxuXG4gICAgLy9BZ3JlZ2Ftb3MgdW4gZWxlbWVudG9cbiAgICBwdWJsaWMgYWRkSXRlbShuOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRHVwbGljYXRlKG4pKSB7XG4gICAgICAgICAgICB0aGlzLml0ZW1zLnB1c2gobik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvL09idGVuZW1vcyBlbCBhcnJheSBjb24gdG9kb3MgbG9zIGVsZW1lbnRvc1xuICAgIHB1YmxpYyBnZXRJdGVtcygpOiBudW1iZXJbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLml0ZW1zO1xuICAgIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL1NvcnQudHNcIiAvPlxuXG4vL0ludGVyZmFjZSBlbmNhcmdhZGEgZGUgdmFsaWRhciBsb3MgcGFyYW1ldHJvcyBuZWNlc2FyaW9zIHBhcmEgbnVlc3RyYSBjbGFzZVxuaW50ZXJmYWNlIGZvcm1PcHRpb25zXG57XG4gICAgaW5wdXRJRDogc3RyaW5nO1xuICAgIHJlc3VsdElEOiBzdHJpbmc7XG4gICAgaXRlbUNsYXNzOiBzdHJpbmc7XG4gICAgc29ydElEOiBzdHJpbmc7XG59XG5cbi8vQ2xhc2UgY29uIGxhIGxvZ2ljYSBwcmluY2lwYWwgZGUgbnVlc3RyYSBhcGxpY2FjacOzblxuY2xhc3MgRm9ybVxue1xuICAgIHByaXZhdGUgZm9ybTogSFRNTEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBpbnB1dDogSFRNTElucHV0RWxlbWVudDtcbiAgICBwcml2YXRlIHJlc3VsdDogSFRNTEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBzb3J0OiBTb3J0O1xuICAgIHByaXZhdGUgaXRlbUNsYXNzOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBzb3J0QnV0dG9uOiBIVE1MRWxlbWVudDtcblxuICAgIC8vT2J0ZW5lbW9zIGxvcyBzZWxlY3RvcmVzIG5lY2VzYXJpb3NcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zOiBmb3JtT3B0aW9ucykge1xuICAgICAgICB0aGlzLnNldEZvcm0ob3B0aW9ucy5pbnB1dElEKTtcbiAgICAgICAgdGhpcy5zZXRJbnB1dChvcHRpb25zLmlucHV0SUQpO1xuICAgICAgICB0aGlzLnNldFJlc3VsdChvcHRpb25zLnJlc3VsdElEKTtcbiAgICAgICAgdGhpcy5zZXRJdGVtQ2xhc3Mob3B0aW9ucy5pdGVtQ2xhc3MpO1xuICAgICAgICB0aGlzLnNldFNvcnRCdXR0b24ob3B0aW9ucy5zb3J0SUQpO1xuICAgIH1cblxuICAgIC8vSW5pY2lhciBudWVzdHJvcyBldmVudG9zIHkgY3JlYXIgbnVlc3RybyBvYmpldG8gYSByZW9yZGVuYXJcbiAgICBwdWJsaWMgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVTb3J0KCk7XG4gICAgICAgIHRoaXMudHJpZ2dlcigpO1xuICAgIH1cblxuICAgIC8vIFNldHRlcnMgeSBHZXR0ZXJzIGVuY2FyZ2Fkb3MgZGUgbGFzIGluc3RhY2lhcyBhbCBET01cbiAgICBwcml2YXRlIHNldEZvcm0oaWQ6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLmZvcm0gPSA8SFRNTEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpLnBhcmVudEVsZW1lbnQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRJbnB1dChpZDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaW5wdXQgPSA8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRSZXN1bHQoaWQ6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLnJlc3VsdCA9IDxIVE1MRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRJdGVtQ2xhc3MoY3NzQ2xhc3M6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLml0ZW1DbGFzcyA9IGNzc0NsYXNzO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0U29ydEJ1dHRvbihpZDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc29ydEJ1dHRvbiA9IDxIVE1MRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVTb3J0KCkge1xuICAgICAgICB0aGlzLnNvcnQgPSBuZXcgU29ydCh0aGlzLml0ZW1DbGFzcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRGb3JtKCk6IEhUTUxFbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFJlc3VsdCgpOiBIVE1MRWxlbWVudCB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldElucHV0KCk6IEhUTUxJbnB1dEVsZW1lbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFNvcnRCdXR0b24oKTogSFRNTEVsZW1lbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5zb3J0QnV0dG9uO1xuICAgIH1cblxuXG4gICAgLy9FdmVudG9zIHByaW5jaXBhbGVzIC0gU3VibWl0IGRlbCBmb3JtdWxhcmlvIHkgQ2xpYyBhbCBib3TDs24gZGUgcmVvcmRlbmFyXG4gICAgcHJpdmF0ZSB0cmlnZ2VyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmdldEZvcm0oKS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCB0YXJnZXQgPSA8SFRNTEVsZW1lbnQ+ZS50YXJnZXQ7XG4gICAgICAgICAgICBsZXQgdmFsdWU6bnVtYmVyID0gcGFyc2VJbnQodGhpcy5nZXRJbnB1dCgpLnZhbHVlKTtcblxuICAgICAgICAgICAgaWYgKCF0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdlcnJvcicpICYmICF0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaXNhYmxlZCcpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSA8SFRNTEVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKHRoaXMuaXRlbUNsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5pbm5lckhUTUwgPSB2YWx1ZS50b1N0cmluZygpO1xuXG4gICAgICAgICAgICAgICAgbGV0IHdhaXRUaW1lID0gMTAwO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRJbnB1dCgpLnZhbHVlID0gXCJcIjtcblxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zb3J0LmlzRHVwbGljYXRlKHZhbHVlKSAmJiAhaXNOYU4odmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc29ydC5hZGRJdGVtKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRSZXN1bHQoKS5hcHBlbmRDaGlsZChpdGVtKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBFc3BlcmFtb3MgcXVlIGVsIGVsZW1lbnRvIHNlYSBhZ3JlZ2FkbyBhbCBkb20gcGFyYSBwb2RlciBhZ3JlZ2FyIGxhIGFuaW1hY2nDs25cbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCggKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgKDxIVE1MRWxlbWVudD50aGlzLmdldFJlc3VsdCgpLmxhc3RDaGlsZCkuY2xhc3NMaXN0LmFkZChcInNxdWFyZS0tYWRkZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIH0sIHdhaXRUaW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSwgZmFsc2UpO1xuXG4gICAgICAgIHRoaXMuZ2V0U29ydEJ1dHRvbigpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNvcnQuYXNjKCk7XG5cbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vVmFsaWRhdGUudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vRm9ybS50c1wiIC8+XG5cbnZhciB2YWxpZGF0ZSA9IG5ldyBWYWxpZGF0ZShcImlucHV0LW51bVwiKTtcbiAgICB2YWxpZGF0ZS5pbml0KCk7XG5cbnZhciBzb3J0ID0gbmV3IEZvcm0oe1xuICAgIGlucHV0SUQ6ICBcImlucHV0LW51bVwiLFxuICAgIHJlc3VsdElEOiBcInJlc3VsdFwiLFxuICAgIGl0ZW1DbGFzczogXCJzcXVhcmVcIixcbiAgICBzb3J0SUQ6IFwic29ydFwiXG59KTtcbiAgICBzb3J0LmluaXQoKTtcbiJdfQ==
