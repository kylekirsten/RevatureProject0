import {Role} from '../objects/role';
class User {
    private userId: number;
    private userName: string;
    private hash: string;
    private firstName: string;
    private lastName: string;
    private email: string;
    private role: Role;

  constructor(obj: any)                                            {  // Defines the constructor for the class
      this.userId = obj.userid;
      this.userName = obj.username;
      // Don't believe password is needed in user object
      this.hash = obj.hash;
      this.firstName = obj.firstname;
      this.lastName = obj.lastname;
      this.email = obj.email;
      this.role = new Role(obj.role);
  }
    /** getUserId Function
     * Gets userid of current User instance.
     * @returns: number
     */
  public getUserId(): number {
      return this.userId;
  }
}
export {User};
