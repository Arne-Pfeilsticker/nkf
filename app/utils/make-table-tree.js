/**
 * Make table tree out of an array of row objects.
 *
 * @param {Array} table Array of row objects.
 * @param {String} children Key for the childrens. Sometimes items or values is needed. (optional)
 * @param {Array} columns If none, then all columns will be included. (optional)
 *                        columns[0] {String} Name of the id column.
 *                        columns[1] {String} Name of the parent id.
 *                        columns[2 ... n] {String} Name of selected columns.
 *                Parent rows have to have a lower index than their child rows.
 * @returns {Array} of tree structured objects.
 */
module.exports = function (table, children, columns) {

    // The parameters children and columns are optional.

    var _children = children || "children";
    var _id, _pid;

    if (columns === undefined) {
        _id = 'id';
        _pid = "parentid";

    } else {
        _id = columns[0];
        _pid = columns[1];
    }

    var _row, _index, _rows, _i, _cols;

    var temp = {};
    var _tree = [];

    var _columns = columns || [];
    _columns = (_columns.length < 3) ? [_id, _pid] : columns;

    for (_index = 0, _rows = table.length; _index < _rows; _index++) {

        if (_columns.length < 3) { // If none or only id and parentid are specified --> get all columns of the table.
            _row = table[_index];
        } else {                   // Get only in parameter columns specified columns.
            _row = {};
            for (_i = 0, _cols = _columns.length; _i < _cols; _i++) {
                _row[_columns[_i]] = (table[_index])[_columns[_i]];
            }
        }
        _row[_children] = [];
        temp[_row[_id]] = _row;
        if (temp[_row[_pid]] != null) {
            temp[_row[_pid]][_children].push(_row);
        } else {
            _tree.push(_row);
        }
    }
    return _tree;
};