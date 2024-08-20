import React, { FC } from 'react'
import { Button, ButtonProps } from '../ui/button'

interface LoadingButtonProps extends ButtonProps {
  isLoading: boolean;
  label?: string;
}

const LoadingButton: FC<LoadingButtonProps> = ({ children, isLoading, label = "Processing", ...props }) => {
  return (
    <Button {...props} disabled={isLoading}>
      {isLoading ?
        <div className="flex h-screen gap-2 items-center justify-center ">
          <span>{label}</span>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></div>
        </div>
        : children}
    </Button>
  )
}

export default LoadingButton