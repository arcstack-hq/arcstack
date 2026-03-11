import { RulesForData, Validator } from 'kanun'

import { Controller } from 'clear-router'
import { HttpContext } from 'clear-router/types/express'

export class BaseController extends Controller<HttpContext> {
  async validate<D extends Record<string, any>, R extends RulesForData<D>> (rules: R) {
    return Validator.make(this.body, rules).validate()
  }
}