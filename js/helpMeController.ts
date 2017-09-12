declare var angular: any;

enum HelpMeControllerState {
    Start = 0,
    List = 1,
    Create = 2,
    Detail = 3
}

class HelpMeController {

    public state: HelpMeControllerState = HelpMeControllerState.Start;

    public user = { name: "" };

    public pw = {password: ""};

    public tickets: ITicket[] = [];

    public selectedTicket: ITicket;

    public nwTicket: ITicket;

    public nwComment: string = "";

    static $inject = ['$scope', 'helpMeService'];
    constructor(private $scope: any, private helpMeService: HelpMeService) {

    }

    public init() {

        this.helpMeService.loadCallbacks.push((tickets) => {
            console.log('loaded!');
            this.tickets = tickets;
            this.$scope.$apply();
        });

        this.helpMeService.ticketCreatedCallbacks.push((ticket) => {
            this.tickets.push(ticket);
            this.$scope.$apply();
        });
        this.helpMeService.commentCreatedCallbacks.push((ticketId, comment) => {
            var item = this.tickets.filter(x => x.Guid == ticketId)[0];
            item.Comments.push(comment);
            this.$scope.$apply();
        });
    }

    public login() {
        if (this.pw.password != '' && this.user.name != '') {
            this.state = HelpMeControllerState.List;
            this.helpMeService.Start();
        }
    }

    public create() {
        this.state = HelpMeControllerState.Create;
        this.selectedTicket = null;
        this.clear();
    }

    public select(item: ITicket) {
        if (this.state != HelpMeControllerState.Detail) {
            this.selectedTicket = item;
            this.state = HelpMeControllerState.Detail;
        }
        else {
            this.selectedTicket = null;
            this.state = HelpMeControllerState.List;
            this.clear();
        }
    }

    public submit() {
        
        
        this.nwTicket.AuthorName = this.user.name;
        this.helpMeService.createTicket(this.nwTicket);

        this.state = HelpMeControllerState.List;
        this.clear();
    }

    public createComment() {
        let id = this.selectedTicket.Guid;
        this.helpMeService.createComment(id, {
            AuthorName: this.user.name,
         //   Password: this.pw.password,
            Message: this.nwComment
        });
        this.clear();
    }

    private clear() {
        this.nwTicket = {
            Guid: '',
            Head: '',
            AuthorName: '',
            Password: '',
            Body: '',
            Comments: []
        };
        this.nwComment = "";
    }

    public deleteAll() {
        this.helpMeService.clear();
        this.state = HelpMeControllerState.List;
    }

    public delete(index: number) {
        this.state = HelpMeControllerState.List;
        this.tickets.splice(index, 1);
        this.clear()
    }

}
