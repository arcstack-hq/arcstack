/*
 * create-arkstack - A CLI tool to create Arkstack applications
 *
 * (c) Toneflix
 *
 * The Arkstack framework and all its base packages unless otherwise stated, are
 * open-sourced software licensed under the MIT license.
 */
import { Template } from './types'

/**
 * List of first party templates
 */
export const templates: Template[] = [
  {
    name: 'Express Starter Kit',
    alias: 'express',
    hint: 'An Express application starter kit',
    source: 'github:arkstack-hq/arkstack',
  },
  {
    name: 'Express Lean Starter Kit',
    alias: 'express-lean',
    hint: 'A minimal Express application starter kit',
    source: 'github:arkstack-hq/arkstack',
    lean: true,
    baseAlias: 'express',
  },
  {
    name: 'H3 Starter Kit',
    alias: 'h3',
    hint: 'A H3 application starter kit',
    source: 'github:arkstack-hq/arkstack',
  },
  {
    name: 'H3 Lean Starter Kit',
    alias: 'h3-lean',
    hint: 'A minimal H3 application starter kit',
    source: 'github:arkstack-hq/arkstack',
    lean: true,
    baseAlias: 'h3',
  },
]