import type { ButtonHTMLAttributes } from 'react'
import './Button.scss'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: 'small' | 'medium'
  active?: boolean
}

function Button({
  variant = 'secondary',
  size = 'medium',
  active = false,
  type = 'button',
  className,
  ...rest
}: ButtonProps) {
  const classes = [
    'button',
    `button--${variant}`,
    size === 'small' && 'button--small',
    active && 'button--active',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <button type={type} className={classes} {...rest} />
}

export default Button
