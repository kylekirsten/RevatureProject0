import {Role} from '../objects/role';
class User {
    userId : number;
    username : string;
    //password : string;
    firstName : string;
    lastName : string;
    email : string;
    role : Role; 

  constructor(userId : number , username : string , //password : string,
      firstName: string , lastName : string , email : string , 
      role : Role)                                            {  //Defines the constructor for the class
      this.userId = userId;
      this.username = username;
      //Don't believe password is needed in user object
      //this.password = password;
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.role = role;
  }
  //Function to retrieve userID. Returns int;
  getUserId() {
      return this.userId;
  }
  getFirstName(){
      return this.firstName;
  }
  getLastName(){
      return this.lastName;
  }
  getEmail(){
      return this.email;
  }
  getUsername(){
      return this.username;
  }
  sayHello() {  //in classes you do not need the function keyword
      return `Hello, I'm ${this.firstName} ${this.lastName}`;
  }
}
export {User};