"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTotal = calculateTotal;
exports.calculateAverage = calculateAverage;
exports.formatCurrency = formatCurrency;
exports.getTopValues = getTopValues;
exports.printSummary = printSummary;
function calculateTotal(values) {
    return values.reduce((total, value) => total + value, 0);
}
function calculateAverage(values) {
    if (values.length === 0) {
        return 0;
    }
    return calculateTotal(values) / values.length;
}
function formatCurrency(amount, symbol) {
    return `${amount} ${symbol}`;
}
function getTopValues(values, count) {
    if (count <= 0) {
        return [];
    }
    return [...values].sort((a, b) => b - a).slice(0, count);
}
function printSummary(values) {
    console.log(`Всего записей: ${values.length}`);
    console.log(`Сумма: ${calculateTotal(values)}`);
    console.log(`Среднее: ${calculateAverage(values)}`);
}
const numbers = [100, 500, 1000, 2000, 800];
console.log("Сумма:", calculateTotal(numbers));
console.log("Среднее:", calculateAverage(numbers));
console.log("Форматированная сумма:", formatCurrency(1000, "₽"));
console.log("Наибольшие значения:", getTopValues(numbers, 2));
printSummary(numbers);
