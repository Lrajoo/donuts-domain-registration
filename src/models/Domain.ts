import moment from 'moment'
import { observable } from 'mobx';

export type periodUnit = 'year' 
export type verifiedProvider = 'provider-abc' | 'provider-pqr' | 'provider-xyz'

export class Domain {
  name: string;
  registeredDate: moment.Moment;
  period: {
    value: number,
    unit: periodUnit
  };
  @observable contact: {
  provider: verifiedProvider,
   id: string
 };

  constructor(name: string = "", registerdDate: moment.Moment = moment(), period: any = {value: 0, unit: 'year'}, contact: any = {provider: 'provider-abc', id: ''}) {
    this.name = name;
    this.registeredDate = registerdDate;
    this.period = period;
    this.contact = contact
  }
}
