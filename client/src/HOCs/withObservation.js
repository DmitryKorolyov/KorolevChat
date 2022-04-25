import React, { useEffect, useRef } from "react"

function sleep(milliseconds) {
	let t = (new Date()).getTime();
	let i = 0;
	while (((new Date()).getTime() - t) < milliseconds) {
		i++;
	}
}


export const WithObservation = (Reversibale, callback, css = {unread: undefined, read: undefined}, delay = 0) => {
    const ref = useRef()
    // const [isVisible, setIsVisible] = useState(false)
    const handleVisible = ([entry], observer) => {
        if(entry.isIntersecting){
            ref.current.className = css.read
            callback()
            
            observer.unobserve(ref.current)      
            // setTimeout(() => {

            // }, delay)
            
        }
    }
    const options = {
        root: null,
        threshold: 0.5
    }

     useEffect(() => {
         const observer = new IntersectionObserver(handleVisible, options)
         if (ref.current) observer.observe(ref.current)
     }, [ref, options])
     
    return function Wrapped(props) {
        return <div ref = {ref} className = {css.unread}>
                <Reversibale {...props}/>
            </div> 
    }
}