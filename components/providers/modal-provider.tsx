"use client"
import { useEffect, useState } from "react"
import { CreateServerModal } from "../modals/create-server-modal"
import { InviteModal } from "../modals/invite-modal"

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)
    
    useEffect(() => {
        setIsMounted(true);
    }, [])

    // Return null during SSR and initial client render to prevent hydration mismatch
    if (!isMounted) {
        return null
    }

    return (
        <>
            <CreateServerModal/>
            <InviteModal/>
        </> 
    )
}