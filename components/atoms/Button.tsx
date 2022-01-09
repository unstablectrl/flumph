import clsx from 'clsx'
import { forwardRef } from 'react'

type ButtonProps = JSX.IntrinsicElements['button']

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'bg-purple-500 hover:bg-purple-400 border-b-4 border-purple-700 hover:border-purple-500 text-white text-center py-2 px-4 rounded',
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'

export default Button
