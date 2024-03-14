import bus from "../helpers/bus"

export default function useFlashMessages(){
    function setFlashMessages(message: string, type: string, time: number){
        bus.emit('flash', {
            message: message,
            type: type,
            time: time
        })
    }
    return {setFlashMessages}
}