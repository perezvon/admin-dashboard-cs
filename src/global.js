/* eslint-disable */
import _ from 'underscore';

export function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function getFilterFieldName(filter) {
  switch (filter) {
    case '37':
      return 'Billing Code';
      break;
    default:
      return;
  }
}

export function getStoreID(username) {
  switch (username) {
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
    case 'superadmin':
    case 'minnetonkapd':
      return 15;
      break;
    case 'airguard':
      return 17;
      break;
    case 'blainepd':
      return 20;
      break;
    case 'hennepinems':
      return 14;
      break;
    case 'chaskafire':
      return 16;
      break;
    case 'farmingtonfire':
      return 18;
      break;
    case 'bpfire':
      return 21;
      break;
    case 'ighpd':
    case 'invergrove':
      return 23;
      break;
    case 'allinaems':
      return 13;
      break;
    case 'northsecurity':
      return 28;
      break;
    case 'workhouse':
      return 29;
      break;
    case 'allinasecurity':
      return 31;
      break;
    case 'goldenvalleypd':
      return 36;
      break;
    case 'coonrapidsfire':
      return 39;
      break;
    default:
      return 0;
  }
}

export function currToNumber(string) {
  return Number(string.replace(/[^0-9\.]+/g, ''));
}

export function sortCollection(collection, sortBy, reverseFlag) {
  if (reverseFlag) return _.sortBy(collection, sortBy).reverse();
  else return _.sortBy(collection, sortBy);
}

const NorthBillingCodes = {
  0: '8140 - Air Care 1 Faribault 3401 Hwy 21 #1208, 55021',
  1: '8141 - Air Care 2 Brainerd 16140 Airport Rd, 56401',
  2: '8142 - Air Care 3 Redwood Falls 601 Airport Rd 56283',
  3: '8143 - Air Care 4 Princeton 1111 19th Ave S 55371',
  4: '8144 - Air Care 5 Bemidji  4405 Hangar Rd 56601',
  5: '8145 - Air Care 6 Siren, WI  7425 Cty Rd K Hangar 22 54872',
  6: '8149 - Air Care Maintenance  5800 Crystal Airport Rd  55429',
  7: '8146 - Air Care 7 Virginia/Eveleth 4280 Miller Trunk Rd #5 Eveleth 55734',
  8: '8149 - Air Care Admin 3300 Oakdale Ave N Robbinsdale 55422',
  9: '8130 - Brainerd',
  10: '8135 - Longville',
  11: '8170 - Princeton',
  12: '8181 - Community Paramedics',
  13: '8210 - Faribault',
  14: '8215 - New Prague',
  15: '8220 - Forrest Lake',
  16: '8250 - Spooner/Shell Lake',
  17: '8270 - Webster/Burnett Co.',
  18: '8320 - Aitkin',
  19: '8330 - Redwood Falls',
  20: '8410 - Marshall',
  21: '8420 - Douglas Co./Alexandria',
  22: '8440 - Park Rapids',
  23: '8460 - Walker',
  24: '8510 - Waseca',
  25: '8520 - Minneota',
  26: '1160 - Vehicle Management',
  27: '2365 - Emergency Management',
  28: '4540 - Professional Education',
  29: '8160 - Communications Center',
  30: '8165 - Projects & Technology',
  31: '8180 - MedTrans Admin',
  32: '8260 - Medical Transportation Billing',
  33: '8110 - Metro ALS',
  34: '8150 - Metro BLS',
  35: '8120 - Metro Wheelchair',
  36: '8111 - Metro Admin.',
};

export function getCompanyInfo(id) {
  switch (id) {
    case 5:
      return {
        companyName: 'Moorhead Fire',
        logo: 'moorheadlogo.png',
        maxSpend: 500,
      };
      break;
    case 6:
      return {
        companyName: 'North Memorial',
        logo: 'northmemorial.png',
        maxSpend: 0,
        filter: '37',
        filterFields: NorthBillingCodes,
      };
    case 4:
      return {
        companyName: 'Anoka County Sheriff',
        logo: 'anoka.png',
        maxSpend: 0,
      };
    case 7:
      return {
        companyName: 'St. Louis Park Fire',
        logo: 'slpfire.jpg',
        approve: true,
        maxSpend: 0,
      };
    case 8:
      return {
        companyName: 'Lake Johanna Fire',
        logo: 'lakejofire.jpg',
        maxSpend: 0,
      };
    case 13:
      return {
        companyName: 'Allina EMS',
        logo: 'allina.gif',
        maxSpend: 0,
      };
    case 14:
      return {
        companyName: 'Hennepin EMS',
        logo: 'hennepinems.png',
        maxSpend: 0,
      };
    case 15:
      return {
        companyName: 'Minnetonka Police',
        logo: 'minnetonkapolice.jpg',
        approve: true,
        maxSpend: 0,
      };
    case 16:
      return {
        companyName: 'Chaska Fire Department',
        logo: 'chaskafire.jpg',
        maxSpend: 0,
      };
    case 17:
      return {
        companyName: 'Air Guard Fire',
        logo: 'airguard.jpg',
        maxSpend: 0,
      };
    case 18:
      return {
        companyName: 'Farmington Fire',
        logo: 'farmingtonfire.jpg',
        maxSpend: 0,
      };
    case 20:
      return {
        companyName: 'Blaine Police Department',
        logo: 'blainepd.png',
        approve: true,
        maxSpend: 0,
      };
    case 21:
      return {
        companyName: 'Brooklyn Park Fire',
        logo: 'bpfire.jpg',
        maxSpend: 0,
      };
    case 23:
      return {
        companyName: 'Inver Grove Heights Police Department',
        logo: 'ighpd.jpg',
        approve: true,
        maxSpend: 0,
      };
    case 28:
      return {
        companyName: 'North Memorial Security',
        logo: 'northmemorial.png',
        maxSpend: 0,
      };
    case 29:
      return {
        companyName: 'Anoka County Corrections Workhouse',
        logo: 'anokaworkhouse.jpg',
        maxSpend: 0,
      };
    case 31:
      return {
        companyName: 'Allina Security',
        logo: 'allina.gif',
        maxSpend: 0,
      };
    case 36:
      return {
        companyName: 'Golden Valley PD',
        logo: 'gvpd.jpg',
        maxSpend: 0,
      };
    case 39:
      return {
        companyName: 'Coon Rapids Fire Department',
        logo: 'crfd.jpg',
        maxSpend: 0,
      };
    default:
      return {
        companyName: '',
        logo: '',
        maxSpend: 0,
      };
  }
}
