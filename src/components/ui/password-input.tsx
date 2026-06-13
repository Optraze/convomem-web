'use client'

import { useId, useMemo, useState } from 'react'
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from 'lucide-react'

import type * as React from 'react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const PASSWORD_REQUIREMENTS = [
  { regex: /.{8,}/, text: 'At least 8 characters' },
  { regex: /[!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~-]/, text: 'At least 1 symbol' },
  { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
  { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
  { regex: /[0-9]/, text: 'At least 1 number' },
] as const

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, 'type'> & {
  showStrength?: boolean
}

function getPasswordValue(value: PasswordInputProps['value']) {
  if (typeof value === 'string') {
    return value
  }

  return ''
}

function getStrengthColor(score: number) {
  if (score === 0) {
    return 'bg-border'
  }

  if (score <= 2) {
    return 'bg-red-500'
  }

  if (score <= 4) {
    return 'bg-amber-500'
  }

  return 'bg-emerald-500'
}

function getStrengthWidth(score: number) {
  return ['w-0', 'w-1/5', 'w-2/5', 'w-3/5', 'w-4/5', 'w-full'][score]
}

function getStrengthText(score: number) {
  if (score === 0) {
    return 'Enter a password'
  }

  if (score <= 2) {
    return 'Weak password'
  }

  if (score <= 4) {
    return 'Medium password'
  }

  return 'Strong password'
}

function PasswordInput({
  id,
  className,
  value,
  defaultValue,
  onChange,
  showStrength = false,
  'aria-describedby': ariaDescribedBy,
  ...props
}: PasswordInputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const descriptionId = `${inputId}-password-strength`
  const [isVisible, setIsVisible] = useState(false)
  const [internalValue, setInternalValue] = useState(() =>
    getPasswordValue(defaultValue)
  )

  const password = value === undefined ? internalValue : getPasswordValue(value)

  const strength = useMemo(
    () =>
      PASSWORD_REQUIREMENTS.map((requirement) => ({
        met: requirement.regex.test(password),
        text: requirement.text,
      })),
    [password]
  )

  const strengthScore = strength.filter((requirement) => requirement.met).length
  const describedBy = showStrength
    ? [ariaDescribedBy, descriptionId].filter(Boolean).join(' ')
    : ariaDescribedBy

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (value === undefined) {
      setInternalValue(event.target.value)
    }

    onChange?.(event)
  }

  return (
    <div>
      <div className="relative">
        <Input
          id={inputId}
          type={isVisible ? 'text' : 'password'}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          aria-describedby={describedBy}
          className={cn('pe-9', className)}
          {...props}
        />
        <button
          aria-controls={inputId}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          aria-pressed={isVisible}
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none hover:text-foreground focus-visible:border focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => setIsVisible((visible) => !visible)}
          type="button"
        >
          {isVisible ? (
            <EyeOffIcon aria-hidden="true" className="size-4" />
          ) : (
            <EyeIcon aria-hidden="true" className="size-4" />
          )}
        </button>
      </div>

      {showStrength ? (
        <div className="mt-3">
          <div
            aria-label="Password strength"
            aria-valuemax={PASSWORD_REQUIREMENTS.length}
            aria-valuemin={0}
            aria-valuenow={strengthScore}
            className="h-1 w-full overflow-hidden rounded-full bg-border"
            role="progressbar"
            tabIndex={-1}
          >
            <div
              className={cn(
                'h-full transition-[width] duration-300 ease-out',
                getStrengthColor(strengthScore),
                getStrengthWidth(strengthScore)
              )}
            />
          </div>

          <p
            className="mt-3 mb-2 font-medium text-foreground text-sm"
            id={descriptionId}
          >
            {getStrengthText(strengthScore)}. Must contain:
          </p>

          <ul aria-label="Password requirements" className="space-y-1.5">
            {strength.map((requirement) => (
              <li className="flex items-center gap-2" key={requirement.text}>
                {requirement.met ? (
                  <CheckIcon
                    aria-hidden="true"
                    className="size-4 text-emerald-500"
                  />
                ) : (
                  <XIcon
                    aria-hidden="true"
                    className="size-4 text-muted-foreground/80"
                  />
                )}
                <span
                  className={cn(
                    'text-xs',
                    requirement.met
                      ? 'text-emerald-600'
                      : 'text-muted-foreground'
                  )}
                >
                  {requirement.text}
                  <span className="sr-only">
                    {requirement.met
                      ? ' - Requirement met'
                      : ' - Requirement not met'}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

export { PasswordInput }
