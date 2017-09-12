var HelpMeService = (function () {
    function HelpMeService() {
        var _this = this;
        this.ticketCreatedCallbacks = [];
        this.commentCreatedCallbacks = [];
        this.loadCallbacks = [];
        console.log('sd');
        this.service = $.connection.ticketsHub;
        this.service.client.loadTickets = function (tickets) {
            _this.loadCallbacks.forEach(function (item) {
                item(tickets);
            });
        };
        this.service.client.ticketCreated = function (ticket) {
            _this.ticketCreatedCallbacks.forEach(function (item) {
                item(ticket);
            });
        };
        this.service.client.commentCreated = function (ticketId, comment) {
            _this.commentCreatedCallbacks.forEach(function (item) {
                item(ticketId, comment);
            });
        };
    }
    HelpMeService.prototype.Start = function () {
        $.connection.hub.start();
    };
    HelpMeService.prototype.createTicket = function (ticket) {
        this.service.server.createTicket(ticket);
    };
    HelpMeService.prototype.createComment = function (ticketId, comment) {
        this.service.server.createComment(ticketId, comment);
    };
    HelpMeService.prototype.clear = function () {
        this.service.server.clear();
    };
    return HelpMeService;
}());
