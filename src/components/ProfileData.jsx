import React from "react";

/**
 * Renders information about the user obtained from MS Graph
 * @param props 
 */
export const ProfileData = (props) => {

    if (props.accountData && props.accountData.results[0] && props.accountData.results[0].tables[0] &&
      props.accountData.results[0].tables[0].rows) {
      return (
        <table>
          <tbody>
            <tr>
              <th>Account</th>
              <th>Practice</th>
              <th>Segment</th>
              <th>Salesperson</th>
            </tr>
            {props.accountData.results[0].tables[0].rows.map( item => {
              return (
                <tr>
                  <td>{item["segmentation[Account]"]}</td>
                  <td>{item["segmentation[Practice Area]"]}</td>
                  <td>{item["segmentation[Segmentation]"]}</td>
                  <td>{item["segmentation[Salesperson]"]}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )

    } else {
      return (
        <h3>sad trombone - looks like you don't have read privies on the dataset</h3>
      )
    }
};