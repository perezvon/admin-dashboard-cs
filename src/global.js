/* eslint-disable */
import _ from 'underscore'

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
          logo: '',
          maxSpend: 250
        }
        case 7:
          return {
            companyName: 'St. Louis Park Fire',
            logo: 'slpfire.jpg',
            maxSpend: 1000
          }
    default:
      return {
        companyName: '',
        logo: '',
        maxSpend: 0
      };
  }
}
