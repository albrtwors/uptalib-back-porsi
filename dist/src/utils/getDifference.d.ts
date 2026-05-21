interface getStockDifferenceProps {
    newStockValue: number;
    oldCurrentStockValue: number;
    oldAvailableStockValue: number;
}
export default function getStockDifference({ newStockValue, oldCurrentStockValue, oldAvailableStockValue }: getStockDifferenceProps): number;
export {};
