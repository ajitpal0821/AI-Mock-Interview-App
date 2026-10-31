import React from 'react'
import { Link } from 'react-router-dom'

const LogoContainer = () => {
    return (
        <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <img 
                src="/assets/svg/logo.svg" 
                alt="MockAI Logo" 
                className="w-7 h-7 object-contain"
            />
            <span className="font-semibold text-lg tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
                MockAI
            </span>
        </Link>
    )
}

export default LogoContainer