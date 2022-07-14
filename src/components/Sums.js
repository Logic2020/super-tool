import {getPersistedValue,getStoreAccountKey,getStoreProjectKey, ALL_ACCOUNTS} from './Store';
import {getAdjustedRevenue} from '../components/Data'

export class Sums {
  constructor(revenue,targetRevenue,adjustedRevenue,cogs) {
    this.segments = [];
    this.revenue = revenue ? revenue: 0;
    this.targetRevenue = targetRevenue ? targetRevenue: 0;
    this.adjustedRevenue = adjustedRevenue ? adjustedRevenue: 0;
    this.cogs = cogs ? cogs: 0;
  }

  add(sums) {
    this.segments.concat(sums.segments)
    this.revenue += sums.revenue
    this.cogs += sums.cogs
    this.targetRevenue += sums.targetRevenue
    this.adjustedRevenue += sums.adjustedRevenue
  }

  toString() {
    return `revenue: ${this.revenue}, adjustedRevenue: ${this.adjustedRevenue}`
  }
}

// get sums for the rows associated with a segment
export function getSegmentSums(segment, rows, monthYear, debug) {

  let sums = new Sums()

  // get account objects 
  let accounts = getAccounts(rows)

  accounts.forEach(accountObj => {
    // isolate the rows for this account and practice
    let accountRows = rows.filter(item => {
      return item.account === accountObj.name && item.practice === accountObj.practice
    })

    sums.add(getAccountSums(accountRows, 
                            segment, 
                            accountObj.name, 
                            accountObj.practice, 
                            monthYear, 
                            "account"))
  });

  // next apply segment-level adjustment
  let segmentIncreaseValue = getPersistedValue(localStorage, 
                                                segment, 
                                                ALL_ACCOUNTS,
                                                monthYear)

  sums.adjustedRevenue = parseInt(getAdjustedRevenue(sums.adjustedRevenue,segmentIncreaseValue))

  return sums
}

// get sums for the rows associated with the accounts in a segment
export function getAccountSums(rows, segment, account, practice, monthYear, debug) {

  let sums = getProjectSums(rows, monthYear, debug)

  // next apply account-level adjustments
  let accountIncreaseValue = 
                getPersistedValue(localStorage, 
                                  segment, 
                                  getStoreAccountKey(account,practice),
                                  monthYear)


  sums.adjustedRevenue = parseInt(getAdjustedRevenue(sums.adjustedRevenue,accountIncreaseValue)) 
    
  return sums;
}

  // get sums for the rows associated with the projects in an account
function getProjectSums(rows, monthYear, debug) {

  let sums = new Sums()

  if (rows) {

    // sum revenue
    sums.revenue = rows.reduce( (sum, item) => {
      return sum + item.revenue
      }, 0)

    // sum cogs 
    sums.cogs =rows.reduce( (sum, item) => {
      return sum + item.cogs
    }, 0)

    // sum target revenue 
    sums.targetRevenue =rows.reduce( (sum, item) => {
      return sum + item.targetRevenue
    }, 0)

    // sum adjusted revenue
    sums.adjustedRevenue = rows.reduce( (sum, item) => {

      // calc adjusted revenue across accounts
      let accountIncreaseValue = 
                getPersistedValue(localStorage, 
                                  item.segment, 
                                  getStoreProjectKey(item.account,item.practice,item.projectNumber),
                                  monthYear)

      return sum + parseInt(getAdjustedRevenue(item.revenue,accountIncreaseValue)) 
      }, 0
    )     
  }

  return sums
}

export function getAccounts(rows) {

  let uniqueAccounts = new Set()

  rows.forEach(item => {
    uniqueAccounts.add(`${item.account}/${item.practice}`)
  })

  return Array.from(uniqueAccounts).map(item => {
    let [account, practice] = item.split("/")
    return { 
      name: account,
      practice: practice,
    }})
}