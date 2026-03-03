import { Controller } from 'clear-router';
import { HttpContext } from "clear-router/types/express";
import { Validator } from "kanun";

export class BaseController extends Controller<HttpContext> {
  // oxlint-disable-next-line typescript/no-explicit-any
  async validate<X extends Record<string, any>> (rules: X) {
    return Validator.make(this.body, rules).validate();
  }
}
