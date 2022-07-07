export function getRelevantAccountData(revenueData,
                                        segments, 
                                        salesperson, 
                                        monthYear,
                                        effectiveDate,
                                        practice) {

  return revenueData ? revenueData.filter( (item) => {
                  return (segmentCheck(item, segments) && 
                          singleSelectCheck(item.salesperson, salesperson) &&
                          singleSelectCheck(item.monthYear, monthYear) &&
                          singleSelectCheck(item.effectiveDate, effectiveDate) &&
                          singleSelectCheck(item.practice, practice))
                }) : null
};

function segmentCheck(item, segments) {
  if (segments && segments.length && segments.includes(item.segment)) {
    return true
  } else if (!segments || (segments && segments.length === 0)) {
    return true
  } else {
    return false
  }
}

function singleSelectCheck(itemField, toMatch,debug) {
  if (toMatch && itemField === toMatch) {
    if (debug && debug=="ed") {console.log(`ed match '${itemField}'=='${toMatch}'`)}
    return true
  } else if (!toMatch || toMatch=="") {
    if (debug && debug=="ed") {console.log(`ed mismatch toMatch empty'${toMatch}'`)}
    return true
  } else {
    if (debug && debug=="ed") {console.log(`ed mismatch '${itemField}'!='${toMatch}'`)}
    return false
  }
}

export function getRelevantSegments(accountData, 
                            segments, 
                            salesperson, 
                            monthYear,
                            effectiveDate) {

  let uniqueSegments = new Set()

  let revenueData = getRelevantAccountData(accountData, 
                                           segments, 
                                           salesperson, 
                                           monthYear,
                                           effectiveDate)

  revenueData.forEach(item => {
    uniqueSegments.add(item.segment)
  })

  return Array.from(uniqueSegments)
}

let options = { year: 'numeric', month: 'long', day: 'numeric' };

export function dateToString(date) {
  return new Date(date).toLocaleString('en-US',options)
}

/* 
 * get the latest effective date
*/
export function getLatestDate(allEffectiveDates) {
  return dateToString(allEffectiveDates.map((dateString) => {
    return new Date(dateString)
  }).sort().reverse()[0])
}