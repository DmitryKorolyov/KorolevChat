import { useCallback, useState } from "react"

export const useResizeObserver = (callback, element) => {

    const [isViewResized, setViewSizeStatus] = useState(true)

    const startObserving = useCallback( () => {
        const resizeObserver = new ResizeObserver(entries => {
            setViewSizeStatus(prev => !prev)
            callback()
        })
        resizeObserver.observe(element)
    }, [])
    
    return [isViewResized, startObserving]

}
