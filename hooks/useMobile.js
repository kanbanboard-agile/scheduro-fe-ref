"use client"

import { useState, useEffect } from "react"

export const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        const mediaQuery = window.matchMedia(query)

        const handleChange = (event) => {
            setMatches(event.matches)
        }

        setMatches(mediaQuery.matches)

        mediaQuery.addEventListener("change", handleChange)

        return () => {
            mediaQuery.removeEventListener("change", handleChange)
        }
    }, [query])

    return matches
}

