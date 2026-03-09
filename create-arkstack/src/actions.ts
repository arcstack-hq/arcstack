import { Logger, Resolver } from '@h3ravel/shared'
import { copyFile, readFile, rm, unlink, writeFile } from 'node:fs/promises'
import { detectPackageManager, installPackage } from '@antfu/install-pkg'
import path, { basename, join, relative } from 'node:path'

import { Str } from '@h3ravel/support'
import { chdir } from 'node:process'
import { dependencyTemplates } from './templates'
import { downloadTemplate } from 'giget'
import { existsSync } from 'node:fs'

export default class {
  skipInstallation?: boolean

  constructor(
    private location?: string,
    private appName?: string,
    private description?: string,
  ) {
    if (!this.location) {
      this.location = join(process.cwd(), '.temp')
    }
  }

  async pm () {
    return (await detectPackageManager()) ?? 'npm'
  }

  async runCmd (npx: boolean = false) {
    if (npx) return 'npx'

    const pm = await this.pm()

    return pm === 'npm' ? 'npm run' : pm
  }

  async download (template: string, install = false, auth?: string, overwrite = false) {
    if (this.location?.includes('.temp') || (overwrite && existsSync(this.location!))) {
      await rm(this.location!, { force: true, recursive: true })
    } else if (existsSync(this.location!)) {
      console.log('\n')
      Logger.parse(
        [
          [' ERROR ', 'bgRed'],
          [this.location!, ['gray', 'italic']],
          ['is not empty.', 'white'],
        ],
        ' ',
      )
      console.log('')
      process.exit(0)
    }

    this.skipInstallation = !install
    this.removeLockFile()

    return await downloadTemplate(template, {
      dir: this.location,
      auth,
      install,
      registry: await this.pm(),
      forceClean: false,
    })
  }

  async installPackage (name: string) {
    await installPackage(name, {
      cwd: this.location,
      silent: true,
    })
  }

  async complete (installed = false) {
    console.log('')

    const installPath = './' + relative(process.cwd(), this.location!)

    try {
      chdir(path.join(process.cwd(), installPath))
    } catch {
      /** */
    }

    Logger.success('Your Arkstack project has been created successfully')
    Logger.parse(
      [
        ['cd', 'cyan'],
        [installPath, 'yellow'],
        installPath === process.cwd() ? ['✔', 'green'] : ['', 'green'],
      ],
      ' ',
    )

    if (!installed) {
      Logger.parse([[await Resolver.getPakageInstallCommand(), 'cyan']])
    }

    Logger.parse(
      [
        [await this.runCmd(), 'cyan'],
        ['dev', 'yellow'],
      ],
      ' ',
    )
    Logger.parse([
      ['Open', 'cyan'],
      ['http://localhost:3000', 'yellow'],
    ])

    console.log('')

    Logger.parse([['Have any questions', 'white']])
    // Logger.parse([
    //   ["Join our Discord server -", "white"],
    //   ["https://discord.gg/hsG2A8PuGb", "yellow"],
    // ]);
    Logger.parse([
      ['Checkout our other projects -', 'white'],
      ['https://toneflix.net/open-source', 'yellow'],
    ])
  }

  async cleanup () {
    const pkgPath = join(this.location!, 'package.json')
    const pkg = await readFile(pkgPath!, 'utf-8').then(JSON.parse)

    delete pkg.packageManager
    delete pkg.scripts.predev
    delete pkg.scripts.prebuild
    delete pkg.scripts.precmd
    delete pkg.scripts.build
    delete pkg.scripts.dev

    pkg.name = Str.slugify(
      this.appName ?? basename(this.location!).replace('.', ''), '-'
    )

    if (this.description) {
      pkg.description = this.description
    }

    for (const [name, version] of Object.entries(dependencyTemplates)) {
      pkg.dependencies[name] = version
    }

    await Promise.allSettled([
      writeFile(pkgPath, JSON.stringify(pkg, null, 2)),
      this.removeLockFile(),
      rm(join(this.location!, 'pnpm-workspace.yaml'), { force: true }),
      rm(join(this.location!, '.github'), { force: true, recursive: true }),
    ])
  }

  async removeLockFile () {
    if (!this.skipInstallation) {
      return
    }

    await Promise.allSettled([
      unlink(join(this.location!, 'package-lock.json')),
      unlink(join(this.location!, 'yarn.lock')),
      unlink(join(this.location!, 'pnpm-lock.yaml')),
    ])
  }

  async getBanner () {
    return await readFile(join(process.cwd(), './logo.txt'), 'utf-8')
  }

  async copyExampleEnv () {
    const envPath = join(this.location!, '.env')
    const exampleEnvPath = join(this.location!, '.env.example')

    if (existsSync(exampleEnvPath)) {
      await copyFile(exampleEnvPath, envPath)
    }
  }

  async makeLeanProfile (_kit: 'express' | 'h3') {
    const filesToRemove = [
      'src/app',
      'src/models',
      'database',
      'src/routes/api.ts',
      'src/core/database.ts',
      'prisma',
      'prisma.config.ts',
      'arkorm.config.ts',
      'arkormx.config.ts',
    ]

    await Promise.allSettled(
      filesToRemove.map((file) => rm(join(this.location!, file), { force: true, recursive: true })),
    )

    const pkgPath = join(this.location!, 'package.json')
    if (existsSync(pkgPath)) {
      const pkg = await readFile(pkgPath, 'utf-8').then(JSON.parse)
      const depsToRemove = [
        '@prisma/adapter-pg',
        '@prisma/client',
        'pg',
        'prisma',
        'arkormx',
        '@types/pg',
      ]

      for (const dep of depsToRemove) {
        delete pkg.dependencies?.[dep]
        delete pkg.devDependencies?.[dep]
      }

      await writeFile(pkgPath, JSON.stringify(pkg, null, 2))
    }

    const filesToPatch = [
      'src/core/app.ts',
      'src/core/utils/request-handlers.ts',
    ]

    for (const file of filesToPatch) {
      const filePath = join(this.location!, file)

      if (!existsSync(filePath)) {
        continue
      }

      let content = await readFile(filePath, 'utf-8')

      content = content
        .replace('import { prisma } from "src/core/database";\n', '')
        .replace('import { Prisma } from "@prisma/client";\n', '')
        .replace('  async shutdown () {\n    await prisma.$disconnect();\n    process.exit(0);\n  }', '  async shutdown () {\n    process.exit(0);\n  }')
        .replace(
          ' * Shuts down the application by disconnecting from the database and exiting the process.',
          ' * Shuts down the application and exits the process.',
        )
        .replace(
          /\n\s*if \((?:err|cause) instanceof Prisma\.PrismaClientKnownRequestError && (?:err|cause)\.code === "P2025"\) \{\n\s*error\.code = 404;\n\s*error\.message = `\$\{(?:err|cause)\.meta\?\.modelName\} not found!`;\n\s*\}\n/g,
          '\n',
        )

      await writeFile(filePath, content, 'utf-8')
    }

  }
}
