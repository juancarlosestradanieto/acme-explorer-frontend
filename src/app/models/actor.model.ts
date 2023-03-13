//import { Application } from './application';
import { Entity } from './entity.model';
//import { Finder } from './finder';
//import { Sponsorship } from './sponsorship';
//import { Trip } from './trip';

export class Actor extends Entity {
  private _email!: string;

  private _password!: string;

  private _name!: string;

  private _surname!: string;

  private _phone!: string;

  private _address!: string;

  private _validated!: boolean;

  private _role!: string[];

  //private _trips: Trip[];

  //private _applications: Application[];

  //private _finders: Finder[];

  private _ban!: boolean;

  //private _sponsorships: Sponsorship[];

  private _customToken!: string;

  private _idToken!: string;

  private _created!: Date;

  private _preferred_language!: string;

  public get email(): string {
    return this._email;
  }

  public set email(value: string) {
    this._email = value;
  }

  public get password(): string {
    return this._password;
  }

  public set password(value: string) {
    this._password = value;
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get surname(): string {
    return this._surname;
  }

  public set surname(value: string) {
    this._surname = value;
  }

  public get phone(): string {
    return this._phone;
  }

  public set phone(value: string) {
    this._phone = value;
  }

  public get address(): string {
    return this._address;
  }

  public set address(value: string) {
    this._address = value;
  }

  public get validated(): boolean {
    return this._validated;
  }

  public set validated(value: boolean) {
    this._validated = value;
  }

  public get role(): string[] {
    return this._role;
  }

  public set role(value: string[]) {
    this._role = value;
  }

  //public get trips(): Trip[] {
  //  return this._trips;
  //}

  //public set trips(value: Trip[]) {
  //  this._trips = value;
  //}

  //public get applications(): Application[] {
  //  return this._applications;
  //}

  //public set applications(value: Application[]) {
  //  this._applications = value;
  //}

  //public get finders(): Finder[] {
  //  return this._finders;
  //}

  //public set finders(value: Finder[]) {
  //  this._finders = value;
  //}

  public get ban(): boolean {
    return this._ban;
  }

  public set ban(value: boolean) {
    this._ban = value;
  }

  //public get sponsorships(): Sponsorship[] {
  //  return this._sponsorships;
  //}

  //public set sponsorships(value: Sponsorship[]) {
  //  this._sponsorships = value;
  //}

  public get customToken(): string {
    return this._customToken;
  }

  public set customToken(value: string) {
    this._customToken = value;
  }

  public get idToken(): string {
    return this._idToken;
  }

  public set idToken(value: string) {
    this._idToken = value;
  }

  public get created(): Date {
    return this._created;
  }

  public set created(value: Date) {
    this._created = value;
  }

  public get preferred_language(): string {
    return this._preferred_language;
  }

  public set preferred_language(value: string) {
    this._preferred_language = value;
  }

  constructor() {
    super();
  }
}
