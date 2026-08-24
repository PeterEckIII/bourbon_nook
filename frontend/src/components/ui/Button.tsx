import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { buttonClasses, type ButtonStyleProps } from './buttonClasses';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleProps {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, ringOffset, fullWidth, className = '', type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={`${buttonClasses({ variant, size, ringOffset, fullWidth })} ${className}`.trim()}
      {...props}
    />
  );
});

export default Button;
