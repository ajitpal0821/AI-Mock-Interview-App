interface HeadingsProps{
    title:string;
    description?:string;
    isSubHeading?:boolean
}
import { cn } from '@/lib/utils';
import React from 'react'

export const Headings = ({title,description,isSubHeading=false}:HeadingsProps) => {
  return (
        <div>
      <h2
        className={cn(
          "text-1xl md:text-2xl text-gray-800 font-semibold font-sans",
          isSubHeading && "text-lg md:text-xl"
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>

  )
}
