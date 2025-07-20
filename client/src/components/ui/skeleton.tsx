import React from 'react'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number
  height?: string | number
  className?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({ width, height, className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-gray-700 rounded ${className}`}
      style={{ width, height, ...props.style }}
      {...props}
    />
  )
}

export default Skeleton 