//import { Application } from './application';
import { Entity } from './entity.model';
//import { Finder } from './finder';
//import { Sponsorship } from './sponsorship';
import { Trip } from './trip.model';

export class Actor extends Entity {

  constructor(obj: any) 
  {
    super();
    obj && Object.assign(this, obj);
  }

  public name!: string;
  public surname!: string;
  public email!: string;
  public password!: string;
  public language!: string;
  public phone_number!: string;
  public phone!: string;
  public address!: string;
  public isActive!: boolean;
  public role!: string[];
  public deleted!: boolean;
  public deletedAt!: Date;

  public getName(): string 
  {
    return this.name;
  }

  public setName(name: string): void 
  {
    this.name = name;
  }

  public getSurname(): string 
  {
    return this.surname;
  }

  public setSurname(surname: string): void 
  {
    this.surname = surname;
  }

  public getEmail(): string 
  {
    return this.email;
  }

  public setEmail(email: string): void 
  {
    this.email = email;
  }

  public getPassword(): string 
  {
    return this.password;
  }

  public setPassword(password: string): void 
  {
    this.password = password;
  }

  public getLanguage(): string 
  {
    return this.language;
  }

  public setLanguage(language: string): void 
  {
    this.language = language;
  }

  public getPhone_number(): string 
  {
    return this.phone_number;
  }

  public setPhone_number(phone_number: string): void 
  {
    this.phone_number = phone_number;
  }

  public getAddress(): string 
  {
    return this.address;
  }

  public setAddress(address: string): void 
  {
    this.address = address;
  }

  public isIsActive(): boolean 
  {
    return this.isActive;
  }

  public setIsActive(isActive: boolean): void 
  {
    this.isActive = isActive;
  }

  public getRole(): string[] 
  {
    return this.role;
  }

  public setRole(role: string[]): void 
  {
    this.role = role;
  }

  public isDeleted(): boolean 
  {
    return this.deleted;
  }

  public setDeleted(deleted: boolean): void 
  {
    this.deleted = deleted;
  }

  public getDeletedAt(): Date 
  {
    return this.deletedAt;
  }

  public setDeletedAt(deletedAt: Date): void 
  {
    this.deletedAt = deletedAt;
  }

  public static castJsonActor(json_actor: any): Actor
  {
      let casted_actor = new Actor(json_actor);
      return casted_actor;
  }

}
