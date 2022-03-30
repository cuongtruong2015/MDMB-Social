# API route

API Endpoint |  HTTP Verb | Descrpition | Parmameter In | Return
------------ | ---------- | ----------- | ------------- | ------
/account/login | POST     | Check login | Username, Password | refreshToken, accessToken
/auth/refresh-token | POST | Create new access token | refreshToken | accessToken
/account/login-by-google | POST | Check login | token | refreshToken, accessToken
/auth/captcha | GET | Check google captcha | captcha | result (success/fail), error
/account/login-by-facebook| GET | login facebook | user | refreshToken, accessToken
/account/register | POST | Register new account | Password, Phone, Email, Name| result
/account/update | POST | Update account | Password, Phone, Email, Name Avatar, Birthday, Gender (ít nhất 1 trường Phone/ Email, còn lại gửi mấy trường cũng đc)|result 
/account/register-by-google | POST | Register new account | Phone, Email, Name| result 
/account/list-friend | GET | Get list friend | accountId | List friend
/chat/list-friend-with-last-message | GET | Get list friend with last message | accountId | List friend
/chat//list-friend-with-last-message-count-unseen | GET | Get list friend with last message and count unseen message | accountId | List friend
/chat/old-message | GET | Get lastest 10 messages | accountId, friendId | List message
/chat/older-message | GET | Get older 10 messages from messageId | accountId, friendId, messageId | List message
/chat/chat-list | GET | Get chat list | AccountId | result: "No messenger found"/[{FromAccount,ToAccount,Content,SentDateSeenDate,Type},...]
/account/account-information | GET | Get chat list | AccountId | result: "get Account infor failed"/ [{AccountId, Phone, Email, Name, Avatar, Birthday, Gender, CreatedDate,LastOnline}]
/account/account-list-searching | GET | Get search list account  | SearchKey, AccountId | result: "get Account list failed"/ result: array listAccount
/account/list-have-relationship | GET | Get search list account  | AccountId | result: "get list relationship failed"
/account/insert-relationship"| GET | Get insert/update/delete relationship  | RelatingAccountId, RelatedAccountId, Type (if Type = 'delete' then delete relationship ) required (RelatingAccountId< RelatedAccountId) | result:listAccount
/account/list-friend-recommended| GET | Get list friend recommended  | AccountId | result: array listAccount 

