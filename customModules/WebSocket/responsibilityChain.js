class Handler{
    constructor(type, handler){
        this.type = type
        this.handler = handler
        this.handlers = Array.from(arguments).slice(1)
    }

    recursiveHandlersExecute = async (i, req, res) => {
        try{
            let [handledReq, HandledRes] = await this.handlers[i](req, res)
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




