/* eslint-disable */
import _ from 'underscore'

export function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function getStoreID(username) {
  switch(username) {
    case 'moorhead':
      return 5;
      break;
    case 'northmemorial':
      return 6;
      break;
    case 'anokasheriff':
      return 4;
      break;
    case 'slpfire':
    case 'tsmith':
      return 7;
      break;
    case 'lakejofire':
      return 8;
      break;
    default:
      return 0;
  }
}

export function currToNumber(string) {
  return Number(string.replace(/[^0-9\.]+/g, ""))
}

export function sortCollection(collection, sortBy, reverseFlag) {
  if (reverseFlag) return _.sortBy(collection, sortBy).reverse();
  else return _.sortBy(collection, sortBy);
}

export function getCompanyInfo(id) {
  switch(id) {
    case 5:
      return {
        companyName: 'Moorhead Fire',
        logo: 'moorheadlogo.png',
        maxSpend: 500,
        filter: 'Shift'
      };
      break;
    case 6:
      return {
        companyName: 'North Memorial',
        logo: 'northmemorial.png',
        maxSpend: 1000
      }
      case 4:
        return {
          companyName: 'Anoka County Sheriff',
          logo: 'anoka.png',
          approve: true,
          maxSpend: 250
        }
      case 7:
        return {
          companyName: 'St. Louis Park Fire',
          logo: 'slpfire.jpg',
          approve: true,
          maxSpend: 1000
        }
      case 8:
        return {
          companyName: 'Lake Johanna Fire',
          logo: 'lakejofire.jpg',
          maxSpend: 150
        }
    default:
      return {
        companyName: '',
        logo: '',
        maxSpend: 0
      };
  }
}
