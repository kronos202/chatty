/* eslint-disable @typescript-eslint/no-explicit-any */
import { JoiRequestValidationError } from '@global/helpers/error-handler'
import { NextFunction } from 'express'
import { ObjectSchema } from 'joi'
import { Request } from 'express'
type IJoiDecorator = (target: any, key: string, descriptor: PropertyDescriptor) => void

export function joiValidation(schema: ObjectSchema): IJoiDecorator {
  return (_target: any, _key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value
    descriptor.value = async function (...args: any[]) {
      const req: Request = args[0]
      const next: NextFunction = args[2]
      const { error } = await Promise.resolve(schema.validate(req.body))
      if (error?.details) {
        return next(new JoiRequestValidationError(error.details[0].message))
      }
      return originalMethod.apply(this, args)
    }
    return descriptor
  }
}
