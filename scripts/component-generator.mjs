import { resolve } from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import { getCssStringFromCommittee, generateCommittee } from './lib.mjs';
import { committee } from './global-variables.js';

// .env config
dotenv.config({ path: '.env.local' });
const SPREADSHEET_ID = process.env.LANDING_SPREADSHEET_ID;
const SERVICE_ACCOUNT = process.env.SERVICE_ACCOUNT ?? '';

//Grab main information to be displayed
//and write to output.json
async function getComponentInfo(name) {
  const committees = await getGoogleSheetData('committee info!A:J');
  const committee = [];
  //get committee
  // console.log(committees);
  for (const row of committees) {
    //Skip header rows and example
    if (
      row.length < 5 ||
      row[0] === 'Committee' ||
      row[0].includes('Example:') ||
      row[0] != name
    ) {
      continue;
    }
    try {
      const committeeData = generateCommittee({
        committee: row[0],
        name: row[1],
        subtitle: row[2],
        description: row[3],
        logoLink: row[4],
        dcLink: row[5],
        igLink: row[6],
        email: row[7],
        favicon: row[8],
        backgroundImg: row[9],
      });
      committee.push(committeeData);
    } catch (err) {
      console.error(`Error ${err} on committee ${row}`);
    }
  }

  // Write committee data to JSON file
  fs.writeFile('./public/output.json', JSON.stringify(committee), (err) => {
    if (err) throw err;
    console.log('Output successfully saved to output.json');
  });

  return committee;
}

////////////////////////////////////////////////////////
// Helper Functions
////////////////////////////////////////////////////////

// Read data from Google sheets
// using sheet range (eg: 'Week 1!A:H)
async function getGoogleSheetData(range) {
  const sheets = google.sheets({ version: 'v4' });

  // Get JWT Token to access sheet
  // console.log(SERVICE_ACCOUNT);
  const service_account = JSON.parse(SERVICE_ACCOUNT);
  const jwtClient = new google.auth.JWT(
    service_account.client_email,
    '',
    service_account.private_key,
    ['https://www.googleapis.com/auth/spreadsheets'],
  );
  jwtClient.authorize(function (err) {
    if (err) {
      throw err;
    }
  });

  // Get data from Google spreadsheets
  const res = await sheets.spreadsheets.values.get({
    auth: jwtClient,
    spreadsheetId: SPREADSHEET_ID,
    range: range,
  });
  const rows = res?.data.values;
  if (!rows || rows.length == 0) {
    console.log('Error: no data found');
    return [];
  }

  // // Replacing the new lines with <br/> (doesnt work tho)
  // const formatRows = rows.map((row) => row.map( (r) => r.replace(/\n/g, '<br/>')));
  // return formatRows;

  return rows;
}

getComponentInfo(committee)
  .then((committee) => {
    // Process the committee data or perform any other actions
    console.log(committee);
  })
  .catch((error) => {
    console.error('Error generating component info:', error);
  });

export default getComponentInfo;
