import { ArcstackConsoleApp } from "@arcstack/console/app";
import { Command } from "@h3ravel/musket";
import { Router } from "src/core/router";

// oxlint-disable-next-line typescript/no-explicit-any
export class RouteList extends Command<ArcstackConsoleApp<any>> {
  protected signature = `route:list
        {--p|path? : Path to filter routes by}
    `;

  protected description = "List all registered routes";

  async handle () {
    console.log(Router.list(this.options()));
  }
}
