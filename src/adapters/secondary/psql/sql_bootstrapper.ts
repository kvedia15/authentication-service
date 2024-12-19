import fs from 'fs';
import path from 'path';

export class Statement {
query: string;
private _params: any;

constructor(query: string, params: any = []) {
    this.query = query;
    this._params = params;
}

get params(): any {
    return this._params;
}

setParams(...args: any): Statement {
    this._params = args;
    return this;
}
}
export class SQLBootstrapper {
  queries: Record<string, string>;

  constructor() {
    this.queries = this.fileBootstrapper();
  }

  private fileBootstrapper(): Record<string, string> {
    const queries: Record<string, string> = {};
    const currentDir = __dirname;
    const queryBaseDir = path.join(currentDir, 'queries');

    fs.readdirSync(queryBaseDir).forEach((filename) => {
      const parts = path.parse(filename);
      const key = parts.name;

      if (parts.ext !== '.sql') {
        return;
      }

      const filePath = path.join(queryBaseDir, filename);
      const query = fs.readFileSync(filePath, 'utf8');
      queries[key] = query;
    });

    return queries;
  }

  get(name: string, params: any): Statement {
    const query = this.queries[name];
    if (!query) {
      throw new Error(`SQL for name=${name} not found in queries folder`);
    }
    return new Statement(query, params);
  }
}
