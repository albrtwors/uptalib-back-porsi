"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getStockDifference;
function getStockDifference({ newStockValue, oldCurrentStockValue, oldAvailableStockValue }) {
    const difference = oldCurrentStockValue - oldAvailableStockValue;
    const newValue = newStockValue - difference;
    return newValue;
}
//# sourceMappingURL=getDifference.js.map