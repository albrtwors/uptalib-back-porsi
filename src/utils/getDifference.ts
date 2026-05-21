
interface getStockDifferenceProps {
    newStockValue: number
    oldCurrentStockValue: number
    oldAvailableStockValue: number
}



export default function getStockDifference({ newStockValue, oldCurrentStockValue, oldAvailableStockValue }: getStockDifferenceProps): number {
    const difference = oldCurrentStockValue - oldAvailableStockValue
    const newValue = newStockValue - difference
    return newValue

}