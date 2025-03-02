import { forwardRef, ReactNode, HTMLProps } from 'react'
import clsx from 'clsx'

// ContainerOuter component
interface ContainerOuterProps extends HTMLProps<HTMLDivElement> {
  children: ReactNode
}

export const ContainerOuter = forwardRef<HTMLDivElement, ContainerOuterProps>(function OuterContainer(
  { className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={clsx('sm:px-8', className)} {...props}>
      <div className="mx-auto w-full max-w-7xl lg:px-8">{children}</div>
    </div>
  )
})

// ContainerInner component
interface ContainerInnerProps extends HTMLProps<HTMLDivElement> {
  children: ReactNode
}

export const ContainerInner = forwardRef<HTMLDivElement, ContainerInnerProps>(function InnerContainer(
  { className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={clsx('relative px-4 sm:px-8 lg:px-12', className)}
      {...props}
    >
      <div className="mx-auto max-w-2xl lg:max-w-5xl">{children}</div>
    </div>
  )
})

// Main Container component
interface ContainerProps {
  children: ReactNode
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container(
  { children, ...props },
  ref,
) {
  return (
    <ContainerOuter ref={ref} {...props}>
      <ContainerInner>{children}</ContainerInner>
    </ContainerOuter>
  )
})
