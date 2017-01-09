/// <reference path="./Validate.ts" />
/// <reference path="./Form.ts" />

var validate = new Validate("input-num");
    validate.init();

var sort = new Form({
    inputID:  "input-num",
    resultID: "result",
    itemClass: "square",
    sortID: "sort"
});
    sort.init();
