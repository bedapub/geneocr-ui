import React from "react"
import CreateImageService from "./services/ImageService"

export const serviceInstance = CreateImageService()

export const state = {
    serviceInstance: serviceInstance
}

export const StateContext = React.createContext(state)
