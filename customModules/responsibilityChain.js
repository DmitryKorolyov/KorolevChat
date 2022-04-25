class Handler{
    constructor(type, handler){
        // for (let i in arguments) {console.log(arguments[i])}
        this.type = type
        this.handler = handler
        // ЭКСПЕРИМЕНТАЛЬНО
        this.handlers = Array.from(arguments).slice(1)

    }

    // executeHandlers = (req, res) => {
    //     for (let i in this.handlers){
    //         console.log(i)
    //         [req, res] = this.handlers[i](req, res)
    //     }
    // }

    recursiveHandlersExecute = async (i, req, res) => {
        try{
            let [handledReq, HandledRes] = await this.handlers[i](req, res)
            
            console.log(handledReq)
            this.recursiveHandlersExecute(i + 1, handledReq, HandledRes)
        }
        catch{
            return
        }
    }

    next = (req, res) => {
        try {
            this.nextHandler.handle(req, res)
        }
        catch(e){
            console.log(e)
        }
    }

    setNext = (handler) => {
        this.nextHandler = handler
    }

    canHandle = (req) => {
        return (req.type == this.type)
    }

    handle = (req, res) => {
        if (this.canHandle(req)){
            // СТАБИЛЬНО:
            // this.handler(req, res)
            // ЭКСПЕРИМЕНТАЛЬНО:
            this.recursiveHandlersExecute(0, req, res)
            
        }
        else {
            this.next(req, res)
        }
    }
}



class ResponsibilityChain{
    constructor(){
    this.chainedHandlers = []
    }
    
    useIfType(type, handler){
        this.chainedHandlers.push(new Handler(type, ...Array.from(arguments).slice(1)))
        if (this.chainedHandlers.length > 1) {
            this.chainedHandlers[this.chainedHandlers.length - 2].setNext(this.chainedHandlers[this.chainedHandlers.length - 1])
        }
    }

    pass(req, res){
        this.chainedHandlers[0].handle(req, res)
    }

}



module.exports = new ResponsibilityChain()




