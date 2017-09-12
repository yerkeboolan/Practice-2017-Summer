declare var $: any;

interface ITicket {
    Guid: string;
    AuthorName: string;
    Password: string;
    Head: string;
    Body: string;
    Comments?: IComment[];
}

interface IComment {
    AuthorName: string;
    Message: string;
}

class HelpMeService {

    public ticketCreatedCallbacks: Array<(ticket: ITicket) => void> = [];

    public commentCreatedCallbacks: Array<(ticketId: string, comment: IComment) => void> = [];

    public loadCallbacks: Array<(tickets: ITicket[]) => void> = [];

    private service: any;

    constructor() {
        console.log('sd');
        this.service = $.connection.ticketsHub;

        this.service.client.loadTickets = (tickets: ITicket[]) => {
            this.loadCallbacks.forEach(item => {
                item(tickets);
            });
        };

        this.service.client.ticketCreated = (ticket: ITicket) => {
            this.ticketCreatedCallbacks.forEach(item => {
                item(ticket);
            });
        };
        
        this.service.client.commentCreated = (ticketId: string, comment: IComment) => {
            this.commentCreatedCallbacks.forEach(item => {
                item(ticketId, comment);
            });
        };
    }

    public Start(): void {
        $.connection.hub.start();
    }

    public createTicket(ticket: ITicket) {
        this.service.server.createTicket(ticket);
    }

    public createComment(ticketId: string, comment: IComment) {
        this.service.server.createComment(ticketId, comment);
    }

    public clear() {
        this.service.server.clear();
    }

}