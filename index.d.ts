export const version: string;

export interface CommandOptions{
    guildOnly?: boolean;
    guildID?: string;
    data: {
        name: string;
        description?: string;
        type?: number;
        content: string;
    }
}

export class Slash{

    public client: any;
    public axios: any;

    public constructor(client: any);

    public command(options: CommandOptions): Slash;

}
