import {getPersistedValue,getStoreAccountKey} from './Store';
import {getAdjustedRevenue} from '../Data'

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

// get sums for the accounts associated with a segment
export function getSegmentSums(segment, accountData, debug) {

  let sums = new Sums()

  if (accountData) {

    // sum revenue
    sums.revenue = accountData.reduce( (sum, item) => {
      return sum + item.revenue
      }, 0)

    // sum cogs 
    sums.cogs =accountData.reduce( (sum, item) => {
      return sum + item.cogs
    }, 0)

    // sum target revenue 
    sums.targetRevenue =accountData.reduce( (sum, item) => {
      return sum + item.targetRevenue
    }, 0)

    // sum adjusted revenue
    let accountsAdjustedRevenue = accountData.reduce( (sum, item) => {

      // calc adjusted revenue across accounts
      let accountIncreaseValue = getPersistedValue(localStorage, item.segment, getStoreAccountKey(item.account,item.practice))

      return sum + parseInt(getAdjustedRevenue(item.revenue,accountIncreaseValue)) 
      }, 0
    )

    // next apply segment-level adjustment
    let segmentIncreaseValue = getPersistedValue(localStorage, segment)

    sums.adjustedRevenue = parseInt(getAdjustedRevenue(accountsAdjustedRevenue,segmentIncreaseValue))      
  }

  return sums
}
