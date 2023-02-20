export function getGeneratedHeader(filename: string): string {
  return `
/*
  Valkyr Generator

  The following is an auto generated ${filename}.ts file which contains the results of
  consuming ${filename} configuration and outputting the result to this file.

  See https://docs.valkyrjs.com for more information.

  This file will override any manual changes made here, so no need to edit!
*/
  `;
}
