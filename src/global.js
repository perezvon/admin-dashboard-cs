/* eslint-disable */
import _ from 'underscore'

export function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function getFilterFieldName (filter) {
  switch (filter) {
    case '37':
      return 'Billing Code';
      break;
    default:
      return;
  }
}

export function getStoreID (username) {
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
    case 'minnetonkapd':
      return 15;
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

const NorthBillingCodes = {
  1: '8140 - Air Care 1 Faribault 3401 Hwy 21 #1208, 55021',
  2: '8141 - Air Care 2 Brainerd 16140 Airport Rd, 56401',
  3: '8142 - Air Care 3 Redwood Falls 601 Airport Rd 56283',
  4: '8143 - Air Care 4 Princeton 1111 19th Ave S 55371',
  5: '8144 - Air Care 5 Bemidji  4405 Hangar Rd 56601',
  6: '8145 - Air Care 6 Siren, WI  7425 Cty Rd K Hangar 22 54872',
  7: '8149 - Air Care Maintenance  5800 Crystal Airport Rd  55429',
  8: '8146 - Air Care 7 Virginia/Eveleth 4280 Miller Trunk Rd #5 Eveleth 55734',
  9: '8149 - Air Care Admin 3300 Oakdale Ave N Robbinsdale 55422',
  10: '8130 - Brainerd',
  11: '8135 - Longville',
  12: '8170 - Princeton',
  13: '8181 - Community Paramedics',
  14: '8210 - Faribault',
  15: '8215 - New Prague',
  16: '8220 - Forrest Lake',
  17: '8250 - Spooner/Shell Lake',
  18: '8270 - Webster/Burnett Co.',
  19: '8320 - Aitkin',
  20: '8330 - Redwood Falls',
  21: '8410 - Marshall',
  22: '8420 - Douglas Co./Alexandria',
  23: '8440 - Park Rapids',
  24: '8460 - Walker',
  25: '8510 - Waseca',
  26: '8520 - Minneota',
  27: '1160 - Vehicle Management',
  28: '2365 - Emergency Management',
  29: '4540 - Professional Education',
  30: '8160 - Communications Center',
  31: '8165 - Projects & Technology',
  32: '8180 - MedTrans Admin',
  33: '8260 - Medical Transportation Billing',
  34: '8110 - Metro ALS',
  35: '8150 - Metro BLS',
  36: '8120 - Metro Wheelchair',
  37: '8111 - Metro Admin.'
}

export function getCompanyInfo(id) {
  switch(id) {
    case 5:
      return {
        companyName: 'Moorhead Fire',
        logo: 'moorheadlogo.png',
        maxSpend: 500
      };
      break;
    case 6:
      return {
        companyName: 'North Memorial',
        logo: 'northmemorial.png',
        maxSpend: 0,
        filter: '37',
        filterFields: NorthBillingCodes
      }
      case 4:
        return {
          companyName: 'Anoka County Sheriff',
          logo: 'anoka.png',
          approve: true,
          maxSpend: 0
        }
      case 7:
        return {
          companyName: 'St. Louis Park Fire',
          logo: 'slpfire.jpg',
          approve: true,
          maxSpend: 0
        }
      case 8:
        return {
          companyName: 'Lake Johanna Fire',
          logo: 'lakejofire.jpg',
          maxSpend: 0
        }
      case 15:
        return {
          companyName: 'Minnetonka Police',
          logo: 'minnetonkapolice.jpg',
          approve: true,
          maxSpend: 0
        }
    default:
      return {
        companyName: '',
        logo: '',
        maxSpend: 0
      };
  }
}
