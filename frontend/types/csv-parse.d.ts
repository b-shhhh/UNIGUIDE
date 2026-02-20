declare module "csv-parse/sync" {
  type Options = {
    columns?: boolean | string[];
    skip_empty_lines?: boolean;
    [key: string]: unknown;
  };

  export function parse(input: string, options?: Options): any;
}
