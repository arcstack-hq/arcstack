import { Controller } from 'clear-router';
import { HttpContext } from "clear-router/types/h3";
import { Validator } from "kanun";

export default class BaseController extends Controller<HttpContext> {
  async validate<X extends Record<string, any>> (rules: X) {
    return Validator.make(this.body, rules).validate();
  }
}
