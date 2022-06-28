export const commands = new Map<string, CommandHandler>();

export type CommandHandler<T extends object = any> = (id: string, data: T) => Promise<any>;
