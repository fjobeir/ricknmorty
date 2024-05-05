import { FC } from "react"

const MultiSelectLoading: FC = () => {
    return (
        <div className="w-full h-full absolute top-0 left-0 z-20 bg-white bg-opacity-50 flex justify-center items-center">
            <span className="relative flex h-6 w-6">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-6 w-6 bg-sky-500"></span>
            </span>
        </div>
    )
}

export default MultiSelectLoading