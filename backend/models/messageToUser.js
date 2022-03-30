class MessageToUser {
    constructor(messageId, fromAccount, sentDate, content, type, toAccount, seenDate) {
        this.MessageId = messageId;
        this.FromAccount = fromAccount;
        this.SentDate = sentDate;
        this.Content = content;
        this.Type = type;
        this.ToAccount = toAccount;
        this.SeenDate = seenDate;
    }
}

exports.MessageToUser = MessageToUser;