
export function parseBoolean(value: string): boolean {
    if(typeof value === 'boolean') {
        return value
    }

    if(typeof value === 'string') {
        const lowerValue = value.trim().toLowerCase()
        
        if(lowerValue === 'true') {
            return true
        }
        if(lowerValue === 'false') {
            return false
        }
    }

    throw new Error(
        `Could not convert the value ${value} into a boolean value.`
    )
}