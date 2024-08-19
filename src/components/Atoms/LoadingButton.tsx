import React, { FC } from 'react'
import { Button, ButtonProps } from '../ui/button'

interface LoadingButtonProps extends ButtonProps {
  isLoading: boolean;
}

const LoadingButton: FC<LoadingButtonProps> = ({ children, isLoading, ...props }) => {
  return (
    <Button {...props} >
      {isLoading ? 'Loading...' : children}
    </Button>
  )
}

export default LoadingButton